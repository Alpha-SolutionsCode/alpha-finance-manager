CREATE TABLE `aiConversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255),
	`messages` json,
	`context` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiConversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auditLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(100),
	`entityId` int,
	`changes` json,
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `billReminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`categoryId` int,
	`name` varchar(255) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`dueDate` datetime NOT NULL,
	`frequency` enum('once','weekly','monthly','yearly') NOT NULL,
	`nextReminderDate` datetime,
	`reminderDaysBefore` int DEFAULT 1,
	`status` enum('pending','paid','overdue','cancelled') DEFAULT 'pending',
	`paidDate` datetime,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `billReminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`categoryId` int NOT NULL,
	`limit` decimal(15,2) NOT NULL,
	`period` enum('daily','weekly','monthly','yearly') NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`alertThreshold` int DEFAULT 80,
	`isActive` boolean DEFAULT true,
	`notes` text,
	`startDate` datetime NOT NULL,
	`endDate` datetime,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `budgets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`type` enum('expense','income') NOT NULL,
	`icon` varchar(50),
	`color` varchar(7),
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`categoryId` int NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`description` text,
	`vendor` varchar(255),
	`receiptUrl` text,
	`receiptData` json,
	`tags` json,
	`isRecurring` boolean DEFAULT false,
	`recurringFrequency` enum('daily','weekly','monthly','yearly'),
	`nextOccurrence` datetime,
	`status` enum('pending','completed','cancelled') DEFAULT 'completed',
	`transactionDate` datetime NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `incomes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`categoryId` int NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`description` text,
	`source` varchar(255),
	`tags` json,
	`isRecurring` boolean DEFAULT false,
	`recurringFrequency` enum('daily','weekly','monthly','yearly'),
	`nextOccurrence` datetime,
	`status` enum('pending','completed','cancelled') DEFAULT 'completed',
	`transactionDate` datetime NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `incomes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`expenseId` int,
	`invoiceNumber` varchar(100),
	`vendor` varchar(255) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`invoiceDate` datetime,
	`dueDate` datetime,
	`imageUrl` text,
	`extractedData` json,
	`status` enum('pending','verified','rejected') DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`lenderName` varchar(255),
	`principalAmount` decimal(15,2) NOT NULL,
	`interestRate` decimal(5,2),
	`currency` varchar(3) DEFAULT 'USD',
	`startDate` datetime NOT NULL,
	`endDate` datetime,
	`emiAmount` decimal(15,2),
	`emiFrequency` enum('weekly','monthly','quarterly') DEFAULT 'monthly',
	`totalEmiPaid` int DEFAULT 0,
	`totalEmiRemaining` int,
	`status` enum('active','completed','defaulted') DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`data` json,
	`isRead` boolean DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savingsGoals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`targetAmount` decimal(15,2) NOT NULL,
	`currentAmount` decimal(15,2) DEFAULT '0',
	`currency` varchar(3) DEFAULT 'USD',
	`targetDate` datetime,
	`priority` enum('low','medium','high') DEFAULT 'medium',
	`autoContribute` boolean DEFAULT false,
	`autoContributeAmount` decimal(15,2),
	`autoContributeFrequency` enum('daily','weekly','monthly'),
	`status` enum('active','paused','completed') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `savingsGoals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sheetsSyncLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`syncType` varchar(50) NOT NULL,
	`status` enum('pending','success','failed') DEFAULT 'pending',
	`recordsProcessed` int DEFAULT 0,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `sheetsSyncLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`categoryId` int,
	`name` varchar(255) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`currency` varchar(3) DEFAULT 'USD',
	`billingCycle` enum('daily','weekly','monthly','yearly') NOT NULL,
	`nextBillingDate` datetime NOT NULL,
	`startDate` datetime NOT NULL,
	`endDate` datetime,
	`status` enum('active','paused','cancelled') DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`dueDate` datetime,
	`priority` enum('low','medium','high') DEFAULT 'medium',
	`status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
	`tags` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspaceMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','family','accountant','admin') NOT NULL,
	`permissions` json,
	`invitedAt` timestamp NOT NULL DEFAULT (now()),
	`joinedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workspaceMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `workspaces` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`currency` varchar(3) DEFAULT 'USD',
	`googleSheetId` varchar(255),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `workspaces_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` text;--> statement-breakpoint
