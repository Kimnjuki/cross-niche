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

export const createDemo = mutation({
  args: { gameSlug: v.string(), platform: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const riskLevels = ["informational", "elevated", "high", "critical"] as const;
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];

    const demoRecommendations: Record<string, string[]> = {
      informational: [
        "Enable two-factor authentication on your gaming account.",
        "Review app permissions granted to the game.",
        "Keep the game client updated to the latest version.",
      ],
      elevated: [
        "Avoid using the same password as your email account.",
        "Check for suspicious login activity in your account history.",
        "Use a dedicated email for gaming accounts.",
        "Enable login notifications.",
      ],
      high: [
        "Immediately change your account password.",
        "Review and revoke any third-party app access.",
        "Enable 2FA if not already active.",
        "Check your payment methods for unauthorized charges.",
        "Scan your device for malware.",
      ],
      critical: [
        "Change your password immediately.",
        "Revoke all active sessions from account settings.",
        "Contact platform support to report the compromise.",
        "Check for unauthorized purchases and request chargebacks.",
        "Scan all devices used to access this game.",
        "Consider freezing linked payment methods.",
      ],
    };

    return await ctx.db.insert("gameSecurityAdvisories", {
      gameSlug: args.gameSlug,
      platform: args.platform ?? "PC",
      threatIds: [],
      generatedSummary: `Security analysis for ${args.gameSlug} on ${args.platform ?? "PC"}: ${riskLevel.toUpperCase()} risk detected based on recent threat intelligence and platform security ratings.`,
      recommendations: demoRecommendations[riskLevel],
      riskLevel,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
  },
});
