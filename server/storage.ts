import { type User, type InsertUser, type Challenge, type InsertChallenge, type AiPlan, type InsertAiPlan, type BusinessMetrics, type InsertBusinessMetrics, type Communication, type InsertCommunication } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Challenges
  getChallenge(id: string): Promise<Challenge | undefined>;
  getChallengesByUser(userId: string): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallengeStatus(id: string, status: string): Promise<void>;

  // AI Plans
  getAiPlan(id: string): Promise<AiPlan | undefined>;
  getAiPlansByChallenge(challengeId: string): Promise<AiPlan[]>;
  getAiPlansByUser(userId: string): Promise<AiPlan[]>;
  createAiPlan(plan: InsertAiPlan): Promise<AiPlan>;

  // Business Metrics
  getBusinessMetrics(userId: string): Promise<BusinessMetrics | undefined>;
  updateBusinessMetrics(userId: string, metrics: InsertBusinessMetrics): Promise<BusinessMetrics>;

  // Communications
  getCommunication(id: string): Promise<Communication | undefined>;
  getCommunicationsByUser(userId: string): Promise<Communication[]>;
  createCommunication(communication: InsertCommunication): Promise<Communication>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private challenges: Map<string, Challenge>;
  private aiPlans: Map<string, AiPlan>;
  private businessMetrics: Map<string, BusinessMetrics>;
  private communications: Map<string, Communication>;

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.aiPlans = new Map();
    this.businessMetrics = new Map();
    this.communications = new Map();

    // Initialize with Jit Banerjee
    const jitId = randomUUID();
    const jit: User = {
      id: jitId,
      name: "Jit Banerjee",
      role: "Managing Director",
      email: "jit@mdcopilot.com",
      createdAt: new Date(),
    };
    this.users.set(jitId, jit);

    // Initialize business metrics
    const metrics: BusinessMetrics = {
      id: randomUUID(),
      userId: jitId,
      monthlyRevenue: "4520000",
      activeClients: 127,
      plansGenerated: 342,
      complianceScore: "98.5",
      healthtechRevenue: "2850000",
      itdevRevenue: "1670000",
      updatedAt: new Date(),
    };
    this.businessMetrics.set(jitId, metrics);
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Challenges
  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getChallengesByUser(userId: string): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(
      challenge => challenge.userId === userId
    );
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = { ...insertChallenge, id, createdAt: new Date() };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async updateChallengeStatus(id: string, status: string): Promise<void> {
    const challenge = this.challenges.get(id);
    if (challenge) {
      challenge.status = status;
      this.challenges.set(id, challenge);
    }
  }

  // AI Plans
  async getAiPlan(id: string): Promise<AiPlan | undefined> {
    return this.aiPlans.get(id);
  }

  async getAiPlansByChallenge(challengeId: string): Promise<AiPlan[]> {
    return Array.from(this.aiPlans.values()).filter(
      plan => plan.challengeId === challengeId
    );
  }

  async getAiPlansByUser(userId: string): Promise<AiPlan[]> {
    const userChallenges = await this.getChallengesByUser(userId);
    const challengeIds = userChallenges.map(c => c.id);
    return Array.from(this.aiPlans.values()).filter(
      plan => plan.challengeId && challengeIds.includes(plan.challengeId)
    );
  }

  async createAiPlan(insertPlan: InsertAiPlan): Promise<AiPlan> {
    const id = randomUUID();
    const plan: AiPlan = { ...insertPlan, id, createdAt: new Date() };
    this.aiPlans.set(id, plan);
    return plan;
  }

  // Business Metrics
  async getBusinessMetrics(userId: string): Promise<BusinessMetrics | undefined> {
    return this.businessMetrics.get(userId);
  }

  async updateBusinessMetrics(userId: string, insertMetrics: InsertBusinessMetrics): Promise<BusinessMetrics> {
    const id = randomUUID();
    const metrics: BusinessMetrics = { ...insertMetrics, id, userId, updatedAt: new Date() };
    this.businessMetrics.set(userId, metrics);
    return metrics;
  }

  // Communications
  async getCommunication(id: string): Promise<Communication | undefined> {
    return this.communications.get(id);
  }

  async getCommunicationsByUser(userId: string): Promise<Communication[]> {
    return Array.from(this.communications.values()).filter(
      communication => communication.userId === userId
    );
  }

  async createCommunication(insertCommunication: InsertCommunication): Promise<Communication> {
    const id = randomUUID();
    const communication: Communication = { ...insertCommunication, id, createdAt: new Date() };
    this.communications.set(id, communication);
    return communication;
  }
}

export const storage = new MemStorage();
