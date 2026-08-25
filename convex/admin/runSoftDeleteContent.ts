import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const runSoftDeleteContent = mutation({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.contentId, {
      status: "draft",
      isDeleted: true,
      deletedAt: Date.now(),
    });
    return { success: true, contentId: args.contentId };
  },
});
