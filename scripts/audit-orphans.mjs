import fs from 'fs';
import path from 'path';

// Scan every dist/**/index.html, collect outgoing internal links, then find
// pages that receive ZERO incoming links (orphans). Only pages that exist as
// static HTML are considered (SPAs without shells can't be traced).
function walk(dir, depth = 0) {
  if (depth > 6) return [];
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const p = path.join(dir, e.name);
    if (fs.existsSync(path.join(p, 'index.html'))) out.push(p);
    out = out.concat(walk(p, depth + 1));
  }
  return out;
}

const dirs = walk('dist').filter((d) => !d.endsWith(path.join('dist', 'assets')));
const pages = new Map(); // route path -> html
for (const d of dirs) {
  let route = d.replace(/\\/g, '/').replace(/^dist/, '');
  if (route === '') route = '/';
  pages.set(route, fs.readFileSync(path.join(d, 'index.html'), 'utf8'));
}

const incoming = new Map([...pages.keys()].map((k) => [k, 0]));
for (const [route, html] of pages) {
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    let target = m[1];
    if (target === '' || target === '/') target = '/';
    if (incoming.has(target) && target !== route) incoming.set(target, incoming.get(target) + 1);
  }
}

const orphans = [...incoming.entries()].filter(([, n]) => n === 0).map(([k]) => k);
console.log('static pages traced:', pages.size);
console.log('orphans (0 incoming links from other static pages):', orphans.length);
const articles = orphans.filter((p) => p.startsWith('/article/'));
console.log('  of which articles:', articles.length);
console.log(orphans.slice(0, 40).join('\n'));
