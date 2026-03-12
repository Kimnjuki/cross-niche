/**
 * Multi-source news feed (NewsAPI + GNews).
 * saveArticle: dedupe by URL. getLatestFeed: most recent first.
 * Rejects HTTP image URLs to prevent mixed content on HTTPS sites.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Only accept HTTPS image URLs; drop HTTP to avoid mixed content. */
function sanitizeImageUrl(url: string | undefined): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  if (!url.startsWith("https://")) return undefined;
  return url;
}

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
    const imageUrl = sanitizeImageUrl(args.imageUrl);
    const exists = await ctx.db
      .query("articles")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .unique();
    if (!exists) {
      await ctx.db.insert("articles", { ...args, imageUrl });
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
  args: {
    limit: v.optional(v.number()),
    excludeUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { limit = 30, excludeUrls = [] }) => {
    const exclude = new Set(excludeUrls);
    const cap = Math.min(limit + excludeUrls.length + 50, 200);
    const rows = await ctx.db
      .query("articles")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(cap);

    if (exclude.size === 0) return rows.slice(0, limit);
    return rows.filter((r) => !exclude.has(r.url)).slice(0, limit);
  },
});
