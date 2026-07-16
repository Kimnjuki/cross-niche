/**
 * SEO health checks for Ahrefs-style issues (orphans, missing canonicals, redirect loops).
 * Adapted to this codebase's real schema: `content`, `internalLinks`, `brokenLinks`, `seoAudits`.
 */

import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

const SITE = "https://thegridnexus.com";

/** Detect cycles in brokenLinks.redirectTo chains (path graph). */
function findRedirectLoops(
  rules: Array<{ url: string; redirectTo?: string }>
): string[][] {
  const graph = new Map<string, string>();
  for (const r of rules) {
    if (!r.redirectTo) continue;
    const from = normalizePath(r.url);
    const to = normalizePath(r.redirectTo);
    if (from && to) graph.set(from, to);
  }

  const loops: string[][] = [];
  for (const start of graph.keys()) {
    const seen: string[] = [];
    let cur: string | undefined = start;
    for (let i = 0; i < 8 && cur; i++) {
      if (seen.includes(cur)) {
        loops.push([...seen, cur]);
        break;
      }
      seen.push(cur);
      cur = graph.get(cur);
    }
    if (cur && seen.includes(cur)) {
      /* already recorded */
    }
  }
  return loops;
}

function normalizePath(input: string): string {
  try {
    if (input.startsWith("http")) {
      return new URL(input).pathname.replace(/\/$/, "") || "/";
    }
    return (input.startsWith("/") ? input : `/${input}`).replace(/\/$/, "") || "/";
  } catch {
    return input;
  }
}

/**
 * Count published content with zero incoming internalLinks (orphan candidates).
 */
export const countOrphanedContent = query({
  args: {},
  handler: async (ctx) => {
    const published = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const visible = published.filter((c) => c.isDeleted !== true);
    let orphaned = 0;
    const samples: Array<{ id: string; slug: string; title: string }> = [];

    for (const doc of visible) {
      const inbound = await ctx.db
        .query("internalLinks")
        .withIndex("by_target", (q) => q.eq("targetContentId", doc._id))
        .first();
      if (!inbound) {
        orphaned++;
        if (samples.length < 25) {
          samples.push({ id: doc._id, slug: doc.slug, title: doc.title });
        }
      }
    }

    return {
      publishedCount: visible.length,
      orphanedPostCount: orphaned,
      samples,
    };
  },
});

/**
 * Ensure every published content row has a self-canonical URL.
 */
export const backfillCanonicalUrls = mutation({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 200;
    const published = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .take(limit * 2);

    let updated = 0;
    for (const doc of published) {
      if (doc.isDeleted === true) continue;
      const expected = `${SITE}/article/${doc.slug}`;
      if (doc.canonicalUrl === expected) continue;
      await ctx.db.patch(doc._id, {
        canonicalUrl: expected,
        lastModifiedAt: Date.now(),
      });
      updated++;
      if (updated >= limit) break;
    }
    return { updated };
  },
});

/**
 * Link orphaned published posts to a recent pillar (same contentType / recent published).
 */
export const backfillOrphanInternalLinks = mutation({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const published = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
      .order("desc")
      .take(500);

    const visible = published.filter((c) => c.isDeleted !== true);
    if (visible.length < 2) return { linked: 0 };

    const pillar = visible[0];
    let linked = 0;

    for (const doc of visible.slice(1)) {
      if (linked >= limit) break;
      const inbound = await ctx.db
        .query("internalLinks")
        .withIndex("by_target", (q) => q.eq("targetContentId", doc._id))
        .first();
      if (inbound) continue;
      if (doc._id === pillar._id) continue;

      await ctx.db.insert("internalLinks", {
        sourceContentId: pillar._id,
        targetContentId: doc._id,
        anchorText: doc.title.slice(0, 80),
        context: "seo-orphan-backfill",
        createdAt: Date.now(),
        clickCount: 0,
        ctaType: "contextual",
        positionInContent: "bottom",
      });
      linked++;
    }

    return { linked, pillarSlug: pillar.slug };
  },
});

export const detectBrokenLinkRedirectLoops = query({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.db.query("brokenLinks").collect();
    const withRedirect = links.filter((l) => l.redirectTo && !l.fixed);
    const loops = findRedirectLoops(
      links.map((l) => ({ url: l.url, redirectTo: l.redirectTo }))
    );
    return {
      activeRedirects: withRedirect.length,
      loops,
      loopCount: loops.length,
    };
  },
});

/**
 * Nightly snapshot into seoAudits for trend visibility (ISSUE-3 safeguard).
 */
export const runSeoHealthSnapshot = internalMutation({
  args: {},
  handler: async (ctx) => {
    const published = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    const visible = published.filter((c) => c.isDeleted !== true);

    let orphanedPostCount = 0;
    let postsWithNoSchema = 0;
    for (const doc of visible) {
      const inbound = await ctx.db
        .query("internalLinks")
        .withIndex("by_target", (q) => q.eq("targetContentId", doc._id))
        .first();
      if (!inbound) orphanedPostCount++;
      if (!doc.schema_org && !doc.canonicalUrl) postsWithNoSchema++;
    }

    const broken = await ctx.db
      .query("brokenLinks")
      .withIndex("by_fixed", (q) => q.eq("fixed", false))
      .collect();

    await ctx.db.insert("seoAudits", {
      date: Date.now(),
      brokenLinksCount: broken.length,
      thinContentCount: 0,
      cannibalizationCount: 0,
      decliningContentCount: 0,
      issues: {
        orphanedPostCount,
        postsWithNoSchema,
        publishedCount: visible.length,
        source: "seoHealth.runSeoHealthSnapshot",
      },
    });

    return { orphanedPostCount, postsWithNoSchema, publishedCount: visible.length };
  },
});

export const getLatestSeoHealth = query({
  args: {},
  handler: async (ctx) => {
    const latest = await ctx.db.query("seoAudits").withIndex("by_date").order("desc").first();
    return latest ?? null;
  },
});

/** Reject self-referential or cyclic brokenLink redirects at write time. */
export const setRedirectSafe = mutation({
  args: {
    url: v.string(),
    redirectTo: v.string(),
  },
  handler: async (ctx, args) => {
    const from = normalizePath(args.url);
    const to = normalizePath(args.redirectTo);
    if (!from || !to) throw new Error("Invalid redirect paths");
    if (from === to) throw new Error("Self-referential redirect rejected");

    const all = await ctx.db.query("brokenLinks").collect();
    const proposed = all.map((l) => ({
      url: l.url,
      redirectTo: normalizePath(l.url) === from ? args.redirectTo : l.redirectTo,
    }));
    // Ensure the proposed row exists in the graph
    if (!proposed.some((p) => normalizePath(p.url) === from)) {
      proposed.push({ url: args.url, redirectTo: args.redirectTo });
    }
    const loops = findRedirectLoops(proposed);
    if (loops.length > 0) {
      throw new Error(`Redirect loop detected: ${loops[0].join(" -> ")}`);
    }

    const existing = await ctx.db
      .query("brokenLinks")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();

    if (!existing) {
      await ctx.db.insert("brokenLinks", {
        url: args.url,
        statusCode: 301,
        backlinkCount: 0,
        referringDomains: [],
        lastChecked: Date.now(),
        redirectTo: args.redirectTo,
        fixed: true,
      });
    } else {
      await ctx.db.patch(existing._id, {
        redirectTo: args.redirectTo,
        fixed: true,
        lastChecked: Date.now(),
      });
    }

    return { success: true, from, to };
  },
});
