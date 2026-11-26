import fs from 'node:fs';

/**
 * Off-niche article filter for the "gaming security for players" pivot.
 *
 * Default rule: demote general-tech / enterprise-AI / news content types.
 * Overrides: KEEP_SLUGS reinstates specific URLs for indexing (GSC coverage),
 * DEMOTE_SLUGS force-demotes fabricated / off-niche pieces.
 *
 * Reversible: add/remove a slug from kept-article-slugs.json or this demote
 * list. The app still renders demoted articles. They are excluded from the
 * sitemap AND emitted with `noindex, follow` by `generate-static-articles.mjs`.
 */
const DEMOTED_CONTENT_TYPES = new Set(['technology', 'news', 'feature']);

const KEEP_SLUGS = new Set(
  JSON.parse(
    fs.readFileSync(new URL('../../src/data/kept-article-slugs.json', import.meta.url), 'utf8'),
  ),
);

const DEMOTE_SLUGS = new Set([
  // enterprise / general cybersecurity (security contentType)
  'quantum-computing-cybersecurity-risks-2026',
  'ai-cybersecurity-trends-2026-agentic-ai-threat-detection',
  'zero-trust-quantum-ready-security-2026',
  'agentic-ai-cybersecurity-risks-enterprise-2026-ciso-guide',
  'shinyhunters-crunchbase-breach-2026-2-million-records-social-engineering',
  'conduent-data-breach-exposes-25-million-records-what-enterprises-must-learn-from-one-of-2026s-larges',
  'claude-ai-weaponized-espionage-2026',
  'global-cybersecurity-outlook-2026-ai-risks',
  // non-security gaming reviews / release news (gaming contentType)
  'wwe-2k26-review-sandbox-mode-division-storylines-community-creations',
  'ps5-xbox-pc-games-2026-release-calendar',
  'best-gaming-pc-under-1000-2026',
  'world-of-warcraft-midnight-expansion-review-2026-lore-void-raids',
  'death-stranding-2-on-the-beach-pc-launch-march-2026-steam-review',
  'arc-raiders-flashpoint-update-2026-extraction-shooter-embark-studios',
  'helldivers-2-force-of-law-warbond-new-weapons-armor-and-what-it-means-for-the-live-service-shooter-m',
  'high-on-life-2-release-2026',
  'nioh-3-release-ps5-2026',
  // AI-generated "high editorial" batch (April 2026) with fabricated claims:
  // unverifiable stats ("340% surge"), fake CVEs/incidents (CVE-2026-2904,
  // "Bitwarden April 2026", "Razer Synapse April 2026"), and "we tested"
  // claims that never happened. Demoted for accuracy and trust.
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
]);

/** True when an article belongs in the gaming-security sitemap. */
export function isOnNicheArticle(article) {
  const slug = article.slug;
  const type = article.contentType ?? article.niche;
  if (KEEP_SLUGS.has(slug)) return true;
  if (DEMOTE_SLUGS.has(slug)) return false;
  return !DEMOTED_CONTENT_TYPES.has(type);
}
