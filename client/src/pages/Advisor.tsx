import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, TrendingUp, Lightbulb, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Streamdown } from "streamdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Advisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "👋 Hello! I'm your AI Financial Advisor. I can help you with:\n\n• **Spending Analysis** - Understand your spending patterns\n• **Savings Optimization** - Get tips to save more\n• **Budget Planning** - Create smart budgets\n• **Financial Forecasting** - Predict future trends\n• **Investment Advice** - General investment insights\n\nWhat would you like to know about your finances?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        spending:
          "Based on your recent transactions, I notice you're spending about **$2,840/month**. Here's the breakdown:\n\n- **Food & Groceries**: 42% ($1,193)\n- **Transportation**: 21% ($596)\n- **Entertainment**: 14% ($398)\n- **Utilities**: 11% ($312)\n- **Other**: 12% ($341)\n\n**Recommendation**: Your grocery spending is slightly high. Consider meal planning to reduce costs by 10-15%.",
        savings:
          "Great news! You're saving **45% of your income** ($2,360/month). Here are ways to optimize further:\n\n1. **Automate transfers** - Set up automatic transfers to savings on payday\n2. **Reduce subscriptions** - Review and cancel unused services (potential $50-100/month)\n3. **Optimize groceries** - Use coupons and buy generic brands (save $100-150/month)\n4. **Negotiate bills** - Call your providers for better rates (save $50-100/month)\n\nWith these changes, you could save an extra **$200-350/month**!",
        budget:
          "I recommend this monthly budget based on your income of $5,200:\n\n- **Needs** (50%): $2,600\n  - Housing, utilities, groceries, transportation\n- **Wants** (30%): $1,560\n  - Entertainment, dining, subscriptions\n- **Savings** (20%): $1,040\n  - Emergency fund, investments, goals\n\nYou're currently at 45% savings, which is excellent! Keep it up.",
        forecast:
          "Based on current trends, here's my forecast for the next 6 months:\n\n📈 **Income**: Stable at $5,200/month\n📉 **Expenses**: Slight increase to $2,950/month (seasonal)\n💰 **Savings**: Average $2,250/month\n\n**6-Month Projection**:\n- Total savings: $13,500\n- Emergency fund: Will reach $15,000 goal ✅\n- Discretionary spending room: $300/month\n\nYou're on track to achieve your goals!",
        investment:
          "Here are some general investment insights:\n\n🎯 **For Beginners**:\n- Start with index funds (S&P 500)\n- Contribute regularly (dollar-cost averaging)\n- Diversify across asset classes\n\n💡 **Your Situation**:\n- Emergency fund: ✅ Almost complete\n- Next step: Start investing 10-15% of savings\n- Recommended allocation: 70% stocks, 30% bonds\n\n⚠️ **Disclaimer**: This is general advice. Consult a financial advisor for personalized recommendations.",
      };

      let response = responses["default"] ||
        "I understand. Could you be more specific? Ask me about:\n- Your spending patterns\n- Ways to save more\n- Budget planning\n- Financial forecasting\n- Investment advice";

      const lowerInput = input.toLowerCase();
      if (lowerInput.includes("spend") || lowerInput.includes("expense")) {
        response = responses.spending;
      } else if (lowerInput.includes("save") || lowerInput.includes("saving")) {
        response = responses.savings;
      } else if (lowerInput.includes("budget")) {
        response = responses.budget;
      } else if (lowerInput.includes("forecast") || lowerInput.includes("predict")) {
        response = responses.forecast;
      } else if (lowerInput.includes("invest")) {
        response = responses.investment;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const suggestedQuestions = [
    "Analyze my spending patterns",
    "How can I save more?",
    "Create a budget for me",
    "Forecast my finances",
    "Investment recommendations",
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold">AI Financial Advisor</h1>
          </div>
          <p className="text-muted-foreground">Get personalized financial insights and recommendations</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col bg-secondary/30 rounded-lg border">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-background border border-border rounded-bl-none"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Streamdown>{message.content}</Streamdown>
                  ) : (
                    <p>{message.content}</p>
                  )}
                  <p className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-muted-foreground"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-background border border-border px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(question);
                    }}
                    className="text-left p-3 rounded-lg bg-background border border-border hover:border-primary hover:bg-accent transition-colors text-sm"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your finances..."
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-sm">Savings Rate</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">45%</p>
              <p className="text-xs text-muted-foreground">Excellent! Keep it up.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <CardTitle className="text-sm">Quick Tip</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Reduce grocery spending by 10% to save $120/month.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-sm">Next Goal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Emergency fund: 67% complete. $5,000 to go!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
