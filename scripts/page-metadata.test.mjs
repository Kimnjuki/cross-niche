/**
 * page-metadata.test.mjs
 *
 * Parity regression test for src/lib/seo/pageMetadata.ts.
 *
 * Why this file exists
 * -------------------
 * The SPA used to carry a hand-maintained copy of every route's title,
 * description and H1 in src/lib/seo/pageMetadata.ts, while the build-time
 * static shells were written from scripts/lib/route-metadata.mjs. The two
 * drifted apart completely: 38 of 38 shared routes had a different
 * description, 35 a different H1, 34 a different title, 21 registry routes
 * were missing from the SPA map entirely, 12 descriptions fell outside the
 * 140-158 character SERP window and one title ran to 62 characters.
 *
 * Because SEOHead writes title/description from getPageMetadata() after
 * hydration, the hydrated SPA was overwriting correct static metadata with
 * stale copy, and any route missing from the map silently fell back to the
 * generic homepage description.
 *
 * pageMetadata.ts is now GENERATED from the registry
 * (node scripts/generate-page-metadata.mjs). This test is the guard that
 * keeps it that way: it fails if the generated file drifts from the registry,
 * if a route is missing, or if any copy breaks the SERP length rules.
 *
 * Run:  node --test scripts/page-metadata.test.mjs
 * Also wired into:  npm run test:seo
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ROUTE_METADATA,
  NON_INDEXABLE_ROUTES,
  NON_INDEXABLE_METADATA,
  SITE_NAME as REGISTRY_SITE_NAME,
} from './lib/route-metadata.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const generatedPath = path.join(projectRoot, 'src/lib/seo/pageMetadata.ts');

// ── Parse the generated TypeScript into a plain object ─────────────────────
// The file is a flat `Record<string, PageMeta>` literal, so a brace-counting
// scan is enough and avoids adding a TS transpile step to the test.
function parseGenerated() {
  const src = fs.readFileSync(generatedPath, 'utf8');

  const siteNameMatch = src.match(/export const SITE_NAME = '([^']+)'/);
  assert.ok(siteNameMatch, 'SITE_NAME export not found in generated file');

  const start = src.indexOf('export const PAGE_METADATA');
  assert.ok(start !== -1, 'PAGE_METADATA export not found in generated file');
  const open = src.indexOf('{', start);
  assert.ok(open !== -1, 'PAGE_METADATA object literal not found');

  let depth = 0;
  let end = -1;
  let inString = false;
  let stringChar = '';
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (inString) {
      if (c === '\\') { i++; continue; }
      if (c === stringChar) inString = false;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inString = true; stringChar = c; continue; }
    if (c === '{') depth++;
    if (c === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  assert.ok(end !== -1, 'PAGE_METADATA object literal is not balanced');

  const literal = src.slice(open, end + 1);

  // Evaluate the literal as JS. Keys are single-quoted paths, values are
  // single-quoted strings, so this is safe and dependency-free.
  const entries = {};
  const entryRe = /'((?:[^'\\]|\\.)*)'\s*:\s*\{([^}]*)\}/g;
  let m;
  while ((m = entryRe.exec(literal)) !== null) {
    const key = m[1].replace(/\\'/g, "'");
    const body = m[2];
    const get = (field) => {
      const fm = body.match(new RegExp(`${field}\\s*:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
      return fm ? fm[1].replace(/\\'/g, "'") : undefined;
    };
    entries[key] = {
      title: get('title'),
      description: get('description'),
      h1: get('h1'),
    };
  }

  return { siteName: siteNameMatch[1], entries };
}

const { siteName, entries: PAGE_METADATA } = parseGenerated();

/**
 * Routes whose copy is not written for a search result.
 *
 * The 40-60 / 140-158 character windows exist so a SERP snippet is not
 * truncated. They are meaningless for pages that carry a noindex directive
 * (auth, account, internal utility and legacy redirect routes): those never
 * appear in a result, so their copy only has to be sensible for a human who
 * lands there. Enforcing SERP lengths on them would force padding onto pages
 * nobody searches for.
 */
const NON_INDEXABLE_SET = new Set(NON_INDEXABLE_ROUTES);
const INDEXABLE_ENTRIES = Object.entries(PAGE_METADATA).filter(
  ([routePath]) => !NON_INDEXABLE_SET.has(routePath)
);

// ── 1. Structural parity with the registry ─────────────────────────────────

