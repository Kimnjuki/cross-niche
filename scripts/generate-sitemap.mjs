#!/usr/bin/env node
/**
 * Sitemap Generator Script
 *
 * Generates sitemap.xml from Convex database content.
 * Run with: npm run generate:sitemap
 * Set VITE_CONVEX_URL in env or .env so the script can reach your Convex deployment.
 *
 * This script:
 * 1. Fetches all visible articles (status published|new) via api.content.listAll
 * 2. Generates canonical URLs using article.slug (not id)
 * 3. Creates XML sitemap with proper lastmod, changefreq, priority
 * 4. Writes to public/sitemap.xml
 */

try {
  await import('dotenv/config');
} catch {
  // dotenv optional; rely on process.env.VITE_CONVEX_URL from shell/build
}

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Canonical site URL for sitemap (env override allowed; typo normalized for SEO)
let BASE_URL = process.env.SITE_URL || process.env.BASE_URL || process.env.VITE_APP_URL || 'https://thegridnexus.com';
BASE_URL = BASE_URL.replace(/https?:\/\/theegridnexus\.com\/?/i, 'https://thegridnexus.com/').replace(/\/$/, '') || 'https://thegridnexus.com';
if (BASE_URL.includes('theegridnexus')) {
  BASE_URL = 'https://thegridnexus.com';
  console.warn('   ⚠️ Corrected site URL typo: theegridnexus → thegridnexus');
}
// Ensure consistent Convex URL
const CONVEX_URL = process.env.VITE_CONVEX_URL || 'https://intent-akita-728.convex.cloud';

// Validate URL matches expected deployment
if (!CONVEX_URL.includes('intent-akita-728')) {
  console.warn(`⚠️  Warning: VITE_CONVEX_URL (${CONVEX_URL}) does not match expected deployment (intent-akita-728)`);
}

/**
 * Extract article URLs from an existing sitemap XML file.
 */
function extractUrlsFromXml(xml) {
  const urls = [];
  const re = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = re.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

/**
 * Fallback: pull article URLs from sitemap-news.xml when Convex is unavailable.
 */
function getArticleUrlsFromNewsSitemap(publicDir) {
  const newsPath = path.join(publicDir, 'sitemap-news.xml');
  if (!fs.existsSync(newsPath)) return [];
  const xml = fs.readFileSync(newsPath, 'utf8');
  return extractUrlsFromXml(xml).filter((u) => u.includes('/article/'));
}
function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0];
  const d = new Date(typeof date === 'number' ? date : date);
  return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
}

/**
 * Escape XML special characters
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Get static pages for sitemap.
 * Only include routes that exist in App.tsx to avoid 404s and "non-canonical page in sitemap" (Ahrefs).
 * Never include paths that are active redirect sources (see data/redirect_map.json).
 */
function loadRedirectSources() {
  try {
    const mapPath = path.join(__dirname, '..', 'data', 'redirect_map.json');
    if (!fs.existsSync(mapPath)) return new Set();
    const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    return new Set(
      (Array.isArray(map) ? map : []).map((r) => {
        const from = String(r.from || '');
        return from.startsWith('http') ? new URL(from).pathname.replace(/\/$/, '') || '/' : from.replace(/\/$/, '') || '/';
      })
    );
  } catch {
    return new Set();
  }
}

const REDIRECT_SOURCES = loadRedirectSources();

/** Extra alias paths that must never appear in the sitemap (nginx 301 sources). */
const SITEMAP_EXCLUDED_PATHS = new Set([
  ...REDIRECT_SOURCES,
  '/blog-series',
  '/articles',
  '/live',
  '/ai',
  '/security-tools',
  '/billing',
  '/settings',
  '/cybersecurity',
  '/cyber',
  '/gamming',
  '/feed',
  '/rss',
  '/atom',
  '/simple',
  '/enhanced',
  '/enhanced-simple',
  '/test-features',
  '/original-index',
]);

