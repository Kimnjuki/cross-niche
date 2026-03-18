/**
 * Find all internal links pointing to a given URL (or loser URL) in the codebase.
 * Usage: npx tsx scripts/find_internal_links.ts [target_url]
 * Example: npx tsx scripts/find_internal_links.ts /article/old-slug
 */

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const target = process.argv[2] || '';
const srcDir = join(process.cwd(), 'src');

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

function main() {
  const files = walk(srcDir, ['.tsx', '.ts', '.jsx', '.js']);
  const matches: { file: string; line: number; content: string }[] = [];
  const patterns = ['href=', 'to=', "Link to="];
  const targetLower = target.toLowerCase();

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (!target && (line.includes('href=') || line.includes('to='))) return;
      const hasTarget = targetLower ? line.toLowerCase().includes(targetLower) : true;
      const hasLink = patterns.some(p => line.includes(p));
      if (hasLink && hasTarget) {
        matches.push({ file, line: i + 1, content: line.trim() });
      }
    });
  }

  console.log(target ? `Internal links to "${target}":` : 'All internal link patterns:');
  matches.forEach(m => console.log(`${m.file}:${m.line} ${m.content}`));
  console.log(`\nTotal: ${matches.length}`);
}
main();
