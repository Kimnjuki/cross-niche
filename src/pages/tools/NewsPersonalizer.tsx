import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Newspaper, Shield, Gamepad2, Cpu, Bot, TrendingUp, Clock,
  ArrowRight, Bookmark, Share2, ChevronRight, Zap, ArrowLeft,
  Filter, Star, AlertTriangle, Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

type Category = 'all' | 'security' | 'gaming' | 'tech' | 'ai';
type Priority = 'breaking' | 'high' | 'normal';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: Exclude<Category, 'all'>;
  priority: Priority;
  source: string;
  timeAgo: string;
  readTime: number;
  tags: string[];
  relevanceScore: number;
  isBookmarked?: boolean;
}

// ── Mock news feed ─────────────────────────────────────────────────────────

const NEWS_FEED: NewsItem[] = [
  {
    id: 'n1',
    title: 'Valve patches critical Steam client RCE vulnerability — update now',
    summary: 'A memory corruption bug in the Steam client allowed remote code execution via crafted game invite links. Valve\'s emergency patch is live. All users on versions below 3.0.2.18 are exposed.',
    category: 'security',
    priority: 'breaking',
    source: 'Valve Security Blog',
    timeAgo: '23 min ago',
    readTime: 4,
    tags: ['Steam', 'RCE', 'Patch', 'Critical'],
    relevanceScore: 98,
  },
  {
    id: 'n2',
    title: 'NVIDIA RTX 5080 benchmarks leak — 40% uplift over 4080 Super',
    summary: 'Early Geekbench and 3DMark runs for the unreleased RTX 5080 suggest a significant generational jump, with rasterization scores beating the 4090 in several tests. DLSS 4 performance scaling is exceptional.',
    category: 'tech',
    priority: 'high',
    source: 'VideoCardz',
    timeAgo: '1 hr ago',
    readTime: 5,
    tags: ['NVIDIA', 'GPU', 'RTX 5080', 'Benchmarks'],
    relevanceScore: 91,
  },
  {
    id: 'n3',
    title: 'GTA VI multiplayer beta leaks show 500-player lobbies and AI NPCs',
    summary: 'Internal test builds shared in a Rockstar source code leak reveal persistent open-world lobbies with up to 500 concurrent players and Claude-powered NPC dialogue systems. Release window still unclear.',
    category: 'gaming',
    priority: 'high',
    source: 'Kotaku',
    timeAgo: '2 hr ago',
    readTime: 6,
    tags: ['GTA VI', 'Rockstar', 'Multiplayer', 'Leak'],
    relevanceScore: 89,
  },
  {
    id: 'n4',
    title: 'Anthropic releases Claude 4 Opus with extended thinking and 1M context',
    summary: 'Claude 4 Opus introduces a 1-million-token context window, extended reasoning mode, and a new tool-use protocol that allows multi-agent workflows without external orchestration frameworks.',
    category: 'ai',
    priority: 'high',
    source: 'Anthropic Blog',
    timeAgo: '3 hr ago',
    readTime: 7,
    tags: ['Claude', 'Anthropic', 'LLM', 'AI Models'],
    relevanceScore: 87,
  },
  {
    id: 'n5',
    title: 'North Korean hackers impersonating gamers to infiltrate crypto firms',
    summary: 'Lazarus Group actors are joining Discord gaming communities, building trust over weeks, then sending malware disguised as game mods. At least $47M stolen via this vector in 2025.',
    category: 'security',
    priority: 'high',
    source: 'Mandiant Threat Intelligence',
    timeAgo: '4 hr ago',
    readTime: 5,
    tags: ['Lazarus Group', 'Social Engineering', 'Crypto', 'Gaming'],
    relevanceScore: 94,
  },
  {
    id: 'n6',
    title: 'Valorant Episode 9 Act 2 brings new Agent and Ranked changes',
    summary: 'Riot unveils Tarn, a Sentinel with wall-denial and site-anchoring abilities. The ranked system receives a provisional game expansion to 10 placement matches and hidden MMR transparency improvements.',
    category: 'gaming',
    priority: 'normal',
    source: 'Riot Games',
    timeAgo: '5 hr ago',
    readTime: 4,
    tags: ['Valorant', 'Riot Games', 'Patch', 'Ranked'],
    relevanceScore: 75,
  },
  {
    id: 'n7',
    title: 'OpenAI GPT-5 system card reveals new safety evaluations and refusals',
    summary: 'GPT-5\'s safety system card details new capability evaluations including uplift for CBRN threats, cyberweapons, and persuasion. Model shows improved refusals but researchers flag new jailbreak surface areas.',
    category: 'ai',
    priority: 'normal',
    source: 'OpenAI Research',
    timeAgo: '6 hr ago',
    readTime: 8,
    tags: ['GPT-5', 'OpenAI', 'Safety', 'AI Policy'],
    relevanceScore: 82,
  },
  {
    id: 'n8',
    title: 'Intel Core Ultra 300 HX outperforms AMD Ryzen 9 in sustained workloads',
    summary: 'Anandtech\'s extensive thermal and power analysis finds Intel\'s latest mobile flagship sustains higher clocks under prolonged loads due to its improved Lion Cove power delivery architecture.',
    category: 'tech',
    priority: 'normal',
    source: 'AnandTech',
    timeAgo: '7 hr ago',
    readTime: 9,
    tags: ['Intel', 'CPU', 'Benchmark', 'Laptop'],
    relevanceScore: 70,
  },
  {
    id: 'n9',
    title: 'New PowerSchool breach exposes 6.5M student records via stolen credentials',
    summary: 'A credential-stuffing attack against PowerSchool\'s SIS portal resulted in unauthorized access to 6.5M student and staff records across 6,500 school districts. SSNs, grades, and medical notes were accessed.',
    category: 'security',
    priority: 'breaking',
    source: 'Bleeping Computer',
    timeAgo: '8 hr ago',
    readTime: 5,
    tags: ['Data Breach', 'Education', 'Credential Stuffing', 'PowerSchool'],
    relevanceScore: 96,
  },
  {
    id: 'n10',
    title: 'Microsoft DirectStorage 2.0 eliminates CPU decompression bottleneck',
    summary: 'The updated API moves all asset decompression to the GPU, freeing 2-3 CPU cores on average during load screens. Elden Ring Remastered will be the first title to ship with full DS 2.0 support.',
    category: 'tech',
    priority: 'normal',
    source: 'Microsoft DirectX Blog',
    timeAgo: '9 hr ago',
    readTime: 4,
    tags: ['DirectStorage', 'Microsoft', 'PC Gaming', 'Performance'],
    relevanceScore: 73,
  },
  {
    id: 'n11',
    title: 'Overwatch 2 Season 14 introduces PvE missions and AI teammate option',
    summary: 'Blizzard responds to years of community requests with six new PvE co-op missions and an opt-in AI teammate system for players who prefer single-player practice without bot lobbies.',
    category: 'gaming',
    priority: 'normal',
    source: 'Blizzard Entertainment',
    timeAgo: '10 hr ago',
    readTime: 3,
    tags: ['Overwatch 2', 'PvE', 'Blizzard', 'AI'],
    relevanceScore: 67,
  },
  {
    id: 'n12',
    title: 'Meta AI Studio lets creators fine-tune Llama 3.3 on their own content',
    summary: 'Meta\'s new AI Studio offers creators a no-code fine-tuning pipeline for Llama 3.3 using their own posts, DMs (with consent), and video transcripts. Output models stay private and hosted on Meta infra.',
    category: 'ai',
    priority: 'normal',
    source: 'The Verge',
    timeAgo: '11 hr ago',
    readTime: 5,
    tags: ['Meta', 'Llama', 'Fine-Tuning', 'Creator Tools'],
    relevanceScore: 71,
  },
];

