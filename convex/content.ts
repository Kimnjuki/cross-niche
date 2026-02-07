/**
 * Content queries for the app – replaces Supabase content/feeds/niches reads.
 * Visible statuses: "published" and "new" (so content added with status "new" appears site-wide).
 * News Agency Ingestion: upsertIngestedContent mutation for NewsAPI pipeline.
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    try {
      const takeN = limit ?? 50;
      const [published, newStatus] = await Promise.all([
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
          .order("desc")
          .take(takeN),
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "new"))
          .order("desc")
          .take(takeN),
      ]);
      const seen = new Set<string>();
      const merged: typeof published = [];
      for (const doc of [...published, ...newStatus]) {
        if (!seen.has(doc._id)) {
          seen.add(doc._id);
          merged.push(doc);
        }
      }
      merged.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
      const docs = merged.slice(0, takeN);
      console.log("[content.listPublished] found", docs.length, "articles (status published|new)");
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

/**
 * List all visible articles (published or new), ignoring isFeatured. For sitemaps and archive.
 */
export const listAll = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 500 }) => {
    try {
      const takeN = Math.min(limit ?? 500, 500);
      const [published, newStatus] = await Promise.all([
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
          .order("desc")
          .take(takeN),
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "new"))
          .order("desc")
          .take(takeN),
      ]);
      const seen = new Set<string>();
      const merged: typeof published = [];
      for (const doc of [...published, ...newStatus]) {
        if (!seen.has(doc._id)) {
          seen.add(doc._id);
          merged.push(doc);
        }
      }
      merged.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
      const docs = merged.slice(0, takeN);
      console.log("[content.listAll] found", docs.length, "articles (status published|new)");
      const items = await Promise.all(
        docs.map((doc) => attachFeedAndNiches(ctx, doc))
      );
      return items.filter((x): x is NonNullable<typeof x> => x != null);
    } catch (err) {
      console.error("listAll error:", err);
      return [];
    }
  },
});

/**
 * Visible content for homepage: published + featured only, newest first.
 * Uses by_publishedAt index with order desc so new articles appear at the top.
 */
export const getVisibleContent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 24 }) => {
    try {
      const docs = await ctx.db
        .query("content")
        .withIndex("by_publishedAt")
        .order("desc")
        .take(200);
      const visible = docs.filter(
        (d) => (d.status === "published" || d.status === "new") && d.isFeatured === true
      );
      const slice = visible.slice(0, limit ?? 24);
      console.log("[content.getVisibleContent] found", slice.length, "featured articles");
      const items = await Promise.all(
        slice.map((doc) => attachFeedAndNiches(ctx, doc))
      );
      return items.filter((x): x is NonNullable<typeof x> => x != null);
    } catch (err) {
      console.error("getVisibleContent error:", err);
      return [];
    }
  },
});

/**
 * Featured content for homepage hero: status === "published" AND isFeatured === true, sorted by publishedAt desc.
 */
export const getFeaturedContent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 24 }) => {
    try {
      const [pub, newDocs] = await Promise.all([
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
          .order("desc")
          .take(200),
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "new"))
          .order("desc")
          .take(200),
      ]);
      const combined = [...pub, ...newDocs].filter(
        (d, i, arr) => arr.findIndex((x) => x._id === d._id) === i
      );
      combined.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
      const featured = combined.filter((d) => d.isFeatured === true);
      const slice = featured.slice(0, limit ?? 24);
      console.log("[content.getFeaturedContent] found", slice.length, "featured articles");
      const items = await Promise.all(
        slice.map((doc) => attachFeedAndNiches(ctx, doc))
      );
      return items.filter((x): x is NonNullable<typeof x> => x != null);
    } catch (err) {
      console.error("getFeaturedContent error:", err);
      return [];
    }
  },
});

/**
 * Latest content: most recent N articles (status published or new) regardless of featured status.
 */
export const getLatestContent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 10 }) => {
    try {
      const takeN = limit ?? 10;
      const [published, newStatus] = await Promise.all([
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
          .order("desc")
          .take(takeN),
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "new"))
          .order("desc")
          .take(takeN),
      ]);
      const seen = new Set<string>();
      const merged: typeof published = [];
      for (const doc of [...published, ...newStatus]) {
        if (!seen.has(doc._id)) {
          seen.add(doc._id);
          merged.push(doc);
        }
      }
      merged.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
      const docs = merged.slice(0, takeN);
      console.log("[content.getLatestContent] found", docs.length, "articles");
      const items = await Promise.all(
        docs.map((doc) => attachFeedAndNiches(ctx, doc))
      );
      return items.filter((x): x is NonNullable<typeof x> => x != null);
    } catch (err) {
      console.error("getLatestContent error:", err);
      return [];
    }
  },
});

/**
 * All visible content (published or new) for archive/explore/search pages.
 */
