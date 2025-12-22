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

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  preferences: Niche[];
}
