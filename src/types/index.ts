export type Niche = 'tech' | 'security' | 'gaming';

export interface Article {
  id: string;
  /** Convex document _id when content comes from Convex (same as id when mapped) */
  _id?: string;
  slug?: string; // For SEO-friendly URLs; use in links when available
  title: string;
  excerpt: string;
  content: string;
  niche: Niche;
  author: string;
  publishedAt: string;
  readTime: number;
  imageUrl: string;
  tags: string[];
  isSponsored?: boolean;
  isFeatured?: boolean;
  securityScore?: number; // For gaming articles
  impactLevel?: 'high' | 'medium' | 'low'; // For security articles
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  niche: Niche;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  platform: string[];
  steps: string[];
  tools?: Tool[];
  publishedAt: string;
  readTime: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  isAffiliate: boolean;
  niche: Niche;
  imageUrl?: string;
}

export type CommentSortType = 'best' | 'newest' | 'oldest' | 'controversial';

export type CommentReactionType = 'like' | 'love' | 'laugh' | 'angry' | 'sad' | 'surprise';

export interface CommentReaction {
  userId: string;
  type: CommentReactionType;
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  dislikes: number;
  score: number; // Calculated score for ranking
  isEdited: boolean;
  isDeleted: boolean;
  parentId?: string; // For threaded comments
  replies: string[]; // Array of reply comment IDs
  reactions: CommentReaction[];
  isReported: boolean;
  reportCount: number;
  isModerated: boolean;
  moderationReason?: string;
  userReputation?: number;
  isVerified?: boolean;
  isExpert?: boolean;
}

export interface CommentThread {
  rootComment: Comment;
  replies: Comment[];
  depth: number;
  totalReplies: number;
}

export interface UserCommentStats {
  userId: string;
  totalComments: number;
  likesReceived: number;
  reputation: number;
  isVerified: boolean;
  isExpert: boolean;
  badges: string[];
}

export interface ModerationAction {
  id: string;
  commentId: string;
  moderatorId: string;
  action: 'approve' | 'reject' | 'delete' | 'ban_user' | 'shadow_ban';
  reason: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bookmarks: string[];
  createdAt: string;
}

export type NewsletterFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly';

export type NewsletterType = 'daily-digest' | 'weekly-deep-dive' | 'topic-specific' | 'breaking-news';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  preferences: Niche[];
  frequency: NewsletterFrequency;
  newsletterTypes: NewsletterType[];
  topicSubscriptions: string[]; // Specific topics like 'AI & Machine Learning', 'Cybersecurity', etc.
  isActive: boolean;
  lastSentAt?: string;
  unsubscribedTopics?: string[]; // Topics user has unsubscribed from
}

export interface NewsletterTemplate {
  id: string;
  type: NewsletterType;
  title: string;
  description: string;
  sampleContent: string;
  previewImage?: string;
}

export interface UserBehavior {
  id: string;
  userId: string;
  articleId: string;
  action: 'view' | 'read' | 'bookmark' | 'share' | 'like' | 'comment';
  timestamp: string;
  timeSpent?: number; // in seconds
  scrollDepth?: number; // percentage
  niche?: Niche;
  tags?: string[];
}

export interface ContentRecommendation {
  articleId: string;
  score: number; // 0-1 relevance score
  reason: 'behavior' | 'collaborative' | 'semantic' | 'trending';
  confidence: number; // 0-1 confidence level
}

export interface PersonalizedFeed {
  userId: string;
  recommendations: ContentRecommendation[];
  lastUpdated: string;
  preferences: {
    niches: Niche[];
    topics: string[];
    difficulty: ('beginner' | 'intermediate' | 'advanced')[];
    maxReadTime?: number;
  };
}

export interface ReadingPrediction {
  articleId: string;
  predictedTime: number; // in minutes
  factors: {
    wordCount: number;
    complexity: number; // 0-1
    images: number;
    niche: Niche;
  };
}

export interface SemanticSimilarity {
  sourceArticleId: string;
  targetArticleId: string;
  similarity: number; // 0-1 cosine similarity
  commonTags: string[];
  commonEntities: string[];
}

