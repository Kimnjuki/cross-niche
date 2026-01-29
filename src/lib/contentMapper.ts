import type { ContentItem } from '@/hooks/useContent';
import type { Article, Niche } from '@/types';

// Map Supabase content to Article type used by components
export function mapContentToArticle(content: ContentItem): Article {
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

  return {
    id: content.id || '',
    title: content.title || 'Untitled',
    excerpt,
    content: body,
    niche,
    author,
    publishedAt: content.published_at || new Date().toISOString(),
    readTime: content.read_time_minutes || 5,
    imageUrl: content.featured_image_url || '/placeholder.svg',
    // Ensure imageUrl is always a valid URL for SEO
    // If it's a relative path, it will be resolved by the browser
    tags,
    isSponsored: false,
    isFeatured: content.is_featured || false,
    securityScore: content.security_score || undefined,
    impactLevel: content.is_breaking ? 'high' : undefined,
  };
}

// Map array of content items
export function mapContentToArticles(content: ContentItem[]): Article[] {
  return content.map(mapContentToArticle);
}
