/**
 * AI-Pulse Roadmap (nexus-002) – Convex data for AI/ML tech trends timeline.
 */

import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    category: v.optional(v.union(v.literal("productivity"), v.literal("creative"), v.literal("gaming_ai"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { category, limit = 50 }) => {
    if (category) {
      return await ctx.db
        .query("aiUpdates")
        .withIndex("by_category_published_at", (q) => q.eq("category", category))
        .order("desc")
        .take(limit);
    }
    return await ctx.db
      .query("aiUpdates")
      .withIndex("by_published_at")
      .order("desc")
      .take(limit);
  },
});

// Get latest AI updates
export const getLatestAIUpdates = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    let query = ctx.db
      .query("aiUpdates")
      .withIndex("by_published_at")
      .order("desc");
    
    if (args.category) {
      query = ctx.db
        .query("aiUpdates")
        .withIndex("by_category_published_at", (q) =>
          q.eq("category", args.category as string)
        )
        .order("desc");
    }
    
    // Filter out expired updates
    const now = Date.now();
    const updates = await query.collect();
    
    return updates
      .filter((update) => !update.expiresAt || update.expiresAt > now)
      .slice(0, limit);
  },
});

// Get AI updates with benchmarks
export const getAIUpdatesWithBenchmarks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    return await ctx.db
      .query("aiUpdates")
      .filter((q) => q.eq(q.field("hasBenchmarks"), true))
      .order("desc")
      .take(limit);
  },
});

// Get hype vs substance analysis
export const getHypeAnalysis = query({
  handler: async (ctx) => {
    const allUpdates = await ctx.db
      .query("aiUpdates")
      .collect();
    
    const hypeCount = allUpdates.filter((u) => u.isHype).length;
    const substantiveCount = allUpdates.length - hypeCount;
    
    return {
      total: allUpdates.length,
      hype: hypeCount,
      substantive: substantiveCount,
      hypePercentage: allUpdates.length > 0 ? (hypeCount / allUpdates.length) * 100 : 0,
    };
  },
});