function getStaticPages() {
  const today = formatDate(new Date());
  const pages = [
    ['/', 1.0, 'daily'],
    ['/tech', 0.9, 'daily'],
    ['/security', 0.9, 'daily'],
    ['/gaming', 0.9, 'daily'],
    ['/news', 0.9, 'daily'],
    ['/blog', 0.8, 'daily'],
    ['/explore', 0.85, 'daily'],
    ['/topics', 0.9, 'daily'],
    ['/guides', 0.7, 'weekly'],
    ['/tutorials', 0.7, 'weekly'],
    ['/reviews', 0.7, 'weekly'],
    ['/startups', 0.7, 'weekly'],
    ['/roadmap', 0.6, 'weekly'],
    ['/ai-pulse', 0.7, 'weekly'],
    ['/breach-sim', 0.6, 'monthly'],
    ['/security-score', 0.7, 'weekly'],
    ['/live-threat-dashboard', 0.7, 'daily'],
    ['/tools', 0.9, 'daily'],
    ['/tools/security-scanner', 0.6, 'weekly'],
    ['/tools/nexusguard', 0.7, 'weekly'],
    ['/tools/steam-scanner', 0.7, 'weekly'],
    ['/tools/ioc-lookup', 0.7, 'daily'],
    ['/tools/gaming-security-checkup', 0.7, 'weekly'],
    ['/tools/breach-explainer', 0.7, 'weekly'],
    ['/tools/ai-tool-finder', 0.6, 'weekly'],
    ['/tools/patch-risk-tracker', 0.7, 'daily'],
    ['/tools/zero-trust-quiz', 0.6, 'monthly'],
    ['/tools/exploit-risk-meter', 0.7, 'daily'],
    ['/tools/pc-builder', 0.7, 'weekly'],
    ['/tools/threat-scanner', 0.8, 'daily'],
    ['/tools/gaming-copilot', 0.8, 'daily'],
    ['/nexus-intersection', 0.6, 'weekly'],
    ['/security-profile', 0.7, 'weekly'],
    ['/community-threats', 0.7, 'weekly'],
    ['/forums', 0.6, 'weekly'],
    ['/media', 0.5, 'monthly'],
    ['/about', 0.5, 'monthly'],
    ['/contact', 0.4, 'monthly'],
    ['/editorial', 0.4, 'monthly'],
    ['/disclosure', 0.4, 'monthly'],
    ['/privacy', 0.4, 'monthly'],
    ['/terms', 0.4, 'monthly'],
    ['/quality-guidelines', 0.4, 'monthly'],
    ['/content-policy', 0.4, 'monthly'],
    ['/sitemap', 0.4, 'weekly'],
  ];
  return pages
    .filter(([path]) => !SITEMAP_EXCLUDED_PATHS.has(path))
    .map(([path, priority, changefreq]) => ({
      loc: `${BASE_URL}${path}`,
      lastmod: today,
      changefreq,
      priority,
    }));
}

/**
 * Generate XML for a single URL entry
 */
function generateUrlEntry(url) {
  return `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
}

/**
 * Generate complete sitemap XML
 */
function generateSitemapXml(urls) {
  const urlEntries = urls.map(generateUrlEntry).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urlEntries}
</urlset>`;
}

/**
 * Main function
 */
