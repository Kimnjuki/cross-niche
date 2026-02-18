import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertThreat = mutation({
  args: {
    source: v.string(),
    sourceId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    severity: v.union(
      v.literal("critical"),
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),
    category: v.optional(v.string()),
    publishedAt: v.number(),
    url: v.optional(v.string()),
    cveIds: v.optional(v.array(v.string())),
    affected: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    raw: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("threatIntel")
      .withIndex("by_source_id", (q) => q.eq("source", args.source).eq("sourceId", args.sourceId))
      .first();

    const patch = {
      title: args.title,
      description: args.description,
      severity: args.severity,
      category: args.category,
      publishedAt: args.publishedAt,
      url: args.url,
      cveIds: args.cveIds,
      affected: args.affected,
      tags: args.tags,
      raw: args.raw,
      lastIngestedAt: Date.now(),
    } as const;

    if (existing) {
      await ctx.db.patch(existing._id, patch);
      return { id: existing._id, inserted: false };
    }

    const id = await ctx.db.insert("threatIntel", {
      source: args.source,
      sourceId: args.sourceId,
      ...patch,
    });

    const interestedUserIds = new Set<string>();
    const cveIds = args.cveIds ?? [];
    for (const cveId of cveIds) {
      const subs = await ctx.db
        .query("threatSubscriptions")
        .withIndex("by_type_value", (q) => q.eq("type", "cve").eq("value", cveId))
        .collect();
      for (const s of subs) interestedUserIds.add(s.userId);
    }

    const tags = args.tags ?? [];
    for (const tag of tags) {
      const subs = await ctx.db
        .query("threatSubscriptions")
        .withIndex("by_type_value", (q) => q.eq("type", "tag").eq("value", tag))
        .collect();
      for (const s of subs) interestedUserIds.add(s.userId);
    }

    const createdAt = Date.now();
    for (const userId of interestedUserIds) {
      const exists = await ctx.db
        .query("threatNotifications")
        .withIndex("by_user_threat", (q) => q.eq("userId", userId).eq("threatId", id))
        .first();
      if (exists) continue;

      await ctx.db.insert("threatNotifications", {
        userId,
        threatId: id,
        createdAt,
        reason: "subscription_match",
      });
    }

    return { id, inserted: true };
  },
});

export const listLatest = query({
  args: {
    limit: v.optional(v.number()),
    severity: v.optional(
      v.union(v.literal("critical"), v.literal("high"), v.literal("medium"), v.literal("low"))
    ),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);

    if (args.severity) {
      const severity = args.severity;
      return await ctx.db
        .query("threatIntel")
        .withIndex("by_severity_published", (q) => q.eq("severity", severity))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("threatIntel")
      .withIndex("by_published_at")
      .order("desc")
      .take(limit);
  },
});

export const listFeed = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 5, 1), 20);
    return await ctx.db
      .query("threatIntel")
      .withIndex("by_published_at")
      .order("desc")
      .take(limit);
  },
});
