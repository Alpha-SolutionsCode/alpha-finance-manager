import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useState } from "react";

export default function Reports() {
  const [reportType, setReportType] = useState("monthly");
  const [exportFormat, setExportFormat] = useState("pdf");

  // Mock data for charts
  const monthlyData = [
    { month: "Jan", income: 5200, expenses: 2840, savings: 2360 },
    { month: "Feb", income: 5200, expenses: 3100, savings: 2100 },
    { month: "Mar", income: 5200, expenses: 2500, savings: 2700 },
    { month: "Apr", income: 5200, expenses: 3500, savings: 1700 },
    { month: "May", income: 5200, expenses: 2800, savings: 2400 },
    { month: "Jun", income: 5200, expenses: 3200, savings: 2000 },
  ];

  const expensesByCategory = [
    { name: "Food & Groceries", value: 1200, color: "#ef4444" },
    { name: "Transportation", value: 600, color: "#f97316" },
    { name: "Entertainment", value: 400, color: "#eab308" },
    { name: "Utilities", value: 300, color: "#22c55e" },
    { name: "Healthcare", value: 250, color: "#06b6d4" },
    { name: "Other", value: 90, color: "#8b5cf6" },
  ];

  const cashflowData = [
    { week: "Week 1", inflow: 1300, outflow: 700 },
    { week: "Week 2", inflow: 1300, outflow: 850 },
    { week: "Week 3", inflow: 1300, outflow: 600 },
    { week: "Week 4", inflow: 1300, outflow: 790 },
  ];

  const financialMetrics = [
    { label: "Income", value: "$31,200", change: "+5.2%", icon: TrendingUp, color: "text-green-600 dark:text-green-400" },
    { label: "Expenses", value: "$17,040", change: "-2.1%", icon: TrendingDown, color: "text-red-600 dark:text-red-400" },
    { label: "Savings Rate", value: "45.3%", change: "+3.1%", icon: DollarSign, color: "text-blue-600 dark:text-blue-400" },
  ];

  const handleExport = () => {
    alert(`Exporting report as ${exportFormat.toUpperCase()}...`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive financial analysis and insights</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Export as" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {financialMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{metric.value}</div>
                  <p className={`text-xs font-semibold mt-2 ${metric.color}`}>
                    {metric.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expenses Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>Monthly comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#22c55e" />
                  <Bar dataKey="expenses" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expenses by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Spending breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Savings Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Savings Trend</CardTitle>
              <CardDescription>Monthly savings amount</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="savings" stroke="#06b6d4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cash Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Cash Flow</CardTitle>
              <CardDescription>Inflow vs Outflow</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="inflow" fill="#22c55e" />
                  <Bar dataKey="outflow" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Overall Score</span>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">78/100</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Savings Ratio</span>
                  <span className="font-semibold">45%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Adherence</span>
                  <span className="font-semibold">92%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "92%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Emergency Fund</span>
                  <span className="font-semibold">67%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "67%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  💡 You're saving 45% of your income - excellent work!
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">
                  ⚠️ Entertainment spending increased 15% this month
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900">
                <p className="text-sm font-medium text-green-900 dark:text-green-300">
                  ✅ You're on track to reach your emergency fund goal
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
