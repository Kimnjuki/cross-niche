/**
 * Filter content gap keywords by KD and volume thresholds.
 * Usage: npx tsx scripts/filter_content_gap.ts [--kd 30] [--volume 500]
 * Reads data/content_gap_keywords.csv, outputs data/prioritized_gaps.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { join } from 'path';

const dataDir = join(process.cwd(), 'data');
const inputPath = join(dataDir, 'content_gap_keywords.csv');
const outputPath = join(dataDir, 'prioritized_gaps.json');

const args = process.argv.slice(2);
const kdMax = parseInt(args.find(a => a.startsWith('--kd='))?.split('=')[1] || '30', 10);
const volumeMin = parseInt(args.find(a => a.startsWith('--volume='))?.split('=')[1] || '500', 10);

function parseNum(val: string): number {
  const n = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
}

function main() {
  try {
    const csv = readFileSync(inputPath, 'utf-8');
    const rows = parse(csv, { columns: true, skip_empty_lines: true });
    const filtered = rows
      .filter((r: Record<string, string>) => {
        const kd = parseNum(r.kd || r.KD || r.difficulty || '99');
        const vol = parseNum(r.volume || r.Volume || r.search_volume || '0');
        return kd <= kdMax && vol >= volumeMin;
      })
      .sort((a: Record<string, string>, b: Record<string, string>) => {
        const volA = parseNum(a.volume || a.Volume || '0');
        const volB = parseNum(b.volume || b.Volume || '0');
        return volB - volA;
      });

    writeFileSync(outputPath, JSON.stringify({ filtered, kdMax, volumeMin }, null, 2));
    console.log(`Wrote ${outputPath} (${filtered.length} keywords, KD<=${kdMax}, vol>=${volumeMin})`);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}
main();
