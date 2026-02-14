/**
 * Grid Nexus - Content Queries
 * Complete set of Convex queries for content management
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// PUBLISHED CONTENT QUERIES
// ============================================================================

/**
 * Get all published content sorted by publication date
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
 * Get paginated published content
 */
export const getPublishedContentPaginated = query({
  args: {
    page: v.number(),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const pageSize = args.pageSize || 20;
    const skip = (args.page - 1) * pageSize;
    
    const allContent = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .order("desc")
      .collect();
    
    const total = allContent.length;
    const content = allContent.slice(skip, skip + pageSize);
    
    return {
      content,
      total,
      page: args.page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasMore: skip + pageSize < total,
    };
  },
});

/**
 * Get latest published content (homepage)
 */
export const getLatestContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    return await ctx.db
      .query("content")
      .withIndex("by_publishedAt")
      .order("desc")
      .filter((q) => q.eq(q.field("status"), "published"))
      .take(limit);
  },
});

// ============================================================================
// FEATURED & BREAKING CONTENT
// ============================================================================

/**
 * Get featured articles
 */
export const getFeaturedContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    return await ctx.db
      .query("content")
      .withIndex("by_is_featured", (q) => 
        q.eq("isFeatured", true)
      )
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
      .withIndex("by_is_breaking", (q) => 
        q.eq("isBreaking", true)
      )
      .order("desc")
      .take(limit);
  },
});

/**
 * Get premium content
 */
export const getPremiumContent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    return await ctx.db
      .query("content")
      .withIndex("by_is_premium", (q) => 
        q.eq("isPremium", true)
      )
      .order("desc")
      .take(limit);
  },
});

// ============================================================================
// CONTENT BY IDENTIFIER
// ============================================================================

/**
 * Get content by slug
 */
export const getContentBySlug = query({
  args: { 
    slug: v.string() 
  },
  handler: async (ctx, args) => {
    const content = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    
    if (!content) {
      return null;
    }
    
    // Get related data
    const [tags, media, niches] = await Promise.all([
      // Get tags
      ctx.db
        .query("contentTags")
        .withIndex("by_content", (q) => q.eq("contentId", content._id))
        .collect()
        .then(async (contentTags) => {
          return Promise.all(
            contentTags.map(ct => ctx.db.get(ct.tagId))
          );
        }),
      
      // Get media
      ctx.db
        .query("media")
        .withIndex("by_content", (q) => q.eq("contentId", content._id))
        .collect(),
      
      // Get niches
      ctx.db
        .query("contentNiches")
        .withIndex("by_content", (q) => q.eq("contentId", content._id))
        .collect()
        .then(async (contentNiches) => {
          return Promise.all(
            contentNiches.map(cn => 
              ctx.db
                .query("niches")
                .withIndex("by_id_num", (q) => q.eq("idNum", cn.nicheId))
                .first()
            )
          );
        }),
    ]);
    
    return {
      ...content,
      tags: tags.filter(Boolean),
      media,
      niches: niches.filter(Boolean),
    };
  },
});

/**
 * Get content by ID
 */
