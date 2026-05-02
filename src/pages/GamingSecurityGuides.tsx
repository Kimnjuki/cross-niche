import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockArticles } from '@/data/mockData';
import { Shield, BookOpen, Users, TrendingUp, Lock, Smartphone, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { SEOHead } from '@/components/seo/SEOHead';
import { SecurityToolsStrip } from '@/components/security/SecurityToolsStrip';

type Difficulty = 'all' | 'Beginner' | 'Intermediate' | 'Advanced';

const STAT_CELLS = [
  { value: '340%', label: 'Rise in account takeovers, Q1 2026' },
  { value: '15B+', label: 'Stolen gaming credentials on dark web' },
  { value: '$1,900', label: 'Average Steam library value at risk' },
  { value: '99.9%', label: 'Of attacks blocked by TOTP 2FA' },
];

const DIFFICULTY_TABS: { value: Difficulty; label: string; color: string }[] = [
  { value: 'all', label: 'All Guides', color: '' },
  { value: 'Beginner', label: 'Beginner', color: 'text-green-600' },
  { value: 'Intermediate', label: 'Intermediate', color: 'text-yellow-600' },
  { value: 'Advanced', label: 'Advanced', color: 'text-red-600' },
];

const DIFFICULTY_BADGE: Record<string, string> = {
  Beginner: 'bg-green-500/10 text-green-600 border-green-500/20',
  Intermediate: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  Advanced: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const QUICK_LINKS = [
  { icon: Lock, label: 'Account Checkup', href: '/tools/gaming-security-checkup' },
  { icon: Shield, label: 'Breach Simulator', href: '/breach-sim' },
  { icon: Monitor, label: 'Live Threats', href: '/live-threat-dashboard' },
  { icon: Smartphone, label: 'Security Score', href: '/security-score' },
];

export default function GamingSecurityGuides() {
  const [activeDifficulty, setActiveDifficulty] = useState<Difficulty>('all');

  const guideArticles = useMemo(() => {
    return mockArticles.filter(
      (a) => Array.isArray(a.tags) && a.tags.includes('Security Guide'),
    );
  }, []);

  const filtered = useMemo(() => {
    if (activeDifficulty === 'all') return guideArticles;
    return guideArticles.filter(
      (a) => Array.isArray(a.tags) && a.tags.includes(activeDifficulty),
    );
  }, [guideArticles, activeDifficulty]);

  const getDifficulty = (tags: string[]): string | null => {
    for (const d of ['Beginner', 'Intermediate', 'Advanced']) {
      if (tags.includes(d)) return d;
    }
    return null;
  };

  return (
    <Layout>
      <SEOHead
        title="Gaming Security Guides — The Grid Nexus"
        description="Comprehensive gaming security guides covering account protection, 2FA setup, threat awareness, and PC hardening."
        url={typeof window !== 'undefined' ? `${window.location.origin}/gaming/security-guides` : '/gaming/security-guides'}
        keywords={[
          'gaming security guide',
          'how to secure gaming account',
          'gaming 2fa setup',
          'steam account security',
          'gaming pc security',
          'mobile gaming security',
          'protect gaming accounts',
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        {/* ── HEADER ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-security to-security/70">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-bold text-4xl text-security">
                  Gaming Security Guides
                </h1>
                <Badge className="bg-security/10 text-security border-security/20">
                  {guideArticles.length} guides
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Practical protection for every platform, every skill level.
              </p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mb-4">
            From first-time setup to advanced OPSEC — structured guides that take you from vulnerable to protected, one clear step at a time.
          </p>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/gaming" className="text-primary hover:underline">Gaming Hub</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/security" className="text-primary hover:underline">Threat Intel</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/guides" className="text-primary hover:underline">All How-To Guides</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/tools/gaming-security-checkup" className="text-primary hover:underline">Security Checkup Tool</Link>
          </div>
        </div>

        {/* ── STAT STRIP ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border rounded-xl overflow-hidden mb-10">
          {STAT_CELLS.map((cell) => (
            <div key={cell.value} className="bg-card px-5 py-4">
              <span className="block font-display text-2xl font-bold text-security mb-1">
                {cell.value}
              </span>
              <span className="text-xs text-muted-foreground leading-tight">{cell.label}</span>
            </div>
          ))}
        </div>

        {/* ── QUICK LINKS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {QUICK_LINKS.map(({ icon: Icon, label, href }) => (
            <Link
              key={href}
              to={href}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium hover:border-security/50 hover:bg-security/5 transition-colors"
            >
              <Icon className="h-4 w-4 text-security shrink-0" />
              {label}
            </Link>
          ))}
        </div>

        {/* ── TOOLS STRIP ── */}
        <SecurityToolsStrip className="mb-10" heading="Free security tools — use them alongside these guides" />

        {/* ── DIFFICULTY FILTERS ── */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-sm font-medium text-muted-foreground">Filter by level:</span>
          {DIFFICULTY_TABS.map((tab) => (
            <Button
              key={tab.value}
              variant={activeDifficulty === tab.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveDifficulty(tab.value)}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({guideArticles.filter((a) => a.tags.includes(tab.value)).length})
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* ── GUIDE CARDS ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No guides found for this filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((article) => {
              const difficulty = getDifficulty(article.tags ?? []);
              return (
                <div key={article.id} className="relative">
                  {difficulty && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className={DIFFICULTY_BADGE[difficulty] ?? ''}>
                        {difficulty}
                      </Badge>
                    </div>
                  )}
                  <ArticleCard article={article} variant="default" />
                </div>
              );
            })}
          </div>
        )}

        {/* ── BOTTOM CTA ── */}
        <div className="mt-16 rounded-xl border border-security/20 bg-security/5 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-security/10">
              <Users className="h-7 w-7 text-security" />
            </div>
          </div>
          <h2 className="font-display font-bold text-2xl mb-2">Stay Ahead of the Threat</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            New guides are published weekly. Check the Security hub for the latest threat intelligence alongside these tutorials.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="default">
              <Link to="/security">
                <TrendingUp className="h-4 w-4 mr-2" />
                Latest Threat Intel
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/guides">All How-To Guides</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
