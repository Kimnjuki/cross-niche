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

// ── Static pages (only routes that exist in App.tsx and are indexable) ──────
function getStaticPages() {
  return [
    { loc: `${BASE_URL}/`, lastmod: TODAY, changefreq: 'daily', priority: 1.0 },
    { loc: `${BASE_URL}/tech`, lastmod: TODAY, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/security`, lastmod: TODAY, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/gaming`, lastmod: TODAY, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/news`, lastmod: TODAY, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/blog`, lastmod: TODAY, changefreq: 'daily', priority: 0.8 },
    { loc: `${BASE_URL}/topics`, lastmod: TODAY, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/guides`, lastmod: TODAY, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/tutorials`, lastmod: TODAY, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/reviews`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/startups`, lastmod: TODAY, changefreq: 'daily', priority: 0.7 },
    { loc: `${BASE_URL}/tools`, lastmod: TODAY, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/explore`, lastmod: TODAY, changefreq: 'daily', priority: 0.85 },
    { loc: `${BASE_URL}/ai-pulse`, lastmod: TODAY, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/live-updates`, lastmod: TODAY, changefreq: 'daily', priority: 0.8 },
    { loc: `${BASE_URL}/roadmap`, lastmod: TODAY, changefreq: 'weekly', priority: 0.6 },
    { loc: `${BASE_URL}/security-profile`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/community-threats`, lastmod: TODAY, changefreq: 'daily', priority: 0.8 },
    { loc: `${BASE_URL}/nexus-intersection`, lastmod: TODAY, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/about`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${BASE_URL}/contact`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${BASE_URL}/privacy`, lastmod: TODAY, changefreq: 'monthly', priority: 0.3 },
    { loc: `${BASE_URL}/terms`, lastmod: TODAY, changefreq: 'monthly', priority: 0.3 },
    { loc: `${BASE_URL}/editorial`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${BASE_URL}/disclosure`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${BASE_URL}/media`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${BASE_URL}/quality-guidelines`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${BASE_URL}/content-policy`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${BASE_URL}/community-guidelines`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${BASE_URL}/sitemap`, lastmod: TODAY, changefreq: 'monthly', priority: 0.2 },
    { loc: `${BASE_URL}/security-score`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${BASE_URL}/breach-sim`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${BASE_URL}/live-threat-dashboard`, lastmod: TODAY, changefreq: 'daily', priority: 0.8 },
    { loc: `${BASE_URL}/forums`, lastmod: TODAY, changefreq: 'weekly', priority: 0.6 },
    { loc: `${BASE_URL}/api`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${BASE_URL}/mobile`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${BASE_URL}/podcasts`, lastmod: TODAY, changefreq: 'weekly', priority: 0.6 },
    { loc: `${BASE_URL}/learn/nexus-path`, lastmod: TODAY, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/pulse/nexus-pulse`, lastmod: TODAY, changefreq: 'daily', priority: 0.8 },
    { loc: `${BASE_URL}/nexus-studio`, lastmod: TODAY, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/gaming/security-guides`, lastmod: TODAY, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/seo-checklist`, lastmod: TODAY, changefreq: 'monthly', priority: 0.4 },
    { loc: `${BASE_URL}/videos`, lastmod: TODAY, changefreq: 'weekly', priority: 0.6 },
    { loc: `${BASE_URL}/notifications`, lastmod: TODAY, changefreq: 'weekly', priority: 0.5 },
    { loc: `${BASE_URL}/settings`, lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: `${BASE_URL}/pillar/zero-trust-architecture`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/pillar/gaming-security`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/pillar/ai-threat-intelligence`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/research/state-of-gaming-security-2026`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${BASE_URL}/comparisons`, lastmod: TODAY, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/keyword-gap-analysis`, lastmod: TODAY, changefreq: 'monthly', priority: 0.6 },
    // Author pages (read from authorData.ts via scripts/lib/author-source.mjs)
    ...Object.entries(authorProfiles).map(([slug]) => ({
      loc: `${BASE_URL}/author/${slug}`,
      lastmod: TODAY,
      changefreq: 'monthly',
      priority: 0.6,
    })),
    // Tool pages
    { loc: `${BASE_URL}/tools/security-scanner`, lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: `${BASE_URL}/tools/nexusguard`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/tools/security-briefing`, lastmod: TODAY, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/tools/vr-cyber-training`, lastmod: TODAY, changefreq: 'weekly', priority: 0.6 },
    { loc: `${BASE_URL}/tools/steam-scanner`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/tools/ioc-lookup`, lastmod: TODAY, changefreq: 'daily', priority: 0.8 },
    { loc: `${BASE_URL}/tools/gaming-security-checkup`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/tools/breach-explainer`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/tools/ai-tool-finder`, lastmod: TODAY, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/tools/patch-risk-tracker`, lastmod: TODAY, changefreq: 'daily', priority: 0.8 },
    { loc: `${BASE_URL}/tools/zero-trust-quiz`, lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
    { loc: `${BASE_URL}/tools/exploit-risk-meter`, lastmod: TODAY, changefreq: 'daily', priority: 0.8 },
    { loc: `${BASE_URL}/tools/pc-builder`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/tools/sentiment-analyzer`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/tools/news-personalizer`, lastmod: TODAY, changefreq: 'daily', priority: 0.7 },
    { loc: `${BASE_URL}/tools/recommendation-engine`, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: `${BASE_URL}/tools/threat-scanner`, lastmod: TODAY, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/tools/community-moderator`, lastmod: TODAY, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/tools/gaming-copilot`, lastmod: TODAY, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/tools/release-predictor`, lastmod: TODAY, changefreq: 'daily', priority: 0.8 },
  ];
}

// ── Generate sitemap.xml (STATIC pages + guides/topics only) ──────────────
// P1-5 fix: article URLs must NOT appear here (they live in
// sitemap-articles.xml). Listing articles in both sitemaps caused
// "pages listed in multiple sitemaps" (38 URLs in the audit).
function generateMainSitemap(articles) {
  const urls = [...getStaticPages()];
  const seen = new Set(urls.map((u) => u.loc));

  for (const article of articles) {
    if (isPlaceholderTitle(article.title)) continue;
    // Guides and topics are NOT articles — keep them in the main sitemap.
    // Everything with a real /article/<slug> goes to sitemap-articles.xml only.
    if (article.niche === 'guides') {
      const loc = `${BASE_URL}/guides/${article.slug}`;
      if (!seen.has(loc)) {
        seen.add(loc);
        urls.push({ loc, lastmod: article.publishedAt || TODAY, changefreq: 'weekly', priority: 0.8 });
      }
    } else if (article.niche === 'topics') {
      const loc = `${BASE_URL}/topics/${article.slug}`;
      if (!seen.has(loc)) {
        seen.add(loc);
        urls.push({ loc, lastmod: TODAY, changefreq: 'weekly', priority: 0.8 });
      }
    }
    // else: article URLs are intentionally NOT added to sitemap.xml
  }

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

// ── Generate sitemap-news.xml (recent articles, max 1000) ──────────────────
function generateNewsSitemap(articles) {
  const articleEntries = articles
    .filter((a) => a.niche !== 'guides' && a.niche !== 'topics')
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
    .slice(0, 1000);

  const entries = articleEntries.map((a) => {
    if (isPlaceholderTitle(a.title)) return null;
    const title = escapeXml(a.title || a.slug);
    // Use the same canonical-consistent loc as sitemap-articles.xml.
    const loc = a.loc || `${BASE_URL}/article/${a.slug}`;
    return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>The Grid Nexus</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${a.publishedAt || TODAY}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
  }).filter(Boolean).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/news/sitemap/2.0">
${entries}
</urlset>`;
  return xml;
}

// ── Generate sitemap-index.xml ──────────────────────────────────────────────
function generateIndexSitemap() {
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
  <sitemap>
    <loc>${BASE_URL}/sitemap-news.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>`;
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

  const files = {
    'sitemap.xml': generateMainSitemap(allUrls),
    'sitemap-articles.xml': generateArticlesSitemap(articles),
    'sitemap-news.xml': generateNewsSitemap(articles),
    'sitemap-index.xml': generateIndexSitemap(),
  };

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

  console.log(`\n✅ Sitemaps regenerated with ${allUrls.length} valid URLs.`);
}

main();
