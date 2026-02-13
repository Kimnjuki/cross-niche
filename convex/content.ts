/**
 * Grid Nexus - Working Content Queries
 * Simplified queries that match the current schema
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all published content
 */
export const getPublishedContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .order("desc")
      .take(limit);
  },
});

/**
 * List all content (for sitemaps and admin lists)
 */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    // Used for sitemaps and admin lists
    return await ctx.db.query("content").order("desc").take(100);
  },
});

/**
 * Get featured content
 */
export const getFeaturedContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .filter((q) => q.eq("isFeatured", true as any))
      .order("desc")
      .take(limit);
  },
});

/**
 * Get breaking news
 */
export const getBreakingNews = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .filter((q) => q.eq("isBreaking", true as any))
      .order("desc")
      .take(limit);
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
 * Get latest content (alias for getPublishedContent)
 */
export const getLatestContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .order("desc")
      .take(limit);
  },
});

/**
 * Get content by slug
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
    
    return content;
  },
});

/**
 * Get all content (for diagnostics)
 */
export const getAllPublishedContent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .order("desc")
      .take(100);
  },
});

/**
 * Get content by niche
 */
export const getContentByNiche = query({
  args: {
    niche: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    // For now, return all published content (niche filtering can be added later)
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .order("desc")
      .take(limit);
  },
});

/**
 * Get trending content (by view count)
 */
export const getTrendingContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 12;
    
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .order("desc")
      .take(limit);
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
 * Get content by feed slug
 */
export const getContentByFeed = query({
  args: {
    feedSlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    // For now, return all published content (feed filtering can be added later)
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .order("desc")
      .take(limit);
  },
});

/**
 * Get visible content (published + featured)
 */
export const getVisibleContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .order("desc")
      .take(limit);
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
 * Get related content
 */
export const getRelated = query({
  args: {
    contentId: v.id("content"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 6;
    
    // For now, return other published content
    return await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .order("desc")
      .take(limit);
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
