/**
 * Homepage v2 – Nexus Command Center layout.
 * Groups: Hero → Breaking ticker → Command Dashboard → Content sections
 *         → Intelligence sidebar layout → Feed → All articles
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ChevronRight, Search, TrendingUp, Shield, Users } from 'lucide-react';

import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { SEOHead } from '@/components/seo/SEOHead';
import { LandingPageTracker } from '@/components/analytics/LandingPageTracker';

// New v2 components
import { HeroCommandCenter } from '@/components/home/HeroCommandCenter';
import { CommandDashboard } from '@/components/home/CommandDashboard';
import { BreakingNewsTicker } from '@/components/home/BreakingNewsTicker';
import { BriefingsGrid } from '@/components/home/BriefingsGrid';
import { SpotlightStrip } from '@/components/home/SpotlightStrip';
import { GamingStrip } from '@/components/home/GamingStrip';
import { AIMiniStrip } from '@/components/home/AIMiniStrip';
import { SecurityRankWidget } from '@/components/home/SecurityRankWidget';
import { NexusTerminal } from '@/components/home/NexusTerminal';
import { NexusGuardWidget } from '@/components/home/NexusGuardWidget';
import { ThreatIntelWidget } from '@/components/home/ThreatIntelWidget';
import { SecurityAuditWidget } from '@/components/home/SecurityAuditWidget';
import { DenseListFeed } from '@/components/home/FeedLayouts';

// Existing components kept
import { ArticleCard } from '@/components/articles/ArticleCard';
import { EnhancedSearch } from '@/components/search/EnhancedSearch';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { Skeleton } from '@/components/ui/skeleton';
import { NewsFeed } from '@/components/news/NewsFeed';
import { SecurityToolsStrip } from '@/components/security/SecurityToolsStrip';

import { formatRelativeTime } from '@/lib/timeUtils';
import { mapContentToArticles } from '@/lib/contentMapper';
import { getPageMetadata } from '@/lib/seo/pageMetadata';
import {
  useAllPublishedContent,
  useLatestContent,
  useTrendingContent,
  useFeeds,
  useContentByFeed,
} from '@/hooks/useContent';
import type { Article } from '@/types';
import type { ContentItem } from '@/hooks/useContent';

const FEED_SLUGS = [
  { slug: 'innovate', label: 'Tech',     path: '/tech'     },
  { slug: 'secured',  label: 'Security', path: '/security' },
  { slug: 'play',     label: 'Gaming',   path: '/gaming'   },
];

function articleLink(article: Article | null | undefined): string {
  if (!article) return '/';
  return `/article/${article.slug ?? article.id ?? ''}`;
}

function safeArticleId(article: Article | null | undefined): string {
  return (article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? '';
}

export default function Index() {
  const navigate = useNavigate();

  const { data: allContent, isLoading: loadingPublished } = useAllPublishedContent(150);
  const { data: latest }    = useLatestContent(10);
  const { data: trending }  = useTrendingContent(6);
  const { data: feeds }     = useFeeds();
  const { data: techFeed }     = useContentByFeed('innovate', 4);
  const { data: securityFeed } = useContentByFeed('secured', 4);
  const { data: gamingFeed }   = useContentByFeed('play', 6);

  const hasPublishedData = Array.isArray(allContent) && allContent.length > 0;
  const articles: Article[] = hasPublishedData
    ? mapContentToArticles(allContent as ContentItem[])
    : [];

  const sortedArticles = [...articles].sort((a, b) => {
    const aTime = a.publishedAt != null ? new Date(a.publishedAt as string | number).getTime() : 0;
    const bTime = b.publishedAt != null ? new Date(b.publishedAt as string | number).getTime() : 0;
    return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
  });

  const trendingArticles: Article[] = Array.isArray(trending) && trending.length > 0
    ? mapContentToArticles(trending as ContentItem[])
    : sortedArticles.slice(0, 5);

  const techArticles: Article[] = Array.isArray(techFeed) && techFeed.length
    ? mapContentToArticles(techFeed as ContentItem[])
    : sortedArticles.filter((a) => a.niche === 'tech').slice(0, 4);

  const securityArticles: Article[] = Array.isArray(securityFeed) && securityFeed.length
    ? mapContentToArticles(securityFeed as ContentItem[])
    : sortedArticles.filter((a) => a.niche === 'security').slice(0, 4);

  const gamingArticles: Article[] = Array.isArray(gamingFeed) && gamingFeed.length
    ? mapContentToArticles(gamingFeed as ContentItem[])
    : sortedArticles.filter((a) => a.niche === 'gaming').slice(0, 6);

  const aiArticles: Article[] = sortedArticles.filter(
    (a) => a.niche === 'tech' || (a.tags ?? []).some((t) => /ai|machine|llm|gpt|ml/i.test(t))
  ).slice(0, 3);

  const breakingArticles = sortedArticles.filter((a) => a.impactLevel === 'high' || a.isBreaking);
  const isLoading = loadingPublished;
  const homeMeta = getPageMetadata('/');

  // Empty state
  if (!isLoading && sortedArticles.length === 0) {
    return (
      <Layout showPulseSidebar={false}>
        <SEO title={homeMeta.title} description={homeMeta.description} canonical="https://thegridnexus.com/" ogType="website" />
        <HeroCommandCenter />
        <CommandDashboard />
        <section className="container mx-auto px-4 py-16 max-w-7xl text-center">
          <p className="text-zinc-500 mb-8 font-mono text-sm">Content loading — check back shortly or explore below.</p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Link to="/security" className="px-4 py-2 border border-[#00F0FF] text-[#00F0FF] font-mono text-sm hover:bg-[rgba(0,240,255,0.08)]">Threat Intel</Link>
            <Link to="/gaming"   className="px-4 py-2 border border-[#FF007A] text-[#FF007A] font-mono text-sm hover:bg-[rgba(255,0,122,0.08)]">Game Security</Link>
            <Link to="/tech"     className="px-4 py-2 border border-[#39FF14] text-[#39FF14] font-mono text-sm hover:bg-[rgba(57,255,20,0.08)]">Tech</Link>
          </div>
          <SecurityToolsStrip className="max-w-2xl mx-auto text-left" />
        </section>
      </Layout>
    );
  }

  return (
    <Layout showPulseSidebar={false}>
      <LandingPageTracker pageType="homepage" articlesViewed={sortedArticles.length} />
      <SEO title={homeMeta.title} description={homeMeta.description} canonical="https://thegridnexus.com/" ogType="website" />
      <SEOHead
        title={homeMeta.title}
        description={homeMeta.description}
        keywords={['gaming cybersecurity', 'gaming security', 'threat intelligence', 'game security', 'gaming account security', 'cybersecurity news']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />

      {/* P1: Hero Command Center */}
      <HeroCommandCenter />

      {/* P4: Breaking news ticker */}
      <BreakingNewsTicker articles={breakingArticles.slice(0, 8)} />

      {/* P2: Command Dashboard */}
      <CommandDashboard />

      {/* P5: Latest Briefings (6-card grid) */}
      <BriefingsGrid articles={sortedArticles} title="Latest Briefings" />

      {/* P6: Security Spotlight */}
      {securityArticles.length > 0 && <SpotlightStrip articles={securityArticles} />}

      {/* P7: Gaming Strip */}
      {gamingArticles.length > 0 && <GamingStrip articles={gamingArticles} />}

      {/* P8: AI & Emerging Tech */}
      {aiArticles.length > 0 && <AIMiniStrip articles={aiArticles} />}

      {/* Intelligence sidebar layout: main feed + sidebar widgets */}
      <section className="bg-[#0A0A0B] border-b border-[#27272A] py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main: P10 dense list feed */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-xl text-white">More Stories</h2>
                <Link to="/explore" className="flex items-center gap-1 text-xs font-mono text-[#00F0FF] hover:text-[#00D4E6]">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : (
                <DenseListFeed articles={sortedArticles.slice(6, 16)} />
              )}

              {/* P9 Live Wire */}
              <div className="pt-6 border-t border-[#27272A]">
                <NewsFeed limit={6} title="Live Wire" showTitle />
              </div>
            </div>

            {/* Sidebar: P14, P15, P16, P12, P13, search, trending, newsletter */}
            <aside className="space-y-5">
              <NexusGuardWidget />
              <ThreatIntelWidget articles={securityArticles} />
              <SecurityAuditWidget />
              <SecurityRankWidget />
              <NexusTerminal />

              {/* Search */}
              <div className="bg-[#16161A] border border-[#27272A] p-4 space-y-3">
                <h3 className="font-mono text-xs text-zinc-600 uppercase tracking-wider flex items-center gap-2">
                  <Search className="h-3.5 w-3.5" /> Search
                </h3>
                <EnhancedSearch
                  placeholder="Search articles, topics..."
                  onSearch={(q) => { if (q.trim()) navigate(`/topics?q=${encodeURIComponent(q.trim())}`); }}
                />
                <nav className="space-y-0.5 pt-1">
                  {feeds?.length
                    ? feeds.slice(0, 6).map((feed) => (
                        <Link key={feed._id} to={FEED_SLUGS.find((f) => f.slug === feed.slug)?.path ?? `/topics?q=${encodeURIComponent(feed.name)}`}
                          className="block py-2 text-xs text-zinc-600 hover:text-white font-mono transition-colors">
                          {feed.name}
                        </Link>
                      ))
                    : FEED_SLUGS.map((f) => (
                        <Link key={f.slug} to={f.path} className="block py-2 text-xs text-zinc-600 hover:text-white font-mono transition-colors">
                          {f.label}
                        </Link>
                      ))}
                </nav>
              </div>

              {/* Trending */}
              <div className="bg-[#16161A] border border-[#27272A] p-4 space-y-3">
                <h3 className="font-mono text-xs text-zinc-600 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5" /> Trending
                </h3>
                <ul className="space-y-1">
                  {trendingArticles.slice(0, 5).map((article, i) => (
                    <li key={safeArticleId(article) || i}>
                      <Link to={articleLink(article)} className="flex gap-3 py-2 group text-xs">
                        <span className="text-zinc-700 font-mono w-4 shrink-0">{i + 1}</span>
                        <span className="line-clamp-2 text-zinc-400 group-hover:text-white transition-colors">{article.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div className="bg-[#16161A] border border-[#27272A] p-4 space-y-2">
                <h3 className="font-mono text-xs text-[#00F0FF] uppercase tracking-wider">Stay ahead</h3>
                <p className="text-xs text-zinc-600">Tech, security, and gaming intel — once a week.</p>
                <NewsletterForm variant="default" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Nexus Security Suite + Community Watch strip */}
      <section className="bg-[#0A0A0B] border-b border-[#27272A] py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Security Profile CTA */}
            <Link
              to="/security-profile"
              className="group flex items-start gap-4 p-5 rounded-xl border border-[#00F0FF]/20 bg-gradient-to-br from-[#00F0FF]/5 to-black hover:border-[#00F0FF]/40 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-[#00F0FF]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white">Nexus Security Profile</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">New</span>
                </div>
                <p className="text-xs text-gray-400">
                  Your unified AI-powered security posture — risk score, top threats, game copilot, and learning missions in one place.
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#00F0FF] group-hover:gap-2 transition-all">
                  Start my profile <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>

            {/* Community Watch CTA */}
            <Link
              to="/community-threats"
              className="group flex items-start gap-4 p-5 rounded-xl border border-[#FF007A]/20 bg-gradient-to-br from-[#FF007A]/5 to-black hover:border-[#FF007A]/40 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF007A]/10 border border-[#FF007A]/30 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#FF007A]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white">Community Watch</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF007A]/10 text-[#FF007A] border border-[#FF007A]/30">Live</span>
                </div>
                <p className="text-xs text-gray-400">
                  Crowd-sourced threat reports from gamers. Submit suspicious links, mods, or scams — upvote to triage emerging threats.
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#FF007A] group-hover:gap-2 transition-all">
                  View threat reports <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* All articles (Explore parity) */}
      {sortedArticles.length > 0 && (
        <section className="bg-[#0A0A0B] border-b border-[#27272A] py-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">All Articles</h2>
              <Link to="/explore" className="flex items-center gap-1 text-xs font-mono text-[#00F0FF] hover:text-[#00D4E6]">
                Explore all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedArticles.slice(0, 9).map((article, i) => (
                <ArticleCard key={safeArticleId(article) || i} article={article} variant="default" />
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link to="/explore" className="font-mono text-xs text-[#00F0FF] hover:text-[#00D4E6]">
                View full archive on Explore →
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
