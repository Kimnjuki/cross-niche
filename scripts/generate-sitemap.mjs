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
 * Format date as YYYY-MM-DD for sitemap
 */
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
 */
function getStaticPages() {
  const today = formatDate(new Date());
  return [
    { loc: `${BASE_URL}/`, lastmod: today, changefreq: 'daily', priority: 1.0 },
    { loc: `${BASE_URL}/tech`, lastmod: today, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/security`, lastmod: today, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/gaming`, lastmod: today, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/news`, lastmod: today, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/blog-series`, lastmod: today, changefreq: 'daily', priority: 0.8 },
    { loc: `${BASE_URL}/explore`, lastmod: today, changefreq: 'daily', priority: 0.85 },
    { loc: `${BASE_URL}/topics`, lastmod: today, changefreq: 'daily', priority: 0.9 },
    { loc: `${BASE_URL}/guides`, lastmod: today, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/tutorials`, lastmod: today, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/roadmap`, lastmod: today, changefreq: 'weekly', priority: 0.6 },
    { loc: `${BASE_URL}/ai-pulse`, lastmod: today, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/breach-sim`, lastmod: today, changefreq: 'monthly', priority: 0.6 },
    { loc: `${BASE_URL}/security-score`, lastmod: today, changefreq: 'weekly', priority: 0.7 },
    { loc: `${BASE_URL}/sitemap`, lastmod: today, changefreq: 'weekly', priority: 0.4 },
  ];
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
    // Connect to Convex
    const client = new ConvexHttpClient(CONVEX_URL);
    
    // Fetch all visible articles (published + new) for sitemap
    const articles = await client.query(api.content.listAll, {});
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
    console.log('   Adding mock articles as fallback...');
  }

  // Do NOT add mock articles when Convex fails - only include real content to avoid
  // "Non-canonical page in sitemap" and 404s. Static pages + real Convex articles only.
  const articleUrlCount = urls.filter(u => u.loc.includes('/article/')).length;
  if (articleUrlCount === 0) {
    console.log('   No Convex articles found. Sitemap will contain static pages only (no phantom article URLs).');
  }

  // Generate XML
  const sitemapXml = generateSitemapXml(urls);

  // Write to public/sitemap.xml
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml, 'utf-8');

  console.log(`✅ Sitemap generated with ${urls.length} URLs`);
  console.log(`   Saved to: ${outputPath}`);

  // Also output URL count breakdown
  const articleUrls = urls.filter(u => u.loc.includes('/article/'));
  const staticUrls = urls.filter(u => !u.loc.includes('/article/'));
  console.log(`   - Static pages: ${staticUrls.length}`);
  console.log(`   - Article pages: ${articleUrls.length}`);
}

main().catch(console.error);
