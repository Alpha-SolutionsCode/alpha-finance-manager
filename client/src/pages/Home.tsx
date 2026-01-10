import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, Zap, Shield, Users, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/20 dark:border-slate-800/20 backdrop-blur-md sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Alpha Finance</span>
          </div>
          <a href={getLoginUrl()}>
            <Button>Sign In</Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Your AI-Powered
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Financial Operating System
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Take control of your finances with intelligent tracking, AI insights, and seamless automation. 
            Manage expenses, budgets, goals, and investments all in one place.
          </p>
          <div className="flex gap-4 justify-center">
            <a href={getLoginUrl()}>
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
            </a>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">Everything you need to master your finances</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="border-white/20 dark:border-slate-800/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Smart Analytics</CardTitle>
              <CardDescription>Real-time insights into your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualize your financial data with beautiful charts and detailed reports. Understand where your money goes.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border-white/20 dark:border-slate-800/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg w-fit mb-4">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>AI Financial Advisor</CardTitle>
              <CardDescription>Personalized recommendations powered by AI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get intelligent suggestions for budgeting, savings optimization, and financial planning tailored to your goals.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border-white/20 dark:border-slate-800/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Goal Tracking</CardTitle>
              <CardDescription>Achieve your financial milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set savings goals, track progress with auto-contributions, and celebrate milestones along the way.
              </p>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="border-white/20 dark:border-slate-800/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg w-fit mb-4">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Bank-Grade Security</CardTitle>
              <CardDescription>Your data is protected with encryption</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                End-to-end encryption, biometric login, and audit logs ensure your financial information stays secure.
              </p>
            </CardContent>
          </Card>

          {/* Feature 5 */}
          <Card className="border-white/20 dark:border-slate-800/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg w-fit mb-4">
                <Users className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <CardTitle>Multi-User Collaboration</CardTitle>
              <CardDescription>Share finances with family or team</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Invite family members or colleagues with role-based permissions for seamless collaboration.
              </p>
            </CardContent>
          </Card>

          {/* Feature 6 */}
          <Card className="border-white/20 dark:border-slate-800/20 bg-white/50 dark:bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg w-fit mb-4">
                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Voice & Receipt OCR</CardTitle>
              <CardDescription>Hands-free expense logging</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Add expenses using voice commands or upload receipts for automatic extraction and categorization.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Take Control?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of users who are already managing their finances smarter with Alpha Finance Manager.
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" variant="secondary" className="gap-2">
              Start Free Today <ArrowRight className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 dark:border-slate-800/20 py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 Alpha Finance Manager. All rights reserved.</p>
            <p className="text-sm mt-2">Your AI-Powered Financial Operating System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
