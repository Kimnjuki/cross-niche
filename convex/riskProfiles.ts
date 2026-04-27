import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userRiskProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const upsert = mutation({
  args: {
    userId: v.string(),
    overallRiskScore: v.float64(),
    riskBand: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    topRisks: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        severity: v.string(),
        relatedGameSlug: v.optional(v.string()),
        relatedThreatId: v.optional(v.id("threatIntel")),
        status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved")),
      })
    ),
    recommendationSummary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userRiskProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (existing) {
      const prevScore = existing.overallRiskScore;
      await ctx.db.patch(existing._id, {
        overallRiskScore: args.overallRiskScore,
        riskBand: args.riskBand,
        topRisks: args.topRisks,
        recommendationSummary: args.recommendationSummary,
        lastUpdatedAt: now,
      });

      if (Math.abs(prevScore - args.overallRiskScore) >= 5) {
        await ctx.db.insert("userRiskEvents", {
          userId: args.userId,
          eventType: "score_change",
          eventAt: now,
          deltaScore: args.overallRiskScore - prevScore,
        });
      }

      return existing._id;
    }

    const id = await ctx.db.insert("userRiskProfiles", {
      userId: args.userId,
      overallRiskScore: args.overallRiskScore,
      riskBand: args.riskBand,
      lastUpdatedAt: now,
      topRisks: args.topRisks,
      recommendationSummary: args.recommendationSummary,
    });

    await ctx.db.insert("userRiskEvents", {
      userId: args.userId,
      eventType: "config_change",
      eventAt: now,
    });

    return id;
  },
});

export const updateRiskStatus = mutation({
  args: {
    userId: v.string(),
    riskId: v.string(),
    status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved")),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("userRiskProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!profile) return null;

    const updatedRisks = profile.topRisks.map((r) =>
      r.id === args.riskId ? { ...r, status: args.status } : r
    );

    await ctx.db.patch(profile._id, {
      topRisks: updatedRisks,
      lastUpdatedAt: Date.now(),
    });

    if (args.status === "resolved") {
      await ctx.db.insert("userRiskEvents", {
        userId: args.userId,
        eventType: "threat_resolved",
        eventAt: Date.now(),
      });
    }

    return profile._id;
  },
});

export const addRiskEvent = mutation({
  args: {
    userId: v.string(),
    eventType: v.union(
      v.literal("threat_added"),
      v.literal("threat_resolved"),
      v.literal("score_change"),
      v.literal("config_change")
    ),
    deltaScore: v.optional(v.float64()),
    threatId: v.optional(v.id("threatIntel")),
    gameSlug: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("userRiskEvents", {
      userId: args.userId,
      eventType: args.eventType,
      eventAt: Date.now(),
      deltaScore: args.deltaScore,
      threatId: args.threatId,
      gameSlug: args.gameSlug,
      metadata: args.metadata,
    });
  },
});

export const listEvents = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 100);
    return await ctx.db
      .query("userRiskEvents")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});

export const listByRiskBand = query({
  args: {
    riskBand: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userRiskProfiles")
      .withIndex("by_risk_band", (q) => q.eq("riskBand", args.riskBand))
      .order("desc")
      .take(args.limit ?? 50);
  },
});
