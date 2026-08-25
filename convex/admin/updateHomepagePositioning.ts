import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const updateHomepagePositioning = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    heroHeadline: v.string(),
    heroSubheadline: v.string(),
    primaryCta: v.string(),
    secondaryCta: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const upsert = async (key: string, value: any) => {
      const existing = await ctx.db
        .query("siteConfig")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, { value, updatedAt: now });
      } else {
        await ctx.db.insert("siteConfig", { key, value, updatedAt: now });
      }
    };

    await upsert("homepage.title", args.title);
    await upsert("homepage.description", args.description);
    await upsert("homepage.heroHeadline", args.heroHeadline);
    await upsert("homepage.heroSubheadline", args.heroSubheadline);
    await upsert("homepage.primaryCta", args.primaryCta);
    await upsert("homepage.secondaryCta", args.secondaryCta);

    return { success: true };
  },
});
