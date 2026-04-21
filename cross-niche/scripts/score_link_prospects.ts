/**
 * Score and filter link intersect prospects by DR and competitor link count.
 * Usage: npx tsx scripts/score_link_prospects.ts [--dr 40] [--min-competitors 2]
 */

import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { join } from 'path';

const dataDir = join(process.cwd(), 'data');
const inputPath = join(dataDir, 'link_intersect_prospects.csv');
const outputPath = join(dataDir, 'scored_prospects.json');

const args = process.argv.slice(2);
const drMin = parseInt(args.find(a => a.startsWith('--dr='))?.split('=')[1] || '40', 10);
const minCompetitors = parseInt(args.find(a => a.startsWith('--min-competitors='))?.split('=')[1] || '2', 10);

function parseNum(val: string): number {
  const n = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
}

function main() {
  try {
    const csv = readFileSync(inputPath, 'utf-8');
    const rows = parse(csv, { columns: true, skip_empty_lines: true });
    const scored = rows
      .map((r: Record<string, string>) => ({
        domain: r.domain || r.Domain || '',
        dr: parseNum(r.dr || r.DR || '0'),
        linking_to_competitors: parseNum(r.linking_to_competitors || r.competitors || '0'),
        score:
          parseNum(r.dr || r.DR || '0') * 0.6 +
          Math.min(parseNum(r.linking_to_competitors || r.competitors || '0') * 10, 40),
        ...r,
      }))
      .filter((r: { dr: number; linking_to_competitors: number }) => r.dr >= drMin && r.linking_to_competitors >= minCompetitors)
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

    writeFileSync(outputPath, JSON.stringify({ scored, drMin, minCompetitors }, null, 2));
    console.log(`Wrote ${outputPath} (${scored.length} prospects, DR>=${drMin}, competitors>=${minCompetitors})`);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}
main();
