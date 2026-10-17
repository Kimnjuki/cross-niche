/**
 * Upsert the gaming-security threat guides (the "GN-015 editorial" batch).
 * Idempotent: replaces by slug on re-run. Content lives in
 * src/data/threatGuides.ts.
 *
 * Run:
 *   npx convex run upsertThreatGuides:upsertThreatGuides --prod
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { THREAT_GUIDES } from '../src/data/threatGuides';

export const upsertThreatGuides = mutation({
  args: { trigger: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    if (args.trigger === false) return { skipped: true };

    const results: Array<{ slug: string; action: string; wordCount: number }> = [];

    for (const guide of THREAT_GUIDES) {
      const wordCount = guide.body.split(/\s+/).filter(Boolean).length;
      const now = Date.now();
      const canonical = `https://thegridnexus.com/article/${guide.slug}`;

      const existing = await ctx.db
        .query('content')
        .withIndex('by_slug', (q) => q.eq('slug', guide.slug))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          title: guide.title,
          metaTitle: guide.metaTitle,
          seoDescription: guide.seoDescription,
          summary: guide.summary,
          body: guide.body,
          contentType: guide.contentType,
          wordCount,
          estimatedReadingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
          lastModifiedAt: now,
        });
        results.push({ slug: guide.slug, action: 'replaced', wordCount });
        continue;
      }

      await ctx.db.insert('content', {
        title: guide.title,
        slug: guide.slug,
        metaTitle: guide.metaTitle,
        seoDescription: guide.seoDescription,
        summary: guide.summary,
        body: guide.body,
        status: 'published',
        publishedAt: now,
        lastModifiedAt: now,
        contentType: guide.contentType,
        wordCount,
        estimatedReadingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
        isFeatured: false,
        isBreaking: false,
        isPremium: false,
        source: 'thegridnexus.com',
        canonicalUrl: canonical,
      });
      results.push({ slug: guide.slug, action: 'inserted', wordCount });
    }

    return { count: results.length, results };
  },
});
