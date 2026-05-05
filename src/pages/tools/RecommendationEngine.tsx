import React, { useState, useCallback, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ToolCrossLinks } from '@/components/tools/ToolPageSEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingState, ErrorState, EmptyState } from '@/components/common/StateComponents';
import { GAME_LIBRARY } from '@/lib/data/gameLibrary';
import { scoreGames, BUDGET_LABELS, type ScoredGame } from '@/lib/scoring/recommendationScorer';
import { toolRateLimiters } from '@/lib/utils/rateLimit';
import type { StatusType } from '@/lib/types/status';
import type { GameEntry } from '@/lib/data/gameLibrary';
import {
  Gamepad2, Search, Cpu, Crosshair, Zap,
  Star, Shield, ChevronRight, Sparkles, Info,
  Monitor, ArrowLeft, Lightbulb, CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────

type Goal = 'gaming_pc' | 'find_game' | 'both';
type Budget = 'budget' | 'mid' | 'high' | 'ultra';

interface BuildComponent {
  type: string;
  suggestion: string;
  note: string;
}

interface HardwareBuild {
  cpu: BuildComponent;
  gpu: BuildComponent;
  ram: BuildComponent;
  storage: BuildComponent;
  psu: BuildComponent;
  estimatedCost: string;
  note: string;
}

const HARDWARE_BUILDS: Record<Budget, HardwareBuild> = {
  budget: {
    cpu: { type: 'CPU', suggestion: 'AMD Ryzen 5 5600 / Intel i5-12400F', note: 'Best value for 1080p gaming' },
    gpu: { type: 'GPU', suggestion: 'NVIDIA RTX 4060 / AMD RX 7600', note: 'Solid 1080p performance, DLSS 3 support' },
    ram: { type: 'RAM', suggestion: '16GB DDR4-3200', note: 'Sufficient for most titles' },
    storage: { type: 'Storage', suggestion: '1TB NVMe SSD', note: 'Fast load times, 1TB is the sweet spot' },
    psu: { type: 'PSU', suggestion: '550W 80+ Bronze', note: 'Reliable and efficient' },
    estimatedCost: '~$700–900',
    note: 'Great entry-level build. Upgrade GPU first when budget allows.',
  },
  mid: {
    cpu: { type: 'CPU', suggestion: 'AMD Ryzen 7 7800X3D', note: 'Best gaming CPU on the market' },
    gpu: { type: 'GPU', suggestion: 'NVIDIA RTX 4070 Super / AMD RX 7800 XT', note: 'Excellent 1440p performance' },
    ram: { type: 'RAM', suggestion: '32GB DDR5-6000', note: 'Future-proof, great for streaming' },
    storage: { type: 'Storage', suggestion: '2TB NVMe SSD', note: 'Gen 4 speeds, plenty of space' },
    psu: { type: 'PSU', suggestion: '750W 80+ Gold', note: 'Room for upgrades' },
    estimatedCost: '~$1,300–1,700',
    note: 'The sweet spot. Handles 1440p max settings and entry-level 4K.',
  },
  high: {
    cpu: { type: 'CPU', suggestion: 'AMD Ryzen 9 7950X3D / Intel i9-14900K', note: 'No compromises' },
    gpu: { type: 'GPU', suggestion: 'NVIDIA RTX 5080 / AMD RX 9070 XT', note: '4K gaming beast' },
    ram: { type: 'RAM', suggestion: '32GB DDR5-6400', note: 'Fastest available' },
    storage: { type: 'Storage', suggestion: '2TB Gen 5 NVMe SSD', note: 'Blazing fast load times' },
    psu: { type: 'PSU', suggestion: '1000W 80+ Gold', note: 'Headroom for upgrades' },
    estimatedCost: '~$2,500–3,500',
    note: 'Top-tier gaming. 4K max settings, high refresh rate, streaming + gaming simultaneously.',
  },
  ultra: {
    cpu: { type: 'CPU', suggestion: 'AMD Ryzen 9 9950X3D', note: 'Absolute best in class' },
    gpu: { type: 'GPU', suggestion: 'NVIDIA RTX 5090', note: 'The ultimate GPU, period' },
    ram: { type: 'RAM', suggestion: '64GB DDR5-8000', note: 'Overkill but why not' },
    storage: { type: 'Storage', suggestion: '4TB Gen 5 NVMe SSD', note: 'Massive, fast storage' },
    psu: { type: 'PSU', suggestion: '1200W 80+ Titanium', note: 'Future-proof and efficient' },
    estimatedCost: '~$4,000+',
    note: 'No budget constraints. Best of everything. Consider custom water cooling.',
  },
};

// ── Game style options ─────────────────────────────────────────────────────

const STYLE_OPTIONS = [
  { id: 'action', label: 'Action / Combat', icon: '⚔️' },
  { id: 'rpg', label: 'RPG / Story', icon: '📖' },
  { id: 'strategy', label: 'Strategy / Tactics', icon: '🧠' },
  { id: 'simulation', label: 'Simulation / Sandbox', icon: '🏗️' },
  { id: 'multiplayer', label: 'Multiplayer / Co-op', icon: '👥' },
  { id: 'horror', label: 'Horror / Survival', icon: '👻' },
  { id: 'open-world', label: 'Open World', icon: '🌍' },
  { id: 'competitive', label: 'Competitive / eSports', icon: '🏆' },
  { id: 'indie', label: 'Indie / Experimental', icon: '🎨' },
  { id: 'retro', label: 'Retro / Classic', icon: '🕹️' },
];

// ═══════════════════════════════════════════════════════════════════════════

export default function RecommendationEngine() {
  const [step, setStep] = useState(0); // 0=goals, 1=budget, 2=styles, 3=results
  const [goal, setGoal] = useState<Goal | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [styles, setStyles] = useState<string[]>([]);
  const [results, setResults] = useState<ScoredGame[]>([]);
  const [status, setStatus] = useState<StatusType>('idle');

  const toggleStyle = useCallback((id: string) => {
    setStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!goal || !budget) return;

    if (!toolRateLimiters.recommendationEngine.consume()) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    const startTime = Date.now();

    try {
      // Use the actual scoring engine instead of a fake delay
      // The engine computes match percentages with budget hard-filters
      const scored = scoreGames({
        goal,
        budget,
        styles: styles.length > 0 ? styles : ['action'],
      });

      // Sort by match percentage descending
      scored.sort((a, b) => b.matchPercent - a.matchPercent);

      // Ensure processing takes a realistic time (scoreGames is instant)
      const elapsed = Date.now() - startTime;
      if (elapsed < 300) {
        await new Promise((r) => setTimeout(r, 300 - elapsed));
      }

      setResults(scored);
      setStatus('success');
      setStep(3);
    } catch (err) {
      console.error('Recommendation error:', err);
      setStatus('error');
    }

    const totalElapsed = Date.now() - startTime;
    if (totalElapsed > 1000) {
      console.debug(`RecommendationEngine: scored ${GAME_LIBRARY.length} games in ${totalElapsed}ms`);
    }
  }, [goal, budget, styles]);

  const reset = useCallback(() => {
    setStep(0);
    setGoal(null);
    setBudget(null);
    setStyles([]);
    setResults([]);
    setStatus('idle');
    toolRateLimiters.recommendationEngine.reset();
  }, []);

  return (
    <ErrorBoundary toolName="Recommendation Engine">
      <Layout>
        <SEO
          title="Game Recommendation Engine — The Grid Nexus"
          description="Find your next game with AI-powered recommendations. Filter by budget, play style, and security requirements."
        />
        <div className="min-h-screen bg-[#0B0E14] text-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
              <Link to="/tools/security-scanner" className="text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  <Sparkles className="w-7 h-7 text-[#B026FF]" />
                  Game Recommendation Engine
                </h1>
                <p className="text-gray-400 mt-1">
                  Tell us what you're looking for and we'll match you with games that fit.
                </p>
              </div>
            </div>

            {/* Error state */}
            {status === 'error' && (
              <ErrorState
                title="Rate limited"
                message="Please wait before generating new recommendations."
              />
            )}

            {/* Step 1: Goal */}
            {step === 0 && (
              <Card className="bg-[#131820] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-[#B026FF]" />
                    What are you looking for?
                  </CardTitle>
                  <CardDescription>Choose your primary goal</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <GoalCard
                      icon={<Gamepad2 className="w-8 h-8" />}
                      label="Find a Game"
                      desc="Get game recommendations tailored to your tastes"
                      onClick={() => { setGoal('find_game'); setStep(1); }}
                    />
                    <GoalCard
                      icon={<Monitor className="w-8 h-8" />}
                      label="Build a Gaming PC"
                      desc="Get hardware recommendations tailored to your budget and use case"
                      onClick={() => { setGoal('gaming_pc'); setStep(1); }}
                    />
                    <GoalCard
                      icon={<Zap className="w-8 h-8" />}
                      label="Both"
                      desc="Game recommendations with a PC build that runs them"
                      onClick={() => { setGoal('both'); setStep(1); }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Budget */}
            {step === 1 && (
              <Card className="bg-[#131820] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#B026FF]" />
                    What's your budget?
                  </CardTitle>
                  <CardDescription>
                    {goal === 'gaming_pc'
                      ? 'PC build budget range'
                      : 'How much are you willing to spend on games?'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {(['budget', 'mid', 'high', 'ultra'] as const).map((b) => (
                      <Button
                        key={b}
                        variant="outline"
                        onClick={() => { setBudget(b); setStep(2); }}
                        className="h-auto py-6 border-gray-700 hover:border-[#B026FF] hover:text-white flex flex-col items-center gap-1"
                      >
                        <span className="text-lg font-semibold">
                          {b === 'budget' ? 'Budget' : b === 'mid' ? 'Mid-Range' : b === 'high' ? 'High-End' : 'Ultra'}
                        </span>
                        <span className="text-sm text-gray-400">{BUDGET_LABELS[b]}</span>
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-start mt-4">
                    <Button variant="ghost" onClick={() => setStep(0)} className="text-gray-400">
                      ← Back to goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Styles */}
            {step === 2 && (
              <Card className="bg-[#131820] border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#B026FF]" />
                    Pick your preferred styles
                  </CardTitle>
                  <CardDescription>
                    Select all that apply (optional — leave empty for "surprise me")
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {STYLE_OPTIONS.map((style) => (
                      <Button
                        key={style.id}
                        variant={styles.includes(style.id) ? 'default' : 'outline'}
                        onClick={() => toggleStyle(style.id)}
                        className={`h-auto py-3 ${
                          styles.includes(style.id)
                            ? 'bg-[#B026FF] hover:bg-[#B026FF]/80 text-white'
                            : 'border-gray-700 hover:border-[#B026FF] hover:text-white'
                        }`}
                      >
                        <span className="text-lg mr-1">{style.icon}</span>
                        <span className="text-sm">{style.label}</span>
                      </Button>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-400">
                      ← Back to budget
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={status === 'loading'}
                      className="bg-[#B026FF] hover:bg-[#B026FF]/80 text-white"
                    >
                      {status === 'loading' ? 'Matching…' : 'Generate Recommendations'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading */}
            {status === 'loading' && <LoadingState />}

            {/* Results */}
            {status === 'success' && results.length > 0 && (
              <>
                {/* PC Hardware Build (gaming_pc or both) */}
                {(goal === 'gaming_pc' || goal === 'both') && budget && (
                  <Card className="bg-gradient-to-r from-[#131820] to-[#1a1040] border-[#B026FF]/30">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Monitor className="w-5 h-5 text-[#B026FF]" />
                        Recommended PC Build
                      </CardTitle>
                      <CardDescription>
                        Estimated cost: {HARDWARE_BUILDS[budget].estimatedCost}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(['cpu', 'gpu', 'ram', 'storage', 'psu'] as const).map((part) => {
                          const comp = HARDWARE_BUILDS[budget][part];
                          return (
                            <div key={part} className="p-3 bg-[#0B0E14] rounded-lg border border-gray-800">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-[#B026FF] uppercase tracking-wider">{comp.type}</span>
                              </div>
                              <p className="text-sm font-medium text-white mt-1">{comp.suggestion}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{comp.note}</p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-[#B026FF]/10 rounded-lg border border-[#B026FF]/20">
                        <Lightbulb className="w-4 h-4 text-[#FFB800]" />
                        <p className="text-sm text-gray-300">{HARDWARE_BUILDS[budget].note}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Game Recommendations */}
                {(goal === 'find_game' || goal === 'both') && (
                  <Card className="bg-[#131820] border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#B026FF]" />
                        Game Recommendations
                      </CardTitle>
                      <CardDescription>
                        Sorted by match percentage. {results.length} games match your criteria.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {results.slice(0, 12).map((scored, i) => (
                        <GameRecommendation key={scored.game.slug} scored={scored} rank={i + 1} />
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Reset */}
                <div className="flex justify-center">
                  <Button variant="outline" onClick={reset} className="border-gray-700">
                    Start Over
                  </Button>
                </div>
              </>
            )}

            {/* Empty results */}
            {status === 'success' && results.length === 0 && (
              <EmptyState
                title="No matches found"
                message="Try adjusting your budget or style preferences for more results."
                action={{ label: 'Try Again', onClick: reset }}
              />
            )}
          </div>
        </div>
        <ToolCrossLinks related={[
            "/tools/pc-builder",
            "/tools/sentiment-analyzer",
            "/tools/gaming-security-checkup",
            "/tools/gaming-copilot",
          ]} />
      </Layout>
    </ErrorBoundary>
  );
}

// ═══════════════════════════════════════════════════════════════════════════

function GoalCard({
  icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-8 rounded-xl bg-[#0B0E14] border border-gray-800 hover:border-[#B026FF] hover:bg-[#B026FF]/5 transition-all cursor-pointer text-center group"
    >
      <div className="text-[#B026FF] group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-white">{label}</h3>
        <p className="text-sm text-gray-400 mt-1">{desc}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[#B026FF] transition-colors" />
    </button>
  );
}

function GameRecommendation({
  scored,
  rank,
}: {
  scored: ScoredGame;
  rank: number;
}) {
  const { game, matchPercent, matchReasons, isFallback, fallbackNote } = scored;

  const securityColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-400 bg-green-900/20 border-green-700';
      case 'B': return 'text-blue-400 bg-blue-900/20 border-blue-700';
      case 'C': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'D': return 'text-orange-400 bg-orange-900/20 border-orange-700';
      case 'F': return 'text-red-400 bg-red-900/20 border-red-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-[#0B0E14] rounded-lg border border-gray-800 hover:border-gray-700 transition-colors">
      {/* Rank */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#B026FF]/20 flex items-center justify-center">
        <span className="text-sm font-bold text-[#B026FF]">{rank}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-white text-base">{game.name}</h3>
          <Badge className={`text-xs border ${securityColor(game.securityGrade)}`}>
            <Shield className="w-3 h-3 mr-1" />
            Security: {game.securityGrade}
          </Badge>
          {isFallback && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-700 text-xs">
              Budget pick
            </Badge>
          )}
        </div>

        {/* Match reasons */}
        {matchReasons.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {matchReasons.map((reason, i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                {reason}
              </span>
            ))}
          </div>
        )}

        {/* Fallback note */}
        {fallbackNote && (
          <p className="text-xs text-yellow-400 mt-1">{fallbackNote}</p>
        )}
      </div>

      {/* Match percentage */}
      <div className="flex-shrink-0 text-right">
        <div className="text-2xl font-bold text-white">{matchPercent}%</div>
        <div className="text-xs text-gray-400">match</div>
        <Progress value={matchPercent} className="h-1.5 w-20 mt-1 bg-gray-700" />
      </div>
    </div>
  );
}
