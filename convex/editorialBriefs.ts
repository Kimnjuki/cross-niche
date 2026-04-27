import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("in_review"),
        v.literal("approved"),
        v.literal("cancelled")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 100);
    if (args.status) {
      return await ctx.db
        .query("editorialAiBriefs")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    }
    return await ctx.db
      .query("editorialAiBriefs")
      .order("desc")
      .take(limit);
  },
});

export const getByContent = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("editorialAiBriefs")
      .withIndex("by_content", (q) => q.eq("contentId", args.contentId))
      .first();
  },
});

export const create = mutation({
  args: {
    contentId: v.optional(v.id("content")),
    targetKeyword: v.optional(v.string()),
    briefJson: v.any(),
    createdBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("editorialAiBriefs", {
      contentId: args.contentId,
      status: "draft",
      createdAt: Date.now(),
      createdBy: args.createdBy,
      targetKeyword: args.targetKeyword,
      briefJson: args.briefJson,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("editorialAiBriefs"),
    status: v.union(
      v.literal("draft"),
      v.literal("in_review"),
      v.literal("approved"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const update = mutation({
  args: {
    id: v.id("editorialAiBriefs"),
    targetKeyword: v.optional(v.string()),
    briefJson: v.any(),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("in_review"),
        v.literal("approved"),
        v.literal("cancelled")
      )
    ),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = { briefJson: args.briefJson };
    if (args.targetKeyword !== undefined) patch.targetKeyword = args.targetKeyword;
    if (args.status !== undefined) patch.status = args.status;
    await ctx.db.patch(args.id, patch);
  },
});
