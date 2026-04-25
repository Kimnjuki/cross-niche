import React from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { SectionWrapper } from '@/components/sections/SectionWrapper';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { TopicCard } from '@/components/cards/TopicCard';
import { NewsletterBlock } from '@/components/blocks/NewsletterBlock';

// Mock data for demonstration
const featuredArticle = {
  id: '1',
  title: 'Critical Zero-Day Vulnerability Discovered in Popular Gaming Launcher',
  excerpt: 'Security researchers have identified a remote code execution vulnerability affecting over 50 million users. Patch available now.',
  slug: 'critical-zero-day-gaming-launcher',
  category: 'security' as const,
  coverImage: '/assets/cyber.jpg',
  author: 'Security Team',
  publishedAt: '2 hours ago',
  readingTimeMinutes: 8,
  isFeatured: true
};

const articles = [
  {
    id: '2',
    title: 'Next-Gen GPU Architecture Details Leaked',
    excerpt: 'Early benchmark results show 40% performance improvement over current generation.',
    slug: 'next-gen-gpu-leak',
    category: 'tech' as const,
    coverImage: '/assets/tech.jpg',
    author: 'Hardware Desk',
    publishedAt: '4 hours ago',
    readingTimeMinutes: 5
  },
  {
    id: '3',
    title: 'Major Esports Organization Hit by Ransomware Attack',
    excerpt: 'Player data and scouting documents compromised in sophisticated attack.',
    slug: 'esports-ransomware-attack',
    category: 'gaming' as const,
    coverImage: '/assets/unsplash.jpg',
    author: 'Gaming Intel',
    publishedAt: '6 hours ago',
    readingTimeMinutes: 6
  },
  {
    id: '4',
    title: 'AI Model Trained on Security Threats Achieves 98% Detection Rate',
    excerpt: 'New machine learning system identifies zero-day exploits with unprecedented accuracy.',
    slug: 'ai-threat-detection',
    category: 'tech' as const,
    coverImage: '/assets/Ai.jpg',
    author: 'AI Research',
    publishedAt: '8 hours ago',
    readingTimeMinutes: 7
  },
  {
    id: '5',
    title: 'Game Engine Security Flaw Affects 200+ Titles',
    excerpt: 'Vulnerability allows server-side code execution across multiple platforms.',
    slug: 'game-engine-security-flaw',
    category: 'security' as const,
    coverImage: '/assets/motherboard.jpg',
    author: 'Threat Intel',
    publishedAt: '12 hours ago',
    readingTimeMinutes: 5
  }
];

const topics = [
  {
    id: '1',
    name: 'Threat Intelligence',
    slug: 'threat-intel',
    description: 'Real-time monitoring of global cybersecurity threats and vulnerabilities.',
    category: 'security' as const,
    articleCount: 342,
    lastActivityAt: '5 min ago'
  },
  {
    id: '2',
    name: 'Hardware Analysis',
    slug: 'hardware',
    description: 'Deep dives into CPU, GPU, and emerging semiconductor technologies.',
    category: 'tech' as const,
    articleCount: 218,
    lastActivityAt: '1 hour ago'
  },
  {
    id: '3',
    name: 'Esports Analytics',
    slug: 'esports',
    description: 'Competitive gaming statistics, team performance metrics, and tournament analysis.',
    category: 'gaming' as const,
    articleCount: 187,
    lastActivityAt: '3 hours ago'
  }
];

const stats = [
  { value: '2,400+', label: 'Intel Briefs' },
  { value: '180+', label: 'Topics Covered' },
  { value: '48hr', label: 'Avg Alert Speed' }
];

const ctas = [
  { label: 'Enter the Grid', variant: 'primary' as const },
  { label: 'Browse Topics', variant: 'secondary' as const }
];

export function Homepage() {
  return (
    <main>
      <HeroSection
        variant="homepage"
        eyebrow="INTELLIGENCE HUB"
        stats={stats}
        ctas={ctas}
      />

      <SectionWrapper
        title="Top Signals"
        eyebrow="FEATURED INTEL"
        ctaLabel="All Signals →"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2 md:row-span-2">
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>
          {articles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant={index < 2 ? 'default' : 'compact'}
            />
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        title="Trending Topics"
        eyebrow="FOCUS AREAS"
        ctaLabel="All Topics →"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </SectionWrapper>

      <div className="py-16">
        <div className="container-tokens">
          <NewsletterBlock variant="full" />
        </div>
      </div>
    </main>
  );
}