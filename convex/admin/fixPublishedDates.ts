import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const fixPublishedDates = mutation({
  args: {},
  handler: async (ctx) => {
    const published = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    
    let fixed = 0;
    for (const article of published) {
      if (!article.publishedAt) {
        await ctx.db.patch(article._id, {
          publishedAt: Date.now(),
        });
        fixed++;
      }
    }
    
    console.log(`Fixed ${fixed} articles with missing publishedAt dates`);
    return { fixed };
  },
});
