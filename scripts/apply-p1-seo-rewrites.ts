/**
 * Apply specific SEO fixes for Phase 1 CTR improvements.
 *
 * Runs admin:updateSEOBySlug for each article that needs a title/description
 * rewrite per the GN-P1-02 and GN-P1-03 backlog items.
 *
 * Usage: npx tsx scripts/apply-p1-seo-rewrites.ts
 */

import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL || "";
const client = convexUrl ? new ConvexHttpClient(convexUrl) : null;

interface SEOFix {
  slug: string;
  metaTitle: string;
  seoDescription: string;
  focusKeyword: string;
}

const fixes: SEOFix[] = [
  {
    slug: "how-to-check-if-your-gaming-accounts-have-been-compromised",
    metaTitle: "Is Your Gaming Account Hacked? 5 Ways to Check + Fix It (2026) [Guide]",
    seoDescription: "Think your gaming accounts were compromised? Learn how to check for breach exposure, phishing signs, stolen sessions, and how to secure Steam, PlayStation, Xbox, Epic, and Discord accounts quickly.",
    focusKeyword: "check if gaming account compromised",
  },
  {
    slug: "gaming-headset-malware-privacy-guide",
    metaTitle: "Gaming Headset Malware: Privacy Guide 2026 [Security Check]",
    seoDescription: "Can gaming headsets spy on you? We test popular headsets for malware, firmware risks, microphone privacy, and Bluetooth vulnerabilities, plus a step-by-step hardening checklist.",
    focusKeyword: "gaming headset malware privacy",
  },
  {
    slug: "what-gamers-think-about-security-sentiment-analysis-2026",
    metaTitle: "What Gamers Think About Security in 2026 | Sentiment Analysis",
    seoDescription: "Survey of 1,000+ gamers reveals key security sentiment trends: 2FA adoption, phishing awareness, cheat malware exposure, and what stops gamers from securing accounts.",
    focusKeyword: "gamers security sentiment analysis",
  },
];

async function applyFixes() {
  if (!client) {
    console.warn("Skipping SEO fixes: missing Convex URL (set VITE_CONVEX_URL or CONVEX_URL).");
    process.exit(0);
  }

  let success = 0;
  let failed = 0;

  for (const fix of fixes) {
    try {
      await client.mutation("admin:updateSEOBySlug", {
        slug: fix.slug,
        metaTitle: fix.metaTitle,
        seoDescription: fix.seoDescription,
        focusKeyword: fix.focusKeyword,
      });
      console.log(`✅ Updated SEO for /article/${fix.slug}`);
      success++;
    } catch (error: any) {
      console.error(`❌ Failed to update /article/${fix.slug}:`, error.message ?? error);
      failed++;
    }
  }

  console.log(`\n${success} fixed, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

applyFixes();
