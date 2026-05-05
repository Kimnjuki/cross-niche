/**
 * Moderation Results — audit trail and analysis for CommunityModerator (Tool 06).
 * Records every moderation check for transparency, debugging, and improvement.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logResult = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    inputText: v.string(),
    verdict: v.union(v.literal("approved"), v.literal("flagged"), v.literal("removed")),
    ruleHits: v.array(
      v.object({
        ruleId: v.string(),
        category: v.string(),
        severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
        description: v.string(),
        snippet: v.optional(v.string()),
      })
    ),
    scores: v.object({
      profanity: v.float64(),
      harassment: v.float64(),
      spam: v.float64(),
      pii: v.float64(),
      nsfw: v.float64(),
    }),
    mode: v.union(v.literal("example"), v.literal("custom")),
    inputLengthChars: v.float64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("moderationResults", {
      ...args,
      analyzedAt: Date.now(),
    });
  },
});

export const getSessionHistory = query({
  args: { sessionId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { sessionId, limit = 20 }) => {
    return await ctx.db
      .query("moderationResults")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("desc")
      .take(limit);
  },
});

export const getUserHistory = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { userId, limit = 20 }) => {
    return await ctx.db
      .query("moderationResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

export const getStats = query({
  args: { hoursBack: v.optional(v.float64()) },
  handler: async (ctx, { hoursBack = 24 }) => {
    const cutoff = Date.now() - hoursBack * 60 * 60 * 1000;
    const all = await ctx.db.query("moderationResults").collect();
    const recent = all.filter((r) => r.analyzedAt >= cutoff);

    const approved = recent.filter((r) => r.verdict === "approved").length;
    const flagged = recent.filter((r) => r.verdict === "flagged").length;
    const removed = recent.filter((r) => r.verdict === "removed").length;

    return {
      total: recent.length,
      approved,
      flagged,
      removed,
      approvalRate: recent.length ? ((approved / recent.length) * 100).toFixed(1) + "%" : "0%",
    };
  },
});
