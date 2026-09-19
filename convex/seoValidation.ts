/**
 * SEO validation & reporting (SEO remediation P0-01, P0-02, P0-07, P0-08,
 * P1-01..P1-05, P2-01, P3-03).
 *
 * Convex-side companion to `src/lib/seo/contentSeo.ts`. This module is
 * intentionally self-contained (the browser module lives under `src/`, which
 * Convex does not bundle), re-implementing the same thresholds so the
 * editorial UI and the data layer agree on what is publishable.
 */

import { mutation, query, internalMutation, QueryCtx, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

/* ── Thresholds (mirror src/lib/seo/contentSeo.ts) ───────────────────────── */

export const MAX_TITLE_LENGTH = 60;
export const MAX_DESCRIPTION_LENGTH = 160;
export const MIN_LONG_FORM_WORDS = 300;

const LONG_FORM_CONTENT_TYPES = new Set([
  "guide",
  "review",
  "feature",
  "tutorial",
  "gaming_security_guide",
]);

function titleKey(input: unknown) {
  return String(input ?? "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}

function countWords(text: string | null | undefined) {
  const clean = String(text ?? "").replace(/<[^>]*>/g, " ");
  return clean.split(/\s+/).filter(Boolean).length;
}

function truncateAtWord(text: string | null | undefined, max: number) {
  const clean = String(text ?? "").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const pos = cut.lastIndexOf(" ");
  return `${(pos > 0 ? cut.slice(0, pos) : cut).replace(/[,\s]+$/, "")}\u2026`;
}

/* ── Shared loaders ──────────────────────────────────────────────────────── */

async function loadPublished(ctx: QueryCtx | MutationCtx) {
  const docs = await ctx.db
    .query("content")
    .withIndex("by_status", (q) => q.eq("status", "published"))
    .collect();
  return docs.filter((d) => d.isDeleted !== true && d.noindex !== true);
}

/* ── P1-01 / P1-04 / P1-05 / P0-07: publish-time validation gate ────────── */

export const validatePublish = mutation({
  args: {
    title: v.string(),
    metaTitle: v.optional(v.string()),
    slug: v.string(),
    body: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    contentType: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    status: v.optional(v.string()),
    noindex: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean()),
    /** Computed title key of the doc being edited (excludes self from dup check). */
    selfKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const issues = [];

    const status = args.status ?? "published";
    if (status === "published" && args.isDeleted !== true && args.noindex !== true) {
      // Missing slug → cannot emit a canonical URL (P0-07).
      if (!args.slug.trim()) {
        issues.push({
          field: "slug",
          severity: "error",
          message: "Content has no slug, so it cannot emit a canonical URL.",
        });
      }

      // Duplicate computed title across published content (P1-01).
      const key = titleKey(args.metaTitle || args.title);
      if (key && key !== args.selfKey) {
        const published = await loadPublished(ctx);
        const dup = published.find((d) => titleKey(d.metaTitle || d.title) === key);
        if (dup) {
          const disambiguated = truncateAtWord(
            `${args.metaTitle || args.title} — ${args.contentType || "Updated"}`,
            MAX_TITLE_LENGTH,
          );
          issues.push({
            field: "metaTitle",
            severity: "error",
            message: `Title duplicates published "${dup.title}" (slug: ${dup.slug}).`,
            suggestion: disambiguated,
          });
        }
      }

      // Title too long (P1-04).
      const computed = args.metaTitle?.trim()
        ? `${args.metaTitle.trim()} | The Grid Nexus`
        : `${args.title} | The Grid Nexus`;
      if (computed.length > MAX_TITLE_LENGTH) {
        issues.push({
          field: "metaTitle",
          severity: "warning",
          message: `Title is ${computed.length} chars; truncated beyond ${MAX_TITLE_LENGTH}.`,
          suggestion: truncateAtWord(computed, MAX_TITLE_LENGTH),
        });
      }

      // Missing meta description (P1-03) — advisory, renderer has fallback.
      if (!args.seoDescription?.trim()) {
        issues.push({
          field: "seoDescription",
          severity: "warning",
          message: "No hand-written meta description; fallback derived from summary.",
        });
      }

      // Thin long-form content (P1-05).
      const type = (args.contentType ?? "").toLowerCase();
      const words =
        args.wordCount && args.wordCount > 0 ? args.wordCount : countWords(args.body);
      if (LONG_FORM_CONTENT_TYPES.has(type) && words < MIN_LONG_FORM_WORDS) {
        issues.push({
          field: "body",
          severity: "error",
          message: `${type} is ${words} words; long-form under ${MIN_LONG_FORM_WORDS} is thin.`,
        });
      }
    }

    return { issues, blocking: issues.some((i) => i.severity === "error") };
  },
});


/* ── P0-02 / P0-07 / P1-01 / P1-03 / P1-04 / P1-05: site-wide audit ──────── */

export const runIndexabilityAudit = query({
  args: {},
  handler: async (ctx) => {
    const published = await loadPublished(ctx);
    const allPublished = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    const noindexed = allPublished.filter(
      (d) => d.isDeleted !== true && d.noindex === true,
    );

    const titleKeys = new Map();
    const issues = {
      // P0-02: published but explicitly noindexed (review each one).
      unintentionallyNoindexed: noindexed.map((d) => ({
        _id: String(d._id),
        title: d.title,
        slug: d.slug,
        noindexReason: d.noindexReason ?? null,
      })),
      // P0-07: published pages without canonicalUrl.
      missingCanonical: [] as { _id: string; slug: string; title: string }[],
      // P1-01: duplicate computed titles.
      duplicateTitles: [] as { key: string; pages: { _id: string; slug: string; title: string }[] }[],
      // P1-03: missing/empty meta description.
      missingDescription: [] as { _id: string; slug: string; title: string }[],
      // P1-04: titles over 60 chars.
      longTitles: [] as { _id: string; slug: string; length: number }[],
      // P1-05: thin long-form content.
      thinLongForm: [] as { _id: string; slug: string; words: number; contentType: string }[],
    };

    for (const d of published) {
      const computedTitle = d.metaTitle?.trim()
        ? `${d.metaTitle.trim()} | The Grid Nexus`
        : `${d.title} | The Grid Nexus`;

      if (!d.canonicalUrl) {
        issues.missingCanonical.push({ _id: String(d._id), slug: d.slug, title: d.title });
      }
      if (!d.seoDescription?.trim()) {
        issues.missingDescription.push({ _id: String(d._id), slug: d.slug, title: d.title });
      }
      if (computedTitle.length > MAX_TITLE_LENGTH) {
        issues.longTitles.push({ _id: String(d._id), slug: d.slug, length: computedTitle.length });
      }

      const type = (d.contentType ?? "").toLowerCase();
      const words = d.wordCount && d.wordCount > 0 ? d.wordCount : countWords(d.body);
      if (LONG_FORM_CONTENT_TYPES.has(type) && words < MIN_LONG_FORM_WORDS) {
        issues.thinLongForm.push({ _id: String(d._id), slug: d.slug, words, contentType: type });
      }

      const key = titleKey(d.metaTitle || d.title);
      if (!titleKeys.has(key)) titleKeys.set(key, []);
      titleKeys.get(key).push({ _id: String(d._id), slug: d.slug, title: d.title });
    }

    for (const [key, docs] of titleKeys.entries()) {
      if (docs.length > 1) issues.duplicateTitles.push({ key, pages: docs });
    }

    return {
      checked: published.length,
      counts: {
        unintentionallyNoindexed: issues.unintentionallyNoindexed.length,
        missingCanonical: issues.missingCanonical.length,
        duplicateTitleGroups: issues.duplicateTitles.length,
        missingDescription: issues.missingDescription.length,
        longTitles: issues.longTitles.length,
        thinLongForm: issues.thinLongForm.length,
      },
      issues,
    };
  },
});

/* ── P2-01: orphan pages (published with 0 inbound internal links) ──────── */

export const findOrphanContent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const published = await loadPublished(ctx);
    const orphans = [];
    for (const d of published) {
      const inbound = await ctx.db
        .query("internalLinks")
        .withIndex("by_target", (q) => q.eq("targetContentId", d._id))
        .first();
      if (!inbound) {
        orphans.push({
          _id: String(d._id),
          slug: d.slug,
          title: d.title,
          publishedAt: d.publishedAt ?? null,
        });
        if (args.limit && orphans.length >= args.limit) break;
      }
    }
    return orphans;
  },
});


