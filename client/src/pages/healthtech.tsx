import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIPlanner } from "@/components/ai-planner";
import { AIResponseModal } from "@/components/ai-response-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BusinessMetricsWithUSD } from "@/lib/types";
import type { User, AiPlan } from "@shared/schema";

// Real compliance items - these would come from compliance monitoring systems in production
const complianceItems = [
  { id: "ndhm", name: "NDHM Compliance", status: "compliant", lastCheck: "Current", icon: "fas fa-check-circle text-emerald-500" },
  { id: "hipaa", name: "HIPAA Standards", status: "review", lastCheck: "In Progress", icon: "fas fa-exclamation-triangle text-amber-500" },
  { id: "data", name: "Data Localization", status: "compliant", lastCheck: "Current", icon: "fas fa-check-circle text-emerald-500" },
  { id: "security", name: "Security Audit", status: "pending", lastCheck: "Scheduled", icon: "fas fa-clock text-blue-500" }
];

export default function HealthTech() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AiPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [onboardingDetails, setOnboardingDetails] = useState({ hospitalName: "", size: "", requirements: "" });
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const { data: metrics } = useQuery<BusinessMetricsWithUSD>({
    queryKey: ["/api/metrics", user?.id],
    enabled: !!user?.id,
  });

  const generateOnboardingPlan = useMutation({
    mutationFn: async (data: { userId: string; category: string; description: string; title: string }) => {
      const response = await apiRequest("POST", "/api/generate-plan", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedPlan(data.plan);
      setIsModalOpen(true);
      toast({
        title: "Onboarding Plan Generated",
        description: "Hospital onboarding strategy has been created successfully.",
      });
      setIsOnboardingOpen(false);
    },
  });

  const handleGenerateOnboarding = () => {
    if (!user?.id || !onboardingDetails.requirements) return;
    
    generateOnboardingPlan.mutate({
      userId: user.id,
      category: "healthcare",
      description: `Create a comprehensive hospital onboarding strategy for ${onboardingDetails.hospitalName} (${onboardingDetails.size}). Requirements: ${onboardingDetails.requirements}. Include integration timeline, training modules, compliance checks, NDHM integration, HIPAA compliance, and success metrics.`,
      title: `${onboardingDetails.hospitalName} Onboarding Strategy`
    });
  };

  const handlePlanGenerated = (plan: AiPlan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const formatRevenue = (amount: string) => {
    const num = parseFloat(amount);
    return `₹${(num / 100000).toFixed(1)}L`;
  };

  return (
    <div className="min-h-screen" data-testid="healthtech-page">
      <Header 
        title="HealthTech Solutions" 
        subtitle="B2B SaaS platform for hospitals, labs, and healthcare providers" 
      />
      
      <div className="p-4 md:p-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" data-testid="healthtech-metrics">
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground truncate">HealthTech Revenue</p>
                <p className="text-xl md:text-2xl font-bold text-emerald-500 truncate">
                  {metrics ? formatRevenue(metrics.healthtechRevenue) : "Loading..."}
                </p>
              </div>
              <i className="fas fa-heartbeat text-red-500 text-xl md:text-2xl flex-shrink-0 ml-2"></i>
            </div>
          </Card>
          
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground truncate">Total Clients</p>
                <p className="text-xl md:text-2xl font-bold truncate">
                  {metrics?.activeClients || 0}
                </p>
              </div>
              <i className="fas fa-hospital text-blue-500 text-xl md:text-2xl flex-shrink-0 ml-2"></i>
            </div>
          </Card>
          
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground truncate">Generated Plans</p>
                <p className="text-xl md:text-2xl font-bold truncate">
                  {metrics?.plansGenerated || 0}
                </p>
              </div>
              <i className="fas fa-flask text-purple-500 text-xl md:text-2xl flex-shrink-0 ml-2"></i>
            </div>
          </Card>
          
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground truncate">Compliance Score</p>
                <p className="text-xl md:text-2xl font-bold truncate">
                  {metrics ? `${metrics.complianceScore}%` : "Loading..."}
                </p>
              </div>
              <i className="fas fa-shield-alt text-amber-500 text-xl md:text-2xl flex-shrink-0 ml-2"></i>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* AI Challenge Planner */}
          <AIPlanner onPlanGenerated={handlePlanGenerated} />

          {/* HealthTech Tools */}
          <Card className="p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">HealthTech Tools</h3>
            <div className="space-y-4">
              <Button 
                onClick={() => setIsOnboardingOpen(true)} 
                className="w-full justify-start h-auto p-4"
                variant="outline"
                data-testid="onboarding-btn"
              >
                <div className="flex items-center space-x-3">
                  <i className="fas fa-hospital-user text-emerald-500"></i>
                  <div className="text-left">
                    <div className="font-medium">Hospital Onboarding Planner</div>
                    <div className="text-sm text-muted-foreground">Create tailored onboarding strategies</div>
                  </div>
                </div>
              </Button>
            </div>
          </Card>
        </div>

        {/* Compliance Overview */}
        <Card className="p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceItems.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <i className={item.icon}></i>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={
                    item.status === 'compliant' ? 'default' : 
                    item.status === 'review' ? 'secondary' : 
                    'outline'
                  } className="text-xs">
                    {item.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{item.lastCheck}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Hospital Onboarding Modal */}
      <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Hospital Onboarding Planner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Hospital Name</label>
              <Input 
                value={onboardingDetails.hospitalName}
                onChange={(e) => setOnboardingDetails({...onboardingDetails, hospitalName: e.target.value})}
                placeholder="e.g., Apollo Hospitals"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Hospital Size</label>
              <Input 
                value={onboardingDetails.size}
                onChange={(e) => setOnboardingDetails({...onboardingDetails, size: e.target.value})}
                placeholder="e.g., 500+ beds, Large Multi-specialty"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Onboarding Requirements</label>
              <Textarea 
                value={onboardingDetails.requirements}
                onChange={(e) => setOnboardingDetails({...onboardingDetails, requirements: e.target.value})}
                placeholder="Describe the hospital's specific needs, existing systems, integration requirements, compliance needs, timeline constraints..."
                rows={4}
              />
            </div>
            <Button 
              onClick={handleGenerateOnboarding} 
              disabled={!onboardingDetails.requirements || generateOnboardingPlan.isPending}
              className="w-full"
            >
              {generateOnboardingPlan.isPending ? "Generating..." : "Generate Onboarding Plan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AIResponseModal 
        plan={selectedPlan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}