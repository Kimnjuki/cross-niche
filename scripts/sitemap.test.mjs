/**
 * sitemap.test.mjs
 *
 * Guards the sitemap output against the four failure classes that produced the
 * "Submitted URL marked noindex" / "Submitted URL blocked by robots.txt" /
 * "Submitted URL has crawl issue" errors in Search Console:
 *
 *   1. A URL in the sitemap that the page itself marks noindex.
 *   2. A URL in the sitemap that robots.txt blocks.
 *   3. A URL on a non-canonical host (www, http).
 *   4. A duplicate URL, or a future-dated lastmod.
 *
 * Run:  node --test scripts/sitemap.test.mjs
 * Also wired into:  npm run test:seo
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { NON_INDEXABLE_ROUTES } from './lib/route-metadata.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const read = (name) => fs.readFileSync(path.join(publicDir, name), 'utf8');
const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const lastmods = (xml) => [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);

const CANONICAL_HOST = 'https://thegridnexus.com';

const robots = read('robots.txt');
const disallowRules = [...robots.matchAll(/^Disallow:\s*(\S+)/gm)].map(([, pattern]) => {
  const anchored = pattern.endsWith('$');
  const body = anchored ? pattern.slice(0, -1) : pattern;
  const escaped = body.split('*').map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
  return new RegExp(`^${escaped}${anchored ? '$' : ''}`);
});

function isBlocked(urlPath) {
  return disallowRules.some((re) => re.test(urlPath));
}

const sitemapFiles = ['sitemap.xml', 'sitemap-articles.xml', 'sitemap-news.xml'];

test('all sitemap files exist and parse', () => {
  for (const file of sitemapFiles) {
    const xml = read(file);
    assert.match(xml, /<\?xml/, `${file} has an XML declaration`);
    assert.match(xml, /<urlset|<sitemapindex/, `${file} has a root element`);
  }
});

test('every sitemap URL uses the canonical apex host', () => {
  const bad = [];
  for (const file of sitemapFiles) {
    for (const url of locs(read(file))) {
      if (!url.startsWith(`${CANONICAL_HOST}/`) && url !== `${CANONICAL_HOST}/`) {
        bad.push(`${file}: ${url}`);
      }
    }
  }
  assert.deepEqual(bad, [], `non-canonical URLs: ${bad.join(', ')}`);
});

test('no sitemap URL is a non-indexable route', () => {
  const bad = [];
  for (const file of sitemapFiles) {
    for (const url of locs(read(file))) {
      const urlPath = url.replace(CANONICAL_HOST, '').replace(/\/$/, '') || '/';
      if (NON_INDEXABLE_ROUTES.includes(urlPath)) bad.push(`${file}: ${url}`);
    }
  }
  assert.deepEqual(bad, [], `noindex URLs submitted in sitemap: ${bad.join(', ')}`);
});

test('no sitemap URL is blocked by robots.txt', () => {
  const bad = [];
  for (const file of sitemapFiles) {
    for (const url of locs(read(file))) {
      const urlPath = url.replace(CANONICAL_HOST, '') || '/';
      if (isBlocked(urlPath)) bad.push(`${file}: ${url}`);
    }
  }
  assert.deepEqual(bad, [], `robots-blocked URLs submitted in sitemap: ${bad.join(', ')}`);
});

test('no duplicate URLs within or across sitemaps', () => {
  const seen = new Map();
  const dupes = [];
  for (const file of sitemapFiles) {
    for (const url of locs(read(file))) {
      if (seen.has(url)) dupes.push(`${url} (${seen.get(url)} and ${file})`);
      else seen.set(url, file);
    }
  }
  assert.deepEqual(dupes, [], `duplicate URLs: ${dupes.join('; ')}`);
});

test('no future-dated lastmod values', () => {
  const today = new Date().toISOString().slice(0, 10);
  const bad = [];
  for (const file of sitemapFiles) {
    for (const d of lastmods(read(file))) {
      if (d > today) bad.push(`${file}: ${d}`);
    }
  }
  assert.deepEqual(bad, [], `future lastmod values: ${bad.join(', ')}`);
});

test('sitemap index references existing files on the canonical host', () => {
  const index = read('sitemap-index.xml');
  const refs = locs(index);
  assert.ok(refs.length > 0, 'sitemap index lists no sitemaps');
  for (const ref of refs) {
    assert.ok(
      ref.startsWith(`${CANONICAL_HOST}/`),
      `sitemap index entry is not on the canonical host: ${ref}`
    );
    const file = path.basename(ref);
    assert.ok(
      fs.existsSync(path.join(publicDir, file)),
      `sitemap index references a missing file: ${file}`
    );
  }
});

test('robots.txt advertises the sitemap index', () => {
  assert.match(robots, /^Sitemap: https:\/\/thegridnexus\.com\/sitemap-index\.xml$/m);
});

test('coverage summary', () => {
  const counts = sitemapFiles.map((f) => `${f}=${locs(read(f)).length}`).join(' ');
  console.log(`sitemap URLs — ${counts}`);
});