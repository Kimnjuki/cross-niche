import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Activity, BarChart3, Zap, CheckCircle2 } from 'lucide-react';
import { HeroSection } from '@/components/sections/HeroSection';
import { SectionWrapper } from '@/components/sections/SectionWrapper';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { NewsletterBlock } from '@/components/blocks/NewsletterBlock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  isFeatured: true,
  evidenceBadge: 'Verified Exploit',
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
    readingTimeMinutes: 5,
    evidenceBadge: 'Leaked Benchmark',
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
    readingTimeMinutes: 6,
    evidenceBadge: 'Confirmed Incident',
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
    readingTimeMinutes: 7,
    evidenceBadge: 'Peer Reviewed',
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
    readingTimeMinutes: 5,
    evidenceBadge: 'CVE Assigned',
  }
];

const tools = [
  {
    title: 'Security Score Checker',
    description: 'Assess your cyber posture with our free security scoring tool.',
    href: '/security-score',
    icon: Shield,
    color: 'text-cyan',
    bg: 'bg-cyan/10',
    border: 'border-cyan/20',
  },
  {
    title: 'Breach Simulator',
    description: 'Interactive breach simulation for security training and awareness.',
    href: '/breach-sim',
    icon: Activity,
    color: 'text-violet',
    bg: 'bg-violet/10',
    border: 'border-violet/20',
  },
  {
    title: 'Live Threat Dashboard',
    description: 'Real-time cyber threat intelligence dashboard with CVE monitoring.',
    href: '/live-threat-dashboard',
    icon: BarChart3,
    color: 'text-red',
    bg: 'bg-red/10',
    border: 'border-red/20',
  },
  {
    title: 'AI Pulse Tracker',
    description: 'Track AI model releases, market moves, and regulation changes.',
    href: '/ai-pulse',
    icon: Zap,
    color: 'text-amber',
    bg: 'bg-amber/10',
    border: 'border-amber/20',
  },
];

const aiPulseItems = [
  { title: 'GPT-5 rumored for Q4 2026', source: 'Reported', category: 'Models' },
  { title: 'EU AI Act enforcement begins', source: 'Primary', category: 'Regulation' },
  { title: 'New open-weight model beats GPT-4o', source: 'Analysis', category: 'Open Source' },
  { title: 'Major cloud provider doubles AI infra spend', source: 'Reported', category: 'Funding' },
];

export function Homepage() {
  return (
    <main>
      <HeroSection
        variant="homepage"
        eyebrow="INTELLIGENCE HUB"
        ctas={[
          { label: 'Read the latest', href: '/explore', variant: 'primary' },
          { label: 'Check your security score', href: '/security-score', variant: 'secondary' },
        ]}
      />

      {/* Three-pillar navigation strip */}
      <section className="border-b border-white/[0.06] bg-ink-900/50" aria-label="Coverage pillars">
        <div className="container-tokens">
          <div className="grid grid-cols-3">
            <Link to="/tech" className="group flex items-center justify-center gap-3 py-4 border-r border-white/[0.06] hover:bg-cyan/5 transition-colors">
              <span className="text-cyan font-semibold text-sm md:text-base group-hover:underline">Technology</span>
            </Link>
            <Link to="/security" className="group flex items-center justify-center gap-3 py-4 border-r border-white/[0.06] hover:bg-violet/5 transition-colors">
              <span className="text-violet font-semibold text-sm md:text-base group-hover:underline">Security</span>
            </Link>
            <Link to="/gaming" className="group flex items-center justify-center gap-3 py-4 hover:bg-amber/5 transition-colors">
              <span className="text-amber font-semibold text-sm md:text-base group-hover:underline">Gaming</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured analysis + supporting articles */}
      <SectionWrapper
        title="Latest Intelligence"
        eyebrow="FEATURED ANALYSIS"
        ctaLabel="Explore all coverage →"
        ctaHref="/explore"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2 md:row-span-2">
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>
          {articles.slice(0, 3).map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant={index < 1 ? 'default' : 'compact'}
            />
          ))}
        </div>
      </SectionWrapper>

      {/* Tool discovery band */}
      <section className="py-16 border-t border-white/[0.06]" aria-label="Free tools">
        <div className="container-tokens">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-[var(--font-label)] uppercase tracking-[0.1em] text-cyan text-xs mb-2">FREE TOOLS</p>
              <h2 className="font-[var(--font-heading)] text-[clamp(1.375rem,2.5vw,1.875rem)] text-white leading-tight">
                Security tools, no download required
              </h2>
            </div>
            <Button variant="ghost" asChild className="text-cyan hover:text-cyan">
              <Link to="/tools">View all tools <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className={cn(
                  'group block p-5 rounded-[var(--radius-lg)] border transition-all duration-200',
                  tool.bg,
                  tool.border,
                  'hover:-translate-y-1 hover:shadow-lg'
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn('p-2 rounded-md', tool.bg)}>
                    <tool.icon className={cn('h-5 w-5', tool.color)} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm group-hover:underline">{tool.title}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{tool.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Pulse snapshot */}
      <section className="py-16 border-t border-white/[0.06]" aria-label="AI Pulse">
        <div className="container-tokens">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-[var(--font-label)] uppercase tracking-[0.1em] text-amber text-xs mb-2">AI PULSE</p>
              <h2 className="font-[var(--font-heading)] text-[clamp(1.375rem,2.5vw,1.875rem)] text-white leading-tight">
                AI developments that matter
              </h2>
            </div>
            <Button variant="ghost" asChild className="text-amber hover:text-amber">
              <Link to="/ai-pulse">Full AI Pulse →</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiPulseItems.map((item) => (
              <Link
                key={item.title}
                to="/ai-pulse"
                className="group flex items-start gap-4 p-4 rounded-[var(--radius-md)] border border-white/[0.06] bg-ink-900/50 hover:bg-ink-800/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-wider border-white/10 text-slate-400">
                      {item.category}
                    </Badge>
                    <span className={cn(
                      'text-[10px] font-medium uppercase tracking-wider',
                      item.source === 'Primary' ? 'text-green' : item.source === 'Reported' ? 'text-amber' : 'text-violet'
                    )}>
                      {item.source}
                    </span>
                  </div>
                  <h3 className="text-sm text-slate-200 group-hover:text-white group-hover:underline transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Updated every 6 hours. Methodology: <Link to="/ai-pulse" className="text-slate-400 hover:text-foreground underline">view our sourcing standards</Link>.
          </p>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 border-t border-white/[0.06]" aria-label="Newsletter">
        <div className="container-tokens">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold text-white mb-3">
              The Nexus Brief
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              The most important technology, security and gaming developments—explained clearly and connected to practical action.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild className="bg-cyan text-ink-950 hover:bg-cyan/90 font-semibold">
                <Link to="/newsletter">Subscribe free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/10 text-slate-300 hover:bg-ink-800">
                <Link to="/explore">Browse latest</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Homepage;
