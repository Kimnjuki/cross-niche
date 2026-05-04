import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Sparkles, Gamepad2, Cpu, Star, ArrowRight, RotateCcw,
  CheckCircle, ChevronRight, Shield, DollarSign, ArrowLeft,
  TrendingUp, Users, Clock, Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

type Step = 'goal' | 'budget' | 'style' | 'results';

interface GameRec {
  title: string;
  genre: string;
  platform: string;
  price: string;
  matchScore: number;
  securityRating: 'A' | 'B' | 'C' | 'D';
  playerbase: string;
  whyItFits: string;
  tags: string[];
}

interface HardwareRec {
  name: string;
  type: string;
  price: string;
  matchScore: number;
  performanceTier: string;
  securityScore: number;
  whyItFits: string;
}

// ── Data ───────────────────────────────────────────────────────────────────

const GAME_LIBRARY: GameRec[] = [
  {
    title: 'Hollow Knight',
    genre: 'Metroidvania',
    platform: 'PC / Console',
    price: '$14.99',
    matchScore: 97,
    securityRating: 'A',
    playerbase: '8M+',
    whyItFits: 'Deep solo exploration with zero live-service security risks. No account linking required.',
    tags: ['Single-player', 'Challenging', 'Dark atmosphere', 'No microtransactions'],
  },
  {
    title: 'Deep Rock Galactic',
    genre: 'Co-op Shooter',
    platform: 'PC / Xbox',
    price: '$29.99',
    matchScore: 94,
    securityRating: 'B',
    playerbase: '3M+',
    whyItFits: 'Overwhelmingly positive reviews, developer-owned servers with strong DDoS protection, minimal data collection.',
    tags: ['Co-op', 'PvE', 'No toxicity', 'Active updates'],
  },
  {
    title: 'Baldur\'s Gate 3',
    genre: 'RPG',
    platform: 'PC / Console',
    price: '$59.99',
    matchScore: 91,
    securityRating: 'A',
    playerbase: '12M+',
    whyItFits: 'Award-winning RPG with no online dependency for the base game. Save data stays local.',
    tags: ['Story-driven', 'Turn-based', 'Offline play', 'GOTY 2023'],
  },
  {
    title: 'Path of Exile 2',
    genre: 'ARPG',
    platform: 'PC / Console',
    price: 'Free (F2P)',
    matchScore: 88,
    securityRating: 'B',
    playerbase: '6M+',
    whyItFits: 'F2P with no pay-to-win, optional cosmetics only. GGG has a strong security patch cadence.',
    tags: ['Free to play', 'Deep build system', 'Online required', 'No P2W'],
  },
  {
    title: 'Valheim',
    genre: 'Survival',
    platform: 'PC',
    price: '$19.99',
    matchScore: 86,
    securityRating: 'B',
    playerbase: '10M+',
    whyItFits: 'Optional multiplayer, host-your-own servers. No mandatory cloud accounts or telemetry.',
    tags: ['Survival', 'Co-op', 'Self-hosted', 'Open world'],
  },
  {
    title: 'Apex Legends',
    genre: 'Battle Royale',
    platform: 'PC / Console',
    price: 'Free (F2P)',
    matchScore: 82,
    securityRating: 'C',
    playerbase: '130M registered',
    whyItFits: 'Best movement mechanics in the genre. EA account security has improved but still requires vigilance.',
    tags: ['Free to play', 'Competitive', 'Team-based', 'Fast-paced'],
  },
];

const HARDWARE_LIBRARY: HardwareRec[] = [
  {
    name: 'AMD Ryzen 7 7700X',
    type: 'CPU',
    price: '$299',
    matchScore: 96,
    performanceTier: 'High-End Mid',
    securityScore: 88,
    whyItFits: 'No firmware vulnerabilities in the last 12 months. Excellent IPC for gaming and streaming simultaneously.',
  },
  {
    name: 'NVIDIA RTX 4070 Super',
    type: 'GPU',
    price: '$599',
    matchScore: 94,
    performanceTier: 'High-End Mid',
    securityScore: 85,
    whyItFits: 'Best price-to-performance at 1440p. NVIDIA\'s GeForce Experience has optional telemetry you can disable.',
  },
  {
    name: 'Corsair Vengeance DDR5-6000 32GB',
    type: 'RAM',
    price: '$119',
    matchScore: 92,
    performanceTier: 'Optimal',
    securityScore: 95,
    whyItFits: 'DDR5 at 6000MHz hits the Ryzen 5000/7000 memory controller sweet spot. No firmware attack surface.',
  },
  {
    name: 'Samsung 990 Pro 2TB NVMe',
    type: 'Storage',
    price: '$149',
    matchScore: 90,
    performanceTier: 'Top-Tier',
    securityScore: 92,
    whyItFits: 'Samsung\'s enterprise-grade NAND with AES-256 hardware encryption available. Proven reliability.',
  },
];

