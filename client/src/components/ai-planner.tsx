import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CHALLENGE_CATEGORIES } from "@/lib/types";
import type { AiPlan } from "@shared/schema";

interface AIPlannerProps {
  onPlanGenerated: (plan: AiPlan) => void;
}

export function AIPlanner({ onPlanGenerated }: AIPlannerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["/api/user/current"],
  });

  const generatePlanMutation = useMutation({
    mutationFn: async (data: { userId: string; category: string; description: string; title: string }) => {
      const response = await apiRequest("POST", "/api/generate-plan", data);
      return response.json();
    },
    onSuccess: (data) => {
      onPlanGenerated(data.plan);
      setDescription("");
      setSelectedCategory("");
      queryClient.invalidateQueries({ queryKey: ["/api/plans", user?.id] });
      toast({
        title: "AI Plan Generated",
        description: "Your business action plan has been created successfully.",
      });
    },
    onError: (error) => {
      console.error("Error generating plan:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGeneratePlan = () => {
    if (!user?.id || !selectedCategory || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a category and describe your challenge.",
        variant: "destructive",
      });
      return;
    }

    generatePlanMutation.mutate({
      userId: user.id,
      category: selectedCategory,
      description: description.trim(),
      title: "Business Challenge"
    });
  };

  return (
    <div className="gradient-border" data-testid="ai-planner">
      <div className="gradient-border-content p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <i className="fas fa-robot text-primary"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold" data-testid="ai-planner-title">AI Business Planner</h3>
            <p className="text-sm text-muted-foreground" data-testid="ai-planner-subtitle">Smart Business Planning</p>
          </div>
        </div>

        {/* Challenge Category Selector */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-3 block">Challenge Category</label>
          <div className="grid grid-cols-2 gap-2" data-testid="category-selector">
            {CHALLENGE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-3 rounded-lg border text-sm transition-colors text-left ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-accent"
                }`}
                data-testid={`category-${category.id}`}
              >
                <i className={`${category.icon} mr-2 ${category.color}`}></i>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Input */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Describe Your Challenge
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none"
            rows={4}
            placeholder="e.g., Onboard 15 Delhi hospitals to our HealthTech platform this quarter while ensuring HIPAA compliance..."
            data-testid="challenge-input"
          />
        </div>

        {/* Generate Plan Button */}
        <Button
          onClick={handleGeneratePlan}
          disabled={generatePlanMutation.isPending || !selectedCategory || !description.trim()}
          className="w-full"
          data-testid="generate-plan-btn"
        >
          {generatePlanMutation.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Generating Plan...
            </>
          ) : (
            <>
              <i className="fas fa-magic mr-2"></i>
              Generate AI Action Plan
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
