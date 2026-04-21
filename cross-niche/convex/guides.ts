/**
 * Convex queries and mutations for Guides.
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all published guides, optionally filtered by niche or difficulty.
 */
export const list = query({
  args: {
    nicheId: v.optional(v.number()),
    difficulty: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    let guides = await ctx.db
      .query("guides")
      .withIndex("by_published_at", (q) => q)
      .order("desc")
      .take(limit * 2);

    // Filter by published status
    guides = guides.filter((g) => g.isPublished !== false);

    // Filter by niche if provided
    if (args.nicheId !== undefined) {
      guides = guides.filter((g) => g.nicheId === args.nicheId);
    }

    // Filter by difficulty if provided
    if (args.difficulty) {
      guides = guides.filter((g) => g.difficulty === args.difficulty);
    }

    return guides.slice(0, limit);
  },
});

/**
 * Get a guide by slug.
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const guide = await ctx.db
      .query("guides")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return guide;
  },
});

/**
 * Get guide progress for a user.
 */
export const getProgress = query({
  args: {
    userId: v.string(),
    guideId: v.id("guides"),
  },
  handler: async (ctx, args) => {
    const progress = await ctx.db
      .query("guideProgress")
      .withIndex("by_user_guide", (q) =>
        q.eq("userId", args.userId).eq("guideId", args.guideId)
      )
      .first();
    return progress;
  },
});

/**
 * Update guide progress (mark steps as completed).
 */
export const updateProgress = mutation({
  args: {
    userId: v.string(),
    guideId: v.id("guides"),
    completedSteps: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("guideProgress")
      .withIndex("by_user_guide", (q) =>
        q.eq("userId", args.userId).eq("guideId", args.guideId)
      )
      .first();

    const guide = await ctx.db.get(args.guideId);
    const isCompleted = guide && args.completedSteps.length >= guide.steps.length;

    if (existing) {
      await ctx.db.patch(existing._id, {
        completedSteps: args.completedSteps,
        completedAt: isCompleted ? Date.now() : existing.completedAt,
        lastAccessedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("guideProgress", {
        userId: args.userId,
        guideId: args.guideId,
        completedSteps: args.completedSteps,
        completedAt: isCompleted ? Date.now() : undefined,
        lastAccessedAt: Date.now(),
      });
    }
  },
});
