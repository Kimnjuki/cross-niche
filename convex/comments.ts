import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getFeatureComments = query({
  args: {
    contentId: v.id("content"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const cursorCreatedAt = args.cursor ? Number(args.cursor) : undefined;

    const base = ctx.db
      .query("comments")
      .withIndex("by_content_created", (q) => q.eq("contentId", args.contentId));

    const page = await (cursorCreatedAt == null
      ? base.order("desc").take(limit + 1)
      : base
          .filter((q) => q.lt(q.field("createdAt"), cursorCreatedAt))
          .order("desc")
          .take(limit + 1));

    const hasMore = page.length > limit;
    const items = page.slice(0, limit);

    const usersById: Record<string, any> = {};
    for (const c of items) {
      if (usersById[c.userId]) continue;
      const u = await ctx.db
        .query("users")
        .withIndex("by_supabase_user_id", (q) => q.eq("supabaseUserId", c.userId))
        .first();
      usersById[c.userId] = u ?? null;
    }

    const enriched = items.map((c) => ({
      ...c,
      user: usersById[c.userId]
        ? {
            supabaseUserId: usersById[c.userId].supabaseUserId,
            displayName: usersById[c.userId].displayName ?? usersById[c.userId].username,
            avatarUrl: usersById[c.userId].avatarUrl,
          }
        : null,
    }));

    const nextCursor = hasMore ? String(items[items.length - 1]?.createdAt ?? "") : null;

    return { items: enriched, nextCursor };
  },
});

export const postComment = mutation({
  args: {
    contentId: v.id("content"),
    userId: v.string(),
    body: v.string(),
    parentCommentId: v.optional(v.id("comments")),
  },
  handler: async (ctx, args) => {
    const body = args.body.trim();
    if (body.length === 0) throw new Error("Comment body cannot be empty");
    if (body.length > 5000) throw new Error("Comment too long (max 5000 characters)");

    const now = Date.now();
    const recent = await ctx.db
      .query("comments")
      .withIndex("by_user_created", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(10);

    const lastMinute = recent.filter((c) => c.createdAt >= now - 60_000);
    if (lastMinute.length >= 3) throw new Error("Rate limit exceeded: 3 comments per minute");

    const commentId = await ctx.db.insert("comments", {
      contentId: args.contentId,
      userId: args.userId,
      parentCommentId: args.parentCommentId,
      body,
      createdAt: now,
      likes: 0,
      isEdited: false,
      isDeleted: false,
      isFlagged: false,
    });

    const totalComments = (
      await ctx.db
        .query("comments")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect()
    ).length;

    await ctx.runMutation(internal.gamification.awardXP, {
      userId: args.userId,
      amount: 25,
      reason: "comment_posted",
      badgeEvent: "comment_posted",
      totalComments,
    });

    return commentId;
  },
});

export const editComment = mutation({
  args: {
    commentId: v.id("comments"),
    userId: v.string(),
    newBody: v.string(),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== args.userId) throw new Error("Not authorized");

    const body = args.newBody.trim();
    if (body.length === 0) throw new Error("Comment body cannot be empty");
    if (body.length > 5000) throw new Error("Comment too long (max 5000 characters)");

    await ctx.db.patch(args.commentId, {
      body,
      isEdited: true,
      editedAt: Date.now(),
    });

    return { success: true };
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.userId !== args.userId) throw new Error("Not authorized");

    await ctx.db.patch(args.commentId, {
      body: "[deleted]",
      isDeleted: true,
      isEdited: false,
      editedAt: Date.now(),
    });

    return { success: true };
  },
});
