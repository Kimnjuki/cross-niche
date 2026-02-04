#!/usr/bin/env node
/**
 * Generate prerender routes from sitemap.xml
 * Run after generate:sitemap. Outputs to prerender-routes.json for vite-plugin-prerender.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const OUTPUT_PATH = path.join(__dirname, '../prerender-routes.json');

const STATIC_ROUTES = [
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
];

function extractArticleRoutes(xml) {
  const matches = xml.matchAll(/<loc>https:\/\/[^<]+\/article\/([^<]+)<\/loc>/g);
  const routes = [];
  for (const m of matches) {
    routes.push(`/article/${m[1]}`);
  }
  return routes;
}

function main() {
  let articleRoutes = [];
  if (fs.existsSync(SITEMAP_PATH)) {
    const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
    articleRoutes = extractArticleRoutes(xml);
  }
  const routes = [...STATIC_ROUTES, ...articleRoutes];
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(routes, null, 2));
  console.log(`Wrote ${routes.length} prerender routes to prerender-routes.json`);
}

main();
