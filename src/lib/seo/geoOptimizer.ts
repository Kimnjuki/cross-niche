/**
 * GEO (Generative Engine Optimization) Utilities
 * Optimizes content structure for AI search systems like Google AI Overviews,
 * Perplexity, and other LLM-based search engines.
 */

/**
 * Check if a heading is question-based (good for AI extraction)
 */
export function isQuestionHeading(heading: string): boolean {
  return /^(what|why|how|when|where|who|which|can|is|are|do|does)\s+/i.test(heading.trim());
}

/**
 * Score a heading for AI citation potential
 */
export function scoreHeadingForAI(heading: string): {
  score: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 50;

  if (isQuestionHeading(heading)) {
    score += 30;
  } else if (/^(the|a|an)\s+/i.test(heading.trim())) {
    score += 15;
  }

  if (/\d+/.test(heading)) {
    score += 10;
    suggestions.push('Numbers improve AI extraction');
  }

  if (heading.length > 20 && heading.length < 80) {
    score += 10;
  } else if (heading.length >= 80) {
    suggestions.push('Heading too long for AI snippets (keep under 80 chars)');
    score -= 10;
  }

  if (!isQuestionHeading(heading)) {
    suggestions.push('Consider rephrasing as a question for better AI citation');
  }

  return { score: Math.min(100, score), suggestions };
}

/**
 * Score an article section for AI Overview inclusion
 */
export function scoreSectionForAI(content: {
  heading: string;
  text: string;
  hasList?: boolean;
  hasTable?: boolean;
  wordCount?: number;
}): {
  score: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 0;

  const text = content.text.toLowerCase();
  const wordCount = content.wordCount ?? content.text.split(/\s+/).length;

  // Direct answer in first sentence
  if (text.includes(' is ') || text.includes(' are ')) {
    score += 20;
  }

  // Self-contained section
  if (wordCount >= 40 && wordCount <= 200) {
    score += 20;
  } else if (wordCount > 200) {
    suggestions.push('Section too long for AI snippets (aim for 40-200 words)');
  } else if (wordCount < 40) {
    suggestions.push('Section too short to be self-contained');
  }

  // Structured content
  if (content.hasList) score += 20;
  if (content.hasTable) score += 15;

  // Numbered items
  if (/\d+\.\s/.test(content.text)) {
    score += 10;
  }

  // Key terms
  if (text.includes('definition') || text.includes('means') || text.includes('refers to')) {
    score += 10;
  }

  // Question-based heading
  const headingScore = scoreHeadingForAI(content.heading);
  score += headingScore.score * 0.3;

  return {
    score: Math.min(100, score),
    suggestions: [...suggestions, ...headingScore.suggestions],
  };
}

/**
 * Generate AI-friendly meta summary for a page
 */
export function generateAISummary(page: {
  title: string;
  description: string;
  sections: Array<{ heading: string; summary: string }>;
}): string {
  const lines: string[] = [];

  lines.push(`${page.title}`);
  lines.push('');
  lines.push(page.description);
  lines.push('');

  for (const section of page.sections.slice(0, 5)) {
    lines.push(`- ${section.heading}: ${section.summary}`);
  }

  return lines.join('\n');
}

/**
 * Extract key facts from content for AI citation
 */
export function extractKeyFacts(content: string): string[] {
  const facts: string[] = [];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);

  // Look for sentences with key indicators
  const indicators = [
    /\d+%/,
    /\$\d+/,
    /\d+ (million|billion|thousand)/,
    /according to/,
    /study shows/,
    /research found/,
    /in \d{4}/,
    /percent/,
    /increase/,
    /decrease/,
  ];

  for (const sentence of sentences) {
    if (indicators.some(ind => ind.test(sentence))) {
      facts.push(sentence.trim());
    }
  }

  return facts.slice(0, 10);
}

/**
 * Generate comparison schema for commercial queries
 */
export function generateComparisonSchema(options: {
  itemA: string;
  itemB: string;
  category: string;
  prosA: string[];
  consA: string[];
  prosB: string[];
  consB: string[];
  verdict?: string;
}): object {
  return {
    '@type': 'ItemList',
    name: `${options.itemA} vs ${options.itemB}`,
    description: `Comparison of ${options.itemA} and ${options.itemB} in ${options.category}`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Product',
          name: options.itemA,
          description: options.category,
          positiveNotes: {
            '@type': 'ItemList',
            itemListElement: options.prosA.map((pro, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: pro,
            })),
          },
          negativeNotes: {
            '@type': 'ItemList',
            itemListElement: options.consA.map((con, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: con,
            })),
          },
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Product',
          name: options.itemB,
          description: options.category,
          positiveNotes: {
            '@type': 'ItemList',
            itemListElement: options.prosB.map((pro, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: pro,
            })),
          },
          negativeNotes: {
            '@type': 'ItemList',
            itemListElement: options.consB.map((con, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: con,
            })),
          },
        },
      },
    ],
  };
}

/**
 * Check content for GEO best practices
 */
export function auditGEO(content: {
  title: string;
  headings: string[];
  paragraphs: string[];
  hasFAQ?: boolean;
  hasComparisonTable?: boolean;
  hasLists?: boolean;
}): {
  score: number;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 0;

  // Title analysis
  if (content.title.length < 30) {
    issues.push('Title too short for AI snippets');
  } else {
    score += 20;
  }

  // Headings analysis
  const questionHeadings = content.headings.filter(isQuestionHeading);
  if (questionHeadings.length === 0) {
    issues.push('No question-based headings found');
    recommendations.push('Add H2/H3 headings phrased as questions');
  } else {
    score += 20;
  }

  // Self-contained sections
  let shortSections = 0;
  let longSections = 0;
  for (const para of content.paragraphs) {
    const words = para.split(/\s+/).length;
    if (words < 40) shortSections++;
    if (words > 200) longSections++;
  }

  if (shortSections > content.paragraphs.length * 0.5) {
    issues.push('Many sections too short to be self-contained');
    recommendations.push('Expand short sections to 40-200 words for better AI extraction');
  } else {
    score += 15;
  }

  if (longSections > 0) {
    issues.push('Some sections too long for AI snippets');
    recommendations.push('Split long sections into smaller subsections');
  } else {
    score += 15;
  }

  // Structured content
  if (content.hasFAQ) {
    score += 15;
  } else {
    recommendations.push('Add FAQ section for direct question answering');
  }

  if (content.hasLists) {
    score += 10;
  } else {
    recommendations.push('Use numbered/bulleted lists for structured data');
  }

  if (content.hasComparisonTable) {
    score += 5;
  }

  return {
    score: Math.min(100, score),
    issues,
    recommendations,
  };
}

/**
 * Generate "People Also Ask" style content
 */
export function generatePAAContent(mainQuestion: string, relatedQuestions: string[]): {
  question: string;
  answer: string;
  related: Array<{ question: string; answer: string }>;
} {
  return {
    question: mainQuestion,
    answer: '',
    related: relatedQuestions.map(q => ({ question: q, answer: '' })),
  };
}
