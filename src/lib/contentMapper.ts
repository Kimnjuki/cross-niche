import type { ContentItem } from '@/hooks/useContent';
import type { Article, Niche } from '@/types';

// Map Supabase content to Article type used by components
export function mapContentToArticle(content: ContentItem): Article {
  // Map feed_slug to niche type
  const nicheMap: Record<string, Niche> = {
    'secured': 'security',
    'innovate': 'tech',
    'play': 'gaming',
    'guides-tools': 'tech',
  };

  const niche = nicheMap[content.feed_slug || ''] || 'tech';

  return {
    id: content.id || '',
    title: content.title || '',
    excerpt: content.excerpt || content.summary || '',
    content: content.body || '',
    niche,
    author: content.author_name || 'Anonymous',
    publishedAt: content.published_at || new Date().toISOString(),
    readTime: content.read_time_minutes || 5,
    imageUrl: content.featured_image_url || '/placeholder.svg',
    tags: content.tags || [],
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
