/**
 * Backfill metaTitle for content rows that predate the metaTitle field or were
 * seeded before a dedicated upsert set it. Every entry is idempotent (patch by
 * slug), so re-running never duplicates or corrupts data.
 *
 * Run:
 *   npx convex run backfillMetaTitle:backfillMetaTitle --prod
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';

/** slug → metaTitle (≤ 43 chars so " | The Grid Nexus" — 17 chars — fits the 60-char title budget). */
const BACKFILL: Record<string, string> = {
  'ultimate-guide-steam-xbox-playstation-discord-security':
    'Steam Xbox PlayStation & Discord Security',
};

export const backfillMetaTitle = mutation({
  args: { trigger: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    if (args.trigger === false) return { skipped: true };

    const results: Array<{ slug: string; status: string; patched: number; metaTitle?: string }> = [];
    for (const [slug, metaTitle] of Object.entries(BACKFILL)) {
      const docs = await ctx.db
        .query('content')
        .withIndex('by_slug', (q) => q.eq('slug', slug))
        .collect();
      if (docs.length === 0) {
        results.push({ slug, status: 'not-found', patched: 0 });
        continue;
      }
      let patched = 0;
      for (const doc of docs) {
        if (doc.isDeleted === true) continue; // skip soft-deleted duplicates
        await ctx.db.patch(doc._id, { metaTitle });
        patched++;
      }
      results.push({ slug, status: patched > 0 ? 'patched' : 'all-deleted', patched, metaTitle });
    }

    return { results };
  },
});
