/**
 * Nexus Risk-to-Reward Gaming Index (nexus-001)
 * Queries and mutations for security ratings (Privacy & Security per game).
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByContentId = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, { contentId }) => {
    return await ctx.db
      .query("securityRatings")
      .withIndex("by_content", (q) => q.eq("contentId", contentId))
      .first();
  },
});

export const getByGameSlug = query({
  args: { gameSlug: v.string() },
  handler: async (ctx, { gameSlug }) => {
    return await ctx.db
      .query("securityRatings")
      .withIndex("by_game_slug", (q) => q.eq("gameSlug", gameSlug))
      .first();
  },
});

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    return await ctx.db
      .query("securityRatings")
      .order("desc")
      .take(limit);
  },
});

const dataSharingPolicyValidator = v.union(
  v.literal("minimal"),
  v.literal("standard"),
  v.literal("extensive"),
  v.literal("unknown")
);

export const upsert = mutation({
  args: {
    contentId: v.optional(v.id("content")),
    gameTitle: v.optional(v.string()),
    gameSlug: v.optional(v.string()),
    dataEncryption: v.boolean(),
    accountMFA: v.boolean(),
    dataSharingPolicy: dataSharingPolicyValidator,
    nexusSecurityScore: v.number(),
    funFactor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = args.contentId
      ? await ctx.db
          .query("securityRatings")
          .withIndex("by_content", (q) => q.eq("contentId", args.contentId!))
          .first()
      : args.gameSlug
        ? await ctx.db
            .query("securityRatings")
            .withIndex("by_game_slug", (q) => q.eq("gameSlug", args.gameSlug!))
            .first()
        : null;

    const doc = {
      contentId: args.contentId ?? undefined,
      gameTitle: args.gameTitle ?? undefined,
      gameSlug: args.gameSlug ?? undefined,
      dataEncryption: args.dataEncryption,
      accountMFA: args.accountMFA,
      dataSharingPolicy: args.dataSharingPolicy,
      nexusSecurityScore: args.nexusSecurityScore,
      funFactor: args.funFactor ?? undefined,
    };

    if (existing) {
      await ctx.db.patch(existing._id, doc);
      return existing._id;
    }
    return await ctx.db.insert("securityRatings", doc);
  },
});
