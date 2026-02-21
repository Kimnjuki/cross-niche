import { query } from "./_generated/server";

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