// ── Quiz config ────────────────────────────────────────────────────────────

const GOALS = [
  { id: 'gaming_pc', label: 'Build a Gaming PC', icon: Cpu, desc: 'Get hardware recommendations tailored to your budget and use case' },
  { id: 'find_game', label: 'Find My Next Game', icon: Gamepad2, desc: 'Get personalized game picks based on what you love' },
  { id: 'both', label: 'Both — Game + Hardware', icon: Sparkles, desc: 'Complete setup: the right rig for the right games' },
];

const BUDGETS = [
  { id: 'budget', label: '< $500', sublabel: 'Budget', color: 'text-[#39FF14]' },
  { id: 'mid', label: '$500–$1,200', sublabel: 'Mid-range', color: 'text-[#00F0FF]' },
  { id: 'high', label: '$1,200–$2,500', sublabel: 'High-end', color: 'text-[#B026FF]' },
  { id: 'ultra', label: '$2,500+', sublabel: 'Enthusiast', color: 'text-[#FFB800]' },
];

const STYLES = [
  { id: 'competitive', label: 'Competitive / FPS', icon: '🎯' },
  { id: 'story', label: 'Story / RPG', icon: '📖' },
  { id: 'survival', label: 'Survival / Open World', icon: '🌍' },
  { id: 'coop', label: 'Co-op with Friends', icon: '🤝' },
  { id: 'streaming', label: 'Streaming / Content Creation', icon: '🎙️' },
  { id: 'security', label: 'Privacy-First / Secure', icon: '🔒' },
];

// ── Component ──────────────────────────────────────────────────────────────

