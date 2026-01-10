import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import SavingsGoals from "./pages/SavingsGoals";
import Income from "./pages/Income";
import Bills from "./pages/Bills";
import Reports from "./pages/Reports";
import Tasks from "./pages/Tasks";
import Advisor from "./pages/Advisor";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/expenses" component={Expenses} />
      <Route path="/income" component={Income} />
      <Route path="/budgets" component={Budgets} />
      <Route path="/goals" component={SavingsGoals} />
      <Route path="/bills" component={Bills} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/reports" component={Reports} />
      <Route path="/advisor" component={Advisor} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
