/**
 * Tool usage logging — analytics and debugging for all 8 tools.
 * Logs each tool interaction with status, latency, and input summary.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logUsage = mutation({
  args: {
    toolId: v.string(),
    userId: v.optional(v.string()),
    sessionId: v.string(),
    input: v.any(),
    status: v.union(v.literal("success"), v.literal("error"), v.literal("empty"), v.literal("notFound")),
    latencyMs: v.float64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("toolUsageLogs", {
      toolId: args.toolId,
      userId: args.userId,
      sessionId: args.sessionId,
      input: args.input,
      status: args.status,
      latencyMs: args.latencyMs,
      createdAt: Date.now(),
    });
  },
});

export const getToolStats = query({
  args: {
    toolId: v.string(),
    hoursBack: v.optional(v.float64()),
  },
  handler: async (ctx, { toolId, hoursBack = 24 }) => {
    const cutoff = Date.now() - hoursBack * 60 * 60 * 1000;
    const logs = await ctx.db
      .query("toolUsageLogs")
      .withIndex("by_tool", (q) => q.eq("toolId", toolId))
      .collect();

    const recent = logs.filter((l) => l.createdAt >= cutoff);
    const success = recent.filter((l) => l.status === "success").length;
    const errors = recent.filter((l) => l.status === "error").length;
    const empty = recent.filter((l) => l.status === "empty").length;
    const notFound = recent.filter((l) => l.status === "notFound").length;
    const avgLatency = recent.length
      ? recent.reduce((sum, l) => sum + l.latencyMs, 0) / recent.length
      : 0;

    return {
      totalCalls: recent.length,
      success,
      errors,
      empty,
      notFound,
      avgLatency: Math.round(avgLatency),
      errorRate: recent.length ? ((errors / recent.length) * 100).toFixed(1) + "%" : "0%",
    };
  },
});

export const getRecentUsage = query({
  args: {
    toolId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { toolId, limit = 20 }) => {
    return await ctx.db
      .query("toolUsageLogs")
      .withIndex("by_tool", (q) => q.eq("toolId", toolId))
      .order("desc")
      .take(limit);
  },
});
