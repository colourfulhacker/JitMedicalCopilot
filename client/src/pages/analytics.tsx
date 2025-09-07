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

const performanceMetrics = [
  { name: "API Response Time", value: "145ms", target: "< 200ms", status: "good" },
  { name: "System Uptime", value: "99.8%", target: "> 99.5%", status: "excellent" },
  { name: "Customer Satisfaction", value: "4.8/5", target: "> 4.5", status: "excellent" },
  { name: "Code Coverage", value: "87%", target: "> 80%", status: "good" },
  { name: "Bug Resolution Time", value: "2.4 days", target: "< 3 days", status: "good" },
  { name: "Feature Delivery Rate", value: "95%", target: "> 90%", status: "excellent" }
];

const revenueData = [
  { month: "Jul 2024", healthtech: 24, itdev: 14, total: 38 },
  { month: "Aug 2024", healthtech: 26, itdev: 15, total: 41 },
  { month: "Sep 2024", healthtech: 27, itdev: 16, total: 43 },
  { month: "Oct 2024", healthtech: 28, itdev: 16, total: 44 },
  { month: "Nov 2024", healthtech: 29, itdev: 17, total: 46 },
  { month: "Dec 2024", healthtech: 29, itdev: 17, total: 46 }
];

const clientInsights = [
  { segment: "Large Hospitals (500+ beds)", count: 15, revenue: "₹18.5L", satisfaction: 4.9 },
  { segment: "Medium Hospitals (100-500 beds)", count: 27, revenue: "₹9.8L", satisfaction: 4.7 },
  { segment: "Corporate Clients", count: 12, revenue: "₹12.2L", satisfaction: 4.8 },
  { segment: "Startups & SMEs", count: 8, revenue: "₹4.5L", satisfaction: 4.6 }
];

const projections = [
  { scenario: "Conservative Growth", q1: "₹48L", q2: "₹52L", q3: "₹55L", q4: "₹58L", probability: "85%" },
  { scenario: "Moderate Growth", q1: "₹52L", q2: "₹58L", q3: "₹64L", q4: "₹70L", probability: "65%" },
  { scenario: "Aggressive Growth", q1: "₹58L", q2: "₹68L", q3: "₹78L", q4: "₹88L", probability: "35%" }
];

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
            change="+8 new this week"
            icon="fas fa-users"
            color="text-blue-500"
          />
          
          <MetricCard
            title="AI Plans Generated"
            value={metrics?.plansGenerated.toString() || "Loading..."}
            change="+23 today"
            icon="fas fa-brain"
            color="text-amber-500"
          />
          
          <MetricCard
            title="Compliance Score"
            value={metrics ? `${metrics.complianceScore}%` : "Loading..."}
            change="Excellent status"
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
                <h3 className="text-lg font-semibold mb-6">Revenue Breakdown</h3>
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
                <h3 className="text-lg font-semibold mb-6">6-Month Revenue Trend</h3>
                <div className="space-y-3">
                  {revenueData.map((data, index) => (
                    <div key={data.month} className="flex items-center justify-between p-2">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-red-500">₹{data.healthtech}L</span>
                        <span className="text-blue-500">₹{data.itdev}L</span>
                        <span className="font-semibold">₹{data.total}L</span>
                      </div>
                    </div>
                  ))}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="performance-metrics">
              {performanceMetrics.map((metric, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{metric.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      metric.status === 'excellent' ? 'bg-emerald-100 text-emerald-800' :
                      metric.status === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-semibold">{metric.value}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Target:</span>
                      <span>{metric.target}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <h3 className="text-xl font-semibold">Client Segment Analysis</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="client-segments">
              {clientInsights.map((segment, index) => (
                <Card key={index} className="p-6">
                  <h4 className="font-semibold mb-4">{segment.segment}</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-500">{segment.count}</p>
                      <p className="text-xs text-muted-foreground">Active Clients</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-500">{segment.revenue}</p>
                      <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-500">{segment.satisfaction}</p>
                      <p className="text-xs text-muted-foreground">Satisfaction</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projections" className="space-y-6">
            <h3 className="text-xl font-semibold">2025 Revenue Projections</h3>
            
            <div className="space-y-4" data-testid="revenue-projections">
              {projections.map((projection, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{projection.scenario}</h4>
                    <span className="text-sm bg-muted px-2 py-1 rounded">
                      {projection.probability} probability
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold">{projection.q1}</p>
                      <p className="text-xs text-muted-foreground">Q1 2025</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{projection.q2}</p>
                      <p className="text-xs text-muted-foreground">Q2 2025</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{projection.q3}</p>
                      <p className="text-xs text-muted-foreground">Q3 2025</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{projection.q4}</p>
                      <p className="text-xs text-muted-foreground">Q4 2025</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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