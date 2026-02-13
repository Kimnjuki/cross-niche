/**
 * Grid Nexus - Admin Functions
 * Data management and fixes for content
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Publish all draft articles
 */
export const publishAllDrafts = mutation({
  args: {},
  handler: async (ctx) => {
    const drafts = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "draft"))
      .collect();
    
    let updated = 0;
    for (const draft of drafts) {
      await ctx.db.patch(draft._id, {
        status: "published",
        publishedAt: draft.publishedAt || Date.now(),
      });
      updated++;
    }
    
    console.log(`Published ${updated} draft articles`);
    return { updated };
  },
});

/**
 * Fix missing publishedAt dates
 */
export const fixPublishedDates = mutation({
  args: {},
  handler: async (ctx) => {
    const published = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    
    let fixed = 0;
    for (const article of published) {
      if (!article.publishedAt) {
        await ctx.db.patch(article._id, {
          publishedAt: Date.now(),
        });
        fixed++;
      }
    }
    
    console.log(`Fixed ${fixed} articles with missing publishedAt dates`);
    return { fixed };
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
 * Seed sample content if database is empty
 */
export const seedSampleContent = mutation({
  args: {
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const count = args.count || 10;
    const now = Date.now();
    
    const sampleArticles = [
      {
        title: "Breaking: Major Security Vulnerability Discovered",
        slug: "major-security-vulnerability-discovered",
        status: "published",
        publishedAt: now,
        contentType: "news" as any,
        summary: "Critical security vulnerability affects millions of devices",
        body: "Full article content here...",
        author: "Security Team",
        isBreaking: true,
        isFeatured: true,
      },
      {
        title: "Next-Gen Gaming Console Performance Analysis",
        slug: "next-gen-gaming-console-performance",
        status: "published", 
        publishedAt: now - (24 * 60 * 60 * 1000), // 1 day ago
        contentType: "review" as any,
        summary: "In-depth performance review of latest gaming hardware",
        body: "Full review content here...",
        author: "Gaming Team",
        isFeatured: false,
      },
      {
        title: "Complete Guide to Cloud Security",
        slug: "complete-guide-to-cloud-security",
        status: "published",
        publishedAt: now - (2 * 24 * 60 * 60 * 1000), // 2 days ago
        contentType: "guide" as any,
        summary: "Step-by-step guide to securing your cloud infrastructure",
        body: "Full guide content here...",
        author: "Tech Team",
        isFeatured: false,
      },
    ];
    
    let created = 0;
    for (let i = 0; i < Math.min(count, sampleArticles.length); i++) {
      await ctx.db.insert("content", sampleArticles[i] as any);
      created++;
    }
    
    console.log(`Seeded ${created} sample articles`);
    return { created };
  },
});
