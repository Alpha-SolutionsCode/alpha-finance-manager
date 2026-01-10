import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  datetime,
  longtext,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with financial management fields.
 */
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }).unique(),
    avatar: text("avatar"),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    userRole: mysqlEnum("userRole", ["owner", "family", "accountant", "admin"]).default("owner").notNull(),
    googleAccessToken: longtext("googleAccessToken"),
    googleRefreshToken: longtext("googleRefreshToken"),
    googleSheetId: varchar("googleSheetId", { length: 255 }),
    whatsappPhoneNumber: varchar("whatsappPhoneNumber", { length: 20 }),
    whatsappVerified: boolean("whatsappVerified").default(false),
    defaultCurrency: varchar("defaultCurrency", { length: 3 }).default("USD"),
    timezone: varchar("timezone", { length: 64 }).default("UTC"),
    preferences: json("preferences"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    openIdIdx: index("openId_idx").on(table.openId),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Workspace/Account table for multi-user collaboration
 */
export const workspaces = mysqlTable(
  "workspaces",
  {
    id: int("id").autoincrement().primaryKey(),
    ownerId: int("ownerId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    currency: varchar("currency", { length: 3 }).default("USD"),
    googleSheetId: varchar("googleSheetId", { length: 255 }),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    ownerIdx: index("workspace_owner_idx").on(table.ownerId),
  })
);

export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = typeof workspaces.$inferInsert;

/**
 * Workspace members with role-based access
 */
export const workspaceMembers = mysqlTable(
  "workspaceMembers",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    role: mysqlEnum("role", ["owner", "family", "accountant", "admin"]).notNull(),
    permissions: json("permissions"),
    invitedAt: timestamp("invitedAt").defaultNow().notNull(),
    joinedAt: timestamp("joinedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("workspace_member_idx").on(table.workspaceId),
    userIdx: index("user_member_idx").on(table.userId),
  })
);

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type InsertWorkspaceMember = typeof workspaceMembers.$inferInsert;

/**
 * Expense categories
 */
export const categories = mysqlTable(
  "categories",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    type: mysqlEnum("type", ["expense", "income"]).notNull(),
    icon: varchar("icon", { length: 50 }),
    color: varchar("color", { length: 7 }),
    isDefault: boolean("isDefault").default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("category_workspace_idx").on(table.workspaceId),
  })
);

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Expense transactions
 */
export const expenses = mysqlTable(
  "expenses",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    categoryId: int("categoryId").notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    description: text("description"),
    vendor: varchar("vendor", { length: 255 }),
    receiptUrl: text("receiptUrl"),
    receiptData: json("receiptData"),
    tags: json("tags"),
    isRecurring: boolean("isRecurring").default(false),
    recurringFrequency: mysqlEnum("recurringFrequency", ["daily", "weekly", "monthly", "yearly"]),
    nextOccurrence: datetime("nextOccurrence"),
    status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("completed"),
    transactionDate: datetime("transactionDate").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("expense_workspace_idx").on(table.workspaceId),
    userIdx: index("expense_user_idx").on(table.userId),
    categoryIdx: index("expense_category_idx").on(table.categoryId),
    dateIdx: index("expense_date_idx").on(table.transactionDate),
  })
);

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

/**
 * Income transactions
 */
export const incomes = mysqlTable(
  "incomes",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    categoryId: int("categoryId").notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    description: text("description"),
    source: varchar("source", { length: 255 }),
    tags: json("tags"),
    isRecurring: boolean("isRecurring").default(false),
    recurringFrequency: mysqlEnum("recurringFrequency", ["daily", "weekly", "monthly", "yearly"]),
    nextOccurrence: datetime("nextOccurrence"),
    status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("completed"),
    transactionDate: datetime("transactionDate").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("income_workspace_idx").on(table.workspaceId),
    userIdx: index("income_user_idx").on(table.userId),
    categoryIdx: index("income_category_idx").on(table.categoryId),
    dateIdx: index("income_date_idx").on(table.transactionDate),
  })
);

