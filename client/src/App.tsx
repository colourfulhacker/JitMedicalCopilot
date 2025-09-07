import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import AIPlanner from "@/pages/ai-planner";
import HealthTech from "@/pages/healthtech";
import ITDevelopment from "@/pages/itdev";
import Analytics from "@/pages/analytics";
import Compliance from "@/pages/compliance";
import Communications from "@/pages/communications";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="ml-64 flex-1">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/planner" component={AIPlanner} />
          <Route path="/healthtech" component={HealthTech} />
          <Route path="/itdev" component={ITDevelopment} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/compliance" component={Compliance} />
          <Route path="/communications" component={Communications} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="md-copilot-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
