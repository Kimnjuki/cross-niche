/**
 * Backfill wordCount + estimatedReadingTimeMinutes for every published content
 * row that is missing them (seeded before these fields were computed). The
 * values are derived from the body, so the mutation is idempotent and safe to
 * re-run. Drafts, soft-deleted rows, and rows that already carry a matching
 * wordCount are left untouched.
 *
 * Run:
 *   npx convex run backfillWordCount:backfillWordCount --prod
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const backfillWordCount = mutation({
  args: { trigger: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    if (args.trigger === false) return { skipped: true };

    const rows = await ctx.db.query('content').collect();

    let patched = 0;
    let skipped = 0;
    const examples: Array<{ slug: string; wordCount: number }> = [];

    for (const row of rows) {
      if (row.isDeleted === true) {
        skipped++;
        continue;
      }
      if (row.status !== 'published') {
        skipped++;
        continue;
      }
      const body = (row.body ?? '') as string;
      const wordCount = body.split(/\s+/).filter(Boolean).length;
      if (wordCount === 0) {
        skipped++;
        continue;
      }
      if ((row.wordCount ?? 0) === wordCount) {
        skipped++;
        continue;
      }
      const estimatedReadingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
      await ctx.db.patch(row._id, { wordCount, estimatedReadingTimeMinutes });
      patched++;
      if (examples.length < 15) examples.push({ slug: row.slug, wordCount });
    }

    return { total: rows.length, patched, skipped, examples };
  },
});
