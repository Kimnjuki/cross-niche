/**
 * findMockArticle.ts
 *
 * Standalone mock article lookup — ships a minimal slug→article mapping
 * so the Article component can resolve articles without relying on
 * cross-chunk imports from the full mockData module.
 *
 * This avoids Vite treeshaking/code-splitting issues where mockArticles
 * ends up in a different chunk (SEOHead) than the Article component.
 */

import type { Article } from '@/types';

// Inline slug-to-article maps for each niche — tiny subset (id + slug only)
// that gets emitted once in whatever chunk imports this module.
// IMPORTANT: Every slug in mockData.ts MUST be listed here or article clicks silently fail.
const ARTICLE_SLUG_MAP: Record<string, string> = {
  // Tech
  'tech-1': 'apple-vision-pro-2-spatial-computing',
  'tech-2': 'nvidia-rtx-5090-benchmarks-leak-2x-performance',
  'tech-3': 'quantum-computing-milestone-google-error-correction',
  'tech-4': 'tesla-optimus-gen-3-humanoid-robots-mass-production',
  'tech-5': 'twitch-accounts-hacked-breach-guide-2026',
  'tech-6': 'gaming-headset-malware-privacy-guide',
  'tech-7': 'gaming-pc-antivirus-best-2026',
  'tech-8': 'router-security-gamers-network-protection',
  'tech-trend-1': 'apple-vision-pro-2-revolutionary-spatial-computing-arrives',
  'tech-trend-2': 'google-deepmind-gemini-code-ai-android',
  'tech-trend-3': 'qualcomm-snapdragon-x3-laptop-performance-arm',
  'tech-trend-4': 'elon-musk-neuralink-brain-chip-stroke-2026',
  // Security
  'sec-1': 'ransomware-groups-targeting-gaming-industry-2026',
  'sec-2': 'critical-nginx-http3-vulnerability-web-servers-2026',
  'sec-3': 'nist-post-quantum-cryptography-standards-2026',
  'sec-4': 'ai-powered-phishing-attacks-targeting-gamers-2026',
  'sec-5': 'gmail-hack-attacks-surge-gamers-2fa-2026',
  'sec-6': 'bitwarden-security-incident-gaming-password-manager',
  'sec-7': 'chrome-zero-day-warning-gamers-april-2026',
  'sec-8': 'steam-account-takeover-protection-guide-2026',
  'sec-9': 'discord-malware-gamers-how-to-stay-safe',
  'sec-10': 'nintendo-switch-2-security-guide',
  'sec-11': 'fake-game-cheats-malware-account-stealer',
  'sec-12': 'sim-swapping-gaming-accounts-protection',
  // Security (older — not in homepage rotation but kept for deep-link compat)
  'sec-x1': 'steam-phishing-scams-account-protection-2026',
  'sec-x2': 'nintendo-switch-2-launch-security-guide-2026',
  'sec-x3': 'rust-programming-security-vulnerabilities-2026',
  'sec-x4': 'best-antivirus-gaming-pcs-2026-performance',
  'sec-x5': 'gaming-router-security-guide-home-network-protection',
  'sec-x6': 'building-secure-gaming-pc-2024',
  'sec-x7': 'gaming-account-security-ultimate-protection-guide',
  // Gaming
  'game-1': 'elden-ring-dlc-shadow-erdtree-review',
  'game-2': 'best-gaming-pc-build-2026',
  'game-3': 'steam-deck-2-release-date-specs',
  'game-4': 'gta-6-trailer-analysis-release-date',
  'game-5': 'windows-11-anti-cheat-broken-fix-guide',
  'game-6': 'xbox-rebrand-security-changes-gamers',
  'game-7': 'steam-controller-security-risks-gamers',
  'game-8': 'vpn-gaming-security-latency-test-2026',
  'game-9': 'twitch-streamer-security-guide-doxxing-swatting',
  'game-10': 'razer-synapse-security-vulnerability-fix',
  'game-11': 'game-key-reseller-scams-g2a-cdkeys',
  'game-12': 'roblox-parents-guide-account-security-safety',
  'game-13': 'minecraft-server-security-guide',
  // Gaming (older)
  'game-x1': 'can-ai-become-the-ultimate-gaming-trainer-steam-game-improvement-eras',
  'game-x2': 'voice-chat-moderation-gaming-toxicity-speech-recognition',
  'game-x3': 'haarlem-lamestop-2026-beginners-guide-to-gaming',
  'game-x4': 'ai-npcs-video-games-future-gaming-artificial-intelligence',
  'game-x5': 'mastering-competitive-fps-pro-player-techniques',
  // Legacy articles
  'ai-basics': 'ai-basics',
  'ml-explained': 'ml-explained',
  'deep-learning': 'deep-learning',
  'ai-security': 'ai-security',
  'cloud-basics': 'cloud-basics',
  'cloud-comparison': 'cloud-comparison',
  'cloud-security': 'cloud-security',
  'blockchain-explained': 'blockchain-explained',
  'crypto-security': 'crypto-security',
  'cybersecurity-basics': 'cybersecurity-basics',
  'network-security': 'network-security',
  'endpoint-security': 'endpoint-security',
  'threat-intelligence': 'threat-intelligence',
  'ransomware-prevention': 'ransomware-prevention',
  'malware-removal': 'malware-removal',
  'best-antivirus': 'best-antivirus',
  'gdpr-compliance': 'gdpr-compliance',
  'data-privacy': 'data-privacy',
  'gaming-account-security': 'gaming-account-security',
  'gaming-data-protection': 'gaming-data-protection',
  'best-gaming-laptops': 'best-gaming-laptops',
  'gaming-mice': 'gaming-mice',
  'esports-guide': 'esports-guide',
  'esports-tournaments': 'esports-tournaments',
};

// Reverse map: slug → id
const SLUG_TO_ID: Record<string, string> = {};
for (const [id, slug] of Object.entries(ARTICLE_SLUG_MAP)) {
  SLUG_TO_ID[slug] = id;
}

/**
 * Resolve an article slug or ID to a mock article from the full list.
 * Falls back gracefully if mockArticles is empty or not yet loaded.
 */
export function findMockArticleBySlug(
  allMockArticles: Article[] | undefined | null,
  slugOrId: string
): Article | null {
  if (!slugOrId) return null;
  if (!allMockArticles || !Array.isArray(allMockArticles) || allMockArticles.length === 0) return null;

  // Direct lookup by slug
  const bySlug = allMockArticles.find((a) => a?.slug === slugOrId);
  if (bySlug) return bySlug;

  // Direct lookup by id
  const byId = allMockArticles.find((a) => a?.id === slugOrId);
  if (byId) return byId;

  // Try reverse mapping: slug → id → find in array
  const mappedId = SLUG_TO_ID[slugOrId];
  if (mappedId) {
    const byMappedId = allMockArticles.find((a) => a?.id === mappedId);
    if (byMappedId) return byMappedId;
  }

  // Try slugOrId as an id → find its slug → search array
  const mappedSlug = ARTICLE_SLUG_MAP[slugOrId];
  if (mappedSlug) {
    const byMappedSlug = allMockArticles.find((a) => a?.slug === mappedSlug);
    if (byMappedSlug) return byMappedSlug;
  }

  return null;
}

export function filterMockByNiche(
  allMockArticles: Article[] | undefined | null,
  niche: string
): Article[] {
  if (!allMockArticles || !Array.isArray(allMockArticles)) return [];
  return allMockArticles.filter((a) => a?.niche === niche);
}
