/**
 * The Breach Simulation (nexus-003).
 * Text-based cybersecurity training: terminal UI, Nexus XP, breach level progress bar.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getInitialState, applyChoice, getScenarioIds, type BreachState, type BreachChoice } from '@/lib/nexus/breachSim';
import { getStoredNexusXP, addNexusXP, getStoredHighScore, updateHighScore } from '@/lib/nexus/nexusXP';
import { getStats, recordGame, getAchievements, type BreachStats } from '@/lib/nexus/breachStats';
import { cn } from '@/lib/utils';
import { Shield, RotateCcw, Mail, Usb, Key, Trophy, BarChart3, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const BREACH_MAX = 100;
const BREACH_GAME_OVER = 100;

const SCENARIO_LABELS: Record<string, { label: string; icon: typeof Mail }> = {
  phishing_received: { label: 'Phishing Email', icon: Mail },
  usb_found: { label: 'USB Drive', icon: Usb },
  password_prompt: { label: 'Password Phish', icon: Key },
  social_engineering: { label: 'Social Engineering', icon: Shield },
  public_wifi: { label: 'Public WiFi', icon: Shield },
  suspicious_download: { label: 'Suspicious Download', icon: Shield },
};

export function BreachSimulation() {
  const [scenarioId, setScenarioId] = useState<string>('phishing_received');
  const [state, setState] = useState<BreachState>(() => getInitialState(scenarioId));
  const [breachLevel, setBreachLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [stats, setStats] = useState<BreachStats>(getStats());
  const [achievements, setAchievements] = useState(getAchievements());
  const [showStats, setShowStats] = useState(false);
  const [choicesCount, setChoicesCount] = useState(0);
  const [secureChoicesCount, setSecureChoicesCount] = useState(0);
  const [gameStartBreach, setGameStartBreach] = useState(0);

  useEffect(() => {
    setXp(getStoredNexusXP());
    setHighScore(getStoredHighScore());
    setStats(getStats());
    setAchievements(getAchievements());
  }, []);

  const handleChoice = useCallback((choice: BreachChoice) => {
    const currentState = state;
    const result = applyChoice(currentState.id, choice.id);
    if (!result) return;

    setFeedback(choice.feedback);
    setChoicesCount(c => c + 1);
    if (result.xpDelta > 0) {
      setSecureChoicesCount(c => c + 1);
    }

    const newBreach = Math.max(0, Math.min(BREACH_MAX, breachLevel + result.breachDelta));
    setBreachLevel(newBreach);

    const newXp = addNexusXP(result.xpDelta);
    setXp(newXp);
    setHighScore(updateHighScore(newXp));

    // Brief delay so user sees feedback, then transition
    window.setTimeout(() => {
      setState(result.nextState);
      if (result.nextState.id === 'full_breach') {
        setBreachLevel(BREACH_MAX);
        // Record game completion
        const finalStats = recordGame(scenarioId, BREACH_MAX, result.xpDelta, choicesCount + 1, secureChoicesCount + (result.xpDelta > 0 ? 1 : 0));
        setStats(finalStats);
        setAchievements(getAchievements());
      } else if (result.nextState.isTerminal) {
        // Record successful completion
        const finalStats = recordGame(scenarioId, newBreach, result.xpDelta, choicesCount + 1, secureChoicesCount + (result.xpDelta > 0 ? 1 : 0));
        setStats(finalStats);
        setAchievements(getAchievements());
      }
      setFeedback(null);
    }, 800);
  }, [state, breachLevel, scenarioId, choicesCount, secureChoicesCount]);

  const handleRestart = useCallback((newScenarioId?: string) => {
    const nextScenario = newScenarioId ?? scenarioId;
    setScenarioId(nextScenario);
    setState(getInitialState(nextScenario));
    setBreachLevel(0);
    setGameStartBreach(0);
    setFeedback(null);
    setChoicesCount(0);
    setSecureChoicesCount(0);
  }, [scenarioId]);

  const isGameOver = breachLevel >= BREACH_GAME_OVER || state.id === 'full_breach';
  const terminalGreen = 'text-[#33ff33]';
  const terminalBg = 'bg-[#0a0a0a]';
  const terminalBorder = 'border-[#33ff33]/30';

  return (
    <div className={cn('rounded-lg border-2 font-mono text-sm overflow-hidden', terminalBg, terminalBorder)}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-2 border-b border-[#33ff33]/20 bg-black/50">
        <div className="flex items-center gap-2">
          <span className={cn('text-xs', terminalGreen)}>nexus@breach-sim:~$</span>
          {(state.isTerminal || isGameOver) ? null : (
            <span className="text-[#33ff33]/70 text-xs">
              Scenario: {SCENARIO_LABELS[scenarioId]?.label ?? scenarioId}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className={cn(terminalGreen)}>Nexus XP: {xp}</span>
          <span className="text-[#33ff33]/70">High: {highScore}</span>
        </div>
      </div>

      {/* Scenario selector - at start (breachLevel 0) or when game over */}
      {(breachLevel === 0 || state.isTerminal || isGameOver) && (
        <div className="px-4 py-2 border-b border-[#33ff33]/20 flex flex-wrap items-center gap-2">
          <span className={cn('text-xs', terminalGreen)}>
            {(state.isTerminal || isGameOver) ? 'Try another:' : 'Scenario:'}
          </span>
          {getScenarioIds().map((sid) => {
            const { label, icon: Icon } = SCENARIO_LABELS[sid] ?? { label: sid, icon: Shield };
            const isActive = scenarioId === sid && breachLevel === 0 && !state.isTerminal && !isGameOver;
            return (
              <button
                key={sid}
                type="button"
                onClick={() => {
                  if (state.isTerminal || isGameOver || breachLevel > 0) {
                    handleRestart(sid);
                  } else {
                    setScenarioId(sid);
                    setState(getInitialState(sid));
                  }
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono',
                  'border border-[#33ff33]/40 text-[#33ff33] hover:bg-[#33ff33]/10',
                  isActive && 'ring-1 ring-[#33ff33]/60 bg-[#33ff33]/5',
                  'transition-colors'
                )}
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Breach level progress — "drains" = bar fills as breach increases */}
      <div className="px-4 py-2 border-b border-[#33ff33]/20">
        <div className="flex items-center justify-between mb-1">
          <span className={cn('text-xs', terminalGreen)}>BREACH LEVEL</span>
          <span className={cn('text-xs', breachLevel >= 80 ? 'text-red-400' : terminalGreen)}>
            {breachLevel}%
          </span>
        </div>
        <div className="h-2 w-full rounded bg-black overflow-hidden border border-[#33ff33]/20">
          <div
            className={cn(
              'h-full transition-all duration-500',
              breachLevel >= 80 ? 'bg-red-500' : breachLevel >= 50 ? 'bg-amber-500' : 'bg-[#33ff33]/60'
            )}
            style={{ width: `${breachLevel}%` }}
          />
        </div>
      </div>

      {/* Terminal content */}
      <div className="p-4 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div>
              <p className={cn('text-xs mb-1', terminalGreen)}>&gt; {state.title}</p>
              <p className={cn('text-[#33ff33]/90 leading-relaxed')}>{state.body}</p>
            </div>

            {feedback && (
              <p className={cn('text-xs italic', 'text-[#33ff33]/70')}>{feedback}</p>
            )}

            {!state.isTerminal && !isGameOver && state.choices.length > 0 && (
              <div className="pt-4 space-y-2">
                <p className={cn('text-xs', terminalGreen)}>CHOOSE ACTION:</p>
                <div className="flex flex-wrap gap-2">
                  {state.choices.map((choice) => (
                    <Button
                      key={choice.id}
                      variant="outline"
                      size="sm"
                      className={cn(
                        'font-mono border-[#33ff33]/40 text-[#33ff33] hover:bg-[#33ff33]/10 hover:text-[#33ff33]',
                        'focus-visible:ring-[#33ff33]/50'
                      )}
                      onClick={() => handleChoice(choice)}
                    >
                      [{choice.label}]
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {(state.isTerminal || isGameOver) && (
              <div className="pt-4 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'font-mono border-[#33ff33]/40 text-[#33ff33] hover:bg-[#33ff33]/10',
                      'focus-visible:ring-[#33ff33]/50'
                    )}
                    onClick={() => handleRestart()}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart Same Scenario
                  </Button>
                  <span className="text-[#33ff33]/60 text-xs">or try:</span>
                  {getScenarioIds().map((sid) => {
                    const { label, icon: Icon } = SCENARIO_LABELS[sid] ?? { label: sid, icon: Shield };
                    return (
                      <Button
                        key={sid}
                        variant="outline"
                        size="sm"
                        className={cn(
                          'font-mono border-[#33ff33]/40 text-[#33ff33]/90 hover:bg-[#33ff33]/10',
                          'focus-visible:ring-[#33ff33]/50'
                        )}
                        onClick={() => handleRestart(sid)}
                      >
                        <Icon className="h-3.5 w-3.5 mr-1.5" />
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#33ff33]/20 flex items-center justify-between gap-2 text-xs text-[#33ff33]/60">
        <div className="flex items-center gap-2">
          <Shield className="h-3 w-3" />
          <span>The Grid Nexus — Breach Simulation (nexus-003). Secure choices earn Nexus XP.</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowStats(!showStats)}
          className={cn('h-7 text-xs gap-1.5', terminalGreen, 'hover:bg-[#33ff33]/10')}
        >
          <BarChart3 className="h-3 w-3" />
          Stats
        </Button>
      </div>

      {/* Stats & Achievements Panel */}
      {showStats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mt-4 rounded-lg border-2 border-[#33ff33]/30 bg-black/50 p-4"
        >
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-black/50">
              <TabsTrigger value="stats" className="gap-2 text-xs">
                <BarChart3 className="h-3 w-3" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="achievements" className="gap-2 text-xs">
                <Trophy className="h-3 w-3" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={cn('p-2 rounded border border-[#33ff33]/20', terminalBg)}>
                  <div className={cn(terminalGreen)}>Total Games</div>
                  <div className="text-lg font-bold">{stats.totalGames}</div>
                </div>
                <div className={cn('p-2 rounded border border-[#33ff33]/20', terminalBg)}>
                  <div className={cn(terminalGreen)}>Total XP</div>
                  <div className="text-lg font-bold">{stats.totalXP}</div>
                </div>
                <div className={cn('p-2 rounded border border-[#33ff33]/20', terminalBg)}>
                  <div className={cn(terminalGreen)}>Perfect Runs</div>
                  <div className="text-lg font-bold">{stats.perfectRuns}</div>
                </div>
                <div className={cn('p-2 rounded border border-[#33ff33]/20', terminalBg)}>
                  <div className={cn(terminalGreen)}>Scenarios</div>
                  <div className="text-lg font-bold">{stats.scenariosCompleted.length}/6</div>
                </div>
              </div>
              <div className={cn('p-2 rounded border border-[#33ff33]/20 text-xs', terminalBg)}>
                <div className={cn(terminalGreen, 'mb-1')}>Success Rate</div>
                <div className="text-sm">
                  {stats.totalChoices > 0
                    ? Math.round((stats.secureChoices / stats.totalChoices) * 100)
                    : 0}% secure choices
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-2">
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={cn(
                      'p-2 rounded border text-xs',
                      ach.unlocked
                        ? 'border-[#33ff33]/40 bg-[#33ff33]/5'
                        : 'border-[#33ff33]/10 bg-black/30 opacity-60',
                      terminalBg
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {ach.unlocked ? (
                        <Award className={cn('h-4 w-4 mt-0.5', terminalGreen)} />
                      ) : (
                        <Award className="h-4 w-4 mt-0.5 text-gray-500" />
                      )}
                      <div className="flex-1">
                        <div className={cn('font-semibold', ach.unlocked ? terminalGreen : 'text-gray-400')}>
                          {ach.name}
                        </div>
                        <div className="text-[#33ff33]/70 text-[10px]">{ach.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  );
}
