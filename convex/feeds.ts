import { query } from "./_generated/server";
import { v } from "convex/values";

export const getActiveFeeds = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("feeds")
      .withIndex("by_active_order", (q) => q.eq("isActive", true))
      .order("asc")
      .collect();
    return rows;
  },
});

// Get feed by slug
export const getFeedBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("feeds")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

// Get content for a specific feed
export const getFeedContent = query({
  args: {
    feedSlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    // Get feed
    const feed = await ctx.db
      .query("feeds")
      .withIndex("by_slug", (q) => q.eq("slug", args.feedSlug))
      .unique();
    
    if (!feed) return [];
    
    // Get content IDs for this feed
    const feedContent = await ctx.db
      .query("contentFeeds")
      .withIndex("by_feed", (q) => q.eq("feedId", feed._id))
      .collect();
    
    // Get actual content
    const content = await Promise.all(
      feedContent
        .slice(0, limit)
        .map((fc) => ctx.db.get(fc.contentId))
    );
    
    return content.filter(Boolean).filter((c): c is NonNullable<typeof c> => c !== null && c.status === "published");
  },
});