test('generated file exists and is marked generated', () => {
  const src = fs.readFileSync(generatedPath, 'utf8');
  assert.match(src, /GENERATED FILE/, 'generated file must carry a GENERATED FILE banner');
  assert.match(
    src,
    /node scripts\/generate-page-metadata\.mjs/,
    'generated file must document its regeneration command'
  );
});

test('SITE_NAME matches the registry', () => {
  assert.equal(siteName, REGISTRY_SITE_NAME);
});

test('every registry route is present in PAGE_METADATA', () => {
  const missing = ROUTE_METADATA.map((r) => r.path).filter((p) => !PAGE_METADATA[p]);
  assert.deepEqual(
    missing,
    [],
    `registry routes missing from src/lib/seo/pageMetadata.ts: ${missing.join(', ')}`
  );
});

test('every non-indexable route is present in PAGE_METADATA', () => {
  const missing = NON_INDEXABLE_ROUTES.filter((p) => !PAGE_METADATA[p]);
  assert.deepEqual(
    missing,
    [],
    `non-indexable routes missing from PAGE_METADATA: ${missing.join(', ')}`
  );
});

test('registry copy is reproduced byte-for-byte', () => {
  const drift = [];
  for (const route of ROUTE_METADATA) {
    const got = PAGE_METADATA[route.path];
    if (!got) continue; // covered by the presence test above
    for (const field of ['title', 'description', 'h1']) {
      if (got[field] !== route[field]) {
        drift.push(
          `${route.path} ${field}:\n    registry: ${JSON.stringify(route[field])}\n    generated: ${JSON.stringify(got[field])}`
        );
      }
    }
  }
  assert.deepEqual(drift, [], `generated metadata drifted from the registry:\n${drift.join('\n')}`);
});

test('non-indexable copy is reproduced byte-for-byte', () => {
  const drift = [];
  for (const [routePath, meta] of Object.entries(NON_INDEXABLE_METADATA)) {
    const got = PAGE_METADATA[routePath];
    if (!got) continue;
    for (const field of ['title', 'description', 'h1']) {
      if (got[field] !== meta[field]) {
        drift.push(`${routePath} ${field}`);
      }
    }
  }
  assert.deepEqual(drift, [], `non-indexable metadata drifted: ${drift.join(', ')}`);
});

test('no unexpected extra routes beyond registry + non-indexable + SPA-only', () => {
  const allowed = new Set([
    ...ROUTE_METADATA.map((r) => r.path),
    ...NON_INDEXABLE_ROUTES,
    // SPA-only article overrides carried by the generator
    '/article/gaming-pc-antivirus-best-2026',
    '/article/minecraft-server-security-guide',
    '/article/gaming-pc-security-hardening-guide',
    '/article/steam-account-security-guide',
    '/article/2fa-setup-gaming-accounts',
  ]);
  const extra = Object.keys(PAGE_METADATA).filter((p) => !allowed.has(p));
  assert.deepEqual(extra, [], `unexpected routes in PAGE_METADATA: ${extra.join(', ')}`);
});

// ── 2. SERP length and uniqueness rules ────────────────────────────────────

test('every indexable title is 40-60 characters', () => {
  const bad = INDEXABLE_ENTRIES.filter(
    ([, m]) => typeof m.title !== 'string' || m.title.length < 40 || m.title.length > 60
  ).map(([p, m]) => `${p} (${m.title ? m.title.length : 'missing'} chars)`);
  assert.deepEqual(bad, [], `titles outside 40-60 chars: ${bad.join(', ')}`);
});

test('every indexable description is 140-158 characters', () => {
  const bad = INDEXABLE_ENTRIES.filter(
    ([, m]) =>
      typeof m.description !== 'string' ||
      m.description.length < 140 ||
      m.description.length > 158
  ).map(([p, m]) => `${p} (${m.description ? m.description.length : 'missing'} chars)`);
  assert.deepEqual(bad, [], `descriptions outside 140-158 chars: ${bad.join(', ')}`);
});

test('non-indexable routes still carry usable copy', () => {
  const bad = Object.entries(PAGE_METADATA)
    .filter(([p]) => NON_INDEXABLE_SET.has(p))
    .filter(([, m]) => !m.title || !m.description || !m.h1)
    .map(([p]) => p);
  assert.deepEqual(bad, [], `non-indexable routes with missing copy: ${bad.join(', ')}`);
});

