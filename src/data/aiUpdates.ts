/**
 * Sample AI/ML updates for nexus-002 (AI-Pulse Roadmap).
 * Replace with Convex useQuery(api.aiUpdates.list, { category }) when frontend uses Convex.
 */

export type AICategory = 'productivity' | 'creative' | 'gaming_ai';

export interface AIUpdate {
  id: string;
  title: string;
  description: string;
  category: AICategory;
  publishedAt: number; // ms
  isHype: boolean;   // marketing fluff — dim when view = Hype
  hasBenchmarks: boolean; // confirmed ML benchmarks — highlight when view = Utility
  sourceUrl?: string;
}

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

export const SAMPLE_AI_UPDATES: AIUpdate[] = [
  {
    id: '1',
    title: 'LLM coding assistants hit 40% task completion in benchmarks',
    description: 'Independent study shows coding agents completing real dev tasks with measurable accuracy; benchmarks published.',
    category: 'productivity',
    publishedAt: now - 2 * day,
    isHype: false,
    hasBenchmarks: true,
  },
  {
    id: '2',
    title: 'New "AI-powered" IDE plugin announced',
    description: 'Vendor announces AI features with no disclosed benchmarks or evaluation methodology.',
    category: 'productivity',
    publishedAt: now - 5 * day,
    isHype: true,
    hasBenchmarks: false,
  },
  {
    id: '3',
    title: 'Image models surpass human preference on design tasks',
    description: 'Peer-reviewed benchmark: design quality and user preference scores for creative tools.',
    category: 'creative',
    publishedAt: now - 7 * day,
    isHype: false,
    hasBenchmarks: true,
  },
  {
    id: '4',
    title: 'AI art tool "revolutionary" launch',
    description: 'Marketing campaign for new creative tool; no third-party benchmarks available.',
    category: 'creative',
    publishedAt: now - 10 * day,
    isHype: true,
    hasBenchmarks: false,
  },
  {
    id: '5',
    title: 'NPC dialogue systems: benchmark suite for gaming AI',
    description: 'Academic benchmark for in-game dialogue coherence and player satisfaction; multiple games evaluated.',
    category: 'gaming_ai',
    publishedAt: now - 12 * day,
    isHype: false,
    hasBenchmarks: true,
  },
  {
    id: '6',
    title: 'Game studio announces "next-gen AI" for upcoming title',
    description: 'Press release with no technical details or performance metrics.',
    category: 'gaming_ai',
    publishedAt: now - 14 * day,
    isHype: true,
    hasBenchmarks: false,
  },
  {
    id: '7',
    title: 'RAG systems benchmark: retrieval accuracy vs latency',
    description: 'Standardized benchmark for retrieval-augmented productivity tools; results reproducible.',
    category: 'productivity',
    publishedAt: now - 18 * day,
    isHype: false,
    hasBenchmarks: true,
  },
  {
    id: '8',
    title: 'Generative video: frame consistency metrics published',
    description: 'Research group releases metrics for temporal consistency in AI video; used by creative tools.',
    category: 'creative',
    publishedAt: now - 21 * day,
    isHype: false,
    hasBenchmarks: true,
  },
  {
    id: '9',
    title: 'Procedural content generation: comparative study',
    description: 'Study comparing PCG quality and diversity across games; includes open benchmarks.',
    category: 'gaming_ai',
    publishedAt: now - 25 * day,
    isHype: false,
    hasBenchmarks: true,
  },
];
