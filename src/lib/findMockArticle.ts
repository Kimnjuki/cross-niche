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
const ARTICLE_SLUG_MAP: Record<string, string> = {
  // Tech
  'tech-1': 'apple-vision-pro-2-spatial-computing',
  'tech-2': 'nvidia-rtx-5090-benchmarks-leak-2x-performance',
  'tech-3': 'quantum-computing-milestone-google-error-correction',
  'tech-4': 'tesla-optimus-gen-3-humanoid-robots-mass-production',
  'tech-5': 'critical-zero-day-vulnerability-affects-millions-routers',
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
  'sec-6': 'steam-phishing-scams-account-protection-2026',
  'sec-7': 'nintendo-switch-2-launch-security-guide-2026',
  'sec-8': 'rust-programming-security-vulnerabilities-2026',
  // Gaming
  'game-1': 'elden-ring-dlc-shadow-erdtree-review',
  'game-2': 'best-gaming-pc-build-2026',
  'game-3': 'steam-deck-2-release-date-specs',
  'game-4': 'gta-6-trailer-analysis-release-date',
  'game-5': 'can-ai-become-the-ultimate-gaming-trainer-steam-game-improvement-eras',
  'game-6': 'voice-chat-moderation-gaming-toxicity-speech-recognition',
  'game-7': 'haarlem-lamestop-2026-beginners-guide-to-gaming',
  'game-8': 'ai-npcs-video-games-future-gaming-artificial-intelligence',
  // Security (additional)
  'sec-9': 'best-antivirus-gaming-pcs-2026-performance',
  'sec-10': 'gaming-router-security-guide-home-network-protection',
  'sec-11': 'building-secure-gaming-pc-2024',
  'sec-12': 'gaming-account-security-ultimate-protection-guide',
  // Gaming (additional)
  'game-9': 'mastering-competitive-fps-pro-player-techniques',
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
