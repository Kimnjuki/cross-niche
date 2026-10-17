/**
 * Off-niche article filter for the "gaming security for players" pivot.
 *
 * Default rule: demote general-tech / enterprise-AI / news content types.
 * Overrides: keep gaming-security articles mislabeled under those types, and
 * demote enterprise-security + non-security gaming reviews/news that sit in
 * the `security` and `gaming` types.
 *
 * Reversible: remove a slug from a set to re-index it. The app still renders
 * demoted articles — they are only excluded from the sitemap (and noindexed by
 * the route shell), so no existing URL 404s.
 */
const DEMOTED_CONTENT_TYPES = new Set(['technology', 'news', 'feature']);

const KEEP_SLUGS = new Set([
  // Empty by design. The "gaming-security" articles that were previously
  // force-kept here under a demoted contentType (windows-11 anti-cheat, vpn
  // test, gaming-headset, and the four game-* "feature" pieces) were AI-
  // generated with fabricated claims and are now demoted with the rest of the
  // batch. Keep nothing by exception — on-niche now means the contentType is
  // on-niche AND the article is honest, which is enforced by DEMOTE_SLUGS.
]);

const DEMOTE_SLUGS = new Set([
  // enterprise / general cybersecurity (security contentType)
  'quantum-computing-cybersecurity-risks-2026',
  'kadnap-botnet-asus-router-hack-analysis-2026',
  'edge-security-ueba-cybersecurity-2026',
  'supply-chain-attacks-2026-litellm-malware-teampcp',
  'ai-cybersecurity-trends-2026-agentic-ai-threat-detection',
  'zero-trust-quantum-ready-security-2026',
  'agentic-ai-cybersecurity-risks-enterprise-2026-ciso-guide',
  'shinyhunters-crunchbase-breach-2026-2-million-records-social-engineering',
  'zestix-threat-actor-stolen-cloud-data-sharefile-nextcloud-owncloud-dark-web-2026',
  'conduent-data-breach-exposes-25-million-records-what-enterprises-must-learn-from-one-of-2026s-larges',
  'akzonobel-data-breach-targets-us-operations-supply-chain-cyberattacks-and-zero-trust-security-in-the',
  'icewarp-rce-vulnerability-cve-2025-14500-over-1200-email-servers-exposed-to-unauthenticated-remote-c',
  'crimson-collective-steals-570gb-from-red-hat-gitlab-nsa-and-dod-credentials-exposed-in-massive-repos',
  'claude-ai-weaponized-espionage-2026',
  'sandworm-hackers-poland-power-grid-2026',
  'global-cybersecurity-outlook-2026-ai-risks',
  'microsoft-patch-tuesday-6-zero-days-february-2026',
  // non-security gaming reviews / release news (gaming contentType)
  'nioh-3-announced-sony-state-of-play-instant-play-access',
  'wwe-2k26-review-sandbox-mode-division-storylines-community-creations',
  'ps5-xbox-pc-games-2026-release-calendar',
  'best-gaming-gpu-1440p-2026-rx-9070-xt-vs-rtx-5080',
  'best-gaming-pc-under-1000-2026',
  'world-of-warcraft-midnight-expansion-review-2026-lore-void-raids',
  'monster-hunter-stories-3-twisted-reflection-review-2026-capcom',
  'crimson-desert-review-launch-march-2026-pearl-abyss-ps5-xbox-pc',
  'death-stranding-2-on-the-beach-pc-launch-march-2026-steam-review',
  'dead-by-daylight-all-kill-update-march-2026-trickster-rework-k-pop',
  'arc-raiders-flashpoint-update-2026-extraction-shooter-embark-studios',
  'helldivers-2-force-of-law-warbond-new-weapons-armor-and-what-it-means-for-the-live-service-shooter-m',
  'resident-evil-requiem-launch-2026',
  'ys-x-proud-nordics-launch-2026',
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
]);

/** True when an article belongs in the gaming-security sitemap. */
export function isOnNicheArticle(article) {
  const slug = article.slug;
  const type = article.contentType ?? article.niche;
  if (KEEP_SLUGS.has(slug)) return true;
  if (DEMOTE_SLUGS.has(slug)) return false;
  return !DEMOTED_CONTENT_TYPES.has(type);
}
