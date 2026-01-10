import DashboardLayout from "@/components/DashboardLayout";
import ReceiptScanner, { ScannedReceiptData } from "@/components/ReceiptScanner";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Download, DollarSign, Calendar, Tag, Edit2, Trash2, Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Expenses() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      description: "Grocery Store",
      amount: 125.50,
      category: "Food & Groceries",
      date: "2024-01-10",
      vendor: "Whole Foods",
    },
    {
      id: 2,
      description: "Gas",
      amount: 45.00,
      category: "Transportation",
      date: "2024-01-09",
      vendor: "Shell",
    },
    {
      id: 3,
      description: "Movie Tickets",
      amount: 30.00,
      category: "Entertainment",
      date: "2024-01-08",
      vendor: "AMC Cinemas",
    },
    {
      id: 4,
      description: "Electric Bill",
      amount: 89.99,
      category: "Utilities",
      date: "2024-01-05",
      vendor: "City Power",
    },
    {
      id: 5,
      description: "Restaurant",
      amount: 65.75,
      category: "Food & Groceries",
      date: "2024-01-04",
      vendor: "Olive Garden",
    },
  ]);

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

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Expense added successfully");
    setOpen(false);
  };

  const handleEditExpense = (expense: any) => {
    setSelectedExpense(expense);
    setEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Expense updated successfully");
    setEditOpen(false);
    setSelectedExpense(null);
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
    toast.success("Expense deleted successfully");
  };

  const handleScanReceipt = () => {
    setScannerOpen(true);
  };

  const handleScanComplete = (scannedData: ScannedReceiptData) => {
    const newExpense = {
      id: Math.max(...expenses.map((e) => e.id), 0) + 1,
      description: scannedData.description || scannedData.vendor,
      amount: scannedData.amount,
      category: scannedData.category,
      date: scannedData.date,
      vendor: scannedData.vendor,
    };
    setExpenses([...expenses, newExpense]);
    toast.success(`Receipt added: ${scannedData.vendor}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Track and manage your expenses</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                ${totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredExpenses.length}</div>
              <p className="text-xs text-muted-foreground mt-2">Total records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${(totalExpenses / filteredExpenses.length).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Per transaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:gap-3 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleScanReceipt}>
              <Camera className="h-4 w-4 mr-2" />
              Scan Receipt
            </Button>
            <WhatsAppIntegration />
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>Record a new expense transaction</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="e.g., Grocery Store" required />
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
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendor">Vendor</Label>
                      <Input id="vendor" placeholder="e.g., Whole Foods" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea id="notes" placeholder="Add any notes..." rows={3} />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Expense</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Receipt Scanner */}
        <ReceiptScanner
          open={scannerOpen}
          onOpenChange={setScannerOpen}
          onScanComplete={handleScanComplete}
        />

        {/* Edit Expense Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogDescription>Update expense details</DialogDescription>
            </DialogHeader>
            {selectedExpense && (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    defaultValue={selectedExpense.description}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-amount">Amount</Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      defaultValue={selectedExpense.amount}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select defaultValue={selectedExpense.category}>
                      <SelectTrigger id="edit-category">
                        <SelectValue />
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Date</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      defaultValue={selectedExpense.date}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-vendor">Vendor</Label>
                    <Input
                      id="edit-vendor"
                      defaultValue={selectedExpense.vendor}
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Transactions</CardTitle>
            <CardDescription>Your expense records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{expense.description}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {expense.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                          <span className="text-xs">{expense.vendor}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="font-semibold text-red-600 dark:text-red-400">
                        -${expense.amount.toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditExpense(expense)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No expenses found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
