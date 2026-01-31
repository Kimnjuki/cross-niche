/**
 * Hook for Nexus Intersection (nexus-004): 1 Tech + 1 Security + 1 Gaming, with common keyword.
 */

import { useMemo } from 'react';
import { useContentByNiche } from '@/hooks/useContent';
import { mapContentToArticle } from '@/lib/contentMapper';
import { findCommonKeyword } from '@/lib/nexus/nexusIntersection';
import type { Article } from '@/types';

const NICHE_NAMES = ['Tech', 'Security', 'Gaming'] as const;
const LIMIT = 5;

export interface NexusIntersectionResult {
  tech: Article | null;
  security: Article | null;
  gaming: Article | null;
  commonKeyword: string;
  isLoading: boolean;
  error: boolean;
}

export function useNexusIntersection(): NexusIntersectionResult {
  const techQuery = useContentByNiche('Tech', LIMIT);
  const securityQuery = useContentByNiche('Security', LIMIT);
  const gamingQuery = useContentByNiche('Gaming', LIMIT);

  const tech = useMemo(() => {
    const data = techQuery.data;
    if (!data || data.length === 0) return null;
    return mapContentToArticle(data[0]);
  }, [techQuery.data]);

  const security = useMemo(() => {
    const data = securityQuery.data;
    if (!data || data.length === 0) return null;
    return mapContentToArticle(data[0]);
  }, [securityQuery.data]);

  const gaming = useMemo(() => {
    const data = gamingQuery.data;
    if (!data || data.length === 0) return null;
    return mapContentToArticle(data[0]);
  }, [gamingQuery.data]);

  const articles = useMemo(() => [tech, security, gaming].filter(Boolean) as Article[], [tech, security, gaming]);
  const commonKeyword = useMemo(() => findCommonKeyword(articles), [articles]);

  const isLoading = techQuery.isLoading || securityQuery.isLoading || gamingQuery.isLoading;
  const error = techQuery.isError || securityQuery.isError || gamingQuery.isError;

  return {
    tech: tech ?? null,
    security: security ?? null,
    gaming: gaming ?? null,
    commonKeyword,
    isLoading,
    error: !!error,
  };
}
