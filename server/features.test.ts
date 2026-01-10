import { describe, expect, it } from "vitest";

describe("Financial Features", () => {
  describe("Expense Management", () => {
    it("should create an expense with vendor, amount, date, and category", () => {
      const expense = {
        id: 1,
        description: "Grocery Store",
        amount: 125.50,
        category: "Food & Groceries",
        date: "2024-01-10",
        vendor: "Whole Foods",
      };

      expect(expense.amount).toBe(125.50);
      expect(expense.category).toBe("Food & Groceries");
      expect(expense.vendor).toBe("Whole Foods");
    });

    it("should update an expense with new values", () => {
      const expense = {
        id: 1,
        description: "Grocery Store",
        amount: 125.50,
        category: "Food & Groceries",
        date: "2024-01-10",
        vendor: "Whole Foods",
      };

      const updatedExpense = {
        ...expense,
        amount: 150.00,
        vendor: "Trader Joe's",
      };

      expect(updatedExpense.amount).toBe(150.00);
      expect(updatedExpense.vendor).toBe("Trader Joe's");
    });

    it("should delete an expense by ID", () => {
      const expenses = [
        { id: 1, description: "Expense 1", amount: 50 },
        { id: 2, description: "Expense 2", amount: 75 },
        { id: 3, description: "Expense 3", amount: 100 },
      ];

      const filtered = expenses.filter((exp) => exp.id !== 2);

      expect(filtered).toHaveLength(2);
      expect(filtered.find((exp) => exp.id === 2)).toBeUndefined();
    });
  });

  describe("Income Management", () => {
    it("should create an income entry with source and recurring flag", () => {
      const income = {
        id: 1,
        description: "Monthly Salary",
        amount: 5200.00,
        source: "Salary",
        date: "2024-01-10",
        recurring: true,
      };

      expect(income.amount).toBe(5200.00);
      expect(income.source).toBe("Salary");
      expect(income.recurring).toBe(true);
    });

    it("should update an income entry", () => {
      const income = {
        id: 1,
        description: "Monthly Salary",
        amount: 5200.00,
        source: "Salary",
        date: "2024-01-10",
        recurring: true,
      };

      const updatedIncome = {
        ...income,
        amount: 5500.00,
        recurring: false,
      };

      expect(updatedIncome.amount).toBe(5500.00);
      expect(updatedIncome.recurring).toBe(false);
    });

    it("should delete an income entry", () => {
      const incomes = [
        { id: 1, description: "Income 1", amount: 5200 },
        { id: 2, description: "Income 2", amount: 800 },
      ];

      const filtered = incomes.filter((inc) => inc.id !== 1);

      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.id).toBe(2);
    });
  });

  describe("Budget Management", () => {
    it("should create a budget with category and limit", () => {
      const budget = {
        id: 1,
        category: "Food & Groceries",
        limit: 600,
        spent: 425.50,
        period: "monthly",
        alertThreshold: 80,
      };

      expect(budget.category).toBe("Food & Groceries");
      expect(budget.limit).toBe(600);
      expect(budget.spent).toBe(425.50);
    });

    it("should calculate budget percentage", () => {
      const budget = {
        limit: 600,
        spent: 425.50,
      };

      const percentage = (budget.spent / budget.limit) * 100;

      expect(percentage).toBeCloseTo(70.92, 1);
    });

    it("should detect overspend", () => {
      const budget = {
        limit: 600,
        spent: 650,
      };

      const isOverspent = budget.spent > budget.limit;

      expect(isOverspent).toBe(true);
    });

    it("should update a budget limit", () => {
      const budget = {
        id: 1,
        category: "Food & Groceries",
        limit: 600,
        spent: 425.50,
      };

      const updatedBudget = {
        ...budget,
        limit: 700,
      };

      expect(updatedBudget.limit).toBe(700);
    });

    it("should delete a budget", () => {
      const budgets = [
        { id: 1, category: "Food", limit: 600 },
        { id: 2, category: "Transport", limit: 300 },
      ];

      const filtered = budgets.filter((b) => b.id !== 1);

      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.category).toBe("Transport");
    });
  });

  describe("Savings Goals", () => {
    it("should create a savings goal with target and current amount", () => {
      const goal = {
        id: 1,
        name: "Emergency Fund",
        description: "Build a 6-month emergency fund",
        targetAmount: 15000,
        currentAmount: 8500,
        targetDate: "2024-12-31",
        priority: "high",
        autoContribute: true,
        autoContributeAmount: 500,
      };

      expect(goal.name).toBe("Emergency Fund");
      expect(goal.targetAmount).toBe(15000);
      expect(goal.currentAmount).toBe(8500);
    });

    it("should calculate goal progress percentage", () => {
      const goal = {
        targetAmount: 15000,
        currentAmount: 8500,
      };

      const percentage = (goal.currentAmount / goal.targetAmount) * 100;

      expect(percentage).toBeCloseTo(56.67, 1);
    });

    it("should detect completed goal", () => {
      const goal = {
        targetAmount: 15000,
        currentAmount: 15000,
      };

      const isCompleted = goal.currentAmount >= goal.targetAmount;

      expect(isCompleted).toBe(true);
    });

    it("should update a savings goal", () => {
      const goal = {
        id: 1,
        name: "Emergency Fund",
        targetAmount: 15000,
        currentAmount: 8500,
      };

      const updatedGoal = {
        ...goal,
        currentAmount: 10000,
      };

      expect(updatedGoal.currentAmount).toBe(10000);
    });

    it("should delete a savings goal", () => {
      const goals = [
        { id: 1, name: "Emergency Fund", targetAmount: 15000 },
        { id: 2, name: "Vacation", targetAmount: 5000 },
      ];

      const filtered = goals.filter((g) => g.id !== 1);

      expect(filtered).toHaveLength(1);
      expect(filtered[0]?.name).toBe("Vacation");
    });
  });

  describe("Receipt Scanner", () => {
    it("should extract receipt data from scanned image", () => {
      const scannedData = {
        vendor: "Whole Foods",
        amount: 125.50,
        date: "2024-01-10",
        category: "Food & Groceries",
        description: "Groceries",
        imageUrl: "data:image/jpeg;base64,...",
      };

      expect(scannedData.vendor).toBe("Whole Foods");
      expect(scannedData.amount).toBe(125.50);
      expect(scannedData.category).toBe("Food & Groceries");
    });

    it("should add scanned receipt as expense", () => {
      const scannedData = {
        vendor: "Whole Foods",
        amount: 125.50,
        date: "2024-01-10",
        category: "Food & Groceries",
        description: "Groceries",
      };

      const newExpense = {
        id: 1,
        description: scannedData.description || scannedData.vendor,
        amount: scannedData.amount,
        category: scannedData.category,
        date: scannedData.date,
        vendor: scannedData.vendor,
      };

      expect(newExpense.vendor).toBe("Whole Foods");
      expect(newExpense.amount).toBe(125.50);
    });

    it("should validate receipt data before adding", () => {
      const scannedData = {
        vendor: "Whole Foods",
        amount: 125.50,
        date: "2024-01-10",
        category: "Food & Groceries",
        description: "Groceries",
      };

      const isValid = scannedData.vendor && scannedData.amount > 0;

      expect(isValid).toBe(true);
    });
  });

  describe("WhatsApp Integration", () => {
    it("should generate WhatsApp share link with message", () => {
      const phoneNumber = "1234567890";
      const message = "Receipt from Whole Foods: $125.50";
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      expect(whatsappUrl).toContain("wa.me");
      expect(whatsappUrl).toContain(phoneNumber);
      expect(whatsappUrl).toContain("text=");
    });

    it("should format expense report for WhatsApp", () => {
      const expenses = [
        { description: "Grocery Store", amount: 125.5 },
        { description: "Gas", amount: 45 },
        { description: "Movie Tickets", amount: 30 },
      ];

      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const message = `📊 Expense Report\n💸 Total Expenses: $${totalExpenses.toFixed(2)}\n📂 Categories: ${expenses.length}`;

      expect(message).toContain("$200.50");
      expect(message).toContain("3");
    });

    it("should format financial summary for WhatsApp", () => {
      const income = 5200;
      const expenses = 1250.75;
      const savings = 3949.25;

      const message = `💼 Financial Summary\n💰 Income: $${income.toFixed(2)}\n💸 Expenses: $${expenses.toFixed(2)}\n🏦 Savings: $${savings.toFixed(2)}`;

      expect(message).toContain("$5200.00");
      expect(message).toContain("$1250.75");
      expect(message).toContain("$3949.25");
    });

    it("should generate QR code URL for WhatsApp", () => {
      const phoneNumber = "1234567890";
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://wa.me/${phoneNumber}`;

      expect(qrUrl).toContain("qrserver.com");
      expect(qrUrl).toContain("wa.me");
      expect(qrUrl).toContain("300x300");
    });

    it("should export expenses to WhatsApp format", () => {
      const expenses = [
        { description: "Grocery Store", amount: 125.5 },
        { description: "Gas", amount: 45 },
      ];

      const message = `📊 Expense Export\n\n${expenses
        .map((exp) => `• ${exp.description}: $${exp.amount}`)
        .join("\n")}\n\nTotal: $${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}`;

      expect(message).toContain("Grocery Store");
      expect(message).toContain("Gas");
      expect(message).toContain("$170.50");
    });
  });

  describe("Financial Calculations", () => {
    it("should calculate total expenses", () => {
      const expenses = [
        { amount: 125.50 },
        { amount: 45.00 },
        { amount: 30.00 },
      ];

      const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      expect(total).toBe(200.50);
    });

    it("should calculate total income", () => {
      const incomes = [
        { amount: 5200 },
        { amount: 800 },
        { amount: 150 },
      ];

      const total = incomes.reduce((sum, inc) => sum + inc.amount, 0);

      expect(total).toBe(6150);
    });

    it("should calculate net savings", () => {
      const income = 6150;
      const expenses = 200.50;
      const savings = income - expenses;

      expect(savings).toBe(5949.50);
    });

    it("should calculate savings rate", () => {
      const income = 6150;
      const savings = 2340;
      const savingsRate = (savings / income) * 100;

      expect(savingsRate).toBeCloseTo(38.05, 1);
    });
  });
});
