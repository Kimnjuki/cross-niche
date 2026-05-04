import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const componentSchema = v.object({
  type: v.string(),
  name: v.string(),
  price: v.float64(),
  asin: v.optional(v.string()),
  securityVulnScore: v.optional(v.float64()),
  notes: v.optional(v.string()),
});

// Save or update a PC build
export const saveBuild = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    buildName: v.string(),
    components: v.array(componentSchema),
    totalPrice: v.float64(),
    totalWatts: v.float64(),
    compatibilityScore: v.float64(),
    aiSecurityScore: v.float64(),
    aiSecurityIssues: v.array(v.string()),
    aiOptimizationTips: v.array(v.string()),
    useCase: v.string(),
    budget: v.float64(),
    isPublic: v.boolean(),
    shareToken: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pcBuilds")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return existing._id;
    }
    return await ctx.db.insert("pcBuilds", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Get a single build by share token (public share links)
export const getBuildByShareToken = query({
  args: { shareToken: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pcBuilds")
      .withIndex("by_share_token", (q) => q.eq("shareToken", args.shareToken))
      .first();
  },
});

// Get a build by session (resume draft)
export const getBuildBySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pcBuilds")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});

// List builds for a user
export const getUserBuilds = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pcBuilds")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(20);
  },
});

// List public builds (community showcase)
export const getPublicBuilds = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pcBuilds")
      .withIndex("by_public", (q) => q.eq("isPublic", true))
      .order("desc")
      .take(args.limit ?? 12);
  },
});

// Toggle public visibility
export const togglePublic = mutation({
  args: { sessionId: v.string(), isPublic: v.boolean() },
  handler: async (ctx, args) => {
    const build = await ctx.db
      .query("pcBuilds")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (!build) return null;
    await ctx.db.patch(build._id, { isPublic: args.isPublic, updatedAt: Date.now() });
    return build._id;
  },
});
