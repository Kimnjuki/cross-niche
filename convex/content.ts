/**
 * Content queries for the app – replaces Supabase content/feeds/niches reads.
 * Use with: useQuery(api.content.listPublished, { limit: 20 })
 */

import { query } from "./_generated/server";
import { v } from "convex/values";

export const listPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    try {
      const docs = await ctx.db
        .query("content")
        .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
        .order("desc")
        .take(limit ?? 50);
      const items = await Promise.all(
        docs.map((doc) => attachFeedAndNiches(ctx, doc))
      );
      return items.filter((x): x is NonNullable<typeof x> => x != null);
    } catch (err) {
      console.error("listPublished error:", err);
      return [];
    }
  },
});

export const listTrending = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 6 }) => {
    try {
      const docs = await ctx.db
        .query("content")
        .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
        .order("desc")
        .take((limit ?? 10) * 2);
      const sorted = [...docs].sort(
        (a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0)
      );
      const top = sorted.slice(0, limit ?? 6);
      const items = await Promise.all(top.map((doc) => attachFeedAndNiches(ctx, doc)));
      return items.filter((x): x is NonNullable<typeof x> => x != null);
    } catch (err) {
      console.error("listTrending error:", err);
      return [];
    }
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    try {
      const doc = await ctx.db
        .query("content")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .filter((q) => q.eq(q.field("status"), "published"))
        .first();
      if (!doc) return null;
      return await attachFeedAndNiches(ctx, doc);
    } catch (err) {
      console.error("getBySlug error:", err);
      return null;
    }
  },
});

export const listFeeds = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("feeds")
      .order("asc")
      .collect();
  },
});

export const listNiches = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("niches")
      .withIndex("by_id_num")
      .order("asc")
      .collect();
  },
});

export const listByFeedSlug = query({
  args: { feedSlug: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { feedSlug, limit = 20 }) => {
    try {
      const feed = await ctx.db
        .query("feeds")
        .withIndex("by_slug", (q) => q.eq("slug", feedSlug))
        .first();
      if (!feed) return [];
      const links = await ctx.db
        .query("contentFeeds")
        .withIndex("by_feed", (q) => q.eq("feedId", feed._id))
        .take(limit ?? 50);
      const contentDocs: { _id: any; title: string; slug: string; body: string; summary?: string; status: string; publishedAt?: number; [k: string]: any }[] = [];
      for (const l of links) {
        const doc = await ctx.db.get(l.contentId);
        if (doc && doc.status === "published") contentDocs.push(doc);
      }
      contentDocs.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
      const slice = contentDocs.slice(0, limit ?? 20);
      const items = await Promise.all(
        slice.map((d) => attachFeedAndNiches(ctx, d, feed.slug, feed.name))
      );
      return items.filter((x): x is NonNullable<typeof x> => x != null);
    } catch (err) {
      console.error("listByFeedSlug error:", err);
      return [];
    }
  },
});

/** Diagnostics: count content and connection check */
export const diagnostics = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("content").collect();
    const published = all.filter((c) => c.status === "published");
    return {
      configured: true,
      totalArticles: all.length,
      publishedArticles: published.length,
      articlesWithBody: all.filter((c) => c.body && c.body.length > 0).length,
      articlesWithExcerpt: all.filter(
        (c) => (c.summary && c.summary.length > 0) || (c.body && c.body.length > 0)
      ).length,
      articlesWithAuthor: all.filter((c) => !!c.authorId).length,
    };
  },
});

// --- Helpers: attach feed_slug, feed_name, niches[], tags[] to content doc
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function attachFeedAndNiches(ctx: any, doc: any, overrideFeedSlug?: string, overrideFeedName?: string) {
  if (!doc || !doc._id) return null;
  const contentId = doc._id;
  let feedSlug = overrideFeedSlug ?? "";
  let feedName = overrideFeedName ?? "";

  try {
  const feedLink = await ctx.db
    .query("contentFeeds")
    .withIndex("by_content", (q: { eq: (a: string, b: unknown) => unknown }) => q.eq("contentId", contentId))
    .first();
  if (feedLink) {
    const feed = await ctx.db.get(feedLink.feedId);
    if (feed) {
      feedSlug = feed.slug ?? "";
      feedName = feed.name ?? "";
    }
  }

  const nicheLinks = await ctx.db
    .query("contentNiches")
    .withIndex("by_content", (q: { eq: (a: string, b: unknown) => unknown }) => q.eq("contentId", contentId))
    .collect();
  const nicheNames: string[] = [];
  for (const nl of nicheLinks) {
    const n = await ctx.db
      .query("niches")
      .withIndex("by_id_num", (q: { eq: (a: string, b: number) => unknown }) => q.eq("idNum", nl.nicheId))
      .first();
    if (n) nicheNames.push(n.name);
  }

  const tagLinks = await ctx.db
    .query("contentTags")
    .withIndex("by_content", (q: { eq: (a: string, b: unknown) => unknown }) => q.eq("contentId", contentId))
    .collect();
  const tagNames: string[] = [];
  for (const tl of tagLinks) {
    const t = await ctx.db.get(tl.tagId);
    if (t) tagNames.push(t.name);
  }

  const body = doc.body ?? "";
  const summary = doc.summary ?? null;
  const publishedAtMs = doc.publishedAt ?? (doc as { _creationTime?: number })._creationTime ?? null;
  const createdTimeMs = (doc as { _creationTime?: number })._creationTime ?? null;
  return {
    _id: doc._id,
    id: doc._id,
    title: doc.title ?? "Untitled",
    slug: doc.slug ?? String(doc._id),
    body,
    summary,
    excerpt: summary ?? (body ? body.slice(0, 200) + "…" : null),
    status: doc.status ?? "published",
    authorId: doc.authorId ?? null,
    publishedAt: publishedAtMs,
    published_at: publishedAtMs != null ? new Date(publishedAtMs).toISOString() : null,
    created_at: createdTimeMs != null ? new Date(createdTimeMs).toISOString() : null,
    updated_at: createdTimeMs != null ? new Date(createdTimeMs).toISOString() : null,
    featured_image_url: doc.featuredImageUrl ?? null,
    read_time_minutes: doc.estimatedReadingTimeMinutes ?? 5,
    is_featured: doc.isFeatured ?? false,
    is_breaking: doc.isBreaking ?? false,
    security_score: doc.securityScore ?? null,
    content_type: doc.contentType ?? "article",
    view_count: doc.viewCount ?? 0,
    feed_slug: feedSlug,
    feed_name: feedName,
    niches: nicheNames,
    tags: tagNames,
    author_name: "Anonymous",
  };
  } catch (err) {
    console.error("attachFeedAndNiches error:", err);
    return null;
  }
}
