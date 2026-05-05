import React, { useState, useCallback, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ToolCrossLinks } from '@/components/tools/ToolPageSEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState, EmptyState, ErrorState } from '@/components/common/StateComponents';
import { toolRateLimiters } from '@/lib/utils/rateLimit';
import type { StatusType } from '@/lib/types/status';
import {
  Newspaper, Bookmark, Share2, Search, ChevronRight, Zap,
  Filter, ArrowLeft, Clock, TrendingUp, Shield,
  RefreshCw, BookmarkCheck, ChevronLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  date: string;
  priority?: 'breaking' | 'normal';
  tags: string[];
  relevanceScore: number;
  isBookmarked?: boolean;
}

interface NewsCategory {
  id: string;
  label: string;
}

// ── Categories ─────────────────────────────────────────────────────────────

const CATEGORIES: NewsCategory[] = [
  { id: 'all', label: 'All News' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'security', label: 'Security' },
  { id: 'tech', label: 'Tech' },
  { id: 'threats', label: 'Threat Intel' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'industry', label: 'Industry' },
];

// ── Mock News Feed Data ────────────────────────────────────────────────────

const NEWS_FEED: NewsItem[] = [
  {
    id: 'n1',
    title: 'Steam Remote Code Execution Vulnerability Patched in Emergency Update',
    summary: 'A memory corruption bug in the Steam client allowed remote code execution via crafted game invite links. Valve\'s emergency patch is live. All users on versions below 3.0.2.18 are exposed.',
    category: 'security',
    source: 'Valve Security Advisory',
    date: '2026-05-04',
    priority: 'breaking',
    tags: ['Steam', 'RCE', 'Valve', 'Critical'],
    relevanceScore: 98,
  },
  {
    id: 'n2',
    title: 'NVIDIA RTX 5080 Benchmarks Leak — 40% Uplift Over 4080 Super',
    summary: 'Early Geekbench and 3DMark runs for the unreleased RTX 5080 suggest a significant generational jump, with rasterization scores beating the 4090 in several tests. DLSS 4 performance scaling is exceptional.',
    category: 'hardware',
    source: 'VideoCardz',
    date: '2026-05-04',
    tags: ['NVIDIA', 'GPU', 'RTX 5080', 'Benchmarks'],
    relevanceScore: 85,
  },
  {
    id: 'n3',
    title: 'GTA 6 Development Update — Rockstar Confirms Late 2026 Window',
    summary: 'Rockstar Games has reaffirmed its target launch window, with insiders reporting the game is feature-complete and entering final optimization. Security researchers flag potential for pre-release leaks.',
    category: 'gaming',
    source: 'Kotaku',
    date: '2026-05-03',
    tags: ['GTA 6', 'Rockstar', 'Release Date'],
    relevanceScore: 92,
  },
  {
    id: 'n4',
    title: 'Ransomware Group Claims Breach of Game Publisher Network — 2M Records Stolen',
    summary: 'A ransomware group has posted samples from a claimed breach of an unnamed major game publisher, including source code slices and employee database exports. Investigation ongoing.',
    category: 'threats',
    source: 'BleepingComputer',
    date: '2026-05-03',
    priority: 'breaking',
    tags: ['Ransomware', 'Data Breach', 'Gaming'],
    relevanceScore: 96,
  },
  {
    id: 'n5',
    title: 'PlayStation Network Outage Traced to DDoS Attack — Sony Confirms No Data Compromise',
    summary: 'PSN was offline for approximately 6 hours on May 2nd due to a distributed denial-of-service attack. Sony confirms no user data was accessed but recommends password resets as a precaution.',
    category: 'security',
    source: 'Sony Interactive Entertainment',
    date: '2026-05-02',
    tags: ['PlayStation', 'PSN', 'DDoS', 'Sony'],
    relevanceScore: 88,
  },
  {
    id: 'n6',
    title: 'New Anti-Cheat Bypass Technique Reported in Call of Duty: Warzone',
    summary: 'Researchers have documented a kernel-level bypass that circumvents Ricochet anti-cheat on Windows 11. Activision is investigating and plans a patch within 48 hours.',
    category: 'threats',
    source: 'Security Research Lab',
    date: '2026-05-02',
    tags: ['Call of Duty', 'Anti-Cheat', 'Exploit'],
    relevanceScore: 84,
  },
  {
    id: 'n7',
    title: 'AMD Announces FSR 4.0 — AI Upscaling Coming to All RX 9000 Series GPUs',
    summary: 'AMD\'s next-gen upscaling technology leverages dedicated AI accelerators for superior image quality. Backward compatible with FSR 3 titles via driver-level override.',
    category: 'tech',
    source: 'AMD Official',
    date: '2026-05-01',
    tags: ['AMD', 'FSR', 'GPU', 'Upscaling'],
    relevanceScore: 79,
  },
  {
    id: 'n8',
    title: 'Discord Bot Malware Campaign Targets Gaming Servers with Fake Giveaways',
    summary: 'A coordinated campaign is spreading info-stealer malware through Discord bots posing as giveaway moderators. Over 500 gaming servers affected. Avoid clicking unexpected giveaway links.',
    category: 'threats',
    source: 'Malwarebytes',
    date: '2026-05-01',
    tags: ['Discord', 'Malware', 'Phishing'],
    relevanceScore: 91,
  },
  {
    id: 'n9',
    title: 'Xbox Game Pass Adds 14 New Titles for May — Including Day-One Releases',
    summary: 'Microsoft has announced the May 2026 Game Pass lineup, featuring 3 day-one releases including the anticipated "Starfall Protocol" from Obsidian Entertainment.',
    category: 'gaming',
    source: 'Xbox Wire',
    date: '2026-04-30',
    tags: ['Xbox', 'Game Pass', 'Microsoft'],
    relevanceScore: 76,
  },
  {
    id: 'n10',
    title: 'Epic Games Store Adds One-Time Password Requirement After Account Takeover Surge',
    summary: 'Following a 300% increase in account takeovers, Epic has mandated OTP verification for all account changes. Users report improved security but friction with family sharing.',
    category: 'security',
    source: 'Epic Games',
    date: '2026-04-30',
    tags: ['Epic Games', 'Account Security', '2FA'],
    relevanceScore: 87,
  },
  {
    id: 'n11',
    title: 'Intel Core Ultra 300 Series "Arrow Lake Refresh" Specs Leaked',
    summary: 'Internal slides show Intel\'s next-gen desktop CPUs with up to 24 cores, improved efficiency cores, and enhanced AI acceleration. Launch expected Q3 2026.',
    category: 'tech',
    source: 'WCCFTech',
    date: '2026-04-29',
    tags: ['Intel', 'CPU', 'Arrow Lake'],
    relevanceScore: 72,
  },
  {
    id: 'n12',
    title: 'Valorant Agent 28 Abilities Leaked — New Sentinel with Unique Smoke Mechanic',
    summary: 'Data miners have uncovered ability icons and descriptions for the next Valorant agent. Expected to release with Episode 10 Act 2 in late May.',
    category: 'gaming',
    source: 'ValorLeaks',
    date: '2026-04-29',
    tags: ['Valorant', 'Riot', 'Leaks'],
    relevanceScore: 68,
  },
  {
    id: 'n13',
    title: 'Hackers Target Gaming VPN Users — MITM Attack Steals Session Tokens',
    summary: 'A man-in-the-middle attack has been observed targeting popular gaming VPNs, intercepting session tokens for Steam, Epic, and Battle.net. Users advised to enable VPN kill switch.',
    category: 'threats',
    source: 'The Grid Nexus Threat Intelligence',
    date: '2026-04-28',
    tags: ['VPN', 'MITM', 'Session Hijacking'],
    relevanceScore: 94,
  },
  {
    id: 'n14',
    title: 'Nintendo Switch 2 Tear Down Reveals Custom NVIDIA Chip with DLSS 3.5',
    summary: 'Hardware teardown confirms custom T239 SoC with dedicated tensor cores. DLSS 3.5 ray reconstruction enables console ray tracing at 60fps in handheld mode.',
    category: 'hardware',
    source: 'iFixit',
    date: '2026-04-28',
    tags: ['Nintendo', 'Switch 2', 'NVIDIA'],
    relevanceScore: 83,
  },
  {
    id: 'n15',
    title: 'Cloud Gaming Security Report — 73% of Services Have Vulnerable API Endpoints',
    summary: 'A comprehensive audit of 12 cloud gaming platforms found that most expose user data through insufficiently secured APIs. GeForce Now and Xbox Cloud Gaming scored highest for security.',
    category: 'security',
    source: 'The Grid Nexus Research',
    date: '2026-04-27',
    tags: ['Cloud Gaming', 'API Security', 'Research'],
    relevanceScore: 97,
  },
];

