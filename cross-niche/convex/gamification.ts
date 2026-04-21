import { mutation, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 5000, 10000] as const;

function computeLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return level;
}

export const getByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userGamification")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const awardXP = internalMutation({
  args: {
    userId: v.string(),
    amount: v.number(),
    reason: v.string(),
    badgeEvent: v.optional(
      v.union(
        v.literal("vote_cast"),
        v.literal("comment_posted"),
        v.literal("feature_bookmarked"),
        v.literal("feature_shared")
      )
    ),
    totalVotes: v.optional(v.number()),
    totalComments: v.optional(v.number()),
    totalBookmarks: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userGamification")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();
    const currentXp = existing?.xp ?? 0;
    const nextXp = Math.max(0, currentXp + args.amount);
    const nextLevel = computeLevel(nextXp);

    const badges = new Set<string>(existing?.badges ?? []);
    const achievements = [...(existing?.achievements ?? [])];

    const maybeAward = (id: string) => {
      if (badges.has(id)) return;
      badges.add(id);
      achievements.push({ id, unlockedAt: now });
    };

    if (args.badgeEvent === "vote_cast") {
      maybeAward("first_vote");
      const votes = args.totalVotes ?? 0;
      if (votes >= 10) maybeAward("power_voter_10");
      if (votes >= 50) maybeAward("super_voter_50");
    }

    if (args.badgeEvent === "comment_posted") {
      maybeAward("commenter");
      const comments = args.totalComments ?? 0;
      if (comments >= 10) maybeAward("contributor_10");
    }

    if (args.badgeEvent === "feature_bookmarked") {
      const bookmarks = args.totalBookmarks ?? 0;
      if (bookmarks >= 5) maybeAward("bookmark_collector");
    }

    if (!existing) {
      const docId = await ctx.db.insert("userGamification", {
        userId: args.userId,
        xp: nextXp,
        level: nextLevel,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: now,
        badges: Array.from(badges),
        achievements,
      });
      return { userId: args.userId, docId, xp: nextXp, level: nextLevel };
    }

    await ctx.db.patch(existing._id, {
      xp: nextXp,
      level: nextLevel,
      lastActivityDate: now,
      badges: Array.from(badges),
      achievements,
    });

    return { userId: args.userId, docId: existing._id, xp: nextXp, level: nextLevel };
  },
});

// Get user gamification data (alias for getByUser to match expected API)
export const getUserGamification = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userGamification")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Initialize user gamification
export const initializeGamification = internalMutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userGamification")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    
    if (existing) return existing._id;
    
    return await ctx.db.insert("userGamification", {
      userId: args.userId,
      xp: 0,
      level: 1,
      badges: [],
      achievements: [],
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: Date.now(),
    });
  },
});

// Add XP (public mutation for use by other modules)
export const addXP = mutation({
  args: {
    userId: v.string(),
    xp: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userGamification")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();
    const currentXp = existing?.xp ?? 0;
    const nextXp = Math.max(0, currentXp + args.xp);
    const nextLevel = computeLevel(nextXp);

    if (!existing) {
      const docId = await ctx.db.insert("userGamification", {
        userId: args.userId,
        xp: nextXp,
        level: nextLevel,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: now,
        badges: [],
        achievements: [],
      });
      return { userId: args.userId, docId, xp: nextXp, level: nextLevel };
    }

    await ctx.db.patch(existing._id, {
      xp: nextXp,
      level: nextLevel,
      lastActivityDate: now,
    });

    return { userId: args.userId, docId: existing._id, xp: nextXp, level: nextLevel };
  },
});

// Get leaderboard
export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const topUsers = await ctx.db
      .query("userGamification")
      .withIndex("by_xp")
      .order("desc")
      .take(limit);
    
    // Get user details
    const leaderboard = await Promise.all(
      topUsers.map(async (g) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_supabase_user_id", (q) =>
            q.eq("supabaseUserId", g.userId)
          )
          .unique();
        
        return {
          ...g,
          username: user?.username || "Anonymous",
          displayName: user?.displayName || user?.username,
          avatarUrl: user?.avatarUrl,
        };
      })
    );
    
    return leaderboard;
  },
});
