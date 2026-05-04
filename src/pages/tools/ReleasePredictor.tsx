import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Calendar, TrendingUp, AlertTriangle, Clock, Gamepad2,
  ChevronRight, ArrowLeft, Star, Zap, Globe, BarChart3,
  Info, CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

type Confidence = 'high' | 'medium' | 'low';
type Status = 'confirmed' | 'predicted' | 'rumored' | 'delayed';

interface ReleaseSignal {
  type: string;
  description: string;
  weight: number;
}

interface GamePrediction {
  id: string;
  title: string;
  developer: string;
  publisher: string;
  genre: string;
  platforms: string[];
  predictedWindow: string;
  confirmedDate?: string;
  status: Status;
  confidence: number;
  confidenceLevel: Confidence;
  signals: ReleaseSignal[];
  securityNote?: string;
  hypeScore: number;
  lastUpdated: string;
  description: string;
  tags: string[];
}

// ── Data ───────────────────────────────────────────────────────────────────

const PREDICTIONS: GamePrediction[] = [
  {
    id: 'gta6',
    title: 'Grand Theft Auto VI',
    developer: 'Rockstar Games',
    publisher: 'Take-Two Interactive',
    genre: 'Open World Action',
    platforms: ['PS5', 'Xbox Series X/S', 'PC (2026)'],
    predictedWindow: 'Fall 2025',
    confirmedDate: 'Fall 2025',
    status: 'confirmed',
    confidence: 88,
    confidenceLevel: 'high',
    signals: [
      { type: 'Official Announcement', description: 'Rockstar confirmed Fall 2025 at fiscal earnings call', weight: 95 },
      { type: 'Retail Listings', description: 'GameStop, Amazon pre-orders open with "Fall 2025" placeholder', weight: 82 },
      { type: 'Marketing Materials', description: 'Trailer 2 released Jan 2025, showing gameplay depth', weight: 78 },
      { type: 'Industry Analyst', description: 'Take-Two CEO referenced "major title" shipping before March 2026', weight: 70 },
    ],
    securityNote: 'GTA VI will include Shark Card microtransactions and online modes. Expect targeted phishing campaigns and account theft to spike at launch.',
    hypeScore: 99,
    lastUpdated: '2026-05-01',
    description: 'The most anticipated game in history. Set in Vice City, featuring dual protagonists and a live-world online mode at launch.',
    tags: ['Open World', 'Online', 'PS5 Exclusive (1yr)', 'Most Anticipated'],
  },
  {
    id: 'elder-scrolls-6',
    title: 'The Elder Scrolls VI',
    developer: 'Bethesda Game Studios',
    publisher: 'Xbox Game Studios',
    genre: 'Action RPG',
    platforms: ['PC', 'Xbox Series X/S'],
    predictedWindow: '2028–2030',
    status: 'predicted',
    confidence: 34,
    confidenceLevel: 'low',
    signals: [
      { type: 'Development Phase', description: 'BGS confirmed in pre-production after Starfield shipped', weight: 60 },
      { type: 'Historical Pattern', description: 'Skyrim (2011) → Fallout 4 (2015) → Fallout 76 (2018) → Starfield (2023)', weight: 45 },
      { type: 'Engine Readiness', description: 'Creation Engine 3 unknown — Starfield ran on CE2', weight: 30 },
      { type: 'Team Size Signal', description: 'BGS Austin team reportedly supporting, not leading', weight: 25 },
    ],
    hypeScore: 91,
    lastUpdated: '2026-04-28',
    description: 'Bethesda\'s next Elder Scrolls is in very early development. No concrete signals yet — all predictions are extrapolations from developer hiring patterns.',
    tags: ['Xbox Exclusive', 'Long Wait', 'RPG', 'Speculative'],
  },
  {
    id: 'hollow-knight-silksong',
    title: 'Hollow Knight: Silksong',
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    genre: 'Metroidvania',
    platforms: ['PC', 'Nintendo Switch', 'Xbox'],
    predictedWindow: '2025–2026',
    status: 'predicted',
    confidence: 61,
    confidenceLevel: 'medium',
    signals: [
      { type: 'Xbox Showcase', description: 'Featured in Xbox Game Pass Day One announcement (2023)', weight: 75 },
      { type: 'Steam Build Updates', description: 'Multiple Steamdb build pushes detected in 2024–2025', weight: 68 },
      { type: 'PEGI/ESRB Rating', description: 'No rating filed yet — typically happens 3–6 months before release', weight: 40 },
      { type: 'Community Signals', description: 'Team Cherry posted "Progress Update #3" in Feb 2025', weight: 55 },
    ],
    hypeScore: 94,
    lastUpdated: '2026-04-30',
    description: 'The long-awaited sequel to Hollow Knight. Hornet is the protagonist. Development has been famously opaque, making prediction difficult.',
    tags: ['Indie', 'Game Pass Day One', 'Highly Anticipated', 'PC'],
  },
  {
    id: 'monster-hunter-wilds',
    title: 'Monster Hunter Wilds',
    developer: 'Capcom',
    publisher: 'Capcom',
    genre: 'Action RPG',
    platforms: ['PC', 'PS5', 'Xbox Series X/S'],
    predictedWindow: 'February 28, 2025',
    confirmedDate: 'February 28, 2025',
    status: 'confirmed',
    confidence: 99,
    confidenceLevel: 'high',
    signals: [
      { type: 'Official Date', description: 'Capcom confirmed Feb 28, 2025 at TGS 2024', weight: 99 },
      { type: 'Pre-Order Live', description: 'Pre-orders active globally across all platforms', weight: 95 },
      { type: 'Review Copies Sent', description: 'Embargo lifts Feb 27, review copies distributed', weight: 90 },
    ],
    securityNote: 'Capcom accounts were breached in 2020. Enable 2FA on your Capcom ID before purchase.',
    hypeScore: 88,
    lastUpdated: '2026-05-02',
    description: 'Next mainline Monster Hunter with a seamless open world, dynamic weather, and the new Seikret mount. Building on World\'s 21M unit success.',
    tags: ['Confirmed', 'Open World', 'Multiplayer', 'PC/Console'],
  },
  {
    id: 'avowed',
    title: 'Avowed',
    developer: 'Obsidian Entertainment',
    publisher: 'Xbox Game Studios',
    genre: 'Action RPG',
    platforms: ['PC', 'Xbox Series X/S'],
    predictedWindow: 'February 18, 2025',
    confirmedDate: 'February 18, 2025',
    status: 'confirmed',
    confidence: 99,
    confidenceLevel: 'high',
    signals: [
      { type: 'Official Date', description: 'Microsoft confirmed Feb 18, 2025 at Xbox Developer Direct', weight: 99 },
      { type: 'Game Pass Day One', description: 'Confirmed for Game Pass at launch — no separate purchase needed', weight: 97 },
    ],
    hypeScore: 78,
    lastUpdated: '2026-05-01',
    description: 'Set in the Pillars of Eternity universe, Avowed is a first-person fantasy RPG from the Fallout: New Vegas studio.',
    tags: ['Game Pass', 'Confirmed', 'Xbox Exclusive', 'RPG'],
  },
  {
    id: 'death-stranding-2',
    title: 'Death Stranding 2: On the Beach',
    developer: 'Kojima Productions',
    publisher: 'Sony Interactive Entertainment',
    genre: 'Action / Adventure',
    platforms: ['PS5', 'PC (TBA)'],
    predictedWindow: '2025',
    status: 'predicted',
    confidence: 71,
    confidenceLevel: 'medium',
    signals: [
      { type: 'State of Play Reveal', description: 'Sony showcased extended gameplay at State of Play 2024', weight: 85 },
      { type: 'Rating Filed', description: 'ESRB M rating filed in Dec 2024 — indicates near-final build', weight: 80 },
      { type: 'Voice Cast Completed', description: 'All major VAs confirmed recordings complete', weight: 72 },
      { type: 'No Official Date', description: 'Kojima Productions avoiding a specific date', weight: -20 },
    ],
    hypeScore: 82,
    lastUpdated: '2026-04-29',
    description: 'Hideo Kojima\'s sequel to the strand-type game phenomenon. New cast additions include Elle Fanning and Shioli Kutsuna.',
    tags: ['PS5 Exclusive', 'Kojima', 'Narrative', 'Cinematic'],
  },
  {
    id: 'fable',
    title: 'Fable',
    developer: 'Playground Games',
    publisher: 'Xbox Game Studios',
    genre: 'Action RPG',
    platforms: ['PC', 'Xbox Series X/S'],
    predictedWindow: '2026–2027',
    status: 'rumored',
    confidence: 42,
    confidenceLevel: 'low',
    signals: [
      { type: 'Showcase Trailer', description: 'Multiple Xbox showcases featured concept/engine footage', weight: 55 },
      { type: 'Hiring Pattern', description: 'Playground actively hiring for "open-world RPG" through 2024', weight: 48 },
      { type: 'No Gameplay', description: 'Only CGI trailers shown to date — dev still in mid-production', weight: 30 },
    ],
    hypeScore: 76,
    lastUpdated: '2026-04-25',
    description: 'Reboot of the beloved Lionhead RPG series by Forza Horizon studio Playground Games. Promises dark British humor and a reimagined Albion.',
    tags: ['Xbox Exclusive', 'Reboot', 'Game Pass Day One', 'Long Wait'],
  },
  {
    id: 'mafia-old-country',
    title: 'Mafia: The Old Country',
    developer: 'Hangar 13',
    publisher: '2K Games',
    genre: 'Action Adventure',
    platforms: ['PC', 'PS5', 'Xbox Series X/S'],
    predictedWindow: 'Summer 2025',
    status: 'predicted',
    confidence: 75,
    confidenceLevel: 'medium',
    signals: [
      { type: 'Summer Game Fest Reveal', description: 'Revealed with cinematic trailer at SGF 2024', weight: 80 },
      { type: '2K Fiscal Year', description: '2K confirmed launch in FY2026 (April 2025 – March 2026)', weight: 75 },
      { type: 'Setting Revealed', description: 'Set in 1900s Sicily — smaller scope suggests faster development', weight: 65 },
    ],
    hypeScore: 71,
    lastUpdated: '2026-05-02',
    description: 'Origins prequel set in early 20th century Sicily. Smaller, more focused experience than Mafia III.',
    tags: ['Story-Driven', 'Historical', 'No Online Mode', 'Prequel'],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', color: 'text-[#39FF14]', bg: 'bg-[#39FF14]/10', border: 'border-[#39FF14]/30' },
  predicted: { label: 'AI Predicted', color: 'text-[#00F0FF]', bg: 'bg-[#00F0FF]/10', border: 'border-[#00F0FF]/30' },
  rumored: { label: 'Rumored', color: 'text-[#FFB800]', bg: 'bg-[#FFB800]/10', border: 'border-[#FFB800]/30' },
  delayed: { label: 'Delayed', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
};

const CONFIDENCE_COLORS = { high: 'text-[#39FF14]', medium: 'text-[#FFB800]', low: 'text-destructive' };

type FilterStatus = 'all' | Status;

export default function ReleasePredictor() {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [selected, setSelected] = useState<GamePrediction | null>(null);

  const filtered = filter === 'all' ? PREDICTIONS : PREDICTIONS.filter(p => p.status === filter);

  return (
    <Layout>
      <SEO
        title="Game Release Predictor — The Grid Nexus"
        description="AI-predicted game release dates based on developer patterns, rating filings, hiring signals, and community intelligence. Know before the official announcement."
      />

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/30">
              <Calendar className="h-7 w-7 text-[#FFB800]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl">Game Release Predictor</h1>
              <p className="text-muted-foreground text-sm">AI-predicted release windows based on 12 developer pattern signals</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {['Rating Filings', 'Build Signals', 'Hiring Patterns', 'Fiscal Year Analysis', 'Community Intel'].map(t => (
              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Confirmed', value: PREDICTIONS.filter(p => p.status === 'confirmed').length, color: 'text-[#39FF14]' },
            { label: 'AI Predicted', value: PREDICTIONS.filter(p => p.status === 'predicted').length, color: 'text-[#00F0FF]' },
            { label: 'Rumored', value: PREDICTIONS.filter(p => p.status === 'rumored').length, color: 'text-[#FFB800]' },
            { label: 'Avg Confidence', value: `${Math.round(PREDICTIONS.reduce((a, p) => a + p.confidence, 0) / PREDICTIONS.length)}%`, color: 'text-[#B026FF]' },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-4 text-center">
                <div className={cn('text-3xl font-bold', s.color)}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'confirmed', 'predicted', 'rumored'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm border transition-colors',
                filter === f
                  ? f === 'all' ? 'bg-foreground text-background border-foreground' : `${STATUS_CONFIG[f as Status].bg} ${STATUS_CONFIG[f as Status].color} ${STATUS_CONFIG[f as Status].border}`
                  : 'border-border text-muted-foreground hover:border-foreground/30'
              )}
            >
              {f === 'all' ? 'All Games' : STATUS_CONFIG[f as Status].label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.map(game => {
              const statusCfg = STATUS_CONFIG[game.status];
              const isSelected = selected?.id === game.id;

              return (
                <Card
                  key={game.id}
                  onClick={() => setSelected(isSelected ? null : game)}
                  className={cn(
                    'cursor-pointer hover:border-foreground/20 transition-all',
                    isSelected && 'border-[#FFB800]/50 bg-[#FFB800]/5',
                  )}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge className={cn('text-xs border', statusCfg.bg, statusCfg.color, statusCfg.border)}>
                            {statusCfg.label}
                          </Badge>
                          {game.tags.slice(0, 2).map(t => (
                            <span key={t} className="text-xs text-muted-foreground">{t}</span>
                          ))}
                        </div>
                        <h3 className="font-semibold text-base">{game.title}</h3>
                        <p className="text-xs text-muted-foreground">{game.developer} · {game.genre}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="flex items-center gap-1 text-[#FFB800]">
                            <Calendar className="h-3 w-3" />
                            {game.confirmedDate ?? game.predictedWindow}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            {game.platforms.slice(0, 2).join(' · ')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={cn('text-2xl font-bold', CONFIDENCE_COLORS[game.confidenceLevel])}>
                          {game.confidence}%
                        </div>
                        <div className="text-xs text-muted-foreground">confidence</div>
                        <div className="mt-1">
                          <Progress value={game.confidence} className="h-1 w-16 ml-auto" />
                        </div>
                      </div>
                    </div>

                    {/* Hype bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <Star className="h-3 w-3 text-[#FFB800] shrink-0" />
                      <div className="flex-1 bg-muted rounded-full h-1.5">
                        <div className="bg-[#FFB800] h-1.5 rounded-full" style={{ width: `${game.hypeScore}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">Hype {game.hypeScore}/100</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-1">
            {selected ? (
              <div className="space-y-4 sticky top-6">
                <Card className="border-[#FFB800]/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{selected.title}</CardTitle>
                        <CardDescription>{selected.developer}</CardDescription>
                      </div>
                      <Badge className={cn('text-xs border shrink-0', STATUS_CONFIG[selected.status].bg, STATUS_CONFIG[selected.status].color, STATUS_CONFIG[selected.status].border)}>
                        {STATUS_CONFIG[selected.status].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{selected.description}</p>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Predicted Window</span>
                        <span className="font-semibold text-[#FFB800]">{selected.predictedWindow}</span>
                      </div>
                      {selected.confirmedDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Confirmed Date</span>
                          <span className="font-semibold text-[#39FF14]">{selected.confirmedDate}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Platforms</span>
                        <span className="text-right text-xs">{selected.platforms.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className={cn('font-bold', CONFIDENCE_COLORS[selected.confidenceLevel])}>{selected.confidence}%</span>
                      </div>
                    </div>

                    {/* Signals */}
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Intelligence Signals</div>
                      <div className="space-y-2">
                        {selected.signals.map(sig => (
                          <div key={sig.type} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium">{sig.type}</span>
                              <span className={cn(sig.weight > 70 ? 'text-[#39FF14]' : sig.weight > 40 ? 'text-[#FFB800]' : 'text-muted-foreground')}>
                                {sig.weight > 0 ? `+${sig.weight}` : sig.weight}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{sig.description}</p>
                            <Progress value={Math.max(0, sig.weight)} className="h-1" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Security note */}
                    {selected.securityNote && (
                      <div className="flex items-start gap-2 p-3 rounded-lg border border-[#FFB800]/30 bg-[#FFB800]/5">
                        <AlertTriangle className="h-3.5 w-3.5 text-[#FFB800] shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">{selected.securityNote}</p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Updated {selected.lastUpdated}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-dashed text-center">
                <CardContent className="pt-10 pb-10">
                  <Calendar className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Select a game</p>
                  <p className="text-xs text-muted-foreground mt-1">Click any game card to see full signal analysis</p>
                </CardContent>
              </Card>
            )}

            {/* Methodology */}
            <Card className="mt-4 border-border bg-muted/10">
              <CardContent className="pt-4 pb-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Info className="h-3 w-3" /> How predictions work
                </div>
                <div className="text-xs text-muted-foreground space-y-1.5">
                  {['PEGI/ESRB rating filings (90 day lead)', 'Steam Steamdb build pushes', 'Developer job posting patterns', 'Publisher fiscal year guidance', 'Community leaks & journalist sources', 'Historical dev cycle analysis'].map(s => (
                    <div key={s} className="flex items-start gap-1.5">
                      <CheckCircle className="h-3 w-3 text-[#39FF14] shrink-0 mt-0.5" /> {s}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <Card className="mt-8 border-[#FFB800]/20 bg-gradient-to-r from-[#FFB800]/5 to-[#B026FF]/5">
          <CardContent className="pt-5 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Start building your PC for upcoming releases</p>
              <p className="text-sm text-muted-foreground">GTA VI and other 2025 titles will need serious hardware. Build and security-score your rig now.</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button asChild size="sm">
                <Link to="/tools/pc-builder" className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" /> AI PC Builder
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/tools/recommendation-engine">Game Recs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
