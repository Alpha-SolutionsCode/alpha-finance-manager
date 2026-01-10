import { Button } from "@/components/ui/button";
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
import { MessageCircle, Share2, Download, QrCode, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WhatsAppIntegrationProps {
  phoneNumber?: string;
  onPhoneNumberChange?: (phone: string) => void;
}

export default function WhatsAppIntegration({
  phoneNumber = "",
  onPhoneNumberChange,
}: WhatsAppIntegrationProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [whatsappPhone, setWhatsappPhone] = useState(phoneNumber);

  const sendViaWhatsApp = (message: string) => {
    if (!whatsappPhone) {
      toast.error("Please set your WhatsApp number first");
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const shareReceipt = (vendor: string, amount: number, date: string) => {
    const message = `📄 Receipt from ${vendor}\n💰 Amount: $${amount.toFixed(2)}\n📅 Date: ${date}\n\nShared from Alpha Finance Manager`;
    sendViaWhatsApp(message);
  };

  const shareExpenseReport = (totalExpenses: number, categoryCount: number) => {
    const message = `📊 Expense Report\n💸 Total Expenses: $${totalExpenses.toFixed(2)}\n📂 Categories: ${categoryCount}\n\nShared from Alpha Finance Manager`;
    sendViaWhatsApp(message);
  };

  const shareFinancialSummary = (income: number, expenses: number, savings: number) => {
    const message = `💼 Financial Summary\n💰 Income: $${income.toFixed(2)}\n💸 Expenses: $${expenses.toFixed(2)}\n🏦 Savings: $${savings.toFixed(2)}\n\nShared from Alpha Finance Manager`;
    sendViaWhatsApp(message);
  };

  const copyWhatsAppLink = () => {
    if (!whatsappPhone) {
      toast.error("Please set your WhatsApp number first");
      return;
    }
    const link = `https://wa.me/${whatsappPhone}`;
    navigator.clipboard.writeText(link);
    toast.success("WhatsApp link copied to clipboard!");
  };

  const generateQRCode = () => {
    if (!whatsappPhone) {
      toast.error("Please set your WhatsApp number first");
      return;
    }
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://wa.me/${whatsappPhone}`;
    window.open(qrUrl, "_blank");
    toast.success("QR code opened in new tab");
  };

  const exportToWhatsApp = (data: any, type: string) => {
    let message = "";

    if (type === "expenses") {
      message = `📊 Expense Export\n\n${data
        .map((exp: any) => `• ${exp.description}: $${exp.amount}`)
        .join("\n")}\n\nTotal: $${data.reduce((sum: number, exp: any) => sum + exp.amount, 0).toFixed(2)}`;
    } else if (type === "budgets") {
      message = `📈 Budget Report\n\n${data
        .map((budget: any) => `• ${budget.category}: $${budget.spent}/$${budget.limit}`)
        .join("\n")}`;
    } else if (type === "goals") {
      message = `🎯 Savings Goals\n\n${data
        .map((goal: any) => `• ${goal.name}: $${goal.currentAmount}/$${goal.targetAmount}`)
        .join("\n")}`;
    }

    sendViaWhatsApp(message);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>WhatsApp Integration</DialogTitle>
          <DialogDescription>
            Share your financial data and receipts via WhatsApp
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* WhatsApp Number Setup */}
          <div className="space-y-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900">
            <Label htmlFor="whatsapp-phone">Your WhatsApp Number</Label>
            <div className="flex gap-2">
              <Input
                id="whatsapp-phone"
                placeholder="+1234567890"
                value={whatsappPhone}
                onChange={(e) => {
                  setWhatsappPhone(e.target.value);
                  onPhoneNumberChange?.(e.target.value);
                }}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (whatsappPhone) {
                    toast.success("WhatsApp number saved!");
                  }
                }}
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Include country code (e.g., +1 for USA, +44 for UK)
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyWhatsAppLink}
                className="justify-start"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateQRCode}
                className="justify-start"
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Share Data</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  shareExpenseReport(1250.75, 8)
                }
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Expense Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  shareFinancialSummary(5200, 1250.75, 3949.25)
                }
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Financial Summary
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  shareReceipt("Whole Foods", 125.50, "2024-01-10")
                }
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Receipt
              </Button>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Export & Send</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  exportToWhatsApp(
                    [
                      { description: "Grocery Store", amount: 125.5 },
                      { description: "Gas", amount: 45 },
                      { description: "Movie Tickets", amount: 30 },
                    ],
                    "expenses"
                  )
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Export Expenses
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  exportToWhatsApp(
                    [
                      { category: "Food & Groceries", spent: 425.5, limit: 600 },
                      { category: "Transportation", spent: 245, limit: 300 },
                    ],
                    "budgets"
                  )
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Export Budgets
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() =>
                  exportToWhatsApp(
                    [
                      { name: "Emergency Fund", currentAmount: 8500, targetAmount: 15000 },
                      { name: "Vacation", currentAmount: 2300, targetAmount: 5000 },
                    ],
                    "goals"
                  )
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Export Goals
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
            <p className="text-xs text-blue-900 dark:text-blue-300">
              💡 Tip: WhatsApp links will open WhatsApp Web or your WhatsApp app with a pre-filled message.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
