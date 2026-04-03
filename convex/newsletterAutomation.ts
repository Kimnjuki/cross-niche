/**
 * Newsletter Automation - Convex Actions and Scheduled Functions
 * 
 * Handles automated newsletter generation and delivery using AI.
 * Integrates with the newsletter curation engine for personalized content.
 */

import { action, mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

/**
 * Subscribe to newsletter
 */
export const subscribe = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    frequency: v.union(v.literal("daily"), v.literal("weekly"), v.literal("bi-weekly"), v.literal("monthly")),
    preferences: v.array(v.string()),
    topicSubscriptions: v.array(v.string()),
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
        name,
        frequency,
        preferences,
        topicSubscriptions,
        unsubscribedTopics,
        newsletterTypes: newsletterTypes || existing.newsletterTypes,
        updatedAt: Date.now(),
        status: "active",
      });

      return existing._id;
    }

    // Create new subscription
    const subscriberId = await ctx.db.insert("newsletterSubscribers", {
      email,
      name,
      frequency,
      preferences,
      topicSubscriptions,
      unsubscribedTopics: unsubscribedTopics || [],
      newsletterTypes: newsletterTypes || [],
      status: "active",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      confirmedAt: null,
      lastSentAt: null,
      openRate: 0,
      clickRate: 0,
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
        unsubscribedAt: Date.now(),
      });
      return true;
    }

    return false;
  },
});

/**
 * Confirm subscription (double opt-in)
 */
export const confirmSubscription = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_confirmation_token", (q) => q.eq("confirmationToken", args.token))
      .unique();

    if (subscriber) {
      await ctx.db.patch(subscriber._id, {
        confirmedAt: Date.now(),
        status: "active",
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
      .withIndex("by_frequency_status", (q) => q.eq("frequency", args.frequency).eq("status", "active"))
      .collect();

    return subscribers;
  },
});

/**
 * Generate newsletter content for a subscriber
 */
export const generateNewsletterContent = action({
  args: {
    subscriberId: v.id("newsletterSubscribers"),
    topics: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db.get(args.subscriberId);
    if (!subscriber) {
      throw new Error("Subscriber not found");
    }

    // Get available articles from content table
    const articles = await ctx.runQuery(api.content.getPublishedContent, { limit: 50 });

    // Filter articles based on subscriber preferences
    const relevantArticles = articles.filter((article) => {
      // Check niche preference
      const nicheMatch = subscriber.preferences.includes(article.niche || "tech");
      
      // Check topic subscriptions
      const topicMatch = subscriber.topicSubscriptions.length === 0 ||
        subscriber.topicSubscriptions.some((topic) =>
          article.tags?.some((tag) =>
            tag.toLowerCase().includes(topic.toLowerCase()) ||
            topic.toLowerCase().includes(tag.toLowerCase())
          )
        );

      // Check recency based on frequency
      const daysSincePublished = (Date.now() - article.publishedAt) / (1000 * 60 * 60 * 24);
      const maxAge = subscriber.frequency === "daily" ? 1 : subscriber.frequency === "weekly" ? 7 : 30;

      return nicheMatch && topicMatch && daysSincePublished <= maxAge;
    });

    // Sort by relevance and recency
    const sortedArticles = relevantArticles.sort((a, b) => {
      const scoreA = (a.isFeatured ? 1 : 0) + (a.views || 0) / 1000;
      const scoreB = (b.isFeatured ? 1 : 0) + (b.views || 0) / 1000;
      return scoreB - scoreA || b.publishedAt - a.publishedAt;
    });

    // Select top articles based on frequency
    const maxArticles = subscriber.frequency === "daily" ? 5 : subscriber.frequency === "weekly" ? 7 : 10;
    const selectedArticles = sortedArticles.slice(0, maxArticles);

    return {
      subscriberId: args.subscriberId,
      articles: selectedArticles,
      generatedAt: Date.now(),
    };
  },
});

/**
 * Send newsletter to a subscriber
 */
