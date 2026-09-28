import fs from 'fs';
import { INDEXABLE_ROUTES } from './lib/route-metadata.mjs';
import { authorProfiles } from './lib/author-source.mjs';

const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const paths = locs.map(u => new URL(u).pathname.replace(/\/+$/, '') || '/');

const expected = new Set(INDEXABLE_ROUTES.map(r => r.path));
for (const [slug] of Object.entries(authorProfiles)) {
  if (slug === 'the-grid-nexus-editorial-team') continue;
  expected.add('/author/' + slug);
}
const actual = new Set(paths);
const missing = [...expected].filter(p => !actual.has(p));
const extra = [...actual].filter(p => !expected.has(p));
console.log('INDEXABLE_ROUTES:', INDEXABLE_ROUTES.length);
console.log('expected total (indexable+authors):', expected.size);
console.log('sitemap locs:', paths.length);
console.log('missing from sitemap:', JSON.stringify(missing));
console.log('extra in sitemap:', JSON.stringify(extra));

const pre = JSON.parse(fs.readFileSync('prerender-routes.json', 'utf8'));
console.log('prerender total:', pre.length);
const preSet = new Set(pre);
const missingPre = [...expected].filter(p => !preSet.has(p));
console.log('missing from prerender:', JSON.stringify(missingPre.slice(0, 20)));
