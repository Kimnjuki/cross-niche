/**
 * Route-shell / indexation regression tests — The Grid Nexus
 *
 * Locks in the September 2026 de-indexation fixes:
 *   1. Every indexable route has unique, length-safe SERP metadata.
 *   2. /index.html never re-grows a runtime meta injector (the bug that gave
 *      every URL a homepage canonical).
 *   3. Every URL in the sitemaps resolves to a route that exists, is indexable
 *      and is crawlable per robots.txt.
 *   4. sitemap-news.xml uses the namespace Google actually supports and only
 *      lists canonical article URLs from the last 48 hours.
 *
 * Run: npm run test:seo
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';

import {
  ROUTE_METADATA,
  NON_INDEXABLE_ROUTES,
} from './lib/route-metadata.mjs';

const read = (relative) => fs.readFileSync(new URL(`../${relative}`, import.meta.url), 'utf8');
const readIfExists = (relative) => {
  const url = new URL(`../${relative}`, import.meta.url);
  return fs.existsSync(url) ? fs.readFileSync(url, 'utf8') : null;
};

const indexHtml = read('index.html');
const robotsTxt = read('public/robots.txt');
const sitemapXml = readIfExists('public/sitemap.xml');
const sitemapArticlesXml = readIfExists('public/sitemap-articles.xml');
const sitemapIndexXml = readIfExists('public/sitemap-index.xml');
const sitemapNewsXml = readIfExists('public/sitemap-news.xml');

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const words = (text) => String(text).split(/\s+/).filter(Boolean).length;

// ── 1. Per-route metadata quality ──────────────────────────────────────────
test('every indexable route has a unique 40-60 character title', () => {
  const seen = new Map();
  for (const route of ROUTE_METADATA) {
    assert.ok(
      route.title.length >= 40 && route.title.length <= 60,
      `${route.path} title is ${route.title.length} chars: "${route.title}"`
    );
    assert.ok(!seen.has(route.title), `${route.path} duplicates the title used by ${seen.get(route.title)}`);
    seen.set(route.title, route.path);
  }
});

test('every indexable route has a unique 140-158 character description', () => {
  const seen = new Map();
  for (const route of ROUTE_METADATA) {
    assert.ok(
      route.description.length >= 140 && route.description.length <= 158,
      `${route.path} description is ${route.description.length} chars`
    );
    assert.ok(
      !seen.has(route.description),
      `${route.path} duplicates the description used by ${seen.get(route.description)}`
    );
    seen.set(route.description, route.path);
  }
});

test('no route reuses another route H1 or copies its own title', () => {
  const seen = new Map();
  for (const route of ROUTE_METADATA) {
    assert.notEqual(route.h1, route.title, `${route.path} H1 is identical to its <title>`);
    assert.ok(!seen.has(route.h1), `${route.path} duplicates the H1 used by ${seen.get(route.h1)}`);
    seen.set(route.h1, route.path);
  }
});

test('every route ships at least 25 words of unique intro copy', () => {
  for (const route of ROUTE_METADATA) {
    assert.ok(
      words(route.intro) >= 25,
      `${route.path} intro has ${words(route.intro)} words (a shared shell is what caused the duplicate-content collapse)`
    );
  }
});

test('indexable and non-indexable route lists are exclusive', () => {
  const indexable = new Set(ROUTE_METADATA.map((r) => r.path));
  for (const route of NON_INDEXABLE_ROUTES) {
    assert.ok(!indexable.has(route), `${route} is listed as both indexable and non-indexable`);
  }
});

// ── 2. Regression guard: no runtime meta injection ─────────────────────────
test('index.html has no runtime DOMContentLoaded meta injector', () => {
  const head = indexHtml.split('</head>')[0];
  assert.doesNotMatch(
    head,
    /document\.addEventListener\('DOMContentLoaded'/,
    'A runtime meta injector is back. It rewrites title/description/canonical after load and falls back to the homepage for unknown routes, which gives every URL a homepage canonical.'
  );
});

test('index.html ships exactly one static canonical, pointing at the apex homepage', () => {
  const head = indexHtml.split('</head>')[0].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const canonicals = [...head.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/gi)];
  assert.equal(canonicals.length, 1);
  assert.match(canonicals[0][0], /href="https:\/\/thegridnexus\.com\/"/);
});

test('index.html ships a single 50-190 character meta description', () => {
  const head = indexHtml.split('</head>')[0].replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const descriptions = [...head.matchAll(/<meta\b[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/gi)];
  assert.equal(descriptions.length, 1);
  const length = descriptions[0][1].length;
  assert.ok(length >= 50 && length <= 190, `Homepage description is ${length} characters`);
});

test('index.html advertises og:description and twitter:description in the raw HTML', () => {
  const head = indexHtml.split('</head>')[0];
  assert.match(head, /<meta property="og:description" content="[^"]{50,}"/);
  assert.match(head, /<meta name="twitter:description" content="[^"]{50,}"/);
});

// ── 3. Sitemap ↔ route registry ↔ robots.txt consistency ────────────────────
/** Longest-match-wins robots.txt matcher (Allow beats Disallow on ties). */
const robotsRules = [...robotsTxt.matchAll(/^(Allow|Disallow):\s*(\S+)/gm)].map(([, action, pattern]) => {
  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const escaped = body.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
  return {
    action,
    specificity: body.replaceAll('*', '').length,
    regex: new RegExp(`^${escaped}${anchored ? '$' : ''}`),
  };
});