export const sendNewsletter = action({
  args: {
    subscriberId: v.id("newsletterSubscribers"),
    newsletterContent: v.object({
      articles: v.array(v.any()),
      subject: v.string(),
      previewText: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db.get(args.subscriberId);
    if (!subscriber) {
      throw new Error("Subscriber not found");
    }

    // In production, this would integrate with an email service like SendGrid, Postmark, etc.
    // For now, we'll just log the newsletter content
    console.log(`Sending newsletter to ${subscriber.email}`);
    console.log(`Subject: ${args.newsletterContent.subject}`);
    console.log(`Articles: ${args.newsletterContent.articles.length}`);

    // Record that newsletter was sent
    await ctx.runMutation(internal.newsletterAutomation.recordNewsletterSent, {
      subscriberId: args.subscriberId,
      subject: args.newsletterContent.subject,
      articleIds: args.newsletterContent.articles.map((a) => a._id || a.id || a.slug),
    });

    return { success: true };
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
    const subscriber = await ctx.db.get(args.subscriberId);
    if (!subscriber) return;

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
      openedAt: null,
      clickedAt: null,
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

      // Update subscriber's open rate
      const subscriber = await ctx.db.get(send.subscriberId);
      if (subscriber) {
        const totalSends = (await ctx.db
          .query("newsletterSends")
          .withIndex("by_subscriber", (q) => q.eq("subscriberId", send.subscriberId))
          .collect()).length;

        const totalOpens = (await ctx.db
          .query("newsletterSends")
          .withIndex("by_subscriber_opened", (q) => q.eq("subscriberId", send.subscriberId))
          .filter((q) => q.gt(q.field("openedAt"), 0))
          .collect()).length;

        await ctx.db.patch(send.subscriberId, {
          openRate: totalSends > 0 ? totalOpens / totalSends : 0,
        });
      }
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

      // Update subscriber's click rate
      const subscriber = await ctx.db.get(send.subscriberId);
      if (subscriber) {
        const totalSends = (await ctx.db
          .query("newsletterSends")
          .withIndex("by_subscriber", (q) => q.eq("subscriberId", send.subscriberId))
          .collect()).length;

        const totalClicks = (await ctx.db
          .query("newsletterSends")
          .withIndex("by_subscriber_clicked", (q) => q.eq("subscriberId", send.subscriberId))
          .filter((q) => q.gt(q.field("clickedAt"), 0))
          .collect()).length;

        await ctx.db.patch(send.subscriberId, {
          clickRate: totalSends > 0 ? totalClicks / totalSends : 0,
        });
      }
    }
  },
});

/**
 * Scheduled function to send daily newsletters
 */
export const sendDailyNewsletters = action({
  args: {},
  handler: async (ctx) => {
    // Get all daily subscribers
    const subscribers = await ctx.runQuery(api.newsletterAutomation.getSubscribersByFrequency, {
      frequency: "daily",
    });

    // Filter to only those who haven't received today's newsletter
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const eligibleSubscribers = subscribers.filter(
      (s) => !s.lastSentAt || s.lastSentAt < todayStart
    );

    console.log(`Sending daily newsletters to ${eligibleSubscribers.length} subscribers`);

    // Process in batches to avoid rate limits
    for (const subscriber of eligibleSubscribers.slice(0, 100)) {
      try {
        // Generate content
        const content = await ctx.runAction(api.newsletterAutomation.generateNewsletterContent, {
          subscriberId: subscriber._id,
        });

        // Generate subject line
        const mainTopic = content.articles[0]?.tags?.[0] || "Tech";
        const subject = `Daily Digest: ${mainTopic} and more (${now.toLocaleDateString()})`;

        // Send newsletter
        await ctx.runAction(api.newsletterAutomation.sendNewsletter, {
          subscriberId: subscriber._id,
          newsletterContent: {
            articles: content.articles,
            subject,
            previewText: `Your daily roundup of ${mainTopic} news and more.`,
          },
        });
      } catch (error) {
        console.error(`Error sending newsletter to ${subscriber.email}:`, error);
      }
    }

    return { sent: eligibleSubscribers.length };
  },
});

/**
 * Scheduled function to send weekly newsletters
 */
export const sendWeeklyNewsletters = action({
  args: {},
  handler: async (ctx) => {
    // Get all weekly and bi-weekly subscribers
    const weeklySubscribers = await ctx.runQuery(api.newsletterAutomation.getSubscribersByFrequency, {
      frequency: "weekly",
    });

    const biWeeklySubscribers = await ctx.runQuery(api.newsletterAutomation.getSubscribersByFrequency, {
      frequency: "bi-weekly",
    });

    // Filter to eligible subscribers
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;

    const eligibleWeekly = weeklySubscribers.filter((s) => !s.lastSentAt || s.lastSentAt < oneWeekAgo);
    const eligibleBiWeekly = biWeeklySubscribers.filter((s) => !s.lastSentAt || s.lastSentAt < twoWeeksAgo);

    const allEligible = [...eligibleWeekly, ...eligibleBiWeekly];

    console.log(`Sending weekly newsletters to ${allEligible.length} subscribers`);

    // Process in batches
    for (const subscriber of allEligible.slice(0, 200)) {
      try {
        const content = await ctx.runAction(api.newsletterAutomation.generateNewsletterContent, {
          subscriberId: subscriber._id,
        });

        const mainTopic = content.articles[0]?.tags?.[0] || "Tech";
        const subject = `Weekly Deep Dive: ${mainTopic} (${new Date().toLocaleDateString()})`;

        await ctx.runAction(api.newsletterAutomation.sendNewsletter, {
          subscriberId: subscriber._id,
          newsletterContent: {
            articles: content.articles,
            subject,
            previewText: `Your weekly deep dive into ${mainTopic} and more.`,
          },
        });
      } catch (error) {
        console.error(`Error sending newsletter to ${subscriber.email}:`, error);
      }
    }

    return { sent: allEligible.length };
  },
});