/**
 * Roadmap Voting System
 * Allows users to vote on roadmap features
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Vote on a roadmap feature
export const vote = mutation({
  args: {
    featureId: v.string(),
    userId: v.string(), // Can be session ID or user ID
    voteType: v.union(v.literal("upvote"), v.literal("downvote")),
  },
  handler: async (ctx, args) => {
    // Check if user already voted
    const existingVote = await ctx.db
      .query("roadmapVotes")
      .withIndex("by_feature_user", (q) => q.eq("featureId", args.featureId).eq("userId", args.userId))
      .first();

    if (existingVote) {
      // Update existing vote
      if (existingVote.voteType === args.voteType) {
        // Remove vote if clicking same type
        await ctx.db.delete(existingVote._id);
        return { success: true, action: "removed" };
      } else {
        // Change vote type
        await ctx.db.patch(existingVote._id, {
          voteType: args.voteType,
          votedAt: Date.now(),
        });
        return { success: true, action: "changed" };
      }
    } else {
      // Create new vote
      await ctx.db.insert("roadmapVotes", {
        featureId: args.featureId,
        userId: args.userId,
        voteType: args.voteType,
        votedAt: Date.now(),
      });
      return { success: true, action: "added" };
    }
  },
});

// Get votes for a feature
export const getFeatureVotes = query({
  args: {
    featureId: v.string(),
  },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query("roadmapVotes")
      .withIndex("by_feature", (q) => q.eq("featureId", args.featureId))
      .collect();

    const upvotes = votes.filter((v) => v.voteType === "upvote").length;
    const downvotes = votes.filter((v) => v.voteType === "downvote").length;
    const netVotes = upvotes - downvotes;

    return {
      upvotes,
      downvotes,
      netVotes,
      totalVotes: votes.length,
    };
  },
});

// Get user's vote for a feature
export const getUserVote = query({
  args: {
    featureId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("roadmapVotes")
      .withIndex("by_feature_user", (q) => q.eq("featureId", args.featureId).eq("userId", args.userId))
      .first();

    return vote ? vote.voteType : null;
  },
});

// Get all votes for multiple features
export const getBulkFeatureVotes = query({
  args: {
    featureIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const votes = await ctx.db
      .query("roadmapVotes")
      .collect();

    const result: Record<string, { upvotes: number; downvotes: number; netVotes: number; totalVotes: number }> = {};

    args.featureIds.forEach((featureId) => {
      const featureVotes = votes.filter((v) => v.featureId === featureId);
      const upvotes = featureVotes.filter((v) => v.voteType === "upvote").length;
      const downvotes = featureVotes.filter((v) => v.voteType === "downvote").length;
      
      result[featureId] = {
        upvotes,
        downvotes,
        netVotes: upvotes - downvotes,
        totalVotes: featureVotes.length,
      };
    });

    return result;
  },
});
