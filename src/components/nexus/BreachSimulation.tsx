/**
 * The Breach Simulation (nexus-003).
 * Text-based cybersecurity training: terminal UI, Nexus XP, breach level progress bar.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getInitialState, applyChoice, type BreachState, type BreachChoice } from '@/lib/nexus/breachSim';
import { getStoredNexusXP, addNexusXP, getStoredHighScore, updateHighScore } from '@/lib/nexus/nexusXP';
import { cn } from '@/lib/utils';
import { Shield, RotateCcw } from 'lucide-react';

const BREACH_MAX = 100;
const BREACH_GAME_OVER = 100;

export function BreachSimulation() {
  const [state, setState] = useState<BreachState>(getInitialState());
  const [breachLevel, setBreachLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setXp(getStoredNexusXP());
    setHighScore(getStoredHighScore());
  }, []);

  const handleChoice = useCallback((choice: BreachChoice) => {
    const currentState = state;
    const result = applyChoice(currentState.id, choice.id);
    if (!result) return;

    setFeedback(choice.feedback);

    const newBreach = Math.max(0, Math.min(BREACH_MAX, breachLevel + result.breachDelta));
    setBreachLevel(newBreach);

    const newXp = addNexusXP(result.xpDelta);
    setXp(newXp);
    setHighScore(updateHighScore(newXp));

    // Brief delay so user sees feedback, then transition
    window.setTimeout(() => {
      setState(result.nextState);
      if (result.nextState.id === 'full_breach') setBreachLevel(BREACH_MAX);
      setFeedback(null);
    }, 800);
  }, [state, breachLevel]);

  const handleRestart = useCallback(() => {
    setState(getInitialState());
    setBreachLevel(0);
    setFeedback(null);
  }, []);

  const isGameOver = breachLevel >= BREACH_GAME_OVER || state.id === 'full_breach';
  const terminalGreen = 'text-[#33ff33]';
  const terminalBg = 'bg-[#0a0a0a]';
  const terminalBorder = 'border-[#33ff33]/30';

  return (
    <div className={cn('rounded-lg border-2 font-mono text-sm overflow-hidden', terminalBg, terminalBorder)}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#33ff33]/20 bg-black/50">
        <span className={cn('text-xs', terminalGreen)}>nexus@breach-sim:~$</span>
        <div className="flex items-center gap-4 text-xs">
          <span className={cn(terminalGreen)}>Nexus XP: {xp}</span>
          <span className="text-[#33ff33]/70">High: {highScore}</span>
        </div>
      </div>

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
              <div className="pt-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'font-mono border-[#33ff33]/40 text-[#33ff33] hover:bg-[#33ff33]/10',
                    'focus-visible:ring-[#33ff33]/50'
                  )}
                  onClick={handleRestart}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restart Simulation
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-[#33ff33]/20 flex items-center gap-2 text-xs text-[#33ff33]/60">
        <Shield className="h-3 w-3" />
        <span>The Grid Nexus — Breach Simulation (nexus-003). Secure choices earn Nexus XP.</span>
      </div>
    </div>
  );
}
