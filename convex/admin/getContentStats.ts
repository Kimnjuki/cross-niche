import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const getContentStats = query({
  args: {},
  handler: async (ctx) => {
    const [published, drafts, archived] = await Promise.all([
      ctx.db.query("content").withIndex("by_status", (q) => q.eq("status", "published")).collect(),
      ctx.db.query("content").withIndex("by_status", (q) => q.eq("status", "draft")).collect(),
      ctx.db.query("content").withIndex("by_status", (q) => q.eq("status", "archived")).collect(),
    ]);
    return {
      totalArticles: published.length + drafts.length + archived.length,
      publishedArticles: published.length,
      draftArticles: drafts.length,
      withPublishedAt: published.filter(c => c.publishedAt != null).length,
      totalViews: published.reduce((sum, c) => sum + (c.viewCount || 0), 0),
    };
  },
});
