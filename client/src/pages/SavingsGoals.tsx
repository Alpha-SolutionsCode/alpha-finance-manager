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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Target, TrendingUp, Calendar, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SavingsGoals() {
  const [open, setOpen] = useState(false);

  // Mock data - will be replaced with real data from API
  const goals = [
    {
      id: 1,
      name: "Emergency Fund",
      description: "Build a 6-month emergency fund",
      targetAmount: 15000,
      currentAmount: 8500,
      targetDate: "2024-12-31",
      priority: "high",
      autoContribute: true,
      autoContributeAmount: 500,
    },
    {
      id: 2,
      name: "Vacation",
      description: "Summer vacation to Europe",
      targetAmount: 5000,
      currentAmount: 2300,
      targetDate: "2024-06-30",
      priority: "medium",
      autoContribute: false,
      autoContributeAmount: 0,
    },
    {
      id: 3,
      name: "New Laptop",
      description: "Upgrade to a new laptop",
      targetAmount: 2000,
      currentAmount: 1800,
      targetDate: "2024-03-31",
      priority: "low",
      autoContribute: true,
      autoContributeAmount: 200,
    },
    {
      id: 4,
      name: "Home Down Payment",
      description: "Save for house down payment",
      targetAmount: 50000,
      currentAmount: 12500,
      targetDate: "2026-12-31",
      priority: "high",
      autoContribute: true,
      autoContributeAmount: 1000,
    },
  ];

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Savings goal created successfully");
    setOpen(false);
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Savings Goals</h1>
          <p className="text-muted-foreground">Track your financial goals and milestones</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalTarget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-2">Combined goal amount</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${totalSaved.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {((totalSaved / totalTarget) * 100).toFixed(1)}% of target
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{goals.length}</div>
              <p className="text-xs text-muted-foreground mt-2">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{completedGoals}</div>
              <p className="text-xs text-muted-foreground mt-2">Goals achieved</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Goal Button */}
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Savings Goal</DialogTitle>
                <DialogDescription>Set a new financial goal to work towards</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input id="name" placeholder="e.g., Emergency Fund" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea id="description" placeholder="Why is this goal important?" rows={2} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Amount</Label>
                    <Input id="target" type="number" placeholder="0.00" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current">Current Amount</Label>
                    <Input id="current" type="number" placeholder="0.00" step="0.01" defaultValue="0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetDate">Target Date</Label>
                    <Input id="targetDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3 p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="autoContribute" className="rounded" />
                    <Label htmlFor="autoContribute" className="cursor-pointer">
                      Enable auto-contribution
                    </Label>
                  </div>
                  <Input
                    id="autoAmount"
                    type="number"
                    placeholder="Amount per month"
                    step="0.01"
                    disabled
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Goal</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 gap-6">
          {goals.map((goal) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const daysRemaining = Math.ceil(
              (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Card key={goal.id} className={isCompleted ? "border-green-200 dark:border-green-900" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle>{goal.name}</CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityColor(goal.priority)}`}>
                      {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                      </p>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Goal Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Calendar className="h-4 w-4" />
                        Target Date
                      </div>
                      <p className="font-semibold">
                        {new Date(goal.targetDate).toLocaleDateString()} ({daysRemaining} days)
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <TrendingUp className="h-4 w-4" />
                        Remaining
                      </div>
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Auto-contribution Info */}
                  {goal.autoContribute && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium">
                          Auto-contributing ${goal.autoContributeAmount}/month
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Add Funds
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
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
