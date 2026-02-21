/**
 * Insert the "Peak Viewers & ARM Ambitions" featured article into content,
 * contentTables, securityRatings, contentNiches, and contentFeeds.
 *
 * Run from Convex Dashboard: Functions → insertFeaturedArticle → Run (no args).
 *
 * Ensures the article appears in:
 * - Top news (listPublished by publishedAt desc; isFeatured + newest)
 * - Gaming section (linked to feed "play" via contentFeeds)
 *
 * Schema: niches idNum 1=Tech, 2=Security, 3=Gaming.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const insertFeaturedArticle = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Insert the main content (publishedAt in ms for listPublished ordering)
    const contentId = await ctx.db.insert("content", {
      title: "The Grid Nexus: Peak Viewers, ARM Ambitions, and the VR Reality Check",
      slug: "peak-viewers-arm-ambitions-vr-reality-check-2026",
      subtitle: "How Mobile Esports and ARM Architecture are Redefining the Grid in 2026",
      summary:
        "A deep dive into Mobile Legends' viewership dominance, the Windows 11 ARM revolution, and the structural shifts at Meta's VR studios.",
      body: `## The Mobile Takeover: Esports' New Hierarchy\n\nAs we push into early 2026, the digital landscape is being reshaped by two conflicting forces: the explosive growth of global esports and a ruthless corporate thinning of the immersive tech sector. **Mobile Legends: Bang Bang (MLBB)** has shattered the ceiling, clocking a staggering **5.6 million peak concurrent viewers**.\n\n## The ARM Renaissance: Xbox on Windows 11\n\nThe integration of Windows 11 on ARM PCs (Snapdragon X Elite) has finally matured. The Xbox App now runs with 'near-native' performance, finally making AAA gaming on ARM a reality. This shift allows for 20-hour battery life without sacrificing blocks in Minecraft.\n\n## The VR Winter: Meta's Structural Pivot\n\nMeta continues its 'Year of Efficiency,' impacting Seattle-based VR studios like Camouflaj. As resources divert to 'Orion' AR glasses, the VR gaming sector faces a prestige content vacuum.\n\n## The Verdict: Navigating the Nexus\n\nThe industry is bifurcating. Follow the efficiency—whether it is 5-minute mobile matches or 20-hour laptop batteries, the Grid rewards accessibility over brute force.`,
      status: "published",
      contentType: "article",
      publishedAt: Date.now(),
      isFeatured: true,
      isBreaking: false,
      isPremium: false,
      wordCount: 812,
      estimatedReadingTimeMinutes: 4,
      focusKeyword: "Mobile Legends Esports 2026",
      metaTitle: "Esports Viewership and ARM PC Trends 2026 | The Grid Nexus",
      securityScore: 8.2,
      seoDescription: "Analysis of Mobile Legends esports viewership, Windows 11 ARM gaming performance, and Meta VR gaming developments for 2026.",
      canonicalUrl: "https://thegridnexus.com/esports-viewership-arm-pc-trends-2026",
      schema_org: {
        "@type": "Article",
        "headline": "Esports Viewership and ARM PC Trends 2026 | The Grid Nexus",
        "description": "In-depth analysis of Mobile Legends esports dominance, ARM PC gaming revolution, and Meta VR gaming structural changes.",
        "author": {
          "@type": "Organization",
          "name": "The Grid Nexus Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "The Grid Nexus"
        }
      },
      lastModifiedAt: Date.now(),
      lastModifiedBy: "system",
      isDeleted: false,
      deletedAt: undefined,
    });

    // 2. Viewership table data
    await ctx.db.insert("contentTables", {
      contentId,
      tableTitle: "Top Esports Viewership 2025-2026",
      orderIndex: 1,
      tableData: [
        { game: "Mobile Legends: BB", peakViewers: "5.6M", platform: "Mobile" },
        { game: "League of Legends", peakViewers: "4.1M", platform: "PC" },
        { game: "Valorant", peakViewers: "2.4M", platform: "PC" },
        { game: "Counter-Strike 2", peakViewers: "1.9M", platform: "PC" },
      ],
    });

    // 3. Security rating for ARM/Mobile Legends context (schema: dataEncryption, accountMFA required)
    await ctx.db.insert("securityRatings", {
      contentId,
      nexusSecurityScore: 82,
      accountMFA: true,
      dataEncryption: true,
      dataSharingPolicy: "minimal",
      funFactor: 90,
      gameTitle: "Mobile Legends",
      gameSlug: "mobile-legends",
    });

    // 4. Niches: schema idNum 1=Tech, 2=Security, 3=Gaming (so Gaming section = 3, Tech = 1)
    await ctx.db.insert("contentNiches", {
      contentId,
      nicheId: 3,
    });
    await ctx.db.insert("contentNiches", {
      contentId,
      nicheId: 1,
    });

    // 5. Link to feed "play" so article appears in Gaming section (useContentByFeed('play', 5))
    let playFeed = await ctx.db
      .query("feeds")
      .withIndex("by_slug", (q) => q.eq("slug", "play"))
      .first();
    if (!playFeed) {
      const feedId = await ctx.db.insert("feeds", {
        slug: "play",
        name: "Gaming",
        isActive: true,
        displayOrder: 3,
      });
      await ctx.db.insert("contentFeeds", { contentId, feedId });
    } else {
      await ctx.db.insert("contentFeeds", {
        contentId,
        feedId: playFeed._id,
      });
    }

    return { success: true, insertedId: contentId };
  },
});
