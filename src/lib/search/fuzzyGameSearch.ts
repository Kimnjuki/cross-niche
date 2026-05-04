import { GameEntry, GAME_LIBRARY } from '@/lib/data/gameLibrary';

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
    }
  }
  return dp[m][n];
}

export interface FuzzySearchResult {
  game: GameEntry;
  matchType: 'exact' | 'alias' | 'partial' | 'alias_partial' | 'fuzzy';
}

/**
 * Search game library by name with fuzzy matching.
 * Steps: exact → alias exact → name partial → alias partial → Levenshtein ≤ 2
 * Returns up to 3 matches on partial/fuzzy, single on exact.
 */
export function fuzzyGameSearch(query: string, library: GameEntry[] = GAME_LIBRARY): FuzzySearchResult[] {
  const nq = normalize(query);
  if (!nq) return [];

  const results: FuzzySearchResult[] = [];
  const seen = new Set<string>();

  // Step 1: Exact match on name
  for (const game of library) {
    if (normalize(game.name) === nq && !seen.has(game.slug)) {
      seen.add(game.slug);
      results.push({ game, matchType: 'exact' });
    }
  }
  if (results.length > 0) return results;

  // Step 2: Exact match on any alias
  for (const game of library) {
    if (game.aliases.some(a => normalize(a) === nq) && !seen.has(game.slug)) {
      seen.add(game.slug);
      results.push({ game, matchType: 'alias' });
    }
  }
  if (results.length > 0) return results;

  // Step 3: Name partial match
  for (const game of library) {
    if (normalize(game.name).includes(nq) && !seen.has(game.slug)) {
      seen.add(game.slug);
      results.push({ game, matchType: 'partial' });
    }
  }
  if (results.length > 0) return results;

  // Step 4: Alias partial match
  for (const game of library) {
    if (game.aliases.some(a => normalize(a).includes(nq)) && !seen.has(game.slug)) {
      seen.add(game.slug);
      results.push({ game, matchType: 'alias_partial' });
    }
  }
  if (results.length > 0) return results;

  // Step 5: Levenshtein distance ≤ 2 on name
  for (const game of library) {
    const nn = normalize(game.name);
    if (levenshtein(nn, nq) <= 2 && !seen.has(game.slug)) {
      seen.add(game.slug);
      results.push({ game, matchType: 'fuzzy' });
    }
  }

  // Step 6: Levenshtein on aliases
  for (const game of library) {
    if (!seen.has(game.slug) && game.aliases.some(a => levenshtein(normalize(a), nq) <= 2)) {
      seen.add(game.slug);
      results.push({ game, matchType: 'fuzzy' });
    }
  }

  return results.slice(0, 3);
}
