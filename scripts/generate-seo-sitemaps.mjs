#!/usr/bin/env node
/**
 * SEO Sitemap Generator — The Grid Nexus
 *
 * Generates clean, valid sitemaps that ONLY contain URLs which resolve to
 * real, indexable pages. This fixes the GSC coverage issues:
 *   - "Excluded by noindex" (phantom article URLs that render Article-Not-Found)
 *   - "Not found (404)" (URLs pointing to non-existent pages)
 *   - "Discovered/Crawled - currently not indexed" (SPA pages Google can't render)
 *   - "Duplicate, Google chose different canonical" (route/canonical mismatch)
 *
 * Data source: shared build-time content source (scripts/lib/content-source.mjs)
 * — committed content-snapshot.json first, then live Convex, then mockData.ts.
 *
 * Run: node scripts/generate-seo-sitemaps.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadPublishedContent, priorityFor, canonicalUrlFor, fetchGuidesAndTopics } from './lib/content-source.mjs';
import { authorProfiles } from './lib/author-source.mjs';
import {
  ROUTE_METADATA,
  INDEXABLE_ROUTES,
  NON_INDEXABLE_ROUTES,
  isNonIndexable,
} from './lib/route-metadata.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://thegridnexus.com';
const TODAY = new Date().toISOString().split('T')[0];

const PLACEHOLDER_TITLE_PATTERNS = [
  /^Sec\s+\d+(\s*\|.*)?$/i,
  /^Tech\s+\d+(\s*\|.*)?$/i,
  /^Game\s+\d+(\s*\|.*)?$/i,
  /^Rivacy(\s*\|.*)?$/i,
];

function isPlaceholderTitle(title) {
  if (!title) return false;
  return PLACEHOLDER_TITLE_PATTERNS.some((pattern) => pattern.test(title.trim()));
}

// ── Guides & topics come from the shared content-source lib ────────────────
// (best-effort Convex fetch; all failures degrade to empty arrays)

// ── XML helpers ─────────────────────────────────────────────────────────────
function escapeXml(str) {
  if (!str) return '';
  const amp = String.fromCharCode(38);
  return String(str)
    .replace(/&/g, amp + 'amp;')
    .replace(/</g, amp + 'lt;')
    .replace(/>/g, amp + 'gt;')
    .replace(/"/g, amp + 'quot;')
    .replace(/'/g, amp + 'apos;');
}

function urlEntry(loc, lastmod, changefreq, priority, image = '') {
  // P1-T2: actually USE the declared image namespace for entries that have one.
  const imageXml = image
    ? `\n    <image:image>\n      <image:loc>${escapeXml(image)}</image:loc>\n    </image:image>`
    : '';
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageXml}
  </url>`;
}

// ── Static pages: DERIVED from ROUTE_METADATA (single source of truth) ─────
// INDEXABLE_ROUTES + author profiles (excluding the editorial-team aggregate).
// The old hand-maintained list drifted: it shipped /security-profile,
// /api, /sitemap, /seo-checklist, /keyword-gap-analysis (all noindex or
// robots-blocked → "Submitted URL blocked by robots.txt") plus
// /notifications and /settings (private). Those are now impossible —
// generateMainSitemap() also filters via isNonIndexable() as a second net.
function getStaticPages() {
  const pages = INDEXABLE_ROUTES.map((route) => ({
    loc: route.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${route.path}`,
    lastmod: TODAY,
    changefreq: route.changefreq,
    priority: route.priority,
  }));
  // Author profiles (excluding the editorial-team aggregate page).
  for (const [slug] of Object.entries(authorProfiles)) {
    if (slug === 'the-grid-nexus-editorial-team') continue;
    pages.push({
      loc: `${BASE_URL}/author/${slug}`,
      lastmod: TODAY,
      changefreq: 'monthly',
      priority: 0.6,
    });
  }
  return pages;
}

// ── Generate sitemap.xml (STATIC pages + guides/topics only) ──────────────
// P1-5 fix: article URLs must NOT appear here (they live in
// sitemap-articles.xml). Listing articles in both sitemaps caused
// "pages listed in multiple sitemaps" (38 URLs in the audit).
//
// 2026-09-28 fix: a sitemap may only list URLs that (a) return 200 with their
// OWN indexable HTML and (b) are not blocked in robots.txt. The old list shipped
// /notifications, /settings, /api and /security-profile (all Disallow-ed in
// robots.txt → "Submitted URL blocked by robots.txt") plus /sitemap,
// /seo-checklist and /keyword-gap-analysis, which are internal tooling with no
// search demand. Those are now filtered out via the shared route registry.
function generateMainSitemap() {
  const urls = getStaticPages().filter((u) => {
    const pathname = new URL(u.loc).pathname.replace(/\/+$/, '') || '/';
    return !isNonIndexable(pathname) && !NON_INDEXABLE_ROUTES.includes(pathname);
  });

  // NOTE (2026-09-28): /guides/<slug> and /topics/<slug> are intentionally NOT
  // listed. Both are Convex-backed routes that receive no build-time HTML, so a
  // crawler would hit them and be handed the homepage shell — the soft-404
  // pattern this remediation exists to eliminate. They return to the sitemap
  // once scripts/generate-static-route-shells.mjs can emit HTML for them too.

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => urlEntry(u.loc, u.lastmod, u.changefreq, u.priority)).join('\n')}
</urlset>`;
  return xml;
}

// ── Generate sitemap-articles.xml (ALL valid article URLs) ──────────────────
function generateArticlesSitemap(articles) {
  const articleUrls = articles
    .filter((a) => a.niche !== 'guides' && a.niche !== 'topics' && !isPlaceholderTitle(a.title))
    .map((a) => ({
      loc: a.loc,
      // V-04 fix: real per-item lastmod (lastModifiedAt ?? publishedAt),
      // NOT a shared build timestamp — Google uses lastmod as a freshness
      // and recrawl signal, so uniform values defeat its purpose.
      lastmod: a.lastModified || a.publishedAt || TODAY,
      changefreq: 'weekly',
      priority: a.priority,
      image: a.featuredImageUrl || '',
    }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${articleUrls.map((u) => urlEntry(u.loc, u.lastmod, u.changefreq, u.priority, u.image)).join('\n')}
</urlset>`;
  return xml;
}

// ── Generate sitemap-news.xml (Google News, last 48 hours only) ────────────
//
// 2026-09-28 fixes:
//   1. NAMESPACE was `http://www.google.com/schemas/news/sitemap/2.0`, which is
//      not a namespace Google supports for news sitemaps — the whole file was
//      rejected. The supported value is
//      `http://www.google.com/schemas/sitemap-news/0.9`.
//   2. Google only accepts articles from the LAST 48 HOURS in a news sitemap.
//      The file shipped 101 entries dated back to July, which invalidates it.
//   3. Entries must be the canonical /article/<slug> URL. Hand-set aliases
//      (www. host, /gaming/<slug>) redirect and are rejected as non-canonical.
//   4. An empty news sitemap is a valid, empty <urlset> — and when it is empty
//      the index no longer advertises it.
const NEWS_WINDOW_HOURS = 48;

function isWithinNewsWindow(dateValue) {
  if (!dateValue) return false;
  const ms = typeof dateValue === 'number' ? dateValue : Date.parse(String(dateValue));
  if (Number.isNaN(ms)) return false;
  return Date.now() - ms <= NEWS_WINDOW_HOURS * 60 * 60 * 1000;
}

function generateNewsSitemap(articles) {
  const articleEntries = articles
    .filter((a) => a.niche !== 'guides' && a.niche !== 'topics')
    .filter((a) => isWithinNewsWindow(a.publishedAt) || isWithinNewsWindow(a.lastModified))
    .filter((a) => !isPlaceholderTitle(a.title))
    .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
    .slice(0, 1000);

  const entries = articleEntries.map((a) => {
    const title = escapeXml(a.title || a.slug);
    // Always the canonical article URL — never an alias that redirects.
    const loc = `${BASE_URL}/article/${a.slug}`;
    const publicationDate = a.publishedAt || a.lastModified || TODAY;
    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>The Grid Nexus</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
  }).join('\n');

  return {
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>`,
    count: articleEntries.length,
  };
}

// ── Generate sitemap-index.xml ──────────────────────────────────────────────
function generateIndexSitemap(includeNews) {
  const newsEntry = includeNews
    ? `  <sitemap>
    <loc>${BASE_URL}/sitemap-news.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
`
    : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-articles.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
${newsEntry}</sitemapindex>`;
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const { items, source } = await loadPublishedContent();
  console.log(`📄 Content source: ${source} (${items.length} published articles)`);

  // Normalize shared items into sitemap rows. Sitemap locs must MATCH the
  // rendered canonical (www/apex included) or Google reports "duplicate,
  // Google chose different canonical". Only genuinely off-domain canonicals
  // are skipped — submitting another site's URLs is pointless.
  const ALLOWED_HOSTS = new Set(['thegridnexus.com', 'www.thegridnexus.com']);
  let skippedCrossDomain = 0;
  let skippedNoindex = 0;
  const articles = [];
  for (const item of items) {
    if (!item.slug || item.slug.length <= 3) continue;
    // P0-05: never list a URL that the page itself marks noindex — that is the
    // "incorrect pages found in sitemap.xml" error class.
    if (item.noindex === true) {
      skippedNoindex++;
      continue;
    }
    const loc = canonicalUrlFor(item);
    let host = '';
    try {
      host = new URL(loc).hostname;
    } catch {
      skippedCrossDomain++;
      continue;
    }
    if (!ALLOWED_HOSTS.has(host)) {
      skippedCrossDomain++;
      continue;
    }
    articles.push({
      slug: item.slug,
      title: item.metaTitle || item.title,
      loc,
      publishedAt: item.publishedAt || TODAY,
      lastModified: item.lastModified || item.publishedAt || TODAY,
      niche: item.contentType ?? 'tech',
      priority: priorityFor(item),
      featuredImageUrl: item.featuredImageUrl || '',
    });
  }
  if (skippedCrossDomain) {
    console.log(`↩︎  Skipped ${skippedCrossDomain} article(s) with cross-domain canonicals`);
  }

  const { guides, topics } = await fetchGuidesAndTopics();
  const allUrls = [...articles, ...guides, ...topics];

  console.log(`📄 Found ${allUrls.length} indexable URLs (${articles.length} articles)`);

  const publicDir = path.join(projectRoot, 'public');
  // Docker build order: vite build copies public/ → dist/ BEFORE this script
  // runs (Dockerfile: build:frontend && generate-seo-sitemaps.mjs). Writing
  // only to public/ therefore leaves the STALE committed sitemap.xml in dist/,
  // which is what nginx actually serves. Write to both so dist/ always gets
  // the freshly generated, deduped sitemaps.
  const distDir = path.join(projectRoot, 'dist');

  const news = generateNewsSitemap(articles);

  const files = {
    'sitemap.xml': generateMainSitemap(),
    'sitemap-articles.xml': generateArticlesSitemap(articles),
    'sitemap-news.xml': news.xml,
    'sitemap-index.xml': generateIndexSitemap(news.count > 0),
  };

  if (news.count === 0) {
    console.log(
      'ℹ︎  0 articles published in the last 48h — sitemap-news.xml is empty ' +
        '(valid) and is no longer advertised in sitemap-index.xml.'
    );
  }

  for (const [filename, content] of Object.entries(files)) {
    const outPath = path.join(publicDir, filename);
    fs.writeFileSync(outPath, content, 'utf-8');
    console.log(`[OK] ${filename} → ${outPath}`);
    // Overwrite the vite-copied stale copy in dist/ (if dist exists, i.e.
    // script runs after vite build — the Docker production path).
    if (fs.existsSync(path.join(distDir, 'index.html'))) {
      const distPath = path.join(distDir, filename);
      fs.writeFileSync(distPath, content, 'utf-8');
      console.log(`[OK] ${filename} → ${distPath}`);
    }
  }

  console.log(`\n✅ Sitemaps regenerated: ${articles.length} article URLs, ${news.count} news URLs.`);
}

main().catch((error) => {
  console.error('❌ generate-seo-sitemaps failed:', error);
  process.exit(0);
});
