import { query } from "../_generated/server";

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
