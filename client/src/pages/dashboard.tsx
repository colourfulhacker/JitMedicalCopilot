import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { MetricsGrid } from "@/components/metrics-grid";
import { AIPlanner } from "@/components/ai-planner";
import { BusinessVerticals } from "@/components/business-verticals";
import { RevenueAnalytics } from "@/components/revenue-analytics";
import { CommunicationTools } from "@/components/communication-tools";
import { AIResponseModal } from "@/components/ai-response-modal";
import type { AiPlan } from "@shared/schema";

interface RecentPlanCardProps {
  plan: AiPlan;
  onClick: () => void;
}

function RecentPlanCard({ plan, onClick }: RecentPlanCardProps) {
  const getVerticalInfo = (challengeId?: string) => {
    // This would typically come from the challenge data
    // For now, we'll use some heuristics based on the plan content
    if (plan.title.toLowerCase().includes("hospital") || plan.title.toLowerCase().includes("health")) {
      return { icon: "fas fa-heartbeat", color: "text-red-500", vertical: "HealthTech" };
    }
    return { icon: "fas fa-code", color: "text-blue-500", vertical: "IT Development" };
  };

  const verticalInfo = getVerticalInfo(plan.challengeId);
  const timeAgo = plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : "Recently";

  return (
    <div 
      className="ai-response rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors" 
      onClick={onClick}
      data-testid={`recent-plan-${plan.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <i className={`${verticalInfo.icon} ${verticalInfo.color}`}></i>
          <span className="text-sm font-medium text-muted-foreground">{verticalInfo.vertical}</span>
        </div>
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>
      <h4 className="font-medium mb-2">{plan.title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{plan.summary}</p>
      <div className="flex items-center space-x-4 text-xs">
        {plan.pricingInr && (
          <span className="text-emerald-500">
            <i className="fas fa-rupee-sign mr-1"></i>
            ₹{(parseFloat(plan.pricingInr) / 100000).toFixed(1)}L Revenue Potential
          </span>
        )}
        {plan.timeline && (
          <span className="text-blue-500">
            <i className="fas fa-calendar mr-1"></i>
            {plan.timeline}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedPlan, setSelectedPlan] = useState<AiPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/user/current"],
  });

  const { data: recentPlans = [] } = useQuery<AiPlan[]>({
    queryKey: ["/api/plans", user?.id],
    enabled: !!user?.id,
  });

  const handlePlanGenerated = (plan: AiPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handlePlanClick = (plan: AiPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen" data-testid="dashboard-page">
      <Header 
        title="Executive Dashboard" 
        subtitle="AI-powered business intelligence for your ventures" 
      />
      
      <div className="p-8 space-y-8">
        {/* Metrics Overview */}
        <MetricsGrid />

        {/* AI Challenge Input & Recent Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AIPlanner onPlanGenerated={handlePlanGenerated} />
          
          {/* Recent AI Responses */}
          <div className="rounded-xl bg-card border border-border p-6" data-testid="recent-plans">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Recent AI Plans</h3>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {recentPlans.length > 0 ? (
                recentPlans.slice(0, 3).map((plan) => (
                  <RecentPlanCard 
                    key={plan.id} 
                    plan={plan} 
                    onClick={() => handlePlanClick(plan)}
                  />
                ))
              ) : (
                <div className="text-center py-8" data-testid="no-plans-message">
                  <i className="fas fa-lightbulb text-4xl text-muted-foreground mb-4"></i>
                  <p className="text-muted-foreground">No AI plans generated yet.</p>
                  <p className="text-sm text-muted-foreground">Start by describing a business challenge above.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Business Verticals Overview */}
        <BusinessVerticals />

        {/* Revenue Analytics & Pricing Models */}
        <RevenueAnalytics />

        {/* Communication Drafts & AI Tools */}
        <CommunicationTools />
      </div>

      <AIResponseModal 
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
