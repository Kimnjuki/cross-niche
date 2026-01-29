/**
 * SEO Optimization Utilities
 * Based on SEO optimization guide for thegridnexus.com
 */

export interface TitleFormula {
  formula: string;
  example: string;
  useCase: string;
}

export interface MetaDescriptionFormula {
  formula: string;
  example: string;
  characterCount: number;
  useCase: string;
}

/**
 * Title Tag Optimization Formulas
 * Max length: 60 characters, Optimal: 50-60 characters
 */
export const titleFormulas = {
  keywordFirst: (keyword: string, benefit: string, brand: string = 'The Grid Nexus'): string => {
    const title = `${keyword} | ${benefit} | ${brand}`;
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  },
  
  numberDriven: (number: string, keyword: string, benefit: string, year: string = '2026', brand: string = 'The Grid Nexus'): string => {
    const title = `${number} ${keyword} ${benefit} (${year}) | ${brand}`;
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  },
  
  questionBased: (question: string, answerTease: string, brand: string = 'The Grid Nexus'): string => {
    const title = `${question}? ${answerTease} | ${brand}`;
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  },
  
  urgency: (keyword: string, action: string, benefit: string, brand: string = 'The Grid Nexus'): string => {
    const title = `${keyword}: ${action} - ${benefit} | ${brand}`;
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  },
  
  comparison: (itemA: string, itemB: string, winner: string, year: string = '2026', brand: string = 'The Grid Nexus'): string => {
    const title = `${itemA} vs ${itemB}: ${winner} (${year}) | ${brand}`;
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  }
};

/**
 * Meta Description Optimization Formulas
 * Max length: 160 characters, Optimal: 150-158 characters
 */
export const metaDescriptionFormulas = {
  problemSolutionCTA: (problem: string, solution: string, benefit: string, cta: string): string => {
    const desc = `${problem} ${solution}. ${benefit}. ${cta}`;
    return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
  },
  
  valueProposition: (actionVerb: string, keyword: string, benefit: string, additionalValue: string, cta: string): string => {
    const desc = `${actionVerb} ${keyword} ${benefit}. ${additionalValue}. ${cta}`;
    return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
  },
  
  newsBreaking: (breaking: string, keyword: string, details: string, cta: string): string => {
    const desc = `${breaking}: ${keyword}. ${details}. ${cta}`;
    return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
  },
  
  comparisonValue: (itemA: string, itemB: string, differentiator: string, expertOpinion: string, cta: string): string => {
    const desc = `Compare ${itemA} vs ${itemB}. ${differentiator}. ${expertOpinion}. ${cta}`;
    return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
  },
  
  listPreview: (number: string, keyword: string, topic: string, teaser: string, cta: string): string => {
    const desc = `Discover ${number} ${keyword} ${topic}. Including ${teaser}. ${cta}`;
    return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
  }
};

/**
 * Power words for titles and descriptions
 */
export const powerWords = {
  urgency: ['Now', 'Today', 'Critical', 'Breaking', 'Alert', 'Urgent', 'Latest', 'New'],
  value: ['Free', 'Guide', 'Complete', 'Ultimate', 'Essential', 'Proven', 'Expert', 'Professional'],
  curiosity: ['Secret', 'Hidden', 'Revealed', 'Unknown', 'Shocking', 'Surprising', 'Exclusive'],
  authority: ['Expert', 'Professional', 'Advanced', 'Master', 'Certified', 'Award-winning'],
  numbers: ['Top 10', '5 Ways', '7 Steps', '2026', 'Latest', 'New', 'Complete']
};

/**
 * Effective CTAs for meta descriptions
 */
export const effectiveCTAs = {
  informational: ['Learn more', 'Read the guide', 'Discover how', 'Get the details', 'Find out more'],
  urgency: ['Act now', 'Don\'t miss out', 'Limited time', 'Start today', 'Get started'],
  value: ['Free download', 'Try it free', 'Get your copy', 'Access now', 'Download guide'],
  engagement: ['Join the discussion', 'Share your thoughts', 'See what others say', 'Read reviews']
};

/**
 * Optimize title tag
 */
export function optimizeTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + '...';
}

/**
 * Optimize meta description
 */
export function optimizeMetaDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
}

/**
 * Generate SEO-friendly title for article
 */
export function generateArticleTitle(article: {
  title: string;
  niche?: string;
  isBreaking?: boolean;
  tags?: string[];
}): string {
  const { title, niche, isBreaking, tags } = article;
  const brand = 'The Grid Nexus';
  
  // Extract primary keyword from title or tags
  const primaryKeyword = tags?.[0] || niche || 'Tech News';
  
  if (isBreaking) {
    return titleFormulas.urgency('Breaking', primaryKeyword, title, brand);
  }
  
  // Check if title contains numbers
  const numberMatch = title.match(/\d+/);
  if (numberMatch) {
    return titleFormulas.numberDriven(numberMatch[0], primaryKeyword, title, '2026', brand);
  }
  
  // Default: keyword first formula
  return titleFormulas.keywordFirst(primaryKeyword, title, brand);
}

/**
 * Generate SEO-friendly meta description for article
 */
export function generateArticleMetaDescription(article: {
  excerpt: string;
  title: string;
  niche?: string;
  tags?: string[];
}): string {
  const { excerpt, title, niche, tags } = article;
  const primaryKeyword = tags?.[0] || niche || 'technology';
  const cta = effectiveCTAs.informational[0];
  
  // Use value proposition formula
  return metaDescriptionFormulas.valueProposition(
    'Discover',
    primaryKeyword,
    excerpt.substring(0, 60),
    `Expert insights on ${title.toLowerCase()}.`,
    cta
  );
}






