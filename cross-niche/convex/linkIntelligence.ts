import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Track broken external links with optional redirect targets
export const trackBrokenLink = mutation({
  args: {
    url: v.string(),
    statusCode: v.number(),
    backlinkCount: v.number(),
    referringDomains: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("brokenLinks")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        statusCode: args.statusCode,
        backlinkCount: args.backlinkCount,
        referringDomains: args.referringDomains,
        lastChecked: now,
      });
      return { updated: true };
    }

    await ctx.db.insert("brokenLinks", {
      url: args.url,
      statusCode: args.statusCode,
      backlinkCount: args.backlinkCount,
      referringDomains: args.referringDomains,
      lastChecked: now,
      redirectTo: undefined,
      fixed: false,
    });

    return { created: true };
  },
});

export const setBrokenLinkRedirect = mutation({
  args: {
    url: v.string(),
    redirectTo: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("brokenLinks")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();

    if (!existing) {
      throw new Error("Broken link not found");
    }

    await ctx.db.patch(existing._id, {
      redirectTo: args.redirectTo,
      fixed: true,
      lastChecked: Date.now(),
    });

    return { success: true };
  },
});

export const getRedirect = query({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("brokenLinks")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();

    if (!entry || !entry.redirectTo) {
      return null;
    }

    return { redirect: entry.redirectTo };
  },
});

// Internal link graph
export const recordInternalLink = mutation({
  args: {
    sourceContentId: v.id("content"),
    targetContentId: v.id("content"),
    anchorText: v.string(),
    context: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("internalLinks", {
      sourceContentId: args.sourceContentId,
      targetContentId: args.targetContentId,
      anchorText: args.anchorText,
      context: args.context,
      createdAt: Date.now(),
      clickCount: 0,
    });

    return { success: true };
  },
});

export const incrementInternalLinkClick = mutation({
  args: {
    sourceContentId: v.id("content"),
    targetContentId: v.id("content"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("internalLinks")
      .withIndex("by_source", (q) =>
        q.eq("sourceContentId", args.sourceContentId)
      )
      .collect();

    for (const link of existing) {
      if (link.targetContentId === args.targetContentId) {
        await ctx.db.patch(link._id, {
          clickCount: (link.clickCount ?? 0) + 1,
        });
      }
    }

    return { success: true };
  },
});

// Link opportunities and brand mentions – minimal upsert helpers
export const upsertLinkOpportunity = mutation({
  args: {
    domain: v.string(),
    domainRating: v.number(),
    competitorsLinking: v.array(v.string()),
    contactEmail: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("identified"),
        v.literal("outreach_sent"),
        v.literal("responded"),
        v.literal("link_acquired"),
        v.literal("rejected")
      )
    ),
    linkUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("linkOpportunities")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        domainRating: args.domainRating,
        competitorsLinking: args.competitorsLinking,
        contactEmail: args.contactEmail,
        status: args.status ?? existing.status,
        linkUrl: args.linkUrl ?? existing.linkUrl,
        responseDate:
          args.status && args.status !== existing.status
            ? Date.now()
            : existing.responseDate,
      });
      return { updated: true };
    }

    await ctx.db.insert("linkOpportunities", {
      domain: args.domain,
      domainRating: args.domainRating,
      competitorsLinking: args.competitorsLinking,
      contactEmail: args.contactEmail,
      status: args.status ?? "identified",
      outreachDate: undefined,
      responseDate: undefined,
      linkUrl: args.linkUrl,
    });

    return { created: true };
  },
});

export const upsertBrandMention = mutation({
  args: {
    url: v.string(),
    domain: v.string(),
    mentionContext: v.string(),
    isLinked: v.boolean(),
    domainRating: v.number(),
    outreachStatus: v.optional(v.string()),
    linkAcquired: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("brandMentions")
      .withIndex("by_domain", (q) => q.eq("domain", args.domain))
      .collect();

    const match = existing.find((m) => m.url === args.url);

    if (match) {
      await ctx.db.patch(match._id, {
        mentionContext: args.mentionContext,
        isLinked: args.isLinked,
        domainRating: args.domainRating,
        outreachStatus: args.outreachStatus ?? match.outreachStatus,
        linkAcquired: args.linkAcquired ?? match.linkAcquired,
        discoveredAt: match.discoveredAt,
      });
      return { updated: true };
    }

    await ctx.db.insert("brandMentions", {
      url: args.url,
      domain: args.domain,
      mentionContext: args.mentionContext,
      isLinked: args.isLinked,
      domainRating: args.domainRating,
      outreachStatus: args.outreachStatus,
      linkAcquired: args.linkAcquired,
      discoveredAt: Date.now(),
    });

    return { created: true };
  },
});

export const upsertAnchorTextAnalysis = mutation({
  args: {
    backlinkId: v.string(),
    anchorText: v.string(),
    type: v.union(
      v.literal("exact_match"),
      v.literal("partial_match"),
      v.literal("branded"),
      v.literal("generic"),
      v.literal("naked_url")
    ),
    targetUrl: v.string(),
    isOptimal: v.boolean(),
    suggestedAnchor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("anchorTextAnalysis")
      .withIndex("by_target_url", (q) =>
        q.eq("targetUrl", args.targetUrl)
      )
      .collect();

    const match = existing.find(
      (a) => a.backlinkId === args.backlinkId
    );

    if (match) {
      await ctx.db.patch(match._id, {
        anchorText: args.anchorText,
        type: args.type,
        isOptimal: args.isOptimal,
        suggestedAnchor: args.suggestedAnchor,
      });
      return { updated: true };
    }

    await ctx.db.insert("anchorTextAnalysis", {
      backlinkId: args.backlinkId,
      anchorText: args.anchorText,
      type: args.type,
      targetUrl: args.targetUrl,
      isOptimal: args.isOptimal,
      suggestedAnchor: args.suggestedAnchor,
    });

    return { created: true };
  },
});