const ITEMS_PER_PAGE = 5;

// ═══════════════════════════════════════════════════════════════════════════

export default function NewsPersonalizer() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState<Set<string>>(() => {
    // Restore bookmarks from sessionStorage (survives page refresh within tab)
    try {
      const saved = sessionStorage.getItem('newsBookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [status, setStatus] = useState<StatusType>('idle');
  const [currentPage, setCurrentPage] = useState(1);

  // Persist bookmarks to sessionStorage on change
  React.useEffect(() => {
    try {
      sessionStorage.setItem('newsBookmarks', JSON.stringify([...bookmarked]));
    } catch { /* ignore quota errors */ }
  }, [bookmarked]);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Filter with search + category
  const filtered = useMemo(() => {
    let items = activeCategory === 'all'
      ? NEWS_FEED
      : NEWS_FEED.filter((n) => n.category === activeCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  // Breaking news (always shown)
  const breaking = useMemo(
    () => NEWS_FEED.filter((n) => n.priority === 'breaking'),
    []
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(
    () => filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filtered, currentPage]
  );

  // Reset to page 1 when category or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      if (!toolRateLimiters.newsPersonalizer.consume()) {
        setStatus('error');
        return;
      }
      setActiveCategory(categoryId);
      setStatus('success');
    },
    []
  );

  return (
    <ErrorBoundary toolName="News Personalizer">
      <Layout>
        <SEO
          title="Personalized Gaming News Feed — The Grid Nexus"
          description="Your curated gaming security news feed. Filter by category, bookmark stories, and stay ahead of threats."
        />
        <div className="min-h-screen bg-[#0B0E14] text-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

            {/* Header */}
            <div className="flex items-center gap-4">
              <Link to="/tools/security-scanner" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  <Newspaper className="w-7 h-7 text-[#B026FF]" />
                  Personalized News Feed
                </h1>
                <p className="text-gray-400 mt-1">
                  Stay ahead of gaming threats and industry shifts. Filter, search, and save what matters.
                </p>
              </div>
            </div>

            {/* Error */}
            {status === 'error' && (
              <ErrorState title="Filter rate limited" message="Please wait a moment before switching categories again." />
            )}

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news by title, summary, or tag…"
                className="pl-10 bg-[#131820] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#B026FF]"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={
                    activeCategory === cat.id
                      ? 'bg-[#B026FF] hover:bg-[#B026FF]/80 text-white'
                      : 'border-gray-700 hover:border-[#B026FF] hover:text-white'
                  }
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* Breaking News Banner */}
            {breaking.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-red-400 flex items-center gap-2 uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  Breaking
                </h2>
                {breaking.map((item) => (
                  <NewsCard
                    key={item.id}
                    item={item}
                    isBookmarked={bookmarked.has(item.id)}
                    onToggleBookmark={toggleBookmark}
                    isBreaking
                  />
                ))}
              </div>
            )}

            {/* Feed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {activeCategory === 'all' ? 'All Stories' : CATEGORIES.find((c) => c.id === activeCategory)?.label || 'Stories'}
                  <span className="ml-2 text-gray-600">({filtered.length})</span>
                </h2>
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-white"
                  >
                    Clear Search
                  </Button>
                )}
              </div>

              {/* Paginated results */}
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <NewsCard
                    key={item.id}
                    item={{ ...item, isBookmarked: bookmarked.has(item.id) }}
                    isBookmarked={bookmarked.has(item.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                ))
              ) : (
                <EmptyState
                  title="No stories found"
                  message={
                    searchQuery
                      ? `No stories match "${searchQuery}" in this category.`
                      : 'No stories in this category yet.'
                  }
                />
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="border-gray-700"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="border-gray-700"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Bookmark count */}
            {bookmarked.size > 0 && (
              <div className="text-center text-xs text-gray-500">
                {bookmarked.size} bookmarked {bookmarked.size === 1 ? 'story' : 'stories'} saved this session
              </div>
            )}
          </div>
        </div>
        <ToolCrossLinks related={[
            "/tools/sentiment-analyzer",
            "/tools/threat-scanner",
            "/tools/release-predictor",
            "/tools/gaming-copilot",
          ]} />
      </Layout>
    </ErrorBoundary>
  );
}