test('titles are unique', () => {
  const seen = new Map();
  const dupes = [];
  for (const [p, m] of Object.entries(PAGE_METADATA)) {
    if (seen.has(m.title)) dupes.push(`${p} duplicates ${seen.get(m.title)}`);
    else seen.set(m.title, p);
  }
  assert.deepEqual(dupes, [], `duplicate titles: ${dupes.join('; ')}`);
});

test('descriptions are unique', () => {
  const seen = new Map();
  const dupes = [];
  for (const [p, m] of Object.entries(PAGE_METADATA)) {
    if (seen.has(m.description)) dupes.push(`${p} duplicates ${seen.get(m.description)}`);
    else seen.set(m.description, p);
  }
  assert.deepEqual(dupes, [], `duplicate descriptions: ${dupes.join('; ')}`);
});

test('H1 is unique and never a copy of the title tag', () => {
  const seen = new Map();
  const dupes = [];
  const sameAsTitle = [];
  for (const [p, m] of Object.entries(PAGE_METADATA)) {
    if (seen.has(m.h1)) dupes.push(`${p} duplicates ${seen.get(m.h1)}`);
    else seen.set(m.h1, p);
    if (m.h1 === m.title) sameAsTitle.push(p);
  }
  assert.deepEqual(dupes, [], `duplicate H1s: ${dupes.join('; ')}`);
  assert.deepEqual(sameAsTitle, [], `H1 identical to <title>: ${sameAsTitle.join(', ')}`);
});

// ── 3. index.html homepage parity ──────────────────────────────────────────

test('index.html homepage title/description match the registry', () => {
  const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const home = ROUTE_METADATA.find((r) => r.path === '/');
  assert.ok(home, "registry has no '/' entry");

  const unescape = (s) => s.replace(/&/g, '&').replace(/"/g, '"').replace(/'/g, "'");

  // Strip HTML comments first: index.html carries a long comment that mentions
  // "<title>" in prose, which a naive regex would match instead of the real tag.
  const htmlNoComments = html.replace(/<!--[\s\S]*?-->/g, '');

  const titleTag = htmlNoComments.match(/<title>([\s\S]*?)<\/title>/);
  assert.ok(titleTag, 'index.html has no <title>');
  assert.equal(
    unescape(titleTag[1].trim()),
    home.title,
    'index.html <title> must equal the registry homepage title'
  );

  const descTag = htmlNoComments.match(/<meta\s+name="description"\s+content="([\s\S]*?)"/);
  assert.ok(descTag, 'index.html has no meta description');
  assert.equal(
    unescape(descTag[1]),
    home.description,
    'index.html meta description must equal the registry homepage description'
  );

  // The same two strings must also appear in the Open Graph and Twitter tags,
  // because those are what social platforms and some crawlers read.
  for (const tag of ['og:title', 'twitter:title']) {
    const m = htmlNoComments.match(
      new RegExp(`<meta(?:\\s+property|\\s+name)="${tag}"\\s+content="([\\s\\S]*?)"`)
    );
    assert.ok(m, `index.html has no ${tag}`);
    assert.equal(unescape(m[1]), home.title, `${tag} must equal the registry homepage title`);
  }
  for (const tag of ['og:description', 'twitter:description']) {
    const m = htmlNoComments.match(
      new RegExp(`<meta(?:\\s+property|\\s+name)="${tag}"\\s+content="([\\s\\S]*?)"`)
    );
    assert.ok(m, `index.html has no ${tag}`);
    assert.equal(
      unescape(m[1]),
      home.description,
      `${tag} must equal the registry homepage description`
    );
  }
});

test('index.html canonical points at the apex host', () => {
  const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  assert.ok(canonical, 'index.html has no canonical link');
  assert.equal(canonical[1], 'https://thegridnexus.com/');
});

// ── 4. Coverage summary (informational) ────────────────────────────────────

test('coverage summary', () => {
  const registryPaths = new Set(ROUTE_METADATA.map((r) => r.path));
  const indexable = ROUTE_METADATA.filter((r) => r.indexable !== false).length;
  console.log(
    `PAGE_METADATA: ${Object.keys(PAGE_METADATA).length} routes ` +
      `(${indexable} indexable registry routes, ` +
      `${NON_INDEXABLE_ROUTES.length} non-indexable, ` +
      `${Object.keys(PAGE_METADATA).length - registryPaths.size - NON_INDEXABLE_ROUTES.length} SPA-only)`
  );
});