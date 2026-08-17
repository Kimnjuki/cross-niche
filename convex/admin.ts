/**
 * Grid Nexus - Admin Functions
 * Data management and fixes for content
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Publish all draft articles
 */
export const publishAllDrafts = mutation({
  args: {},
  handler: async (ctx) => {
    const drafts = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "draft"))
      .collect();
    
    let updated = 0;
    for (const draft of drafts) {
      await ctx.db.patch(draft._id, {
        status: "published",
        publishedAt: draft.publishedAt || Date.now(),
      });
      updated++;
    }
    
    console.log(`Published ${updated} draft articles`);
    return { updated };
  },
});

/**
 * Fix missing publishedAt dates
 */
export const fixPublishedDates = mutation({
  args: {},
  handler: async (ctx) => {
    const published = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    
    let fixed = 0;
    for (const article of published) {
      if (!article.publishedAt) {
        await ctx.db.patch(article._id, {
          publishedAt: Date.now(),
        });
        fixed++;
      }
    }
    
    console.log(`Fixed ${fixed} articles with missing publishedAt dates`);
    return { fixed };
  },
});

/**
 * Get content statistics — uses per-status indexes instead of full table scan.
 */
export const getContentStats = query({
  args: {},
  handler: async (ctx) => {
    const [published, drafts, archived] = await Promise.all([
      ctx.db.query("content").withIndex("by_status", (q) => q.eq("status", "published")).collect(),
      ctx.db.query("content").withIndex("by_status", (q) => q.eq("status", "draft")).collect(),
      ctx.db.query("content").withIndex("by_status", (q) => q.eq("status", "archived")).collect(),
    ]);
    return {
      totalArticles: published.length + drafts.length + archived.length,
      publishedArticles: published.length,
      draftArticles: drafts.length,
      withPublishedAt: published.filter(c => c.publishedAt != null).length,
      totalViews: published.reduce((sum, c) => sum + (c.viewCount || 0), 0),
    };
  },
});

/**
 * Seed sample content if database is empty
 */
export const seedSampleContent = mutation({
  args: {
    count: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const count = args.count || 10;
    const now = Date.now();
    
    const sampleArticles = [
      {
        title: "Breaking: Major Security Vulnerability Discovered",
        slug: "major-security-vulnerability-discovered",
        status: "published",
        publishedAt: now,
        contentType: "news" as any,
        summary: "Critical security vulnerability affects millions of devices",
        body: "Full article content here...",
        author: "Security Team",
        isBreaking: true,
        isFeatured: true,
      },
      {
        title: "Next-Gen Gaming Console Performance Analysis",
        slug: "next-gen-gaming-console-performance",
        status: "published", 
        publishedAt: now - (24 * 60 * 60 * 1000), // 1 day ago
        contentType: "review" as any,
        summary: "In-depth performance review of latest gaming hardware",
        body: "Full review content here...",
        author: "Gaming Team",
        isFeatured: false,
      },
      {
        title: "Complete Guide to Cloud Security",
        slug: "complete-guide-to-cloud-security",
        status: "published",
        publishedAt: now - (2 * 24 * 60 * 60 * 1000), // 2 days ago
        contentType: "guide" as any,
        summary: "Step-by-step guide to securing your cloud infrastructure",
        body: "Full guide content here...",
        author: "Tech Team",
        isFeatured: false,
      },
    ];
    
    let created = 0;
    for (let i = 0; i < Math.min(count, sampleArticles.length); i++) {
      await ctx.db.insert("content", sampleArticles[i] as any);
      created++;
    }
    
    console.log(`Seeded ${created} sample articles`);
    return { created };
  },
});

const PLACEHOLDER_TITLE_PATTERNS = [
  /^Sec\s+\d+(\s*\|.*)?$/i,
  /^Tech\s+\d+(\s*\|.*)?$/i,
  /^Game\s+\d+(\s*\|.*)?$/i,
  /^Rivacy(\s*\|.*)?$/i,
];

function isPlaceholderTitle(title: string): boolean {
  return PLACEHOLDER_TITLE_PATTERNS.some((pattern) => pattern.test(title.trim()));
}

/**
 * Audit published content for placeholder/seed titles and either delete or
 * demote them to draft so they are no longer publicly indexable.
 */
export const cleanPlaceholderContent = mutation({
  args: {},
  handler: async (ctx) => {
    const published = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    const placeholders = published.filter((c) => isPlaceholderTitle(c.title));
    let deleted = 0;
    let drafted = 0;
    const affected: Array<{ _id: string; title: string; action: "deleted" | "drafted" }> = [];

    for (const item of placeholders) {
      if (item.body && item.body.trim().length > 0) {
        await ctx.db.patch(item._id, {
          status: "draft",
          isDeleted: true,
          deletedAt: Date.now(),
        });
        drafted++;
        affected.push({ _id: item._id, title: item.title, action: "drafted" });
      } else {
        await ctx.db.delete(item._id);
        deleted++;
        affected.push({ _id: item._id, title: item.title, action: "deleted" });
      }
    }

  console.log(`Placeholder cleanup complete`, { deleted, drafted, total: placeholders.length });
  return { deleted, drafted, total: placeholders.length, affected };
},
});

