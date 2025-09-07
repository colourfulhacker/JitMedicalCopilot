import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateBusinessPlan, generateCommunication } from "./services/gemini";
import { getExchangeRate, convertINRToUSD } from "./services/currency";
import { insertChallengeSchema, insertAiPlanSchema, insertCommunicationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (Jit Banerjee for now)
  app.get("/api/user/current", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("jit@mdcopilot.com");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Get business metrics
  app.get("/api/metrics/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const metrics = await storage.getBusinessMetrics(userId);
      
      if (!metrics) {
        return res.status(404).json({ error: "Metrics not found" });
      }

      // Get current exchange rate
      const exchangeRate = await getExchangeRate();
      
      // Convert INR to USD for display
      const metricsWithUSD = {
        ...metrics,
        monthlyRevenueUSD: convertINRToUSD(parseFloat(metrics.monthlyRevenue || "0"), exchangeRate),
        healthtechRevenueUSD: convertINRToUSD(parseFloat(metrics.healthtechRevenue || "0"), exchangeRate),
        itdevRevenueUSD: convertINRToUSD(parseFloat(metrics.itdevRevenue || "0"), exchangeRate),
        exchangeRate,
      };

      res.json(metricsWithUSD);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Get AI plans for user
  app.get("/api/plans/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const plans = await storage.getAiPlansByUser(userId);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });

  // Generate AI business plan
  app.post("/api/generate-plan", async (req, res) => {
    try {
      const { userId, category, description, title } = req.body;

      if (!userId || !category || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create challenge
      const challengeData = insertChallengeSchema.parse({
        userId,
        category,
        title: title || "Business Challenge",
        description,
        status: "processing"
      });

      const challenge = await storage.createChallenge(challengeData);

      // Generate AI plan using Gemini
      const aiResponse = await generateBusinessPlan(description, category);
      
      // Get exchange rate for pricing
      const exchangeRate = await getExchangeRate();

      // Create AI plan
      const planData = insertAiPlanSchema.parse({
        challengeId: challenge.id,
        title: aiResponse.title,
        summary: aiResponse.summary,
        content: aiResponse,
        pricingInr: aiResponse.pricing?.inr,
        pricingUsd: aiResponse.pricing?.usd,
        timeline: aiResponse.timeline
      });

      const plan = await storage.createAiPlan(planData);

      // Update challenge status
      await storage.updateChallengeStatus(challenge.id, "completed");

      res.json({
        challenge,
        plan: {
          ...plan,
          exchangeRate
        }
      });

    } catch (error) {
      console.error("Error generating plan:", error);
      res.status(500).json({ error: "Failed to generate AI plan" });
    }
  });

  // Generate communication
  app.post("/api/generate-communication", async (req, res) => {
    try {
      const { userId, type, context, recipients } = req.body;

      if (!userId || !type || !context) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Generate communication using Gemini
      const aiResponse = await generateCommunication(type, context, recipients);

      // Create communication record
      const commData = insertCommunicationSchema.parse({
        userId,
        type,
        title: aiResponse.subject,
        content: aiResponse.content,
        recipients,
        status: "draft"
      });

      const communication = await storage.createCommunication(commData);

      res.json({
        communication,
        generated: aiResponse
      });

    } catch (error) {
      console.error("Error generating communication:", error);
      res.status(500).json({ error: "Failed to generate communication" });
    }
  });

  // Get communications for user
  app.get("/api/communications/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const communications = await storage.getCommunicationsByUser(userId);
      res.json(communications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch communications" });
    }
  });

  // Get current exchange rate
  app.get("/api/exchange-rate", async (req, res) => {
    try {
      const rate = await getExchangeRate();
      res.json({ rate });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exchange rate" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
