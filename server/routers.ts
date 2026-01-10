import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createWorkspace,
  getUserWorkspaces,
  createDefaultCategories,
  createExpense,
  getWorkspaceExpenses,
  getMonthlyExpenseTotal,
  createIncome,
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
  createAIConversation,
  getWorkspaceAIConversations,
  createTask,
  getWorkspaceTasks,
  createInvoice,
  getWorkspaceInvoices,
  logSheetsSync,
} from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Workspace management
  workspace: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserWorkspaces(ctx.user.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          currency: z.string().default("USD"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          await createWorkspace(ctx.user.id, input.name, input.currency);
          const workspaces = await getUserWorkspaces(ctx.user.id);
          const newWorkspace = workspaces[workspaces.length - 1];
          
          if (newWorkspace) {
            await createDefaultCategories(newWorkspace.id);
            await logAuditEvent(
              newWorkspace.id,
              ctx.user.id,
              "workspace_created",
              "workspace",
              newWorkspace.id
            );
          }

          return newWorkspace;
        } catch (error) {
          console.error("Failed to create workspace:", error);
          throw error;
        }
      }),
  }),

  // Expense management
  expense: router({
    create: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          categoryId: z.number(),
          amount: z.string(),
          description: z.string().optional(),
          vendor: z.string().optional(),
          transactionDate: z.date(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const expense = await createExpense(
          input.workspaceId,
          ctx.user.id,
          input.categoryId,
          input.amount,
          input.description || "",
          input.transactionDate
        );

        await logAuditEvent(
          input.workspaceId,
          ctx.user.id,
          "expense_created",
          "expense",
          undefined
        );

        return expense;
      }),

    list: protectedProcedure
      .input(z.object({ workspaceId: z.number() }))
      .query(async ({ input }) => {
        return getWorkspaceExpenses(input.workspaceId);
      }),

    monthlyTotal: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          year: z.number(),
          month: z.number(),
        })
      )
      .query(async ({ input }) => {
        return getMonthlyExpenseTotal(input.workspaceId, input.year, input.month);
      }),
  }),

  // Income management
  income: router({
    create: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          categoryId: z.number(),
          amount: z.string(),
          description: z.string().optional(),
          source: z.string().optional(),
          transactionDate: z.date(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const income = await createIncome(
          input.workspaceId,
          ctx.user.id,
          input.categoryId,
          input.amount,
          input.description || "",
          input.transactionDate
        );

        await logAuditEvent(
          input.workspaceId,
          ctx.user.id,
          "income_created",
          "income",
          undefined
        );

        return income;
      }),

    monthlyTotal: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          year: z.number(),
          month: z.number(),
        })
      )
      .query(async ({ input }) => {
        return getMonthlyIncomeTotal(input.workspaceId, input.year, input.month);
      }),
  }),

  // Budget management
  budget: router({
    create: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          categoryId: z.number(),
          limit: z.string(),
          period: z.enum(["daily", "weekly", "monthly", "yearly"]),
          alertThreshold: z.number().default(80),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const budget = await createBudget(
          input.workspaceId,
          input.categoryId,
          input.limit,
          input.period,
          new Date()
        );

        await logAuditEvent(
          input.workspaceId,
          ctx.user.id,
          "budget_created",
          "budget",
          undefined
        );

        return budget;
      }),

    list: protectedProcedure
      .input(z.object({ workspaceId: z.number() }))
      .query(async ({ input }) => {
        return getWorkspaceBudgets(input.workspaceId);
      }),
  }),

  // Savings goals
  savingsGoal: router({
    create: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          name: z.string().min(1),
          targetAmount: z.string(),
          targetDate: z.date(),
          priority: z.enum(["low", "medium", "high"]).default("medium"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const goal = await createSavingsGoal(
          input.workspaceId,
          ctx.user.id,
          input.name,
          input.targetAmount,
          input.targetDate
        );

        await logAuditEvent(
          input.workspaceId,
          ctx.user.id,
          "goal_created",
          "savingsGoal",
          undefined
        );

        return goal;
      }),

    list: protectedProcedure
      .input(z.object({ workspaceId: z.number() }))
      .query(async ({ input }) => {
        return getWorkspaceSavingsGoals(input.workspaceId);
      }),
  }),

  // Bill reminders
  billReminder: router({
    create: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          name: z.string().min(1),
          amount: z.string(),
          dueDate: z.date(),
          frequency: z.enum(["once", "weekly", "monthly", "yearly"]),
          reminderDaysBefore: z.number().default(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const reminder = await createBillReminder(
          input.workspaceId,
          ctx.user.id,
          input.name,
          input.amount,
          input.dueDate,
          input.frequency
        );

        await logAuditEvent(
          input.workspaceId,
          ctx.user.id,
          "reminder_created",
          "billReminder",
          undefined
        );

        return reminder;
      }),

    upcoming: protectedProcedure
      .input(z.object({ workspaceId: z.number(), daysAhead: z.number().default(7) }))
      .query(async ({ input }) => {
        return getUpcomingBillReminders(input.workspaceId, input.daysAhead);
      }),
  }),

  // Tasks
  task: router({
    create: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          title: z.string().min(1),
          description: z.string().optional(),
          dueDate: z.date().optional(),
          priority: z.enum(["low", "medium", "high"]).default("medium"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const task = await createTask(
          input.workspaceId,
          ctx.user.id,
          input.title,
          input.description,
          input.dueDate,
          input.priority
        );

        await logAuditEvent(
          input.workspaceId,
          ctx.user.id,
          "task_created",
          "task",
          undefined
        );

        return task;
      }),

    list: protectedProcedure
      .input(z.object({ workspaceId: z.number() }))
      .query(async ({ input }) => {
        return getWorkspaceTasks(input.workspaceId);
      }),
  }),

  // Invoices
  invoice: router({
    create: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          vendor: z.string().min(1),
          amount: z.string(),
          invoiceDate: z.date(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const invoice = await createInvoice(
          input.workspaceId,
          ctx.user.id,
          input.vendor,
          input.amount,
          input.invoiceDate
        );

        await logAuditEvent(
          input.workspaceId,
          ctx.user.id,
          "invoice_created",
          "invoice",
          undefined
        );

        return invoice;
      }),

    list: protectedProcedure
      .input(z.object({ workspaceId: z.number() }))
      .query(async ({ input }) => {
        return getWorkspaceInvoices(input.workspaceId);
      }),
  }),

  // Notifications
  notification: router({
    unread: protectedProcedure.query(async ({ ctx }) => {
      return getUserUnreadNotifications(ctx.user.id);
    }),
  }),

  // AI Financial Advisor
  aiAdvisor: router({
    chat: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          conversationId: z.number().optional(),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Get financial context for the AI
          const monthlyExpense = await getMonthlyExpenseTotal(input.workspaceId, new Date().getFullYear(), new Date().getMonth() + 1);
          const monthlyIncome = await getMonthlyIncomeTotal(input.workspaceId, new Date().getFullYear(), new Date().getMonth() + 1);
          const budgets = await getWorkspaceBudgets(input.workspaceId);
          const goals = await getWorkspaceSavingsGoals(input.workspaceId);

          const systemPrompt = `You are an AI financial advisor helping users manage their personal finances. 
          Current financial context:
          - Monthly Income: $${monthlyIncome}
          - Monthly Expenses: $${monthlyExpense}
          - Active Budgets: ${budgets.length}
          - Savings Goals: ${goals.length}
          
          Provide helpful, actionable financial advice based on the user's data and questions.`;

          const response = await invokeLLM({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input.message },
            ],
          });

          const aiMessage = response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

          // Log the interaction
          await logAuditEvent(
            input.workspaceId,
            ctx.user.id,
            "ai_advisor_query",
            "aiConversation",
            input.conversationId
          );

          return {
            response: aiMessage,
            conversationId: input.conversationId,
          };
        } catch (error) {
          console.error("AI Advisor error:", error);
          throw new Error("Failed to get AI response");
        }
      }),

    startConversation: protectedProcedure
      .input(z.object({ workspaceId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        return createAIConversation(input.workspaceId, ctx.user.id);
      }),

    listConversations: protectedProcedure
      .input(z.object({ workspaceId: z.number() }))
      .query(async ({ input }) => {
        return getWorkspaceAIConversations(input.workspaceId);
      }),
  }),

  // Google Sheets sync
  sheetsSync: router({
    logSync: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          syncType: z.string(),
          status: z.enum(["pending", "success", "failed"]),
          recordsProcessed: z.number().default(0),
          errorMessage: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return logSheetsSync(
          input.workspaceId,
          ctx.user.id,
          input.syncType,
          input.status,
          input.recordsProcessed,
          input.errorMessage
        );
      }),
  }),
});

export type AppRouter = typeof appRouter;
