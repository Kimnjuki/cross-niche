/**
 * Article validation and auto-calculation utilities
 * Ensures data consistency for articles
 */

export interface ArticleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  calculatedFields: {
    wordCount?: number;
    readTime?: number;
    slug?: string;
  };
}

/**
 * Calculate word count from content
 */
export function calculateWordCount(content: string | null | undefined): number {
  if (!content) return 0;
  return content.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculate read time in minutes (average 200 words per minute)
 */
export function calculateReadTime(wordCount: number): number {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Validate and normalize article data
 */
export function validateArticle(article: any): ArticleValidationResult {
  const result: ArticleValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    calculatedFields: {},
  };

  // Validate required fields
  if (!article.title || article.title.trim().length === 0) {
    result.errors.push('Title is required');
    result.isValid = false;
  } else if (article.title.length < 10) {
    result.warnings.push('Title is too short (minimum 10 characters recommended)');
  } else if (article.title.length > 100) {
    result.warnings.push('Title is very long (maximum 100 characters recommended)');
  }

  if (!article.body && !article.excerpt && !article.summary) {
    result.errors.push('Article must have body, excerpt, or summary');
    result.isValid = false;
  }

  // Calculate word count
  const content = article.body || article.excerpt || article.summary || '';
  const wordCount = calculateWordCount(content);
  result.calculatedFields.wordCount = wordCount;

  if (wordCount < 500) {
    result.warnings.push('Article is short (minimum 500 words recommended for SEO)');
  }

  // Calculate read time
  result.calculatedFields.readTime = calculateReadTime(wordCount);

  // Validate slug
  if (!article.slug || article.slug.trim().length === 0) {
    if (article.title) {
      result.calculatedFields.slug = generateSlug(article.title);
      result.warnings.push(`Auto-generated slug: ${result.calculatedFields.slug}`);
    } else {
      result.errors.push('Slug is required');
      result.isValid = false;
    }
  }

  // Validate published_at format
  if (article.published_at) {
    const publishedDate = new Date(article.published_at);
    if (isNaN(publishedDate.getTime())) {
      result.errors.push('Invalid published_at date format');
      result.isValid = false;
    } else {
      // Ensure ISO 8601 format
      if (!article.published_at.includes('T') || !article.published_at.includes('Z')) {
        result.warnings.push('published_at should be in ISO 8601 format (e.g., 2026-01-26T20:00:00.000Z)');
      }
    }
  }

  // Validate tags
  if (!article.tags || (Array.isArray(article.tags) && article.tags.length === 0)) {
    result.warnings.push('No tags specified (tags improve discoverability)');
  } else if (typeof article.tags === 'string') {
    // Normalize comma-separated tags
    const tagsArray = article.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
    if (tagsArray.length === 0) {
      result.warnings.push('Tags string is empty after parsing');
    }
  }

  // Validate status
  if (article.status && article.status !== 'published' && article.status !== 'draft') {
    result.warnings.push(`Unusual status value: ${article.status} (expected 'published' or 'draft')`);
  }

  return result;
}

/**
 * Normalize article data with calculated fields
 */
export function normalizeArticle(article: any): any {
  const validation = validateArticle(article);
  
  const normalized = { ...article };
  
  // Apply calculated fields
  if (validation.calculatedFields.wordCount !== undefined) {
    normalized.word_count = validation.calculatedFields.wordCount;
  }
  
  if (validation.calculatedFields.readTime !== undefined) {
    normalized.read_time_minutes = validation.calculatedFields.readTime;
  }
  
  if (validation.calculatedFields.slug) {
    normalized.slug = validation.calculatedFields.slug;
  }
  
  // Normalize published_at to ISO 8601
  if (normalized.published_at) {
    const date = new Date(normalized.published_at);
    if (!isNaN(date.getTime())) {
      normalized.published_at = date.toISOString();
    }
  } else if (normalized.status === 'published') {
    // Auto-set published_at if publishing
    normalized.published_at = new Date().toISOString();
  }
  
  // Normalize tags to array
  if (normalized.tags) {
    if (typeof normalized.tags === 'string') {
      normalized.tags = normalized.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
    }
  } else {
    normalized.tags = [];
  }
  
  return normalized;
}



