/**
 * Game Library queries for tool integrations.
 * Backs SentimentAnalyzer (Tool 02), RecommendationEngine (Tool 03),
 * GamingCopilot (Tool 07), and ReleasePredictor (Tool 08).
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    genre: v.optional(v.string()),
    platform: v.optional(v.string()),
  },
  handler: async (ctx, { limit = 50, offset = 0, genre, platform }) => {
    let results;
    if (genre) {
      results = await ctx.db
        .query("gameLibrary")
        .withIndex("by_security_grade", (q) => q.eq("securityGrade", "A"))
        .take(100);
      // Filter by genre client-side since there's no genre index
      results = results.filter((g) => g.genres.includes(genre));
    } else if (platform) {
      results = await ctx.db
        .query("gameLibrary")
        .take(100);
      results = results.filter((g) => g.platforms.includes(platform));
    } else {
      results = await ctx.db
        .query("gameLibrary")
        .withIndex("by_updated", (q) => q)
        .order("desc")
        .take(limit + offset);
    }

    return {
      games: results.slice(offset, offset + limit),
      total: results.length,
    };
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("gameLibrary")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const getByName = query({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    // Use slug index with partial match via take+filter
    const allGames = await ctx.db.query("gameLibrary").take(200);
    const lower = name.toLowerCase();
    return allGames.find(
      (g) =>
        g.name.toLowerCase() === lower ||
        g.aliases.some((a) => a.toLowerCase() === lower) ||
        g.slug === lower
    ) ?? null;
  },
});

export const search = query({
  args: { query: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { query: searchQuery, limit = 10 }) => {
    const allGames = await ctx.db.query("gameLibrary").take(200);
    const lower = searchQuery.toLowerCase();
    return allGames
      .filter(
        (g) =>
          g.name.toLowerCase().includes(lower) ||
          g.aliases.some((a) => a.toLowerCase().includes(lower)) ||
          g.genres.some((gen) => gen.toLowerCase().includes(lower))
      )
      .slice(0, limit);
  },
});

export const listByBudgetTier = query({
  args: { tier: v.union(v.literal("free"), v.literal("budget"), v.literal("mid"), v.literal("high"), v.literal("ultra")) },
  handler: async (ctx, { tier }) => {
    return await ctx.db
      .query("gameLibrary")
      .withIndex("by_budget_tier", (q) => q.eq("budgetTier", tier))
      .collect();
  },
});

export const listBySecurityGrade = query({
  args: { grade: v.union(v.literal("A"), v.literal("B"), v.literal("C"), v.literal("D"), v.literal("F")) },
  handler: async (ctx, { grade }) => {
    return await ctx.db
      .query("gameLibrary")
      .withIndex("by_security_grade", (q) => q.eq("securityGrade", grade))
      .collect();
  },
});

export const upsert = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    aliases: v.array(v.string()),
    genres: v.array(v.string()),
    platforms: v.array(v.string()),
    releaseYear: v.optional(v.float64()),
    developer: v.optional(v.string()),
    publisher: v.optional(v.string()),
    minHardwareTier: v.union(v.literal("low"), v.literal("mid"), v.literal("high"), v.literal("ultra")),
    approximateCostUSD: v.float64(),
    securityGrade: v.union(v.literal("A"), v.literal("B"), v.literal("C"), v.literal("D"), v.literal("F")),
    securityNotes: v.optional(v.string()),
    sentimentScores: v.object({
      gameplay: v.float64(),
      balance: v.float64(),
      security: v.float64(),
      performance: v.float64(),
      community: v.float64(),
    }),
    sentimentTrendDirection: v.union(v.literal("rising"), v.literal("stable"), v.literal("falling")),
    securityMentionRate: v.float64(),
    positiveThemes: v.array(v.string()),
    negativeThemes: v.array(v.string()),
    recentSecurityComplaints: v.array(v.object({
      id: v.string(),
      summary: v.string(),
      date: v.string(),
    })),
    releaseSignals: v.optional(v.object({
      esrbFiledDate: v.optional(v.string()),
      steamBuildActivity: v.optional(v.boolean()),
      marketingHires: v.optional(v.boolean()),
      leakScore: v.optional(v.float64()),
      officialTeases: v.optional(v.float64()),
    })),
    baseReleaseConfidence: v.optional(v.float64()),
    expectedReleaseWindow: v.optional(v.string()),
    recommendedForGoals: v.array(v.union(v.literal("gaming_pc"), v.literal("find_game"), v.literal("both"))),
    stylesMatch: v.array(v.string()),
    budgetTier: v.union(v.literal("free"), v.literal("budget"), v.literal("mid"), v.literal("high"), v.literal("ultra")),
    isSupported: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("gameLibrary")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    const data = { ...args, updatedAt: Date.now() };

    if (existing) {
      return await ctx.db.replace(existing._id, data);
    } else {
      return await ctx.db.insert("gameLibrary", data);
    }
  },
});
