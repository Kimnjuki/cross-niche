/**
 * Report the structure of a generated article body: word count, heading tree,
 * image placement, tables and list counts.
 *
 * Usage: node scripts/article-body-stats.mjs <html-file-or-ts-file>
 */
import fs from 'fs';

const file = process.argv[2];
let html = fs.readFileSync(file, 'utf8');

// If handed the TS module, pull out the template literals instead.
if (file.endsWith('.ts') || file.endsWith('.tsx')) {
  const blocks = [...html.matchAll(/`([\s\S]*?)`;/g)].map((m) => m[1]).join('\n');
  html = blocks;
}

const text = html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/g, ' ');

const words = text.split(/\s+/).filter(Boolean).length;
const headings = [...html.matchAll(/<h([1-6])>([\s\S]*?)<\/h\1>/g)].map(
  (m) => `${'  '.repeat(Number(m[1]) - 1)}h${m[1]}: ${m[2].replace(/<[^>]+>/g, '').trim()}`
);
const images = [...html.matchAll(/<img\b[^>]*src="([^"]*)"[^>]*>/g)].map((m) => m[1]);
const alts = [...html.matchAll(/<img\b[^>]*alt="([^"]*)"/g)].map((m) => m[1]);
const captions = [...html.matchAll(/<figcaption>([\s\S]*?)<\/figcaption>/g)].map((m) =>
  m[1].replace(/<[^>]+>/g, '').trim()
);
const links = [...html.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map((m) => m[1]);
const tableCount = (html.match(/<table/g) || []).length;
const listCount = (html.match(/<ul>|<ol>/g) || []).length;

console.log('=== WORDS ===');
console.log(words);
console.log('\n=== HEADINGS (' + headings.length + ') ===');
console.log(headings.join('\n'));
console.log('\n=== IMAGES (' + images.length + ') ===');
images.forEach((src, i) => console.log(`  ${i + 1}. ${src}\n     alt: ${alts[i] ?? '(none)'}`));
console.log('\n=== FIGCAPTIONS (' + captions.length + ') ===');
captions.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
console.log('\n=== TABLES:', tableCount, ' LISTS:', listCount, ' LINKS:', links.length, '===');
const external = links.filter((h) => /^https?:/i.test(h));
console.log('external links:', external.length);
if (external.length) console.log(external.join('\n'));
