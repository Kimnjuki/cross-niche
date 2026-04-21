/**
 * setupFeedsAndRouting.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Run via:  npx convex run setupFeedsAndRouting
 *
 * What this does:
 *  1. Upserts three canonical feed records  (innovate / secured / play)
 *     that map to the site pages:
 *       /innovate  → Technology & AI content
 *       /secured   → Cybersecurity content
 *       /play      → Gaming content
 *
 *  2. Scans the entire `content` table and links every record to the
 *     correct feed via the `contentFeeds` join table, based on its
 *     `contentType` field.
 *
 *  3. Is fully idempotent — safe to run multiple times. It will never
 *     create duplicate feed records or duplicate contentFeed links.
 *
 * contentType → feed routing map
 * ────────────────────────────────
 *  technology, news, feature, article, opinion, guide, tutorial, review
 *    → innovate  (catch-all for everything that isn't explicitly security/gaming)
 *  security
 *    → secured
 *  gaming
 *    → play
 */

import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const FEED_DEFINITIONS = [
  {
    slug: "innovate",
    name: "Innovate",
    description:
      "Technology, AI, and innovation news — covering hardware, software, startups, and the companies shaping the future.",
    icon: "cpu",
    colorCode: "#6366f1",
    displayOrder: 1,
    isActive: true,
  },
  {
    slug: "secured",
    name: "Secured",
    description:
      "Cybersecurity intelligence — threat analysis, vulnerability disclosures, breaches, and enterprise security guidance.",
    icon: "shield",
    colorCode: "#ef4444",
    displayOrder: 2,
    isActive: true,
  },
  {
    slug: "play",
    name: "Play",
    description:
      "Gaming news and reviews — covering the latest releases, live-service updates, and the business of games.",
    icon: "gamepad",
    colorCode: "#22c55e",
    displayOrder: 3,
    isActive: true,
  },
] as const;

function resolveFeedSlug(contentType: string | undefined): "innovate" | "secured" | "play" {
  switch (contentType) {
    case "security":
      return "secured";
    case "gaming":
      return "play";
    default:
      return "innovate";
  }
}

export default mutation(async ({ db }) => {
  // Step 1: Upsert feeds
  const feedIdMap: Record<string, Id<"feeds">> = {};

  for (const def of FEED_DEFINITIONS) {
    const existing = await db
      .query("feeds")
      .withIndex("by_slug", (q) => q.eq("slug", def.slug))
      .first();

    if (existing) {
      await db.patch(existing._id, {
        name: def.name,
        description: def.description,
        icon: def.icon,
        colorCode: def.colorCode,
        displayOrder: def.displayOrder,
        isActive: def.isActive,
      });
      feedIdMap[def.slug] = existing._id;
    } else {
      const id = await db.insert("feeds", { ...def });
      feedIdMap[def.slug] = id;
    }
  }

  // Step 2: Collect all published content
  const allContent = await db
    .query("content")
    .withIndex("by_status", (q) => q.eq("status", "published"))
    .collect();

  // Step 3: Build lookup of existing contentFeed links to avoid duplicates
  const existingLinks = await db.query("contentFeeds").collect();
  const existingSet = new Set(
    existingLinks.map((l) => `${l.contentId}|${l.feedId}`)
  );

  // Step 4: Link each content record to its feed
  const results = {
    feedsUpserted: FEED_DEFINITIONS.length,
    contentScanned: allContent.length,
    linksCreated: 0,
    linksSkipped: 0,
    breakdown: {
      innovate: 0,
      secured: 0,
      play: 0,
    },
  };

  for (const content of allContent) {
    const feedSlug = resolveFeedSlug(content.contentType ?? undefined);
    const feedId = feedIdMap[feedSlug];

    if (!feedId) continue;

    const linkKey = `${content._id}|${feedId}`;

    if (existingSet.has(linkKey)) {
      results.linksSkipped++;
      continue;
    }

    await db.insert("contentFeeds", {
      contentId: content._id,
      feedId,
    });

    existingSet.add(linkKey);
    results.linksCreated++;
    results.breakdown[feedSlug]++;
  }

  return {
    success: true,
    message:
      "Feeds seeded and all published content linked to pages (innovate / secured / play).",
    ...results,
    feedIds: feedIdMap,
  };
});
