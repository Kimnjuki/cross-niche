import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser, requireUser } from "./auth";

export const getUserPreferences = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const updateNotificationPreference = mutation({
  args: {
    userId: v.string(),
    featureId: v.string(),
    action: v.union(v.literal("follow"), v.literal("unfollow")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const currentSaved = existing?.savedSearches ?? [];
    const set = new Set(currentSaved);

    if (args.action === "follow") {
      set.add(args.featureId);
    } else {
      set.delete(args.featureId);
    }

    const savedSearches = Array.from(set);

    if (!existing) {
      const id = await ctx.db.insert("userPreferences", {
        userId: args.userId,
        savedSearches,
        emailNotifications: args.action === "follow" ? true : undefined,
      });
      return { success: true, id, savedSearches };
    }

    await ctx.db.patch(existing._id, {
      savedSearches,
      emailNotifications:
        existing.emailNotifications == null && args.action === "follow" ? true : existing.emailNotifications,
    });

    return { success: true, id: existing._id, savedSearches };
  },
});

// ─── Verified-identity variants (ownerUserId) ──────────────────────────────
// These resolve the owner from ctx.auth, never a client-supplied userId.
// Kept alongside the legacy userId-string functions for a staged migration.

export const getMyPreferences = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    return await ctx.db
      .query("userPreferences")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", user.userId))
      .first();
  },
});

export const updateMyPreference = mutation({
  args: {
    featureId: v.string(),
    action: v.union(v.literal("follow"), v.literal("unfollow")),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_owner", (q) => q.eq("ownerUserId", user.userId))
      .first();

    const currentSaved = existing?.savedSearches ?? [];
    const set = new Set(currentSaved);
    if (args.action === "follow") set.add(args.featureId);
    else set.delete(args.featureId);
    const savedSearches = Array.from(set);

    if (!existing) {
      const id = await ctx.db.insert("userPreferences", {
        userId: user.userId, // legacy required field
        ownerUserId: user.userId,
        savedSearches,
        emailNotifications: args.action === "follow" ? true : undefined,
      });
      return { success: true, id, savedSearches };
    }

    await ctx.db.patch(existing._id, {
      savedSearches,
      ownerUserId: user.userId,
      emailNotifications:
        existing.emailNotifications == null && args.action === "follow" ? true : existing.emailNotifications,
    });
    return { success: true, id: existing._id, savedSearches };
  },
});