// ── Category config ────────────────────────────────────────────────────────

const CATEGORIES: { id: Category; label: string; icon: React.ElementType; color: string; borderColor: string }[] = [
  { id: 'all', label: 'All', icon: Globe, color: 'text-foreground', borderColor: 'border-foreground/30' },
  { id: 'security', label: 'Security', icon: Shield, color: 'text-[#FF007A]', borderColor: 'border-[#FF007A]/30' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'text-[#39FF14]', borderColor: 'border-[#39FF14]/30' },
  { id: 'tech', label: 'Tech', icon: Cpu, color: 'text-[#00F0FF]', borderColor: 'border-[#00F0FF]/30' },
  { id: 'ai', label: 'AI', icon: Bot, color: 'text-[#B026FF]', borderColor: 'border-[#B026FF]/30' },
];

const PRIORITY_CONFIG = {
  breaking: { label: 'Breaking', class: 'bg-destructive text-white' },
  high: { label: 'Top Story', class: 'bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/30' },
  normal: { label: '', class: '' },
};

const CATEGORY_COLOR: Record<Exclude<Category, 'all'>, string> = {
  security: 'text-[#FF007A]',
  gaming: 'text-[#39FF14]',
  tech: 'text-[#00F0FF]',
  ai: 'text-[#B026FF]',
};

// ── Component ──────────────────────────────────────────────────────────────

