/**
 * CTR report — flags pages that are metadata-CTR underperformers, i.e. the
 * candidates for a title/meta-description A/B test (Pillar 5).
 *
 * Input: a Google Search Console "Performance" export (CSV), same as the
 * cannibalization audit. No GSC API credentials required.
 *
 * Usage:
 *   node scripts/ctr-report.mjs path/to/gsc-export.csv [minImpressions] [maxCTR%]
 *
 * Defaults: impressions >= 500 and CTR < 3% (the A/B test candidate window).
 */
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const [csvPath, minImpArg, maxCtrArg] = process.argv.slice(2);
if (!csvPath) {
  console.error('Usage: node scripts/ctr-report.mjs <gsc-export.csv> [minImpressions] [maxCTR%]');
  process.exit(1);
}
const MIN_IMPRESSIONS = parseInt(minImpArg || '500', 10);
const MAX_CTR_PCT = parseFloat(maxCtrArg || '3');

const raw = fs.readFileSync(csvPath, 'utf8');
const rows = parse(raw, { columns: true, skip_empty_lines: true, relax_column_count: true });

function findKey(re) {
  return Object.keys(rows[0]).find((k) => re.test(k));
}
const pageKey = findKey(/page/i) || 'Page';
const clickKey = findKey(/click/i) || 'Clicks';
const impKey = findKey(/impression/i) || 'Impressions';
const ctrKey = findKey(/ctr/i) || 'CTR';
const posKey = findKey(/position/i) || 'Position';

// Aggregate by page.
const byPage = new Map();
for (const row of rows) {
  const page = (row[pageKey] || '').trim();
  if (!page) continue;
  const clicks = parseInt(row[clickKey] || '0', 10);
  const impressions = parseInt(row[impKey] || '0', 10);
  const pos = parseFloat(row[posKey]);
  const cur = byPage.get(page) || { page, clicks: 0, impressions: 0, posSum: 0, posN: 0 };
  cur.clicks += clicks;
  cur.impressions += impressions;
  if (!Number.isNaN(pos)) {
    cur.posSum += pos;
    cur.posN += 1;
  }
  byPage.set(page, cur);
}

const pages = [...byPage.values()].map((p) => ({
  ...p,
  ctr: p.impressions ? (p.clicks / p.impressions) * 100 : 0,
  avgPos: p.posN ? p.posSum / p.posN : null,
}));

const candidates = pages
  .filter((p) => p.impressions >= MIN_IMPRESSIONS && p.ctr < MAX_CTR_PCT)
  .sort((a, b) => b.impressions - a.impressions);

console.log(
  `\nCTR underperformers (impressions >= ${MIN_IMPRESSIONS}, CTR < ${MAX_CTR_PCT}%): ` +
  `${candidates.length} page(s).\n`,
);
console.log(
  `${'CTR%'.padStart(5)}  ${'Impressions'.padStart(11)}  ${'Clicks'.padStart(6)}  ${'AvgPos'.padStart(6)}  Page`,
);
for (const p of candidates) {
  console.log(
    `${p.ctr.toFixed(1).padStart(5)}  ${String(p.impressions).padStart(11)}  ` +
    `${String(p.clicks).padStart(6)}  ${p.avgPos ? p.avgPos.toFixed(1).padStart(6) : '  n/a'}  ${p.page}`,
  );
}

console.log(
  `\nA/B test flow: pick up to 20 of these, rewrite title/meta for half (hold half as ` +
  `control), measure 21 days in GSC, ship winners, revert losers.`,
);