// ═══════════════════════════════════════════════════════════════════════════

function NewsCard({
  item,
  isBookmarked,
  onToggleBookmark,
  isBreaking,
}: {
  item: NewsItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isBreaking?: boolean;
}) {
  const [relevanceVisible, setRelevanceVisible] = useState(false);

  const categoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      gaming: 'bg-green-900/30 text-green-300 border-green-700',
      security: 'bg-blue-900/30 text-blue-300 border-blue-700',
      tech: 'bg-purple-900/30 text-purple-300 border-purple-700',
      threats: 'bg-red-900/30 text-red-300 border-red-700',
      hardware: 'bg-yellow-900/30 text-yellow-300 border-yellow-700',
      industry: 'bg-gray-900/30 text-gray-300 border-gray-700',
    };
    return colors[cat] || 'bg-gray-900/30 text-gray-300 border-gray-700';
  };

  return (
    <Card className={`bg-[#131820] border-gray-800 ${isBreaking ? 'border-l-4 border-l-red-500' : ''}`}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge className={`text-xs border ${categoryColor(item.category)}`}>
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </Badge>
              {isBreaking && (
                <Badge variant="destructive" className="text-xs">Breaking</Badge>
              )}
            </div>
            <h3 className="text-base font-semibold text-white leading-snug">
              {item.title}
            </h3>
            <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">{item.summary}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.date}
              </span>
              <span>{item.source}</span>
            </div>
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleBookmark(item.id)}
              className={isBookmarked ? 'text-[#B026FF]' : 'text-gray-500 hover:text-white'}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-white"
                onClick={() => setRelevanceVisible(!relevanceVisible)}
                title="Relevance score"
              >
                <TrendingUp className="w-4 h-4" />
              </Button>
              {relevanceVisible && (
                <div className="absolute right-0 top-full mt-1 z-10 bg-gray-800 border border-gray-700 rounded-lg p-2 text-center w-24 shadow-xl">
                  <p className="text-xs text-gray-400">Relevance</p>
                  <p className="text-sm font-bold text-[#B026FF]">{item.relevanceScore}%</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
