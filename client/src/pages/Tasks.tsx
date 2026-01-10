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
import { Plus, CheckCircle2, Circle, Trash2, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Tasks() {
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Review monthly budget",
      description: "Check if spending is within limits",
      dueDate: "2024-01-15",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      title: "Pay electricity bill",
      description: "Due on 15th of every month",
      dueDate: "2024-01-15",
      priority: "high",
      completed: false,
    },
    {
      id: 3,
      title: "Update savings goal",
      description: "Adjust emergency fund target",
      dueDate: "2024-01-20",
      priority: "medium",
      completed: false,
    },
    {
      id: 4,
      title: "File tax documents",
      description: "Prepare for tax filing",
      dueDate: "2024-02-28",
      priority: "high",
      completed: false,
    },
    {
      id: 5,
      title: "Review investment portfolio",
      description: "Check performance and rebalance",
      dueDate: "2024-01-25",
      priority: "medium",
      completed: true,
    },
  ]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Task created successfully");
    setOpen(false);
  };

  const handleToggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    toast.success("Task updated");
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task deleted");
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const highPriorityCount = tasks.filter((t) => !t.completed && t.priority === "high").length;

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

  const pendingTasks = tasks.filter((t) => !t.completed).sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your financial tasks and to-dos</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground mt-2">All tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {pendingCount}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Awaiting action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {completedCount}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Done</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {highPriorityCount}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Urgent tasks</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Task Button */}
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new financial task to your list</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input id="title" placeholder="e.g., Review monthly budget" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Add details..." rows={3} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" required />
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

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Task</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Pending Tasks</h2>
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <Card key={task.id} className="border-l-4 border-l-yellow-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="mt-1 focus:outline-none"
                      >
                        <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                      </button>

                      <div className="flex-1">
                        <p className="font-semibold">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                          <span
                            className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Completed Tasks</h2>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <Card key={task.id} className="opacity-75 border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className="mt-1 focus:outline-none"
                      >
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </button>

                      <div className="flex-1">
                        <p className="font-semibold line-through text-muted-foreground">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-through">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No tasks yet. Create one to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
