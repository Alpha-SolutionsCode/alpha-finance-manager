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
import { Plus, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Bills() {
  const [open, setOpen] = useState(false);

  // Mock data
  const bills = [
    {
      id: 1,
      name: "Electric Bill",
      amount: 89.99,
      dueDate: "2024-01-15",
      frequency: "monthly",
      status: "pending",
      category: "Utilities",
    },
    {
      id: 2,
      name: "Internet Bill",
      amount: 49.99,
      dueDate: "2024-01-20",
      frequency: "monthly",
      status: "pending",
      category: "Utilities",
    },
    {
      id: 3,
      name: "Car Insurance",
      amount: 120.00,
      dueDate: "2024-01-10",
      frequency: "monthly",
      status: "paid",
      category: "Insurance",
    },
    {
      id: 4,
      name: "Gym Membership",
      amount: 29.99,
      dueDate: "2024-01-25",
      frequency: "monthly",
      status: "pending",
      category: "Subscription",
    },
    {
      id: 5,
      name: "Streaming Service",
      amount: 14.99,
      dueDate: "2024-01-05",
      frequency: "monthly",
      status: "paid",
      category: "Subscription",
    },
  ];

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Bill reminder created successfully");
    setOpen(false);
  };

  const pendingBills = bills.filter((b) => b.status === "pending");
  const totalPending = pendingBills.reduce((sum, b) => sum + b.amount, 0);
  const upcomingCount = pendingBills.filter((b) => {
    const dueDate = new Date(b.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue > 0;
  }).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300";
      case "overdue":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Bills & Reminders</h1>
          <p className="text-muted-foreground">Manage your recurring bills and payments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bills.length}</div>
              <p className="text-xs text-muted-foreground mt-2">Active reminders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {pendingBills.length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Amount Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                ${totalPending.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Due Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{upcomingCount}</div>
              <p className="text-xs text-muted-foreground mt-2">Next 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Bill Button */}
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Bill Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Bill Reminder</DialogTitle>
                <DialogDescription>Create a new bill reminder for tracking</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBill} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billName">Bill Name</Label>
                  <Input id="billName" placeholder="e.g., Electric Bill" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" type="number" placeholder="0.00" step="0.01" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="loan">Loan</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger id="frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="once">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Reminder</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bills List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Bills</h2>
          <div className="grid grid-cols-1 gap-4">
            {bills.map((bill) => {
              const dueDate = new Date(bill.dueDate);
              const today = new Date();
              const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Card key={bill.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{bill.name}</p>
                          <p className="text-sm text-muted-foreground">{bill.category}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-lg">${bill.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          Due {dueDate.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="ml-4 flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            bill.status
                          )}`}
                        >
                          {getStatusIcon(bill.status)}
                          {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                        </span>
                      </div>

                      <div className="ml-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          Mark Paid
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
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
