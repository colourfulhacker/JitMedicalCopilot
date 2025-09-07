import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { AIPlanner } from "@/components/ai-planner";
import { AIResponseModal } from "@/components/ai-response-modal";
import { Card } from "@/components/ui/card";
import type { AiPlan, User } from "@shared/schema";

interface RecentPlanCardProps {
  plan: AiPlan;
  onClick: () => void;
}

function RecentPlanCard({ plan, onClick }: RecentPlanCardProps) {
  const getVerticalInfo = (challengeId?: string) => {
    if (plan.title.toLowerCase().includes("hospital") || plan.title.toLowerCase().includes("health")) {
      return { icon: "fas fa-heartbeat", color: "text-red-500", vertical: "HealthTech" };
    }
    if (plan.title.toLowerCase().includes("tech") || plan.title.toLowerCase().includes("development")) {
      return { icon: "fas fa-code", color: "text-blue-500", vertical: "IT Development" };
    }
    return { icon: "fas fa-lightbulb", color: "text-amber-500", vertical: "Business" };
  };

  const verticalInfo = getVerticalInfo(plan.challengeId || undefined);
  const timeAgo = plan.createdAt ? new Date(plan.createdAt).toLocaleDateString() : "Recently";

  return (
    <Card 
      className="p-4 cursor-pointer enhanced-card interactive-hover" 
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
      <h4 className="font-semibold mb-2 text-foreground">{plan.title}</h4>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{plan.summary}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs">
          {plan.timeline && (
            <span className="text-blue-600 dark:text-blue-400">
              <i className="fas fa-calendar mr-1"></i>
              {plan.timeline}
            </span>
          )}
        </div>
        <i className="fas fa-arrow-right text-xs text-muted-foreground"></i>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const [selectedPlan, setSelectedPlan] = useState<AiPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: user } = useQuery<User>({
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
        title="AI Business Assistant" 
        subtitle="Generate instant solutions for your business challenges" 
      />
      
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* AI Challenge Input & Recent Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mobile-grid-1">
          <AIPlanner onPlanGenerated={handlePlanGenerated} />
          
          {/* Recent AI Solutions */}
          <Card className="p-4 md:p-6 enhanced-card" data-testid="recent-plans">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gradient">Recent AI Solutions</h3>
                <p className="text-sm text-muted-foreground">Your generated business plans</p>
              </div>
              {recentPlans.length > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {recentPlans.length} plan{recentPlans.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentPlans.length > 0 ? (
                recentPlans.slice(0, 5).map((plan) => (
                  <RecentPlanCard 
                    key={plan.id} 
                    plan={plan} 
                    onClick={() => handlePlanClick(plan)}
                  />
                ))
              ) : (
                <div className="text-center py-12" data-testid="no-plans-message">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <i className="fas fa-lightbulb text-2xl text-primary"></i>
                  </div>
                  <h4 className="text-lg font-medium mb-2">No plans generated yet</h4>
                  <p className="text-muted-foreground mb-4">Start by selecting a category and describing your business challenge</p>
                  <div className="text-xs text-muted-foreground">
                    <i className="fas fa-arrow-left mr-2"></i>
                    Use the AI planner on the left to get started
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Start Guide */}
        {recentPlans.length === 0 && (
          <Card className="p-4 md:p-6 enhanced-card glass-effect">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-rocket text-primary"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gradient">Welcome to AI Business Assistant</h3>
                <p className="text-muted-foreground mb-4">
                  Get instant, actionable business plans powered by AI. Simply describe your challenge and receive:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-chart-line text-emerald-500"></i>
                    <span>Strategic roadmaps</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-target text-blue-500"></i>
                    <span>Success metrics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-shield-alt text-amber-500"></i>
                    <span>Risk assessments</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <AIResponseModal 
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}