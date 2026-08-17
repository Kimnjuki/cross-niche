import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const recordPageSpeed = mutation({
  args: {
    url: v.string(),
    fcp: v.number(),
    lcp: v.number(),
    fid: v.number(),
    cls: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("pageSpeed", {
      url: args.url,
      fcp: args.fcp,
      lcp: args.lcp,
      fid: args.fid,
      cls: args.cls,
      timestamp: Date.now(),
    });

    return { success: true };
  },
});
