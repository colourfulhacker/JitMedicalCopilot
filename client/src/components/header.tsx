import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 glass-effect border-b border-border px-8 py-4" data-testid="main-header">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-serif" data-testid="header-title">{title}</h2>
          <p className="text-muted-foreground" data-testid="header-subtitle">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button data-testid="new-challenge-btn">
            <i className="fas fa-plus mr-2"></i>
            New Challenge
          </Button>
          <div className="relative">
            <Button variant="ghost" size="sm" data-testid="notifications-btn">
              <i className="fas fa-bell text-muted-foreground"></i>
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive"></span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
