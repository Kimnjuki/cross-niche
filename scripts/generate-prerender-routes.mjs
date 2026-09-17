/**
 * Generate prerender-routes.json for vite-plugin-prerender
 * Reads article slugs from the shared build-time content source
 * (scripts/lib/content-source.mjs) so the route list matches what the
 * sitemap and static-HTML generators produce — NOT just the mockData subset.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadPublishedContent, fetchGuidesAndTopics } from './lib/content-source.mjs';
import { authorProfiles } from './lib/author-source.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(__dirname, '..', 'prerender-routes.json');

const routes = [
  '/',
  '/tech',
  '/security',
  '/gaming',
  '/news',
  '/topics',
  '/guides',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/roadmap',
  '/blog-series',
  '/security-profile',
  '/community-threats',
  '/tools',
];

async function main() {
  const { items, source } = await loadPublishedContent();
  console.log(`📄 Content source: ${source} (${items.length} published articles)`);

  const seen = new Set(routes);
  for (const item of items) {
    if (!item.slug || item.slug.length <= 3) continue;
    const route = `/article/${item.slug}`;
    if (!seen.has(route)) {
      seen.add(route);
      routes.push(route);
    }
  }

  // Guides/topics only enrich the list when Convex happens to be reachable.
  const { guides, topics } = await fetchGuidesAndTopics();
  for (const g of guides) {
    const route = `/guides/${g.slug}`;
    if (!seen.has(route)) {
      seen.add(route);
      routes.push(route);
    }
  }
  for (const t of topics) {
    const route = `/topics/${t.slug}`;
    if (!seen.has(route)) {
      seen.add(route);
      routes.push(route);
    }
  }

  // Author profile pages
  for (const [slug, profile] of Object.entries(authorProfiles)) {
    if (slug === 'the-grid-nexus-editorial-team') continue;
    const route = `/author/${slug}`;
    if (!seen.has(route)) {
      seen.add(route);
      routes.push(route);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
  console.log(`Generated ${routes.length} prerender routes → ${outputPath}`);
}

main();
