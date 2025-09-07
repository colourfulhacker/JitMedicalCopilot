import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CommunicationTools } from "@/components/communication-tools";
import type { Communication } from "@shared/schema";

interface CommunicationDraft {
  id: string;
  type: string;
  subject: string;
  recipient: string;
  status: "draft" | "sent" | "scheduled";
  createdAt: string;
  preview: string;
}

const draftCommunications: CommunicationDraft[] = [
  {
    id: "1",
    type: "Executive Email",
    subject: "Q4 Business Performance Update",
    recipient: "Board of Directors",
    status: "draft",
    createdAt: "2024-12-20",
    preview: "I am pleased to present our Q4 business performance results, which demonstrate strong growth across both HealthTech and IT Development verticals..."
  },
  {
    id: "2",
    type: "Client Proposal",
    subject: "Healthcare SaaS Implementation - Apollo Hospitals",
    recipient: "apollo.hospitals@example.com",
    status: "sent",
    createdAt: "2024-12-18",
    preview: "We are excited to present our comprehensive healthcare SaaS solution tailored for Apollo Hospitals' digital transformation initiative..."
  },
  {
    id: "3",
    type: "Investor Pitch",
    subject: "Series A Funding Proposal - HealthTech Expansion",
    recipient: "sequoia.ventures@example.com",
    status: "scheduled",
    createdAt: "2024-12-15",
    preview: "Our HealthTech platform has achieved significant milestones with 42 active hospital clients and ₹28.5L monthly recurring revenue..."
  },
  {
    id: "4",
    type: "Compliance Report",
    subject: "NDHM Compliance Status - December 2024",
    recipient: "compliance.team@company.com",
    status: "sent",
    createdAt: "2024-12-12",
    preview: "This report outlines our current compliance status with National Digital Health Mission standards and recent audit findings..."
  }
];

const emailTemplates = [
  {
    id: "board-update",
    name: "Board Update",
    category: "Executive",
    description: "Monthly business performance update for board members"
  },
  {
    id: "client-onboarding",
    name: "Client Onboarding",
    category: "Sales",
    description: "Welcome email for new hospital clients with next steps"
  },
  {
    id: "investor-update",
    name: "Investor Update",
    category: "Investment",
    description: "Quarterly progress report for existing investors"
  },
  {
    id: "compliance-notification",
    name: "Compliance Alert",
    category: "Legal",
    description: "Regulatory compliance notifications and updates"
  },
  {
    id: "project-kickoff",
    name: "Project Kickoff",
    category: "Operations",
    description: "Project initiation email for development teams"
  },
  {
    id: "partnership-proposal",
    name: "Partnership Proposal",
    category: "Business Development",
    description: "Strategic partnership opportunity presentation"
  }
];

const upcomingCommunications = [
  { id: "1", title: "Weekly Executive Summary", type: "Email", scheduled: "2025-01-06 09:00", recipients: 5 },
  { id: "2", title: "Investor Quarterly Report", type: "Report", scheduled: "2025-01-15 14:00", recipients: 12 },
  { id: "3", title: "Client Success Stories", type: "Newsletter", scheduled: "2025-01-20 10:00", recipients: 67 }
];

