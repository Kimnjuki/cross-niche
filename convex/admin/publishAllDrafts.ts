import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

export const publishAllDrafts = mutation({
  args: {},
  handler: async (ctx) => {
    const drafts = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "draft"))
      .collect();
    
    let updated = 0;
    for (const draft of drafts) {
      await ctx.db.patch(draft._id, {
        status: "published",
        publishedAt: draft.publishedAt || Date.now(),
      });
      updated++;
    }
    
    console.log(`Published ${updated} draft articles`);
    return { updated };
  },
});
