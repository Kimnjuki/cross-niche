/**
 * Sample AI/ML updates for nexus-002 (AI-Pulse Roadmap).
 * Replace with Convex useQuery(api.aiUpdates.list, { category }) when frontend uses Convex.
 */

export type AICategory = 'productivity' | 'creative' | 'gaming_ai';

export interface MLBenchmark {
  name: string;
  score: number;
  unit?: string;
  source?: string;
}

export interface AIFeature {
  name: string;
  description: string;
  sector: 'gaming' | 'security' | 'productivity' | 'creative' | 'other';
  impact: 'high' | 'medium' | 'low';
}

export interface CompetitiveAnalysis {
  company: string;
  similarFeature?: string;
  differentiation?: string;
  gap?: string;
}

export interface AIUpdate {
  id: string;
  title: string;
  description: string;
  category: AICategory;
  publishedAt: number; // ms
  isHype: boolean;   // marketing fluff — dim when view = Hype
  hasBenchmarks: boolean; // confirmed ML benchmarks — highlight when view = Utility
  sourceUrl?: string;
  // Enhanced fields
  benchmarks?: MLBenchmark[];
  features?: AIFeature[];
  competitiveAnalysis?: CompetitiveAnalysis[];
  futurePrediction?: {
    timeframe: 'short' | 'medium' | 'long';
    prediction: string;
    confidence: 'high' | 'medium' | 'low';
    implications?: string[];
  };
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
    benchmarks: [
      { name: 'Task Completion Rate', score: 40, unit: '%', source: 'Independent Study' },
      { name: 'Code Quality Score', score: 7.2, unit: '/10', source: 'Peer Review' },
    ],
    features: [
      {
        name: 'Code Generation',
        description: 'Automated code generation from natural language prompts',
        sector: 'productivity',
        impact: 'high',
      },
      {
        name: 'Code Review',
        description: 'AI-powered code review and bug detection',
        sector: 'productivity',
        impact: 'medium',
      },
    ],
    competitiveAnalysis: [
      {
        company: 'GitHub Copilot',
        similarFeature: 'Code completion and generation',
        differentiation: 'Higher task completion rate, better context understanding',
        gap: 'Real-time collaboration features',
      },
      {
        company: 'Amazon CodeWhisperer',
        similarFeature: 'Code suggestions',
        differentiation: 'More accurate code generation, better security scanning',
        gap: 'Multi-language support',
      },
    ],
    futurePrediction: {
      timeframe: 'short',
      prediction: 'LLM coding assistants will reach 60% task completion within 6 months',
      confidence: 'high',
      implications: [
        'Increased developer productivity',
        'Reduced time to market for software projects',
        'Shift in developer skill requirements',
      ],
    },
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
    benchmarks: [
      { name: 'Human Preference Score', score: 78, unit: '%', source: 'Peer Review' },
      { name: 'Design Quality', score: 8.5, unit: '/10', source: 'Expert Panel' },
    ],
    features: [
      {
        name: 'Image Generation',
        description: 'High-quality image generation from text prompts',
        sector: 'creative',
        impact: 'high',
      },
      {
        name: 'Style Transfer',
        description: 'Apply artistic styles to generated images',
        sector: 'creative',
        impact: 'medium',
      },
    ],
    competitiveAnalysis: [
      {
        company: 'Midjourney',
        similarFeature: 'Text-to-image generation',
        differentiation: 'Better human preference scores, more consistent quality',
        gap: 'Community features and user engagement',
      },
    ],
    futurePrediction: {
      timeframe: 'medium',
      prediction: 'AI-generated images will become standard in commercial design workflows',
      confidence: 'high',
      implications: [
        'Reduced need for stock photography',
        'Faster design iteration cycles',
        'New creative roles focusing on AI art direction',
      ],
    },
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
    benchmarks: [
      { name: 'Dialogue Coherence', score: 85, unit: '%', source: 'Academic Study' },
      { name: 'Player Satisfaction', score: 7.8, unit: '/10', source: 'User Survey' },
    ],
    features: [
      {
        name: 'Dynamic Dialogue',
        description: 'NPCs generate context-aware dialogue based on player actions',
        sector: 'gaming',
        impact: 'high',
      },
      {
        name: 'Emotional Intelligence',
        description: 'NPCs respond with appropriate emotional context',
        sector: 'gaming',
        impact: 'medium',
      },
    ],
    competitiveAnalysis: [
      {
        company: 'OpenAI',
        similarFeature: 'Conversational AI',
        differentiation: 'Game-specific context understanding, better character consistency',
        gap: 'Real-time response generation',
      },
    ],
    futurePrediction: {
      timeframe: 'medium',
      prediction: 'NPCs will have fully dynamic, unscripted conversations with players',
      confidence: 'medium',
      implications: [
        'More immersive gaming experiences',
        'Reduced need for voice actors for minor characters',
        'Emergence of AI-driven storytelling',
      ],
    },
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
    benchmarks: [
      { name: 'Retrieval Accuracy', score: 92, unit: '%', source: 'Standardized Benchmark' },
      { name: 'Average Latency', score: 145, unit: 'ms', source: 'Performance Test' },
    ],
    features: [
      {
        name: 'Context Retrieval',
        description: 'Intelligent document and knowledge base retrieval for enhanced productivity',
        sector: 'productivity',
        impact: 'high',
      },
      {
        name: 'Real-time Query Processing',
        description: 'Low-latency query processing for instant information access',
        sector: 'productivity',
        impact: 'high',
      },
    ],
    competitiveAnalysis: [
      {
        company: 'Perplexity AI',
        similarFeature: 'RAG-based search and retrieval',
        differentiation: 'Better accuracy metrics, lower latency',
        gap: 'Multi-modal retrieval capabilities',
      },
    ],
    futurePrediction: {
      timeframe: 'short',
      prediction: 'RAG systems will become standard in enterprise knowledge management',
      confidence: 'high',
      implications: [
        'Improved employee productivity',
        'Reduced information silos',
        'Enhanced decision-making speed',
      ],
    },
  },
  {
    id: '8',
    title: 'Generative video: frame consistency metrics published',
    description: 'Research group releases metrics for temporal consistency in AI video; used by creative tools.',
    category: 'creative',
    publishedAt: now - 21 * day,
    isHype: false,
    hasBenchmarks: true,
    benchmarks: [
      { name: 'Frame Consistency', score: 88, unit: '%', source: 'Research Study' },
      { name: 'Temporal Coherence', score: 8.2, unit: '/10', source: 'Expert Evaluation' },
    ],
    features: [
      {
        name: 'Video Generation',
        description: 'High-quality video generation from text prompts with temporal consistency',
        sector: 'creative',
        impact: 'high',
      },
      {
        name: 'Style Transfer',
        description: 'Apply consistent artistic styles across video frames',
        sector: 'creative',
        impact: 'medium',
      },
    ],
    competitiveAnalysis: [
      {
        company: 'Runway ML',
        similarFeature: 'Text-to-video generation',
        differentiation: 'Superior frame consistency, better temporal coherence',
        gap: 'Real-time generation capabilities',
      },
    ],
    futurePrediction: {
      timeframe: 'medium',
      prediction: 'AI video generation will match professional production quality',
      confidence: 'medium',
      implications: [
        'Democratization of video content creation',
        'Reduced production costs',
        'New creative workflows',
      ],
    },
  },
  {
    id: '9',
    title: 'Procedural content generation: comparative study',
    description: 'Study comparing PCG quality and diversity across games; includes open benchmarks.',
    category: 'gaming_ai',
    publishedAt: now - 25 * day,
    isHype: false,
    hasBenchmarks: true,
    benchmarks: [
      { name: 'Content Diversity', score: 85, unit: '%', source: 'Comparative Study' },
      { name: 'Quality Score', score: 7.9, unit: '/10', source: 'Expert Panel' },
    ],
    features: [
      {
        name: 'Procedural Generation',
        description: 'AI-driven procedural content generation for infinite game worlds',
        sector: 'gaming',
        impact: 'high',
      },
      {
        name: 'Dynamic World Building',
        description: 'Real-time generation of game environments based on player actions',
        sector: 'gaming',
        impact: 'high',
      },
    ],
    competitiveAnalysis: [
      {
        company: 'No Man\'s Sky',
        similarFeature: 'Procedural universe generation',
        differentiation: 'Better quality metrics, more diverse content',
        gap: 'Player-driven content modification',
      },
    ],
    futurePrediction: {
      timeframe: 'long',
      prediction: 'Fully procedurally generated games will become mainstream',
      confidence: 'high',
      implications: [
        'Infinite replayability',
        'Reduced development costs',
        'Personalized gaming experiences',
      ],
    },
  },
  {
    id: '10',
    title: 'AI security threat detection: real-time anomaly detection benchmarks',
    description: 'Enterprise security AI systems achieve 95% threat detection accuracy with sub-100ms latency.',
    category: 'productivity',
    publishedAt: now - 30 * day,
    isHype: false,
    hasBenchmarks: true,
    benchmarks: [
      { name: 'Threat Detection Accuracy', score: 95, unit: '%', source: 'Enterprise Test' },
      { name: 'Detection Latency', score: 87, unit: 'ms', source: 'Performance Benchmark' },
      { name: 'False Positive Rate', score: 2.3, unit: '%', source: 'Security Audit' },
    ],
    features: [
      {
        name: 'Anomaly Detection',
        description: 'Real-time detection of security threats and anomalies using ML',
        sector: 'security',
        impact: 'high',
      },
      {
        name: 'Behavioral Analysis',
        description: 'AI-powered analysis of user and system behavior patterns',
        sector: 'security',
        impact: 'high',
      },
    ],
    competitiveAnalysis: [
      {
        company: 'Darktrace',
        similarFeature: 'AI-powered threat detection',
        differentiation: 'Lower latency, higher accuracy, reduced false positives',
        gap: 'Industry-specific threat models',
      },
      {
        company: 'CrowdStrike',
        similarFeature: 'Behavioral analysis and threat hunting',
        differentiation: 'Better real-time performance, improved accuracy',
        gap: 'Cloud-native deployment options',
      },
    ],
    futurePrediction: {
      timeframe: 'short',
      prediction: 'AI security systems will become standard in enterprise infrastructure',
      confidence: 'high',
      implications: [
        'Improved cybersecurity posture',
        'Reduced security incidents',
        'Automated threat response',
      ],
    },
  },
];
