/**
 * Copilot Sessions — conversation persistence for GamingCopilot (Tool 07).
 * Stores full message history per session for retrieval, context, and analytics.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSession = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    systemPromptVersion: v.string(),
  },
  handler: async (ctx, { sessionId, userId, systemPromptVersion }) => {
    const now = Date.now();
    return await ctx.db.insert("copilotSessions", {
      sessionId,
      userId,
      messages: [],
      systemPromptVersion,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const addMessage = mutation({
  args: {
    sessionId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    tokensUsed: v.optional(v.float64()),
  },
  handler: async (ctx, { sessionId, role, content, tokensUsed }) => {
    const session = await ctx.db
      .query("copilotSessions")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const now = Date.now();
    const messages = [
      ...session.messages,
      { role, content, timestamp: now, tokensUsed: tokensUsed ?? undefined },
    ];

    const totalTokensUsed = (session.totalTokensUsed ?? 0) + (tokensUsed ?? 0);

    await ctx.db.replace(session._id, {
      ...session,
      messages,
      updatedAt: now,
      totalTokensUsed,
      lastUserMessage: role === "user" ? content : session.lastUserMessage,
    });

    return {
      messageCount: messages.length,
      timestamp: now,
    };
  },
});

export const getSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("copilotSessions")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();
  },
});

export const getUserSessions = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { userId, limit = 10 }) => {
    return await ctx.db
      .query("copilotSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

export const clearSession = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const session = await ctx.db
      .query("copilotSessions")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (session) {
      const now = Date.now();
      await ctx.db.replace(session._id, {
        ...session,
        messages: [],
        updatedAt: now,
        totalTokensUsed: 0,
      });
      return { cleared: true };
    }
    return { cleared: false };
  },
});

export const deleteSession = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const session = await ctx.db
      .query("copilotSessions")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
      return { deleted: true };
    }
    return { deleted: false };
  },
});

export const logGuardrail = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const session = await ctx.db
      .query("copilotSessions")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (session) {
      await ctx.db.replace(session._id, {
        ...session,
        guardrailTriggered: true,
        updatedAt: Date.now(),
      });
    }
  },
});
