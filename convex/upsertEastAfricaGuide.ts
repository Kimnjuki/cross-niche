/**
 * Upsert the East Africa mobile gaming security guide (growth-audit Pillar G).
 * Idempotent: replaces by slug on re-run. Content lives in
 * src/data/eastAfricaGamingSecurityArticle.ts.
 *
 * Run:
 *   npx convex run upsertEastAfricaGuide:upsertEastAfricaGuide --prod
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { EAST_AFRICA_GUIDE } from '../src/data/eastAfricaGamingSecurityArticle';

const CANONICAL = `https://thegridnexus.com/article/${EAST_AFRICA_GUIDE.slug}`;

export const upsertEastAfricaGuide = mutation({
  args: { trigger: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    if (args.trigger === false) return { skipped: true };

    const wordCount = EAST_AFRICA_GUIDE.body.split(/\s+/).filter(Boolean).length;
    const now = Date.now();

    const existing = await ctx.db
      .query('content')
      .withIndex('by_slug', (q) => q.eq('slug', EAST_AFRICA_GUIDE.slug))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: EAST_AFRICA_GUIDE.title,
        metaTitle: EAST_AFRICA_GUIDE.metaTitle,
        seoDescription: EAST_AFRICA_GUIDE.seoDescription,
        summary: EAST_AFRICA_GUIDE.summary,
        body: EAST_AFRICA_GUIDE.body,
        contentType: EAST_AFRICA_GUIDE.contentType as 'security',
        wordCount,
        estimatedReadingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
        lastModifiedAt: now,
      });
      return { replaced: true, slug: EAST_AFRICA_GUIDE.slug, wordCount };
    }

    await ctx.db.insert('content', {
      title: EAST_AFRICA_GUIDE.title,
      slug: EAST_AFRICA_GUIDE.slug,
      metaTitle: EAST_AFRICA_GUIDE.metaTitle,
      seoDescription: EAST_AFRICA_GUIDE.seoDescription,
      summary: EAST_AFRICA_GUIDE.summary,
      body: EAST_AFRICA_GUIDE.body,
      status: 'published',
      publishedAt: now,
      lastModifiedAt: now,
      contentType: EAST_AFRICA_GUIDE.contentType as 'security',
      wordCount,
      estimatedReadingTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
      isFeatured: false,
      isBreaking: false,
      isPremium: false,
      source: 'thegridnexus.com',
      canonicalUrl: CANONICAL,
    });

    return { inserted: true, slug: EAST_AFRICA_GUIDE.slug, wordCount };
  },
});
