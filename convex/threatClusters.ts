import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    severity: v.optional(
      v.union(
        v.literal("critical"),
        v.literal("high"),
        v.literal("medium"),
        v.literal("low")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 100);
    if (args.severity) {
      return await ctx.db
        .query("communityThreatClusters")
        .withIndex("by_severity", (q) => q.eq("severity", args.severity!))
        .order("desc")
        .take(limit);
    }
    return await ctx.db
      .query("communityThreatClusters")
      .order("desc")
      .take(limit);
  },
});

export const getByClusterId = query({
  args: { clusterId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("communityThreatClusters")
      .withIndex("by_cluster_id", (q) => q.eq("clusterId", args.clusterId))
      .first();
  },
});

export const create = mutation({
  args: {
    clusterId: v.string(),
    title: v.string(),
    description: v.string(),
    platforms: v.array(v.string()),
    gameSlugs: v.optional(v.array(v.string())),
    severity: v.union(
      v.literal("critical"),
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),
    reportIds: v.array(v.id("communityThreatReports")),
    linkedThreatIds: v.optional(v.array(v.id("threatIntel"))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("communityThreatClusters", {
      clusterId: args.clusterId,
      title: args.title,
      description: args.description,
      platforms: args.platforms,
      gameSlugs: args.gameSlugs,
      severity: args.severity,
      createdAt: now,
      updatedAt: now,
      reportIds: args.reportIds,
      linkedThreatIds: args.linkedThreatIds,
    });

    // Tag each report with this clusterId
    for (const reportId of args.reportIds) {
      await ctx.db.patch(reportId, { clusterId: args.clusterId });
    }

    return id;
  },
});

export const addReport = mutation({
  args: {
    clusterId: v.string(),
    reportId: v.id("communityThreatReports"),
  },
  handler: async (ctx, args) => {
    const cluster = await ctx.db
      .query("communityThreatClusters")
      .withIndex("by_cluster_id", (q) => q.eq("clusterId", args.clusterId))
      .first();

    if (!cluster) throw new Error(`Cluster ${args.clusterId} not found`);

    await ctx.db.patch(cluster._id, {
      reportIds: [...cluster.reportIds, args.reportId],
      updatedAt: Date.now(),
    });

    await ctx.db.patch(args.reportId, { clusterId: args.clusterId });
  },
});

export const listUnclusteredReports = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("communityThreatReports")
      .withIndex("by_status", (q) => q.eq("status", "verified"))
      .order("desc")
      .filter((q) => q.eq(q.field("clusterId"), undefined))
      .take(args.limit ?? 50);
  },
});

export const listRecentReports = query({
  args: {
    platform: v.optional(v.string()),
    severity: v.optional(
      v.union(
        v.literal("critical"),
        v.literal("high"),
        v.literal("medium"),
        v.literal("low")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 100);
    if (args.severity) {
      return await ctx.db
        .query("communityThreatReports")
        .withIndex("by_severity_created", (q) => q.eq("severity", args.severity!))
        .order("desc")
        .take(limit);
    }
    return await ctx.db
      .query("communityThreatReports")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});

export const submitReport = mutation({
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
    return await ctx.db.insert("communityThreatReports", {
      userId: args.userId,
      displayName: args.displayName ?? "Anonymous",
      title: args.title,
      description: args.description,
      platform: args.platform,
      severity: args.severity,
      threatType: args.threatType,
      evidence: args.evidence,
      upvotes: 0,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const upvoteReport = mutation({
  args: { reportId: v.id("communityThreatReports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.reportId);
    if (!report) return;
    await ctx.db.patch(args.reportId, { upvotes: report.upvotes + 1 });
  },
});
