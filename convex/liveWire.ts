import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

export const getFeed = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("articles")
      // Filters for your Live Wire ephemeral content
      .withIndex("by_sourceType", (q) => q.eq("sourceType", "live_wire"))
      .order("desc") // Shows the newest intelligence first
      .paginate(args.paginationOpts);
  },
});
