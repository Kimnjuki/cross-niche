/**
 * Hook for Nexus Intersection (nexus-004): 1 Tech + 1 Security + 1 Gaming, with common keyword.
 */

import { useMemo } from 'react';
import { useContentByNiche } from '@/hooks/useContent';
import { mapContentToArticle } from '@/lib/contentMapper';
import { findCommonKeyword } from '@/lib/nexus/nexusIntersection';
import type { Article } from '@/types';

const NICHE_NAMES = ['Tech', 'Security', 'Gaming'] as const;
const LIMIT = 10; // Increased to allow filtering

export interface NexusIntersectionResult {
  tech: Article | null;
  security: Article | null;
  gaming: Article | null;
  commonKeyword: string;
  isLoading: boolean;
  error: boolean;
  allTech: Article[];
  allSecurity: Article[];
  allGaming: Article[];
}

function matchesKeyword(article: Article | null, keyword: string): boolean {
  if (!article || !keyword) return true;
  const kw = keyword.toLowerCase();
  return (
    article.title?.toLowerCase().includes(kw) ||
    article.excerpt?.toLowerCase().includes(kw) ||
    article.tags?.some(tag => tag.toLowerCase().includes(kw)) ||
    false
  );
}

export function useNexusIntersection(keyword?: string): NexusIntersectionResult {
  const techQuery = useContentByNiche('Tech', LIMIT);
  const securityQuery = useContentByNiche('Security', LIMIT);
  const gamingQuery = useContentByNiche('Gaming', LIMIT);

  const allTech = useMemo(() => {
    const data = techQuery.data;
    if (!data || data.length === 0) return [];
    return data.map(mapContentToArticle).filter(Boolean) as Article[];
  }, [techQuery.data]);

  const allSecurity = useMemo(() => {
    const data = securityQuery.data;
    if (!data || data.length === 0) return [];
    return data.map(mapContentToArticle).filter(Boolean) as Article[];
  }, [securityQuery.data]);

  const allGaming = useMemo(() => {
    const data = gamingQuery.data;
    if (!data || data.length === 0) return [];
    return data.map(mapContentToArticle).filter(Boolean) as Article[];
  }, [gamingQuery.data]);

  // Filter by keyword if provided
  const filteredTech = useMemo(() => {
    if (!keyword) return allTech;
    return allTech.filter(a => matchesKeyword(a, keyword));
  }, [allTech, keyword]);

  const filteredSecurity = useMemo(() => {
    if (!keyword) return allSecurity;
    return allSecurity.filter(a => matchesKeyword(a, keyword));
  }, [allSecurity, keyword]);

  const filteredGaming = useMemo(() => {
    if (!keyword) return allGaming;
    return allGaming.filter(a => matchesKeyword(a, keyword));
  }, [allGaming, keyword]);

  const tech = useMemo(() => {
    return filteredTech[0] ?? null;
  }, [filteredTech]);

  const security = useMemo(() => {
    return filteredSecurity[0] ?? null;
  }, [filteredSecurity]);

  const gaming = useMemo(() => {
    return filteredGaming[0] ?? null;
  }, [filteredGaming]);

  const articles = useMemo(() => [tech, security, gaming].filter(Boolean) as Article[], [tech, security, gaming]);
  const commonKeyword = useMemo(() => {
    if (keyword) return keyword;
    return findCommonKeyword(articles);
  }, [articles, keyword]);

  const isLoading = techQuery.isLoading || securityQuery.isLoading || gamingQuery.isLoading;
  const error = techQuery.isError || securityQuery.isError || gamingQuery.isError;

  return {
    tech: tech ?? null,
    security: security ?? null,
    gaming: gaming ?? null,
    commonKeyword,
    isLoading,
    error: !!error,
    allTech: filteredTech,
    allSecurity: filteredSecurity,
    allGaming: filteredGaming,
  };
}
