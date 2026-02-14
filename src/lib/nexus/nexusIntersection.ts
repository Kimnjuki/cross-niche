/**
 * Nexus Intersection (nexus-004): common keyword linking Tech, Security, Gaming content.
 */

import type { Article } from '@/types';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
  'it', 'its', 'as', 'so', 'if', 'then', 'than', 'when', 'what', 'which', 'who', 'how', 'your', 'our',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function getWordCounts(articles: Article[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const a of articles) {
    const words = [
      ...tokenize(a.title),
      ...(a.tags || []).map((t) => t.toLowerCase()),
      ...tokenize(a.excerpt || '').slice(0, 20),
    ];
    const seen = new Set<string>();
    for (const w of words) {
      if (!seen.has(w)) {
        seen.add(w);
        counts.set(w, (counts.get(w) ?? 0) + 1);
      }
    }
  }
  return counts;
}

/**
 * Find a common keyword that links the three articles (Tech, Security, Gaming).
 * Prefer words that appear in at least 2 articles; fallback to first article's first tag or "technology".
 */
export function findCommonKeyword(articles: Article[]): string {
  const filtered = articles.filter((a) => a?.title);
  if (filtered.length === 0) return 'technology';

  const counts = getWordCounts(filtered);
  const byCount = [...counts.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1]);

  if (byCount.length > 0) {
    return byCount[0][0].charAt(0).toUpperCase() + byCount[0][0].slice(1);
  }

  const firstTag = filtered[0].tags?.[0];
  if (firstTag) return firstTag.charAt(0).toUpperCase() + firstTag.slice(1).toLowerCase();
  return 'Technology';
}
