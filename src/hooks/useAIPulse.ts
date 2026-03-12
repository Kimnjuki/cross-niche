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
  benchmarks?: Array<{ name: string; score: number; unit?: string; source?: string }>;
  features?: Array<{ name: string; description: string; sector: string; impact: string }>;
  competitiveAnalysis?: Array<{ company: string; similarFeature?: string; differentiation?: string; gap?: string }>;
  futurePrediction?: { timeframe: string; prediction: string; confidence: string; implications?: string[] };
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
    benchmarks: row.benchmarks?.map(b => ({
      name: b.name,
      score: b.score,
      unit: b.unit,
      source: b.source,
    })),
    features: row.features?.map(f => ({
      name: f.name,
      description: f.description,
      sector: f.sector as AIUpdate['features'] extends Array<infer T> ? T['sector'] : never,
      impact: f.impact as 'high' | 'medium' | 'low',
    })),
    competitiveAnalysis: row.competitiveAnalysis?.map(c => ({
      company: c.company,
      similarFeature: c.similarFeature,
      differentiation: c.differentiation,
      gap: c.gap,
    })),
    futurePrediction: row.futurePrediction ? {
      timeframe: row.futurePrediction.timeframe as 'short' | 'medium' | 'long',
      prediction: row.futurePrediction.prediction,
      confidence: row.futurePrediction.confidence as 'high' | 'medium' | 'low',
      implications: row.futurePrediction.implications,
    } : undefined,
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
