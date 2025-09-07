import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIPlanner } from "@/components/ai-planner";
import { AIResponseModal } from "@/components/ai-response-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BusinessMetricsWithUSD } from "@/lib/types";
import type { User, AiPlan } from "@shared/schema";

const techStacks = [
  { id: "fullstack", name: "Full Stack Web", stack: "React + Node.js + PostgreSQL", description: "Complete web application with modern frontend and robust backend" },
  { id: "mobile", name: "Mobile App", stack: "React Native + Firebase", description: "Cross-platform mobile application with cloud backend" },
  { id: "saas", name: "SaaS Platform", stack: "Next.js + Prisma + Vercel", description: "Scalable Software-as-a-Service platform" },
  { id: "enterprise", name: "Enterprise System", stack: "Java + Spring + Oracle", description: "Large-scale enterprise application with high reliability" }
];

export default function ITDevelopment() {
  const [isTechPlannerOpen, setIsTechPlannerOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AiPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectDetails, setProjectDetails] = useState({ name: "", client: "", requirements: "", budget: "", timeline: "" });
  const [selectedTechStack, setSelectedTechStack] = useState("");
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const { data: metrics } = useQuery<BusinessMetricsWithUSD>({
    queryKey: ["/api/metrics", user?.id],
    enabled: !!user?.id,
  });

  const generateTechPlan = useMutation({
    mutationFn: async (data: { userId: string; category: string; description: string; title: string }) => {
      const response = await apiRequest("POST", "/api/generate-plan", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedPlan(data.plan);
      setIsModalOpen(true);
      toast({
        title: "Tech Plan Generated",
        description: "Technical architecture plan has been created successfully.",
      });
      setIsTechPlannerOpen(false);
    },
  });

  const generateProposal = useMutation({
    mutationFn: async (data: { userId: string; type: string; context: string; recipients: string }) => {
      const response = await apiRequest("POST", "/api/generate-communication", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Proposal Generated",
        description: "Client proposal has been drafted successfully.",
      });
      setIsProposalOpen(false);
    },
  });

  const handleGenerateTechPlan = () => {
    if (!user?.id || !selectedTechStack) return;
    
    const selectedStack = techStacks.find(stack => stack.id === selectedTechStack);
    generateTechPlan.mutate({
      userId: user.id,
      category: "technology",
      description: `Create a comprehensive technical architecture plan for a ${selectedStack?.name} project using ${selectedStack?.stack}. Include development phases, team structure, timeline, cost estimation in INR, risk assessment, and deployment strategy.`,
      title: `${selectedStack?.name} Architecture Plan`
    });
  };

  const handleGenerateProposal = () => {
    if (!user?.id || !projectDetails.requirements) return;
    
    generateProposal.mutate({
      userId: user.id,
      type: "client-proposal",
      context: `Project: ${projectDetails.name}\nClient: ${projectDetails.client}\nRequirements: ${projectDetails.requirements}\nBudget: ${projectDetails.budget}\nTimeline: ${projectDetails.timeline}`,
      recipients: projectDetails.client
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
    <div className="min-h-screen" data-testid="itdev-page">
      <Header 
        title="IT Development Solutions" 
        subtitle="Custom software development and technical architecture planning" 
      />
      
      <div className="p-4 md:p-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" data-testid="itdev-metrics">
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground truncate">IT Dev Revenue</p>
                <p className="text-xl md:text-2xl font-bold text-blue-500 truncate">
                  {metrics ? formatRevenue(metrics.itdevRevenue) : "Loading..."}
                </p>
              </div>
              <i className="fas fa-code text-blue-500 text-xl md:text-2xl flex-shrink-0 ml-2"></i>
            </div>
          </Card>
          
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-muted-foreground truncate">Active Plans</p>
                <p className="text-xl md:text-2xl font-bold truncate">
                  {metrics?.plansGenerated || 0}
                </p>
              </div>
              <i className="fas fa-project-diagram text-emerald-500 text-xl md:text-2xl flex-shrink-0 ml-2"></i>
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
              <i className="fas fa-users-cog text-purple-500 text-xl md:text-2xl flex-shrink-0 ml-2"></i>
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
              <i className="fas fa-star text-amber-500 text-xl md:text-2xl flex-shrink-0 ml-2"></i>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* AI Challenge Planner */}
          <AIPlanner onPlanGenerated={handlePlanGenerated} />

          {/* Quick Actions */}
          <Card className="p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">IT Development Tools</h3>
            <div className="space-y-4">
              <Button 
                onClick={() => setIsTechPlannerOpen(true)} 
                className="w-full justify-start h-auto p-4"
                variant="outline"
                data-testid="tech-planner-btn"
              >
                <div className="flex items-center space-x-3">
                  <i className="fas fa-drafting-compass text-blue-500"></i>
                  <div className="text-left">
                    <div className="font-medium">Technical Architecture Planner</div>
                    <div className="text-sm text-muted-foreground">Generate technical specs and architecture plans</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                onClick={() => setIsProposalOpen(true)} 
                className="w-full justify-start h-auto p-4"
                variant="outline"
                data-testid="proposal-btn"
              >
                <div className="flex items-center space-x-3">
                  <i className="fas fa-file-contract text-emerald-500"></i>
                  <div className="text-left">
                    <div className="font-medium">Client Proposal Generator</div>
                    <div className="text-sm text-muted-foreground">Create professional project proposals</div>
                  </div>
                </div>
              </Button>
            </div>
          </Card>
        </div>

        {/* Technology Stack Reference */}
        <Card className="p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-4">Technology Stack Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStacks.map((stack) => (
              <div key={stack.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <h4 className="font-medium mb-2">{stack.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{stack.stack}</p>
                <p className="text-xs text-muted-foreground">{stack.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tech Architecture Planner Modal */}
      <Dialog open={isTechPlannerOpen} onOpenChange={setIsTechPlannerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Technical Architecture Planner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Technology Stack</label>
              <Select value={selectedTechStack} onValueChange={setSelectedTechStack}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a tech stack" />
                </SelectTrigger>
                <SelectContent>
                  {techStacks.map((stack) => (
                    <SelectItem key={stack.id} value={stack.id}>
                      {stack.name} - {stack.stack}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateTechPlan} 
              disabled={!selectedTechStack || generateTechPlan.isPending}
              className="w-full"
            >
              {generateTechPlan.isPending ? "Generating..." : "Generate Architecture Plan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Proposal Generator Modal */}
      <Dialog open={isProposalOpen} onOpenChange={setIsProposalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Client Proposal Generator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Project Name</label>
              <Input 
                value={projectDetails.name}
                onChange={(e) => setProjectDetails({...projectDetails, name: e.target.value})}
                placeholder="e.g., Healthcare Management System"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Client Name</label>
              <Input 
                value={projectDetails.client}
                onChange={(e) => setProjectDetails({...projectDetails, client: e.target.value})}
                placeholder="e.g., Apollo Hospitals"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Project Requirements</label>
              <Textarea 
                value={projectDetails.requirements}
                onChange={(e) => setProjectDetails({...projectDetails, requirements: e.target.value})}
                placeholder="Describe the project requirements, features, and objectives..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Budget Range</label>
                <Input 
                  value={projectDetails.budget}
                  onChange={(e) => setProjectDetails({...projectDetails, budget: e.target.value})}
                  placeholder="e.g., ₹25-35L"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Timeline</label>
                <Input 
                  value={projectDetails.timeline}
                  onChange={(e) => setProjectDetails({...projectDetails, timeline: e.target.value})}
                  placeholder="e.g., 6-8 months"
                />
              </div>
            </div>
            <Button 
              onClick={handleGenerateProposal} 
              disabled={!projectDetails.requirements || generateProposal.isPending}
              className="w-full"
            >
              {generateProposal.isPending ? "Generating..." : "Generate Proposal"}
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