export type Niche = 'tech' | 'security' | 'gaming';

export interface Article {
  id: string;
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

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  likes: number;
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
