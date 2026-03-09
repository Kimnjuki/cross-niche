/**
 * SEO Optimization utilities for content
 * - Generate structured data (JSON-LD)
 * - Optimize for Core Web Vitals
 * - Optimize for Google News
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateStructuredData = mutation({
  args: {
    contentId: v.id("content"),
    schemaType: v.union(
      v.literal("NewsArticle"),
      v.literal("Article"),
      v.literal("BlogPosting")
    ),
  },
  handler: async (ctx, { contentId, schemaType }) => {
    const content = await ctx.db.get(contentId);
    if (!content || content.status !== "published") {
      throw new Error("Content not found or not published");
    }

    // Generate structured data based on type
    const structuredData = {
      "@context": "https://schema.org",
      "@type": schemaType,
      headline: content.title,
      description: content.summary || "",
      image: content.featuredImageUrl || "",
      author: {
        "@type": "Person",
        name: content.authorId
          ? `Author ${content.authorId}`
          : "Grid Nexus Team",
      },
      publisher: {
        "@type": "Organization",
        name: "The Grid Nexus",
        logo: {
          "@type": "ImageObject",
          url: "https://thegridnexus.com/logo.png",
        },
      },
      datePublished: content.publishedAt
        ? new Date(content.publishedAt).toISOString()
        : "",
      dateModified: content._creationTime
        ? new Date(content._creationTime).toISOString()
        : "",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://thegridnexus.com/article/${content.slug}`,
      },
    };

    return structuredData;
  },
});

export const optimizeForCoreWebVitals = mutation({
  args: {
    contentId: v.id("content"),
  },
  handler: async (ctx, { contentId }) => {
    const content = await ctx.db.get(contentId);
    if (!content) {
      throw new Error("Content not found");
    }

    // Simulate Core Web Vitals optimization
    // In a real implementation, this would:
    // - Optimize images (WebP, lazy loading)
    // - Minify CSS/JS
    // - Add proper meta tags
    // - Implement resource hints
    
    const optimizations = {
      optimizedImages: true,
      lazyLoading: true,
      minifiedAssets: true,
      metaTags: {
        title: content.title,
        description: content.summary || "",
        ogImage: content.featuredImageUrl || "",
        canonical: `https://thegridnexus.com/article/${content.slug}`,
      },
      resourceHints: {
        preconnect: ["https://fonts.googleapis.com"],
        dnsPrefetch: ["https://thegridnexus.com"],
      },
    };

    return optimizations;
  },
});

export const optimizeForGoogleNews = mutation({
  args: {
    contentId: v.id("content"),
  },
  handler: async (ctx, { contentId }) => {
    const content = await ctx.db.get(contentId);
    if (!content || content.status !== "published") {
      throw new Error("Content not found or not published");
    }

    // Check if content is eligible for Google News
    const isEligible =
      content.isAutomated === false &&
      content.publishedAt &&
      content.featuredImageUrl &&
      content.summary &&
      content.summary.length > 100;

    if (!isEligible) {
      return {
        eligible: false,
        reason: 'Content does not meet Google News guidelines',
      };
    }

    // Generate Google News specific optimizations
    const newsOptimizations = {
      eligible: true,
      newsKeywords: [], // Tags not available in current schema
      newsStandout: [
        {
          type: "Opinion",
          value: false,
        },
        {
          type: "Satire",
          value: false,
        },
      ],
      publication: {
        name: "The Grid Nexus",
        language: "en",
      },
      geo: {
        coverage: ["Worldwide"],
      },
    };

    return newsOptimizations;
  },
});

export const getSEOContent = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, { slug }) => {
    const content = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (!content || content.status !== "published") {
      return null;
    }

    return {
      ...content,
      seoScore: calculateSEOScore(content),
      recommendations: generateSEORecommendations(content),
    };
  },
});

function calculateSEOScore(content: any): number {
  let score = 0;
  
  // Title optimization (30 points)
  if (content.title && content.title.length >= 30 && content.title.length <= 60) {
    score += 30;
  } else if (content.title && content.title.length > 0) {
    score += 15;
  }
  
  // Description optimization (25 points)
  if (content.summary && content.summary.length >= 120 && content.summary.length <= 160) {
    score += 25;
  } else if (content.summary && content.summary.length > 50) {
    score += 12;
  }
  
  // Image optimization (20 points)
  if (content.featuredImageUrl) {
    score += 20;
  }
  
  // Content length (15 points)
  if (content.body && content.body.length > 300) {
    score += 15;
  } else if (content.body && content.body.length > 100) {
    score += 8;
  }
  
  // Publication date (10 points)
  if (content.publishedAt) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

function generateSEORecommendations(content: any): string[] {
  const recommendations: string[] = [];
  
  if (!content.title || content.title.length < 30) {
    recommendations.push("Title should be between 30-60 characters for better SEO");
  }
  
  if (!content.summary || content.summary.length < 120) {
    recommendations.push("Meta description should be between 120-160 characters");
  }
  
  if (!content.featuredImageUrl) {
    recommendations.push("Add a featured image to improve click-through rates");
  }
  
  if (!content.body || content.body.length < 300) {
    recommendations.push("Content should be at least 300 words for better ranking");
  }
  
  if (!content.publishedAt) {
    recommendations.push("Set a publication date for better indexing");
  }
  
  if (!content.tags || content.tags.length === 0) {
    recommendations.push("Add relevant tags to improve discoverability");
  }
  
  return recommendations;
}

// ─── Content Optimization & Gap Management ───────────────────────────────────

export const optimizeContentForKeyword = mutation({
  args: {
    contentId: v.id("content"),
    keyword: v.string(),
    metaTitle: v.string(),
    seoDescription: v.string(),
    targetWordCount: v.number(),
    improvements: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const content = await ctx.db.get(args.contentId);
    if (!content) {
      throw new Error("Content not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.contentId, {
      focusKeyword: args.keyword,
      metaTitle: args.metaTitle,
      seoDescription: args.seoDescription,
      wordCount: args.targetWordCount,
      lastModifiedAt: now,
      lastModifiedBy: "seo_optimization",
    });

    // Record optimization snapshot
    await ctx.db.insert("contentOptimization", {
      contentId: args.contentId,
      targetKeyword: args.keyword,
      currentRank: undefined,
      targetRank: undefined,
      optimizationDate: now,
      improvements: args.improvements ?? [],
      resultRank: undefined,
      trafficIncrease: undefined,
    });

    return { success: true };
  },
});

export const getContentWithDecliningTraffic = query({
  args: {
    lookbackMonths: v.optional(v.number()),
    declineThresholdPercent: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const months = args.lookbackMonths ?? 6;
    const declineThreshold = args.declineThresholdPercent ?? -20;
    const now = Date.now();
    const since = now - months * 30 * 24 * 60 * 60 * 1000;

    const content = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const declining: any[] = [];

    for (const item of content) {
      const analytics = await ctx.db
        .query("contentAnalytics")
        .withIndex("by_content_date", (q) =>
          q.eq("contentId", item._id)
        )
        .filter((q) => q.gte(q.field("date"), since))
        .collect();

      if (analytics.length < 2) continue;

      const sorted = analytics.sort((a, b) => a.date - b.date);
      const mid = Math.floor(sorted.length / 2);
      const older = sorted.slice(0, mid);
      const recent = sorted.slice(mid);

      const avgOlder =
        older.reduce((sum, a) => sum + a.views, 0) / older.length;
      const avgRecent =
        recent.reduce((sum, a) => sum + a.views, 0) / recent.length;

      if (avgOlder === 0) continue;

      const decline = ((avgRecent - avgOlder) / avgOlder) * 100;

      if (decline <= declineThreshold) {
        declining.push({
          ...item,
          decline,
          recentTraffic: avgRecent,
          olderTraffic: avgOlder,
        });
      }
    }

    return declining.sort((a, b) => a.decline - b.decline);
  },
});

export const getOldLowTrafficContent = query({
  args: {
    maxViews: v.optional(v.number()),
    olderThanDays: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const maxViews = args.maxViews ?? 100;
    const olderThanDays = args.olderThanDays ?? 365;
    const cutoff =
      Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

    const items = await ctx.db
      .query("content")
      .withIndex("by_publishedAt")
      .filter((q) =>
        q.and(
          q.lte(q.field("publishedAt"), cutoff),
          q.eq(q.field("status"), "published")
        )
      )
      .collect();

    return items.filter((item) => {
      const views = item.viewCount ?? 0;
      return views <= maxViews;
    });
  },
});

export const refreshEvergreenContent = mutation({
  args: {
    contentId: v.id("content"),
    newBody: v.string(),
    updatedSections: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const content = await ctx.db.get(args.contentId);
    if (!content) {
      throw new Error("Content not found");
    }

    const now = Date.now();
    const previousViews = content.viewCount ?? 0;

    await ctx.db.patch(args.contentId, {
      body: args.newBody,
      lastModifiedAt: now,
      title: content.title.includes("2026")
        ? content.title
        : `${content.title} (Updated 2026)`,
    });

    await ctx.db.insert("contentRefreshes", {
      contentId: args.contentId,
      refreshDate: now,
      changesMade: args.updatedSections,
      trafficBefore: previousViews,
      trafficAfter: undefined,
      rankBefore: undefined,
      rankAfter: undefined,
    });

    return { success: true };
  },
});

export const bulkUpsertContentGaps = mutation({
  args: {
    items: v.array(
      v.object({
        keyword: v.string(),
        searchVolume: v.number(),
        keywordDifficulty: v.number(),
        competitorCount: v.number(),
        priority: v.number(),
        status: v.optional(
          v.union(
            v.literal("identified"),
            v.literal("in_progress"),
            v.literal("published"),
            v.literal("ranking")
          )
        ),
        targetRank: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    for (const item of args.items) {
      const existing = await ctx.db
        .query("contentGaps")
        .withIndex("by_keyword", (q) =>
          q.eq("keyword", item.keyword)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          searchVolume: item.searchVolume,
          keywordDifficulty: item.keywordDifficulty,
          competitorCount: item.competitorCount,
          priority: item.priority,
          status: item.status ?? existing.status,
          targetRank: item.targetRank ?? existing.targetRank,
        });
      } else {
        await ctx.db.insert("contentGaps", {
          keyword: item.keyword,
          searchVolume: item.searchVolume,
          keywordDifficulty: item.keywordDifficulty,
          competitorCount: item.competitorCount,
          priority: item.priority,
          status: item.status ?? "identified",
          targetRank: item.targetRank,
          currentRank: undefined,
          contentId: undefined,
          createdAt: now,
        });
      }
    }

    return { success: true, count: args.items.length };
  },
});
