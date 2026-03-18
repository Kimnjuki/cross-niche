/**
 * Audit anchor text distribution for internal links.
 * Reads src/** for Link/href usage and reports anchor type percentages.
 * Usage: npx tsx scripts/audit_anchor_distribution.ts
 */

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');
const generic = ['click here', 'read more', 'learn more', 'this article', 'here', 'this', 'page', 'link', 'view', 'see more'];

function walk(dir: string, ext: string[]): string[] {
  const files: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      files.push(...walk(p, ext));
    } else if (e.isFile() && ext.some(x => e.name.endsWith(x))) {
      files.push(p);
    }
  }
  return files;
}

function extractAnchors(content: string): string[] {
  const anchors: string[] = [];
  const hrefRe = /href=["']([^"']+)["'][^>]*>([^<]+)</g;
  const toRe = /to=["']([^"']+)["'][^>]*>([^<]+)</g;
  let m;
  while ((m = hrefRe.exec(content)) !== null) anchors.push(m[2].trim());
  while ((m = toRe.exec(content)) !== null) anchors.push(m[2].trim());
  return anchors.filter(a => a.length > 0);
}

function main() {
  const files = walk(srcDir, ['.tsx', '.ts', '.jsx', '.js']);
  const all: string[] = [];
  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    all.push(...extractAnchors(content));
  }
  const genericCount = all.filter(a => generic.some(g => a.toLowerCase().includes(g))).length;
  const exactMatch = all.filter(a => /^[a-z0-9\s-]+$/i.test(a) && a.length > 3 && a.length < 60).length;
  const brand = all.filter(a => /grid nexus|thegridnexus/i.test(a)).length;
  const total = all.length;
  const report = {
    total,
    generic: { count: genericCount, pct: total ? ((genericCount / total) * 100).toFixed(1) : 0 },
    descriptive: { count: exactMatch, pct: total ? ((exactMatch / total) * 100).toFixed(1) : 0 },
    brand: { count: brand, pct: total ? ((brand / total) * 100).toFixed(1) : 0 },
  };
  console.log(JSON.stringify(report, null, 2));
}
main();