async function main() {
  console.log('🗺️  Generating sitemap from Convex...');
  console.log(`   Using Convex URL: ${CONVEX_URL}`);

  const urls = [...getStaticPages()];
  const seenUrls = new Set(urls.map(u => u.loc));

  try {
    const client = new ConvexHttpClient(CONVEX_URL);
    let articles = null;
    try {
      articles = await client.query(api.content.listAll, {});
    } catch {
      articles = await client.query(api.content.getAllPublishedContent, {});
    }
    console.log(`   Found ${articles?.length ?? 0} published/new articles in Convex`);

    if (articles && articles.length > 0) {
      for (const article of articles) {
        // Use slug as the canonical URL (content table has slug, title, published_at/_creationTime)
        const slug = article.slug ?? article.id ?? article._id;
        if (!slug) {
          console.warn(`   ⚠️ Skipping article without slug: ${article.title}`);
          continue;
        }

        let canonicalUrl = `${BASE_URL}/article/${slug}`;
        canonicalUrl = canonicalUrl.replace(/theegridnexus\.com/gi, 'thegridnexus.com');

        // Prefer stored canonicalUrl when it points at this site
        if (typeof article.canonicalUrl === 'string' && article.canonicalUrl.includes('thegridnexus.com')) {
          canonicalUrl = article.canonicalUrl.replace(/\/$/, '');
        }

        // Never put redirect-source paths in the sitemap
        try {
          const pathOnly = new URL(canonicalUrl).pathname.replace(/\/$/, '') || '/';
          if (SITEMAP_EXCLUDED_PATHS.has(pathOnly)) {
            console.warn(`   ⚠️ Skipping redirect-source URL: ${canonicalUrl}`);
            continue;
          }
        } catch {
          /* keep generated URL */
        }
        
        // Skip if already in sitemap (avoid duplicates)
        if (seenUrls.has(canonicalUrl)) {
          console.warn(`   ⚠️ Skipping duplicate URL: ${canonicalUrl}`);
          continue;
        }
        seenUrls.add(canonicalUrl);

        // Determine lastmod from published_at or created_at
        const lastmod = formatDate(
          article.published_at || article.publishedAt || article.created_at || article._creationTime
        );

        // Calculate priority based on article properties
        let priority = 0.7;
        if (article.is_featured || article.isFeatured) priority = 0.9;
        if (article.is_breaking || article.isBreaking) priority = 0.85;

        urls.push({
          loc: canonicalUrl,
          lastmod,
          changefreq: 'weekly',
          priority
        });
      }
    }
  } catch (error) {
    console.warn(`   ⚠️ Could not fetch from Convex: ${error.message}`);
    console.log('   Trying fallback from sitemap-news.xml...');
    const publicDir = path.join(__dirname, '..', 'public');
    const fallbackUrls = getArticleUrlsFromNewsSitemap(publicDir);
    const today = formatDate(new Date());
    for (const loc of fallbackUrls) {
      if (seenUrls.has(loc)) continue;
      seenUrls.add(loc);
      urls.push({ loc, lastmod: today, changefreq: 'weekly', priority: 0.7 });
    }
    if (fallbackUrls.length > 0) {
      console.log(`   Added ${fallbackUrls.length} article URLs from sitemap-news.xml`);
    }
  }

  // Do NOT add mock articles when Convex fails - only include real content to avoid
  // "Non-canonical page in sitemap" and 404s. Static pages + real Convex articles only.
  const articleUrlCount = urls.filter(u => u.loc.includes('/article/')).length;
  if (articleUrlCount === 0) {
    console.log('   No article URLs found. Sitemap will contain static pages only.');
  }

  // Preserve richer existing sitemap if Convex/fallback produced fewer URLs
  const publicDir = path.join(__dirname, '..', 'public');
  const existingMain = path.join(publicDir, 'sitemap.xml');
  if (fs.existsSync(existingMain)) {
    const existingXml = fs.readFileSync(existingMain, 'utf8');
    const existingCount = (existingXml.match(/<loc>/g) || []).length;
    if (existingCount > urls.length && articleUrlCount === 0) {
      console.log(`   Preserving existing sitemap.xml (${existingCount} URLs > ${urls.length} generated)`);
      const today = formatDate(new Date());
      const indexPath = path.join(publicDir, 'sitemap-index.xml');
      if (fs.existsSync(indexPath)) {
        const indexXml = fs.readFileSync(indexPath, 'utf8').replace(
          /<lastmod>[^<]+<\/lastmod>/g,
          `<lastmod>${today}</lastmod>`
        );
        fs.writeFileSync(indexPath, indexXml, 'utf-8');
        console.log(`[OK] sitemap-index.xml lastmod updated (${today})`);
      }
      return;
    }
  }

  // Generate and write sitemap files
  const sitemapXml = generateSitemapXml(urls);
  const today = formatDate(new Date());

  const mainSitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(mainSitemapPath, sitemapXml, 'utf-8');
  console.log(`[OK] sitemap.xml generated with ${urls.length} URLs`);

  const articleUrls = urls.filter(u => u.loc.includes('/article/'));
  const staticUrls = urls.filter(u => !u.loc.includes('/article/'));

  const articlesXml = generateSitemapXml(articleUrls);
  const articlesPath = path.join(publicDir, 'sitemap-articles.xml');
  fs.writeFileSync(articlesPath, articlesXml, 'utf-8');
  console.log(`[OK] sitemap-articles.xml generated with ${articleUrls.length} URLs`);

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${BASE_URL}/sitemap-articles.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${BASE_URL}/sitemap-news.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

</sitemapindex>
`;
  const indexPath = path.join(publicDir, 'sitemap-index.xml');
  fs.writeFileSync(indexPath, indexXml, 'utf-8');
  console.log(`[OK] sitemap-index.xml updated (lastmod: ${today})`);

  console.log(`   - Static pages: ${staticUrls.length}`);
  console.log(`   - Article pages: ${articleUrls.length}`);
}

main().catch(console.error);
