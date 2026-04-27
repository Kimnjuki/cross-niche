import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getForUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("personalizedFeeds")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
  },
});

export const upsert = mutation({
  args: {
    userId: v.string(),
    items: v.array(
      v.object({
        type: v.string(),
        contentId: v.optional(v.id("content")),
        threatId: v.optional(v.id("threatIntel")),
        pulseId: v.optional(v.id("pulseStories")),
        score: v.float64(),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("personalizedFeeds", {
      userId: args.userId,
      generatedAt: Date.now(),
      items: args.items,
    });
  },
});

export const generateForUser = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Pull recent content and threats to populate a personalized feed
    const latestContent = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(10);

    const latestThreats = await ctx.db
      .query("threatIntel")
      .withIndex("by_published_at")
      .order("desc")
      .take(5);

    const items = [
      ...latestContent.map((c, i) => ({
        type: "content" as const,
        contentId: c._id,
        score: 1.0 - i * 0.05,
      })),
      ...latestThreats.map((t, i) => ({
        type: "threat" as const,
        threatId: t._id,
        score: 0.9 - i * 0.05,
      })),
    ].sort((a, b) => b.score - a.score);

    return await ctx.db.insert("personalizedFeeds", {
      userId: args.userId,
      generatedAt: Date.now(),
      items,
    });
  },
});

export const saveSearchSummary = mutation({
  args: {
    sessionId: v.string(),
    query: v.string(),
    summary: v.string(),
    topContentIds: v.array(v.id("content")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiSearchSummaries", {
      sessionId: args.sessionId,
      query: args.query,
      generatedAt: Date.now(),
      summary: args.summary,
      topContentIds: args.topContentIds,
    });
  },
});

export const getSearchSummary = query({
  args: { sessionId: v.string(), query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiSearchSummaries")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .filter((q) => q.eq(q.field("query"), args.query))
      .first();
  },
});

export const listSearchSummariesByQuery = query({
  args: { query: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiSearchSummaries")
      .withIndex("by_query", (q) => q.eq("query", args.query))
      .order("desc")
      .take(args.limit ?? 10);
  },
});
