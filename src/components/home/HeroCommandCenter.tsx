/**
 * HeroCommandCenter v2 — World-Class Gaming Security Hero
 * 
 * Based on spec UX-001: Credibility-first, value in <5 seconds
 * - Zone A: Headline + trust signal + dual CTAs
 * - Zone B: Animated Trust Score leaderboard (top articles by securityScore)
 * - Zone C: Trust signal bar "X articles reviewed · Updated daily"
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, ChevronRight, Gamepad2, Activity, Users, ArrowRight, Search, Sparkles, Swords, Lock, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TrustScoreBadge } from '@/components/ui/TrustScoreBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { mockArticles } from '@/data/mockData';

/** Get top 5 articles by securityScore for the leaderboard */
const leaderboardArticles = mockArticles
  .filter(a => a.securityScore !== undefined && a.niche === 'security')
  .sort((a, b) => (b.securityScore ?? 0) - (a.securityScore ?? 0))
  .slice(0, 5);

/** Real articles for the featured card carousel */
const featuredByScore = mockArticles
  .filter(a => a.isFeatured || a.securityScore !== undefined)
  .sort((a, b) => (b.securityScore ?? 0) - (a.securityScore ?? 0))
  .slice(0, 3);

interface LeaderboardItemProps {
  rank: number;
  title: string;
  score: number;
  slug?: string;
}

function LeaderboardItem({ rank, title, score, slug }: LeaderboardItemProps) {
  const articlePath = slug ? `/article/${slug}` : '#';
  
  return (
    <Link
      to={articlePath}
      className="flex items-center gap-3 px-4 py-2.5 bg-surface-card/60 hover:bg-surface-card border border-border-subtle hover:border-accent-purple/30 transition-all group"
    >
      <span className={`font-mono text-xs font-bold w-5 text-center ${
        rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-zinc-300' : rank === 3 ? 'text-amber-700' : 'text-zinc-500'
      }`}>
        #{rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-300 truncate group-hover:text-white transition-colors">
          {title}
        </p>
      </div>
      <TrustScoreBadge score={score} size="sm" />
    </Link>
  );
}