/* ── P1-02: near-duplicate detection → contentDuplicates ─────────────────── */

export const detectDuplicateContent = mutation({
  args: {},
  handler: async (ctx) => {
    const published = await loadPublished(ctx);
    const now = Date.now();
    const groups = new Map();

    for (const d of published) {
      // Fingerprint: focus keyword if set, else first 8 normalised title words.
      const key = d.focusKeyword?.trim()
        ? `kw:${titleKey(d.focusKeyword)}`
        : `title:${titleKey(d.title).split(" ").slice(0, 8).join(" ")}`;
      if (!key.includes(":") || key.endsWith(":")) continue;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(d);
    }

    const inserted = [];
    for (const [key, docs] of groups.entries()) {
      if (docs.length < 2) continue;
      const matchType = key.startsWith("kw:") ? "focus_keyword" : "title";
      for (let i = 0; i < docs.length; i += 1) {
        for (let j = i + 1; j < docs.length; j += 1) {
          const a = docs[i];
          const b = docs[j];
          const existing = await ctx.db
            .query("contentDuplicates")
            .withIndex("by_content_a", (q) => q.eq("contentIdA", a._id))
            .collect()
            .then((rows) =>
              rows.some((r) => r.contentIdB === b._id && r.resolution === undefined),
            );
          if (existing) continue;
          const id = await ctx.db.insert("contentDuplicates", {
            contentIdA: a._id,
            contentIdB: b._id,
            slugA: a.slug,
            slugB: b.slug,
            titleA: a.title,
            titleB: b.title,
            matchType,
            similarityScore: matchType === "focus_keyword" ? 0.9 : 0.75,
            detectedAt: now,
          });
          inserted.push(String(id));
        }
      }
    }

    return { groupsChecked: groups.size, duplicatePairs: inserted.length, insertedIds: inserted };
  },
});

