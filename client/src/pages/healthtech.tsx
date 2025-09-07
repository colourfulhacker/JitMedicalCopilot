import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BusinessMetricsWithUSD } from "@/lib/types";
import type { User } from "@shared/schema";

interface HealthTechProject {
  id: string;
  name: string;
  type: string;
  status: string;
  revenue: string;
  clients: number;
}

// Note: In production, these would come from project management systems
const mockProjects: HealthTechProject[] = [
  { id: "1", name: "Delhi Hospital Network", type: "B2B SaaS", status: "active", revenue: "2500000", clients: 15 },
  { id: "2", name: "Mumbai Labs Integration", type: "Custom Development", status: "planning", revenue: "1800000", clients: 8 },
  { id: "3", name: "Tier-2 City Expansion", type: "Market Expansion", status: "active", revenue: "3200000", clients: 22 }
];

// Note: In production, these would come from compliance monitoring systems
const complianceItems = [
  { id: "ndhm", name: "NDHM Compliance", status: "compliant", lastCheck: "2024-12-15", icon: "fas fa-check-circle text-emerald-500" },
  { id: "hipaa", name: "HIPAA Standards", status: "review", lastCheck: "2024-12-10", icon: "fas fa-exclamation-triangle text-amber-500" },
  { id: "data", name: "Data Localization", status: "compliant", lastCheck: "2024-12-20", icon: "fas fa-check-circle text-emerald-500" },
  { id: "security", name: "Security Audit", status: "pending", lastCheck: "2024-11-25", icon: "fas fa-clock text-blue-500" }
];