export type Income = typeof incomes.$inferSelect;
export type InsertIncome = typeof incomes.$inferInsert;

/**
 * Budget management
 */
export const budgets = mysqlTable(
  "budgets",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    categoryId: int("categoryId").notNull(),
    limit: decimal("limit", { precision: 15, scale: 2 }).notNull(),
    period: mysqlEnum("period", ["daily", "weekly", "monthly", "yearly"]).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    alertThreshold: int("alertThreshold").default(80),
    isActive: boolean("isActive").default(true),
    notes: text("notes"),
    startDate: datetime("startDate").notNull(),
    endDate: datetime("endDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("budget_workspace_idx").on(table.workspaceId),
    categoryIdx: index("budget_category_idx").on(table.categoryId),
  })
);

export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = typeof budgets.$inferInsert;

/**
 * Savings goals
 */
export const savingsGoals = mysqlTable(
  "savingsGoals",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    targetAmount: decimal("targetAmount", { precision: 15, scale: 2 }).notNull(),
    currentAmount: decimal("currentAmount", { precision: 15, scale: 2 }).default("0"),
    currency: varchar("currency", { length: 3 }).default("USD"),
    targetDate: datetime("targetDate"),
    priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium"),
    autoContribute: boolean("autoContribute").default(false),
    autoContributeAmount: decimal("autoContributeAmount", { precision: 15, scale: 2 }),
    autoContributeFrequency: mysqlEnum("autoContributeFrequency", ["daily", "weekly", "monthly"]),
    status: mysqlEnum("status", ["active", "paused", "completed"]).default("active"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("goal_workspace_idx").on(table.workspaceId),
    userIdx: index("goal_user_idx").on(table.userId),
  })
);

export type SavingsGoal = typeof savingsGoals.$inferSelect;
export type InsertSavingsGoal = typeof savingsGoals.$inferInsert;

/**
 * Bill reminders and recurring payments
 */
export const billReminders = mysqlTable(
  "billReminders",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    categoryId: int("categoryId"),
    name: varchar("name", { length: 255 }).notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    dueDate: datetime("dueDate").notNull(),
    frequency: mysqlEnum("frequency", ["once", "weekly", "monthly", "yearly"]).notNull(),
    nextReminderDate: datetime("nextReminderDate"),
    reminderDaysBefore: int("reminderDaysBefore").default(1),
    status: mysqlEnum("status", ["pending", "paid", "overdue", "cancelled"]).default("pending"),
    paidDate: datetime("paidDate"),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("reminder_workspace_idx").on(table.workspaceId),
    userIdx: index("reminder_user_idx").on(table.userId),
    dueDateIdx: index("reminder_duedate_idx").on(table.dueDate),
  })
);

export type BillReminder = typeof billReminders.$inferSelect;
export type InsertBillReminder = typeof billReminders.$inferInsert;

/**
 * Loans and EMI tracking
 */
export const loans = mysqlTable(
  "loans",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    lenderName: varchar("lenderName", { length: 255 }),
    principalAmount: decimal("principalAmount", { precision: 15, scale: 2 }).notNull(),
    interestRate: decimal("interestRate", { precision: 5, scale: 2 }),
    currency: varchar("currency", { length: 3 }).default("USD"),
    startDate: datetime("startDate").notNull(),
    endDate: datetime("endDate"),
    emiAmount: decimal("emiAmount", { precision: 15, scale: 2 }),
    emiFrequency: mysqlEnum("emiFrequency", ["weekly", "monthly", "quarterly"]).default("monthly"),
    totalEmiPaid: int("totalEmiPaid").default(0),
    totalEmiRemaining: int("totalEmiRemaining"),
    status: mysqlEnum("status", ["active", "completed", "defaulted"]).default("active"),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("loan_workspace_idx").on(table.workspaceId),
    userIdx: index("loan_user_idx").on(table.userId),
  })
);

export type Loan = typeof loans.$inferSelect;
export type InsertLoan = typeof loans.$inferInsert;

/**
 * Subscriptions tracking
 */
