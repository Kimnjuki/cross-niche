import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getRoadmapFeatures = query({
  args: {},
  handler: async (ctx) => {
    const features = await ctx.db
      .query("content")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .filter((q) => q.eq(q.field("contentType"), "feature"))
      .collect();

    const contentIds = features.map((f) => f._id);

    const [allNiches, allTags, allContentNiches, allContentTags] = await Promise.all([
      ctx.db.query("niches").collect(),
      ctx.db.query("tags").collect(),
      ctx.db.query("contentNiches").collect(),
      ctx.db.query("contentTags").collect(),
    ]);

    const nichesByIdNum = new Map<number, (typeof allNiches)[number]>();
    for (const n of allNiches) nichesByIdNum.set(n.idNum, n);

    const tagsById = new Map<string, (typeof allTags)[number]>();
    for (const t of allTags) tagsById.set(t._id, t);

    const nichesByContentId = new Map<string, (typeof allNiches)[number][]>();
    for (const cn of allContentNiches) {
      const id = cn.contentId as unknown as string;
      if (!contentIds.some((c) => (c as unknown as string) === id)) continue;
      const niche = nichesByIdNum.get(cn.nicheId);
      if (!niche) continue;
      const arr = nichesByContentId.get(id) ?? [];
      arr.push(niche);
      nichesByContentId.set(id, arr);
    }

    const tagsByContentId = new Map<string, (typeof allTags)[number][]>();
    for (const ct of allContentTags) {
      const id = ct.contentId as unknown as string;
      if (!contentIds.some((c) => (c as unknown as string) === id)) continue;
      const tag = tagsById.get(ct.tagId as unknown as string);
      if (!tag) continue;
      const arr = tagsByContentId.get(id) ?? [];
      arr.push(tag);
      tagsByContentId.set(id, arr);
    }

    return features.map((f) => ({
      ...f,
      niches: nichesByContentId.get(f._id as unknown as string) ?? [],
      tags: tagsByContentId.get(f._id as unknown as string) ?? [],
    }));
  },
});

export const getVoteCounts = query({
  args: {},
  handler: async (ctx) => {
    const votes = await ctx.db.query("roadmapVotes").collect();
    const counts: Record<string, number> = {};
    for (const vote of votes) {
      if (vote.voteType !== "upvote") continue;
      counts[vote.featureId] = (counts[vote.featureId] ?? 0) + 1;
    }
    return counts;
  },
});

export const getUserVotes = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roadmapVotes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getFeatureVotes = query({
  args: {
    featureId: v.string(),
  },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query("roadmapVotes")
      .withIndex("by_feature", (q) => q.eq("featureId", args.featureId))
      .collect();

    const upvotes = votes.filter((vte) => vte.voteType === "upvote").length;
    const downvotes = votes.filter((vte) => vte.voteType === "downvote").length;
    return {
      upvotes,
      downvotes,
      netVotes: upvotes - downvotes,
      totalVotes: votes.length,
    };
  },
});

export const getUserVote = query({
  args: {
    featureId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("roadmapVotes")
      .withIndex("by_feature_user", (q) => q.eq("featureId", args.featureId).eq("userId", args.userId))
      .first();
    return existing?.voteType ?? null;
  },
});

export const castVote = mutation({
  args: {
    featureId: v.string(),
    userId: v.string(),
    voteType: v.union(v.literal("upvote"), v.literal("downvote")),
    votedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("roadmapVotes")
      .withIndex("by_feature_user", (q) => q.eq("featureId", args.featureId).eq("userId", args.userId))
      .first();

    if (existing) {
      throw new Error("User has already voted on this feature");
    }

    const votedAt = args.votedAt ?? Date.now();
    await ctx.db.insert("roadmapVotes", {
      featureId: args.featureId,
      userId: args.userId,
      voteType: args.voteType,
      votedAt,
    });

    const userVoteCount = await ctx.db
      .query("roadmapVotes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    await ctx.runMutation(internal.gamification.awardXP, {
      userId: args.userId,
      amount: 10,
      reason: "vote_cast",
      badgeEvent: "vote_cast",
      totalVotes: userVoteCount.length,
    });

    return { success: true };
  },
});

export const updateVote = mutation({
  args: {
    featureId: v.string(),
    userId: v.string(),
    voteType: v.union(v.literal("upvote"), v.literal("downvote")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("roadmapVotes")
      .withIndex("by_feature_user", (q) => q.eq("featureId", args.featureId).eq("userId", args.userId))
      .first();

    if (!existing) {
      throw new Error("Vote not found");
    }

    await ctx.db.patch(existing._id, {
      voteType: args.voteType,
      votedAt: Date.now(),
    });

    return { success: true };
  },
});

export const removeVote = mutation({
  args: {
    featureId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("roadmapVotes")
      .withIndex("by_feature_user", (q) => q.eq("featureId", args.featureId).eq("userId", args.userId))
      .first();

    if (!existing) {
      return { success: true, removed: false };
    }

    await ctx.db.delete(existing._id);

    return { success: true, removed: true };
  },
});

export const getRoadmapLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const votes = await ctx.db.query("roadmapVotes").collect();
    const countsByUser: Record<string, number> = {};
    for (const vte of votes) {
      countsByUser[vte.userId] = (countsByUser[vte.userId] ?? 0) + 1;
    }

    const gamification = await ctx.db.query("userGamification").collect();
    const gamificationByUser: Record<string, (typeof gamification)[number]> = {};
    for (const g of gamification) gamificationByUser[g.userId] = g;

    const users = await ctx.db.query("users").collect();
    const usersBySupabase: Record<string, (typeof users)[number]> = {};
    for (const u of users) usersBySupabase[u.supabaseUserId] = u;

    const entries = Object.entries(countsByUser).map(([userId, voteCount]) => {
      const g = gamificationByUser[userId];
      const u = usersBySupabase[userId];
      return {
        userId,
        voteCount,
        xp: g?.xp ?? 0,
        level: g?.level ?? 1,
        displayName: u?.displayName ?? u?.username ?? userId,
        avatarUrl: u?.avatarUrl,
      };
    });

    entries.sort((a, b) => (b.xp - a.xp) || (b.voteCount - a.voteCount));
    return entries.slice(0, 10);
  },
});
