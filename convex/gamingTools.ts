import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Security Score Quiz ──────────────────────────────────────────────────────

export const saveSecurityScore = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    answers: v.array(v.object({
      questionId: v.number(),
      answer: v.union(v.literal("yes"), v.literal("partial"), v.literal("no")),
    })),
    totalScore: v.number(),
    maxScore: v.number(),
    percentScore: v.number(),
    band: v.union(
      v.literal("excellent"),
      v.literal("good"),
      v.literal("fair"),
      v.literal("needs_work")
    ),
    weakAreaCount: v.number(),
  },
  handler: async (ctx, args) => {
    // Upsert: replace any prior result for this sessionId
    const existing = await ctx.db
      .query("gamingSecurityScores")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, createdAt: existing.createdAt });
      return existing._id;
    }
    return await ctx.db.insert("gamingSecurityScores", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getScoreBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gamingSecurityScores")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});

export const getScoresByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("gamingSecurityScores")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(10);
  },
});

// ── Breach Simulator ─────────────────────────────────────────────────────────

export const saveBreachSimulation = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    scenarioId: v.string(),
    scenarioTitle: v.string(),
    decisions: v.array(v.object({
      stepId: v.string(),
      choiceLabel: v.string(),
      riskImpact: v.number(),
      costImpact: v.number(),
    })),
    finalRisk: v.number(),
    finalCost: v.number(),
    finalTime: v.number(),
    outcome: v.union(v.literal("success"), v.literal("partial"), v.literal("failure")),
    aiFeedback: v.optional(v.object({
      summary: v.string(),
      strengths: v.array(v.string()),
      weaknesses: v.array(v.string()),
      recommendedContentIds: v.optional(v.array(v.id("content"))),
    })),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("breachSimulations", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getSimulationsByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("breachSimulations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(20);
  },
});

// Aggregate: count completions per scenario (public stats for social proof)
export const getScenarioStats = query({
  args: { scenarioId: v.string() },
  handler: async (ctx, args) => {
    const sims = await ctx.db
      .query("breachSimulations")
      .withIndex("by_scenario", (q) => q.eq("scenarioId", args.scenarioId))
      .collect();
    const total = sims.length;
    const outcomes = { success: 0, partial: 0, failure: 0 };
    for (const s of sims) outcomes[s.outcome]++;
    return { total, outcomes };
  },
});
