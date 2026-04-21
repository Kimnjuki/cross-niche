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
 * Optimize title tag (50–60 chars ideal, 75 hard max)
 * Truncates at a word boundary to avoid mid-word clips.
 */
export function optimizeTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title;
  const cut = title.lastIndexOf(' ', maxLength - 1);
  const pos = cut > maxLength * 0.6 ? cut : maxLength - 1;
  return title.substring(0, pos).replace(/[,\s]+$/, '') + '\u2026';
}

/**
 * Optimize meta description (140–158 chars ideal, 160 hard max)
 * Truncates at a sentence or word boundary.
 */
export function optimizeMetaDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  // Try to break at sentence end
  const sentenceEnd = description.lastIndexOf('. ', maxLength - 1);
  if (sentenceEnd > maxLength * 0.7) return description.substring(0, sentenceEnd + 1);
  const wordEnd = description.lastIndexOf(' ', maxLength - 1);
  const pos = wordEnd > maxLength * 0.7 ? wordEnd : maxLength - 1;
  return description.substring(0, pos).replace(/[,\s]+$/, '') + '\u2026';
}

/** Current year for freshness signals (CTR boost) */
const CURRENT_YEAR = new Date().getFullYear().toString();

/**
 * Append CTR-boost modifiers to title: [Bracket], (Year).
 * Spec: "Incorporate {Year}, {Numbers}, and {Sentiment} into all Meta Titles"
 */
function appendCTRModifier(base: string, article: {
  title: string;
  niche?: string;
  tags?: string[];
}): string {
  const { title, niche, tags } = article;
  const t = title.toLowerCase();
  const allTags = (tags ?? []).map((x) => x.toLowerCase()).join(' ');

  let modifier = '';
  if (t.includes('guide') || t.includes('how to') || t.includes('tutorial') || allTags.includes('guide')) {
    modifier = ' [Guide]';
  } else if (t.includes('review') || t.includes(' vs ') || allTags.includes('review')) {
    modifier = ` [${CURRENT_YEAR} Review]`;
  } else if (t.includes('breaking') || t.includes('alert') || allTags.includes('breaking')) {
    modifier = ' [Breaking]';
  } else if (niche === 'security' && (t.includes('vulnerability') || t.includes('breach') || t.includes('zero-day'))) {
    modifier = ' [Security Alert]';
  } else if (t.includes('best') || t.includes('top ') || /\d+ best|\d+ top/i.test(t)) {
    modifier = ` [${CURRENT_YEAR}]`;
  } else {
    modifier = ` (${CURRENT_YEAR} Update)`;
  }

  const sep = base.lastIndexOf(' | ');
  if (sep > 0) {
    const beforeBrand = base.slice(0, sep);
    const brandPart = base.slice(sep);
    return beforeBrand + modifier + brandPart;
  }
  return base + modifier;
}

/**
 * Generate SEO-friendly title for article (with dynamic CTR modifiers)
 */
export function generateArticleTitle(article: {
  title: string;
  niche?: string;
  isBreaking?: boolean;
  tags?: string[];
  contentType?: string;
}): string {
  const { title, niche, isBreaking, tags } = article;
  const brand = 'The Grid Nexus';
  const primaryKeyword = tags?.[0] || (niche === 'tech' ? 'Tech' : niche === 'security' ? 'Security' : 'Gaming') || 'Tech News';

  let base: string;
  if (isBreaking) {
    base = `Breaking: ${title} | ${brand}`;
  } else {
    const numberMatch = title.match(/\d+/);
    if (numberMatch) {
      base = `${title} | ${brand}`;
    } else {
      base = `${primaryKeyword}: ${title} | ${brand}`;
    }
  }

  const withModifier = appendCTRModifier(base, article);
  return optimizeTitle(withModifier, 60);
}

/**
 * Generate SEO-friendly meta description for article.
 * Prioritises the article excerpt (most unique signal) and appends
 * a niche-aware CTA. Produces 140-158 chars of unique, descriptive copy.
 */
export function generateArticleMetaDescription(article: {
  excerpt: string;
  title: string;
  niche?: string;
  tags?: string[];
}): string {
  const { excerpt, niche } = article;

  // Use the excerpt as primary signal if it's substantive
  const clean = (excerpt || '').trim().replace(/\s+/g, ' ');
  if (clean.length >= 100) {
    return optimizeMetaDescription(clean, 158);
  }

  // Fallback: build from excerpt + niche CTA
  const nicheLabel =
    niche === 'security' ? 'cybersecurity'
    : niche === 'gaming' ? 'gaming'
    : 'technology';
  const cta = `Read the full analysis on ${nicheLabel} at The Grid Nexus.`;
  const combined = clean ? `${clean} ${cta}` : cta;
  return optimizeMetaDescription(combined, 158);
}






