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
import { Plus, Search, Download, TrendingUp, Calendar, Tag, Edit2, Trash2 } from "lucide-react";
import WhatsAppIntegration from "@/components/WhatsAppIntegration";
import { useState } from "react";
import { toast } from "sonner";

export default function Income() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState("all");

  const [incomes, setIncomes] = useState([
    {
      id: 1,
      description: "Monthly Salary",
      amount: 5200.00,
      source: "Salary",
      date: "2024-01-10",
      recurring: true,
    },
    {
      id: 2,
      description: "Freelance Project",
      amount: 800.00,
      source: "Freelance",
      date: "2024-01-08",
      recurring: false,
    },
    {
      id: 3,
      description: "Investment Dividend",
      amount: 150.00,
      source: "Investment",
      date: "2024-01-05",
      recurring: true,
    },
    {
      id: 4,
      description: "Rental Income",
      amount: 1200.00,
      source: "Rental",
      date: "2024-01-01",
      recurring: true,
    },
  ]);

  const sources = ["Salary", "Freelance", "Investment", "Rental", "Business", "Other"];

  const filteredIncomes = incomes.filter((income) => {
    const matchesSearch =
      income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      income.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === "all" || income.source === filterSource;
    return matchesSearch && matchesSource;
  });

  const totalIncome = filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  const recurringIncome = filteredIncomes.filter((inc) => inc.recurring).length;

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Income added successfully");
    setOpen(false);
  };

  const handleEditIncome = (income: any) => {
    setSelectedIncome(income);
    setEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Income updated successfully");
    setEditOpen(false);
    setSelectedIncome(null);
  };

  const handleDeleteIncome = (id: number) => {
    setIncomes(incomes.filter((inc) => inc.id !== id));
    toast.success("Income deleted successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Income</h1>
          <p className="text-muted-foreground">Track and manage your income sources</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredIncomes.length}</div>
              <p className="text-xs text-muted-foreground mt-2">Total records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recurring Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{recurringIncome}</div>
              <p className="text-xs text-muted-foreground mt-2">Active streams</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 md:flex-row md:gap-3 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search income..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map((src) => (
                  <SelectItem key={src} value={src}>
                    {src}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <WhatsAppIntegration />
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Income
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Income</DialogTitle>
                  <DialogDescription>Record a new income transaction</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddIncome} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="e.g., Monthly Salary" required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input id="amount" type="number" placeholder="0.00" step="0.01" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">Source</Label>
                      <Select>
                        <SelectTrigger id="source">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          {sources.map((src) => (
                            <SelectItem key={src} value={src}>
                              {src}
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
                    <div className="space-y-3 p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="recurring" className="rounded" />
                        <Label htmlFor="recurring" className="cursor-pointer text-sm">
                          Recurring income
                        </Label>
                      </div>
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
                    <Button type="submit">Add Income</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Edit Income Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Income</DialogTitle>
              <DialogDescription>Update income details</DialogDescription>
            </DialogHeader>
            {selectedIncome && (
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    defaultValue={selectedIncome.description}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-amount">Amount</Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      defaultValue={selectedIncome.amount}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-source">Source</Label>
                    <Select defaultValue={selectedIncome.source}>
                      <SelectTrigger id="edit-source">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((src) => (
                          <SelectItem key={src} value={src}>
                            {src}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    defaultValue={selectedIncome.date}
                    required
                  />
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

        {/* Income List */}
        <Card>
          <CardHeader>
            <CardTitle>Income Transactions</CardTitle>
            <CardDescription>Your income records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredIncomes.length > 0 ? (
                filteredIncomes.map((income) => (
                  <div
                    key={income.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{income.description}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {income.source}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(income.date).toLocaleDateString()}
                          </span>
                          {income.recurring && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                              Recurring
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="font-semibold text-green-600 dark:text-green-400">
                        +${income.amount.toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditIncome(income)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteIncome(income.id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No income records found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
