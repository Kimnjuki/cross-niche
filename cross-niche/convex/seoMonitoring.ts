import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Thin content: short articles that should be expanded
export const findThinContent = query({
  args: {
    minWordCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const minWordCount = args.minWordCount ?? 300;

    const content = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    return content
      .map((item) => {
        const wordCount =
          item.wordCount ??
          (item.body ? item.body.split(/\s+/).length : 0);
        return { ...item, currentWordCount: wordCount };
      })
      .filter((item) => item.currentWordCount < minWordCount)
      .map((item) => ({
        _id: item._id,
        title: item.title,
        slug: item.slug,
        currentWordCount: item.currentWordCount,
        recommendedWordCount: minWordCount * 3,
      }));
  },
});

// Cannibalization: multiple pages targeting the same focus keyword
export const detectCannibalization = query({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const keywordGroups = new Map<string, any[]>();

    for (const item of content) {
      const keyword = item.focusKeyword;
      if (!keyword) continue;

      const existing = keywordGroups.get(keyword) ?? [];
      existing.push(item);
      keywordGroups.set(keyword, existing);
    }

    const results: any[] = [];

    for (const [keyword, pages] of keywordGroups.entries()) {
      if (pages.length > 1) {
        results.push({
          keyword,
          pages: pages.map((p) => ({
            id: p._id,
            title: p.title,
            slug: p.slug,
            viewCount: p.viewCount ?? 0,
            publishedAt: p.publishedAt,
          })),
        });
      }
    }

    return results;
  },
});

// Internal broken links: links in article bodies pointing to non-existent /article/* URLs
export const findBrokenInternalLinks = query({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const broken: {
      contentId: string;
      title: string;
      brokenLink: string;
    }[] = [];

    const articleBySlugCache = new Map<string, boolean>();

    for (const item of content) {
      if (!item.body) continue;
      const matches = item.body.match(/href=["'](\/article\/[^"']+)["']/g);
      if (!matches) continue;

      for (const raw of matches) {
        const href = raw.match(/href=["']([^"']+)["']/)?.[1];
        if (!href) continue;
        if (!href.startsWith("/article/")) continue;

        const slug = href.replace("/article/", "").split(/[?#]/)[0];
        if (!slug) continue;

        if (articleBySlugCache.has(slug)) {
          if (!articleBySlugCache.get(slug)) {
            broken.push({
              contentId: String(item._id),
              title: item.title,
              brokenLink: href,
            });
          }
          continue;
        }

        const target = await ctx.db
          .query("content")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .first();

        const exists =
          !!target &&
          target.status === "published" &&
          target.isDeleted !== true;

        articleBySlugCache.set(slug, exists);

        if (!exists) {
          broken.push({
            contentId: String(item._id),
            title: item.title,
            brokenLink: href,
          });
        }
      }
    }

    return broken;
  },
});

// Daily SEO audit – can be scheduled via Convex cron or called manually
export const dailySEOAudit = mutation({
  args: {},
  handler: async (ctx): Promise<{
    success: true;
    brokenLinks: number;
    thinContent: number;
    cannibalization: number;
    declining: number;
  }> => {
    const [brokenLinks, thinContent, cannibalization, declining]: [
      any[],
      any[],
      any[],
      any[]
    ] = await Promise.all([
      ctx.runQuery(api.seoMonitoring.findBrokenInternalLinks, {}),
      ctx.runQuery(api.seoMonitoring.findThinContent, {}),
      ctx.runQuery(api.seoMonitoring.detectCannibalization, {}),
      ctx.runQuery(api.seoOptimization.getContentWithDecliningTraffic, {
        lookbackMonths: 6,
        declineThresholdPercent: -20,
      }),
    ]);

    const now = Date.now();

    await ctx.db.insert("seoAudits", {
      date: now,
      brokenLinksCount: brokenLinks.length,
      thinContentCount: thinContent.length,
      cannibalizationCount: cannibalization.length,
      decliningContentCount: declining.length,
      issues: {
        brokenLinks,
        thinContent,
        cannibalization,
        declining,
      },
    });

    return {
      success: true,
      brokenLinks: brokenLinks.length,
      thinContent: thinContent.length,
      cannibalization: cannibalization.length,
      declining: declining.length,
    };
  },
});

// Optional: internal mutation hook if you want to call from Convex crons
export const runDailySEOAuditInternal = internalMutation({
  args: {},
  handler: async (ctx) => {
    await ctx.runMutation(api.seoMonitoring.dailySEOAudit, {});
  },
});

