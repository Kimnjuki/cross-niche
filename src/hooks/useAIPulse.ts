/**
 * Hook for AI-Pulse Roadmap (nexus-002): fetches from Convex aiUpdates, fallback to sample data.
 */

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { SAMPLE_AI_UPDATES } from '@/data/aiUpdates';
import type { AIUpdate, AICategory } from '@/data/aiUpdates';

function convexToAIUpdate(row: {
  _id: string;
  title: string;
  description: string;
  category: string;
  publishedAt: number;
  isHype: boolean;
  hasBenchmarks: boolean;
  sourceUrl?: string;
}): AIUpdate {
  return {
    id: row._id,
    title: row.title,
    description: row.description,
    category: row.category as AICategory,
    publishedAt: row.publishedAt,
    isHype: row.isHype,
    hasBenchmarks: row.hasBenchmarks,
    sourceUrl: row.sourceUrl,
  };
}

export function useAIPulse() {
  const isDisabled = useConvexDisabled();
  const rows = useQuery(api.aiUpdates.list, isDisabled ? 'skip' : { limit: 50 });

  const items: AIUpdate[] = isDisabled
    ? SAMPLE_AI_UPDATES
    : (rows ?? []).map(convexToAIUpdate);

  return {
    items: [...items].sort((a, b) => b.publishedAt - a.publishedAt),
    isLoading: !isDisabled && rows === undefined,
    isConvex: !isDisabled,
  };
}
