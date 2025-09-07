import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ComplianceItem {
  id: string;
  regulation: string;
  status: "compliant" | "review" | "action_required" | "pending";
  lastAudit: string;
  nextReview: string;
  score: number;
  criticalIssues: number;
  description: string;
}

const complianceData: ComplianceItem[] = [
  {
    id: "ndhm",
    regulation: "NDHM (National Digital Health Mission)",
    status: "compliant",
    lastAudit: "2024-12-15",
    nextReview: "2025-03-15",
    score: 95,
    criticalIssues: 0,
    description: "Full compliance with NDHM standards for health data interoperability"
  },
  {
    id: "hipaa",
    regulation: "HIPAA (Health Insurance Portability)",
    status: "review",
    lastAudit: "2024-11-20",
    nextReview: "2025-02-20",
    score: 87,
    criticalIssues: 2,
    description: "Minor updates needed for patient data access controls"
  },
  {
    id: "gdpr",
    regulation: "GDPR (General Data Protection)",
    status: "compliant",
    lastAudit: "2024-12-01",
    nextReview: "2025-06-01",
    score: 92,
    criticalIssues: 0,
    description: "EU clients data protection requirements fully met"
  },
  {
    id: "iso27001",
    regulation: "ISO 27001 Information Security",
    status: "action_required",
    lastAudit: "2024-10-15",
    nextReview: "2025-01-15",
    score: 78,
    criticalIssues: 5,
    description: "Security controls need strengthening for certification"
  },
  {
    id: "sox",
    regulation: "SOX (Sarbanes-Oxley) Financial",
    status: "pending",
    lastAudit: "2024-09-30",
    nextReview: "2025-01-30",
    score: 82,
    criticalIssues: 3,
    description: "Financial controls audit in progress"
  },
  {
    id: "pci",
    regulation: "PCI DSS (Payment Card Industry)",
    status: "compliant",
    lastAudit: "2024-12-10",
    nextReview: "2025-12-10",
    score: 96,
    criticalIssues: 0,
    description: "Payment processing security standards fully compliant"
  }
];

const auditTasks = [
  { id: "1", task: "Update data encryption protocols", priority: "high", dueDate: "2025-01-15", assignee: "Security Team" },
  { id: "2", task: "Review patient consent forms", priority: "medium", dueDate: "2025-01-30", assignee: "Legal Team" },
  { id: "3", task: "Conduct staff training on HIPAA", priority: "high", dueDate: "2025-01-20", assignee: "HR Department" },
  { id: "4", task: "Update privacy policy documentation", priority: "low", dueDate: "2025-02-15", assignee: "Compliance Officer" },
  { id: "5", task: "Implement access control improvements", priority: "high", dueDate: "2025-01-25", assignee: "IT Security" }
];

const recentAudits = [
  { id: "1", type: "Internal Security Audit", date: "2024-12-15", result: "Passed", findings: 3 },
  { id: "2", type: "HIPAA Compliance Review", date: "2024-12-01", result: "Minor Issues", findings: 2 },
  { id: "3", type: "Data Protection Assessment", date: "2024-11-20", result: "Passed", findings: 1 },
  { id: "4", type: "Financial Controls Audit", date: "2024-11-15", result: "In Progress", findings: 0 }
];

