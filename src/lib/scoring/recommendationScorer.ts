import { GameEntry, GAME_LIBRARY } from '@/lib/data/gameLibrary';

export interface ScoringInput {
  goal: 'gaming_pc' | 'find_game' | 'both';
  budget: 'budget' | 'mid' | 'high' | 'ultra';
  styles: string[];
}

export interface ScoredGame {
  game: GameEntry;
  matchPercent: number;
  matchReasons: string[];
  isFallback: boolean;
  fallbackNote?: string;
}

const BUDGET_RANK: Record<string, number> = { free: 0, budget: 1, mid: 2, high: 3, ultra: 4 };
export const BUDGET_LABELS: Record<string, string> = { free: 'Free', budget: '< $30', mid: '$30–$60', high: '$60–$100', ultra: '$100+' };

export const REASON_LABELS: Record<string, string> = {
  goalMatch: 'Matches your goal',
  budgetFit: 'Within your budget',
  styleMatch: 'Fits your style',
  securityBoostA: 'Security grade A',
  securityBoostB: 'Security grade B',
  streamingBoost: 'Great for streaming',
  freeToPlay: 'Free to play',
};

function budgetRank(tier: string): number {
  return BUDGET_RANK[tier] ?? 99;
}

/**
 * Score games against quiz input.
 * Returns sorted + filtered results with match reasons.
 */
export function scoreGames(input: ScoringInput): ScoredGame[] {
  const { goal, budget, styles } = input;
  const selectedBudgetRank = budgetRank(budget);

  let scored: ScoredGame[] = [];

  for (const game of GAME_LIBRARY) {
    let rawScore = 0;
    const reasons: string[] = [];

    // Hard filter: game must be released or default
    const gameBudgetRank = budgetRank(game.budgetTier);

    // Goal match (+40)
    if (game.recommendedForGoals.includes(goal) || game.recommendedForGoals.includes('both')) {
      rawScore += 40;
      reasons.push('goalMatch');
    }

    // Budget hard filter: exclude if game is more expensive than selected budget
    if (gameBudgetRank > selectedBudgetRank) {
      continue; // Hard filter out
    }

    // Budget fit (+20)
    if (gameBudgetRank <= selectedBudgetRank) {
      rawScore += 20;
      reasons.push('budgetFit');
    }

    // Free to play bonus
    if (game.budgetTier === 'free') {
      reasons.push('freeToPlay');
    }

    // Style matching (+15 per matching style)
    for (const s of styles) {
      if (game.stylesMatch.some(gs => gs.includes(s) || s.includes(gs))) {
        rawScore += 15;
        if (!reasons.includes('styleMatch')) reasons.push('styleMatch');
      }
    }

    // Security-conscious boost
    if (styles.includes('privacy-first') || styles.includes('security-conscious')) {
      if (game.securityGrade === 'A') { rawScore += 30; reasons.push('securityBoostA'); }
      else if (game.securityGrade === 'B') { rawScore += 15; reasons.push('securityBoostB'); }
      else if (game.securityGrade === 'D') { rawScore -= 20; }
      else if (game.securityGrade === 'F') { rawScore -= 40; }
    }

    // Streaming boost
    if (styles.includes('streaming') && game.sentimentScores.community > 80) {
      rawScore += 10;
      reasons.push('streamingBoost');
    }

    scored.push({ game, matchPercent: 0, matchReasons: [...new Set(reasons)], isFallback: false });
  }

  if (scored.length === 0) {
    // Fallback: relax budget by 1 tier, tag as fallback
    const relaxedRank = Math.min(selectedBudgetRank + 1, 4);
    const relaxedBudgetLabel = Object.entries(BUDGET_RANK).find(([, v]) => v === relaxedRank)?.[0] || 'ultra';

    for (const game of GAME_LIBRARY) {
      const gameBudgetRank = budgetRank(game.budgetTier);
      if (gameBudgetRank > relaxedRank) continue;

      let rawScore = 0;
      const reasons: string[] = [];
      if (game.recommendedForGoals.includes(goal) || game.recommendedForGoals.includes('both')) {
        rawScore += 40;
        reasons.push('goalMatch');
      }
      rawScore += 10;
      reasons.push('budgetFit');

      scored.push({
        game,
        matchPercent: 0,
        matchReasons: [...new Set(reasons)],
        isFallback: true,
        fallbackNote: `Near match — slightly over ${BUDGET_LABELS[budget] || budget} budget`,
      });
    }
  }

  // Normalize scores
  const maxPossible = 40 + 20 + (styles.length * 15) + 30 + 10;
  for (const s of scored) {
    const total = s.matchReasons.reduce((sum, r) => {
      const v = REASON_POINTS[r] || 0;
      return sum + v;
    }, 0);
    s.matchPercent = Math.min(100, Math.round((total / maxPossible) * 100));
  }

  // Sort by match percent desc, take top 6
  return scored.sort((a, b) => b.matchPercent - a.matchPercent).slice(0, 6);
}

const REASON_POINTS: Record<string, number> = {
  goalMatch: 40,
  budgetFit: 20,
  styleMatch: 15,
  securityBoostA: 30,
  securityBoostB: 15,
  streamingBoost: 10,
  freeToPlay: 5,
};
