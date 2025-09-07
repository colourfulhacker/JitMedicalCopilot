import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { BusinessMetricsWithUSD } from "@/lib/types";

interface VerticalCardProps {
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  metrics: Array<{ label: string; value: string }>;
  actions: Array<{ label: string; icon: string; color: string; onClick: () => void }>;
  testId: string;
}

function VerticalCard({ title, subtitle, icon, iconColor, metrics, actions, testId }: VerticalCardProps) {
  return (
    <div className="rounded-xl bg-card border border-border p-6" data-testid={testId}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`h-10 w-10 rounded-lg ${iconColor}/10 flex items-center justify-center`}>
          <i className={`${icon} ${iconColor}`}></i>
        </div>
        <div>
          <h3 className="text-lg font-semibold" data-testid={`${testId}-title`}>{title}</h3>
          <p className="text-sm text-muted-foreground" data-testid={`${testId}-subtitle`}>{subtitle}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 rounded-lg bg-muted/50" data-testid={`${testId}-metric-${index}`}>
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="text-xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-between"
            onClick={action.onClick}
            data-testid={`${testId}-action-${index}`}
          >
            <div className="flex items-center space-x-3">
              <i className={`${action.icon} ${action.color}`}></i>
              <span className="font-medium">{action.label}</span>
            </div>
            <i className="fas fa-arrow-right text-muted-foreground"></i>
          </Button>
        ))}
      </div>
    </div>
  );
}

export function BusinessVerticals() {
  const { data: user } = useQuery({
    queryKey: ["/api/user/current"],
  });

  const { data: metrics } = useQuery<BusinessMetricsWithUSD>({
    queryKey: ["/api/metrics", user?.id],
    enabled: !!user?.id,
  });

  const formatRevenue = (amount: string) => {
    const num = parseFloat(amount);
    return `₹${(num / 100000).toFixed(1)}L`;
  };

  const healthtechActions = [
    {
      label: "Plan Hospital Onboarding",
      icon: "fas fa-hospital",
      color: "text-red-500",
      onClick: () => console.log("Hospital onboarding")
    },
    {
      label: "NDHM Compliance Check",
      icon: "fas fa-shield-alt",
      color: "text-amber-500",
      onClick: () => console.log("Compliance check")
    },
    {
      label: "City Expansion Roadmap",
      icon: "fas fa-map-marked-alt",
      color: "text-blue-500",
      onClick: () => console.log("Expansion plan")
    }
  ];

  const itdevActions = [
    {
      label: "Tech Stack Planner",
      icon: "fas fa-layer-group",
      color: "text-blue-500",
      onClick: () => console.log("Tech stack planning")
    },
    {
      label: "Proposal Generator",
      icon: "fas fa-file-contract",
      color: "text-emerald-500",
      onClick: () => console.log("Proposal generation")
    },
    {
      label: "Hiring Assistant",
      icon: "fas fa-user-plus",
      color: "text-purple-500",
      onClick: () => console.log("Hiring assistance")
    }
  ];

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="animate-pulse rounded-xl bg-muted h-80"></div>
        <div className="animate-pulse rounded-xl bg-muted h-80"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" data-testid="business-verticals">
      <VerticalCard
        title="HealthTech Vertical"
        subtitle="B2B SaaS for Healthcare"
        icon="fas fa-heartbeat"
        iconColor="text-red-500"
        metrics={[
          { label: "Active Hospitals", value: "42" },
          { label: "Monthly ARR", value: formatRevenue(metrics.healthtechRevenue) }
        ]}
        actions={healthtechActions}
        testId="healthtech-vertical"
      />

      <VerticalCard
        title="IT Development"
        subtitle="Custom Software & SaaS"
        icon="fas fa-code"
        iconColor="text-blue-500"
        metrics={[
          { label: "Active Projects", value: "18" },
          { label: "Monthly Revenue", value: formatRevenue(metrics.itdevRevenue) }
        ]}
        actions={itdevActions}
        testId="itdev-vertical"
      />
    </div>
  );
}
