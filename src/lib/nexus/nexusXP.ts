/**
 * Nexus XP system for Breach Simulation (nexus-003).
 * Persists total XP and optional high score to localStorage.
 */

const NEXUS_XP_KEY = 'nexus_breach_xp';
const NEXUS_BREACH_HIGH_SCORE_KEY = 'nexus_breach_high_score';

export function getStoredNexusXP(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(NEXUS_XP_KEY);
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isNaN(n) ? 0 : Math.max(0, n);
  } catch {
    return 0;
  }
}

export function addNexusXP(delta: number): number {
  const current = getStoredNexusXP();
  const next = Math.max(0, current + delta);
  try {
    localStorage.setItem(NEXUS_XP_KEY, String(next));
  } catch {
    // ignore quota or private mode
  }
  return next;
}

export function setNexusXP(value: number): number {
  const next = Math.max(0, Math.round(value));
  try {
    localStorage.setItem(NEXUS_XP_KEY, String(next));
  } catch {
    // ignore
  }
  return next;
}

export function getStoredHighScore(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(NEXUS_BREACH_HIGH_SCORE_KEY);
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isNaN(n) ? 0 : Math.max(0, n);
  } catch {
    return 0;
  }
}

export function updateHighScore(xp: number): number {
  const current = getStoredHighScore();
  const next = Math.max(current, xp);
  try {
    localStorage.setItem(NEXUS_BREACH_HIGH_SCORE_KEY, String(next));
  } catch {
    // ignore
  }
  return next;
}