export default function Compliance() {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedRegulation, setSelectedRegulation] = useState("");
  const [reportContext, setReportContext] = useState("");
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/user/current"],
  });

  const generateComplianceReport = useMutation({
    mutationFn: async (data: { userId: string; type: string; context: string; recipients: string }) => {
      const response = await apiRequest("POST", "/api/generate-communication", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Compliance Report Generated",
        description: "Your compliance report has been created successfully.",
      });
      setIsReportOpen(false);
      setReportContext("");
      setSelectedRegulation("");
    },
  });

  const handleGenerateReport = () => {
    if (!user?.id || !reportContext.trim()) return;

    const regulation = complianceData.find(item => item.id === selectedRegulation);
    generateComplianceReport.mutate({
      userId: user.id,
      type: "compliance-report",
      context: `Generate a comprehensive compliance report for ${regulation?.regulation || "all regulations"}. Context: ${reportContext}. Include current status, findings, remediation plans, and next steps.`,
      recipients: "Compliance Team, Legal Department, Executive Leadership"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant": return "bg-emerald-100 text-emerald-800";
      case "review": return "bg-amber-100 text-amber-800";
      case "action_required": return "bg-red-100 text-red-800";
      case "pending": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-amber-100 text-amber-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const overallScore = Math.round(complianceData.reduce((sum, item) => sum + item.score, 0) / complianceData.length);

  return (
    <div className="min-h-screen" data-testid="compliance-page">
      <Header 
        title="Compliance Management" 
        subtitle="Healthcare and business regulatory compliance dashboard" 
      />
      
      <div className="p-8 space-y-8">
        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-testid="compliance-overview">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                <p className="text-3xl font-bold text-emerald-500">{overallScore}%</p>
              </div>
              <i className="fas fa-shield-alt text-emerald-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliant</p>
                <p className="text-3xl font-bold text-blue-500">
                  {complianceData.filter(item => item.status === "compliant").length}
                </p>
              </div>
              <i className="fas fa-check-circle text-blue-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Need Review</p>
                <p className="text-3xl font-bold text-amber-500">
                  {complianceData.filter(item => item.status === "review" || item.status === "action_required").length}
                </p>
              </div>
              <i className="fas fa-exclamation-triangle text-amber-500 text-2xl"></i>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
                <p className="text-3xl font-bold text-red-500">
                  {complianceData.reduce((sum, item) => sum + item.criticalIssues, 0)}
                </p>
              </div>
              <i className="fas fa-exclamation-circle text-red-500 text-2xl"></i>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="regulations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="regulations" data-testid="regulations-tab">Regulations</TabsTrigger>
            <TabsTrigger value="audits" data-testid="audits-tab">Audit History</TabsTrigger>
            <TabsTrigger value="tasks" data-testid="tasks-tab">Action Items</TabsTrigger>
            <TabsTrigger value="reports" data-testid="reports-tab">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="regulations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Regulatory Compliance Status</h3>
              <Button onClick={() => setIsReportOpen(true)} data-testid="generate-report-btn">
                <i className="fas fa-file-alt mr-2"></i>
                Generate Report
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="regulations-grid">
              {complianceData.map((item) => (
                <Card key={item.id} className="p-6 hover:shadow-lg transition-all" data-testid={`regulation-${item.id}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2">{item.regulation}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace("_", " ")}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Compliance Score</span>
                      <span className="font-semibold">{item.score}%</span>
                    </div>
                    <Progress value={item.score} className="h-2" />
                    
                    {item.criticalIssues > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Critical Issues</span>
                        <span className="text-red-600 font-semibold">{item.criticalIssues}</span>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Last Audit:</span>
                        <p className="font-medium">{new Date(item.lastAudit).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Review:</span>
                        <p className="font-medium">{new Date(item.nextReview).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid="review-regulation-btn">
                      <i className="fas fa-eye mr-1"></i>
                      Review Details
                    </Button>
                    <Button variant="ghost" size="sm" data-testid="edit-regulation-btn">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audits" className="space-y-6">
            <h3 className="text-xl font-semibold">Recent Audit History</h3>
            
            <div className="grid grid-cols-1 gap-4" data-testid="audit-history">
              {recentAudits.map((audit) => (
                <Card key={audit.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`h-3 w-3 rounded-full ${
                        audit.result === 'Passed' ? 'bg-emerald-500' :
                        audit.result === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'
                      }`}></div>
                      <div>
                        <h4 className="font-semibold">{audit.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(audit.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        audit.result === 'Passed' ? 'bg-emerald-100 text-emerald-800' :
                        audit.result === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {audit.result}
                      </span>
                      {audit.findings > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {audit.findings} findings
                        </span>
                      )}
                      <Button variant="ghost" size="sm" data-testid="view-audit-btn">
                        <i className="fas fa-external-link-alt"></i>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Compliance Action Items</h3>
              <Button data-testid="add-task-btn">
                <i className="fas fa-plus mr-2"></i>
                Add Task
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4" data-testid="audit-tasks">
              {auditTasks.map((task) => (
                <Card key={task.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <h4 className="font-semibold">{task.task}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span>Assigned to: </span>
                          <span className="font-medium">{task.assignee}</span>
                        </div>
                        <div>
                          <span>Due: </span>
                          <span className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" data-testid="edit-task-btn">
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button variant="ghost" size="sm" data-testid="complete-task-btn">
                        <i className="fas fa-check"></i>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <h3 className="text-xl font-semibold">Compliance Reports & Documentation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="report-templates">
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="fas fa-shield-alt text-emerald-500 text-2xl"></i>
                  <div>
                    <h4 className="font-semibold">NDHM Compliance Report</h4>
                    <p className="text-sm text-muted-foreground">Health data standards compliance</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    setSelectedRegulation("ndhm");
                    setIsReportOpen(true);
                  }}
                  data-testid="ndhm-report-btn"
                >
                  Generate
                </Button>
              </Card>
              
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="fas fa-user-shield text-blue-500 text-2xl"></i>
                  <div>
                    <h4 className="font-semibold">HIPAA Assessment</h4>
                    <p className="text-sm text-muted-foreground">Patient data protection status</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedRegulation("hipaa");
                    setIsReportOpen(true);
                  }}
                  data-testid="hipaa-report-btn"
                >
                  Generate
                </Button>
              </Card>
              
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <i className="fas fa-file-contract text-purple-500 text-2xl"></i>
                  <div>
                    <h4 className="font-semibold">Executive Summary</h4>
                    <p className="text-sm text-muted-foreground">Overall compliance overview</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedRegulation("");
                    setIsReportOpen(true);
                  }}
                  data-testid="executive-summary-btn"
                >
                  Generate
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Generation Modal */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-2xl" data-testid="compliance-report-modal">
          <DialogHeader>
            <DialogTitle>Generate Compliance Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Focus</label>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedRegulation ? 
                  `Generate detailed report for ${complianceData.find(r => r.id === selectedRegulation)?.regulation || "selected regulation"}` :
                  "Generate comprehensive compliance overview covering all regulations"
                }
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Additional Context & Requirements</label>
              <Textarea 
                value={reportContext}
                onChange={(e) => setReportContext(e.target.value)}
                rows={4}
                placeholder="Specify any particular focus areas, timeframes, or specific compliance concerns to address in the report..."
                data-testid="report-context-input"
              />
            </div>
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setIsReportOpen(false)} data-testid="cancel-report-btn">
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateReport}
                disabled={generateComplianceReport.isPending || !reportContext.trim()}
                data-testid="generate-compliance-report-btn"
              >
                {generateComplianceReport.isPending ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}