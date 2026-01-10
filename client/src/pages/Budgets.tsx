import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, AlertTriangle, TrendingUp, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Budgets() {
  const [open, setOpen] = useState(false);

  // Mock data - will be replaced with real data from API
  const budgets = [
    {
      id: 1,
      category: "Food & Groceries",
      limit: 500,
      spent: 420,
      period: "monthly",
      alertThreshold: 80,
    },
    {
      id: 2,
      category: "Transportation",
      limit: 300,
      spent: 180,
      period: "monthly",
      alertThreshold: 80,
    },
    {
      id: 3,
      category: "Entertainment",
      limit: 200,
      spent: 190,
      period: "monthly",
      alertThreshold: 80,
    },
    {
      id: 4,
      category: "Utilities",
      limit: 150,
      spent: 89,
      period: "monthly",
      alertThreshold: 80,
    },
  ];

  const categories = [
    "Food & Groceries",
    "Transportation",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Shopping",
    "Dining",
    "Other",
  ];

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Budget created successfully");
    setOpen(false);
  };

  const getStatusColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusLabel = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "Over budget";
    if (percentage >= 80) return "Warning";
    return "On track";
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overBudgetCount = budgets.filter((b) => b.spent > b.limit).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Budgets</h1>
          <p className="text-muted-foreground">Set and manage your spending limits</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2">Monthly limit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                ${totalSpent.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${(totalBudget - totalSpent).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Available to spend</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Over Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${overBudgetCount > 0 ? "text-red-600 dark:text-red-400" : ""}`}>
                {overBudgetCount}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Categories exceeded</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Budget Button */}
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
                <DialogDescription>Set a spending limit for a category</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBudget} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="limit">Budget Limit</Label>
                    <Input id="limit" type="number" placeholder="0.00" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="period">Period</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger id="period">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threshold">Alert Threshold (%)</Label>
                  <Input id="threshold" type="number" placeholder="80" defaultValue="80" min="0" max="100" />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Budget</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Budgets List */}
        <div className="grid grid-cols-1 gap-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isOverBudget = budget.spent > budget.limit;
            const isWarning = percentage >= 80;

            return (
              <Card key={budget.id} className={isOverBudget ? "border-red-200 dark:border-red-900" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle>{budget.category}</CardTitle>
                        <CardDescription>{budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} budget</CardDescription>
                      </div>
                    </div>
                    {isOverBudget && (
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        ${budget.spent.toLocaleString()} / ${budget.limit.toLocaleString()}
                      </p>
                      <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full ${
                          isOverBudget
                            ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                            : isWarning
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        }`}
                      >
                        {getStatusLabel(budget.spent, budget.limit)}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getStatusColor(budget.spent, budget.limit)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% used</p>
                  </div>

                  {/* Remaining Amount */}
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <span className="text-sm font-medium">Remaining</span>
                    <span
                      className={`text-lg font-bold ${
                        isOverBudget
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      ${Math.abs(budget.limit - budget.spent).toLocaleString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
