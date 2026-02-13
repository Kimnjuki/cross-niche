/**
 * Grid Nexus - Admin Functions
 * Mutations for data management and fixing issues
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

// ============================================================================
// DATA FIX FUNCTIONS
// ============================================================================

/**
 * Publish all draft articles
 * Use this to fix articles stuck in draft status
 */
export const publishAllDrafts = mutation({
  args: {},
  handler: async (ctx) => {
    const drafts = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("status"), "draft"))
      .collect();

    const now = Date.now();
    let updated = 0;
    
    for (const draft of drafts) {
      await ctx.db.patch(draft._id, {
        status: "published",
        publishedAt: draft.publishedAt || now - (updated * 60000), // Stagger by 1 min each
      });
      updated++;
    }

    return { 
      success: true,
      updated,
      message: `Published ${updated} draft articles`
    };
  },
});

/**
 * Fix null or missing publishedAt dates
 */
export const fixPublishedDates = mutation({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();

    const now = Date.now();
    let fixed = 0;

    for (const item of content) {
      if (!item.publishedAt) {
        await ctx.db.patch(item._id, {
          publishedAt: now - (fixed * 3600000), // Stagger by 1 hour each
        });
        fixed++;
      }
    }

    return { 
      success: true,
      fixed,
      message: `Fixed ${fixed} articles with missing publishedAt dates`
    };
  },
});

/**
 * Fix all content status to published
 */
export const publishAllContent = mutation({
  args: {},
  handler: async (ctx) => {
    const allContent = await ctx.db.query("content").collect();
    const now = Date.now();
    let updated = 0;

    for (const content of allContent) {
      if (content.status !== "published") {
        await ctx.db.patch(content._id, {
          status: "published",
          publishedAt: content.publishedAt || now - (updated * 60000),
        });
        updated++;
      }
    }

    return { 
      success: true,
      updated,
      message: `Updated ${updated} articles to published status`
    };
  },
});

/**
 * Generate slugs for content without slugs
 */
export const generateMissingSlugs = mutation({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db.query("content").collect();
    let fixed = 0;

    for (const item of content) {
      if (!item.slug && item.title) {
        const slug = item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        await ctx.db.patch(item._id, { slug });
        fixed++;
      }
    }

    return { 
      success: true,
      fixed,
      message: `Generated slugs for ${fixed} articles`
    };
  },
});

// ============================================================================
// CONTENT CREATION
// ============================================================================

/**
 * Create new content
 */
export const createContent = mutation({
  args: {
    title: v.string(),
    slug: v.optional(v.string()),
    body: v.string(),
    summary: v.optional(v.string()),
    status: v.optional(v.string()),
    featuredImageUrl: v.optional(v.string()),
    authorId: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    isBreaking: v.optional(v.boolean()),
    isPremium: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Generate slug if not provided
    const slug = args.slug || args.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check if slug already exists
    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    
    if (existing) {
      throw new Error(`Content with slug "${slug}" already exists`);
    }
    
    const contentId = await ctx.db.insert("content", {
      title: args.title,
      slug,
      body: args.body,
      summary: args.summary || args.body.substring(0, 200) + "...",
      status: args.status || "published",
      publishedAt: args.status === "draft" ? undefined : now,
      featuredImageUrl: args.featuredImageUrl,
      authorId: args.authorId,
      isFeatured: args.isFeatured || false,
      isBreaking: args.isBreaking || false,
      isPremium: args.isPremium || false,
      viewCount: 0,
      wordCount: args.body.split(/\s+/).length,
      estimatedReadingTimeMinutes: Math.ceil(args.body.split(/\s+/).length / 200),
    });
    
    return { 
      success: true,
      contentId,
      slug,
      message: "Content created successfully"
    };
  },
});

/**
 * Update existing content
 */
export const updateContent = mutation({
  args: {
    contentId: v.id("content"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    body: v.optional(v.string()),
    summary: v.optional(v.string()),
    status: v.optional(v.string()),
    featuredImageUrl: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    isBreaking: v.optional(v.boolean()),
    isPremium: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { contentId, ...updates } = args;
    
    const content = await ctx.db.get(contentId);
    if (!content) {
      throw new Error("Content not found");
    }
    
    // Calculate word count and reading time if body is updated
    if (updates.body) {
      updates.wordCount = updates.body.split(/\s+/).length;
      updates.estimatedReadingTimeMinutes = Math.ceil(updates.wordCount / 200);
    }
    
    // Update modified timestamp
    updates.lastModifiedAt = Date.now();
    
    await ctx.db.patch(contentId, updates);
    
    return { 
      success: true,
      message: "Content updated successfully"
    };
  },
});

/**
 * Delete content (soft delete)
 */
export const deleteContent = mutation({
  args: {
    contentId: v.id("content"),
    permanent: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.permanent) {
      await ctx.db.delete(args.contentId);
      return { 
        success: true,
        message: "Content permanently deleted"
      };
    } else {
      await ctx.db.patch(args.contentId, {
        isDeleted: true,
        deletedAt: Date.now(),
        status: "deleted",
      });
      return { 
        success: true,
        message: "Content moved to trash"
      };
    }
  },
});

/**
 * Restore deleted content
 */
export const restoreContent = mutation({
  args: {
    contentId: v.id("content"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.contentId, {
      isDeleted: false,
      deletedAt: undefined,
      status: "draft",
    });
    
    return { 
      success: true,
      message: "Content restored successfully"
    };
  },
});

