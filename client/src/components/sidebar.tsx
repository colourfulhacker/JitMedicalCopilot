import { Link, useLocation } from "wouter";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: "fas fa-tachometer-alt" },
  { name: "AI Planner", href: "/planner", icon: "fas fa-lightbulb" },
  { name: "HealthTech", href: "/healthtech", icon: "fas fa-heartbeat" },
  { name: "IT Development", href: "/itdev", icon: "fas fa-code" },
  { name: "Analytics", href: "/analytics", icon: "fas fa-chart-line" },
  { name: "Compliance", href: "/compliance", icon: "fas fa-shield-alt" },
  { name: "Communications", href: "/communications", icon: "fas fa-envelope" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass-effect border-r border-border transition-transform">
      <div className="flex h-full flex-col px-6 py-8">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <i className="fas fa-brain text-primary-foreground text-lg" data-testid="logo-icon"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif" data-testid="app-title">MD Co-Pilot</h1>
              <p className="text-xs text-muted-foreground" data-testid="app-subtitle">Executive AI Assistant</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mb-6 p-4 rounded-lg bg-card border border-border" data-testid="profile-section">
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
              alt="Jit Banerjee - Executive Profile" 
              className="w-12 h-12 rounded-full object-cover"
              data-testid="profile-image"
            />
            <div>
              <p className="font-semibold text-sm" data-testid="user-name">Jit Banerjee</p>
              <p className="text-xs text-muted-foreground" data-testid="user-role">Managing Director</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2" data-testid="navigation-menu">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`nav-item flex items-center space-x-3 rounded-lg px-3 py-2 cursor-pointer transition-all ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent hover:translate-x-1"
                }`} data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <i className={`${item.icon} w-5`}></i>
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="border-t border-border pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            data-testid="theme-toggle"
          >
            <i className={`${theme === "light" ? "fas fa-moon" : "fas fa-sun"} w-5 mr-3`}></i>
            <span className="font-medium">
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
