import DashboardLayout from "@/components/DashboardLayout";
import WhatsAppIntegration from "@/components/WhatsAppIntegration";
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
import { Plus, Calendar, AlertCircle, CheckCircle2, Clock, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Bills() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [bills, setBills] = useState([
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
      status: "pending",
      category: "Insurance",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: "",
    frequency: "monthly",
    category: "Utilities",
  });

  const totalBills = bills.length;
  const pendingBills = bills.filter((b) => b.status === "pending").length;
  const totalDue = bills
    .filter((b) => b.status === "pending")
    .reduce((sum, b) => sum + b.amount, 0);
  const dueSoon = bills.filter((b) => {
    const dueDate = new Date(b.dueDate);
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate <= sevenDaysFromNow && dueDate >= today && b.status === "pending";
  }).length;

  const handleAddBill = () => {
    if (!formData.name || !formData.amount || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newBill = {
      id: Math.max(...bills.map((b) => b.id), 0) + 1,
      name: formData.name,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      frequency: formData.frequency,
      status: "pending",
      category: formData.category,
    };

    setBills([...bills, newBill]);
    setFormData({
      name: "",
      amount: "",
      dueDate: "",
      frequency: "monthly",
      category: "Utilities",
    });
    setOpen(false);
    toast.success("Bill reminder added successfully");
  };

  const handleEditBill = () => {
    if (!formData.name || !formData.amount || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setBills(
      bills.map((b) =>
        b.id === selectedBill.id
          ? {
              ...b,
              name: formData.name,
              amount: parseFloat(formData.amount),
              dueDate: formData.dueDate,
              frequency: formData.frequency,
              category: formData.category,
            }
          : b
      )
    );
    setEditOpen(false);
    setSelectedBill(null);
    setFormData({
      name: "",
      amount: "",
      dueDate: "",
      frequency: "monthly",
      category: "Utilities",
    });
    toast.success("Bill updated successfully");
  };

  const handleDeleteBill = (id: number) => {
    setBills(bills.filter((b) => b.id !== id));
    toast.success("Bill deleted successfully");
  };

  const handleMarkPaid = (id: number) => {
    setBills(
      bills.map((b) =>
        b.id === id ? { ...b, status: "paid" } : b
      )
    );
    toast.success("Bill marked as paid");
  };

  const openEditDialog = (bill: any) => {
    setSelectedBill(bill);
    setFormData({
      name: bill.name,
      amount: bill.amount.toString(),
      dueDate: bill.dueDate,
      frequency: bill.frequency,
      category: bill.category,
    });
    setEditOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bills & Reminders</h1>
          <p className="text-muted-foreground mt-2">Manage your recurring bills and payments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBills}</div>
              <p className="text-xs text-muted-foreground mt-1">Active reminders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {pendingBills}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Amount Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${totalDue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {dueSoon}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Next 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Bill and WhatsApp Buttons */}
        <div className="flex gap-2">
          <WhatsAppIntegration />
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
                <DialogDescription>
                  Create a new recurring bill reminder to track your payments
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bill-name">Bill Name</Label>
                  <Input
                    id="bill-name"
                    placeholder="e.g., Electric Bill"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bill-amount">Amount</Label>
                    <Input
                      id="bill-amount"
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bill-date">Due Date</Label>
                    <Input
                      id="bill-date"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bill-frequency">Frequency</Label>
                    <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                      <SelectTrigger id="bill-frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bill-category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger id="bill-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBill}>Add Bill</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bills List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Bills</h2>
          <div className="grid gap-4">
            {bills.map((bill) => (
              <Card key={bill.id} className={bill.status === "paid" ? "opacity-60" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{bill.name}</h3>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          {bill.category}
                        </span>
                        {bill.status === "paid" ? (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Paid
                          </span>
                        ) : (
                          <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">${bill.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Due {new Date(bill.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="capitalize">{bill.frequency}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {bill.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkPaid(bill.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(bill)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteBill(bill.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Edit Bill Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Bill</DialogTitle>
              <DialogDescription>Update the bill reminder details</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-bill-name">Bill Name</Label>
                <Input
                  id="edit-bill-name"
                  placeholder="e.g., Electric Bill"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-bill-amount">Amount</Label>
                  <Input
                    id="edit-bill-amount"
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-bill-date">Due Date</Label>
                  <Input
                    id="edit-bill-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-bill-frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
                    <SelectTrigger id="edit-bill-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-bill-category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="edit-bill-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Subscription">Subscription</SelectItem>
                      <SelectItem value="Rent">Rent</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditBill}>Update Bill</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
