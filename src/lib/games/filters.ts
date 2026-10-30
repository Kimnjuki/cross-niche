import type { GameAssessment, Grade, Risk, Platform, FeatureSupport } from './types';

export const PLATFORM_OPTIONS: Platform[] = [
  'PC',
  'PlayStation',
  'Xbox',
  'Switch',
  'Mobile',
  'VR',
];

export const GRADE_OPTIONS: Grade[] = ['A', 'B', 'C', 'D'];

export const RISK_OPTIONS: Risk[] = ['Low', 'Moderate', 'Elevated', 'High'];

export const FEATURE_OPTIONS = [
  '2FA',
  'Passkeys',
  'Login alerts',
  'Recovery options',
  'Parental controls',
  'Breach history',
];

export const SORT_OPTIONS = [
  { value: 'grade-asc', label: 'Grade: safest first' },
  { value: 'grade-desc', label: 'Grade: needs attention first' },
  { value: 'recent', label: 'Recently reviewed' },
  { value: 'name', label: 'A-Z' },
  { value: 'platforms', label: 'Most platforms' },
];

export function filterByPlatform(
  games: GameAssessment[],
  platform: Platform | 'All'
): GameAssessment[] {
  if (platform === 'All') return games;
  return games.filter((g) => g.platforms.includes(platform));
}

export function filterByGrade(
  games: GameAssessment[],
  grade: Grade | 'All'
): GameAssessment[] {
  if (grade === 'All') return games;
  return games.filter((g) => g.securityGrade === grade);
}

export function filterByRisk(
  games: GameAssessment[],
  risk: Risk | 'All'
): GameAssessment[] {
  if (risk === 'All') return games;
  return games.filter((g) => g.risk === risk);
}

export function filterByFeatures(
  games: GameAssessment[],
  selectedFeatures: string[]
): GameAssessment[] {
  if (selectedFeatures.length === 0) return games;
  return games.filter((g) => {
    const fs = g.featureSupport;
    return selectedFeatures.every((f) => {
      switch (f) {
        case '2FA':
          return fs.twoFactor;
        case 'Passkeys':
          return fs.passkeys;
        case 'Login alerts':
          return fs.loginAlerts;
        case 'Recovery options':
          return fs.recoveryOptions;
        case 'Parental controls':
          return fs.parentalControls;
        case 'Breach history':
          return fs.breachHistory;
        default:
          return true;
      }
    });
  });
}

export function searchGames(
  games: GameAssessment[],
  query: string
): GameAssessment[] {
  const q = query.toLowerCase().trim();
  if (!q) return games;
  return games.filter(
    (g) =>
      g.name.toLowerCase().includes(q) ||
      g.slug.toLowerCase().includes(q) ||
      g.genres.some((g) => g.toLowerCase().includes(q)) ||
      g.aliases.some((a) => a.toLowerCase().includes(q)) ||
      g.platforms.some((p) => p.toLowerCase().includes(q))
  );
}

export function sortGames(
  games: GameAssessment[],
  sortKey: string
): GameAssessment[] {
  const sorted = [...games];
  switch (sortKey) {
    case 'grade-asc':
      return sorted.sort((a, b) =>
        a.securityGrade === b.securityGrade
          ? 0
          : a.securityGrade === 'A' ? -1 : a.securityGrade === 'B' ? -1 : a.securityGrade === 'C' ? -1 : 1
      );
    case 'grade-desc':
      return sorted.sort((a, b) =>
        a.securityGrade === b.securityGrade
          ? 0
          : a.securityGrade === 'D' ? -1 : a.securityGrade === 'C' ? -1 : a.securityGrade === 'B' ? -1 : 1
      );
    case 'recent':
      return sorted.sort((a, b) =>
        new Date(b.evidence.lastReviewed).getTime() -
        new Date(a.evidence.lastReviewed).getTime()
      );
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'platforms':
      return sorted.sort((a, b) => b.platforms.length - a.platforms.length);
    default:
      return sorted;
  }
}

export function getGradeLabel(grade: Grade, risk?: Risk): string {
  const labels: Record<Grade, string> = {
    A: 'Grade A: Strong documented protections',
    B: 'Grade B: Good documented protections',
    C: 'Grade C: Documented gaps to address',
    D: 'Grade D: Significant concerns or urgent action needed',
  };
  return labels[grade];
}

export function getGradeColorClass(grade: Grade): string {
  switch (grade) {
    case 'A':
      return 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400';
    case 'B':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400';
    case 'C':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400';
    case 'D':
      return 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400';
  }
}

export function getRiskColorClass(risk: Risk): string {
  switch (risk) {
    case 'Low':
      return 'text-green-700 dark:text-green-400';
    case 'Moderate':
      return 'text-blue-700 dark:text-blue-400';
    case 'Elevated':
      return 'text-amber-700 dark:text-amber-400';
    case 'High':
      return 'text-red-700 dark:text-red-400';
  }
}

