import type { ContentItem } from '@/hooks/useContent';
import type { Article, Niche } from '@/types';
import { getPlaceholderByNiche } from '@/lib/placeholderImages';

// Map Convex/database content to Article type used by components (returns null if content is falsy)
export function mapContentToArticle(content: ContentItem | null | undefined): Article | null {
  if (!content || typeof content !== 'object') return null;
  // Map database niche names to frontend niche types
  const databaseNicheToFrontend: Record<string, Niche> = {
    'Tech': 'tech',
    'Technology': 'tech',
    'Hardware': 'tech', // Hardware maps to tech niche
    'Security': 'security',
    'Cybersecurity': 'security',
    'Gaming': 'gaming',
    'Games': 'gaming',
  };
  
  // Map feed_slug to niche type (fallback)
  const feedSlugToNiche: Record<string, Niche> = {
    'secured': 'security',
    'innovate': 'tech',
    'play': 'gaming',
    'guides-tools': 'tech',
  };

  // Priority: Use database niches first, then fallback to feed_slug
  let niche: Niche = 'tech'; // Default
  
  // Check if content has niches array from database
  if (content.niches && Array.isArray(content.niches) && content.niches.length > 0) {
    // Use first niche from database, mapping to frontend type
    const dbNicheName = content.niches[0];
    niche = databaseNicheToFrontend[dbNicheName] || feedSlugToNiche[content.feed_slug || ''] || 'tech';
  } else {
    // Fallback to feed_slug mapping
    niche = feedSlugToNiche[content.feed_slug || ''] || 'tech';
  }

  // Handle tags - can be string, array, or null
  let tags: string[] = [];
  const tagsValue = content.tags as string[] | string | undefined;
  if (Array.isArray(tagsValue)) {
    tags = tagsValue;
  } else if (tagsValue && typeof tagsValue === 'string') {
    // Parse comma-separated tags
    tags = tagsValue.split(',').map(t => t.trim()).filter(t => t.length > 0);
  }

  // Handle author - check both author_name and author fields
  const author = (content as any).author_name || (content as any).author || 'Anonymous';

  // Handle excerpt/summary - create from title if missing
  const excerpt = content.excerpt || content.summary || 
    (content.title ? `${content.title.substring(0, 150)}...` : 'No description available');

  // Handle body - use excerpt as fallback if body is missing
  const body = content.body || content.excerpt || content.summary || '';

  const docId = content.id || (content as { _id?: string })._id || '';
  if (!docId) return null;
  const publishedAt =
    content.published_at ?? content.created_at ?? new Date().toISOString();
  return {
    id: docId,
    _id: docId, // Convex schema uses _id; expose for components that want to match Convex
    slug: content.slug || undefined,
    title: content.title || 'Untitled',
    excerpt,
    content: body,
    niche,
    author,
    publishedAt,
    readTime: content.read_time_minutes || 5,
    imageUrl: content.featured_image_url || getPlaceholderByNiche(niche, docId),
    tags,
    isSponsored: false,
    isFeatured: content.is_featured || false,
    securityScore: content.security_score || undefined,
    impactLevel: content.is_breaking ? 'high' : undefined,
  };
}

// Map array of content items (skips null/undefined input items and mapped nulls)
export function mapContentToArticles(content: ContentItem[] | null | undefined): Article[] {
  if (!content || !Array.isArray(content)) return [];
  return content
    .map((c) => mapContentToArticle(c))
    .filter((a): a is Article => a != null);
}

const nicheToFeedSlug: Record<string, string> = {
  tech: 'innovate',
  security: 'secured',
  gaming: 'play',
};

// Convert Article to ContentItem (for mock/demo when Convex is not configured; returns null if article is falsy)
export function articleToContentItem(article: Article | null | undefined): ContentItem | null {
  if (!article || typeof article !== 'object') return null;
  return {
    id: (article as Article & { _id?: string })?._id ?? article.id ?? '',
    title: article.title,
    slug: article.slug ?? article.id ?? '',
    body: article.content || null,
    excerpt: article.excerpt || null,
    summary: article.excerpt || null,
    status: 'published',
    published_at: article.publishedAt,
    created_at: article.publishedAt,
    updated_at: article.publishedAt,
    featured_image_url: article.imageUrl,
    read_time_minutes: article.readTime,
    is_featured: article.isFeatured ?? false,
    is_breaking: article.impactLevel === 'high',
    security_score: article.securityScore ?? null,
    content_type: 'article',
    author_id: null,
    author_name: article.author,
    feed_slug: nicheToFeedSlug[article.niche] || 'innovate',
    feed_name: article.niche === 'tech' ? 'Tech' : article.niche === 'security' ? 'Security' : 'Gaming',
    feed_id: null,
    niches: [article.niche === 'tech' ? 'Tech' : article.niche === 'security' ? 'Security' : 'Gaming'],
    tags: article.tags || [],
    view_count: 0,
  };
}

export function articlesToContentItems(articles: Article[] | null | undefined): ContentItem[] {
  if (!articles || !Array.isArray(articles)) return [];
  return articles
    .map(articleToContentItem)
    .filter((c): c is ContentItem => c != null);
}
