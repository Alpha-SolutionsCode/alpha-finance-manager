import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, TrendingUp, PieChart, Target, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: "user" | "advisor";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "How can I reduce my expenses?",
  "What's my savings rate?",
  "Should I increase my budget for groceries?",
  "How am I doing financially this month?",
  "What are my spending patterns?",
  "Can you forecast my savings?",
];

export default function Advisor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "advisor",
      content: "Hello! I'm your AI Financial Advisor. I can help you analyze your spending, optimize your budget, and provide personalized financial insights. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response with a delay
    setTimeout(() => {
      const advisorResponses: { [key: string]: string } = {
        "reduce expenses": "Based on your spending patterns, I recommend:\n\n• Cut dining out by 30% (save ~$150/month)\n• Review subscriptions (potential $45/month savings)\n• Use public transport 2x weekly (save ~$80/month)\n\nTotal potential savings: $275/month",
        "savings rate": "Your current savings rate is 38% of your income.\n\n• Monthly Income: $5,200\n• Monthly Expenses: $2,840\n• Monthly Savings: $2,360\n\nThis is excellent! You're saving well above the recommended 20%.",
        "grocery budget": "Your current grocery spending is $425.50/month on a $600 budget.\n\nYou're at 71% of your budget, which is healthy. I recommend:\n• Meal planning to reduce impulse purchases\n• Using grocery apps for discounts\n• Buying store brands (save ~$30-50/month)",
        "doing financially": "Here's your financial summary:\n\n✓ Total Balance: $24,582.50\n✓ Monthly Income: $5,200\n✓ Monthly Expenses: $2,840\n✓ Savings Rate: 38%\n✓ Budget Status: 3 categories at risk\n\nOverall: You're in great financial health!",
        "spending patterns": "Your top spending categories:\n\n1. Food & Groceries: $425.50 (15%)\n2. Utilities: $189.97 (7%)\n3. Transportation: $245 (9%)\n4. Entertainment: $180 (6%)\n5. Other: $1,200 (43%)\n\nConsider reviewing the 'Other' category for optimization opportunities.",
        "forecast savings": "Based on your current trajectory:\n\n• Next 3 months: +$7,080\n• Next 6 months: +$14,160\n• Next 12 months: +$28,320\n\nAt this rate, you'll reach your $15,000 emergency fund goal in 6.4 months!",
      };

      let response = "I can help you with that! Some areas I can assist with:\n\n• Expense optimization\n• Savings forecasting\n• Budget recommendations\n• Spending pattern analysis\n• Financial health assessment\n\nWhat would you like to explore?";

      const lowerInput = messageText.toLowerCase();
      for (const [key, value] of Object.entries(advisorResponses)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
      }

      const advisorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "advisor",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, advisorMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 h-[calc(100vh-120px)] flex flex-col">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Financial Advisor</h1>
          <p className="text-muted-foreground mt-2">Get personalized financial insights and recommendations</p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col bg-card border rounded-lg overflow-hidden">
            {/* Messages */}
            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-2 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground px-4 py-3 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4 space-y-3">
              {/* Suggested Questions */}
              {messages.length <= 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Suggested questions:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedQuestions.slice(0, 4).map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(question)}
                        className="text-xs text-left p-2 rounded border border-border hover:bg-accent transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ask me anything about your finances..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar - Hidden on mobile, visible on lg */}
          <div className="hidden lg:flex flex-col gap-4">
            {/* Quick Insights */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs">
                  <p className="text-muted-foreground">Savings Rate</p>
                  <p className="font-semibold text-lg">38%</p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Monthly Savings</p>
                  <p className="font-semibold text-lg text-green-600 dark:text-green-400">
                    +$2,360
                  </p>
                </div>
                <div className="text-xs">
                  <p className="text-muted-foreground">Budget Health</p>
                  <p className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                    Good
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-900">
                  <p className="font-semibold text-amber-900 dark:text-amber-100">
                    Budget Alert
                  </p>
                  <p className="text-amber-800 dark:text-amber-200">
                    Dining out at 89% of budget
                  </p>
                </div>
                <div className="text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-900">
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    Great Job!
                  </p>
                  <p className="text-green-800 dark:text-green-200">
                    Savings goal on track
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
