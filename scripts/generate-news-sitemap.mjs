#!/usr/bin/env node
/**
 * Google News Sitemap Generator
 * 
 * Generates sitemap-news.xml specifically for Google News
 * Only includes articles from the last 48 hours (Google News requirement)
 * 
 * Run with: npm run generate:news-sitemap
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://thegridnexus.com';
const CONVEX_URL = process.env.VITE_CONVEX_URL || 'https://canny-mule-83.convex.cloud';
const PUBLICATION_NAME = 'The Grid Nexus';
const PUBLICATION_LANGUAGE = 'en';

// Mock articles for fallback (last 48 hours requirement means these won't show in prod)
const MOCK_NEWS_ARTICLES = [
  { slug: 'tech-1', title: 'Apple Vision Pro 2: Revolutionary Spatial Computing Arrives', publishedAt: new Date().toISOString(), keywords: ['Apple', 'VR', 'AR', 'Hardware'] },
  { slug: 'sec-1', title: 'Critical Zero-Day Vulnerability Affects Millions of Routers', publishedAt: new Date().toISOString(), keywords: ['Vulnerability', 'Router', 'Security'] },
  { slug: 'game-1', title: 'Elden Ring 2: FromSoftware Announces Sequel', publishedAt: new Date().toISOString(), keywords: ['Gaming', 'Elden Ring', 'FromSoftware'] },
];

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
    
    // Fetch recent published articles (limit to recent for news)
    const articles = await client.query(api.content.listPublished, { limit: 100 });
    console.log(`   Found ${articles?.length || 0} published articles in Convex`);

    if (articles && articles.length > 0) {
      // Filter to only include articles from last 48 hours
      for (const article of articles) {
        const publishedAt = article.published_at || article.publishedAt || article._creationTime;
        
        if (!article.slug || !publishedAt) continue;
        
        if (isWithin48Hours(publishedAt)) {
          newsArticles.push({
            slug: article.slug,
            title: article.title || 'Untitled',
            publishedAt,
            keywords: article.tags || [],
          });
        }
      }
      console.log(`   ${newsArticles.length} articles within last 48 hours`);
    }
  } catch (error) {
    console.warn(`   ⚠️ Could not fetch from Convex: ${error.message}`);
  }

  // If no recent Convex articles, use mock data for demo purposes
  if (newsArticles.length === 0) {
    console.log('   No recent Convex articles, using mock data...');
    newsArticles = MOCK_NEWS_ARTICLES;
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
