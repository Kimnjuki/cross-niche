import fs from 'fs';
import path from 'path';

function walk(dir, depth = 0) {
  if (depth > 4) return [];
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const p = path.join(dir, e.name);
    if (fs.existsSync(path.join(p, 'index.html'))) out.push(p);
    out = out.concat(walk(p, depth + 1));
  }
  return out;
}

const dirs = walk('dist');
const noJsonLd = [];
const noOg = [];
const noCanonical = [];
const noTitle = [];
for (const d of dirs) {
  const html = fs.readFileSync(path.join(d, 'index.html'), 'utf8');
  const rel = d.replace(/\\/g, '/');
  if (!html.includes('application/ld+json')) noJsonLd.push(rel);
  if (!html.includes('og:title')) noOg.push(rel);
  if (!html.includes('rel="canonical"')) noCanonical.push(rel);
  if (!/<title>/.test(html)) noTitle.push(rel);
}
console.log('dirs with index.html:', dirs.length);
console.log('no JSON-LD:', noJsonLd.length, JSON.stringify(noJsonLd.slice(0, 15)));
console.log('no og:title:', noOg.length, JSON.stringify(noOg.slice(0, 15)));
console.log('no canonical:', noCanonical.length, JSON.stringify(noCanonical.slice(0, 15)));
console.log('no title:', noTitle.length, JSON.stringify(noTitle.slice(0, 15)));
