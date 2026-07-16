import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

/**
 * Google Search Console analytics storage.
 * Sync via GSC Search Analytics API when credentials are configured in Convex env:
 *   GSC_SERVICE_ACCOUNT_EMAIL
 *   GSC_SERVICE_ACCOUNT_PRIVATE_KEY
 *   GSC_SITE_URL (default: https://thegridnexus.com)
 *
 * Run: npx convex run gsc:getConnectionStatus
 */

export const getConnectionStatus = query({
  args: {},
  handler: async () => {
    const email = process.env.GSC_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GSC_SERVICE_ACCOUNT_PRIVATE_KEY;
    const siteUrl = process.env.GSC_SITE_URL || "https://thegridnexus.com";

    return {
      apiConfigured: Boolean(email && key),
      siteUrl,
      sitemapUrls: [
        `${siteUrl}/sitemap-index.xml`,
        `${siteUrl}/sitemap.xml`,
        `${siteUrl}/sitemap-articles.xml`,
        `${siteUrl}/sitemap-news.xml`,
      ],
      message: email && key
        ? "GSC API credentials configured. Implement syncGscAnalytics cron to pull data."
        : "GSC API credentials missing. Set GSC_SERVICE_ACCOUNT_EMAIL and GSC_SERVICE_ACCOUNT_PRIVATE_KEY in Convex dashboard.",
    };
  },
});

export const storeAnalyticsBatch = internalMutation({
  args: {
    rows: v.array(
      v.object({
        date: v.number(),
        clicks: v.number(),
        impressions: v.number(),
        ctr: v.number(),
        position: v.number(),
        query: v.optional(v.string()),
        page: v.optional(v.string()),
        country: v.optional(v.string()),
        device: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { rows }) => {
    const syncedAt = Date.now();
    for (const row of rows) {
      await ctx.db.insert("gscAnalytics", { ...row, syncedAt });
    }
    return { inserted: rows.length };
  },
});
