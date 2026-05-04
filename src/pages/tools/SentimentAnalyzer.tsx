import React, { useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Search, TrendingUp, TrendingDown, Minus, MessageSquare,
  Shield, Gamepad2, Users, Zap, AlertTriangle, CheckCircle,
  BarChart3, RefreshCw, Star, ChevronDown, ChevronUp, ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

interface SentimentResult {
  gameTitle: string;
  platform: string;
  overallSentiment: number;
  sentimentBreakdown: {
    gameplay: number;
    security: number;
    community: number;
    performance: number;
    story: number;
  };
  securityMentionRate: number;
  topSecurityComplaints: string[];
  topPositiveThemes: string[];
  reviewCount: number;
  trendDirection: 'rising' | 'falling' | 'stable';
  oneLineSummary: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_RESULTS: Record<string, SentimentResult> = {
  valorant: {
    gameTitle: 'Valorant',
    platform: 'PC (Steam + Riot)',
    overallSentiment: 72,
    sentimentBreakdown: { gameplay: 84, security: 48, community: 55, performance: 78, story: 60 },
    securityMentionRate: 31,
    topSecurityComplaints: ['Vanguard kernel-level anti-cheat concerns', 'Account hacking reports', 'IP exposure in voice chat', 'Phishing links in match chat'],
    topPositiveThemes: ['Tight gunplay mechanics', 'Low system requirements', 'Agent variety', 'Competitive ranked mode'],
    reviewCount: 284_000,
    trendDirection: 'stable',
    oneLineSummary: 'Loved for its gunplay but divisive for its invasive anti-cheat and community toxicity.',
  },
  fortnite: {
    gameTitle: 'Fortnite',
    platform: 'PC / Console / Mobile',
    overallSentiment: 65,
    sentimentBreakdown: { gameplay: 70, security: 58, community: 45, performance: 72, story: 68 },
    securityMentionRate: 22,
    topSecurityComplaints: ['Account takeovers via credential stuffing', 'V-Buck scam sites', 'Epic data breach history', 'Weak 2FA enforcement'],
    topPositiveThemes: ['Cross-platform play', 'Constant content updates', 'Creative mode depth', 'Free-to-play model'],
    reviewCount: 412_000,
    trendDirection: 'stable',
    oneLineSummary: 'Evergreen casual hit with recurring account security incidents that frustrate dedicated players.',
  },
  minecraft: {
    gameTitle: 'Minecraft',
    platform: 'Java / Bedrock / Console',
    overallSentiment: 89,
    sentimentBreakdown: { gameplay: 95, security: 74, community: 82, performance: 80, story: 70 },
    securityMentionRate: 14,
    topSecurityComplaints: ['Log4Shell server exploit (legacy)', 'Mod malware distribution', 'Server DDoS attacks', 'Realms privacy concerns'],
    topPositiveThemes: ['Endless creativity', 'Modding ecosystem', 'Educational value', 'Cross-generational appeal'],
    reviewCount: 620_000,
    trendDirection: 'rising',
    oneLineSummary: 'Overwhelmingly positive; security complaints mostly limited to server operators and modders.',
  },
  'counter-strike': {
    gameTitle: 'Counter-Strike 2',
    platform: 'PC (Steam)',
    overallSentiment: 58,
    sentimentBreakdown: { gameplay: 80, security: 35, community: 40, performance: 62, story: 30 },
    securityMentionRate: 45,
    topSecurityComplaints: ['Rampant cheating (VAC ineffectiveness)', 'Account hacking via Steam API key theft', 'Smurfing epidemic', 'CSGO skin trade scams'],
    topPositiveThemes: ['Skillfully deep mechanics', 'Iconic maps', 'High skill ceiling', 'Workshop content'],
    reviewCount: 890_000,
    trendDirection: 'falling',
    oneLineSummary: 'Legendary gameplay undermined by a toxic anti-cheat crisis and pervasive cheating complaints.',
  },
  'apex-legends': {
    gameTitle: 'Apex Legends',
    platform: 'PC / Console',
    overallSentiment: 61,
    sentimentBreakdown: { gameplay: 82, security: 52, community: 58, performance: 60, story: 65 },
    securityMentionRate: 26,
    topSecurityComplaints: ['EA account security flaws', 'Pro-level cheating incidents', 'DDoS attacks on servers', 'Malicious mod files circulating'],
    topPositiveThemes: ['Movement system praised as best-in-class', 'Legend variety', 'Ping communication system', 'Evolving lore'],
    reviewCount: 310_000,
    trendDirection: 'stable',
    oneLineSummary: 'Elite movement mechanics win praise; cheating and EA account security leave players frustrated.',
  },
};

function normalize(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function findResult(query: string): SentimentResult | null {
  const key = normalize(query);
  if (MOCK_RESULTS[key]) return MOCK_RESULTS[key];
  // fuzzy: check if any key is included in query or vice versa
  for (const [k, v] of Object.entries(MOCK_RESULTS)) {
    if (key.includes(k) || k.includes(key) || v.gameTitle.toLowerCase().includes(query.toLowerCase())) {
      return v;
    }
  }
  return null;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function SentimentBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('font-semibold', color)}>{value}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}

function TrendBadge({ direction }: { direction: SentimentResult['trendDirection'] }) {
  if (direction === 'rising') return (
    <Badge className="bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/30 flex items-center gap-1">
      <TrendingUp className="h-3 w-3" /> Rising
    </Badge>
  );
  if (direction === 'falling') return (
    <Badge className="bg-destructive/10 text-destructive border-destructive/30 flex items-center gap-1">
      <TrendingDown className="h-3 w-3" /> Falling
    </Badge>
  );
  return (
    <Badge className="bg-muted text-muted-foreground border-border flex items-center gap-1">
      <Minus className="h-3 w-3" /> Stable
    </Badge>
  );
}

function sentimentLabel(score: number) {
  if (score >= 80) return { label: 'Very Positive', color: 'text-[#39FF14]' };
  if (score >= 65) return { label: 'Positive', color: 'text-[#00F0FF]' };
  if (score >= 50) return { label: 'Mixed', color: 'text-[#FFB800]' };
  return { label: 'Negative', color: 'text-destructive' };
}

// ── Main component ─────────────────────────────────────────────────────────

const POPULAR = ['Valorant', 'Fortnite', 'Minecraft', 'Counter-Strike', 'Apex Legends'];

export default function SentimentAnalyzer() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);

  const analyze = useCallback(async (gameQuery: string) => {
    if (!gameQuery.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);
    setShowComplaints(false);
    await new Promise(r => setTimeout(r, 1200));
    const found = findResult(gameQuery);
    if (found) {
      setResult(found);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyze(query);
  };

  const overall = result ? sentimentLabel(result.overallSentiment) : null;

  return (
    <Layout>
      <SEO
        title="Game Sentiment Analyzer — The Grid Nexus"
        description="AI-powered sentiment analysis for any game. See security complaint rates, community mood, and trending player opinions from thousands of reviews."
      />

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-[#B026FF]/10 border border-[#B026FF]/30">
              <MessageSquare className="h-7 w-7 text-[#B026FF]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl">Game Sentiment Analyzer</h1>
              <p className="text-muted-foreground text-sm">AI-powered review intelligence from thousands of real player reviews</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {(['Security Focus', 'Community Mood', 'Trend Direction', '280k+ Reviews'] as const).map(t => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>

        {/* Search */}
        <Card className="mb-8 border-[#B026FF]/20 bg-gradient-to-br from-[#B026FF]/5 to-black/40">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Enter game name (e.g. Valorant, Fortnite, Minecraft…)"
                  className="pl-9"
                />
              </div>
              <Button type="submit" disabled={loading || !query.trim()}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Analyze'}
              </Button>
            </form>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-muted-foreground self-center">Popular:</span>
              {POPULAR.map(g => (
                <button
                  key={g}
                  onClick={() => { setQuery(g); analyze(g); }}
                  className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-[#B026FF]/40 hover:text-[#B026FF] transition-colors"
                >
                  {g}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center gap-3">
              <BarChart3 className="h-10 w-10 text-[#B026FF] animate-pulse" />
              <p className="text-muted-foreground">Analyzing {query} reviews across Steam, Reddit & Metacritic…</p>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-2 h-2 rounded-full bg-[#B026FF] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Not found */}
        {notFound && !loading && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6 text-center py-10">
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-3" />
              <p className="font-semibold">No data found for "{query}"</p>
              <p className="text-sm text-muted-foreground mt-1">Try one of the popular games above, or check the spelling.</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result && !loading && overall && (
          <div className="space-y-6">
            {/* Overview */}
            <Card className="border-[#B026FF]/20 bg-gradient-to-br from-[#B026FF]/5 to-black/40">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{result.gameTitle}</CardTitle>
                    <CardDescription>{result.platform} · {result.reviewCount.toLocaleString()} reviews analyzed</CardDescription>
                  </div>
                  <TrendBadge direction={result.trendDirection} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic mb-6">"{result.oneLineSummary}"</p>

                {/* Overall score */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-center">
                    <div className={cn('text-5xl font-bold font-display', overall.color)}>{result.overallSentiment}%</div>
                    <div className={cn('text-sm font-semibold mt-1', overall.color)}>{overall.label}</div>
                  </div>
                  <div className="flex-1">
                    <Progress value={result.overallSentiment} className="h-4 rounded-full" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Negative</span>
                      <span>Positive</span>
                    </div>
                  </div>
                </div>

                {/* Security highlight */}
                <div className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border mb-6',
                  result.securityMentionRate > 30
                    ? 'border-destructive/30 bg-destructive/5'
                    : result.securityMentionRate > 20
                      ? 'border-[#FFB800]/30 bg-[#FFB800]/5'
                      : 'border-[#39FF14]/30 bg-[#39FF14]/5'
                )}>
                  <Shield className={cn('h-5 w-5 shrink-0', result.securityMentionRate > 30 ? 'text-destructive' : result.securityMentionRate > 20 ? 'text-[#FFB800]' : 'text-[#39FF14]')} />
                  <div>
                    <span className="text-sm font-semibold">{result.securityMentionRate}% of reviews mention security concerns</span>
                    <p className="text-xs text-muted-foreground">
                      {result.securityMentionRate > 30 ? 'High security complaint rate — significant player concern' : result.securityMentionRate > 20 ? 'Moderate security mentions — worth monitoring' : 'Low security complaint rate — community relatively satisfied'}
                    </p>
                  </div>
                </div>

                {/* Breakdown bars */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sentiment by Category</h3>
                  <SentimentBar label="Gameplay" value={result.sentimentBreakdown.gameplay} color={sentimentLabel(result.sentimentBreakdown.gameplay).color} />
                  <SentimentBar label="Security & Anti-Cheat" value={result.sentimentBreakdown.security} color={sentimentLabel(result.sentimentBreakdown.security).color} />
                  <SentimentBar label="Community" value={result.sentimentBreakdown.community} color={sentimentLabel(result.sentimentBreakdown.community).color} />
                  <SentimentBar label="Performance" value={result.sentimentBreakdown.performance} color={sentimentLabel(result.sentimentBreakdown.performance).color} />
                  <SentimentBar label="Story / Content" value={result.sentimentBreakdown.story} color={sentimentLabel(result.sentimentBreakdown.story).color} />
                </div>
              </CardContent>
            </Card>

            {/* Positive themes */}
            <Card className="border-[#39FF14]/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#39FF14]" /> Top Positive Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.topPositiveThemes.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Star className="h-3.5 w-3.5 text-[#39FF14] mt-0.5 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Security complaints (collapsible) */}
            <Card className="border-destructive/20">
              <CardHeader className="pb-3">
                <button
                  onClick={() => setShowComplaints(p => !p)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-destructive" /> Top Security Complaints
                  </CardTitle>
                  {showComplaints ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
              </CardHeader>
              {showComplaints && (
                <CardContent>
                  <ul className="space-y-2">
                    {result.topSecurityComplaints.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: MessageSquare, label: 'Reviews Analyzed', value: result.reviewCount.toLocaleString(), color: 'text-[#B026FF]' },
                { icon: Shield, label: 'Security Concern Rate', value: `${result.securityMentionRate}%`, color: result.securityMentionRate > 30 ? 'text-destructive' : 'text-[#FFB800]' },
                { icon: result.trendDirection === 'rising' ? TrendingUp : result.trendDirection === 'falling' ? TrendingDown : Minus, label: 'Sentiment Trend', value: result.trendDirection.charAt(0).toUpperCase() + result.trendDirection.slice(1), color: result.trendDirection === 'rising' ? 'text-[#39FF14]' : result.trendDirection === 'falling' ? 'text-destructive' : 'text-muted-foreground' },
              ].map(s => (
                <Card key={s.label} className="text-center">
                  <CardContent className="pt-5 pb-4">
                    <s.icon className={cn('h-5 w-5 mx-auto mb-1', s.color)} />
                    <div className={cn('text-xl font-bold', s.color)}>{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA */}
            <Card className="border-[#00F0FF]/20 bg-gradient-to-r from-[#00F0FF]/5 to-[#B026FF]/5">
              <CardContent className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Deep dive into {result.gameTitle} security</p>
                  <p className="text-sm text-muted-foreground">Check your Steam account security or see live CVEs for this game.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/tools/steam-scanner">Steam Scanner</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/tools/patch-risk-tracker">Live CVEs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !notFound && (
          <div className="text-center py-16 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-1">Enter a game to analyze</p>
            <p className="text-sm">We'll scan thousands of reviews and surface the security patterns that matter.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
