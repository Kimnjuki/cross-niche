/**
 * Grid Nexus - Working Content Queries
 * Simplified queries that match the current schema
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all published content (excludes deleted). Newest first by publishedAt.
 */
export const getPublishedContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit * 2);
    return docs.filter((d) => d.isDeleted !== true).slice(0, limit);
  },
});

/**
 * List all visible content (published + new only; excludes draft/archived/deleted).
 * Used for sitemaps and Explore/archive. Sorted by publishedAt desc so newest first.
 */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const [published, newStatus] = await Promise.all([
      ctx.db
        .query("content")
        .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
        .order("desc")
        .take(200),
      ctx.db
        .query("content")
        .withIndex("by_status_published_at", (q) => q.eq("status", "new"))
        .order("desc")
        .take(200),
    ]);
    const merged = [...published, ...newStatus]
      .filter((c) => c.isDeleted !== true)
      .sort((a, b) => (b.publishedAt ?? b._creationTime ?? 0) - (a.publishedAt ?? a._creationTime ?? 0));
    return merged.slice(0, 200);
  },
});

/**
 * Get featured content (excludes deleted).
 */
export const getFeaturedContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit * 3);
    return docs
      .filter((d) => d.isDeleted !== true && d.isFeatured === true)
      .slice(0, limit);
  },
});

/**
 * Get breaking news (excludes deleted).
 */
export const getBreakingNews = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit * 3);
    return docs
      .filter((d) => d.isDeleted !== true && d.isBreaking === true)
      .slice(0, limit);
  },
});

/**
 * Get content statistics
 */
export const getContentStats = mutation({
  args: {},
  handler: async (ctx) => {
    const allContent = await ctx.db.query("content").collect();
    
    const stats = {
      totalArticles: allContent.length,
      publishedArticles: allContent.filter(c => c.status === "published").length,
      draftArticles: allContent.filter(c => c.status === "draft").length,
      withPublishedAt: allContent.filter(c => c.publishedAt != null).length,
      totalViews: allContent.reduce((sum, c) => sum + (c.viewCount || 0), 0),
    };
    
    console.log("Content Stats:", stats);
    return stats;
  },
});

/**
 * Upsert ingested content from news APIs
 */
export const upsertIngestedContent = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    body: v.string(),
    summary: v.optional(v.string()),
    contentType: v.optional(v.string()),
    source: v.optional(v.string()),
    originalUrl: v.optional(v.string()),
    externalId: v.optional(v.string()),
    featuredImageUrl: v.optional(v.string()),
    authorId: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    isAutomated: v.optional(v.boolean()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if content exists by externalId
    if (args.externalId) {
      const existing = await ctx.db
        .query("content")
        .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
        .first();
      
      if (existing) {
        await ctx.db.patch(existing._id, {
          title: args.title,
          body: args.body,
          summary: args.summary,
          contentType: args.contentType as any,
          featuredImageUrl: args.featuredImageUrl,
          lastModifiedAt: Date.now(),
        });
        return existing._id;
      }
    }
    
    // Create new content
    const contentId = await ctx.db.insert("content", {
      title: args.title,
      slug: args.slug,
      body: args.body,
      summary: args.summary,
      contentType: args.contentType as any,
      source: args.source,
      originalUrl: args.originalUrl,
      externalId: args.externalId,
      featuredImageUrl: args.featuredImageUrl,
      authorId: args.authorId,
      publishedAt: args.publishedAt || Date.now(),
      isAutomated: args.isAutomated ?? true,
      status: args.status || "published",
    });
    
    return contentId;
  },
});

/**
 * Get latest content (excludes deleted). Newest first.
 */
export const getLatestContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit * 2);
    return docs.filter((d) => d.isDeleted !== true).slice(0, limit);
  },
});

/**
 * Get content by slug. Returns null for draft, archived, or deleted so only visible articles are shown.
 */
export const getContentBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const content = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!content || content.isDeleted === true) return null;
    if (content.status !== "published" && content.status !== "new" && content.status !== "unlisted") return null;
    return content;
  },
});

/**
 * Get all published content for Explore (excludes deleted).
 */
export const getAllPublishedContent = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(150);
    return docs.filter((d) => d.isDeleted !== true).slice(0, 100);
  },
});

/**
 * Get content by niche (excludes deleted).
 */
export const getContentByNiche = query({
  args: {
    niche: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit * 2);
    return docs.filter((d) => d.isDeleted !== true).slice(0, limit);
  },
});

/**
 * Get trending content (excludes deleted). Sorted by publishedAt desc.
 */
export const getTrendingContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 12;
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit * 2);
    return docs.filter((d) => d.isDeleted !== true).slice(0, limit);
  },
});

/**
 * List all niches
 */
export const listNiches = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("niches").collect();
  },
});

/**
 * List all feeds
 */
export const listFeeds = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("feeds").collect();
  },
});

/**
 * Get content by feed slug (excludes deleted).
 */
export const getContentByFeed = query({
  args: {
    feedSlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit * 2);
    return docs.filter((d) => d.isDeleted !== true).slice(0, limit);
  },
});

/**
 * Get visible content for homepage (excludes deleted). Newest first.
 */
export const getVisibleContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit * 2);
    return docs.filter((d) => d.isDeleted !== true).slice(0, limit);
  },
});

/**
 * List all tags
 */
export const listTags = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tags").collect();
  },
});

/**
 * Get related content (excludes the current article and deleted).
 */
export const getRelated = query({
  args: {
    contentId: v.id("content"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit + 20);
    return docs
      .filter((d) => d._id !== args.contentId && d.isDeleted !== true)
      .slice(0, limit);
  },
});

/**
 * List ingested/automated news for NewsFeed (Live Wire).
 * Returns published content, preferring isAutomated items; excludes deleted.
 */
export const listIngestedNews = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 24 }) => {
    const cap = Math.min(limit * 3, 100);
    const docs = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(cap);
    const visible = docs.filter((d) => d.isDeleted !== true);
    const preferred = visible.filter((d) => d.isAutomated === true);
    const slice = preferred.length >= limit
      ? preferred.slice(0, limit)
      : visible.slice(0, limit);
    return slice.map((d) => ({
      _id: d._id,
      id: String(d._id),
      title: d.title,
      slug: d.slug,
      excerpt: d.summary ?? null,
      published_at: d.publishedAt != null ? new Date(d.publishedAt).toISOString() : null,
      publishedAt: d.publishedAt ?? null,
      featured_image_url: d.featuredImageUrl ?? null,
      source: d.source ?? null,
      isAutomated: d.isAutomated ?? false,
      originalUrl: d.originalUrl ?? null,
      feed_name: null as string | null,
    }));
  },
});

/**
 * Get diagnostics
 */
export const diagnostics = query({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db.query("content").collect();
    return {
      totalContent: content.length,
      publishedContent: content.filter(c => c.status === "published").length,
      draftContent: content.filter(c => c.status === "draft").length,
      contentWithPublishedAt: content.filter(c => c.publishedAt != null).length,
    };
  },
});
