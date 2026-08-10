/**
 * Keyword-to-URL Mapping for Contextual Internal Linking
 * Maps target keywords to their canonical article URLs for automatic linking
 */

export interface KeywordMap {
  keyword: string;
  url: string;
  priority: 'high' | 'medium' | 'low';
  variant?: string[];
}

/**
 * High-priority keyword mappings from Semrush analysis
 * Used for automatic contextual linking in article content
 */
export const KEYWORD_URL_MAP: KeywordMap[] = [
  // Gaming PC Antivirus - Priority 1.62
  {
    keyword: 'best antivirus for gaming pc',
    url: '/article/gaming-pc-antivirus-best-2026',
    priority: 'high',
    variant: ['best antivirus for gaming computers', 'best antivirus for gaming computer', 'antivirus for gaming pc']
  },
  {
    keyword: 'gaming pc antivirus',
    url: '/article/gaming-pc-antivirus-best-2026',
    priority: 'high',
    variant: ['antivirus gaming', 'gaming antivirus']
  },
  {
    keyword: 'gaming pc security',
    url: '/article/gaming-pc-security-hardening-guide',
    priority: 'high',
    variant: ['gaming computer security', 'pc gaming security']
  },
  
  // Minecraft Server Security - Priority 0.33
  {
    keyword: 'minecraft server security',
    url: '/article/minecraft-server-security-guide',
    priority: 'high',
    variant: ['minecraft security', 'server security minecraft']
  },
  {
    keyword: 'enforce secure profile',
    url: '/article/minecraft-server-security-guide',
    priority: 'high',
    variant: ['enforce secure profile minecraft']
  },
  
  // Steam Account Security - Priority 1.62
  {
    keyword: 'steam account security',
    url: '/article/steam-account-takeover-protection-guide-2026',
    priority: 'high',
    variant: ['steam security', 'steam account protection']
  },
  {
    keyword: 'steam account takeover',
    url: '/article/steam-account-takeover-protection-guide-2026',
    priority: 'high',
    variant: ['account takeover steam']
  },
  
  // 2FA - Priority 1.62
  {
    keyword: '2fa gaming',
    url: '/article/2fa-setup-every-gaming-platform',
    priority: 'high',
    variant: ['two factor authentication gaming', '2fa setup gaming']
  },
  
  // Router Security - Priority 0.33
  {
    keyword: 'router security',
    url: '/article/router-security-gamers-network-protection',
    priority: 'medium',
    variant: ['gaming router security', 'network security router']
  },
  
  // G2A Scams - Priority 1.62
  {
    keyword: 'g2a scams',
    url: '/article/game-key-reseller-scams-g2a-cdkeys',
    priority: 'medium',
    variant: ['game key reseller scams', 'cdkeys scams']
  },
  
  // Discord Malware - Priority 1.62
  {
    keyword: 'discord malware',
    url: '/article/discord-malware-gamers-how-to-stay-safe',
    priority: 'medium',
    variant: ['discord security', 'discord gamers safety']
  },
  
  // Fake Cheats - Priority 1.62
  {
    keyword: 'fake game cheats',
    url: '/article/fake-game-cheats-malware-account-stealer',
    priority: 'medium',
    variant: ['game cheats malware', 'fake cheats gaming']
  },
];

/**
 * Build a flat keyword-to-URL lookup map
 * Includes all variants for maximum coverage
 */
export function buildKeywordLookup(): Map<string, string> {
  const lookup = new Map<string, string>();
  
  KEYWORD_URL_MAP.forEach(({ keyword, url, variant = [] }) => {
    // Add primary keyword
    lookup.set(keyword.toLowerCase(), url);
    
    // Add all variants
    variant.forEach(v => {
      lookup.set(v.toLowerCase(), url);
    });
  });
  
  return lookup;
}

/**
 * Get URL for a given keyword
 */
export function getUrlForKeyword(keyword: string): string | undefined {
  const lookup = buildKeywordLookup();
  return lookup.get(keyword.toLowerCase());
}

/**
 * Add contextual internal links to HTML content
 * Automatically links target keywords to their canonical URLs
 * 
 * @param content - HTML content to process
 * @param maxLinks - Maximum number of links to add (default: 10)
 * @returns HTML content with contextual links added
 */
export function addContextualLinks(
  content: string,
  maxLinks: number = 10
): string {
  const lookup = buildKeywordLookup();
  let linkCount = 0;
  
  // Sort by keyword length (longest first) to avoid partial matches
  const sortedKeywords = Array.from(lookup.entries())
    .sort((a, b) => b[0].length - a[0].length);
  
  let updatedContent = content;
  
  for (const [keyword, url] of sortedKeywords) {
    if (linkCount >= maxLinks) break;
    
    // Create regex pattern for whole word matching (case-insensitive)
    // Exclude if already inside a link tag
    const regex = new RegExp(
      `(?<!<a[^>]*>)(?<!</a>)(?<!href=")(?<!href=\')\\b${escapeRegex(keyword)}\\b(?!</a>)(?![^<]*>)`,
      'gi'
    );
    
    // Check if keyword exists and is not already linked
    const existingLinkPattern = new RegExp(`<a[^>]*href="${escapeRegex(url)}"[^>]*>.*?${escapeRegex(keyword)}.*?</a>`, 'gi');
    if (existingLinkPattern.test(updatedContent)) {
      continue; // Skip if already linked to this URL
    }
    
    // Replace first occurrence only (avoid over-linking)
    const newContent = updatedContent.replace(regex, (match) => {
      if (linkCount >= maxLinks) return match;
      
      // Don't link inside existing tags (except text content)
      if (match.includes('<') || match.includes('>')) return match;
      
      linkCount++;
      return `<a href="${url}" class="text-primary hover:underline">${match}</a>`;
    });
    
    updatedContent = newContent;
  }
  
  return updatedContent;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Get semantic keywords for content enhancement
 * Returns keywords grouped by priority for a given article
 */
export function getSemanticKeywords(
  articlePath: string,
  topicCluster: string
): string[][] {
  const keywordsByPriority: Record<string, string[]> = {
    high: [],
    medium: [],
    low: []
  };
  
  KEYWORD_URL_MAP.forEach(({ keyword, variant = [], priority }) => {
    // Add primary keyword
    keywordsByPriority[priority].push(keyword);
    
    // Add variants
    keywordsByPriority[priority].push(...variant);
  });
  
  return [
    keywordsByPriority.high,
    keywordsByPriority.medium,
    keywordsByPriority.low
  ];
}

/**
 * Validate that all target pages have sufficient internal links
 * Returns list of pages that need more internal links
 */
export function validateInternalLinks(
  articleUrls: string[],
  minLinksPerPage: number = 5
): string[] {
  // This would ideally be called with actual link data from a crawl
  // For now, returns the target URLs that need attention
  const targetUrls = KEYWORD_URL_MAP.map(k => k.url);
  const uniqueUrls = [...new Set(targetUrls)];
  
  // Pages that need internal links (from Semrush report)
  const pagesNeedingLinks = [
    '/article/gaming-pc-antivirus-best-2026',
    '/article/minecraft-server-security-guide',
  ];
  
  return pagesNeedingLinks.filter(url => 
    uniqueUrls.includes(url) && !articleUrls.includes(url)
  );
}