/**
 * Convex Crons – scheduled jobs
 * - news-ingestion: content table (NewsAPI), every 60 minutes
 * - refresh-news-feed: articles table (NewsAPI + GNews), every 30 minutes
 */

import { cronJobs } from "convex/server";
import { internalMutation } from "./_generated/server";

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

    const totalCleaned = expiredArticles.length + expiredAiUpdates.length + expiredThreatIntel.length;
    console.log(`Auto-cleanup: Removed ${totalCleaned} expired items`);
  },
});

export default crons;
