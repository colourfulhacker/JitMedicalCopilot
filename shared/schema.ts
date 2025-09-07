import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiPlans = pgTable("ai_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeId: varchar("challenge_id").references(() => challenges.id),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: jsonb("content").notNull(),
  pricingInr: decimal("pricing_inr"),
  pricingUsd: decimal("pricing_usd"),
  timeline: text("timeline"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businessMetrics = pgTable("business_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  monthlyRevenue: decimal("monthly_revenue"),
  activeClients: integer("active_clients"),
  plansGenerated: integer("plans_generated"),
  complianceScore: decimal("compliance_score"),
  healthtechRevenue: decimal("healthtech_revenue"),
  itdevRevenue: decimal("itdev_revenue"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const communications = pgTable("communications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  recipients: text("recipients"),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertChallengeSchema = createInsertSchema(challenges).omit({ id: true, createdAt: true });
export const insertAiPlanSchema = createInsertSchema(aiPlans).omit({ id: true, createdAt: true });
export const insertBusinessMetricsSchema = createInsertSchema(businessMetrics).omit({ id: true });
export const insertCommunicationSchema = createInsertSchema(communications).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type AiPlan = typeof aiPlans.$inferSelect;
export type BusinessMetrics = typeof businessMetrics.$inferSelect;
export type Communication = typeof communications.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type InsertAiPlan = z.infer<typeof insertAiPlanSchema>;
export type InsertBusinessMetrics = z.infer<typeof insertBusinessMetricsSchema>;
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;
