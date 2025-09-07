import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AiPlan } from "@shared/schema";
import type { AIResponse } from "@/lib/types";

interface AIResponseModalProps {
  plan: AiPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AIResponseModal({ plan, isOpen, onClose }: AIResponseModalProps) {
  if (!plan) return null;

  const aiResponse = plan.content as AIResponse;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="ai-response-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3" data-testid="modal-header">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <i className="fas fa-brain text-primary"></i>
            </div>
            <div>
              <span>AI Generated Action Plan</span>
              <p className="text-sm font-normal text-muted-foreground">
                Intelligent Action Planning
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6" data-testid="ai-response-content">
          <div className="rounded-lg p-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <h4 className="text-xl font-bold mb-3 text-foreground" data-testid="plan-title">{plan.title}</h4>
            <p className="text-foreground/80 mb-6 text-base leading-relaxed" data-testid="plan-summary">{plan.summary}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {plan.pricingInr && (
                <div className="p-4 rounded-lg bg-emerald-500/10" data-testid="revenue-potential">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1">Revenue Potential</p>
                  <p className="text-2xl font-bold">₹{(parseFloat(plan.pricingInr) / 100000).toFixed(1)}L</p>
                  {plan.pricingUsd && (
                    <p className="text-sm text-muted-foreground">${parseFloat(plan.pricingUsd).toFixed(1)}K</p>
                  )}
                </div>
              )}
              
              {plan.timeline && (
                <div className="p-4 rounded-lg bg-blue-500/10" data-testid="timeline-info">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Timeline</p>
                  <p className="text-2xl font-bold">{plan.timeline}</p>
                  <p className="text-sm text-muted-foreground">Implementation phases</p>
                </div>
              )}
            </div>
          </div>
          
          {aiResponse?.steps && (
            <div className="space-y-4">
              <h5 className="text-xl font-bold text-foreground mb-4" data-testid="roadmap-title">Implementation Roadmap</h5>
              {aiResponse.steps.map((step, index) => (
                <div key={index} className="border border-border rounded-lg p-5 bg-card" data-testid={`step-${index}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h6 className="font-semibold text-foreground">{step.phase}</h6>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      {step.duration}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {step.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-center space-x-2 text-sm">
                        <i className="fas fa-check-circle text-emerald-500 text-sm flex-shrink-0 mt-0.5"></i>
                        <span className="text-foreground/90">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          
          {aiResponse && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiResponse.risks && aiResponse.risks.length > 0 && (
                <div data-testid="risk-assessment">
                  <h5 className="text-lg font-bold mb-3 text-foreground">Risk Assessment</h5>
                  <ul className="space-y-2">
                    {aiResponse.risks.map((risk, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <i className="fas fa-exclamation-triangle text-amber-500 text-xs mt-0.5"></i>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {aiResponse.success_metrics && aiResponse.success_metrics.length > 0 && (
                <div data-testid="success-metrics">
                  <h5 className="text-lg font-bold mb-3 text-foreground">Success Metrics</h5>
                  <ul className="space-y-2">
                    {aiResponse.success_metrics.map((metric, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <i className="fas fa-target text-emerald-500 text-xs mt-0.5"></i>
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <i className="fas fa-lightbulb mr-2 text-amber-500"></i>
                This plan was generated using AI. Review and customize based on your specific requirements.
              </p>
              <div className="flex space-x-2">
                <Button data-testid="export-pdf-btn">
                  <i className="fas fa-download mr-2"></i>
                  Export PDF
                </Button>
                <Button variant="outline" data-testid="share-plan-btn">
                  <i className="fas fa-share mr-2"></i>
                  Share Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
