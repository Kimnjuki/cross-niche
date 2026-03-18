// One-time mutation to update featuredImageUrl for the 10 inserted articles
// to use real Unsplash images instead of broken nexus.com URLs.
// Run via: npx convex run fixArticleImages:fixArticleImages

import { mutation } from "./_generated/server";

const IMAGE_MAP: Record<string, string> = {
  "nvidia-blackwell-chips-eye-1-trillion-orders-what-jensen-huangs-bold-prediction-means-for-ai-hardwar":
    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=630&fit=crop",
  "meta-unveils-four-new-in-house-ai-chips-mtia-300-to-500-explained-how-big-tech-is-breaking-free-from":
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop",
  "xai-gains-pentagon-access-amid-security-concerns-grok-classified-networks-and-the-military-ai-dilemm":
    "https://images.unsplash.com/photo-1569025591-a3c16d4c5f5f?w=1200&h=630&fit=crop",
  "apple-acquires-motionvfx-final-cut-pros-ai-powered-creative-leap-and-what-it-means-for-video-editing":
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=630&fit=crop",
  "frore-systems-hits-unicorn-status-143m-raise-at-164b-valuation-puts-ai-chip-cooling-in-the-spotlight":
    "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&h=630&fit=crop",
  "conduent-data-breach-exposes-25-million-records-what-enterprises-must-learn-from-one-of-2026s-larges":
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=630&fit=crop",
  "akzonobel-data-breach-targets-us-operations-supply-chain-cyberattacks-and-zero-trust-security-in-the":
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop",
  "icewarp-rce-vulnerability-cve-2025-14500-over-1200-email-servers-exposed-to-unauthenticated-remote-c":
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=630&fit=crop",
  "crimson-collective-steals-570gb-from-red-hat-gitlab-nsa-and-dod-credentials-exposed-in-massive-repos":
    "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1200&h=630&fit=crop",
  "helldivers-2-force-of-law-warbond-new-weapons-armor-and-what-it-means-for-the-live-service-shooter-m":
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=630&fit=crop",
};

export const fixArticleImages = mutation({
  args: {},
  handler: async (ctx) => {
    const results: Array<{ slug: string; updated: boolean }> = [];

    for (const [slugPrefix, imageUrl] of Object.entries(IMAGE_MAP)) {
      // Slugs are truncated to 100 chars; match by prefix
      const doc = await ctx.db
        .query("content")
        .withIndex("by_slug", (q) => q.eq("slug", slugPrefix))
        .first();

      if (doc) {
        await ctx.db.patch(doc._id, { featuredImageUrl: imageUrl });
        results.push({ slug: slugPrefix, updated: true });
      } else {
        results.push({ slug: slugPrefix, updated: false });
      }
    }

    return { updated: results.filter((r) => r.updated).length, results };
  },
});
