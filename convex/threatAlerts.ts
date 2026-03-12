import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listSubscriptions = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threatSubscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const subscribe = mutation({
  args: {
    userId: v.string(),
    type: v.union(v.literal("cve"), v.literal("tag")),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const value = args.value.trim();
    if (!value) throw new Error("Value is required");

    const existing = await ctx.db
      .query("threatSubscriptions")
      .withIndex("by_user_type_value", (q) =>
        q.eq("userId", args.userId).eq("type", args.type).eq("value", value)
      )
      .first();

    if (existing) return { success: true, id: existing._id, already: true };

    const id = await ctx.db.insert("threatSubscriptions", {
      userId: args.userId,
      type: args.type,
      value,
      createdAt: Date.now(),
    });

    return { success: true, id, already: false };
  },
});

export const unsubscribe = mutation({
  args: {
    userId: v.string(),
    type: v.union(v.literal("cve"), v.literal("tag")),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const value = args.value.trim();
    const existing = await ctx.db
      .query("threatSubscriptions")
      .withIndex("by_user_type_value", (q) =>
        q.eq("userId", args.userId).eq("type", args.type).eq("value", value)
      )
      .first();

    if (!existing) return { success: true, removed: false };

    await ctx.db.delete(existing._id);
    return { success: true, removed: true };
  },
});

export const listNotifications = query({
  args: { userId: v.string(), limit: v.optional(v.number()), unreadOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);
    const items = await ctx.db
      .query("threatNotifications")
      .withIndex("by_user_created", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);

    const filtered = args.unreadOnly ? items.filter((i) => i.readAt == null) : items;

    const threats = await Promise.all(filtered.map((n) => ctx.db.get(n.threatId)));

    return filtered
      .map((n, idx) => ({
        ...n,
        threat: threats[idx],
      }))
      .filter((x) => x.threat != null);
  },
});

export const markNotificationRead = mutation({
  args: { userId: v.string(), notificationId: v.id("threatNotifications") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.notificationId);
    if (!existing) throw new Error("Notification not found");
    if (existing.userId !== args.userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.notificationId, { readAt: Date.now() });
    return { success: true };
  },
});
