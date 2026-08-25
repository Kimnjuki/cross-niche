import { mutation } from "../_generated/server";

const PLACEHOLDER_TITLE_PATTERNS = [
  /^Sec\s+\d+(\s*\|.*)?$/i,
  /^Tech\s+\d+(\s*\|.*)?$/i,
  /^Game\s+\d+(\s*\|.*)?$/i,
  /^Rivacy(\s*\|.*)?$/i,
];

function isPlaceholderTitle(title: string): boolean {
  return PLACEHOLDER_TITLE_PATTERNS.some((pattern) => pattern.test(title.trim()));
}

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