export const subscriptions = mysqlTable(
  "subscriptions",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    categoryId: int("categoryId"),
    name: varchar("name", { length: 255 }).notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    billingCycle: mysqlEnum("billingCycle", ["daily", "weekly", "monthly", "yearly"]).notNull(),
    nextBillingDate: datetime("nextBillingDate").notNull(),
    startDate: datetime("startDate").notNull(),
    endDate: datetime("endDate"),
    status: mysqlEnum("status", ["active", "paused", "cancelled"]).default("active"),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("subscription_workspace_idx").on(table.workspaceId),
    userIdx: index("subscription_user_idx").on(table.userId),
    nextBillingIdx: index("subscription_nextbilling_idx").on(table.nextBillingDate),
  })
);

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Audit logs for tracking user actions
 */
export const auditLogs = mysqlTable(
  "auditLogs",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    action: varchar("action", { length: 100 }).notNull(),
    entityType: varchar("entityType", { length: 100 }),
    entityId: int("entityId"),
    changes: json("changes"),
    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: text("userAgent"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("audit_workspace_idx").on(table.workspaceId),
    userIdx: index("audit_user_idx").on(table.userId),
    dateIdx: index("audit_date_idx").on(table.createdAt),
  })
);

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * AI chat conversations
 */
export const aiConversations = mysqlTable(
  "aiConversations",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    title: varchar("title", { length: 255 }),
    messages: json("messages"),
    context: json("context"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("conversation_workspace_idx").on(table.workspaceId),
    userIdx: index("conversation_user_idx").on(table.userId),
  })
);

export type AIConversation = typeof aiConversations.$inferSelect;
export type InsertAIConversation = typeof aiConversations.$inferInsert;

/**
 * Tasks and to-do items
 */
export const tasks = mysqlTable(
  "tasks",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    dueDate: datetime("dueDate"),
    priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium"),
    status: mysqlEnum("status", ["pending", "in_progress", "completed", "cancelled"]).default("pending"),
    tags: json("tags"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("task_workspace_idx").on(table.workspaceId),
    userIdx: index("task_user_idx").on(table.userId),
  })
);

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Invoices and receipts
 */
export const invoices = mysqlTable(
  "invoices",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    expenseId: int("expenseId"),
    invoiceNumber: varchar("invoiceNumber", { length: 100 }).unique(),
    vendor: varchar("vendor", { length: 255 }).notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    invoiceDate: datetime("invoiceDate"),
    dueDate: datetime("dueDate"),
    imageUrl: text("imageUrl"),
    extractedData: json("extractedData"),
    status: mysqlEnum("status", ["pending", "verified", "rejected"]).default("pending"),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("invoice_workspace_idx").on(table.workspaceId),
    userIdx: index("invoice_user_idx").on(table.userId),
    vendorIdx: index("invoice_vendor_idx").on(table.vendor),
  })
);

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Notifications
 */
export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message"),
    data: json("data"),
    isRead: boolean("isRead").default(false),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    workspaceIdx: index("notification_workspace_idx").on(table.workspaceId),
    userIdx: index("notification_user_idx").on(table.userId),
    readIdx: index("notification_read_idx").on(table.isRead),
  })
);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Google Sheets sync logs
 */
export const sheetsSyncLogs = mysqlTable(
  "sheetsSyncLogs",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull(),
    userId: int("userId").notNull(),
    syncType: varchar("syncType", { length: 50 }).notNull(),
    status: mysqlEnum("status", ["pending", "success", "failed"]).default("pending"),
    recordsProcessed: int("recordsProcessed").default(0),
    errorMessage: text("errorMessage"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    completedAt: timestamp("completedAt"),
  },
  (table) => ({
    workspaceIdx: index("sync_workspace_idx").on(table.workspaceId),
    userIdx: index("sync_user_idx").on(table.userId),
  })
);

export type SheetsSyncLog = typeof sheetsSyncLogs.$inferSelect;
export type InsertSheetsSyncLog = typeof sheetsSyncLogs.$inferInsert;