export const getContentById = query({
  args: { 
    id: v.id("content") 
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Get content by external ID (for migrations)
 */
export const getContentByExternalId = query({
  args: { 
    externalId: v.string() 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("content")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .first();
  },
});

// ============================================================================
// CONTENT BY FEED/CATEGORY
// ============================================================================

/**
 * Get content by feed slug
 */
export const getContentByFeed = query({
  args: { 
    feedSlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    // Get the feed
    const feed = await ctx.db
      .query("feeds")
      .withIndex("by_slug", (q) => q.eq("slug", args.feedSlug))
      .first();
    
    if (!feed) {
      return [];
    }
    
    // Get content IDs for this feed
    const contentFeeds = await ctx.db
      .query("contentFeeds")
      .withIndex("by_feed", (q) => q.eq("feedId", feed._id))
      .collect();
    
    const contentIds = contentFeeds.map(cf => cf.contentId);
    
    // Get the actual content
    const content = await Promise.all(
      contentIds.map(id => ctx.db.get(id))
    );
    
    // Filter published and sort by date
    return content
      .filter(c => c && c.status === "published" && c.publishedAt)
      .sort((a, b) => (b!.publishedAt || 0) - (a!.publishedAt || 0))
      .slice(0, limit);
  },
});

/**
 * Get content by niche ID
 */
export const getContentByNiche = query({
  args: { 
    nicheId: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    // Get content IDs for this niche
    const contentNiches = await ctx.db
      .query("contentNiches")
      .withIndex("by_niche", (q) => q.eq("nicheId", args.nicheId))
      .collect();
    
    const contentIds = contentNiches.map(cn => cn.contentId);
    
    // Get the actual content
    const content = await Promise.all(
      contentIds.map(id => ctx.db.get(id))
    );
    
    // Filter published and sort by date
    return content
      .filter(c => c && c.status === "published" && c.publishedAt)
      .sort((a, b) => (b!.publishedAt || 0) - (a!.publishedAt || 0))
      .slice(0, limit);
  },
});

/**
 * Get content by tag
 */
export const getContentByTag = query({
  args: { 
    tagSlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    // Get the tag
    const tag = await ctx.db
      .query("tags")
      .withIndex("by_slug", (q) => q.eq("slug", args.tagSlug))
      .first();
    
    if (!tag) {
      return [];
    }
    
    // Get content IDs for this tag
    const contentTags = await ctx.db
      .query("contentTags")
      .withIndex("by_tag", (q) => q.eq("tagId", tag._id))
      .collect();
    
    const contentIds = contentTags.map(ct => ct.contentId);
    
    // Get the actual content
    const content = await Promise.all(
      contentIds.map(id => ctx.db.get(id))
    );
    
    // Filter published and sort by date
    return content
      .filter(c => c && c.status === "published" && c.publishedAt)
      .sort((a, b) => (b!.publishedAt || 0) - (a!.publishedAt || 0))
      .slice(0, limit);
  },
});

// ============================================================================
// SEARCH & DISCOVERY
// ============================================================================

/**
 * Search content by title and summary
 */
export const searchContent = query({
  args: { 
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const searchLower = args.searchTerm.toLowerCase();
    
    const allContent = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .collect();
    
    // Simple text search
    const filtered = allContent.filter(content => 
      content.title.toLowerCase().includes(searchLower) ||
      (content.summary && content.summary.toLowerCase().includes(searchLower)) ||
      (content.body && content.body.toLowerCase().includes(searchLower))
    );
    
    return filtered
      .sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0))
      .slice(0, limit);
  },
});

/**
 * Get related content by tags
 */
export const getRelatedContent = query({
  args: { 
    contentId: v.id("content"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    
    // Get current content's tags
    const currentTags = await ctx.db
      .query("contentTags")
      .withIndex("by_content", (q) => q.eq("contentId", args.contentId))
      .collect();
    
    const tagIds = currentTags.map(ct => ct.tagId);
    
    if (tagIds.length === 0) {
      // No tags, return recent content
      return await ctx.db
        .query("content")
        .withIndex("by_publishedAt")
        .order("desc")
        .filter((q) => 
          q.and(
            q.eq(q.field("status"), "published"),
            q.neq(q.field("_id"), args.contentId)
          )
        )
        .take(limit);
    }
    
    // Find content with similar tags
    const relatedContentTags = await Promise.all(
      tagIds.map(tagId =>
        ctx.db
          .query("contentTags")
          .withIndex("by_tag", (q) => q.eq("tagId", tagId))
          .collect()
      )
    );
    
    // Flatten and get unique content IDs
    const relatedIds = new Set(
      relatedContentTags
        .flat()
        .map(ct => ct.contentId)
        .filter(id => id !== args.contentId)
    );
    
    // Get the content
    const content = await Promise.all(
      Array.from(relatedIds).map(id => ctx.db.get(id))
    );
    
    // Filter published and sort by date
    return content
      .filter(c => c && c.status === "published" && c.publishedAt)
      .sort((a, b) => (b!.publishedAt || 0) - (a!.publishedAt || 0))
      .slice(0, limit);
  },
});

// ============================================================================
// STATISTICS & METADATA
// ============================================================================

/**
 * Get content statistics
 */
export const getContentStats = query({
  args: {},
  handler: async (ctx) => {
    const allContent = await ctx.db.query("content").collect();
    
    const stats = {
      total: allContent.length,
      published: allContent.filter(c => c.status === "published").length,
      draft: allContent.filter(c => c.status === "draft").length,
      featured: allContent.filter(c => c.isFeatured).length,
      breaking: allContent.filter(c => c.isBreaking).length,
      premium: allContent.filter(c => c.isPremium).length,
    };
    
    return stats;
  },
});

/**
 * Get all feeds with content counts
 */
export const getFeedsWithCounts = query({
  args: {},
  handler: async (ctx) => {
    const feeds = await ctx.db
      .query("feeds")
      .withIndex("by_active_order")
      .collect();
    
    const feedsWithCounts = await Promise.all(
      feeds.map(async (feed) => {
        const contentFeeds = await ctx.db
          .query("contentFeeds")
          .withIndex("by_feed", (q) => q.eq("feedId", feed._id))
          .collect();
        
        return {
          ...feed,
          contentCount: contentFeeds.length,
        };
      })
    );
    
    return feedsWithCounts;
  },
});

/**
 * Get all tags with content counts
 */
export const getTagsWithCounts = query({
  args: {},
  handler: async (ctx) => {
    const tags = await ctx.db.query("tags").collect();
    
    const tagsWithCounts = await Promise.all(
      tags.map(async (tag) => {
        const contentTags = await ctx.db
          .query("contentTags")
          .withIndex("by_tag", (q) => q.eq("tagId", tag._id))
          .collect();
        
        return {
          ...tag,
          contentCount: contentTags.length,
        };
      })
    );
    
    return tagsWithCounts.sort((a, b) => b.contentCount - a.contentCount);
  },
});

// ============================================================================
// VIEW COUNT & ENGAGEMENT
// ============================================================================

/**
 * Increment view count
 */
export const incrementViewCount = mutation({
  args: { 
    contentId: v.id("content") 
  },
  handler: async (ctx, args) => {
    const content = await ctx.db.get(args.contentId);
    
    if (!content) {
      throw new Error("Content not found");
    }
    
    await ctx.db.patch(args.contentId, {
      viewCount: (content.viewCount || 0) + 1,
    });
    
    return { viewCount: (content.viewCount || 0) + 1 };
  },
});

/**
 * Get popular content (by view count)
 */
export const getPopularContent = query({
  args: {
    limit: v.optional(v.number()),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const days = args.days || 30;
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const content = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .filter((q) => 
        q.gte(q.field("publishedAt"), cutoffDate)
      )
      .collect();
    
    return content
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit);
  },
});
