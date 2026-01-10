import { eq, and, gte, lte, desc, asc, between, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  workspaces,
  workspaceMembers,
  categories,
  expenses,
  incomes,
  budgets,
  savingsGoals,
  billReminders,
  loans,
  subscriptions,
  auditLogs,
  aiConversations,
  tasks,
  invoices,
  notifications,
  sheetsSyncLogs,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "avatar", "whatsappPhoneNumber"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Workspace queries
export async function createWorkspace(ownerId: number, name: string, currency: string = "USD") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(workspaces).values({
    ownerId,
    name,
    currency,
  });

  return result;
}

export async function getUserWorkspaces(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(workspaces)
    .where(eq(workspaces.ownerId, userId));
}

// Category queries
export async function createDefaultCategories(workspaceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const expenseCategories = [
    { name: "Food & Groceries", icon: "🍔", color: "#FF6B6B" },
    { name: "Transportation", icon: "🚗", color: "#4ECDC4" },
    { name: "Entertainment", icon: "🎬", color: "#95E1D3" },
    { name: "Utilities", icon: "💡", color: "#FFD93D" },
    { name: "Healthcare", icon: "⚕️", color: "#6BCB77" },
    { name: "Shopping", icon: "🛍️", color: "#FF6B9D" },
    { name: "Dining", icon: "🍽️", color: "#FFA502" },
    { name: "Other", icon: "📌", color: "#A8DADC" },
  ];

  const incomeCategories = [
    { name: "Salary", icon: "💼", color: "#2A9D8F" },
    { name: "Freelance", icon: "💻", color: "#E76F51" },
    { name: "Investment", icon: "📈", color: "#F4A261" },
    { name: "Bonus", icon: "🎁", color: "#E9C46A" },
    { name: "Other", icon: "📌", color: "#2A9D8F" },
  ];

  const allCategories = [
    ...expenseCategories.map((cat) => ({
      workspaceId,
      type: "expense" as const,
      ...cat,
      isDefault: true,
    })),
    ...incomeCategories.map((cat) => ({
      workspaceId,
      type: "income" as const,
      ...cat,
      isDefault: true,
    })),
  ];

  return db.insert(categories).values(allCategories);
}

// Expense queries
export async function createExpense(
  workspaceId: number,
  userId: number,
  categoryId: number,
  amount: string,
  description: string,
  transactionDate: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(expenses).values({
    workspaceId,
    userId,
    categoryId,
    amount,
    description,
    transactionDate,
    status: "completed",
  });
}

export async function getWorkspaceExpenses(workspaceId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(expenses)
    .where(eq(expenses.workspaceId, workspaceId))
    .orderBy(desc(expenses.transactionDate))
    .limit(limit);
}

export async function getMonthlyExpenseTotal(workspaceId: number, year: number, month: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const result = await db
    .select({
      total: sql<string>`SUM(amount)`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.workspaceId, workspaceId),
        between(expenses.transactionDate, startDate, endDate)
      )
    );

  return result[0]?.total ? parseFloat(result[0].total) : 0;
}

// Income queries
export async function createIncome(
  workspaceId: number,
  userId: number,
  categoryId: number,
  amount: string,
  description: string,
  transactionDate: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(incomes).values({
    workspaceId,
    userId,
    categoryId,
    amount,
    description,
    transactionDate,
    status: "completed",
  });
}

export async function getMonthlyIncomeTotal(workspaceId: number, year: number, month: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const result = await db
    .select({
      total: sql<string>`SUM(amount)`,
    })
    .from(incomes)
    .where(
      and(
        eq(incomes.workspaceId, workspaceId),
        between(incomes.transactionDate, startDate, endDate)
      )
    );

  return result[0]?.total ? parseFloat(result[0].total) : 0;
}

// Budget queries
export async function createBudget(
  workspaceId: number,
  categoryId: number,
  limit: string,
  period: string,
  startDate: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(budgets).values({
    workspaceId,
    categoryId,
    limit,
    period: period as any,
    startDate,
    isActive: true,
  });
}

