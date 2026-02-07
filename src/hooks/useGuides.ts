/**
 * Hook for fetching guides from Convex.
 */

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { mockGuides } from '@/data/mockData';
import type { Guide } from '@/types';

function convexToGuide(row: {
  _id: string;
  title: string;
  slug: string;
  description: string;
  nicheId: number;
  difficulty: string;
  platform: string[];
  steps: string[];
  readTime: number;
  publishedAt: number;
  featuredImageUrl?: string;
}): Guide {
  const nicheMap: Record<number, 'tech' | 'security' | 'gaming'> = {
    1: 'tech',
    2: 'security',
    3: 'gaming',
  };

  return {
    id: row._id,
    title: row.title,
    description: row.description,
    niche: nicheMap[row.nicheId] || 'tech',
    difficulty: row.difficulty as 'beginner' | 'intermediate' | 'advanced',
    platform: row.platform,
    steps: row.steps,
    publishedAt: new Date(row.publishedAt).toISOString().split('T')[0],
    readTime: row.readTime,
  };
}

export function useGuides(nicheId?: number, difficulty?: string) {
  const isDisabled = useConvexDisabled();
  const rows = useQuery(
    api.guides.list,
    isDisabled ? 'skip' : { nicheId, difficulty, limit: 50 }
  );

  const guides: Guide[] = isDisabled
    ? mockGuides.filter(
        (g) =>
          (!nicheId || (nicheId === 1 && g.niche === 'tech') || (nicheId === 2 && g.niche === 'security') || (nicheId === 3 && g.niche === 'gaming')) &&
          (!difficulty || g.difficulty === difficulty)
      )
    : (rows ?? []).map(convexToGuide);

  return {
    guides,
    isLoading: !isDisabled && rows === undefined,
    isConvex: !isDisabled,
  };
}

export function useGuide(slug: string) {
  const isDisabled = useConvexDisabled();
  const row = useQuery(api.guides.getBySlug, isDisabled ? 'skip' : { slug });

  const guide: Guide | null = isDisabled
    ? mockGuides.find((g) => g.id === slug) || null
    : row
    ? convexToGuide(row as any)
    : null;

  return {
    guide,
    isLoading: !isDisabled && row === undefined,
    isConvex: !isDisabled,
  };
}
