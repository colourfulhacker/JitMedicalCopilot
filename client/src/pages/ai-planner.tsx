import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { AIPlanner } from "@/components/ai-planner";
import { AIResponseModal } from "@/components/ai-response-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AiPlan } from "@shared/schema";

interface PlanHistoryCardProps {
  plan: AiPlan;
  onClick: () => void;
}

function PlanHistoryCard({ plan, onClick }: PlanHistoryCardProps) {
  const getVerticalInfo = () => {
    if (plan.title.toLowerCase().includes("hospital") || plan.title.toLowerCase().includes("health")) {
      return { icon: "fas fa-heartbeat", color: "text-red-500", vertical: "HealthTech" };
    }
    return { icon: "fas fa-code", color: "text-blue-500", vertical: "IT Development" };
  };

  const verticalInfo = getVerticalInfo();
  const timeAgo = plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : "Recently";

  return (
    <Card className="p-6 cursor-pointer hover:shadow-lg transition-all" onClick={onClick} data-testid={`plan-history-${plan.id}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <i className={`${verticalInfo.icon} ${verticalInfo.color}`}></i>
          <span className="text-sm font-medium text-muted-foreground">{verticalInfo.vertical}</span>
        </div>
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>
      
      <h3 className="font-semibold mb-2">{plan.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{plan.summary}</p>
      
      <div className="flex items-center justify-between">
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
        <Button variant="ghost" size="sm" data-testid="view-plan-btn">
          <i className="fas fa-eye mr-1"></i>
          View Details
        </Button>
      </div>
    </Card>
  );
}

export default function AIPlanning() {
  const [selectedPlan, setSelectedPlan] = useState<AiPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["/api/user/current"],
  });

  const { data: allPlans = [], refetch } = useQuery<AiPlan[]>({
    queryKey: ["/api/plans", user?.id],
    enabled: !!user?.id,
  });

  const handlePlanGenerated = (plan: AiPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
    refetch();
  };

  const handlePlanClick = (plan: AiPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen" data-testid="ai-planner-page">
      <Header 
        title="AI Business Planner" 
        subtitle="Generate comprehensive action plans with AI-powered insights" 
      />
      
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Challenge Input */}
          <div className="lg:col-span-1">
            <AIPlanner onPlanGenerated={handlePlanGenerated} />
          </div>
          
          {/* Quick Templates */}
          <div className="lg:col-span-2">
            <Card className="p-6" data-testid="quick-templates">
              <h3 className="text-lg font-semibold mb-6">Quick Planning Templates</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="p-4 h-auto flex-col items-start text-left" data-testid="template-hospital-onboarding">
                  <div className="flex items-center space-x-3 mb-2">
                    <i className="fas fa-hospital text-red-500"></i>
                    <span className="font-medium">Hospital Onboarding</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Plan hospital client acquisition and integration</p>
                </Button>
                
                <Button variant="outline" className="p-4 h-auto flex-col items-start text-left" data-testid="template-saas-scaling">
                  <div className="flex items-center space-x-3 mb-2">
                    <i className="fas fa-chart-line text-emerald-500"></i>
                    <span className="font-medium">SaaS Scaling</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Scale B2B SaaS operations and revenue</p>
                </Button>
                
                <Button variant="outline" className="p-4 h-auto flex-col items-start text-left" data-testid="template-compliance-audit">
                  <div className="flex items-center space-x-3 mb-2">
                    <i className="fas fa-shield-alt text-amber-500"></i>
                    <span className="font-medium">Compliance Audit</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Prepare for NDHM, HIPAA compliance reviews</p>
                </Button>
                
                <Button variant="outline" className="p-4 h-auto flex-col items-start text-left" data-testid="template-tech-expansion">
                  <div className="flex items-center space-x-3 mb-2">
                    <i className="fas fa-code text-blue-500"></i>
                    <span className="font-medium">Tech Team Expansion</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Plan development team growth and hiring</p>
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Plan History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Generated Plans History</h3>
            <Button variant="outline" data-testid="export-all-plans-btn">
              <i className="fas fa-download mr-2"></i>
              Export All Plans
            </Button>
          </div>
          
          {allPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="plans-history">
              {allPlans.map((plan) => (
                <PlanHistoryCard 
                  key={plan.id} 
                  plan={plan} 
                  onClick={() => handlePlanClick(plan)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center" data-testid="no-plans-state">
              <i className="fas fa-lightbulb text-4xl text-muted-foreground mb-4"></i>
              <h4 className="text-lg font-semibold mb-2">No Plans Generated Yet</h4>
              <p className="text-muted-foreground">Start by describing a business challenge above to generate your first AI-powered action plan.</p>
            </Card>
          )}
        </div>
      </div>

      <AIResponseModal 
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}