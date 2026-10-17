import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByGame = query({
  args: {
    gameSlug: v.string(),
    platform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const results = await ctx.db
      .query("gameSecurityAdvisories")
      .withIndex("by_game", (q) => {
        const base = q.eq("gameSlug", args.gameSlug);
        return args.platform ? base.eq("platform", args.platform) : base;
      })
      .order("desc")
      .take(5);

    return results.filter((r) => !r.expiresAt || r.expiresAt > now);
  },
});

export const listByRisk = query({
  args: {
    riskLevel: v.optional(
      v.union(
        v.literal("informational"),
        v.literal("elevated"),
        v.literal("high"),
        v.literal("critical")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 100);
    const now = Date.now();

    if (args.riskLevel) {
      const items = await ctx.db
        .query("gameSecurityAdvisories")
        .withIndex("by_risk", (q) => q.eq("riskLevel", args.riskLevel!))
        .order("desc")
        .take(limit);
      return items.filter((r) => !r.expiresAt || r.expiresAt > now);
    }

    const items = await ctx.db
      .query("gameSecurityAdvisories")
      .order("desc")
      .take(limit);
    return items.filter((r) => !r.expiresAt || r.expiresAt > now);
  },
});

export const create = mutation({
  args: {
    gameSlug: v.string(),
    platform: v.optional(v.string()),
    threatIds: v.array(v.id("threatIntel")),
    generatedSummary: v.string(),
    recommendations: v.array(v.string()),
    riskLevel: v.union(
      v.literal("informational"),
      v.literal("elevated"),
      v.literal("high"),
      v.literal("critical")
    ),
    expiresAt: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("gameSecurityAdvisories", {
      gameSlug: args.gameSlug,
      platform: args.platform,
      threatIds: args.threatIds,
      generatedSummary: args.generatedSummary,
      recommendations: args.recommendations,
      riskLevel: args.riskLevel,
      createdAt: Date.now(),
      expiresAt: args.expiresAt,
    });
  },
});