export default function NewsPersonalizer() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'relevance' | 'time'>('relevance');

  const filtered = useMemo(() => {
    let items = activeCategory === 'all' ? NEWS_FEED : NEWS_FEED.filter(n => n.category === activeCategory);
    items = [...items].sort((a, b) => {
      if (sortBy === 'relevance') return b.relevanceScore - a.relevanceScore;
      return 0; // already in time order
    });
    return items;
  }, [activeCategory, sortBy]);

  const breaking = NEWS_FEED.filter(n => n.priority === 'breaking');
  const topCat = CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <Layout>
      <SEO
        title="AI News Personalizer — The Grid Nexus"
        description="Your personalized gaming & security news feed. AI-curated stories ranked by relevance — security breaches, game releases, AI breakthroughs, and hardware launches."
      />

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30">
              <Newspaper className="h-7 w-7 text-[#00F0FF]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl">AI News Personalizer</h1>
              <p className="text-muted-foreground text-sm">Curated intelligence ranked by relevance to your interests</p>
            </div>
          </div>
        </div>

        {/* Breaking news banner */}
        {breaking.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-destructive/40 bg-destructive/5 flex items-start gap-3">
            <Zap className="h-5 w-5 text-destructive shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-destructive uppercase tracking-wider">Breaking</span>
              <p className="text-sm font-medium mt-0.5 line-clamp-1">{breaking[0].title}</p>
            </div>
            <Badge variant="destructive" className="text-xs shrink-0">Live</Badge>
          </div>
        )}

        {/* Category tabs + sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors',
                    isActive
                      ? `${cat.color} ${cat.borderColor} bg-white/5`
                      : 'text-muted-foreground border-border hover:border-foreground/30'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {(['relevance', 'time'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={cn('px-2 py-1 rounded text-xs transition-colors', sortBy === s ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                {s === 'relevance' ? 'Most Relevant' : 'Latest'}
              </button>
            ))}
          </div>
        </div>

        {/* Feed stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {filtered.length} stories</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Updated just now</span>
          <span className="flex items-center gap-1"><Star className="h-3 w-3" /> Sorted by {sortBy}</span>
        </div>

        {/* News list */}
        <div className="space-y-4">
          {filtered.map((item, idx) => {
            const isBookmarked = bookmarked.has(item.id);
            const catColor = CATEGORY_COLOR[item.category];
            const priConfig = PRIORITY_CONFIG[item.priority];
            const catInfo = CATEGORIES.find(c => c.id === item.category)!;
            const CatIcon = catInfo.icon;

            return (
              <Card
                key={item.id}
                className={cn(
                  'group hover:border-foreground/20 transition-colors',
                  item.priority === 'breaking' && 'border-destructive/30 bg-destructive/5',
                  item.priority === 'high' && idx === 0 && 'border-[#FFB800]/20',
                )}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div className="shrink-0 w-8 text-center">
                      <span className="text-2xl font-bold font-display text-muted-foreground/30">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {item.priority !== 'normal' && (
                          <Badge className={cn('text-xs', priConfig.class)}>{priConfig.label}</Badge>
                        )}
                        <span className={cn('flex items-center gap-1 text-xs font-medium', catColor)}>
                          <CatIcon className="h-3 w-3" />
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.source}</span>
                        <span className="text-xs text-muted-foreground">· {item.timeAgo}</span>
                        <span className="text-xs text-muted-foreground">· {item.readTime} min read</span>
                      </div>

                      <h3 className="font-semibold text-base leading-snug mb-2 group-hover:text-[#00F0FF] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                        {item.summary}
                      </p>

                      {/* Tags + actions */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{item.relevanceScore}%</span>
                          </div>
                          <button
                            onClick={() => setBookmarked(prev => {
                              const next = new Set(prev);
                              if (next.has(item.id)) next.delete(item.id);
                              else next.add(item.id);
                              return next;
                            })}
                            className={cn('p-1.5 rounded transition-colors', isBookmarked ? 'text-[#FFB800]' : 'text-muted-foreground hover:text-foreground')}
                          >
                            <Bookmark className="h-3.5 w-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                          </button>
                          <button className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors">
                            <Share2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bookmarks summary */}
        {bookmarked.size > 0 && (
          <div className="mt-6 p-4 rounded-xl border border-[#FFB800]/30 bg-[#FFB800]/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-[#FFB800]" fill="currentColor" />
              <span className="text-sm font-medium">{bookmarked.size} story{bookmarked.size > 1 ? 'ies' : ''} bookmarked</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/bookmarks">
                View Bookmarks <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        )}

        {/* CTA */}
        <Card className="mt-8 border-[#B026FF]/20 bg-gradient-to-r from-[#B026FF]/5 to-[#00F0FF]/5">
          <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Never miss a critical alert</p>
              <p className="text-sm text-muted-foreground">Subscribe to the Live Threat Dashboard for real-time security push notifications.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button asChild size="sm">
                <Link to="/live-threat-dashboard" className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" /> Threat Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/tools/sentiment-analyzer" className="flex items-center gap-2">
                  Game Sentiment <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