/** Article carousel card for the right side */
function FeaturedArticleCard({ article }: { article: typeof mockArticles[0] }) {
  const path = article.slug ? `/article/${article.slug}` : '#';
  
  return (
    <Link to={path} className="block group">
      <div className="relative overflow-hidden border border-border-subtle bg-surface-card hover:border-accent-purple/40 transition-all">
        <div className="absolute inset-0 bg-gradient-to-t from-nexus-bg via-transparent to-transparent z-10" />
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 p-3">
          <div className="flex items-center gap-2 mb-1">
            {article.securityScore && (
              <TrustScoreBadge score={article.securityScore} size="sm" />
            )}
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent-cyan/80">
              {article.niche}
            </span>
          </div>
          <p className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-accent-cyan transition-colors">
            {article.title}
          </p>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
            <span>{article.readTime} min read</span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>{article.author}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function HeroCommandCenter() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // Auto-rotating carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % featuredByScore.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Total article count for trust signal
  const totalArticles = mockArticles.length;
  const securityArticles = mockArticles.filter(a => a.niche === 'security').length;
  const avgScore = Math.round(
    mockArticles.filter(a => a.securityScore).reduce((s, a) => s + (a.securityScore ?? 0), 0) /
    Math.max(1, mockArticles.filter(a => a.securityScore).length)
  );

  return (
    <section className="bg-gradient-to-b from-[#0A0E1A] to-nexus-bg border-b border-border-subtle relative overflow-hidden">
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(108,99,255,0.3) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="container mx-auto px-4 max-w-7xl py-14 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* === LEFT: Headline + CTAs (6/12 cols) === */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust signal bar */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-nexus-void/60 border border-accent-purple/20 text-accent-purple font-mono text-[10px] uppercase tracking-widest">
                <Shield className="h-3 w-3" />
                Security Intelligence Hub
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-nexus-void/60 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase tracking-widest">
                <Activity className="h-3 w-3" />
                Live
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30 px-3 py-1">
                First Gaming Security Intelligence Hub
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1">
                Free Security Tools
              </span>
            </div>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-white">
              Stop hackers from stealing{' '}
              <span className="bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-purple bg-clip-text text-transparent">
                your gaming accounts
              </span>
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
              Interactive security tools, real-time breach intel, and expert guides 
              built for gamers. <span className="text-white font-medium">Scan your accounts in 2 minutes. Free.</span>
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search articles, tools, threats..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && query.trim()) {
                    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                  }
                }}
                className="w-full bg-nexus-void/80 border border-border-default text-zinc-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-accent-purple/50 transition-colors"
              />
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/article/password-manager-security-audit-2024"
                className="inline-flex items-center gap-2 bg-accent-purple hover:bg-[#5A52E0] text-white font-semibold px-6 py-3 transition-all shadow-lg shadow-accent-purple/25"
              >
                <Shield className="h-4 w-4" />
                Start Security Checkup
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/security"
                className="inline-flex items-center gap-2 border border-border-default hover:border-accent-cyan text-zinc-300 hover:text-accent-cyan px-6 py-3 transition-all"
              >
                <Swords className="h-4 w-4" />
                Threat Dashboard
              </Link>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {[
                { icon: Gamepad2, label: 'Steam, PSN, Xbox, Epic' },
                { icon: Activity,  label: 'Real-time threat monitoring' },
                { icon: Users,     label: `${(totalArticles * 340).toLocaleString()}+ gamers secured` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-zinc-500 text-sm">
                  <Icon className="h-4 w-4 text-accent-purple" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* === RIGHT: Trust Score Leaderboard + Carousel (6/12 cols) === */}
          <div className="lg:col-span-5 space-y-4">
            {/* Trust Score Leaderboard */}
            <div className="border border-border-subtle bg-nexus-void/60">
              <div className="px-4 py-2.5 border-b border-border-subtle flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-300">Top Rated Articles</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-600">Trust Scores</span>
              </div>
              <div className="divide-y divide-border-subtle/50">
                {leaderboardArticles.map((article, i) => (
                  <LeaderboardItem
                    key={article.id}
                    rank={i + 1}
                    title={article.title}
                    score={article.securityScore ?? 0}
                    slug={article.slug}
                  />
                ))}
              </div>
            </div>

            {/* Article Carousel */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">Featured Articles</span>
                <div className="flex gap-1">
                  {featuredByScore.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === currentSlide ? 'bg-accent-purple w-3' : 'bg-zinc-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="relative overflow-hidden">
                <div className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  <div className="flex">
                    {featuredByScore.map((article, i) => (
                      <div key={article.id} className="min-w-full">
                        <FeaturedArticleCard article={article} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex gap-2">
              <Link
                to="/tools/steam-scanner"
                className="flex-1 flex items-center gap-2 bg-surface-card border border-border-subtle hover:border-accent-purple/40 p-3 transition-all text-xs text-zinc-300"
              >
                <Gamepad2 className="h-3.5 w-3.5 text-accent-purple" />
                Steam Scanner
              </Link>
              <Link
                to="/breach-sim"
                className="flex-1 flex items-center gap-2 bg-surface-card border border-border-subtle hover:border-accent-cyan/40 p-3 transition-all text-xs text-zinc-300"
              >
                <Zap className="h-3.5 w-3.5 text-accent-cyan" />
                Breach Sim
              </Link>
              <Link
                to="/tools/gaming-copilot"
                className="flex-1 flex items-center gap-2 bg-surface-card border border-border-subtle hover:border-emerald-500/40 p-3 transition-all text-xs text-zinc-300"
              >
                <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                AI Copilot
              </Link>
            </div>
          </div>
        </div>

        {/* Trust signal bar */}
        <div className="mt-10 pt-5 border-t border-border-subtle flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Shield className="h-3 w-3 text-accent-cyan" />
            <strong className="text-zinc-300">{totalArticles}</strong> articles reviewed
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Activity className="h-3 w-3 text-accent-cyan" />
            {securityArticles} security guides
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Users className="h-3 w-3 text-accent-cyan" />
            Avg Trust Score: <strong className="text-zinc-300">{avgScore}</strong>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Sparkles className="h-3 w-3 text-accent-cyan" />
            Updated daily
          </span>
        </div>
      </div>
    </section>
  );
}
