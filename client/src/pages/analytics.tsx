import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BusinessMetricsWithUSD } from "@/lib/types";
import type { User } from "@shared/schema";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

function MetricCard({ title, value, change, icon, color }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-emerald-500 mt-1">
            <i className="fas fa-arrow-up mr-1"></i>
            {change}
          </p>
        </div>
        <div className={`h-12 w-12 rounded-lg ${color}/10 flex items-center justify-center`}>
          <i className={`${icon} ${color}`}></i>
        </div>
      </div>
    </Card>
  );
}

// Performance metrics will be populated from real monitoring data when available

// Revenue data will be populated from actual business metrics when available

// Client insights will be populated from CRM and customer data when available

// Revenue projections will be calculated from historical data and market analysis when available

export default function Analytics() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const { data: metrics } = useQuery<BusinessMetricsWithUSD>({
    queryKey: ["/api/metrics", user?.id],
    enabled: !!user?.id,
  });

  const { data: exchangeRate } = useQuery({
    queryKey: ["/api/exchange-rate"],
  });

  const formatRevenue = (amount: string) => {
    const num = parseFloat(amount);
    return `₹${(num / 100000).toFixed(1)}L`;
  };

  return (
    <div className="min-h-screen" data-testid="analytics-page">
      <Header 
        title="Business Analytics" 
        subtitle="Comprehensive insights into your HealthTech and IT Development operations" 
      />
      
      <div className="p-8 space-y-8">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="kpi-grid">
          <MetricCard
            title="Total Monthly Revenue"
            value={metrics ? formatRevenue(metrics.monthlyRevenue) : "Loading..."}
            change="Current month"
            icon="fas fa-rupee-sign"
            color="text-emerald-500"
          />
          
          <MetricCard
            title="Active Clients"
            value={metrics?.activeClients.toString() || "Loading..."}
            change="Total active"
            icon="fas fa-users"
            color="text-blue-500"
          />
          
          <MetricCard
            title="AI Plans Generated"
            value={metrics?.plansGenerated.toString() || "Loading..."}
            change="This month"
            icon="fas fa-brain"
            color="text-amber-500"
          />
          
          <MetricCard
            title="Compliance Score"
            value={metrics ? `${metrics.complianceScore}%` : "Loading..."}
            change="Current score"
            icon="fas fa-shield-alt"
            color="text-emerald-500"
          />
        </div>

        <Tabs defaultValue="revenue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="revenue" data-testid="revenue-tab">Revenue Analytics</TabsTrigger>
            <TabsTrigger value="performance" data-testid="performance-tab">Performance</TabsTrigger>
            <TabsTrigger value="clients" data-testid="clients-tab">Client Insights</TabsTrigger>
            <TabsTrigger value="projections" data-testid="projections-tab">Projections</TabsTrigger>
            <TabsTrigger value="reports" data-testid="reports-tab">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6" data-testid="revenue-breakdown">
                <h3 className="text-lg font-semibold mb-6">Current Revenue Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-heartbeat text-red-500"></i>
                      <span className="text-sm font-medium">HealthTech SaaS</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">{metrics ? formatRevenue(metrics.healthtechRevenue) : "Loading..."}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        ${metrics ? (metrics.healthtechRevenueUSD / 1000).toFixed(1) : "0"}K
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-code text-blue-500"></i>
                      <span className="text-sm font-medium">IT Development</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">{metrics ? formatRevenue(metrics.itdevRevenue) : "Loading..."}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        ${metrics ? (metrics.itdevRevenueUSD / 1000).toFixed(1) : "0"}K
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total Monthly</span>
                      <div className="text-right">
                        <p className="font-mono font-semibold">{metrics ? formatRevenue(metrics.monthlyRevenue) : "Loading..."}</p>
                        <p className="font-mono text-sm text-muted-foreground">
                          ${metrics ? (metrics.monthlyRevenueUSD / 1000).toFixed(1) : "0"}K
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6" data-testid="revenue-trends">
                <h3 className="text-lg font-semibold mb-6">Revenue Analytics</h3>
                <div className="text-center py-8">
                  <i className="fas fa-chart-line text-4xl text-muted-foreground mb-4"></i>
                  <p className="text-muted-foreground">Historical revenue trends will appear here</p>
                  <p className="text-sm text-muted-foreground">Data will be populated from business metrics</p>
                </div>
              </Card>
            </div>

            <Card className="p-6" data-testid="currency-info">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Currency Exchange</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Current Rate:</span>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    ₹{metrics?.exchangeRate.toFixed(2) || "83.12"} = $1 USD
                  </span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <h3 className="text-xl font-semibold">System Performance Metrics</h3>
            
            <Card className="p-6" data-testid="performance-metrics">
              <div className="text-center py-8">
                <i className="fas fa-tachometer-alt text-4xl text-muted-foreground mb-4"></i>
                <p className="text-muted-foreground">Performance metrics will appear here</p>
                <p className="text-sm text-muted-foreground">Data will be populated from monitoring systems</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <h3 className="text-xl font-semibold">Client Segment Analysis</h3>
            
            <Card className="p-6" data-testid="client-segments">
              <div className="text-center py-8">
                <i className="fas fa-users text-4xl text-muted-foreground mb-4"></i>
                <p className="text-muted-foreground">Client insights will appear here</p>
                <p className="text-sm text-muted-foreground">Data will be populated from CRM systems</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <h3 className="text-xl font-semibold">Revenue Projections</h3>
            
            <Card className="p-6" data-testid="revenue-projections">
              <div className="text-center py-8">
                <i className="fas fa-chart-bar text-4xl text-muted-foreground mb-4"></i>
                <p className="text-muted-foreground">Revenue projections will appear here</p>
                <p className="text-sm text-muted-foreground">Data will be calculated from historical trends</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Executive Reports</h3>
              <Button data-testid="generate-report-btn">
                <i className="fas fa-file-pdf mr-2"></i>
                Generate Report
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="report-templates">
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="fas fa-chart-bar text-blue-500 text-2xl"></i>
                  <div>
                    <h4 className="font-semibold">Monthly Business Report</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive monthly overview</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" data-testid="monthly-report-btn">
                  Generate
                </Button>
              </Card>
              
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="fas fa-users text-emerald-500 text-2xl"></i>
                  <div>
                    <h4 className="font-semibold">Client Analysis</h4>
                    <p className="text-sm text-muted-foreground">Detailed client insights</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" data-testid="client-analysis-btn">
                  Generate
                </Button>
              </Card>
              
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="fas fa-shield-alt text-amber-500 text-2xl"></i>
                  <div>
                    <h4 className="font-semibold">Compliance Report</h4>
                    <p className="text-sm text-muted-foreground">Regulatory compliance status</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full" data-testid="compliance-report-btn">
                  Generate
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}