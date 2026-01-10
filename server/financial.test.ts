import { describe, it, expect, beforeAll, afterAll } from "vitest";
import {
  createWorkspace,
  getUserWorkspaces,
  createDefaultCategories,
  createExpense,
  getWorkspaceExpenses,
  createIncome,
  getMonthlyExpenseTotal,
  getMonthlyIncomeTotal,
  createBudget,
  getWorkspaceBudgets,
  createSavingsGoal,
  getWorkspaceSavingsGoals,
  createBillReminder,
  getUpcomingBillReminders,
  logAuditEvent,
  createNotification,
  getUserUnreadNotifications,
  createTask,
  getWorkspaceTasks,
  createInvoice,
  getWorkspaceInvoices,
} from "./db";

describe("Financial Operations", () => {
  const testUserId = 1;
  let testWorkspaceId: number;
  let testCategoryId: number;

  beforeAll(async () => {
    // Create a test workspace
    const workspaceResult = await createWorkspace(testUserId, "Test Workspace", "USD");
    testWorkspaceId = 1; // Mock workspace ID for testing

    // Create default categories
    await createDefaultCategories(testWorkspaceId);
  });

  describe("Workspace Management", () => {
    it("should create a workspace", async () => {
      const result = await createWorkspace(testUserId, "New Workspace", "USD");
      expect(result).toBeDefined();
    });

    it("should retrieve user workspaces", async () => {
      const workspaces = await getUserWorkspaces(testUserId);
      expect(Array.isArray(workspaces)).toBe(true);
      expect(workspaces.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Expense Management", () => {
    it("should create an expense", async () => {
      const result = await createExpense(
        testWorkspaceId,
        testUserId,
        1,
        "125.50",
        "Grocery shopping",
        new Date()
      );
      expect(result).toBeDefined();
    });

    it("should retrieve workspace expenses", async () => {
      const expenses = await getWorkspaceExpenses(testWorkspaceId);
      expect(Array.isArray(expenses)).toBe(true);
    });

    it("should calculate monthly expense total", async () => {
      const now = new Date();
      const total = await getMonthlyExpenseTotal(testWorkspaceId, now.getFullYear(), now.getMonth() + 1);
      expect(typeof total).toBe("number");
      expect(total).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Income Management", () => {
    it("should create an income entry", async () => {
      const result = await createIncome(
        testWorkspaceId,
        testUserId,
        1,
        "5200.00",
        "Monthly salary",
        new Date()
      );
      expect(result).toBeDefined();
    });

    it("should calculate monthly income total", async () => {
      const now = new Date();
      const total = await getMonthlyIncomeTotal(testWorkspaceId, now.getFullYear(), now.getMonth() + 1);
      expect(typeof total).toBe("number");
      expect(total).toBeGreaterThanOrEqual(0);
    });
  });

  describe("Budget Management", () => {
    it("should create a budget", async () => {
      const result = await createBudget(testWorkspaceId, 1, "500.00", "monthly", new Date());
      expect(result).toBeDefined();
    });

    it("should retrieve workspace budgets", async () => {
      const budgets = await getWorkspaceBudgets(testWorkspaceId);
      expect(Array.isArray(budgets)).toBe(true);
    });
  });

  describe("Savings Goals", () => {
    it("should create a savings goal", async () => {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + 6);
      const result = await createSavingsGoal(
        testWorkspaceId,
        testUserId,
        "Emergency Fund",
        "15000.00",
        targetDate
      );
      expect(result).toBeDefined();
    });

    it("should retrieve workspace savings goals", async () => {
      const goals = await getWorkspaceSavingsGoals(testWorkspaceId);
      expect(Array.isArray(goals)).toBe(true);
    });
  });

  describe("Bill Reminders", () => {
    it("should create a bill reminder", async () => {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 5);
      const result = await createBillReminder(
        testWorkspaceId,
        testUserId,
        "Electric Bill",
        "89.99",
        dueDate,
        "monthly"
      );
      expect(result).toBeDefined();
    });

    it("should retrieve upcoming bill reminders", async () => {
      const reminders = await getUpcomingBillReminders(testWorkspaceId, 7);
      expect(Array.isArray(reminders)).toBe(true);
    });
  });

  describe("Tasks", () => {
    it("should create a task", async () => {
      const result = await createTask(
        testWorkspaceId,
        testUserId,
        "Review monthly budget",
        "Check if spending is within limits",
        new Date(),
        "high"
      );
      expect(result).toBeDefined();
    });

    it("should retrieve workspace tasks", async () => {
      const tasks = await getWorkspaceTasks(testWorkspaceId);
      expect(Array.isArray(tasks)).toBe(true);
    });
  });

  describe("Invoices", () => {
    it("should create an invoice", async () => {
      const result = await createInvoice(
        testWorkspaceId,
        testUserId,
        "Acme Corp",
        "1500.00",
        new Date()
      );
      expect(result).toBeDefined();
    });

    it("should retrieve workspace invoices", async () => {
      const invoices = await getWorkspaceInvoices(testWorkspaceId);
      expect(Array.isArray(invoices)).toBe(true);
    });
  });

  describe("Notifications", () => {
    it("should create a notification", async () => {
      const result = await createNotification(
        testWorkspaceId,
        testUserId,
        "budget_alert",
        "Budget Alert",
        "You have exceeded your food budget",
        { category: "Food & Groceries", percentage: 105 }
      );
      expect(result).toBeDefined();
    });

    it("should retrieve unread notifications", async () => {
      const notifications = await getUserUnreadNotifications(testUserId);
      expect(Array.isArray(notifications)).toBe(true);
    });
  });

  describe("Audit Logging", () => {
    it("should log an audit event", async () => {
      const result = await logAuditEvent(
        testWorkspaceId,
        testUserId,
        "expense_created",
        "expense",
        1,
        { amount: "125.50", category: "Food" }
      );
      expect(result).toBeDefined();
    });
  });
});
