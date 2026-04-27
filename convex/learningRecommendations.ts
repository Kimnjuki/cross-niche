import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getActive = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("learningRecommendations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .filter((q) => q.neq(q.field("status"), "completed"))
      .take(5);
  },
});

export const listByUser = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("learningRecommendations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit ?? 10);
  },
});

export const listByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("learningRecommendations")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .take(args.limit ?? 20);
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    pathId: v.optional(v.id("learningPaths")),
    contentIds: v.array(v.id("content")),
    simulationIds: v.optional(v.array(v.string())),
    validUntil: v.optional(v.float64()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("learningRecommendations", {
      userId: args.userId,
      pathId: args.pathId,
      contentIds: args.contentIds,
      simulationIds: args.simulationIds,
      generatedAt: Date.now(),
      validUntil: args.validUntil,
      status: "pending",
    });

    // Update lastRecommendationAt on the user's learning progress rows
    const progressRows = await ctx.db
      .query("userLearningProgress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const row of progressRows) {
      await ctx.db.patch(row._id, { lastRecommendationAt: Date.now() });
    }

    return id;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("learningRecommendations"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const createWeeklyMission = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Check if there's already an active recommendation this week
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = await ctx.db
      .query("learningRecommendations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .filter((q) => q.gte(q.field("generatedAt"), weekAgo))
      .first();

    if (recent) return { existing: true, id: recent._id };

    // Create a new weekly mission with sample content
    const id = await ctx.db.insert("learningRecommendations", {
      userId: args.userId,
      contentIds: [],
      generatedAt: Date.now(),
      validUntil: Date.now() + 7 * 24 * 60 * 60 * 1000,
      status: "pending",
    });

    return { existing: false, id };
  },
});