export default function Communications() {
  const [selectedDraft, setSelectedDraft] = useState<CommunicationDraft | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: user } = useQuery({
    queryKey: ["/api/user/current"],
  });

  const { data: communications = [] } = useQuery<Communication[]>({
    queryKey: ["/api/communications", user?.id],
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-emerald-100 text-emerald-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "executive email": return "fas fa-envelope";
      case "client proposal": return "fas fa-file-contract";
      case "investor pitch": return "fas fa-chart-line";
      case "compliance report": return "fas fa-shield-alt";
      default: return "fas fa-file-alt";
    }
  };

  const filteredDrafts = draftCommunications.filter(draft =>
    draft.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = emailTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen" data-testid="communications-page">
      <Header 
        title="Communication Center" 
        subtitle="AI-powered professional communication management" 
      />
      
      <div className="p-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-testid="communication-stats">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Drafts</p>
                <p className="text-2xl font-bold">{draftCommunications.length + communications.length}</p>
              </div>
              <i className="fas fa-drafting-compass text-blue-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sent This Month</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <i className="fas fa-paper-plane text-emerald-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold">{emailTemplates.length}</p>
              </div>
              <i className="fas fa-clipboard-list text-purple-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">{upcomingCommunications.length}</p>
              </div>
              <i className="fas fa-clock text-amber-500 text-2xl"></i>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="generator" data-testid="generator-tab">AI Generator</TabsTrigger>
            <TabsTrigger value="drafts" data-testid="drafts-tab">My Drafts</TabsTrigger>
            <TabsTrigger value="templates" data-testid="templates-tab">Templates</TabsTrigger>
            <TabsTrigger value="scheduled" data-testid="scheduled-tab">Scheduled</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <CommunicationTools />
          </TabsContent>

          <TabsContent value="drafts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Communication Drafts</h3>
              <div className="flex space-x-4">
                <Input 
                  placeholder="Search drafts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                  data-testid="search-drafts-input"
                />
                <Button data-testid="create-draft-btn">
                  <i className="fas fa-plus mr-2"></i>
                  New Draft
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="drafts-grid">
              {filteredDrafts.map((draft) => (
                <Card key={draft.id} className="p-6 hover:shadow-lg transition-all cursor-pointer" data-testid={`draft-${draft.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <i className={`${getTypeIcon(draft.type)} text-primary`}></i>
                      <div>
                        <h4 className="font-semibold">{draft.subject}</h4>
                        <p className="text-sm text-muted-foreground">{draft.type}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(draft.status)}>
                      {draft.status}
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">To: {draft.recipient}</p>
                    <p className="text-sm line-clamp-3">{draft.preview}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(draft.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" data-testid="edit-draft-btn">
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </Button>
                      <Button size="sm" data-testid="send-draft-btn">
                        <i className="fas fa-paper-plane mr-1"></i>
                        Send
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Communication Templates</h3>
              <div className="flex space-x-4">
                <Input 
                  placeholder="Search templates..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                  data-testid="search-templates-input"
                />
                <Button data-testid="create-template-btn">
                  <i className="fas fa-plus mr-2"></i>
                  New Template
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="templates-grid">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="p-6 hover:shadow-lg transition-all cursor-pointer" data-testid={`template-${template.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold mb-1">{template.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <i className="fas fa-file-alt text-muted-foreground"></i>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid="use-template-btn">
                      <i className="fas fa-play mr-1"></i>
                      Use Template
                    </Button>
                    <Button variant="ghost" size="sm" data-testid="edit-template-btn">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Scheduled Communications</h3>
              <Button data-testid="schedule-communication-btn">
                <i className="fas fa-calendar-plus mr-2"></i>
                Schedule New
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4" data-testid="scheduled-grid">
              {upcomingCommunications.map((comm) => (
                <Card key={comm.id} className="p-6" data-testid={`scheduled-${comm.id}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <i className="fas fa-calendar text-blue-500"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold">{comm.title}</h4>
                        <p className="text-sm text-muted-foreground">{comm.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comm.scheduled).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{comm.recipients} recipients</p>
                        <p className="text-xs text-muted-foreground">Ready to send</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" data-testid="edit-scheduled-btn">
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button variant="ghost" size="sm" data-testid="cancel-scheduled-btn">
                          <i className="fas fa-times"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {upcomingCommunications.length === 0 && (
              <Card className="p-12 text-center" data-testid="no-scheduled-state">
                <i className="fas fa-calendar-times text-4xl text-muted-foreground mb-4"></i>
                <h4 className="text-lg font-semibold mb-2">No Scheduled Communications</h4>
                <p className="text-muted-foreground mb-4">Schedule emails and reports to be sent automatically at specific times.</p>
                <Button data-testid="schedule-first-btn">
                  <i className="fas fa-calendar-plus mr-2"></i>
                  Schedule Your First Communication
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}