ALTER TABLE `users` ADD `userRole` enum('owner','family','accountant','admin') DEFAULT 'owner' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `googleAccessToken` longtext;--> statement-breakpoint
ALTER TABLE `users` ADD `googleRefreshToken` longtext;--> statement-breakpoint
ALTER TABLE `users` ADD `googleSheetId` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `whatsappPhoneNumber` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `whatsappVerified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `defaultCurrency` varchar(3) DEFAULT 'USD';--> statement-breakpoint
ALTER TABLE `users` ADD `timezone` varchar(64) DEFAULT 'UTC';--> statement-breakpoint
ALTER TABLE `users` ADD `preferences` json;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
CREATE INDEX `conversation_workspace_idx` ON `aiConversations` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `conversation_user_idx` ON `aiConversations` (`userId`);--> statement-breakpoint
CREATE INDEX `audit_workspace_idx` ON `auditLogs` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `audit_user_idx` ON `auditLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `audit_date_idx` ON `auditLogs` (`createdAt`);--> statement-breakpoint
CREATE INDEX `reminder_workspace_idx` ON `billReminders` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `reminder_user_idx` ON `billReminders` (`userId`);--> statement-breakpoint
CREATE INDEX `reminder_duedate_idx` ON `billReminders` (`dueDate`);--> statement-breakpoint
CREATE INDEX `budget_workspace_idx` ON `budgets` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `budget_category_idx` ON `budgets` (`categoryId`);--> statement-breakpoint
CREATE INDEX `category_workspace_idx` ON `categories` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `expense_workspace_idx` ON `expenses` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `expense_user_idx` ON `expenses` (`userId`);--> statement-breakpoint
CREATE INDEX `expense_category_idx` ON `expenses` (`categoryId`);--> statement-breakpoint
CREATE INDEX `expense_date_idx` ON `expenses` (`transactionDate`);--> statement-breakpoint
CREATE INDEX `income_workspace_idx` ON `incomes` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `income_user_idx` ON `incomes` (`userId`);--> statement-breakpoint
CREATE INDEX `income_category_idx` ON `incomes` (`categoryId`);--> statement-breakpoint
CREATE INDEX `income_date_idx` ON `incomes` (`transactionDate`);--> statement-breakpoint
CREATE INDEX `invoice_workspace_idx` ON `invoices` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `invoice_user_idx` ON `invoices` (`userId`);--> statement-breakpoint
CREATE INDEX `invoice_vendor_idx` ON `invoices` (`vendor`);--> statement-breakpoint
CREATE INDEX `loan_workspace_idx` ON `loans` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `loan_user_idx` ON `loans` (`userId`);--> statement-breakpoint
CREATE INDEX `notification_workspace_idx` ON `notifications` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `notification_user_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `notification_read_idx` ON `notifications` (`isRead`);--> statement-breakpoint
CREATE INDEX `goal_workspace_idx` ON `savingsGoals` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `goal_user_idx` ON `savingsGoals` (`userId`);--> statement-breakpoint
CREATE INDEX `sync_workspace_idx` ON `sheetsSyncLogs` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `sync_user_idx` ON `sheetsSyncLogs` (`userId`);--> statement-breakpoint
CREATE INDEX `subscription_workspace_idx` ON `subscriptions` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `subscription_user_idx` ON `subscriptions` (`userId`);--> statement-breakpoint
CREATE INDEX `subscription_nextbilling_idx` ON `subscriptions` (`nextBillingDate`);--> statement-breakpoint
CREATE INDEX `task_workspace_idx` ON `tasks` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `task_user_idx` ON `tasks` (`userId`);--> statement-breakpoint
CREATE INDEX `workspace_member_idx` ON `workspaceMembers` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `user_member_idx` ON `workspaceMembers` (`userId`);--> statement-breakpoint
CREATE INDEX `workspace_owner_idx` ON `workspaces` (`ownerId`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `openId_idx` ON `users` (`openId`);