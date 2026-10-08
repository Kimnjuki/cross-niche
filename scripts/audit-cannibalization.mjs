/**
 * Cannibalization audit — flags queries where MULTIPLE pages rank in the top 15,
 * diluting link equity and splitting CTR across near-duplicate URLs.
 *
 * Input: a Google Search Console "Performance" export (CSV). Export via
 * GSC -> Performance -> Export (any of the "Top queries / Top pages" formats).
 *
 * Usage:
 *   node scripts/audit-cannibalization.mjs path/to/gsc-export.csv
 *
 * Output: query groups with 2+ pages ranking < position 15, plus a merge
 * recommendation (keep the page with the best position, 301 the rest).
 */
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const [csvPath] = process.argv.slice(2);
if (!csvPath) {
  console.error('Usage: node scripts/audit-cannibalization.mjs <gsc-export.csv>');
  process.exit(1);
}

const raw = fs.readFileSync(csvPath, 'utf8');
const rows = parse(raw, { columns: true, skip_empty_lines: true, relax_column_count: true });
if (!rows.length) {
  console.error('No rows parsed — is this a valid GSC CSV export?');
  process.exit(1);
}

// GSC column names vary ("Query" vs "Top queries", "Page" vs "Top pages").
function findKey(re) {
  return Object.keys(rows[0]).find((k) => re.test(k));
}
const queryKey = findKey(/quer/i) || 'Query';
const pageKey = findKey(/page/i) || 'Page';
const posKey = findKey(/position/i) || 'Position';
const clickKey = findKey(/click/i) || 'Clicks';
const impKey = findKey(/impression/i) || 'Impressions';

// Group pages by query, keeping those ranking < position 15. Dedupe by URL —
// GSC can emit the same query+URL multiple times (device/date dimensions).
const byQuery = new Map();
for (const row of rows) {
  const q = (row[queryKey] || '').trim();
  const page = (row[pageKey] || '').trim();
  const pos = parseFloat(row[posKey]);
  if (!q || !page || Number.isNaN(pos) || pos >= 15) continue;
  const entry = {
    page,
    pos,
    clicks: parseInt(row[clickKey] || '0', 10),
    impressions: parseInt(row[impKey] || '0', 10),
  };
  if (!byQuery.has(q)) byQuery.set(q, new Map());
  const pages = byQuery.get(q);
  const existing = pages.get(page);
  // Keep the best (lowest) position for a given URL.
  if (!existing || pos < existing.pos) pages.set(page, entry);
}

const flagged = [...byQuery.entries()].filter(([, pages]) => pages.size >= 2);
console.log(`\nCannibalization candidates: ${flagged.length} queries with 2+ pages in top 15.\n`);

for (const [q, pagesMap] of flagged) {
  const pages = [...pagesMap.values()];
  pages.sort((a, b) => a.pos - b.pos || b.clicks - a.clicks);
  const [keeper, ...losers] = pages;
  console.log(`QUERY: "${q}"`);
  for (const p of pages) {
    console.log(`  pos ${String(p.pos).padStart(4)}  clicks ${String(p.clicks).padStart(4)}  ${p.page}`);
  }
  console.log(`  -> KEEP "${keeper.page}" (pos ${keeper.pos}); 301 the rest to it:`);
  for (const l of losers) console.log(`     - ${l.page}`);
  console.log('');
}

console.log(
  `Done. ${flagged.length} queries flagged. Merge = keep best page, 301 losers, ` +
  `move any unique content from losers into the keeper, update sitemap + internal links.`,
);
