/**
 * Build-time content source — The Grid Nexus
 *
 * The production Docker build deliberately blanks VITE_CONVEX_URL (so a stale
 * deploy key is never baked into the browser bundle). That means the build-time
 * generators could not reach Convex, silently fell back to parsing
 * src/data/mockData.ts, and produced sitemaps + static HTML for only the 38
 * articles that happen to live in mockData — while Convex holds 100 published
 * records. See reports/phase-0-findings.md §V-03.
 *
 * Resolution order (first hit wins):
 *   1. src/data/content-snapshot.json   — committed snapshot, deterministic, no secret
 *   2. Convex                           — when CONVEX_URL / VITE_CONVEX_URL is set
 *   3. src/data/mockData.ts             — last-resort offline fallback
 *
 * Refresh the snapshot with: node scripts/export-content-snapshot.mjs
 */
import fs from 'fs';
import path from 'path';
import { projectRoot, parseMockArticles } from './mock-content.mjs';

export const SNAPSHOT_PATH = path.join(projectRoot, 'src', 'data', 'content-snapshot.json');

const toIsoDate = (value) => {
  if (value == null || value === '') return '';
  const ms = typeof value === 'number' ? value : Date.parse(String(value));
  if (Number.isNaN(ms)) return '';
  return new Date(ms).toISOString().slice(0, 10);
};

/** Normalize a Convex content doc into the shared item shape. */
function fromConvexDoc(doc, source = 'convex') {
  const title = String(doc.title ?? '');
  const description = String(doc.seoDescription ?? doc.summary ?? doc.subtitle ?? '');
  return {
    id: String(doc._id ?? doc.slug ?? ''),
    slug: String(doc.slug ?? ''),
    title,
    metaTitle: String(doc.metaTitle ?? title),
    description,
    excerpt: String(doc.summary ?? doc.subtitle ?? description),
    body: String(doc.body ?? ''),
    summary: String(doc.summary ?? ''),
    contentType: String(doc.contentType ?? 'article'),
    publishedAt: toIsoDate(doc.publishedAt ?? doc._creationTime),
    // Real per-item freshness signal — falls back to publish date only.
    lastModified: toIsoDate(doc.lastModifiedAt ?? doc.publishedAt ?? doc._creationTime),
    authorName: 'The Grid Nexus Editorial Team',
    readTime: Number(doc.estimatedReadingTimeMinutes ?? 0) || 5,
    featuredImageUrl: String(doc.featuredImageUrl ?? ''),
    isFeatured: doc.isFeatured === true,
    isBreaking: doc.isBreaking === true,
    isPremium: doc.isPremium === true,
    canonicalUrl: doc.canonicalUrl ? String(doc.canonicalUrl) : '',
    // Explicit, data-driven indexability (schema: content.noindex). Only an
    // explicit true suppresses indexing; absence means "index".
    noindex: doc.noindex === true,
    wordCount: Number(doc.wordCount ?? 0) || (doc.body ? String(doc.body).split(/\s+/).length : 0),
    tags: Array.isArray(doc.gamingPlatforms) ? doc.gamingPlatforms.map(String) : [],
    source,
  };
}

function readSnapshot() {
  if (!fs.existsSync(SNAPSHOT_PATH)) return null;
  try {
    const parsed = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8'));
    const docs = Array.isArray(parsed) ? parsed : parsed.items;
    if (!Array.isArray(docs) || docs.length === 0) return null;
    // The snapshot stores RAW Convex docs; normalize them into the same shared
    // item shape the live-Convex path produces so downstream generators never
    // see two different shapes.
    const items = docs
      .filter((d) => d && d.slug && String(d.slug).length > 3 && d.isDeleted !== true)
      .map((d) => fromConvexDoc(d, 'snapshot'));
    if (!items.length) return null;
    return { items, meta: parsed.meta ?? null };
  } catch (error) {
    console.warn(`[content-source] snapshot unreadable (${error.message}); continuing`);
    return null;
  }
}

async function fetchConvex() {
  const url = process.env.CONVEX_URL || process.env.VITE_CONVEX_URL || process.env.CONVEX_DEPLOYMENT_URL;
  if (!url) return null;

  try {
    const { ConvexHttpClient } = await import('convex/browser');
    const client = new ConvexHttpClient(url);
    const rows = await client.query('content:getAllPublishedContent', {});
    const items = (rows ?? [])
      .filter((d) => d && d.slug && String(d.slug).length > 3 && d.status === 'published' && d.isDeleted !== true)
      .map(fromConvexDoc);
    return items.length ? items : null;
  } catch (error) {
    console.warn(`[content-source] Convex fetch failed (${error.message}); continuing`);
    return null;
  }
}

/**
 * Best-effort Convex fetch for guides and topics — shared by the sitemap and
 * prerender generators. Never throws: every failure degrades to empty arrays.
 */
export async function fetchGuidesAndTopics() {
  const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) return { guides: [], topics: [] };

  const toIso = (v) => (v ? new Date(v).toISOString().slice(0, 10) : '');

  try {
    const { ConvexHttpClient } = await import('convex/browser');
    const client = new ConvexHttpClient(convexUrl);

    const [guides, topics] = await Promise.all([
      client.query('guides:list', {}).catch(() => []),
      client.query('topics:list', {}).catch(() => []),
    ]);

    return {
      guides: (guides ?? [])
        .filter((g) => g.slug && g.isPublished !== false)
        .map((g) => ({
          slug: g.slug,
          title: g.title,
          publishedAt: toIso(g.publishedAt),
          lastModified: toIso(g.lastModifiedAt),
          niche: 'guides',
        })),
      topics: (topics ?? [])
        .filter((t) => t.slug)
        .map((t) => ({
          slug: t.slug,
          title: t.name,
          niche: t.category ?? 'topics',
        })),
    };
  } catch (error) {
    console.warn('[content-source] Convex guides/topics fetch failed:', error.message);
    return { guides: [], topics: [] };
  }
}

/**
 * Load every indexable article.
 *
 * @param {object} [options]
 * @param {'auto'|'snapshot'|'convex'|'mock'} [options.source='auto']
 * @returns {Promise<{ items: Array<object>, source: string, snapshotMeta: object|null }>}
 */
export async function loadPublishedContent(options = {}) {
  const { source = 'auto' } = options;

  if (source === 'auto' || source === 'snapshot') {
    const snap = readSnapshot();
    if (snap) return { items: snap.items, source: 'snapshot', snapshotMeta: snap.meta };
    if (source === 'snapshot') throw new Error(`No usable snapshot at ${SNAPSHOT_PATH}`);
  }

  if (source === 'auto' || source === 'convex') {
    const items = await fetchConvex();
    if (items) return { items, source: 'convex', snapshotMeta: null };
    if (source === 'convex') throw new Error('Convex unreachable and no CONTENT_SOURCE_FALLBACK allowed');
  }

  const items = parseMockArticles();
  return { items, source: 'mockData', snapshotMeta: null };
}

/** The single canonical URL pattern for all articles on this site. */
export function canonicalUrlFor(item) {
  return item.canonicalUrl || `https://thegridnexus.com/article/${item.slug}`;
}

/** Sitemap priority derived from editorial flags (plan P1-T1 spec). */
export function priorityFor(item) {
  if (item.isBreaking) return 0.85;
  if (item.isFeatured) return 0.9;
  return 0.6;
}
