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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BusinessMetricsWithUSD } from "@/lib/types";
import type { User } from "@shared/schema";

interface ITProject {
  id: string;
  name: string;
  client: string;
  technology: string;
  status: string;
  budget: string;
  timeline: string;
  team: number;
}

// Note: In production, these would come from project management systems
const activeProjects: ITProject[] = [
  { id: "1", name: "Healthcare CRM SaaS", client: "MedTech Solutions", technology: "React, Node.js, PostgreSQL", status: "development", budget: "3500000", timeline: "6 months", team: 8 },
  { id: "2", name: "E-commerce Platform", client: "RetailCorp India", technology: "Next.js, MongoDB, AWS", status: "testing", budget: "2800000", timeline: "4 months", team: 6 },
  { id: "3", name: "Fintech Mobile App", client: "PayFast Ltd", technology: "React Native, Firebase", status: "planning", budget: "4200000", timeline: "8 months", team: 10 }
];

const techStacks = [
  { id: "fullstack", name: "Full Stack Web", stack: "React + Node.js + PostgreSQL", description: "Complete web application with modern frontend and robust backend" },
  { id: "mobile", name: "Mobile App", stack: "React Native + Firebase", description: "Cross-platform mobile application with cloud backend" },
  { id: "saas", name: "SaaS Platform", stack: "Next.js + Prisma + Vercel", description: "Scalable Software-as-a-Service platform" },
  { id: "enterprise", name: "Enterprise System", stack: "Java + Spring + Oracle", description: "Large-scale enterprise application with high reliability" }
];

// Note: In production, these would come from HR and project management systems
const teamMembers = [
  { id: "1", name: "Rahul Kumar", role: "Senior Full Stack Developer", skills: "React, Node.js, AWS", status: "available" },
  { id: "2", name: "Priya Sharma", role: "Frontend Developer", skills: "React, TypeScript, Tailwind", status: "busy" },
  { id: "3", name: "Arjun Patel", role: "Backend Developer", skills: "Node.js, PostgreSQL, Docker", status: "available" },
  { id: "4", name: "Sneha Reddy", role: "Mobile Developer", skills: "React Native, Flutter", status: "available" },
  { id: "5", name: "Amit Singh", role: "DevOps Engineer", skills: "AWS, Docker, Kubernetes", status: "busy" }
];

