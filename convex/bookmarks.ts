import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getFeatureBookmarks = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("userBookmarks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    return rows.map((r) => r.contentId);
  },
});

export const bookmarkFeature = mutation({
  args: {
    contentId: v.id("content"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userBookmarks")
      .withIndex("by_user_content", (q) => q.eq("userId", args.userId).eq("contentId", args.contentId))
      .first();

    if (existing) {
      return { success: true, bookmarked: true };
    }

    await ctx.db.insert("userBookmarks", {
      userId: args.userId,
      contentId: args.contentId,
    });

    const totalBookmarks = (
      await ctx.db
        .query("userBookmarks")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect()
    ).length;

    await ctx.runMutation(internal.gamification.awardXP, {
      userId: args.userId,
      amount: 5,
      reason: "feature_bookmarked",
      badgeEvent: "feature_bookmarked",
      totalBookmarks,
    });

    return { success: true, bookmarked: true };
  },
});

export const removeBookmark = mutation({
  args: {
    contentId: v.id("content"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userBookmarks")
      .withIndex("by_user_content", (q) => q.eq("userId", args.userId).eq("contentId", args.contentId))
      .first();

    if (!existing) {
      return { success: true, removed: false };
    }

    await ctx.db.delete(existing._id);
    return { success: true, removed: true };
  },
});