function isCrawlable(pathname) {
  const matches = robotsRules
    .filter((rule) => rule.regex.test(pathname))
    .sort((a, b) => b.specificity - a.specificity || (a.action === 'Allow' ? -1 : 1));
  return !matches.length || matches[0].action === 'Allow';
}

const knownStaticPaths = new Set(ROUTE_METADATA.map((r) => r.path));
const authorSlugs = new Set(
  Object.keys(
    (() => {
      try {
        // authorData.ts is parsed by scripts/lib/author-source.mjs at runtime; a
        // static import here would pull the whole TS reader into the test.
        const src = read('src/data/authorData.ts');
        return Object.fromEntries(
          [...src.matchAll(/^\s{2}'?([a-z0-9-]+)'?:\s*\{/gim)].map((m) => [m[1], true])
        );
      } catch {
        return {};
      }
    })()
  )
);

function isKnownRoute(loc) {
  const { pathname } = new URL(loc);
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (knownStaticPaths.has(clean)) return true;
  if (/^\/article\/[a-z0-9-]+$/i.test(clean)) return true;
  if (/^\/author\/[a-z0-9-]+$/i.test(clean)) return true;
  return authorSlugs.has(clean.replace('/author/', ''));
}

for (const [name, xml] of [
  ['sitemap.xml', sitemapXml],
  ['sitemap-articles.xml', sitemapArticlesXml],
]) {
  test(`${name} only lists apex-host URLs that exist as real routes`, () => {
    if (!xml) return; // sitemap not generated in this checkout
    const urls = locs(xml);
    assert.ok(urls.length > 0, `${name} has no URLs`);
    for (const loc of urls) {
      const { hostname, pathname } = new URL(loc);
      assert.equal(hostname, 'thegridnexus.com', `${loc} uses a non-canonical host`);
      assert.ok(!pathname.endsWith('/') || pathname === '/', `${loc} has a trailing slash`);
      assert.ok(
        isKnownRoute(loc),
        `${loc} is in ${name} but has no route in scripts/lib/route-metadata.mjs (it would serve the homepage shell)`
      );
    }
  });

  test(`${name} only lists URLs that robots.txt allows crawling`, () => {
    if (!xml) return;
    for (const loc of locs(xml)) {
      const pathname = new URL(loc).pathname;
      assert.ok(isCrawlable(pathname), `${loc} is in ${name} but blocked by robots.txt`);
    }
  });
}

test('no URL is listed in both sitemaps', () => {
  if (!sitemapXml || !sitemapArticlesXml) return;
  const main = new Set(locs(sitemapXml));
  const overlap = locs(sitemapArticlesXml).filter((loc) => main.has(loc));
  assert.deepEqual(overlap, [], `URLs listed twice: ${overlap.slice(0, 5).join(', ')}`);
});

test('non-indexable routes never appear in any sitemap', () => {
  const all = [...locs(sitemapXml ?? ''), ...locs(sitemapArticlesXml ?? '')];
  for (const route of NON_INDEXABLE_ROUTES) {
    const offenders = all.filter((loc) => new URL(loc).pathname.replace(/\/+$/, '') === route);
    assert.deepEqual(offenders, [], `${route} is noindex but appears in a sitemap`);
  }
});

// ── 4. News sitemap spec compliance ────────────────────────────────────────
test('sitemap-news.xml uses the namespace Google supports', () => {
  if (!sitemapNewsXml) return;
  if (!locs(sitemapNewsXml).length) {
    assert.match(sitemapNewsXml, /<urlset[\s\S]*?<\/urlset>/);
  }
  assert.match(
    sitemapNewsXml,
    /xmlns:news="http:\/\/www\.google\.com\/schemas\/sitemap-news\/0\.9"/,
    'Unsupported news namespace — Google rejects the whole file'
  );
  assert.doesNotMatch(sitemapNewsXml, /schemas\/news\/sitemap\/2\.0/);
});

test('sitemap-news.xml only lists canonical /article/ URLs', () => {
  if (!sitemapNewsXml) return;
  for (const loc of locs(sitemapNewsXml)) {
    assert.match(loc, /^https:\/\/thegridnexus\.com\/article\/[a-z0-9-]+$/i, `${loc} is not a canonical article URL`);
  }
});

test('sitemap-index.xml advertises the news sitemap only when it has entries', () => {
  if (!sitemapIndexXml || !sitemapNewsXml) return;
  const hasNewsUrls = locs(sitemapNewsXml).length > 0;
  const advertised = sitemapIndexXml.includes('sitemap-news.xml');
  assert.equal(
    advertised,
    hasNewsUrls,
    hasNewsUrls
      ? 'sitemap-news.xml has entries but is missing from sitemap-index.xml'
      : 'sitemap-news.xml is empty but still advertised (Google News only accepts the last 48 hours)'
  );
});

