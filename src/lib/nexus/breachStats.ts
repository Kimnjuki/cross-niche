/**
 * Breach Simulation stats and achievements tracking.
 */

const STATS_KEY = 'nexus_breach_stats';
const ACHIEVEMENTS_KEY = 'nexus_breach_achievements';

export interface BreachStats {
  totalGames: number;
  totalXP: number;
  scenariosCompleted: string[];
  perfectRuns: number; // Games with 0 breach level
  totalChoices: number;
  secureChoices: number; // Choices that earned XP
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: number;
}

const DEFAULT_STATS: BreachStats = {
  totalGames: 0,
  totalXP: 0,
  scenariosCompleted: [],
  perfectRuns: 0,
  totalChoices: 0,
  secureChoices: 0,
};

const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Complete your first scenario successfully',
    unlocked: false,
  },
  {
    id: 'perfect_run',
    name: 'Perfect Run',
    description: 'Complete a scenario with 0% breach level',
    unlocked: false,
  },
  {
    id: 'security_master',
    name: 'Security Master',
    description: 'Complete all 6 scenarios',
    unlocked: false,
  },
  {
    id: 'xp_collector',
    name: 'XP Collector',
    description: 'Earn 500 total Nexus XP',
    unlocked: false,
  },
  {
    id: 'quick_learner',
    name: 'Quick Learner',
    description: 'Make 10 secure choices in a row',
    unlocked: false,
  },
  {
    id: 'phishing_pro',
    name: 'Phishing Pro',
    description: 'Successfully handle all phishing scenarios',
    unlocked: false,
  },
];

export function getStats(): BreachStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return DEFAULT_STATS;
  }
}

export function updateStats(updates: Partial<BreachStats>): BreachStats {
  const current = getStats();
  const updated = { ...current, ...updates };
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export function recordGame(scenarioId: string, finalBreachLevel: number, xpEarned: number, choicesMade: number, secureChoices: number) {
  const stats = getStats();
  const updatedStats = {
    totalGames: stats.totalGames + 1,
    totalXP: stats.totalXP + xpEarned,
    scenariosCompleted: stats.scenariosCompleted.includes(scenarioId)
      ? stats.scenariosCompleted
      : [...stats.scenariosCompleted, scenarioId],
    perfectRuns: finalBreachLevel === 0 ? stats.perfectRuns + 1 : stats.perfectRuns,
    totalChoices: stats.totalChoices + choicesMade,
    secureChoices: stats.secureChoices + secureChoices,
  };
  updateStats(updatedStats);
  checkAchievements(updatedStats);
  return updatedStats;
}

export function getAchievements(): Achievement[] {
  if (typeof window === 'undefined') return ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
    const stored = JSON.parse(raw) as Record<string, { unlocked: boolean; unlockedAt?: number }>;
    return ALL_ACHIEVEMENTS.map(ach => ({
      ...ach,
      unlocked: stored[ach.id]?.unlocked ?? false,
      unlockedAt: stored[ach.id]?.unlockedAt,
    }));
  } catch {
    return ALL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false }));
  }
}

function checkAchievements(stats: BreachStats) {
  const achievements = getAchievements();
  const updates: Record<string, { unlocked: boolean; unlockedAt?: number }> = {};
  let changed = false;

  // First Victory
  if (!achievements.find(a => a.id === 'first_win')?.unlocked && stats.totalGames > 0) {
    updates['first_win'] = { unlocked: true, unlockedAt: Date.now() };
    changed = true;
  }

  // Perfect Run
  if (!achievements.find(a => a.id === 'perfect_run')?.unlocked && stats.perfectRuns > 0) {
    updates['perfect_run'] = { unlocked: true, unlockedAt: Date.now() };
    changed = true;
  }

  // Security Master (all 6 scenarios)
  if (!achievements.find(a => a.id === 'security_master')?.unlocked && stats.scenariosCompleted.length >= 6) {
    updates['security_master'] = { unlocked: true, unlockedAt: Date.now() };
    changed = true;
  }

  // XP Collector
  if (!achievements.find(a => a.id === 'xp_collector')?.unlocked && stats.totalXP >= 500) {
    updates['xp_collector'] = { unlocked: true, unlockedAt: Date.now() };
    changed = true;
  }

  // Phishing Pro (completed phishing scenarios)
  const phishingScenarios = ['phishing_received', 'password_prompt', 'social_engineering'];
  const completedPhishing = phishingScenarios.filter(id => stats.scenariosCompleted.includes(id));
  if (!achievements.find(a => a.id === 'phishing_pro')?.unlocked && completedPhishing.length >= 3) {
    updates['phishing_pro'] = { unlocked: true, unlockedAt: Date.now() };
    changed = true;
  }

  if (changed) {
    try {
      const existing = localStorage.getItem(ACHIEVEMENTS_KEY);
      const current = existing ? JSON.parse(existing) : {};
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify({ ...current, ...updates }));
    } catch {
      // ignore
    }
  }
}

export function resetStats() {
  try {
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(ACHIEVEMENTS_KEY);
  } catch {
    // ignore
  }
}
