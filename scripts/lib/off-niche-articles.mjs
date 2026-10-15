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
  // gaming-security articles mislabeled with a demoted contentType
  'windows-11-anti-cheat-broken-fix-guide',
  'vpn-gaming-security-latency-test-2026',
  'gaming-headset-malware-privacy-guide',
  'ai-enhanced-game-security-anti-cheat-machine-learning-2026',
  'game-account-security-anti-phishing-2026-gaming-platforms',
  'game-cheating-exploit-detection-analytics-cheat-intelligence-2026',
  'game-monetization-anti-fraud-intelligence-2026-in-app-purchases',
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
]);

/** True when an article belongs in the gaming-security sitemap. */
export function isOnNicheArticle(article) {
  const slug = article.slug;
  const type = article.contentType ?? article.niche;
  if (KEEP_SLUGS.has(slug)) return true;
  if (DEMOTE_SLUGS.has(slug)) return false;
  return !DEMOTED_CONTENT_TYPES.has(type);
}
