import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Log a tool use event ─────────────────────────────────────────────────────

export const logToolUse = mutation({
  args: {
    toolId: v.string(),
    sessionId: v.string(),
    userId: v.optional(v.string()),
    input: v.any(),
    status: v.union(
      v.literal("success"),
      v.literal("error"),
      v.literal("empty"),
      v.literal("notFound")
    ),
    latencyMs: v.float64(),
    createdAt: v.float64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("toolUsageLogs", args);
  },
});

// ── Query tool usage counts for the past N hours ─────────────────────────────

export const getToolUseCounts = query({
  args: { windowHours: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const hours = args.windowHours ?? 24;
    const since = Date.now() - hours * 60 * 60 * 1000;

    const logs = await ctx.db
      .query("toolUsageLogs")
      .filter((q) => q.gte(q.field("createdAt"), since))
      .collect();

    const counts: Record<string, number> = {};
    for (const log of logs) {
      counts[log.toolId] = (counts[log.toolId] ?? 0) + 1;
    }

    return counts;
  },
});

// ── Return tool IDs that are trending (usage spike in past 24h) ──────────────

export const getTrendingTools = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    // Counts in the past 24h
    const recent = await ctx.db
      .query("toolUsageLogs")
      .filter((q) => q.gte(q.field("createdAt"), now - day))
      .collect();

    const recentCounts: Record<string, number> = {};
    for (const log of recent) {
      recentCounts[log.toolId] = (recentCounts[log.toolId] ?? 0) + 1;
    }

    // Counts in the past 7 days
    const week = await ctx.db
      .query("toolUsageLogs")
      .filter((q) => q.gte(q.field("createdAt"), now - 7 * day))
      .collect();

    const weekCounts: Record<string, number> = {};
    for (const log of week) {
      weekCounts[log.toolId] = (weekCounts[log.toolId] ?? 0) + 1;
    }

    // Trending = 24h count >= 3 AND 24h count > (7d count / 7) * 1.5
    const trending: string[] = [];
    for (const [toolId, count24h] of Object.entries(recentCounts)) {
      if (count24h < 3) continue;
      const daily7dAvg = (weekCounts[toolId] ?? 0) / 7;
      if (count24h > daily7dAvg * 1.5 || daily7dAvg === 0) {
        trending.push(toolId);
      }
    }

    return trending;
  },
});

// ── Track a Quick Action card click (for CommandDashboard analytics) ──────────

export const logQuickActionClick = mutation({
  args: {
    actionId: v.string(),
    sessionId: v.string(),
    clickedAt: v.float64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("toolUsageLogs", {
      toolId: `quick_action:${args.actionId}`,
      sessionId: args.sessionId,
      input: { action: args.actionId },
      status: "success",
      latencyMs: 0,
      createdAt: args.clickedAt,
    });
  },
});
