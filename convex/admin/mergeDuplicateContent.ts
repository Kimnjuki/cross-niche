import { mutation } from "../_generated/server";
import { v } from "convex/values";

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
