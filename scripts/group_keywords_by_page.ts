/**
 * Group keywords by landing page from low_hanging_keywords CSV.
 * Usage: npx tsx scripts/group_keywords_by_page.ts
 * Reads data/low_hanging_keywords.csv, outputs data/keywords_by_page.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { join } from 'path';

const dataDir = join(process.cwd(), 'data');
const inputPath = join(dataDir, 'low_hanging_keywords.csv');
const outputPath = join(dataDir, 'keywords_by_page.json');

interface KeywordRow {
  keyword?: string;
  position?: string;
  url?: string;
  [key: string]: string | undefined;
}

function main() {
  try {
    const csv = readFileSync(inputPath, 'utf-8');
    const rows = parse(csv, { columns: true, skip_empty_lines: true }) as KeywordRow[];
    const byPage: Record<string, { keywords: string[]; positions: number[] }> = {};

    for (const row of rows) {
      const url = row.url || row.URL || row.landing_page || row['Landing page'] || '';
      const keyword = row.keyword || row.Keyword || row.Keyword || '';
      const pos = parseInt(row.position || row.Position || row.pos || '0', 10);
      if (!url || !keyword) continue;

      if (!byPage[url]) byPage[url] = { keywords: [], positions: [] };
      byPage[url].keywords.push(keyword);
      byPage[url].positions.push(pos);
    }

    // Sort pages by number of keywords in positions 4-10
    const sorted = Object.entries(byPage)
      .map(([url, data]) => ({
        url,
        keywordCount: data.keywords.length,
        avgPosition: data.positions.reduce((a, b) => a + b, 0) / data.positions.length,
        keywordsIn4to10: data.positions.filter(p => p >= 4 && p <= 10).length,
        keywords: data.keywords,
      }))
      .sort((a, b) => b.keywordsIn4to10 - a.keywordsIn4to10);

    writeFileSync(outputPath, JSON.stringify({ byPage, prioritized: sorted }, null, 2));
    console.log(`Wrote ${outputPath} (${sorted.length} pages, ${rows.length} keywords)`);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}
main();
