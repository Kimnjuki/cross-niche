/**
 * Convex Crons – scheduled jobs
 * - news-ingestion: content table (NewsAPI), every 60 minutes
 * - refresh-news-feed: articles table (NewsAPI + GNews), every 30 minutes
 */

import { cronJobs } from "convex/server";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// This mutation safely deletes anything where expiresAt is in the past
export const cleanupExpiredContent = internalMutation({
  handler: async (ctx) => {
    const now = Date.now();
    
    // Clean up articles (Live Wire / Nexus Intelligence)
    const expiredArticles = await ctx.db
      .query("articles")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .take(100); // Batch deletes to avoid transaction limits
      
    for (const article of expiredArticles) {
      await ctx.db.delete(article._id);
    }

    // Clean up AI Updates
    const expiredAiUpdates = await ctx.db
      .query("aiUpdates")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .take(100);
      
    for (const update of expiredAiUpdates) {
      await ctx.db.delete(update._id);
    }

    // Clean up Threat Intel
    const expiredThreatIntel = await ctx.db
      .query("threatIntel")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .take(100);
      
    for (const threat of expiredThreatIntel) {
      await ctx.db.delete(threat._id);
    }

    // Clean up expired log/session rows (P0-02 privacy TTL)
    const expiredLogs = await ctx.db
      .query("toolUsageLogs")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .take(500);
    for (const row of expiredLogs) {
      await ctx.db.delete(row._id);
    }

    const expiredModeration = await ctx.db
      .query("moderationResults")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .take(500);
    for (const row of expiredModeration) {
      await ctx.db.delete(row._id);
    }

    const expiredSessions = await ctx.db
      .query("copilotSessions")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .take(500);
    for (const row of expiredSessions) {
      await ctx.db.delete(row._id);
    }

    const expiredInteractions = await ctx.db
      .query("copilotInteractions")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .take(500);
    for (const row of expiredInteractions) {
      await ctx.db.delete(row._id);
    }

    const expiredSearchLogs = await ctx.db
      .query("searchLogs")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .take(500);
    for (const row of expiredSearchLogs) {
      await ctx.db.delete(row._id);
    }

    const expiredAiSummaries = await ctx.db
      .query("aiSearchSummaries")
      .withIndex("by_expiresAt", (q) => q.lt("expiresAt", now))
      .take(500);
    for (const row of expiredAiSummaries) {
      await ctx.db.delete(row._id);
    }

    // Expire newsletter verification tokens past TTL
    const expiredTokens = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_token_expires_at", (q) => q.lt("tokenExpiresAt", now))
      .take(500);
    for (const row of expiredTokens) {
      await ctx.db.patch(row._id, {
        verificationToken: undefined,
        tokenExpiresAt: undefined,
      });
    }

    const totalCleaned = expiredArticles.length + expiredAiUpdates.length + expiredThreatIntel.length
      + expiredLogs.length + expiredModeration.length + expiredSessions.length
      + expiredInteractions.length + expiredSearchLogs.length + expiredAiSummaries.length
      + expiredTokens.length;
    console.log(`Auto-cleanup: Removed ${totalCleaned} expired items`);
  },
});

// News ingestion into content table (NewsAPI → content.upsertIngestedContent)
// Runs every 60 minutes to keep tech/security/gaming news fresh.
crons.interval(
  "news-ingestion-content",
  { minutes: 60 },
  internal.newsIngestor.ingestFromNewsApi
);

// refresh-news-feed-articles DISABLED: Live Wire page removed; articles table has no
// active frontend readers. ingestFromNewsApi (above) already covers the content table.
// crons.interval("refresh-news-feed-articles", { minutes: 30 }, internal.ingest.runIngestion);

// Daily SEO health audit: indexability (noindex/canonical/dup titles/thin)
// + duplicate detection + orphan-page report → seoAudits (P3-03).
crons.daily(
  "daily-seo-health-audit",
  { hourUTC: 3, minuteUTC: 30 },
  internal.seoValidation.runSeoHealthAuditInternal,
);

// Daily legacy SEO audit (broken links, thin content, cannibalisation,
// declining traffic → seoAudits).
crons.daily(
  "daily-seo-monitoring-audit",
  { hourUTC: 3, minuteUTC: 45 },
  internal.seoMonitoring.runDailySEOAuditInternal,
);

// Daily purge of expired log/session rows (P0-02 privacy TTL).
crons.daily(
  "purge-expired",
  { hourUTC: 4, minuteUTC: 0 },
  internal.crons.cleanupExpiredContent,
);

export default crons;
