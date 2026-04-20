import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Community Threat Reports ─────────────────────────────────────────────────

export const submitThreatReport = mutation({
  args: {
    userId: v.optional(v.string()),
    displayName: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    platform: v.string(),
    severity: v.union(
      v.literal("critical"),
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),
    threatType: v.string(),
    evidence: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.title.trim() || !args.description.trim()) {
      throw new Error("Title and description are required");
    }
    return await ctx.db.insert("communityThreatReports", {
      ...args,
      displayName: args.displayName?.trim() || "Anonymous",
      upvotes: 0,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const listThreatReports = query({
  args: {
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("verified"),
      v.literal("dismissed")
    )),
    platform: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    if (args.platform) {
      return await ctx.db
        .query("communityThreatReports")
        .withIndex("by_platform", (q) => q.eq("platform", args.platform!))
        .order("desc")
        .take(limit);
    }

    if (args.status) {
      return await ctx.db
        .query("communityThreatReports")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    }

    // Default: recent verified + pending, exclude dismissed
    const all = await ctx.db
      .query("communityThreatReports")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit * 2);

    return all
      .filter((r) => r.status !== "dismissed")
      .slice(0, limit);
  },
});

export const upvoteThreatReport = mutation({
  args: { reportId: v.id("communityThreatReports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report) throw new Error("Report not found");
    await ctx.db.patch(args.reportId, { upvotes: report.upvotes + 1 });
  },
});

export const verifyThreatReport = mutation({
  args: {
    reportId: v.id("communityThreatReports"),
    status: v.union(v.literal("verified"), v.literal("dismissed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      status: args.status,
      verifiedByAdmin: true,
    });
  },
});
