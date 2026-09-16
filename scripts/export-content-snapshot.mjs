#!/usr/bin/env node
/**
 * Export Content Snapshot — The Grid Nexus
 *
 * Writes src/data/content-snapshot.json from Convex so the production build can
 * generate sitemaps + static article HTML for EVERY published article without a
 * Convex URL or deploy key being present in the image.
 *
 * Why this exists: the Dockerfile blanks VITE_CONVEX_URL at build time on
 * purpose (to stop a stale deploy key being baked into the browser bundle).
 * Without a snapshot the generators fall back to src/data/mockData.ts, which
 * only contains 38 of the 100 published articles — see
 * reports/phase-0-findings.md §V-03.
 *
 * Run this whenever content is published or materially updated, then commit the
 * resulting JSON:
 *
 *   node scripts/export-content-snapshot.mjs
 *   node scripts/export-content-snapshot.mjs --out other.json
 *
 * Exits non-zero if Convex is unreachable, so CI notices a stale snapshot job
 * rather than silently shipping a stale one.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const DEFAULT_OUT = path.join(projectRoot, 'src', 'data', 'content-snapshot.json');

/**
 * Minimal .env loader (no dotenv dependency in this repo).
 * Reads .env.local then .env, without clobbering values already in process.env.
 */
function loadEnvFiles() {
  for (const name of ['.env.local', '.env']) {
    const file = path.join(projectRoot, name);
    if (!fs.existsSync(file)) continue;
    for (const rawLine of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      const value = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  }
}

/** Fields worth committing — keeps the snapshot small and reviewable. */
const KEEP = [
  '_id',
  '_creationTime',
  'title',
  'slug',
  'metaTitle',
  'seoDescription',
  'summary',
  'subtitle',
  'body',
  'contentType',
  'publishedAt',
  'lastModifiedAt',
  'featuredImageUrl',
  'isFeatured',
  'isBreaking',
  'isPremium',
  'canonicalUrl',
  'estimatedReadingTimeMinutes',
  'wordCount',
  'viewCount',
  'status',
  'isDeleted',
  'gamingPlatforms',
];

function project(doc) {
  const out = {};
  for (const key of KEEP) {
    if (doc[key] !== undefined && doc[key] !== null) out[key] = doc[key];
  }
  return out;
}

function parseArgs(argv) {
  const out = { out: DEFAULT_OUT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--out' && argv[i + 1]) out.out = path.resolve(projectRoot, argv[i + 1]);
    if (argv[i] === '--url' && argv[i + 1]) out.url = argv[i + 1];
  }
  return out;
}

async function main() {
  loadEnvFiles();
  const args = parseArgs(process.argv.slice(2));
  const url = args.url || process.env.CONVEX_URL || process.env.VITE_CONVEX_URL;

  if (!url) {
    console.error('No Convex URL. Set CONVEX_URL or VITE_CONVEX_URL, or pass --url <deployment>.');
    process.exit(1);
  }

  console.log(`Exporting published content from ${url} ...`);
  const { ConvexHttpClient } = await import('convex/browser');
  const client = new ConvexHttpClient(url);

  const rows = await client.query('content:getAllPublishedContent', {});
  const items = (rows ?? [])
    .filter((d) => d && d.slug && d.status === 'published' && d.isDeleted !== true)
    .map(project);

  if (items.length === 0) {
    console.error('Convex returned zero published items — refusing to overwrite the snapshot.');
    process.exit(1);
  }

  const meta = {
    generatedAt: new Date().toISOString(),
    convexUrlHost: new URL(url).host,
    count: items.length,
    // The underlying query is hard-capped at 100 docs (convex/content.ts
    // getAllPublishedContent: .slice(0, 100)). Record it so a future reader can
    // tell whether the snapshot may be truncated.
    sourceQueryCap: 100,
    possiblyTruncated: items.length >= 100,
  };

  const payload = { meta, items };
  fs.mkdirSync(path.dirname(args.out), { recursive: true });
  fs.writeFileSync(args.out, JSON.stringify(payload, null, 2) + '\n', 'utf-8');

  const bytes = fs.statSync(args.out).size;
  console.log(`Wrote ${items.length} items (${(bytes / 1024).toFixed(0)} KB) -> ${args.out}`);
  if (meta.possiblyTruncated) {
    console.warn(
      'NOTE: item count hit the 100-doc cap of content:getAllPublishedContent. ' +
        'Older published articles may exist beyond this snapshot window.',
    );
  }

  const withBody = items.filter((i) => i.body && i.body.length > 0).length;
  console.log(`Items carrying a body: ${withBody}/${items.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