/**
 * Find duplicate content rows whose titles match case-insensitively and
 * report merge candidates. Intended to be run manually, then the deprecated
 * slug can be redirected in next.config.js.
 */
export const findDuplicateContent = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("content").collect();
    const byLowerTitle = new Map<string, typeof all>();

    for (const item of all) {
      const key = item.title.trim().toLowerCase();
      const existing = byLowerTitle.get(key) ?? [];
      existing.push(item);
      byLowerTitle.set(key, existing);
    }

    const duplicates = Array.from(byLowerTitle.entries())
      .filter(([, items]) => items.length > 1)
      .map(([title, items]) => ({
        title,
        ids: items.map((i) => i._id),
        slugs: items.map((i) => i.slug),
        statuses: items.map((i) => i.status),
        publishedAt: items.map((i) => i.publishedAt),
      }));

    return { duplicates, totalDuplicateGroups: duplicates.length };
  },
});

/**
 * Merge duplicate content rows for a specific title. Keeps the row with the
 * earliest _creationTime as canonical, demotes the rest to draft+deleted, and
 * rewires internalLinks to point at the canonical row.
 */
export const mergeDuplicateContent = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const matches = await ctx.db
      .query("content")
      .filter((q) => q.eq(q.field("title"), args.title))
      .collect();

    const normalized = matches.map((m) => ({
      ...m,
      lowerTitle: m.title.trim().toLowerCase(),
    }));

    const byLowerTitle = new Map<string, typeof normalized>();
    for (const item of normalized) {
      const existing = byLowerTitle.get(item.lowerTitle) ?? [];
      existing.push(item);
      byLowerTitle.set(item.lowerTitle, existing);
    }

    const duplicateGroup = byLowerTitle.get(args.title.trim().toLowerCase());
    if (!duplicateGroup || duplicateGroup.length < 2) {
      return { merged: 0, message: "No duplicate group found for the provided title." };
    }

    const canonical = duplicateGroup[0];
    const deprecated = duplicateGroup.slice(1);

    let internalLinksUpdated = 0;
    for (const dep of deprecated) {
      const links = await ctx.db
        .query("internalLinks")
        .withIndex("by_target", (q) => q.eq("targetContentId", dep._id))
        .collect();

      for (const link of links) {
        await ctx.db.patch(link._id, {
          targetContentId: canonical._id,
        });
        internalLinksUpdated++;
      }

      await ctx.db.patch(dep._id, {
        status: "draft",
        isDeleted: true,
        deletedAt: Date.now(),
        canonicalUrl: `/article/${canonical.slug}`,
      });
    }

    await ctx.db.patch(canonical._id, {
      canonicalUrl: `/article/${canonical.slug}`,
      lastModifiedAt: Date.now(),
    });

    return {
      merged: deprecated.length,
      canonicalId: canonical._id,
      canonicalSlug: canonical.slug,
      deprecatedSlugs: deprecated.map((d) => d.slug),
      internalLinksUpdated,
    };
  },
});

/**
 * Update SEO fields for a content row identified by slug.
 */
export const updateSEOBySlug = mutation({
  args: {
    slug: v.string(),
    metaTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    focusKeyword: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!existing) {
      throw new Error(`Content with slug "${args.slug}" not found`);
    }

    await ctx.db.patch(existing._id, {
      metaTitle: args.metaTitle,
      seoDescription: args.seoDescription,
      focusKeyword: args.focusKeyword,
      lastModifiedAt: Date.now(),
    });

    return { success: true, contentId: existing._id };
  },
});

/**
 * Update siteConfig with new homepage positioning.
 */
export const updateHomepagePositioning = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    heroHeadline: v.string(),
    heroSubheadline: v.string(),
    primaryCta: v.string(),
    secondaryCta: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const upsert = async (key: string, value: any) => {
      const existing = await ctx.db
        .query("siteConfig")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, { value, updatedAt: now });
      } else {
        await ctx.db.insert("siteConfig", { key, value, updatedAt: now });
      }
    };

    await upsert("homepage.title", args.title);
    await upsert("homepage.description", args.description);
    await upsert("homepage.heroHeadline", args.heroHeadline);
    await upsert("homepage.heroSubheadline", args.heroSubheadline);
    await upsert("homepage.primaryCta", args.primaryCta);
    await upsert("homepage.secondaryCta", args.secondaryCta);

    return { success: true };
  },
});


