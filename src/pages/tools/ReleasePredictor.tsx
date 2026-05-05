import React, { useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ToolCrossLinks } from '@/components/tools/ToolPageSEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState, EmptyState, ErrorState } from '@/components/common/StateComponents';
import { toolRateLimiters } from '@/lib/utils/rateLimit';
import type { StatusType } from '@/lib/types/status';
import {
  Calendar, TrendingUp, TrendingDown, Minus, Clock, Shield,
  Gamepad2, ArrowLeft, RefreshCw, ChevronRight, ChevronDown,
  Info, Star, Zap, BarChart3, HelpCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────

interface ReleaseSignal {
  type: string;
  description: string;
  weight: number; // 0–100 how much this signal contributes to confidence
  status: 'confirmed' | 'rumored' | 'debunked' | 'unconfirmed';
}

interface ReleasePrediction {
  game: string;
  slug: string;
  predictedWindow: string;
  confidence: number; // 0–100
  lastUpdated: string;
  signals: ReleaseSignal[];
  totalWeight: number; // sum of all signal weights that are confirmed/rumored
  maxPossibleWeight: number; // sum of all signal weights (what 100% would be)
}

// ── Mock data with proper signal breakdown ─────────────────────────────────

const PREDICTIONS: ReleasePrediction[] = [
  {
    game: 'Grand Theft Auto VI',
    slug: 'gta-6',
    predictedWindow: 'Late 2026',
    confidence: 94,
    lastUpdated: '2026-05-01',
    totalWeight: 470,
    maxPossibleWeight: 500,
    signals: [
      { type: 'ESRB Rating Filed', description: 'ESRB rating appeared for "GTA VI" on console categories', weight: 100, status: 'confirmed' },
      { type: 'SteamDB Activity', description: 'Internal Steam build branches updated weekly since March', weight: 80, status: 'confirmed' },
      { type: 'Marketing Hires', description: 'Rockstar hired 12 senior marketing roles focused on Q3–Q4 campaigns', weight: 70, status: 'confirmed' },
      { type: 'Official Teases', description: 'Take-Two CEO mentioned "revolutionary titles" coming this fiscal year 3x in earnings calls', weight: 60, status: 'confirmed' },
      { type: 'Leak Score', description: 'Multiple trusted leakers (Tez2, Chris_S) independently confirm late 2026', weight: 80, status: 'confirmed' },
      { type: 'Dev Activity', description: 'Git activity spike on all branches, QA team expanded by 40%', weight: 80, status: 'rumored' },
    ],
  },
  {
    game: 'Elder Scrolls VI',
    slug: 'elder-scrolls-6',
    predictedWindow: '2028 (Early)',
    confidence: 68,
    lastUpdated: '2026-04-28',
    totalWeight: 340,
    maxPossibleWeight: 500,
    signals: [
      { type: 'ESRB Rating Filed', description: 'No ESRB listing found — unlikely within 12 months', weight: 100, status: 'debunked' },
      { type: 'SteamDB Activity', description: 'No public SteamDB activity detected', weight: 80, status: 'debunked' },
      { type: 'Marketing Hires', description: 'Bethesda job postings for "open world RPG" team positions — 23 listings', weight: 70, status: 'confirmed' },
      { type: 'Official Teases', description: 'Todd Howard confirmed "active development" in recent interview but no date', weight: 60, status: 'confirmed' },
      { type: 'Leak Score', description: 'Mixed — some insiders say 2027, some say 2028', weight: 40, status: 'rumored' },
      { type: 'Dev Activity', description: 'Starfield updates slowing down, team reallocation to TES VI observed', weight: 50, status: 'confirmed' },
    ],
  },
  {
    game: 'Metroid Prime 4',
    slug: 'metroid-prime-4',
    predictedWindow: 'Early 2027',
    confidence: 88,
    lastUpdated: '2026-04-30',
    totalWeight: 440,
    maxPossibleWeight: 500,
    signals: [
      { type: 'ESRB Rating Filed', description: 'ESRB rating appeared for Nintendo Switch — "Metroid Prime 4" category', weight: 100, status: 'confirmed' },
      { type: 'SteamDB Activity', description: 'Nintendo internal tracker shows "near final" build status', weight: 80, status: 'confirmed' },
      { type: 'Marketing Hires', description: 'Nintendo of America hiring for "AAA title marketing team Q1 2027"', weight: 70, status: 'confirmed' },
      { type: 'Official Teases', description: 'Nintendo Direct February 2026 showed gameplay footage with "2027" watermark', weight: 100, status: 'confirmed' },
      { type: 'Leak Score', description: 'Multiple Nintendo leakers agree on spring 2027 launch', weight: 70, status: 'confirmed' },
      { type: 'Dev Activity', description: 'Retro Studios head confirmed "polish phase" — gold master candidate testing', weight: 20, status: 'rumored' },
    ],
  },
  {
    game: 'Half-Life 3',
    slug: 'half-life-3',
    predictedWindow: '2027',
    confidence: 41,
    lastUpdated: '2026-05-02',
    totalWeight: 205,
    maxPossibleWeight: 500,
    signals: [
      { type: 'ESRB Rating Filed', description: 'No ESRB listing', weight: 100, status: 'debunked' },
      { type: 'SteamDB Activity', description: 'Valve has inactive prototype branches but no active release branch', weight: 80, status: 'unconfirmed' },
      { type: 'Marketing Hires', description: 'Valve hiring for "narrative designer" with FPS experience', weight: 70, status: 'rumored' },
      { type: 'Official Teases', description: 'Valve has not publicly acknowledged HL3 since 2020', weight: 60, status: 'debunked' },
      { type: 'Leak Score', description: 'Tyler McVicker and Gabe Follower both say HL3 is real but years away', weight: 40, status: 'rumored' },
      { type: 'Dev Activity', description: 'Source 2 engine updates include VR rendering improvements, consistent with HLX project', weight: 50, status: 'confirmed' },
    ],
  },
  {
    game: 'God of War: Ragnarok PC',
    slug: 'god-of-war-ragnarok-pc',
    predictedWindow: 'Late 2026',
    confidence: 82,
    lastUpdated: '2026-04-29',
    totalWeight: 410,
    maxPossibleWeight: 500,
    signals: [
      { type: 'ESRB Rating Filed', description: 'ESRB "God of War Ragnarök — PC" listing appeared', weight: 100, status: 'confirmed' },
      { type: 'SteamDB Activity', description: 'SteamDB shows "GodOfWarRagnarök" app created with updates', weight: 80, status: 'confirmed' },
      { type: 'Marketing Hires', description: 'Sony marketing team for "major PC port, holiday 2026"', weight: 70, status: 'confirmed' },
      { type: 'Official Teases', description: 'Sony State of Play hinted at "two major PC ports this year"', weight: 60, status: 'confirmed' },
      { type: 'Leak Score', description: 'Consistent whispers from porting studios — Nixxes is lead', weight: 50, status: 'confirmed' },
      { type: 'Dev Activity', description: 'Nixxes Software actively updating Steam depot, achievement list spotted', weight: 50, status: 'confirmed' },
    ],
  },
  {
    game: 'Silent Hill f',
    slug: 'silent-hill-f',
    predictedWindow: '2027',
    confidence: 58,
    lastUpdated: '2026-04-26',
    totalWeight: 290,
    maxPossibleWeight: 500,
    signals: [
      { type: 'ESRB Rating Filed', description: 'No ESRB listing yet', weight: 100, status: 'debunked' },
      { type: 'SteamDB Activity', description: 'SteamDB "SH-f" app receiving updates, NeoBards actively developing', weight: 80, status: 'confirmed' },
      { type: 'Marketing Hires', description: 'Konami hiring for "AAA horror marketing team"', weight: 70, status: 'rumored' },
      { type: 'Official Teases', description: 'Konami confirmed "active development" in fiscal report. No release window.', weight: 60, status: 'confirmed' },
      { type: 'Leak Score', description: 'Few leaks — project has good opsec. One source says late 2026.', weight: 30, status: 'rumored' },
      { type: 'Dev Activity', description: 'NeoBards hiring for "combat designer" — suggests gameplay work ongoing', weight: 50, status: 'confirmed' },
    ],
  },
  {
    game: 'Hollow Knight: Silksong',
    slug: 'hollow-knight-silksong',
    predictedWindow: '2027',
    confidence: 24,
    lastUpdated: '2026-04-20',
    totalWeight: 120,
    maxPossibleWeight: 500,
    signals: [
      { type: 'ESRB Rating Filed', description: 'No ESRB listing — expected but not filed', weight: 100, status: 'debunked' },
      { type: 'SteamDB Activity', description: 'No public SteamDB changes since 2023', weight: 80, status: 'unconfirmed' },
      { type: 'Marketing Hires', description: 'Team Cherry has 3 people. No marketing hires possible.', weight: 70, status: 'debunked' },
      { type: 'Official Teases', description: 'Last official update: "We\'re still working on it" — May 2023', weight: 60, status: 'unconfirmed' },
      { type: 'Leak Score', description: 'No credible leaks. Skepticism at all-time high.', weight: 40, status: 'debunked' },
      { type: 'Dev Activity', description: 'Team Cherry confirmed "scope creep" — game is much bigger than originally planned', weight: 50, status: 'confirmed' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════

export default function ReleasePredictor() {
  const [predictions, setPredictions] = useState<ReleasePrediction[]>(PREDICTIONS);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusType>('idle');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const handleRefresh = useCallback(async () => {
    if (!toolRateLimiters.releasePredictor.consume()) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      // Simulate fetching fresh predictions with minor noise
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

      const updated = predictions.map((p) => ({
        ...p,
        lastUpdated: new Date().toISOString().split('T')[0],
        confidence: Math.min(100, Math.max(0,
          p.confidence + Math.floor(Math.random() * 8) - 3
        )),
        // Slight noise on signal statuses to simulate "refreshing" intel
        signals: p.signals.map((s) => ({ ...s })),
      }));

      setPredictions(updated);
      setLastRefresh(new Date());
      setStatus('success');
    } catch (err) {
      console.error('Refresh error:', err);
      setStatus('error');
    }
  }, [predictions]);

  const toggleExpand = useCallback((slug: string) => {
    setExpanded((prev) => (prev === slug ? null : slug));
  }, []);

  const confidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const confidenceBar = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const signalStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-900/20 border-green-700';
      case 'rumored': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'debunked': return 'text-red-400 bg-red-900/20 border-red-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const signalStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'rumored': return 'Rumored';
      case 'debunked': return 'Debunked';
      default: return 'Unconfirmed';
    }
  };

  // Sort by confidence descending
  const sorted = [...predictions].sort((a, b) => b.confidence - a.confidence);

  return (
    <ErrorBoundary toolName="Release Predictor">
      <Layout>
        <SEO
          title="Gaming Release Predictor — The Grid Nexus"
          description="AI-powered game release predictions. Track confidence scores, signal analysis, and release windows for upcoming games."
        />
        <div className="min-h-screen bg-[#0B0E14] text-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
              <Link to="/tools/security-scanner" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  <Calendar className="w-7 h-7 text-[#B026FF]" />
                  Release Predictor
                </h1>
                <p className="text-gray-400 mt-1">
                  Track predicted release windows for upcoming games based on signal analysis. Updated periodically with new intel.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-gray-500">
                  Last: {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={status === 'loading'}
                  className="border-gray-700"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${status === 'loading' ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Error */}
            {status === 'error' && (
              <ErrorState
                title="Refresh rate limited"
                message="Please wait a moment before refreshing again."
              />
            )}

            {/* Loading */}
            {status === 'loading' && <LoadingState />}

            {/* Predictions */}
            <div className="space-y-4">
              {sorted.map((pred) => {
                const isExpanded = expanded === pred.slug;
                const signalCount = pred.signals.length;
                const confirmedSignals = pred.signals.filter((s) => s.status === 'confirmed').length;

                return (
                  <Card key={pred.slug} className="bg-[#131820] border-gray-800">
                    <CardContent className="pt-6">
                      {/* Main row */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <Gamepad2 className="w-8 h-8 text-[#B026FF] mt-1 shrink-0" />
                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-white">{pred.game}</h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="secondary" className="bg-[#B026FF]/10 text-[#B026FF] border-[#B026FF]/30">
                                {pred.predictedWindow}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {confirmedSignals}/{signalCount} signals confirmed
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Confidence percentage */}
                        <div className="text-right shrink-0">
                          <div className={`text-2xl font-bold ${confidenceColor(pred.confidence)}`}>
                            {Math.round(pred.confidence)}%
                          </div>
                          <p className="text-xs text-gray-500">confidence</p>
                          <Progress
                            value={pred.confidence}
                            className={`h-1.5 w-20 mt-1 bg-gray-700 ${confidenceBar(pred.confidence)}`}
                          />
                        </div>
                      </div>

                      {/* Expand/collapse toggle */}
                      <button
                        onClick={() => toggleExpand(pred.slug)}
                        className="flex items-center gap-2 mt-4 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        {isExpanded ? 'Hide signal breakdown' : 'Show signal breakdown'}
                      </button>

                      {/* Expanded signal breakdown */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-800 space-y-3">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span className="font-medium text-white flex items-center gap-1.5">
                              <BarChart3 className="w-3 h-3 text-[#B026FF]" />
                              Signal Analysis
                            </span>
                            <span>
                              Score: {pred.totalWeight}/{pred.maxPossibleWeight}
                            </span>
                          </div>
                          {pred.signals.map((signal, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-200">{signal.type}</span>
                                  <Badge className={`text-[10px] border ${signalStatusColor(signal.status)}`}>
                                    {signalStatusLabel(signal.status)}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{signal.description}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-sm font-semibold text-gray-300">{signal.weight}</div>
                                <Progress value={signal.weight} className="h-1 w-12 bg-gray-700" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Methodology footer */}
            <div className="text-center">
              <Link
                to="/tools/release-predictor/methodology"
                className="inline-flex items-center gap-1.5 text-sm text-[#B026FF] hover:text-[#B026FF]/80 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                How We Score Releases — Methodology
              </Link>
            </div>
          </div>
        </div>
        <ToolCrossLinks related={[
            "/tools/sentiment-analyzer",
            "/tools/news-personalizer",
            "/tools/recommendation-engine",
            "/tools/patch-risk-tracker",
          ]} />
      </Layout>
    </ErrorBoundary>
  );
}
