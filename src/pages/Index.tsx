/**
 * Homepage v2 – Nexus Command Center layout.
 * Groups: Hero → Breaking ticker → Command Dashboard → Content sections
 *         → Intelligence sidebar layout → Feed → All articles
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ChevronRight, Search, TrendingUp, Shield, ShieldCheck, Users, Gamepad2, Cpu, BookOpen, Activity, Radio, Swords, Target, Zap } from 'lucide-react';

import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { SEOHead } from '@/components/seo/SEOHead';
import { LandingPageTracker } from '@/components/analytics/LandingPageTracker';

// New v2 components
import { HeroCommandCenter } from '@/components/home/HeroCommandCenter';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
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
import { SecurityDashboard } from '@/components/security/SecurityDashboard';
import { DenseListFeed } from '@/components/home/FeedLayouts';

// Existing components kept
import { ArticleCard } from '@/components/articles/ArticleCard';
import { EnhancedSearch } from '@/components/search/EnhancedSearch';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { Skeleton } from '@/components/ui/skeleton';
import { NewsFeed } from '@/components/news/NewsFeed';
import { SecurityToolsStrip } from '@/components/security/SecurityToolsStrip';
import { InlineToolCTA, HeroToolWidget } from '@/components/security/InlineToolCTA';
import { Button } from '@/components/ui/button';

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
  const slug = article.slug ?? article.id ?? '';
  // Always use canonical /article/slug — old niche-prefix paths redirect via nginx
  return `/article/${slug}`;
}

function safeArticleId(article: Article | null | undefined): string {
  return (article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? '';
}

export default function Index() {
  // Onboarding: show flow on first visit
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    const completed = localStorage.getItem('onboardingCompleted');
    if (!completed) {
      setShowOnboarding(true);
    }
  }, []);
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
  // Show onboarding overlay on first visit
  if (showOnboarding) {
    return <OnboardingFlow onDismiss={() => setShowOnboarding(false)} />;
  }

  if (!isLoading && sortedArticles.length === 0) {
    return (
      <Layout showPulseSidebar={false}>
        <SEOHead
          title={homeMeta.title}
          description={homeMeta.description}
          url={typeof window !== 'undefined' ? window.location.href : ''}
          type="website"
        />
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

      {/* P6: Live Tools & Dashboards — MOVED UP for immediate tool discovery */}
      <section className="bg-[#0A0A0B] border-b border-[#27272A]">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide section-heading-pink">
              Live Security Tools
            </h2>
            <Link to="/tools" className="flex items-center gap-1 text-xs font-mono text-[#FF007A]/70 hover:text-[#FF007A]">
              All tools <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/tools/security-checkup" className="group flex flex-col items-center p-4 rounded-lg border border-zinc-800 hover:border-[#00F0FF]/40 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all text-center">
              <Shield className="w-6 h-6 text-[#00F0FF] mb-2" />
              <span className="text-sm font-medium text-white mb-1">Security Checkup</span>
              <span className="text-xs text-zinc-500">7-point gaming audit</span>
            </Link>
            <Link to="/tools/steam-scanner" className="group flex flex-col items-center p-4 rounded-lg border border-zinc-800 hover:border-[#FF007A]/40 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all text-center">
              <Gamepad2 className="w-6 h-6 text-[#FF007A] mb-2" />
              <span className="text-sm font-medium text-white mb-1">Steam Scanner</span>
              <span className="text-xs text-zinc-500">Scan your Steam account</span>
            </Link>
            <Link to="/breach-sim" className="group flex flex-col items-center p-4 rounded-lg border border-zinc-800 hover:border-[#EF4444]/40 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all text-center">
              <Target className="w-6 h-6 text-[#EF4444] mb-2" />
              <span className="text-sm font-medium text-white mb-1">Breach Simulation</span>
              <span className="text-xs text-zinc-500">Simulate real-world attacks</span>
            </Link>
            <Link to="/security-score" className="group flex flex-col items-center p-4 rounded-lg border border-zinc-800 hover:border-[#39FF14]/40 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all text-center">
              <Zap className="w-6 h-6 text-[#39FF14] mb-2" />
              <span className="text-sm font-medium text-white mb-1">Security Score</span>
              <span className="text-xs text-zinc-500">Personal rating in 2 min</span>
            </Link>
          </div>
          
          {/* Inline security stats bar — social proof */}
          <InlineToolCTA
            tags={['security', 'checkup', 'audit']}
            variant="pill"
            showStats={false}
          />
        </div>
      </section>

      {/* P3: Featured Articles Strip — helps users discover articles from homepage */}
      {sortedArticles.length > 0 && (
        <section className="bg-[#0A0A0B] border-b border-[#27272A]">
          <div className="container mx-auto px-4 max-w-7xl py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white tracking-wide section-heading-cyan">
                Featured Gaming-Security Intel
              </h2>
              <Link to="/security" className="flex items-center gap-1 text-xs font-mono text-[#00F0FF]/70 hover:text-[#00F0FF]">
                All security <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sortedArticles.slice(0, 8).map((article, i) => (
                <Link
                  key={safeArticleId(article) || i}
                  to={articleLink(article)}
                  className="group p-3 rounded-lg border border-[#27272A] bg-gradient-to-b from-zinc-900/50 to-black hover:border-[#00F0FF]/30 hover:from-zinc-900/80 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 uppercase tracking-wider">
                      {article.niche || 'Article'}
                    </span>
                    {article.readTime && (
                      <span className="text-[10px] text-zinc-600">{article.readTime} min</span>
                    )}
                    {(article as any).updatedAt ? (
                      <span className="text-[10px] text-emerald-500/70">Updated {new Date((article as any).updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    ) : article.publishedAt && (
                      <span className="text-[10px] text-zinc-600">{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors line-clamp-2 mb-1">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-xs text-zinc-600 line-clamp-2 group-hover:text-zinc-500 transition-colors">{article.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* P5: Pillar Navigation — SEO engine for category authority, security-first */}
      <section className="bg-[#0A0A0B] border-b border-[#27272A]">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide section-heading-green">
              Gaming Security Hub
            </h2>
            <Link to="/security" className="flex items-center gap-1 text-xs font-mono text-[#00F0FF]/70 hover:text-[#00F0FF]">
              Explore platforms <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/security" className="group p-4 rounded-lg border border-[#00F0FF]/20 bg-gradient-to-br from-[#00F0FF]/5 to-black hover:border-[#00F0FF]/50 transition-all">
              <Shield className="w-5 h-5 text-[#00F0FF] mb-2" />
              <h3 className="text-sm font-bold text-white mb-1">Security Intel</h3>
              <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">Breaches, vulnerabilities, and gaming defense playbooks</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-all">
                Explore threats <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
            <Link to="/tools" className="group p-4 rounded-lg border border-[#FF007A]/20 bg-gradient-to-br from-[#FF007A]/5 to-black hover:border-[#FF007A]/50 transition-all">
              <Gamepad2 className="w-5 h-5 text-[#FF007A] mb-2" />
              <h3 className="text-sm font-bold text-white mb-1">Security Tools</h3>
              <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">Steam Scanner, Security Checkup, Breach Simulator, Threat Scanner</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#FF007A] opacity-0 group-hover:opacity-100 transition-all">
                Try tools <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
            <Link to="/gaming" className="group p-4 rounded-lg border border-[#39FF14]/20 bg-gradient-to-br from-[#39FF14]/5 to-black hover:border-[#39FF14]/50 transition-all">
              <Cpu className="w-5 h-5 text-[#39FF14] mb-2" />
              <h3 className="text-sm font-bold text-white mb-1">Game Security</h3>
              <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">Account protection guides, anti-cheat analysis, and security reviews</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#39FF14] opacity-0 group-hover:opacity-100 transition-all">
                Browse games <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
            <Link to="/guides" className="group p-4 rounded-lg border border-[#A855F7]/20 bg-gradient-to-br from-[#A855F7]/5 to-black hover:border-[#A855F7]/50 transition-all">
              <BookOpen className="w-5 h-5 text-[#A855F7] mb-2" />
              <h3 className="text-sm font-bold text-white mb-1">Protection Guides</h3>
              <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">Step-by-step security tutorials for every gaming platform</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#A855F7] opacity-0 group-hover:opacity-100 transition-all">
                Learn now <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </section>



      {/* P6.5: Platform-Specific Security — unique differentiator, no competitor does this */}
      <section className="bg-[#0A0A0B] border-b border-[#27272A]">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide">
              <span className="text-[#00F0FF]">//</span> Platform-Specific Security Guides
            </h2>
            <Link to="/security" className="flex items-center gap-1 text-xs font-mono text-[#00F0FF]/70 hover:text-[#00F0FF]">
              All platform guides <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'Steam', href: '/article/steam-account-takeover-protection-guide-2026', color: 'hover:border-[#1b2838]/50', bg: 'from-[#1b2838]/30', icon: '🎮' },
              { name: 'Discord', href: '/article/discord-malware-gamers-how-to-stay-safe', color: 'hover:border-[#5865F2]/50', bg: 'from-[#5865F2]/30', icon: '💬' },
              { name: 'Xbox', href: '/article/xbox-rebrand-security-changes-gamers', color: 'hover:border-[#107C10]/50', bg: 'from-[#107C10]/30', icon: '🎯' },
              { name: 'Twitch', href: '/article/twitch-streamer-security-guide-doxxing-swatting', color: 'hover:border-[#9146FF]/50', bg: 'from-[#9146FF]/30', icon: '📺' },
              { name: 'Roblox', href: '/article/roblox-parents-guide-account-security-safety', color: 'hover:border-[#FF0045]/50', bg: 'from-[#FF0045]/30', icon: '🔴' },
              { name: 'Minecraft', href: '/article/minecraft-server-security-guide', color: 'hover:border-[#44B137]/50', bg: 'from-[#44B137]/30', icon: '⛏️' },
            ].map(p => (
              <Link key={p.name} to={p.href} className={`group p-4 rounded-lg border border-zinc-800 bg-gradient-to-br ${p.bg} to-black ${p.color} transition-all text-center`}>
                <span className="text-2xl block mb-2">{p.icon}</span>
                <h3 className="text-xs font-bold text-white group-hover:text-white transition-colors">{p.name}</h3>
                <p className="text-[10px] text-zinc-600 mt-1 group-hover:text-zinc-400 transition-colors">Security Guide</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* P7: Choose Your Path — persona-based journeys */}
      <section className="bg-[#0A0A0B] border-b border-[#27272A]">
        <div className="container mx-auto px-4 max-w-7xl py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide section-heading-purple">
              Choose Your Path
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link to="/security" className="group p-5 rounded-xl border border-[#00F0FF]/20 bg-gradient-to-br from-[#00F0FF]/[0.03] to-black hover:from-[#00F0FF]/[0.08] hover:border-[#00F0FF]/40 transition-all">
              <Swords className="w-6 h-6 text-[#00F0FF] mb-3" />
              <h3 className="font-bold text-white mb-1 group-hover:text-[#00F0FF] transition-colors text-sm">I'm a Security Lead</h3>
              <p className="text-xs text-zinc-500 mb-3">Threat intel, breach analysis, and security playbooks</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">Threat Intel</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">Security Score</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">Breach Sim</span>
              </div>
            </Link>
            <Link to="/gaming" className="group p-5 rounded-xl border border-[#FF007A]/20 bg-gradient-to-br from-[#FF007A]/[0.03] to-black hover:from-[#FF007A]/[0.08] hover:border-[#FF007A]/40 transition-all">
              <Gamepad2 className="w-6 h-6 text-[#FF007A] mb-3" />
              <h3 className="font-bold text-white mb-1 group-hover:text-[#FF007A] transition-colors text-sm">I'm a Gamer</h3>
              <p className="text-xs text-zinc-500 mb-3">Account security, anti-cheat guides, and game reviews</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#FF007A]/10 text-[#FF007A] border border-[#FF007A]/20">Account Security</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#FF007A]/10 text-[#FF007A] border border-[#FF007A]/20">Game Reviews</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#FF007A]/10 text-[#FF007A] border border-[#FF007A]/20">Anti-Cheat</span>
              </div>
            </Link>
            <Link to="/tech" className="group p-5 rounded-xl border border-[#39FF14]/20 bg-gradient-to-br from-[#39FF14]/[0.03] to-black hover:from-[#39FF14]/[0.08] hover:border-[#39FF14]/40 transition-all">
              <Cpu className="w-6 h-6 text-[#39FF14] mb-3" />
              <h3 className="font-bold text-white mb-1 group-hover:text-[#39FF14] transition-colors text-sm">I Track AI &amp; Tech</h3>
              <p className="text-xs text-zinc-500 mb-3">AI Pulse, tech news, and emerging threat analysis</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">AI Pulse</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">Tech News</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/20">AI Security</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* P8: Must-Read This Week — evergreen high-value articles */}
      {sortedArticles.length > 0 && (
        <section className="bg-[#0A0A0B] border-b border-[#27272A]">
          <div className="container mx-auto px-4 max-w-7xl py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white tracking-wide section-heading-green">
                Must-Read This Week
              </h2>
              <Link to="/explore" className="flex items-center gap-1 text-xs font-mono text-[#39FF14]/70 hover:text-[#39FF14]">
                All articles <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sortedArticles.map((article, i) => (
                <Link
                  key={safeArticleId(article) || i}
                  to={articleLink(article)}
                  className="group flex items-start gap-3 p-4 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 text-xs text-zinc-500 group-hover:text-[#00F0FF] group-hover:bg-[#00F0FF]/10 transition-all">
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors line-clamp-1">
                      {article.title}
                    </h3>
                    <p className="text-xs text-zinc-600 line-clamp-1 mt-0.5">{article.excerpt}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 uppercase">
                        {article.niche || 'Article'}
                      </span>
                      {article.author && (
                        <span className="text-[10px] text-zinc-600">{article.author}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* P9: Latest Briefings (6-card grid) */}
      <BriefingsGrid articles={sortedArticles} title="Latest Briefings" />

      {/* P10: Security Spotlight */}
      {securityArticles.length > 0 && <SpotlightStrip articles={securityArticles} />}

      {/* P11: Gaming Strip */}
      {gamingArticles.length > 0 && <GamingStrip articles={gamingArticles} />}

      {/* P12: AI & Emerging Tech */}
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
              <SecurityDashboard />
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

      {/* Must-read Security Guides — internal links for SEO */}
      <section className="bg-[#0A0A0B] border-b border-[#27272A] py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck className="w-5 h-5 text-[#00F0FF]" />
            <h2 className="font-display font-bold text-lg text-white">Must-Read Security Guides</h2>
            <Link to="/guides" className="ml-auto flex items-center gap-1 text-xs font-mono text-[#00F0FF] hover:text-[#00D4E6]">
              All guides <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/article/2fa-setup-every-gaming-platform" className="group block p-5 rounded-lg border border-[#27272A] bg-[#16161A] hover:border-[#00F0FF]/40 transition-all">
              <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider">Most Read</span>
              <h3 className="text-sm font-semibold text-white mt-2 mb-1 group-hover:text-[#00F0FF] transition-colors">
                2FA on Every Gaming Platform
              </h3>
              <p className="text-xs text-zinc-400">
                Set up 2FA on Xbox, Epic Games, Steam &amp; PlayStation in 20 minutes. Blocks 99% of account takeovers.
              </p>
            </Link>
            <Link to="/article/gaming-pc-security-hardening-guide" className="group block p-5 rounded-lg border border-[#27272A] bg-[#16161A] hover:border-[#00F0FF]/40 transition-all">
              <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider">Guide</span>
              <h3 className="text-sm font-semibold text-white mt-2 mb-1 group-hover:text-[#00F0FF] transition-colors">
                Gaming PC Security Hardening
              </h3>
              <p className="text-xs text-zinc-400">
                Lock down your rig against malware and account stealers without losing FPS.
              </p>
            </Link>
            <Link to="/article/what-gamers-think-about-security-sentiment-analysis-2026" className="group block p-5 rounded-lg border border-[#27272A] bg-[#16161A] hover:border-[#00F0FF]/40 transition-all">
              <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-wider">Research</span>
              <h3 className="text-sm font-semibold text-white mt-2 mb-1 group-hover:text-[#00F0FF] transition-colors">
                Gaming Security Sentiment
              </h3>
              <p className="text-xs text-zinc-400">
                Which games have the most security complaints? 10K+ player reviews analyzed.
              </p>
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
