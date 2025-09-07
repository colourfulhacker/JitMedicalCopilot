import { useQuery } from "@tanstack/react-query";
import type { BusinessMetricsWithUSD } from "@/lib/types";
import type { User } from "@shared/schema";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
  testId?: string;
}

function MetricCard({ title, value, change, icon, color, testId }: MetricCardProps) {
  return (
    <div className="metric-card rounded-xl bg-card border border-border p-6 transition-all hover:translate-y-[-2px] hover:shadow-lg" data-testid={testId}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground" data-testid={`${testId}-title`}>{title}</p>
          <p className="text-2xl font-bold text-foreground" data-testid={`${testId}-value`}>{value}</p>
          <p className="text-xs text-emerald-500 mt-1" data-testid={`${testId}-change`}>
            <i className="fas fa-arrow-up mr-1"></i>
            {change}
          </p>
        </div>
        <div className={`h-12 w-12 rounded-lg ${color}/10 flex items-center justify-center`}>
          <i className={`${icon} ${color}`}></i>
        </div>
      </div>
    </div>
  );
}

export function MetricsGrid() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const { data: metrics, isLoading } = useQuery<BusinessMetricsWithUSD>({
    queryKey: ["/api/metrics", user?.id],
    enabled: !!user?.id,
  });

  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-muted h-32"></div>
        ))}
      </div>
    );
  }

  const formatRevenue = (amount: string) => {
    const num = parseFloat(amount);
    return `₹${(num / 100000).toFixed(1)}L`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="metrics-grid">
      <MetricCard
        title="Monthly Revenue"
        value={formatRevenue(metrics.monthlyRevenue)}
        change="Updated monthly"
        icon="fas fa-rupee-sign"
        color="text-emerald-500"
        testId="metric-revenue"
      />
      
      <MetricCard
        title="Active Clients"
        value={metrics.activeClients.toString()}
        change="Active relationships"
        icon="fas fa-users"
        color="text-blue-500"
        testId="metric-clients"
      />
      
      <MetricCard
        title="AI Plans Generated"
        value={metrics.plansGenerated.toString()}
        change="Generated this month"
        icon="fas fa-brain"
        color="text-amber-500"
        testId="metric-plans"
      />
      
      <MetricCard
        title="Compliance Score"
        value={`${metrics.complianceScore}%`}
        change="Current score"
        icon="fas fa-shield-alt"
        color="text-emerald-500"
        testId="metric-compliance"
      />
    </div>
  );
}