export default function ITDevelopment() {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isTechPlannerOpen, setIsTechPlannerOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
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
    onSuccess: () => {
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
      category: "project",
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

  const formatRevenue = (amount: string) => {
    const num = parseFloat(amount);
    return `₹${(num / 100000).toFixed(1)}L`;
  };

  return (
    <div className="min-h-screen" data-testid="itdev-page">
      <Header 
        title="IT Development Operations" 
        subtitle="Custom software development and SaaS solutions" 
      />
      
      <div className="p-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-testid="itdev-metrics">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">IT Dev Revenue</p>
                <p className="text-2xl font-bold text-blue-500">
                  {metrics ? formatRevenue(metrics.itdevRevenue) : "Loading..."}
                </p>
              </div>
              <i className="fas fa-code text-blue-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <i className="fas fa-project-diagram text-emerald-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <i className="fas fa-users-cog text-purple-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client Satisfaction</p>
                <p className="text-2xl font-bold">96%</p>
              </div>
              <i className="fas fa-star text-amber-500 text-2xl"></i>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects" data-testid="projects-tab">Active Projects</TabsTrigger>
            <TabsTrigger value="planning" data-testid="planning-tab">Tech Planning</TabsTrigger>
            <TabsTrigger value="team" data-testid="team-tab">Team Management</TabsTrigger>
            <TabsTrigger value="proposals" data-testid="proposals-tab">Client Proposals</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Active Development Projects</h3>
              <Button onClick={() => setIsNewProjectOpen(true)} data-testid="new-project-btn">
                <i className="fas fa-plus mr-2"></i>
                New Project
              </Button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" data-testid="projects-grid">
              {activeProjects.map((project) => (
                <Card key={project.id} className="p-6 hover:shadow-lg transition-all" data-testid={`project-${project.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold mb-1">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      project.status === 'development' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'testing' ? 'bg-amber-100 text-amber-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Tech Stack:</span>
                      <p className="font-medium">{project.technology}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Budget:</span>
                        <p className="font-medium">{formatRevenue(project.budget)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timeline:</span>
                        <p className="font-medium">{project.timeline}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Team Size:</span>
                      <span className="font-medium ml-2">{project.team} developers</span>
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

          <TabsContent value="planning" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Technology Stack Planner</h3>
              <Button onClick={() => setIsTechPlannerOpen(true)} data-testid="tech-planner-btn">
                <i className="fas fa-magic mr-2"></i>
                Generate Tech Plan
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="tech-stacks">
              {techStacks.map((stack) => (
                <Card key={stack.id} className="p-6 hover:shadow-lg transition-all cursor-pointer" data-testid={`stack-${stack.id}`}>
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <i className="fas fa-layer-group text-blue-500"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{stack.name}</h4>
                      <p className="text-sm text-blue-600 font-mono mb-2">{stack.stack}</p>
                      <p className="text-sm text-muted-foreground">{stack.description}</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" data-testid="select-stack-btn">
                    <i className="fas fa-arrow-right mr-2"></i>
                    Select Stack
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Development Team</h3>
              <Button data-testid="hire-developer-btn">
                <i className="fas fa-user-plus mr-2"></i>
                Hire Developer
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="team-grid">
              {teamMembers.map((member) => (
                <Card key={member.id} className="p-6" data-testid={`member-${member.id}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <i className="fas fa-user text-primary"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Skills:</p>
                    <p className="text-sm font-medium">{member.skills}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      member.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {member.status}
                    </span>
                    <Button variant="ghost" size="sm" data-testid="view-profile-btn">
                      <i className="fas fa-eye"></i>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="proposals" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Client Proposals & RFPs</h3>
              <Button onClick={() => setIsProposalOpen(true)} data-testid="generate-proposal-btn">
                <i className="fas fa-file-contract mr-2"></i>
                Generate Proposal
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="proposals-grid">
              <Card className="p-6 border-l-4 border-l-emerald-500">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Healthcare CRM Proposal</h4>
                  <span className="text-emerald-500 font-medium">₹35L</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Complete SaaS solution for hospital management with patient records, billing, and analytics.</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" data-testid="edit-proposal-btn">Edit</Button>
                  <Button size="sm" data-testid="send-proposal-btn">Send</Button>
                </div>
              </Card>
              
              <Card className="p-6 border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">E-commerce Platform</h4>
                  <span className="text-blue-500 font-medium">₹28L</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Full-featured online marketplace with vendor management and payment integration.</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" data-testid="edit-proposal-btn">Edit</Button>
                  <Button size="sm" data-testid="send-proposal-btn">Send</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <Dialog open={isTechPlannerOpen} onOpenChange={setIsTechPlannerOpen}>
        <DialogContent data-testid="tech-planner-modal">
          <DialogHeader>
            <DialogTitle>Generate Technology Architecture Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Technology Stack</label>
              <Select value={selectedTechStack} onValueChange={setSelectedTechStack}>
                <SelectTrigger data-testid="tech-stack-select">
                  <SelectValue placeholder="Choose a technology stack" />
                </SelectTrigger>
                <SelectContent>
                  {techStacks.map((stack) => (
                    <SelectItem key={stack.id} value={stack.id}>{stack.name} - {stack.stack}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setIsTechPlannerOpen(false)} data-testid="cancel-tech-plan-btn">Cancel</Button>
              <Button 
                onClick={handleGenerateTechPlan}
                disabled={generateTechPlan.isPending || !selectedTechStack}
                data-testid="generate-tech-plan-btn"
              >
                {generateTechPlan.isPending ? "Generating..." : "Generate Plan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isProposalOpen} onOpenChange={setIsProposalOpen}>
        <DialogContent className="max-w-2xl" data-testid="proposal-modal">
          <DialogHeader>
            <DialogTitle>Generate Client Proposal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Project Name</label>
                <Input 
                  value={projectDetails.name}
                  onChange={(e) => setProjectDetails({...projectDetails, name: e.target.value})}
                  placeholder="e.g., Healthcare Management System"
                  data-testid="project-name-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Client Name</label>
                <Input 
                  value={projectDetails.client}
                  onChange={(e) => setProjectDetails({...projectDetails, client: e.target.value})}
                  placeholder="e.g., MedTech Solutions Pvt Ltd"
                  data-testid="client-name-input"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Requirements & Scope</label>
              <Textarea 
                value={projectDetails.requirements}
                onChange={(e) => setProjectDetails({...projectDetails, requirements: e.target.value})}
                rows={4}
                placeholder="Detailed project requirements, features, integrations needed..."
                data-testid="requirements-input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Budget Range</label>
                <Input 
                  value={projectDetails.budget}
                  onChange={(e) => setProjectDetails({...projectDetails, budget: e.target.value})}
                  placeholder="e.g., ₹25-35 Lakhs"
                  data-testid="budget-input"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Timeline</label>
                <Input 
                  value={projectDetails.timeline}
                  onChange={(e) => setProjectDetails({...projectDetails, timeline: e.target.value})}
                  placeholder="e.g., 6-8 months"
                  data-testid="timeline-input"
                />
              </div>
            </div>
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setIsProposalOpen(false)} data-testid="cancel-proposal-btn">Cancel</Button>
              <Button 
                onClick={handleGenerateProposal}
                disabled={generateProposal.isPending || !projectDetails.requirements}
                data-testid="generate-proposal-btn"
              >
                {generateProposal.isPending ? "Generating..." : "Generate Proposal"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}