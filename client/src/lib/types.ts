export interface AIResponse {
  title: string;
  summary: string;
  steps: {
    phase: string;
    duration: string;
    tasks: string[];
  }[];
  pricing: {
    inr: string;
    usd: string;
    breakdown: string;
  };
  risks: string[];
  success_metrics: string[];
  timeline: string;
}

export interface BusinessMetricsWithUSD {
  id: string;
  userId: string;
  monthlyRevenue: string;
  monthlyRevenueUSD: number;
  activeClients: number;
  plansGenerated: number;
  complianceScore: string;
  healthtechRevenue: string;
  healthtechRevenueUSD: number;
  itdevRevenue: string;
  itdevRevenueUSD: number;
  exchangeRate: number;
  updatedAt: Date;
}

export interface ChallengeCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const CHALLENGE_CATEGORIES: ChallengeCategory[] = [
  { id: "hr", name: "HR & Hiring", icon: "fas fa-users", color: "text-blue-500" },
  { id: "sales", name: "Sales & Growth", icon: "fas fa-chart-line", color: "text-emerald-500" },
  { id: "client", name: "Client Relations", icon: "fas fa-handshake", color: "text-amber-500" },
  { id: "compliance", name: "Compliance", icon: "fas fa-shield-alt", color: "text-red-500" },
  { id: "project", name: "Project Mgmt", icon: "fas fa-project-diagram", color: "text-purple-500" },
  { id: "investment", name: "Investment", icon: "fas fa-money-bill", color: "text-green-500" },
];

export const COMMUNICATION_TYPES = [
  { id: "executive-email", name: "Executive Email", icon: "fas fa-envelope", color: "text-blue-500" },
  { id: "investor-pitch", name: "Investor Pitch", icon: "fas fa-chart-line", color: "text-emerald-500" },
  { id: "client-proposal", name: "Client Proposal", icon: "fas fa-file-contract", color: "text-amber-500" },
  { id: "compliance-report", name: "Compliance Report", icon: "fas fa-shield-alt", color: "text-red-500" },
];
