import { useMemo } from 'react';
import { usePublishedContent } from './useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { Article } from '@/types';
import type { SearchFilters } from '@/components/search/SearchBar';

export function useSearch(query: string, filters: SearchFilters) {
  const { data: allContent, isLoading } = usePublishedContent(100);

  const results = useMemo(() => {
    if (!allContent) return [];

    let articles = mapContentToArticles(allContent);

    // Filter by query
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      articles = articles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        article.author.toLowerCase().includes(searchLower)
      );
    }

    // Filter by niches
    if (filters.niches.length > 0) {
      articles = articles.filter(article =>
        filters.niches.includes(article.niche)
      );
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const dateRanges = {
        today: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        year: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      };
      const cutoffDate = dateRanges[filters.dateRange];
      articles = articles.filter(article => {
        const articleDate = new Date(article.publishedAt);
        return articleDate >= cutoffDate;
      });
    }

    // Sort
    articles.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'popularity':
          // Assuming view count or similar metric - using readTime as proxy
          return (b.readTime || 0) - (a.readTime || 0);
        case 'relevance':
        default:
          // Simple relevance: articles with query in title rank higher
          if (query.trim()) {
            const aTitleMatch = a.title.toLowerCase().includes(query.toLowerCase());
            const bTitleMatch = b.title.toLowerCase().includes(query.toLowerCase());
            if (aTitleMatch && !bTitleMatch) return -1;
            if (!aTitleMatch && bTitleMatch) return 1;
          }
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });

    return articles;
  }, [allContent, query, filters]);

  return {
    results,
    isLoading,
    count: results.length,
  };
}



