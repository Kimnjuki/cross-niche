/**
 * Gaming-related utilities for threat intelligence processing
 */

/**
 * Common gaming platforms and their variations
 */
export const GAMING_PLATFORMS = [
  'steam',
  'epic',
  'epic games',
  'epic games store',
  'riot',
  'riot games',
  'valorant',
  'league of legends',
  'lol',
  'blizzard',
  'battle.net',
  'world of warcraft',
  'wow',
  'overwatch',
  'diablo',
  'hearthstone',
  'ea',
  'electronic arts',
  'origin',
  'ea app',
  'fifa',
  'madden',
  'battlefield',
  'apex legends',
  'discord',
  'roblox',
  'nintendo',
  'switch',
  'nintendo switch',
  'playstation',
  'ps4',
  'ps5',
  'playstation 4',
  'playstation 5',
  'xbox',
  'xbox one',
  'xbox series x',
  'xbox series s',
  'microsoft',
  'windows',
  'pc',
  'mobile',
  'android',
  'ios',
  'ipad',
  'iphone'
];

/**
 * Common game-related terms that might indicate gaming relevance
 */
export const GAMING_KEYWORDS = [
  'game',
  'gaming',
  'steam',
  'epic',
  'riot',
  'blizzard',
  'ea',
  'electronic arts',
  'origin',
  'discord',
  'roblox',
  'nintendo',
  'playstation',
  'xbox',
  'console',
  'video game',
  'mobile game',
  'esports',
  'twitch',
  'streaming',
  'in-game',
  'microtransaction',
  'loot box',
  'skin',
  'mod',
  'modding',
  'cheat',
  'hack',
  'aimbot',
  'wallhack',
  'currency',
  'virtual currency',
  'gold',
  'credits',
  'points',
  'account',
  'stolen account',
  'hacked account',
  'phishing',
  'credential theft',
  'gift card',
  'cd key',
  'product key',
  'serial key',
  'dlc',
  'downloadable content',
  'expansion',
  'patch',
  'update',
  'anti-cheat',
  'vac',
  'punkbuster',
  'easy anti-cheat',
  'battleye'
];

/**
 * Check if text contains gaming-related content
 * @param text - Text to check (title, description, etc.)
 * @returns Object with gaming relevance info
 */
export function analyzeGamingRelevance(text: string) {
  if (!text) {
    return {
      isGamingRelated: false,
      confidence: 0,
      detectedPlatforms: [],
      matchedKeywords: []
    };
  }

  const lowerText = text.toLowerCase();
  const detectedPlatforms: string[] = [];
  const matchedKeywords: string[] = [];

  // Check for gaming platforms
  for (const platform of GAMING_PLATFORMS) {
    if (lowerText.includes(platform)) {
      detectedPlatforms.push(platform);
    }
  }

  // Check for gaming keywords
  for (const keyword of GAMING_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      matchedKeywords.push(keyword);
    }
  }

  // Calculate confidence score (0-100)
  // Base score from keyword matches, boosted by platform matches
  const keywordScore = Math.min(matchedKeywords.length * 10, 50); // Max 50 points from keywords
  const platformScore = Math.min(detectedPlatforms.length * 15, 50); // Max 50 points from platforms
  const confidence = Math.min(keywordScore + platformScore, 100);

  return {
    isGamingRelated: confidence >= 30, // Threshold for considering it gaming-related
    confidence,
    detectedProviders: [...new Set(detectedPlatforms)], // Remove duplicates
    detectedPlatforms: [...new Set(detectedPlatforms)], // Remove duplicates
    matchedKeywords: [...new Set(matchedKeywords)] // Remove duplicates
  };
}

/**
 * Calculate a gamer impact score based on various factors
 * @param cvssScore - CVSS score (0-10) or null
 * @param isGamingRelated - Whether the vulnerability is gaming-related
 * @param detectedPlatforms - Array of detected gaming platforms
 * @param affectedList - Array of affected systems/products
 * @returns Gamer impact score (0-100)
 */
export function calculateGamerImpactScore(
  cvssScore: number | null,
  isGamingRelated: boolean,
  detectedPlatforms: string[],
  affectedList: string[] = []
): number {
  if (!isGamingRelated) {
    return 0;
  }

  // Base score from CVSS (if available)
  let baseScore = 0;
  if (cvssScore !== null) {
    // Convert CVSS 0-10 scale to 0-50 scale
    baseScore = (cvssScore / 10) * 50;
  } else {
    // Default base score for gaming-related vulns without CVSS
    baseScore = 25;
  }

  // Platform bonus: more platforms = higher impact
  const platformBonus = Math.min(detectedPlatforms.length * 10, 30);

  // Affected systems bonus
  const affectedBonus = Math.min(affectedList.length * 5, 20);

  // Calculate final score
  let totalScore = baseScore + platformBonus + affectedBonus;

  // Ensure it's within 0-100 range
  return Math.max(0, Math.min(Math.round(totalScore), 100));
}

/**
 * Extract game slugs from text (simplified implementation)
 * In a real implementation, this would map to actual game slugs in your database
 * @param text - Text to extract game slugs from
 * @returns Array of potential game slugs
 */
export function extractGameSlugs(text: string): string[] {
  if (!text) return [];

  const lowerText = text.toLowerCase();
  const gameSlugs: string[] = [];

  // Common game names that might appear in CVEs
  const gameMap: Record<string, string> = {
    'fortnite': 'fortnite',
    'call of duty': 'call-of-duty',
    'cod': 'call-of-duty',
    'minecraft': 'minecraft',
    'among us': 'among-us',
    'valorant': 'valorant',
    'league of legends': 'league-of-legends',
    'lol': 'league-of-legends',
    'world of warcraft': 'world-of-warcraft',
    'wow': 'world-of-warcraft',
    'apex legends': 'apex-legends',
    'gta': 'grand-theft-auto',
    'grand theft auto': 'grand-theft-auto',
    'red dead': 'red-dead-redemption',
    'fifa': 'fifa',
    'madden': 'madden-nfl',
    'battlefield': 'battlefield',
    'sims': 'the-sims',
    'pokémon': 'pokemon',
    'pokemon': 'pokemon',
    'zelda': 'the-legend-of-zelda',
    'mario': 'super-mario',
    'animal crossing': 'animal-crossing',
    'pUBG': 'pubg',
    'playerunknown': 'pubg',
    'rocket league': 'rocket-league',
    'fall guys': 'fall-guys',
    'css': 'counter-strike',
    'counter strike': 'counter-strike',
    'csgo': 'counter-strike-global-offensive',
    'counter-strike: global offensive': 'counter-strike-global-offensive'
  };

  // Check for direct game name mentions
  for (const [gameName, slug] of Object.entries(gameMap)) {
    if (lowerText.includes(gameName)) {
      gameSlugs.push(slug);
    }
  }

  // Remove duplicates while preserving order
  return [...new Set(gameSlugs)];
}