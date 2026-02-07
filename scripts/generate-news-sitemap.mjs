#!/usr/bin/env node
/**
 * Google News Sitemap Generator
 *
 * Generates sitemap-news.xml for Google News (articles from last 48 hours).
 * Set VITE_CONVEX_URL in env or .env so the script can reach your Convex deployment.
 *
 * Run with: npm run generate:news-sitemap
 */

try {
  await import('dotenv/config');
} catch {
  // dotenv optional
}

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://thegridnexus.com';
// Ensure consistent Convex URL
const CONVEX_URL = process.env.VITE_CONVEX_URL || 'https://intent-akita-728.convex.cloud';

// Validate URL matches expected deployment
if (!CONVEX_URL.includes('intent-akita-728')) {
  console.warn(`⚠️  Warning: VITE_CONVEX_URL (${CONVEX_URL}) does not match expected deployment (intent-akita-728)`);
}
const PUBLICATION_NAME = 'The Grid Nexus';
const PUBLICATION_LANGUAGE = 'en';

// Do NOT use mock articles - causes "Non-canonical page in sitemap" in Ahrefs.
// Only include real Convex articles to avoid 404s and canonical mismatches.

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
 * Format date as ISO 8601 for news sitemap
 */
function formatNewsDate(date) {
  if (!date) return new Date().toISOString();
  const d = new Date(typeof date === 'number' ? date : date);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

/**
 * Check if article is within last 48 hours (Google News requirement)
 */
function isWithin48Hours(publishedAt) {
  const now = new Date();
  const published = new Date(publishedAt);
  const hoursDiff = (now - published) / (1000 * 60 * 60);
  return hoursDiff <= 48;
}

/**
 * Generate news sitemap URL entry
 */
function generateNewsUrlEntry(article) {
  const keywords = Array.isArray(article.keywords) ? article.keywords.join(', ') : (article.tags?.join(', ') || '');
  
  return `  <url>
    <loc>${escapeXml(`${BASE_URL}/article/${article.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${PUBLICATION_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${formatNewsDate(article.publishedAt || article.published_at)}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>${keywords ? `
      <news:keywords>${escapeXml(keywords)}</news:keywords>` : ''}
    </news:news>
  </url>`;
}

/**
 * Generate complete news sitemap XML
 */
function generateNewsSitemapXml(articles) {
  const urlEntries = articles.map(generateNewsUrlEntry).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Main function
 */
async function main() {
  console.log('📰 Generating Google News sitemap...');
  console.log(`   Using Convex URL: ${CONVEX_URL}`);

  let newsArticles = [];

  try {
    // Connect to Convex
    const client = new ConvexHttpClient(CONVEX_URL);
    
    // Fetch visible articles (published + new); filter to last 48h below
    const articles = await client.query(api.content.listAll, { limit: 100 });
    console.log(`   Found ${articles?.length ?? 0} articles in Convex`);

    if (articles && articles.length > 0) {
      // Filter to only include articles from last 48 hours
      for (const article of articles) {
        const publishedAt = article.published_at ?? article.publishedAt ?? article._creationTime;
        const slug = article.slug ?? article.id ?? article._id;
        if (!slug || !publishedAt) continue;
        
        if (isWithin48Hours(publishedAt)) {
          newsArticles.push({
            slug: String(slug),
            title: article.title ?? 'Untitled',
            publishedAt,
            keywords: article.tags ?? [],
          });
        }
      }
      console.log(`   ${newsArticles.length} articles within last 48 hours`);
    }
  } catch (error) {
    console.warn(`   ⚠️ Could not fetch from Convex: ${error.message}`);
  }

  // Do NOT add mock articles - only real Convex content to avoid Ahrefs "Non-canonical page in sitemap"
  if (newsArticles.length === 0) {
    console.log('   No recent Convex articles. News sitemap will be empty (valid XML, no phantom URLs).');
  }

  // Generate XML
  const newsSitemapXml = generateNewsSitemapXml(newsArticles);

  // Write to public/sitemap-news.xml
  const outputPath = path.join(__dirname, '..', 'public', 'sitemap-news.xml');
  fs.writeFileSync(outputPath, newsSitemapXml, 'utf-8');

  console.log(`✅ News sitemap generated with ${newsArticles.length} articles`);
  console.log(`   Saved to: ${outputPath}`);
}

main().catch(console.error);
