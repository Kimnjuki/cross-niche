/**
 * One-time backfill: noindex the AI-generated "high editorial" articles that
 * contained fabricated claims (unverifiable stats, fake CVEs/incidents, "we
 * tested" claims that never happened). Keeps the rows (no 404) but tells
 * crawlers to drop them — matching their exclusion from sitemap-articles.xml
 * via scripts/lib/off-niche-articles.mjs.
 *
 * Run: npx convex run noindexFabricatedArticles:noindexFabricatedArticles --prod
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';

const FABRICATED_SLUGS = [
  'gmail-hack-attacks-surge-gamers-2fa-2026',
  'bitwarden-security-incident-gaming-password-manager',
  'steam-account-takeover-protection-guide-2026',
  'discord-malware-gamers-how-to-stay-safe',
  'nintendo-switch-2-security-guide',
  'fake-game-cheats-malware-account-stealer',
  'sim-swapping-gaming-accounts-protection',
  'xbox-rebrand-security-changes-gamers',
  'steam-controller-security-risks-gamers',
  'twitch-streamer-security-guide-doxxing-swatting',
  'razer-synapse-security-vulnerability-fix',
  'game-key-reseller-scams-g2a-cdkeys',
  'roblox-parents-guide-account-security-safety',
  'minecraft-server-security-guide',
  'twitch-accounts-hacked-breach-guide-2026',
  'gaming-pc-antivirus-best-2026',
  'fortnite-valorant-updates-2026-security-patches',
  'windows-11-anti-cheat-broken-fix-guide',
  'vpn-gaming-security-latency-test-2026',
  'gaming-headset-malware-privacy-guide',
  'ai-enhanced-game-security-anti-cheat-machine-learning-2026',
  'game-account-security-anti-phishing-2026-gaming-platforms',
  'game-cheating-exploit-detection-analytics-cheat-intelligence-2026',
  'game-monetization-anti-fraud-intelligence-2026-in-app-purchases',
];

export const noindexFabricatedArticles = mutation({
  args: { trigger: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    if (args.trigger === false) return { skipped: true };

    let updated = 0;
    let missing = 0;
    for (const slug of FABRICATED_SLUGS) {
      const existing = await ctx.db
        .query('content')
        .withIndex('by_slug', (q) => q.eq('slug', slug))
        .unique();
      if (!existing) {
        missing++;
        continue;
      }
      if (existing.noindex !== true) {
        await ctx.db.patch(existing._id, {
          noindex: true,
          noindexReason: 'Fabricated/unverifiable claims — demoted for accuracy and trust',
          lastModifiedAt: Date.now(),
        });
        updated++;
      }
    }
    return { updated, missing, total: FABRICATED_SLUGS.length };
  },
});
