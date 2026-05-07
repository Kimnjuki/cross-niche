/**
 * News Bookmarks — server-side persistence for NewsPersonalizer (Tool 04).
 * Enables cross-device bookmark sync and prevents data loss on page refresh.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const toggleBookmark = mutation({
  args: {
    userId: v.string(),
    articleId: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, { userId, articleId, source }) => {
    const existing = await ctx.db
      .query("newsBookmarks")
      .withIndex("by_user_article", (q) =>
        q.eq("userId", userId).eq("articleId", articleId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { bookmarked: false };
    } else {
      await ctx.db.insert("newsBookmarks", {
        userId,
        articleId,
        source: source ?? undefined,
        bookmarkedAt: Date.now(),
      });
      return { bookmarked: true };
    }
  },
});

export const getUserBookmarks = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { userId, limit = 50 }) => {
    return await ctx.db
      .query("newsBookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

export const isBookmarked = query({
  args: { userId: v.string(), articleId: v.string() },
  handler: async (ctx, { userId, articleId }) => {
    const found = await ctx.db
      .query("newsBookmarks")
      .withIndex("by_user_article", (q) =>
        q.eq("userId", userId).eq("articleId", articleId)
      )
      .first();
    return { bookmarked: !!found };
  },
});

export const removeBookmark = mutation({
  args: { userId: v.string(), articleId: v.string() },
  handler: async (ctx, { userId, articleId }) => {
    const existing = await ctx.db
      .query("newsBookmarks")
      .withIndex("by_user_article", (q) =>
        q.eq("userId", userId).eq("articleId", articleId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { deleted: true };
    }
    return { deleted: false };
  },
});

export const clearAllBookmarks = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const bookmarks = await ctx.db
      .query("newsBookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    let deleted = 0;
    for (const bm of bookmarks) {
      await ctx.db.delete(bm._id);
      deleted++;
    }
    return { deleted };
  },
});