/* ── P0-08: reindex priority checklist ───────────────────────────────────── */

export const reindexPriorityReport = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const published = await loadPublished(ctx);
    return published
      .map((d) => ({
        slug: d.slug,
        title: d.title,
        score:
          (d.viewCount ?? 0) +
          (d.isFeatured ? 500 : 0) +
          (d.isEditorialSelection ? 400 : 0),
        publishedAt: d.publishedAt ?? null,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, args.limit ?? 20);
  },
});

/* ── P0-01: route error recorder (5xx diagnosis) ─────────────────────────── */

export const logRouteError = mutation({
  args: {
    path: v.string(),
    contentId: v.optional(v.string()),
    slug: v.optional(v.string()),
    statusCode: v.optional(v.number()),
    message: v.string(),
    stack: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("routeErrors", {
      path: args.path,
      contentId: args.contentId,
      slug: args.slug,
      statusCode: args.statusCode,
      message: args.message,
      stack: args.stack,
      occurredAt: Date.now(),
    });
    return String(id);
  },
});

export const recentRouteErrors = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db
      .query("routeErrors")
      .withIndex("by_occurredAt")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

/* ── P3-03: GSC index coverage snapshots ─────────────────────────────────── */

export const logIndexCoverage = mutation({
  args: {
    date: v.number(),
    url: v.optional(v.string()),
    status: v.union(v.literal("indexed"), v.literal("not_indexed")),
    reason: v.optional(v.string()),
    source: v.union(v.literal("google"), v.literal("bing")),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("indexCoverage", args);
    return String(id);
  },
});

export const indexCoverageBySource = query({
  args: { source: v.union(v.literal("google"), v.literal("bing")) },
  handler: async (ctx, args) => {
    return ctx.db
      .query("indexCoverage")
      .withIndex("by_source_date", (q) => q.eq("source", args.source))
      .collect();
  },
});

/* ── P3-03: one-call health rollup → seoAudits ───────────────────────────── */

async function runSeoHealthAuditLogic(ctx: MutationCtx): Promise<{
  unintentionallyNoindexed: number;
  missingCanonical: number;
  duplicateTitleGroups: number;
  missingDescription: number;
  longTitles: number;
  thinLongForm: number;
  orphanPages: number;
  newDuplicatePairs: number;
}> {
  const audit = await ctx.runQuery(api.seoValidation.runIndexabilityAudit, {});
  const orphans = await ctx.runQuery(api.seoValidation.findOrphanContent, { limit: 500 });
  const duplicates = await ctx.runMutation(api.seoValidation.detectDuplicateContent, {});

  await ctx.db.insert("seoAudits", {
    date: Date.now(),
    brokenLinksCount: 0,
    thinContentCount: audit.counts.thinLongForm,
    cannibalizationCount: audit.counts.duplicateTitleGroups,
    decliningContentCount: 0,
    issues: {
      source: "seoValidation.runSeoHealthAudit",
      indexability: audit.counts,
      orphanPages: orphans.length,
      newDuplicatePairs: duplicates.duplicatePairs,
    },
  });

  return {
    ...audit.counts,
    orphanPages: orphans.length,
    newDuplicatePairs: duplicates.duplicatePairs,
  };
}

export const runSeoHealthAudit = mutation({
  args: {},
  handler: async (ctx) => runSeoHealthAuditLogic(ctx),
});

export const runSeoHealthAuditInternal = internalMutation({
  args: {},
  handler: async (ctx) => runSeoHealthAuditLogic(ctx),
});