export interface ProductReview {
  id: string;
  productName: string;
  tagline: string;
  category: string; // 'GPU', 'CPU', 'Gaming Laptop', 'Monitor', etc.
  brand: string;
  model: string;
  price: number;
  currency: string;
  images: string[];
  scores: {
    overall: number; // 0-10
    performance: number; // 0-10
    value: number; // 0-10
    design: number; // 0-10
    features?: number; // 0-10
    build?: number; // 0-10
  };
  verdict: 'recommended' | 'mixed' | 'not-recommended';
  summary: string;
  pros: string[];
  cons: string[];
  keySpecs: Array<{
    label: string;
    value: string;
  }>;
  reviewer: {
    id: string;
    name: string;
    avatar?: string;
    credibility: number; // 0-100
    reviewCount: number;
  };
  reviewerCount: number;
  helpful: {
    upvotes: number;
    downvotes: number;
  };
  publishDate: string;
  lastUpdated?: string;
  affiliateLinks?: Array<{
    retailer: string;
    url: string;
    price: number;
  }>;
  relatedProducts?: string[]; // Product IDs
  tags: string[];
}

export interface GameReview {
  id: string;
  gameTitle: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  platforms: string[];
  genre: string[];
  images: string[];
  videos: Array<{
    title: string;
    url: string;
    thumbnail: string;
    duration: number;
  }>;
  scores: {
    overall: number; // 0-10
    gameplay: number; // 0-10
    graphics: number; // 0-10
    sound: number; // 0-10
    story?: number; // 0-10
    value?: number; // 0-10
  };
  verdict: 'must-play' | 'recommended' | 'mixed' | 'avoid';
  summary: string;
  pros: string[];
  cons: string[];
  reviewer: {
    id: string;
    name: string;
    avatar?: string;
    credibility: number;
    reviewCount: number;
  };
  userScore?: number; // Average user rating
  userReviewCount?: number;
  publishDate: string;
  lastUpdated?: string;
  metacriticScore?: number;
  steamScore?: number;
  tags: string[];
}

export interface ThreatReport {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  threatType: 'malware' | 'ransomware' | 'phishing' | 'ddos' | 'data-breach' | 'vulnerability' | 'insider-threat';
  affectedSystems: string[];
  affectedIndustries: string[];
  description: string;
  technicalDetails: string;
  impact: {
    financial: number; // Estimated cost in millions
    operational: string; // Description of operational impact
    reputation: string; // Brand/reputation impact
  };
  mitigation: string[];
  indicators: Array<{
    type: 'ip' | 'domain' | 'hash' | 'email' | 'file';
    value: string;
    description: string;
  }>;
  attribution?: string; // Suspected attacker group
  firstSeen: string;
  lastSeen: string;
  status: 'active' | 'contained' | 'resolved';
  confidence: number; // 0-100
  sources: Array<{
    name: string;
    url: string;
    date: string;
  }>;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
}

export interface VulnerabilityReport {
  id: string;
  cve: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvssScore: number;
  affectedProducts: Array<{
    vendor: string;
    product: string;
    versions: string;
  }>;
  description: string;
  exploitability: string;
  impact: string;
  remediation: string;
  proofOfConcept?: string;
  references: Array<{
    type: 'vendor' | 'security' | 'exploit' | 'mitigation';
    title: string;
    url: string;
  }>;
  publishedAt: string;
  updatedAt?: string;
  status: 'unpatched' | 'patched' | 'disputed' | 'rejected';
  tags: string[];
}

export interface StartupProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  founded: string;
  headquarters: string;
  industry: string[];
  stage: 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth' | 'ipo' | 'acquired';
  funding: {
    totalRaised: number;
    currency: string;
    lastRound: {
      amount: number;
      date: string;
      round: string;
      investors: string[];
    };
    valuation?: number;
  };
  team: Array<{
    name: string;
    role: string;
    linkedin?: string;
    experience: string;
  }>;
  metrics: {
    employees: number;
    revenue?: number;
    growth?: number;
    customers?: number;
  };
  website: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    crunchbase?: string;
  };
  logo: string;
  images: string[];
  tags: string[];
  lastUpdated: string;
}