export const getAllPublishedContent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 30 }) => {
    try {
      const takeN = limit ?? 30;
      const [published, newStatus] = await Promise.all([
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
          .order("desc")
          .take(takeN),
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "new"))
          .order("desc")
          .take(takeN),
      ]);
      const seen = new Set<string>();
      const merged: typeof published = [];
      for (const doc of [...published, ...newStatus]) {
        if (!seen.has(doc._id)) {
          seen.add(doc._id);
          merged.push(doc);
        }
      }
      merged.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
      const docs = merged.slice(0, takeN);
      const items = await Promise.all(
        docs.map((doc) => attachFeedAndNiches(ctx, doc))
      );
      const filtered = items.filter((x): x is NonNullable<typeof x> => x != null);
      return { items: filtered, nextCursor: null };
    } catch (err) {
      console.error("getAllPublishedContent error:", err);
      return { items: [], nextCursor: null };
    }
  },
});

/**
 * Content by niche: joins content with contentNiches, returns published articles for the given niche ID.
 * Niche IDs: 1 = Tech, 2 = Security, 3 = Gaming.
 */
export const getContentByNiche = query({
  args: {
    nicheId: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { nicheId, limit = 30 }) => {
    try {
      const links = await ctx.db
        .query("contentNiches")
        .withIndex("by_niche", (q) => q.eq("nicheId", nicheId))
        .take(limit ?? 50);
      const contentIds = links.map((l) => l.contentId);
      const docs: Awaited<ReturnType<typeof attachFeedAndNiches>>[] = [];
      for (const id of contentIds) {
        const doc = await ctx.db.get(id);
        if (doc && (doc.status === "published" || doc.status === "new")) {
          const item = await attachFeedAndNiches(ctx, doc);
          if (item) docs.push(item);
        }
      }
      const filtered = docs.filter((x): x is NonNullable<typeof x> => x != null);
      filtered.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
      return filtered.slice(0, limit ?? 30);
    } catch (err) {
      console.error("getContentByNiche error:", err);
      return [];
    }
  },
});

export const listTrending = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 6 }) => {
    try {
      const takeN = (limit ?? 10) * 2;
      const [published, newStatus] = await Promise.all([
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
          .order("desc")
          .take(takeN),
        ctx.db
          .query("content")
          .withIndex("by_status_published_at", (q) => q.eq("status", "new"))
          .order("desc")
          .take(takeN),
      ]);
      const seen = new Set<string>();
      const docs: typeof published = [];
      for (const doc of [...published, ...newStatus]) {
        if (!seen.has(doc._id)) {
          seen.add(doc._id);
          docs.push(doc);
        }
      }
      docs.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
      const top = docs.slice(0, limit ?? 6);
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
        .first();
      if (!doc) return null;
      // Allow published, new, and unlisted so all visible/archived content is viewable by URL (e.g. /article/sec-1)
      if (doc.status !== "published" && doc.status !== "new" && doc.status !== "unlisted") return null;
      return await attachFeedAndNiches(ctx, doc);
    } catch (err) {
      console.error("getBySlug error:", err);
      return null;
    }
  },
});

/**
 * Sanity check: count and list all content in the table. Run with:
 *   npx convex run content:sanityCheckContent
 * Proves content is accessible and shows id, title, status, slug.
 */
export const sanityCheckContent = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("content").collect();
    const items = all.map((doc) => ({
      id: doc._id,
      title: doc.title ?? "(no title)",
      status: doc.status,
      slug: doc.slug ?? "(no slug)",
    }));
    console.log("[content.sanityCheckContent] total content rows:", all.length);
    return { count: all.length, items };
  },
});

/**
 * Get related articles by shared tags (fixes orphan pages, Internal Linking Bridge).
 * Returns 3–6 articles that share at least one tag with the given content.
 */
