/**
 * Newsletter Automation - Convex Mutations and Queries
 * 
 * Handles newsletter subscription management.
 * Scheduled functions are in convex/crons.ts.
 */

import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Subscribe to newsletter
 */
export const subscribe = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    frequency: v.optional(v.string()),
    preferences: v.optional(v.array(v.string())),
    topicSubscriptions: v.optional(v.array(v.string())),
    unsubscribedTopics: v.optional(v.array(v.string())),
    newsletterTypes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { email, name, frequency, preferences, topicSubscriptions, unsubscribedTopics, newsletterTypes } = args;

    // Check if already subscribed
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (existing) {
      // Update existing subscription
      await ctx.db.patch(existing._id, {
        name: name ?? existing.name,
        frequency: frequency ?? existing.frequency,
        preferences: preferences ?? existing.preferences,
        topicSubscriptions: topicSubscriptions ?? existing.topicSubscriptions,
        unsubscribedTopics: unsubscribedTopics ?? existing.unsubscribedTopics,
        newsletterTypes: newsletterTypes ?? existing.newsletterTypes,
        status: "active",
      });

      return existing._id;
    }

    // Create new subscription
    const subscriberId = await ctx.db.insert("newsletterSubscribers", {
      email,
      name,
      frequency,
      preferences: preferences ?? [],
      topicSubscriptions: topicSubscriptions ?? [],
      unsubscribedTopics: unsubscribedTopics ?? [],
      newsletterTypes: newsletterTypes ?? [],
      status: "active",
      isActive: true,
      subscribedAt: Date.now(),
    });

    return subscriberId;
  },
});

/**
 * Unsubscribe from newsletter
 */
export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (subscriber) {
      await ctx.db.patch(subscriber._id, {
        status: "unsubscribed",
        isActive: false,
        unsubscribedAt: Date.now(),
      });
      return true;
    }

    return false;
  },
});

/**
 * Get subscriber by email
 */
export const getSubscriber = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    return subscriber;
  },
});

/**
 * Get all active subscribers for a frequency
 */
export const getSubscribersByFrequency = query({
  args: { frequency: v.string() },
  handler: async (ctx, args) => {
    const subscribers = await ctx.db
      .query("newsletterSubscribers")
      .filter((q) => q.eq(q.field("frequency"), args.frequency))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    return subscribers;
  },
});

/**
 * Get all active subscribers
 */
export const getActiveSubscribers = query({
  args: {},
  handler: async (ctx) => {
    const subscribers = await ctx.db
      .query("newsletterSubscribers")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    return subscribers;
  },
});

/**
 * Record newsletter sent (internal mutation)
 */
export const recordNewsletterSent = internalMutation({
  args: {
    subscriberId: v.id("newsletterSubscribers"),
    subject: v.string(),
    articleIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Update subscriber's last sent date
    await ctx.db.patch(args.subscriberId, {
      lastSentAt: Date.now(),
    });

    // Record newsletter send history
    await ctx.db.insert("newsletterSends", {
      subscriberId: args.subscriberId,
      subject: args.subject,
      articleIds: args.articleIds,
      sentAt: Date.now(),
    });
  },
});

/**
 * Track newsletter open
 */
export const trackOpen = mutation({
  args: { sendId: v.id("newsletterSends") },
  handler: async (ctx, args) => {
    const send = await ctx.db.get(args.sendId);
    if (send && !send.openedAt) {
      await ctx.db.patch(args.sendId, {
        openedAt: Date.now(),
      });
    }
  },
});

/**
 * Track newsletter click
 */
export const trackClick = mutation({
  args: { sendId: v.id("newsletterSends"), articleUrl: v.string() },
  handler: async (ctx, args) => {
    const send = await ctx.db.get(args.sendId);
    if (send && !send.clickedAt) {
      await ctx.db.patch(args.sendId, {
        clickedAt: Date.now(),
      });
    }
  },
});