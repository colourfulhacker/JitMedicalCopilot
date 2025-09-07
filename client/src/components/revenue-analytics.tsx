import { useQuery } from "@tanstack/react-query";
import type { BusinessMetricsWithUSD } from "@/lib/types";

export function RevenueAnalytics() {
  const { data: user } = useQuery({
    queryKey: ["/api/user/current"],
  });

  const { data: metrics } = useQuery<BusinessMetricsWithUSD>({
    queryKey: ["/api/metrics", user?.id],
    enabled: !!user?.id,
  });

  const { data: exchangeRate } = useQuery({
    queryKey: ["/api/exchange-rate"],
  });

  if (!metrics) {
    return <div className="animate-pulse rounded-xl bg-muted h-96"></div>;
  }

  const formatINR = (amount: string) => {
    const num = parseFloat(amount);
    return `₹${(num / 100000).toFixed(1)}L`;
  };

  const formatUSD = (amount: number) => {
    return `$${amount.toFixed(1)}K`;
  };

  const totalRevenue = parseFloat(metrics.monthlyRevenue);
  const optimisticGrowth = totalRevenue * 1.73;
  const conservativeGrowth = totalRevenue * 1.28;

  return (
    <div className="rounded-xl bg-card border border-border p-6" data-testid="revenue-analytics">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <i className="fas fa-chart-bar text-emerald-500"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold" data-testid="analytics-title">Revenue Analytics & Pricing Models</h3>
            <p className="text-sm text-muted-foreground" data-testid="analytics-subtitle">
              Real-time financial insights with INR/USD conversion
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">USD Rate:</span>
          <span className="text-sm font-mono bg-muted px-2 py-1 rounded" data-testid="exchange-rate">
            ₹{metrics.exchangeRate.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium" data-testid="revenue-breakdown-title">Revenue Breakdown</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50" data-testid="healthtech-revenue">
              <span className="text-sm">HealthTech SaaS</span>
              <div className="text-right">
                <p className="font-mono text-sm">{formatINR(metrics.healthtechRevenue)}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatUSD(metrics.healthtechRevenueUSD / 1000)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50" data-testid="itdev-revenue">
              <span className="text-sm">IT Development</span>
              <div className="text-right">
                <p className="font-mono text-sm">{formatINR(metrics.itdevRevenue)}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatUSD(metrics.itdevRevenueUSD / 1000)}
                </p>
              </div>
            </div>
            
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between" data-testid="total-revenue">
                <span className="font-medium">Total Monthly</span>
                <div className="text-right">
                  <p className="font-mono font-semibold">{formatINR(metrics.monthlyRevenue)}</p>
                  <p className="font-mono text-sm text-muted-foreground">
                    {formatUSD(metrics.monthlyRevenueUSD / 1000)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Projections */}
        <div className="space-y-4">
          <h4 className="font-medium" data-testid="projections-title">6-Month Projections</h4>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-emerald-500/10" data-testid="optimistic-projection">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">Optimistic Growth</p>
              <p className="font-mono text-lg font-semibold">
                ₹{(optimisticGrowth / 100000).toFixed(1)}L
              </p>
              <p className="text-xs text-muted-foreground">+73% increase</p>
            </div>
            
            <div className="p-3 rounded-lg bg-blue-500/10" data-testid="conservative-projection">
              <p className="text-sm text-blue-700 dark:text-blue-400">Conservative Growth</p>
              <p className="font-mono text-lg font-semibold">
                ₹{(conservativeGrowth / 100000).toFixed(1)}L
              </p>
              <p className="text-xs text-muted-foreground">+28% increase</p>
            </div>
          </div>
        </div>

        {/* Key Pricing Models */}
        <div className="space-y-4">
          <h4 className="font-medium" data-testid="pricing-title">Current Pricing Models</h4>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-border" data-testid="hospital-pricing">
              <p className="text-sm font-medium">Hospital SaaS (per month)</p>
              <p className="font-mono text-sm">₹25,000</p>
            </div>
            
            <div className="p-3 rounded-lg border border-border" data-testid="customdev-pricing">
              <p className="text-sm font-medium">Custom Dev (per project)</p>
              <p className="font-mono text-sm">₹8-35L</p>
            </div>
            
            <div className="p-3 rounded-lg border border-border" data-testid="consulting-pricing">
              <p className="text-sm font-medium">Consulting (per hour)</p>
              <p className="font-mono text-sm">₹5,500</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
