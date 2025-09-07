import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { COMMUNICATION_TYPES } from "@/lib/types";

interface GeneratedCommunication {
  subject: string;
  content: string;
  type: string;
}

export function CommunicationTools() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [context, setContext] = useState("");
  const [recipients, setRecipients] = useState("");
  const [generatedComm, setGeneratedComm] = useState<GeneratedCommunication | null>(null);
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/user/current"],
  });

  const generateCommMutation = useMutation({
    mutationFn: async (data: { userId: string; type: string; context: string; recipients: string }) => {
      const response = await apiRequest("POST", "/api/generate-communication", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedComm(data.generated);
      toast({
        title: "Communication Generated",
        description: "Your professional communication has been drafted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error generating communication:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate communication. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
    setIsDialogOpen(true);
    setContext("");
    setRecipients("");
    setGeneratedComm(null);
  };

  const handleGenerate = () => {
    if (!user?.id || !context.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide context for the communication.",
        variant: "destructive",
      });
      return;
    }

    generateCommMutation.mutate({
      userId: user.id,
      type: selectedType,
      context: context.trim(),
      recipients: recipients.trim()
    });
  };

  const selectedTypeData = COMMUNICATION_TYPES.find(t => t.id === selectedType);

  return (
    <>
      <div className="rounded-xl bg-card border border-border p-6" data-testid="communication-tools">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <i className="fas fa-envelope text-purple-500"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold" data-testid="comm-tools-title">AI Communication Assistant</h3>
            <p className="text-sm text-muted-foreground" data-testid="comm-tools-subtitle">
              Professional drafts for executives and stakeholders
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMMUNICATION_TYPES.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              className="p-4 h-auto flex-col items-start text-left group hover:bg-accent"
              onClick={() => handleTypeClick(type.id)}
              data-testid={`comm-type-${type.id}`}
            >
              <div className={`h-8 w-8 rounded-lg ${type.color}/10 flex items-center justify-center mb-3 group-hover:${type.color}/20 transition-colors`}>
                <i className={`${type.icon} ${type.color}`}></i>
              </div>
              <p className="font-medium mb-1">{type.name}</p>
              <p className="text-xs text-muted-foreground">
                {type.id === "executive-email" && "Board updates, client communication"}
                {type.id === "investor-pitch" && "Funding proposals, grant applications"}
                {type.id === "client-proposal" && "RFP responses, project bids"}
                {type.id === "compliance-report" && "Regulatory updates, audit reports"}
              </p>
            </Button>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="comm-generation-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              {selectedTypeData && (
                <>
                  <div className={`h-10 w-10 rounded-lg ${selectedTypeData.color}/10 flex items-center justify-center`}>
                    <i className={`${selectedTypeData.icon} ${selectedTypeData.color}`}></i>
                  </div>
                  <div>
                    <span data-testid="dialog-title">Generate {selectedTypeData.name}</span>
                    <p className="text-sm font-normal text-muted-foreground">
                      AI-powered professional communication
                    </p>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {!generatedComm ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipients (optional)</label>
                  <Input
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    placeholder="Board members, investors, client contacts..."
                    data-testid="recipients-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Context & Requirements</label>
                  <Textarea
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    rows={6}
                    placeholder={`Describe what you need to communicate:
                    
For Executive Email: Meeting outcomes, strategic updates, performance metrics...
For Investor Pitch: Funding requirements, growth projections, market opportunity...
For Client Proposal: Project scope, technical approach, timeline and pricing...
For Compliance Report: Regulatory status, audit findings, remediation plans...`}
                    data-testid="context-input"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="cancel-generation-btn"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={generateCommMutation.isPending || !context.trim()}
                    data-testid="generate-communication-btn"
                  >
                    {generateCommMutation.isPending ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i>
                        Generate Communication
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6" data-testid="generated-communication">
                <div className="p-6 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border-l-4 border-primary">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Subject</label>
                      <p className="text-lg font-semibold mt-1" data-testid="generated-subject">
                        {generatedComm.subject}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Content</label>
                      <div className="mt-2 prose prose-sm max-w-none dark:prose-invert" data-testid="generated-content">
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {generatedComm.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <i className="fas fa-lightbulb mr-2 text-amber-500"></i>
                    This communication was generated using AI. Review and customize as needed.
                  </p>
                  
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setGeneratedComm(null);
                        setContext("");
                        setRecipients("");
                      }}
                      data-testid="regenerate-btn"
                    >
                      <i className="fas fa-redo mr-2"></i>
                      Regenerate
                    </Button>
                    <Button data-testid="export-communication-btn">
                      <i className="fas fa-download mr-2"></i>
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
