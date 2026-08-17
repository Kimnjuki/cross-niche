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
 * Data source: Convex (preferred) or src/data/mockData.ts (fallback).
 *
 * Run: node scripts/generate-seo-sitemaps.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://thegridnexus.com';
const TODAY = new Date().toISOString().split('T')[0];

// ── Parse mockData.ts ────────────────────────────────────────────────────────
function parseMockArticles() {
  const mockDataPath = path.join(projectRoot, 'src', 'data', 'mockData.ts');
  const content = fs.readFileSync(mockDataPath, 'utf8');

  const blocks = content.split(/\n\s*\{\n/).slice(1);
  const articles = [];

  for (const block of blocks) {
    const idMatch = block.match(/id:\s*'([^']+)'/);
    const slugMatch = block.match(/slug:\s*'([^']+)'/);
    const titleMatch = block.match(/title:\s*'([^']+)'/);
    const publishedMatch = block.match(/publishedAt:\s*'([^']+)'/);
    const nicheMatch = block.match(/niche:\s*'([^']+)'/);

    if (!idMatch) continue;

    const article = {
      id: idMatch[1],
      slug: slugMatch ? slugMatch[1] : null,
      title: titleMatch ? titleMatch[1] : '',
      publishedAt: publishedMatch ? publishedMatch[1] : TODAY,
      niche: nicheMatch ? nicheMatch[1] : 'tech',
    };

    if (article.slug && article.slug.length > 3) {
      articles.push(article);
    }
  }

  return articles;
}

// ── Query Convex for published content ──────────────────────────────────────
async function fetchConvexContent() {
  const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) return null;

  try {
    const { ConvexHttpClient } = await import('convex/browser');
    const client = new ConvexHttpClient(convexUrl);

    const [contentRows, guides, topics] = await Promise.all([
      client.query('content:getAllPublishedContent', {}).catch(() => []),
      client.query('guides:list', {}).catch(() => []),
      client.query('topics:list', {}).catch(() => []),
    ]);

    const articles = (contentRows ?? [])
      .filter((c) => c.slug && c.slug.length > 3 && c.status === 'published' && c.isDeleted !== true)
      .map((c) => ({
        slug: c.slug,
        title: c.title,
        publishedAt: c.publishedAt ? new Date(c.publishedAt).toISOString().split('T')[0] : TODAY,
        niche: c.contentType ?? 'tech',
      }));

    const guideUrls = (guides ?? [])
      .filter((g) => g.slug && g.isPublished !== false)
      .map((g) => ({
        slug: g.slug,
        title: g.title,
        publishedAt: g.publishedAt ? new Date(g.publishedAt).toISOString().split('T')[0] : TODAY,
        niche: 'guides',
      }));

    const topicUrls = (topics ?? [])
      .filter((t) => t.slug)
      .map((t) => ({
        slug: t.slug,
        title: t.name,
        publishedAt: TODAY,
        niche: t.category ?? 'topics',
      }));

    return [...articles, ...guideUrls, ...topicUrls];
  } catch (error) {
    console.warn('Failed to fetch Convex content for sitemap:', error.message);
    return null;
  }
}

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

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
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

// ── Generate sitemap.xml (static pages + dynamic content) ───────────────────
function generateMainSitemap(articles) {
  const urls = [...getStaticPages()];
  const seen = new Set(urls.map((u) => u.loc));

  for (const article of articles) {
    const loc = article.niche === 'guides'
      ? `${BASE_URL}/guides/${article.slug}`
      : article.niche === 'topics'
        ? `${BASE_URL}/topics/${article.slug}`
        : `${BASE_URL}/article/${article.slug}`;

    if (!seen.has(loc)) {
      seen.add(loc);
      urls.push({ loc, lastmod: article.publishedAt || TODAY, changefreq: 'weekly', priority: 0.8 });
    }
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
    .filter((a) => a.niche !== 'guides' && a.niche !== 'topics')
    .map((a) => ({
      loc: `${BASE_URL}/article/${a.slug}`,
      lastmod: a.publishedAt || TODAY,
      changefreq: 'weekly',
      priority: 0.7,
    }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${articleUrls.map((u) => urlEntry(u.loc, u.lastmod, u.changefreq, u.priority)).join('\n')}
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
    const title = escapeXml(a.title || a.slug);
    return `  <url>
    <loc>${BASE_URL}/article/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>The Grid Nexus</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${a.publishedAt || TODAY}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
  }).join('\n');

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
  let articles = await fetchConvexContent();

  if (!articles) {
    console.log('Convex unavailable, falling back to mockData.ts');
    articles = parseMockArticles();
  }

  console.log(`📄 Found ${articles.length} indexable URLs`);

  const publicDir = path.join(projectRoot, 'public');

  const files = {
    'sitemap.xml': generateMainSitemap(articles),
    'sitemap-articles.xml': generateArticlesSitemap(articles),
    'sitemap-news.xml': generateNewsSitemap(articles),
    'sitemap-index.xml': generateIndexSitemap(),
  };

  for (const [filename, content] of Object.entries(files)) {
    const outPath = path.join(publicDir, filename);
    fs.writeFileSync(outPath, content, 'utf-8');
    console.log(`[OK] ${filename} → ${outPath}`);
  }

  console.log(`\n✅ Sitemaps regenerated with ${articles.length} valid URLs.`);
}

main();
