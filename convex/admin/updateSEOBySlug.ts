import { mutation } from "../_generated/server";
import { v } from "convex/values";

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
