/**
 * Seed initial articles: Technology, Security, and Gaming.
 * Inserts into content + contentNiches + contentFeeds.
 * Run from Convex Dashboard: Functions → seed → seedInitialArticles → Run.
 *
 * Schema: niches idNum 1=Tech, 2=Security, 3=Gaming.
 * Feeds: innovate (Tech), secured (Security), play (Gaming), home (Main/Homepage).
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

const FEED_SLUGS: Record<number, { slug: string; name: string; displayOrder: number }> = {
  1: { slug: "innovate", name: "Technology", displayOrder: 1 },
  2: { slug: "secured", name: "Security", displayOrder: 2 },
  3: { slug: "play", name: "Gaming", displayOrder: 3 },
};

const HOME_FEED = { slug: "home", name: "Main Feed", displayOrder: 0 };

const SEED_ARTICLES = [
  {
    title: "The Trillion-Dollar Synergy: Why xAI and SpaceX Merger is Future of Global Compute",
    slug: "xai-spacex-merger-impact-2026",
    subtitle: "Unifying Orbital Infrastructure with Generative Intelligence",
    summary:
      "Elon Musk's xAI and SpaceX merger sparks global debate on compute power and EU antitrust scrutiny.",
    body: "The tech landscape in February 2026 is being reshaped by a single, gravity-defying headline: formal merger talks between Elon Musk's xAI and SpaceX. Unifying orbital infrastructure with generative intelligence could redefine global compute. [Full 800+ word text here]",
    status: "published" as const,
    publishedAt: 1738612800000,
    focusKeyword: "Elon Musk xAI SpaceX merger impact 2026",
    metaTitle: "xAI and SpaceX Merger: Future of 5G AI Integration | The Grid Nexus",
    contentType: "article",
    estimatedReadingTimeMinutes: 6.5,
    wordCount: 812,
    securityScore: 8.2,
    isFeatured: true,
    isBreaking: false,
    source: "Grid Nexus Intelligence",
    nicheId: 1,
  },
  {
    title: "Sicarii Ransomware and Claude Espionage: The Dawn of Autonomous Cyber Warfare",
    slug: "sicarii-ransomware-claude-espionage-2026",
    subtitle: "AI-fueled attacks surge as Claude AI espionage hits 30 firms",
    summary:
      "The emergence of Sicarii ransomware and LLM-driven espionage signals a shift to autonomous cyber threats.",
    body: "The cybersecurity frontline has shifted from 'Human vs. Machine' to 'AI vs. AI.' In early February 2026, the emergence of the Sicarii Ransomware group sent shockwaves. [Full 800+ word text here]",
    status: "published" as const,
    publishedAt: 1738612800001,
    focusKeyword: "AI orchestrated cyber attacks trends 2026",
    metaTitle: "Sicarii Ransomware & Claude AI Espionage 2026 | Cybersecurity Intelligence",
    contentType: "article",
    estimatedReadingTimeMinutes: 7.2,
    wordCount: 845,
    securityScore: 9.8,
    isFeatured: true,
    isBreaking: true,
    source: "CISA & Grid Nexus Labs",
    nicheId: 2,
  },
  {
    title: "February 2026 Release Guide: Why Nioh 3 and Switch 2 are Dominating the Market",
    slug: "best-new-games-february-2026-guide",
    subtitle: "Nioh 3, Resident Evil Requiem, and the Switch 2's Ray-Tracing Era",
    summary:
      "A deep dive into the blockbuster gaming releases for February 2026 including hardware shifts and leaks.",
    body: "February 2026 is officially the busiest month in gaming history. For those seeking 'Gaming Intelligence and Guides,' the focus is squarely on the technical leap. [Full 800+ word text here]",
    status: "published" as const,
    publishedAt: 1738612800002,
    focusKeyword: "Top PS5 Xbox PC games February 2026 release guide",
    metaTitle: "Best New Games Feb 2026: Nioh 3 & RE Requiem Guide",
    contentType: "gaming",
    estimatedReadingTimeMinutes: 6.8,
    wordCount: 805,
    isFeatured: true,
    isBreaking: false,
    source: "Gaming Intelligence Unit",
    nicheId: 3,
  },
];

export const seedInitialArticles = mutation({
  args: {},
  handler: async (ctx) => {
    const inserted: string[] = [];
    const skipped: string[] = [];

    for (const row of SEED_ARTICLES) {
      const existing = await ctx.db
        .query("content")
        .withIndex("by_slug", (q) => q.eq("slug", row.slug))
        .first();
      if (existing) {
        skipped.push(row.slug);
        continue;
      }

      const { nicheId, ...contentFields } = row;
      const contentId = await ctx.db.insert("content", {
        title: contentFields.title,
        slug: contentFields.slug,
        body: contentFields.body,
        summary: contentFields.summary,
        status: contentFields.status,
        publishedAt: contentFields.publishedAt,
        subtitle: contentFields.subtitle,
        metaTitle: contentFields.metaTitle,
        focusKeyword: contentFields.focusKeyword,
        wordCount: contentFields.wordCount,
        estimatedReadingTimeMinutes: contentFields.estimatedReadingTimeMinutes,
        isFeatured: contentFields.isFeatured,
        isBreaking: contentFields.isBreaking,
        contentType: contentFields.contentType as "article" | "review" | "guide" | "news" | "opinion" | undefined,
        source: contentFields.source,
        ...(contentFields.securityScore != null && { securityScore: contentFields.securityScore }),
      });

      await ctx.db.insert("contentNiches", { contentId, nicheId });

      const feedInfo = FEED_SLUGS[nicheId];
      let feed = await ctx.db
        .query("feeds")
        .withIndex("by_slug", (q) => q.eq("slug", feedInfo.slug))
        .first();
      if (!feed) {
        const feedId = await ctx.db.insert("feeds", {
          slug: feedInfo.slug,
          name: feedInfo.name,
          isActive: true,
          displayOrder: feedInfo.displayOrder,
        });
        await ctx.db.insert("contentFeeds", { contentId, feedId });
      } else {
        await ctx.db.insert("contentFeeds", { contentId, feedId: feed._id });
      }

      // Link to Main Feed / Homepage so articles appear on homepage
      let homeFeed = await ctx.db
        .query("feeds")
        .withIndex("by_slug", (q) => q.eq("slug", HOME_FEED.slug))
        .first();
      if (!homeFeed) {
        const homeFeedId = await ctx.db.insert("feeds", {
          slug: HOME_FEED.slug,
          name: HOME_FEED.name,
          isActive: true,
          displayOrder: HOME_FEED.displayOrder,
        });
        await ctx.db.insert("contentFeeds", { contentId, feedId: homeFeedId });
      } else {
        await ctx.db.insert("contentFeeds", { contentId, feedId: homeFeed._id });
      }
      inserted.push(row.slug);
    }

    return { inserted, skipped };
  },
});

/** Seed AI-Pulse Roadmap (nexus-002) updates. Run: seed → seedAIPulseUpdates → Run */
const AI_PULSE_SEED = [
  { title: 'LLM coding assistants hit 40% task completion in benchmarks', description: 'Independent study shows coding agents completing real dev tasks with measurable accuracy; benchmarks published.', category: 'productivity' as const, publishedAt: Date.now() - 2 * 86400000, isHype: false, hasBenchmarks: true },
  { title: 'New "AI-powered" IDE plugin announced', description: 'Vendor announces AI features with no disclosed benchmarks or evaluation methodology.', category: 'productivity' as const, publishedAt: Date.now() - 5 * 86400000, isHype: true, hasBenchmarks: false },
  { title: 'Image models surpass human preference on design tasks', description: 'Peer-reviewed benchmark: design quality and user preference scores for creative tools.', category: 'creative' as const, publishedAt: Date.now() - 7 * 86400000, isHype: false, hasBenchmarks: true },
  { title: 'AI art tool "revolutionary" launch', description: 'Marketing campaign for new creative tool; no third-party benchmarks available.', category: 'creative' as const, publishedAt: Date.now() - 10 * 86400000, isHype: true, hasBenchmarks: false },
  { title: 'NPC dialogue systems: benchmark suite for gaming AI', description: 'Academic benchmark for in-game dialogue coherence and player satisfaction; multiple games evaluated.', category: 'gaming_ai' as const, publishedAt: Date.now() - 12 * 86400000, isHype: false, hasBenchmarks: true },
  { title: 'Game studio announces "next-gen AI" for upcoming title', description: 'Press release with no technical details or performance metrics.', category: 'gaming_ai' as const, publishedAt: Date.now() - 14 * 86400000, isHype: true, hasBenchmarks: false },
];

export const seedAIPulseUpdates = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('aiUpdates').take(1);
    if (existing.length > 0) return { inserted: 0, message: 'aiUpdates already seeded' };
    for (const row of AI_PULSE_SEED) {
      await ctx.db.insert('aiUpdates', row);
    }
    return { inserted: AI_PULSE_SEED.length, message: 'AI Pulse updates seeded' };
  },
});
