/**
 * Enhanced Homepage – GridNexus Design System Implementation
 * Technical precision meets visual boldness. Clean, fast, intelligent.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Shield, 
  Brain, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  Play,
  ChevronRight,
  Zap,
  Eye,
  MessageSquare,
  Share2,
  Bookmark,
  Cpu,
  Gamepad2,
  Lock,
  Wifi
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { AISummary } from '@/components/ai/AISummary';
import { SecurityScoreCalculator } from '@/components/security/SecurityScoreCalculator';
import { BreachSimulator } from '@/components/security/BreachSimulator';
import { LiveUpdates } from '@/components/live/LiveUpdates';
import { cn } from '@/lib/utils';
import { 
  usePublishedContent,
  useLatestContent,
  useTrendingContent,
  useFeeds,
  useContentByFeed
} from '@/hooks/useContent';
import { mockArticles } from '@/data/mockData';

// Define Article type based on ContentItem
interface Article {
  _id?: string;
  _creationTime: number;
  title: string;
  slug: string;
  body: string;
  summary?: string;
  subtitle?: string;
  publishedAt?: number;
  authorId?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isPremium?: boolean;
  securityScore?: number;
  contentType?: string;
  wordCount?: number;
  viewCount?: number;
  id?: string;
  niche?: string;
}

const FEED_SLUGS = [
  { slug: 'innovate', label: 'Tech', path: '/tech' },
  { slug: 'secured', label: 'Security', path: '/security' },
  { slug: 'play', label: 'Gaming', path: '/gaming' },
];

const NAVIGATION = FEED_SLUGS;

// Helper function to convert content items to articles
function mapContentToArticles(contentItems: any[]): Article[] {
  return contentItems.map((item: any) => ({
    _id: item._id,
    _creationTime: item._creationTime,
    title: item.title,
    slug: item.slug,
    body: item.body,
    summary: item.summary,
    subtitle: item.subtitle,
    publishedAt: item.publishedAt,
    authorId: item.authorId,
    isFeatured: item.isFeatured,
    isBreaking: item.isBreaking,
    isPremium: item.isPremium,
    securityScore: item.securityScore,
    contentType: item.contentType,
    wordCount: item.wordCount,
    viewCount: item.viewCount,
    id: item.id,
    niche: item.niche
  }));
}

function articleLink(article: Article | null | undefined): string {
  if (!article) return '/';
  return `/article/${article.slug ?? article.id ?? ''}`;
}

function safeArticleId(article: Article | null | undefined): string {
  return (article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? '';
}

/**
 * Homepage data checklist:
 * - Primary feed: all published/new articles (usePublishedContent) so all articles are visible.
 * - Sorted by publishedAt desc so newly added articles appear at the top.
 * - Breaking News: receives sortedArticles (newest first); component takes first maxItems.
 * - Hero/Slider (MasterBentoHero): topStory = sortedArticles[0] = newest article.
 * - Main feed list: mainFeed = sortedArticles.slice(1, 11) = next 10 newest.
 */
export default function Index() {
  const { data: published, isLoading: loadingPublished } = usePublishedContent(50);
  
  console.log('Published data:', published);
  console.log('Loading:', loadingPublished);
  
  if (loadingPublished) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Loading content...</h1>
      </div>
    );
  }
  
  if (!published || (published as any[]).length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>No content found</h1>
        <p>Run admin functions to populate content</p>
      </div>
    );
  }
  
  // Only call other hooks after early returns
  const { data: latest, isLoading: loadingLatest } = useLatestContent(20);
  const { data: trending, isLoading: loadingTrending } = useTrendingContent(12);
  const { data: feeds } = useFeeds();
  const { data: techFeed } = useContentByFeed('innovate', 10);
  const { data: securityFeed } = useContentByFeed('secured', 10);
  const { data: gamingFeed } = useContentByFeed('play', 10);
  
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>The Grid Nexus</h1>
      <p style={{ fontSize: '1.125rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
        Tech, Security & Gaming News | Expert Analysis
      </p>
      <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '2rem' }}>
        Breaking technology news, cybersecurity analysis, and gaming guides. AI insights, security intelligence, and tech coverage. Stay ahead of the curve.
      </p>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#f8fafc' }}>
          Latest Articles ({(published as any[])?.length || 0})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {(published as any[] || []).slice(0, 12).map((article) => (
            <div key={article._id || article.slug} style={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              padding: '1rem',
              backgroundColor: '#ffffff'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>
                {article.title}
              </h3>
              <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.875rem' }}>
                {article.summary || article.subtitle}
              </p>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {new Date(article.publishedAt).toLocaleDateString()} • {article.wordCount || 0} words
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <section aria-label="Explore sections" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#f8fafc' }}>
          Explore
        </h2>
        <ul style={{ listStyle: 'none', padding: '0', margin: '0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {NAVIGATION.map((nav) => (
            <li key={nav.slug}>
              <a href={nav.path} style={{ color: '#60a5fa', textDecoration: 'none' }}>
                {nav.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
