/**
 * Multi-source news feed (NewsAPI + GNews).
 * saveArticle: dedupe by URL. getLatestFeed: most recent first.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveArticle = mutation({
  args: {
    title: v.string(),
    url: v.string(),
    summary: v.string(),
    source: v.string(),
    imageUrl: v.optional(v.string()),
    publishedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const exists = await ctx.db
      .query("articles")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .unique();
    if (!exists) {
      await ctx.db.insert("articles", args);
    }
  },
});

/** Latest feed: most recent first (descending by publishedAt). */
export const getLatestFeed = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(30);
  },
});

/** Latest articles (newest at top). Uses by_publishedAt index with desc order. */
export const getLatest = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 30 }) => {
    return await ctx.db
      .query("articles")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(limit);
  },
});