// ============================================================================
// SEED DATA
// ============================================================================

/**
 * Seed sample content for testing
 */
export const seedSampleContent = mutation({
  args: {
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const count = args.count || 10;
    const now = Date.now();
    
    const categories = [
      { title: "AI Breakthrough", body: "Researchers announce major AI advancement", niche: "tech" },
      { title: "Cybersecurity Alert", body: "New security threat identified", niche: "security" },
      { title: "Gaming Industry Report", body: "Analysis of gaming trends", niche: "gaming" },
      { title: "Cloud Computing Update", body: "Latest developments in cloud infrastructure", niche: "tech" },
      { title: "Data Privacy News", body: "Important privacy policy changes", niche: "security" },
      { title: "Esports Championship", body: "Major tournament results and highlights", niche: "gaming" },
      { title: "Machine Learning Advances", body: "New ML techniques and applications", niche: "tech" },
      { title: "Network Security Guide", body: "Best practices for network protection", niche: "security" },
      { title: "Game Review", body: "In-depth analysis of latest releases", niche: "gaming" },
      { title: "Tech Industry Analysis", body: "Market trends and predictions", niche: "tech" },
    ];
    
    const created = [];
    
    for (let i = 0; i < count; i++) {
      const item = categories[i % categories.length];
      const timestamp = now - (i * 3600000); // Stagger by 1 hour each
      
      const slug = `${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${timestamp}`;
      
      const contentId = await ctx.db.insert("content", {
        title: `${item.title} ${i + 1}`,
        slug,
        body: `# ${item.title}\n\n${item.body}\n\nThis is sample content for testing purposes.`,
        summary: item.body,
        status: "published",
        publishedAt: timestamp,
        featuredImageUrl: `https://images.unsplash.com/photo-${1500000000000 + i}`,
        isFeatured: i < 3,
        isBreaking: i === 0,
        viewCount: Math.floor(Math.random() * 1000),
        wordCount: 150,
        estimatedReadingTimeMinutes: 1,
      });
      
      created.push(contentId);
    }
    
    return { 
      success: true,
      created: created.length,
      message: `Created ${created.length} sample articles`
    };
  },
});

/**
 * Clear all sample/test content
 */
export const clearSampleContent = mutation({
  args: {},
  handler: async (ctx) => {
    const allContent = await ctx.db.query("content").collect();
    
    let deleted = 0;
    for (const content of allContent) {
      // Only delete if it's sample content (you can add more specific checks)
      if (content.body && content.body.includes("sample content for testing")) {
        await ctx.db.delete(content._id);
        deleted++;
      }
    }
    
    return { 
      success: true,
      deleted,
      message: `Deleted ${deleted} sample articles`
    };
  },
});

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk update content status
 */
export const bulkUpdateStatus = mutation({
  args: {
    contentIds: v.array(v.id("content")),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    for (const contentId of args.contentIds) {
      const content = await ctx.db.get(contentId);
      if (content) {
        await ctx.db.patch(contentId, {
          status: args.status,
          publishedAt: args.status === "published" ? (content.publishedAt || now) : content.publishedAt,
        });
      }
    }
    
    return { 
      success: true,
      updated: args.contentIds.length,
      message: `Updated ${args.contentIds.length} articles to ${args.status}`
    };
  },
});

/**
 * Bulk toggle featured status
 */
export const bulkToggleFeatured = mutation({
  args: {
    contentIds: v.array(v.id("content")),
    isFeatured: v.boolean(),
  },
  handler: async (ctx, args) => {
    for (const contentId of args.contentIds) {
      await ctx.db.patch(contentId, {
        isFeatured: args.isFeatured,
      });
    }
    
    return { 
      success: true,
      updated: args.contentIds.length,
      message: `${args.isFeatured ? 'Featured' : 'Unfeatured'} ${args.contentIds.length} articles`
    };
  },
});

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

/**
 * Get content health report
 */
export const getContentHealthReport = mutation({
  args: {},
  handler: async (ctx) => {
    const allContent = await ctx.db.query("content").collect();
    
    const issues = {
      missingSlug: 0,
      missingPublishedAt: 0,
      missingFeaturedImage: 0,
      missingSummary: 0,
      shortBody: 0,
      draftStatus: 0,
    };
    
    for (const content of allContent) {
      if (!content.slug) issues.missingSlug++;
      if (!content.publishedAt && content.status === "published") issues.missingPublishedAt++;
      if (!content.featuredImageUrl) issues.missingFeaturedImage++;
      if (!content.summary) issues.missingSummary++;
      if (content.body && content.body.length < 100) issues.shortBody++;
      if (content.status === "draft") issues.draftStatus++;
    }
    
    return {
      totalContent: allContent.length,
      issues,
      healthScore: Math.round(
        ((allContent.length - Object.values(issues).reduce((a, b) => a + b, 0)) / allContent.length) * 100
      ),
    };
  },
});

/**
 * Backup all content
 */
export const exportAllContent = mutation({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db.query("content").collect();
    const tags = await ctx.db.query("tags").collect();
    const feeds = await ctx.db.query("feeds").collect();
    const niches = await ctx.db.query("niches").collect();
    
    return {
      content,
      tags,
      feeds,
      niches,
      exportedAt: Date.now(),
      totalRecords: content.length + tags.length + feeds.length + niches.length,
    };
  },
});
