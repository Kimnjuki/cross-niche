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