export async function getWorkspaceBudgets(workspaceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(budgets)
    .where(and(eq(budgets.workspaceId, workspaceId), eq(budgets.isActive, true)));
}

// Savings Goals queries
export async function createSavingsGoal(
  workspaceId: number,
  userId: number,
  name: string,
  targetAmount: string,
  targetDate: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(savingsGoals).values({
    workspaceId,
    userId,
    name,
    targetAmount,
    targetDate,
    status: "active",
  });
}

export async function getWorkspaceSavingsGoals(workspaceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(savingsGoals)
    .where(and(eq(savingsGoals.workspaceId, workspaceId), eq(savingsGoals.status, "active")));
}

// Bill Reminders queries
export async function createBillReminder(
  workspaceId: number,
  userId: number,
  name: string,
  amount: string,
  dueDate: Date,
  frequency: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(billReminders).values({
    workspaceId,
    userId,
    name,
    amount,
    dueDate,
    frequency: frequency as any,
    status: "pending",
  });
}

export async function getUpcomingBillReminders(workspaceId: number, daysAhead: number = 7) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const today = new Date();
  const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  return db
    .select()
    .from(billReminders)
    .where(
      and(
        eq(billReminders.workspaceId, workspaceId),
        between(billReminders.dueDate, today, futureDate),
        eq(billReminders.status, "pending")
      )
    )
    .orderBy(asc(billReminders.dueDate));
}

// Audit Log queries
export async function logAuditEvent(
  workspaceId: number,
  userId: number,
  action: string,
  entityType?: string,
  entityId?: number,
  changes?: any
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(auditLogs).values({
    workspaceId,
    userId,
    action,
    entityType,
    entityId,
    changes,
  });
}

// Notification queries
export async function createNotification(
  workspaceId: number,
  userId: number,
  type: string,
  title: string,
  message: string,
  data?: any
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(notifications).values({
    workspaceId,
    userId,
    type,
    title,
    message,
    data,
    isRead: false,
  });
}

export async function getUserUnreadNotifications(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
    .orderBy(desc(notifications.createdAt));
}

// AI Conversation queries
export async function createAIConversation(workspaceId: number, userId: number, title?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(aiConversations).values({
    workspaceId,
    userId,
    title,
    messages: [],
  });
}

export async function getWorkspaceAIConversations(workspaceId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(aiConversations)
    .where(eq(aiConversations.workspaceId, workspaceId))
    .orderBy(desc(aiConversations.updatedAt))
    .limit(limit);
}

// Task queries
export async function createTask(
  workspaceId: number,
  userId: number,
  title: string,
  description?: string,
  dueDate?: Date,
  priority: string = "medium"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(tasks).values({
    workspaceId,
    userId,
    title,
    description,
    dueDate,
    priority: priority as any,
    status: "pending",
  });
}

export async function getWorkspaceTasks(workspaceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(tasks)
    .where(eq(tasks.workspaceId, workspaceId))
    .orderBy(asc(tasks.dueDate));
}

// Invoice queries
export async function createInvoice(
  workspaceId: number,
  userId: number,
  vendor: string,
  amount: string,
  invoiceDate: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(invoices).values({
    workspaceId,
    userId,
    vendor,
    amount,
    invoiceDate,
    status: "pending",
  });
}

export async function getWorkspaceInvoices(workspaceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(invoices)
    .where(eq(invoices.workspaceId, workspaceId))
    .orderBy(desc(invoices.createdAt));
}

// Sheets Sync Log queries
export async function logSheetsSync(
  workspaceId: number,
  userId: number,
  syncType: string,
  status: string,
  recordsProcessed: number = 0,
  errorMessage?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(sheetsSyncLogs).values({
    workspaceId,
    userId,
    syncType,
    status: status as any,
    recordsProcessed,
    errorMessage,
  });
}
