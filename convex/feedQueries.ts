/**
 * feedQueries.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Convex query helpers for the three page feeds:
 *   /innovate  → getInnovateContent
 *   /secured   → getSecuredContent
 *   /play      → getPlayContent
 *
 * Each query:
 *  - Looks up the feed by slug
 *  - Joins through contentFeeds → content
 *  - Returns content sorted by publishedAt DESC (newest first)
 *  - Supports optional pagination via a `limit` argument
 */

import { query } from "./_generated/server";
import { v } from "convex/values";

async function getContentForFeedSlug(
  db: any,
  feedSlug: string,
  limit: number
) {
  const feed = await db
    .query("feeds")
    .withIndex("by_slug", (q: any) => q.eq("slug", feedSlug))
    .first();

  if (!feed) return { feed: null, articles: [], total: 0 };

  const joins = await db
    .query("contentFeeds")
    .withIndex("by_feed", (q: any) => q.eq("feedId", feed._id))
    .collect();

  const contentPromises = joins.map((j: any) => db.get(j.contentId));
  const contentRaw = await Promise.all(contentPromises);

  const articles = contentRaw
    .filter(
      (c: any) =>
        c !== null &&
        c.status === "published" &&
        !c.isDeleted
    )
    .sort((a: any, b: any) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
    .slice(0, limit)
    .map((c: any) => ({
      _id: c._id,
      slug: c.slug,
      title: c.title,
      subtitle: c.subtitle,
      summary: c.summary,
      contentType: c.contentType,
      featuredImageUrl: c.featuredImageUrl,
      publishedAt: c.publishedAt,
      estimatedReadingTimeMinutes: c.estimatedReadingTimeMinutes,
      wordCount: c.wordCount,
      source: c.source,
      isBreaking: c.isBreaking,
      isFeatured: c.isFeatured,
      isPremium: c.isPremium,
      focusKeyword: c.focusKeyword,
      viewCount: c.viewCount,
      canonicalUrl: c.canonicalUrl,
    }));

  return {
    feed: {
      _id: feed._id,
      slug: feed.slug,
      name: feed.name,
      description: feed.description,
      icon: feed.icon,
      colorCode: feed.colorCode,
    },
    articles,
    total: articles.length,
  };
}

export const getInnovateContent = query({
  args: { limit: v.optional(v.number()) },
  handler: async ({ db }, { limit = 30 }) => {
    return getContentForFeedSlug(db, "innovate", limit);
  },
});

export const getSecuredContent = query({
  args: { limit: v.optional(v.number()) },
  handler: async ({ db }, { limit = 30 }) => {
    return getContentForFeedSlug(db, "secured", limit);
  },
});

export const getPlayContent = query({
  args: { limit: v.optional(v.number()) },
  handler: async ({ db }, { limit = 30 }) => {
    return getContentForFeedSlug(db, "play", limit);
  },
});

export const getFeedBySlug = query({
  args: {
    slug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async ({ db }, { slug, limit = 30 }) => {
    return getContentForFeedSlug(db, slug, limit);
  },
});

export const getAllFeeds = query({
  args: {},
  handler: async ({ db }) => {
    return db
      .query("feeds")
      .withIndex("by_active_order", (q: any) => q.eq("isActive", true))
      .collect();
  },
});

export const getFeaturedByFeed = query({
  args: {
    feedSlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async ({ db }, { feedSlug, limit = 5 }) => {
    const result = await getContentForFeedSlug(db, feedSlug, 200);
    const featured = result.articles
      .filter((a: any) => a.isFeatured)
      .slice(0, limit);
    return { feed: result.feed, articles: featured };
  },
});

export const getBreakingByFeed = query({
  args: {
    feedSlug: v.string(),
  },
  handler: async ({ db }, { feedSlug }) => {
    const result = await getContentForFeedSlug(db, feedSlug, 200);
    const breaking = result.articles.filter((a: any) => a.isBreaking);
    return { feed: result.feed, articles: breaking };
  },
});