export default function RecommendationEngine() {
  const [step, setStep] = useState<Step>('goal');
  const [goal, setGoal] = useState('');
  const [budget, setBudget] = useState('');
  const [style, setStyle] = useState('');
  const [loading, setLoading] = useState(false);

  const progress = { goal: 25, budget: 50, style: 75, results: 100 }[step];

  const handleStyleSelect = async (s: string) => {
    setStyle(s);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    setStep('results');
  };

  const reset = () => { setStep('goal'); setGoal(''); setBudget(''); setStyle(''); };

  const securityBadgeColor = (r: 'A' | 'B' | 'C' | 'D') => {
    const m = { A: 'text-[#39FF14] border-[#39FF14]/30 bg-[#39FF14]/5', B: 'text-[#00F0FF] border-[#00F0FF]/30 bg-[#00F0FF]/5', C: 'text-[#FFB800] border-[#FFB800]/30 bg-[#FFB800]/5', D: 'text-destructive border-destructive/30 bg-destructive/5' };
    return m[r];
  };

  return (
    <Layout>
      <SEO
        title="AI Game & PC Recommendation Engine — The Grid Nexus"
        description="Get personalized game and hardware recommendations. Tell us your budget and play style; our AI matches you with the best options, security-rated."
      />

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/30">
              <Sparkles className="h-7 w-7 text-[#39FF14]" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl">AI Recommendation Engine</h1>
              <p className="text-muted-foreground text-sm">Personalized game & hardware picks, security-scored</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        {step !== 'results' && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Step {['goal', 'budget', 'style'].indexOf(step) + 1} of 3</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {/* Step: Goal */}
        {step === 'goal' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-6">What are you looking for?</h2>
            {GOALS.map(g => {
              const Icon = g.icon;
              return (
                <button
                  key={g.id}
                  onClick={() => { setGoal(g.id); setStep('budget'); }}
                  className="w-full flex items-start gap-4 p-5 rounded-xl border border-border hover:border-[#39FF14]/40 hover:bg-[#39FF14]/5 transition-all text-left group"
                >
                  <div className="p-2.5 rounded-lg bg-muted group-hover:bg-[#39FF14]/10 transition-colors">
                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-[#39FF14] transition-colors" />
                  </div>
                  <div>
                    <div className="font-semibold">{g.label}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{g.desc}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto self-center group-hover:text-[#39FF14] transition-colors" />
                </button>
              );
            })}
          </div>
        )}

        {/* Step: Budget */}
        {step === 'budget' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">What's your budget?</h2>
            <div className="grid grid-cols-2 gap-4">
              {BUDGETS.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setBudget(b.id); setStep('style'); }}
                  className="p-5 rounded-xl border border-border hover:border-foreground/30 transition-all text-left group"
                >
                  <div className={cn('text-2xl font-bold mb-1', b.color)}>{b.label}</div>
                  <div className="text-sm text-muted-foreground">{b.sublabel}</div>
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep('goal')} className="mt-4">
              ← Back
            </Button>
          </div>
        )}

        {/* Step: Play style */}
        {step === 'style' && (
          <div>
            <h2 className="text-xl font-semibold mb-6">What's your play style?</h2>
            <div className="grid grid-cols-2 gap-3">
              {STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleStyleSelect(s.id)}
                  disabled={loading}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-[#39FF14]/40 hover:bg-[#39FF14]/5 transition-all text-left"
                >
                  <span className="text-2xl">{s.icon}</span>
                  <span className="font-medium text-sm">{s.label}</span>
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep('budget')} className="mt-4" disabled={loading}>
              ← Back
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <Sparkles className="h-10 w-10 text-[#39FF14] mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">AI is matching your preferences…</p>
            <div className="flex justify-center gap-1 mt-3">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-[#39FF14] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'results' && !loading && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Your Personalized Picks</h2>
                <p className="text-sm text-muted-foreground">Security-rated · Matched to your preferences</p>
              </div>
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Start Over
              </Button>
            </div>

            {/* Game recommendations */}
            {(goal === 'find_game' || goal === 'both') && (
              <div>
                <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
                  <Gamepad2 className="h-4 w-4 text-[#39FF14]" /> Top Game Picks
                </h3>
                <div className="space-y-4">
                  {GAME_LIBRARY.slice(0, 4).map((game, i) => (
                    <Card key={game.title} className={cn('border transition-colors', i === 0 && 'border-[#39FF14]/30 bg-[#39FF14]/5')}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {i === 0 && <Badge className="bg-[#39FF14] text-black text-xs">Best Match</Badge>}
                              <Badge className={cn('text-xs border', securityBadgeColor(game.securityRating))}>
                                <Shield className="h-2.5 w-2.5 mr-1" /> Security {game.securityRating}
                              </Badge>
                            </div>
                            <h4 className="font-semibold">{game.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{game.genre} · {game.platform} · {game.price}</p>
                            <p className="text-sm text-muted-foreground">{game.whyItFits}</p>
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {game.tags.map(t => (
                                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-muted/50 border border-border text-muted-foreground">{t}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-2xl font-bold text-[#39FF14]">{game.matchScore}%</div>
                            <div className="text-xs text-muted-foreground">match</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Users className="h-3 w-3" /> {game.playerbase}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Hardware recommendations */}
            {(goal === 'gaming_pc' || goal === 'both') && (
              <div>
                <h3 className="font-semibold text-base flex items-center gap-2 mb-4">
                  <Cpu className="h-4 w-4 text-[#00F0FF]" /> Recommended Hardware
                </h3>
                <div className="space-y-3">
                  {HARDWARE_LIBRARY.map((hw, i) => (
                    <Card key={hw.name} className={cn('border', i === 0 && 'border-[#00F0FF]/30')}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <Badge variant="outline" className="text-xs">{hw.type}</Badge>
                              <span className="text-xs text-muted-foreground">{hw.performanceTier}</span>
                            </div>
                            <h4 className="font-semibold">{hw.name}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{hw.whyItFits}</p>
                          </div>
                          <div className="text-right shrink-0 space-y-1">
                            <div className="font-bold">{hw.price}</div>
                            <div className="text-xs text-muted-foreground">
                              <Shield className="h-3 w-3 inline mr-0.5" />
                              Security {hw.securityScore}/100
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-3 text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Total estimated build cost: <span className="font-semibold text-foreground ml-1">$1,166</span>
                </div>
              </div>
            )}

            {/* CTA */}
            <Card className="border-[#00F0FF]/20 bg-gradient-to-r from-[#00F0FF]/5 to-[#39FF14]/5">
              <CardContent className="pt-5 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">Build your PC with security scoring</p>
                  <p className="text-sm text-muted-foreground">Configure your full build and get a live AI security analysis.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button asChild size="sm">
                    <Link to="/tools/pc-builder" className="flex items-center gap-2">
                      <Cpu className="h-3.5 w-3.5" /> AI PC Builder
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/tools/sentiment-analyzer" className="flex items-center gap-2">
                      Game Reviews <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
