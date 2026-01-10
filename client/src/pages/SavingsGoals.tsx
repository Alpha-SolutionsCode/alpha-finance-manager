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
import { Plus, Target, TrendingUp, Calendar, Edit2, Trash2 } from "lucide-react";
import WhatsAppIntegration from "@/components/WhatsAppIntegration";
import { useState } from "react";
import { toast } from "sonner";

export default function SavingsGoals() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

  const [goals, setGoals] = useState([
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
      name: "Car Down Payment",
      description: "Save for a new car",
      targetAmount: 10000,
      currentAmount: 6200,
      targetDate: "2024-09-30",
      priority: "high",
      autoContribute: true,
      autoContributeAmount: 800,
    },
    {
      id: 4,
      name: "Home Renovation",
      description: "Kitchen and bathroom renovation",
      targetAmount: 20000,
      currentAmount: 5000,
      targetDate: "2025-12-31",
      priority: "low",
      autoContribute: true,
      autoContributeAmount: 300,
    },
  ]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Savings goal created successfully");
    setOpen(false);
  };

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Savings goal updated successfully");
    setEditOpen(false);
    setSelectedGoal(null);
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter((g) => g.id !== id));
    toast.success("Savings goal deleted successfully");
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

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
              <div className="text-3xl font-bold">${totalTarget.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-2">All goals combined</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${totalSaved.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {((totalSaved / totalTarget) * 100).toFixed(1)}% of target
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {completedGoals}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Goals achieved</p>
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
        </div>

        {/* Add Goal Button */}
        <div className="flex justify-end gap-2">
          <WhatsAppIntegration />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Savings Goal</DialogTitle>
                <DialogDescription>Set a new financial goal to work towards</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input id="name" placeholder="e.g., Emergency Fund" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your goal..." rows={3} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Amount</Label>
                    <Input id="target" type="number" placeholder="10000.00" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetDate">Target Date</Label>
                  <Input id="targetDate" type="date" required />
                </div>

                <div className="space-y-3 p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="autoContribute" className="rounded" />
                    <Label htmlFor="autoContribute" className="cursor-pointer text-sm">
                      Enable auto-contribution
                    </Label>
                  </div>
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

        {/* Edit Goal Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Savings Goal</DialogTitle>
              <DialogDescription>Update your savings goal details</DialogDescription>
            </DialogHeader>
            {selectedGoal && (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Goal Name</Label>
                  <Input id="edit-name" defaultValue={selectedGoal.name} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    defaultValue={selectedGoal.description}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-target">Target Amount</Label>
                    <Input
                      id="edit-target"
                      type="number"
                      defaultValue={selectedGoal.targetAmount}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-current">Current Amount</Label>
                    <Input
                      id="edit-current"
                      type="number"
                      defaultValue={selectedGoal.currentAmount}
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Target Date</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      defaultValue={selectedGoal.targetDate}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select defaultValue={selectedGoal.priority}>
                      <SelectTrigger id="edit-priority">
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

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Goals List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Goals</h2>
          <div className="grid grid-cols-1 gap-4">
            {goals.map((goal) => {
              const percentage = (goal.currentAmount / goal.targetAmount) * 100;
              const isCompleted = goal.currentAmount >= goal.targetAmount;

              return (
                <Card key={goal.id} className={isCompleted ? "border-green-200 dark:border-green-900" : ""}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mt-1">
                            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-lg">{goal.name}</p>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                            <div className="flex gap-2 text-sm text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(goal.targetDate).toLocaleDateString()}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  goal.priority === "high"
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                                    : goal.priority === "medium"
                                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                                      : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                }`}
                              >
                                {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditGoal(goal)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-semibold">
                            ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              isCompleted ? "bg-green-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% complete</p>
                      </div>

                      {isCompleted && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900">
                          <p className="text-sm font-medium text-green-900 dark:text-green-300">
                            ✅ Goal completed! Great job!
                          </p>
                        </div>
                      )}

                      {goal.autoContribute && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                            💰 Auto-contributing ${goal.autoContributeAmount.toFixed(2)}/month
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
