#!/usr/bin/env node
/**
 * Generate prerender routes from sitemap.xml
 * Run after generate:sitemap. Outputs to prerender-routes.json for vite-plugin-prerender.
 * Extracts all URLs from sitemap (static + articles) for full crawlability.
 * Limits article routes to avoid very long builds (Puppeteer renders each route).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const OUTPUT_PATH = path.join(__dirname, '../prerender-routes.json');

/** Max article routes to prerender (keeps build time manageable) */
const MAX_ARTICLE_ROUTES = 50;

/** Fallback when sitemap missing or empty */
const STATIC_ROUTES = [
  '/',
  '/tech',
  '/security',
  '/gaming',
  '/news',
  '/explore',
  '/topics',
  '/guides',
  '/blog-series',
  '/tutorials',
  '/roadmap',
  '/ai-pulse',
  '/breach-sim',
  '/nexus-intersection',
  '/security-score',
  '/reviews',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclosure',
  '/editorial',
];

function extractRoutesFromSitemap(xml) {
  const routes = [];
  const baseUrl = 'https://thegridnexus.com';
  const matches = xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g);
  const seen = new Set();
  let articleCount = 0;

  for (const m of matches) {
    const fullUrl = m[1];
    let pathname = fullUrl;
    if (fullUrl.startsWith(baseUrl)) {
      pathname = fullUrl.slice(baseUrl.length) || '/';
    } else if (fullUrl.startsWith('http')) {
      continue; // Skip external URLs
    }
    const routePath = pathname.split('?')[0].split('#')[0];
    if (seen.has(routePath)) continue;
    seen.add(routePath);

    if (routePath.startsWith('/article/')) {
      articleCount++;
      if (articleCount <= MAX_ARTICLE_ROUTES) {
        routes.push(routePath);
      }
    } else {
      routes.push(routePath || '/');
    }
  }

  return routes;
}

function main() {
  let routes;
  if (fs.existsSync(SITEMAP_PATH)) {
    const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
    routes = extractRoutesFromSitemap(xml);
    if (routes.length === 0) {
      routes = STATIC_ROUTES;
      console.log('   Sitemap empty or parse failed, using static routes');
    }
  } else {
    routes = STATIC_ROUTES;
    console.log('   Sitemap not found, using static routes');
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(routes, null, 2));
  const articleCount = routes.filter((r) => r.startsWith('/article/')).length;
  console.log(`Wrote ${routes.length} prerender routes (${articleCount} articles) to prerender-routes.json`);
}

main();
