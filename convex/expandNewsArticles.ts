/**
 * Expand the nine "stub" news articles that shipped with a condensed body and
 * a literal "(Content expanded to X words...)" placeholder — the full copy was
 * never written, which is why Google refused to index them as thin content.
 *
 * The completed bodies live in src/data/expandedNewsArticles.ts (version-
 * controlled editorial copy). This mutation PATCHES each live row's body,
 * recomputes wordCount + estimatedReadingTimeMinutes from the new body, and
 * bumps lastModifiedAt. Summary / seoDescription / metaTitle / publish date are
 * left untouched.
 *
 * Idempotent: re-running re-applies the same content.
 *
 * Run:
 *   npx convex run expandNewsArticles:expandNewsArticles --prod
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { expandedNewsArticles } from '../src/data/expandedNewsArticles';

export const expandNewsArticles = mutation({
  args: { trigger: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    if (args.trigger === false) return { skipped: true };

    const results: Array<{ slug: string; status: string; patched: number; wordCount?: number }> = [];

    for (const article of expandedNewsArticles) {
      const docs = await ctx.db
        .query('content')
        .withIndex('by_slug', (q) => q.eq('slug', article.slug))
        .collect();

      if (docs.length === 0) {
        results.push({ slug: article.slug, status: 'not-found', patched: 0 });
        continue;
      }

      const wordCount = article.body.split(/\s+/).filter(Boolean).length;
      const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

      let patched = 0;
      for (const doc of docs) {
        if (doc.isDeleted === true) continue; // skip soft-deleted duplicates
        await ctx.db.patch(doc._id, {
          body: article.body,
          wordCount,
          estimatedReadingTimeMinutes: readingMinutes,
          lastModifiedAt: Date.now(),
        });
        patched++;
      }

      results.push({
        slug: article.slug,
        status: patched > 0 ? 'patched' : 'all-deleted',
        patched,
        wordCount,
      });
    }

    return { results };
  },
});
