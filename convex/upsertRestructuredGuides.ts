/**
 * Upsert the three entity-first restructured guides into Convex.
 *
 * The restructured bodies, summaries, meta titles and review data live in
 * src/data/restructuredGuides.ts — the same module the build can inspect — so
 * editorial copy stays version-controlled. The mutation PATCHES the existing
 * live rows (body, summary, seoDescription, metaTitle, reviews, wordCount,
 * lastModifiedAt) without disturbing niche/feed links or publish dates.
 *
 * Idempotent: re-running re-applies the same content.
 *
 * Run:
 *   npx convex run upsertRestructuredGuides:upsertRestructuredGuides --prod
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { restructuredGuides } from '../src/data/restructuredGuides';

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function countWords(html: string): number {
  return stripTags(html).split(/\s+/).filter(Boolean).length;
}

export const upsertRestructuredGuides = mutation({
  args: { trigger: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    if (args.trigger === false) return { skipped: true };

    const results: Array<{
      slug: string;
      status: string;
      patched: number;
      wordCount: number;
      reviews: number;
    }> = [];

    for (const guide of restructuredGuides) {
      const rows = await ctx.db
        .query('content')
        .withIndex('by_slug', (q) => q.eq('slug', guide.slug))
        .collect();

      let patched = 0;
      for (const doc of rows) {
        if (doc.isDeleted === true) continue;
        await ctx.db.patch(doc._id, {
          body: guide.body,
          summary: guide.summary,
          seoDescription: guide.seoDescription,
          metaTitle: guide.metaTitle,
          reviews: guide.reviews ?? [],
          wordCount: countWords(guide.body),
          lastModifiedAt: Date.now(),
        });
        patched++;
      }

      results.push({
        slug: guide.slug,
        status: patched > 0 ? 'patched' : 'not-found',
        patched,
        wordCount: countWords(guide.body),
        reviews: guide.reviews?.length ?? 0,
      });
    }

    return { results };
  },
});
