import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const ensureNicheLink = internalMutation({
  args: {
    contentId: v.id("content"),
    nicheId: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("contentNiches")
      .withIndex("by_content_niche", (q) => q.eq("contentId", args.contentId).eq("nicheId", args.nicheId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("contentNiches", {
      contentId: args.contentId,
      nicheId: args.nicheId,
    });
  },
});

export const ensureTagLink = internalMutation({
  args: {
    contentId: v.id("content"),
    tagSlug: v.string(),
  },
  handler: async (ctx, args) => {
    let tag = await ctx.db
      .query("tags")
      .withIndex("by_slug", (q) => q.eq("slug", args.tagSlug))
      .first();

    if (!tag) {
      tag = await ctx.db.get(
        await ctx.db.insert("tags", {
          name: args.tagSlug.replace(/-/g, " "),
          slug: args.tagSlug,
        })
      );
    }

    if (!tag) throw new Error("Failed to create tag");

    const existing = await ctx.db
      .query("contentTags")
      .withIndex("by_content_tag", (q) => q.eq("contentId", args.contentId).eq("tagId", tag!._id))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("contentTags", {
      contentId: args.contentId,
      tagId: tag._id,
    });
  },
});
