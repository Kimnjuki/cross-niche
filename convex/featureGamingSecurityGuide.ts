import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Links the Ultimate Gaming Security Guide article to the 'play' feed
 * (the feed slug the Gaming page and homepage actually query) and sets
 * isFeatured: true so it appears prominently on the homepage.
 */
export const featureGamingSecurityGuide = mutation({
  args: {
    contentId: v.id("content"),
  },
  handler: async (ctx, args) => {
    // 1. Find the 'play' feed
    const playFeed = await ctx.db
      .query("feeds")
      .withIndex("by_slug", (q) => q.eq("slug", "play"))
      .unique();

    if (!playFeed) {
      return { success: false, error: "Feed with slug 'play' not found" };
    }

    // 2. Check if contentFeeds link already exists
    const existingLink = await ctx.db
      .query("contentFeeds")
      .withIndex("by_content_feed", (q) =>
        q.eq("contentId", args.contentId).eq("feedId", playFeed._id)
      )
      .unique();

    let feedLinkCreated = false;
    if (!existingLink) {
      await ctx.db.insert("contentFeeds", {
        contentId: args.contentId,
        feedId: playFeed._id,
      });
      feedLinkCreated = true;
    }

    // 3. Set isFeatured: true on the content
    await ctx.db.patch(args.contentId, {
      isFeatured: true,
    });

    return {
      success: true,
      feedLinkCreated,
      feedId: playFeed._id,
      feedSlug: "play",
      contentId: args.contentId,
      message: "Article linked to 'play' feed and set as featured.",
    };
  },
});