export const getRelated = query({
  args: {
    slug: v.string(),
    excludeId: v.optional(v.id("content")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { slug, excludeId, limit = 6 }) => {
    try {
      const doc = await ctx.db
        .query("content")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .filter((q) => q.eq(q.field("status"), "published"))
        .first();
      if (!doc) return [];

      const contentId = doc._id;
      const tagLinks = await ctx.db
        .query("contentTags")
        .withIndex("by_content", (q) => q.eq("contentId", contentId))
        .collect();
      const tagIds = tagLinks.map((l) => l.tagId);
      if (tagIds.length === 0) return [];

      const relatedIds = new Set<string>();
      for (const tagId of tagIds) {
        const links = await ctx.db
          .query("contentTags")
          .withIndex("by_tag", (q) => q.eq("tagId", tagId))
          .take(20);
        for (const l of links) {
          if (l.contentId !== contentId && (!excludeId || l.contentId !== excludeId)) {
            relatedIds.add(l.contentId);
          }
        }
      }

      const results: NonNullable<Awaited<ReturnType<typeof attachFeedAndNiches>>>[] = [];
      for (const id of relatedIds) {
        if (results.length >= (limit ?? 6)) break;
        const d = await ctx.db.get(id as import("./_generated/dataModel").Id<"content">);
        if (d && d.status === "published") {
          const item = await attachFeedAndNiches(ctx, d);
          if (item) results.push(item);
        }
      }
      results.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
      return results.slice(0, limit ?? 6);
    } catch (err) {
      console.error("getRelated error:", err);
      return [];
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

/** List ingested/automated news for NewsFeed (LiveWire). Sorted by publishedAt desc. */
export const listIngestedNews = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 20 }) => {
    try {
      const docs = await ctx.db
        .query("content")
        .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
        .order("desc")
        .take((limit ?? 30) * 2);
      const filtered = docs.filter((d) => d.isAutomated === true);
      const slice = filtered.slice(0, limit ?? 20);
      const items = await Promise.all(slice.map((doc) => attachFeedAndNiches(ctx, doc)));
      return items.filter((x): x is NonNullable<typeof x> => x != null);
    } catch (err) {
      console.error("listIngestedNews error:", err);
      return [];
    }
  },
});

/**
 * Upsert ingested content from NewsAPI. Validates externalId to prevent duplicates.
 * Maps agency categories to Nexus niches: technology→Tech, general→Tech, science→Tech; sports→Gaming; business→Tech.
 * Called by newsIngestor action.
 */
export const upsertIngestedContent = mutation({
  args: {
    externalId: v.string(),
    source: v.string(),
    originalUrl: v.string(),
    title: v.string(),
    body: v.string(),
    summary: v.optional(v.string()),
    publishedAt: v.number(),
    author: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("content")
      .withIndex("by_externalId", (q) => q.eq("externalId", args.externalId))
      .first();
    if (existing) return { success: false, reason: "duplicate" as const, id: existing._id };

    const slugBase = args.externalId
      .replace(/^https?:\/\//, "")
      .replace(/[^a-zA-Z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60);
    const safeSlug = (slugBase || `news-${Date.now()}`) + `-${Date.now().toString(36)}`;

    const nicheMap: Record<string, 1 | 2 | 3> = {
      technology: 1,
      tech: 1,
      science: 1,
      business: 1,
      general: 1,
      sports: 3,
      gaming: 3,
      entertainment: 3,
      health: 1,
    };
    const nicheId = nicheMap[args.category?.toLowerCase() ?? ""] ?? 1;

    const contentId = await ctx.db.insert("content", {
      title: args.title,
      slug: safeSlug,
      body: args.body,
      summary: args.summary ?? args.body.slice(0, 300) + "…",
      status: "published",
      publishedAt: args.publishedAt,
      featuredImageUrl: args.imageUrl,
      estimatedReadingTimeMinutes: Math.max(1, Math.ceil(args.body.split(" ").length / 200)),
      contentType: "news",
      isAutomated: true,
      source: args.source,
      originalUrl: args.originalUrl,
      externalId: args.externalId,
    });

    await ctx.db.insert("contentNiches", { contentId, nicheId });

    const feedSlug = nicheId === 1 ? "innovate" : nicheId === 2 ? "secured" : "play";
    const feed = await ctx.db
      .query("feeds")
      .withIndex("by_slug", (q) => q.eq("slug", feedSlug))
      .first();
    if (feed) {
      await ctx.db.insert("contentFeeds", { contentId, feedId: feed._id });
    }

    return { success: true, id: contentId };
  },
});

/**
 * Archive old content by unlisting it and removing it from featured status.
 * Can be run via the Convex Dashboard or a script.
 * Leverages the by_publishedAt index to efficiently find older content.
 */
export const archiveOldContent = mutation({
  args: {
    ids: v.optional(v.array(v.id("content"))),
    thresholdDate: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    let toUpdate: import("./_generated/dataModel").Id<"content">[] = [];

    if (args.ids) {
      toUpdate = args.ids;
    } else if (args.thresholdDate != null) {
      const oldArticles = await ctx.db
        .query("content")
        .withIndex("by_publishedAt", (q) =>
          q.lt("publishedAt", args.thresholdDate!)
        )
        .collect();
      toUpdate = oldArticles.map((article) => article._id);
    }

    let count = 0;
    for (const id of toUpdate) {
      await ctx.db.patch(id, {
        status: "unlisted",
        isFeatured: false,
      });
      count++;
    }

    return {
      success: true,
      archivedCount: count,
      message: `${count} articles moved to the background.`,
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
    source: doc.source ?? null,
    isAutomated: doc.isAutomated ?? false,
    originalUrl: doc.originalUrl ?? null,
  };
  } catch (err) {
    console.error("attachFeedAndNiches error:", err);
    return null;
  }
}
