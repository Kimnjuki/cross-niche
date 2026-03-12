import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function createToken(): string {
  // Simple token generator; do not treat as cryptographic.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

export const subscribe = mutation({
  args: {
    email: v.string(),
    preferences: v.optional(v.array(v.string())),
    frequency: v.optional(v.string()),
    newsletterTypes: v.optional(v.array(v.string())),
    topicSubscriptions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    if (!email || !email.includes("@")) {
      throw new Error("Invalid email");
    }

    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    const token = createToken();
    const subscribedAt = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isActive: true,
        preferences: args.preferences,
        frequency: args.frequency,
        newsletterTypes: args.newsletterTypes,
        topicSubscriptions: args.topicSubscriptions,
        subscribedAt,
        verifiedAt: existing.verifiedAt,
        verificationToken: existing.verifiedAt ? undefined : token,
      });

      return {
        success: true,
        id: existing._id,
        already: true,
        verificationToken: existing.verifiedAt ? undefined : token,
      };
    }

    const id = await ctx.db.insert("newsletterSubscribers", {
      email,
      subscribedAt,
      isActive: true,
      preferences: args.preferences,
      frequency: args.frequency,
      newsletterTypes: args.newsletterTypes,
      topicSubscriptions: args.topicSubscriptions,
      verificationToken: token,
    });

    return { success: true, id, already: false, verificationToken: token };
  },
});

export const verifySubscription = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const token = args.token.trim();
    if (!token) return { success: false };

    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_verification_token", (q) => q.eq("verificationToken", token))
      .first();

    if (!existing) return { success: false };

    await ctx.db.patch(existing._id, {
      verifiedAt: Date.now(),
      verificationToken: undefined,
      isActive: true,
    });

    return { success: true, id: existing._id };
  },
});

export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!existing) return { success: true, removed: false };

    await ctx.db.patch(existing._id, { isActive: false });
    return { success: true, removed: true };
  },
});

export const getSubscriber = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    return await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});