export default function HealthTech() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      toast({
        title: "Onboarding Plan Generated",
        description: "Hospital onboarding strategy has been created successfully.",
      });
      setIsOnboardingOpen(false);
    },
  });

  const handleGenerateOnboarding = () => {
    if (!user?.id) return;
    
    generateOnboardingPlan.mutate({
      userId: user.id,
      category: "project",
      description: "Create a comprehensive hospital onboarding strategy for our HealthTech B2B SaaS platform. Include integration timeline, training modules, compliance checks, and success metrics.",
      title: "Hospital Onboarding Strategy"
    });
  };

  const formatRevenue = (amount: string) => {
    const num = parseFloat(amount);
    return `₹${(num / 100000).toFixed(1)}L`;
  };

  return (
    <div className="min-h-screen" data-testid="healthtech-page">
      <Header 
        title="HealthTech Operations" 
        subtitle="B2B SaaS platform for hospitals, labs, and healthcare providers" 
      />
      
      <div className="p-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-testid="healthtech-metrics">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">HealthTech Revenue</p>
                <p className="text-2xl font-bold text-emerald-500">
                  {metrics ? formatRevenue(metrics.healthtechRevenue) : "Loading..."}
                </p>
              </div>
              <i className="fas fa-heartbeat text-red-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Hospitals</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <i className="fas fa-hospital text-blue-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected Labs</p>
                <p className="text-2xl font-bold">28</p>
              </div>
              <i className="fas fa-flask text-purple-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Patient Records</p>
                <p className="text-2xl font-bold">2.4M</p>
              </div>
              <i className="fas fa-users text-amber-500 text-2xl"></i>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects" data-testid="projects-tab">Active Projects</TabsTrigger>
            <TabsTrigger value="onboarding" data-testid="onboarding-tab">Hospital Onboarding</TabsTrigger>
            <TabsTrigger value="compliance" data-testid="compliance-tab">Compliance</TabsTrigger>
            <TabsTrigger value="analytics" data-testid="analytics-tab">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Active HealthTech Projects</h3>
              <Button onClick={() => setIsNewProjectOpen(true)} data-testid="new-project-btn">
                <i className="fas fa-plus mr-2"></i>
                New Project
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="projects-grid">
              {mockProjects.map((project) => (
                <Card key={project.id} className="p-6 hover:shadow-lg transition-all" data-testid={`project-${project.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold mb-1">{project.name}</h4>
                      <span className="text-sm text-muted-foreground">{project.type}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      project.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">{formatRevenue(project.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Clients:</span>
                      <span className="font-medium">{project.clients}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid="manage-project-btn">
                      <i className="fas fa-cog mr-1"></i>
                      Manage
                    </Button>
                    <Button variant="ghost" size="sm" data-testid="view-details-btn">
                      <i className="fas fa-eye"></i>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="onboarding" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Hospital Onboarding Pipeline</h3>
              <Button onClick={() => setIsOnboardingOpen(true)} data-testid="plan-onboarding-btn">
                <i className="fas fa-magic mr-2"></i>
                Generate AI Onboarding Plan
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="onboarding-pipeline">
              <Card className="p-6 border-l-4 border-l-amber-500">
                <h4 className="font-semibold mb-4">Prospecting (12)</h4>
                <div className="space-y-2">
                  <div className="text-sm p-2 bg-muted rounded">AIIMS Rishikesh - Initial Contact</div>
                  <div className="text-sm p-2 bg-muted rounded">Apollo Hospitals - Demo Scheduled</div>
                  <div className="text-sm p-2 bg-muted rounded">Fortis Healthcare - Proposal Sent</div>
                </div>
              </Card>
              
              <Card className="p-6 border-l-4 border-l-blue-500">
                <h4 className="font-semibold mb-4">Integration (8)</h4>
                <div className="space-y-2">
                  <div className="text-sm p-2 bg-muted rounded">Max Hospital - API Setup</div>
                  <div className="text-sm p-2 bg-muted rounded">Medanta - Staff Training</div>
                  <div className="text-sm p-2 bg-muted rounded">BLK Hospital - Data Migration</div>
                </div>
              </Card>
              
              <Card className="p-6 border-l-4 border-l-emerald-500">
                <h4 className="font-semibold mb-4">Active (42)</h4>
                <div className="space-y-2">
                  <div className="text-sm p-2 bg-muted rounded">Manipal Hospitals - Full Deployment</div>
                  <div className="text-sm p-2 bg-muted rounded">Columbia Asia - Live Operations</div>
                  <div className="text-sm p-2 bg-muted rounded">Narayana Health - Scaled Usage</div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <h3 className="text-xl font-semibold">Healthcare Compliance Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="compliance-status">
              {complianceItems.map((item) => (
                <Card key={item.id} className="p-6" data-testid={`compliance-${item.id}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <i className={item.icon}></i>
                      <h4 className="font-semibold">{item.name}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'compliant' ? 'bg-emerald-100 text-emerald-800' : 
                      item.status === 'review' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Last Check: {item.lastCheck}</p>
                  <Button variant="outline" size="sm" data-testid="review-compliance-btn">
                    <i className="fas fa-search mr-1"></i>
                    Review Details
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h3 className="text-xl font-semibold">HealthTech Performance Analytics</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="performance-analytics">
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Monthly Growth Metrics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Hospital Clients</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">+8</span>
                      <span className="text-emerald-500 text-xs">↗ +15%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Patient Records Processed</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">125K</span>
                      <span className="text-emerald-500 text-xs">↗ +12%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Uptime</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">99.8%</span>
                      <span className="text-emerald-500 text-xs">↗ +0.2%</span>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h4 className="font-semibold mb-4">Revenue Breakdown</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">B2B SaaS Subscriptions</span>
                    <span className="font-medium">₹18.5L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Custom Integrations</span>
                    <span className="font-medium">₹6.5L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Support & Training</span>
                    <span className="font-medium">₹3.5L</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total Monthly</span>
                      <span className="text-emerald-500">₹28.5L</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Project Modal */}
      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogContent data-testid="new-project-modal">
          <DialogHeader>
            <DialogTitle>Create New HealthTech Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Project Name</label>
              <Input 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., Chennai Multi-Specialty Integration"
                data-testid="project-name-input"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Project Description</label>
              <Textarea 
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={4}
                placeholder="Describe the project scope, target hospitals, expected outcomes..."
                data-testid="project-description-input"
              />
            </div>
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setIsNewProjectOpen(false)} data-testid="cancel-project-btn">Cancel</Button>
              <Button data-testid="create-project-btn">Create Project</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Onboarding Plan Modal */}
      <Dialog open={isOnboardingOpen} onOpenChange={setIsOnboardingOpen}>
        <DialogContent data-testid="onboarding-modal">
          <DialogHeader>
            <DialogTitle>Generate Hospital Onboarding Strategy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Generate a comprehensive AI-powered hospital onboarding strategy including integration timeline, 
              training modules, compliance requirements, and success metrics.
            </p>
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setIsOnboardingOpen(false)} data-testid="cancel-onboarding-btn">Cancel</Button>
              <Button 
                onClick={handleGenerateOnboarding}
                disabled={generateOnboardingPlan.isPending}
                data-testid="generate-onboarding-btn"
              >
                {generateOnboardingPlan.isPending ? "Generating..." : "Generate Strategy"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}