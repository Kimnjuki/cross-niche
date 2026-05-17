/**
 * Generate clean sitemap and article sitemap from mockData.ts slugs.
 * 
 * Fixes: 
 * - No duplicate URLs for the same article
 * - Only /article/slug routes (not mixed /tech/slug etc)
 * - Canonical URLs match actual routes
 * - All tool pages included
 * - All 38 current article slugs included
 * 
 * Run: node scripts/generate-sitemap-vite.mjs (part of build)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const siteUrl = 'https://thegridnexus.com';
const today = new Date().toISOString().split('T')[0];

// ── Extract slugs from mockData.ts ──────────────────────────────────────
function extractArticleSlugs() {
  const mockDataPath = path.join(projectRoot, 'src', 'data', 'mockData.ts');
  if (!fs.existsSync(mockDataPath)) return [];

  const content = fs.readFileSync(mockDataPath, 'utf8');
  const slugs = new Set();

  // Match slug: 'xxx' in mock data objects
  const regex = /slug:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    slugs.add(match[1]);
  }

  return Array.from(slugs);
}

// ── Static pages (all valid routes from App.tsx) ─────────────────────────
const staticPages = [
  // Hubs
  '/', '/tech', '/security', '/gaming', '/news',
  '/blog', '/explore', '/topics', '/guides', '/tutorials',
  
  // App pages
  '/reviews', '/startups', '/security-profile', '/community-threats',
  '/ai-pulse', '/nexus-intersection',
  '/media', '/about', '/contact', '/editorial', '/disclosure',
  '/privacy', '/terms', '/quality-guidelines', '/content-policy',
  '/sitemap', '/roadmap', '/roadmap',

  // Security tool pages
  '/breach-sim', '/security-score',
  '/live-threat-dashboard',
  
  // Tool routes
  '/tools', '/tools/sitemap',
  '/tools/security-scanner', '/tools/nexusguard',
  '/tools/security-briefing', '/tools/vr-cyber-training',
  '/tools/steam-scanner', '/tools/ioc-lookup',
  '/tools/gaming-security-checkup', '/tools/breach-explainer',
  '/tools/ai-tool-finder', '/tools/patch-risk-tracker',
  '/tools/zero-trust-quiz', '/tools/exploit-risk-meter',
  '/tools/pc-builder', '/tools/sentiment-analyzer',
  '/tools/news-personalizer', '/tools/recommendation-engine',
  '/tools/threat-scanner', '/tools/community-moderator',
  '/tools/gaming-copilot', '/tools/release-predictor',
];

// ── Prioritize security tools higher than static info pages ─────────────
const highPriorityPages = new Set([
  '/', '/security', '/gaming', '/breach-sim', '/security-score',
  '/tools/gaming-security-checkup', '/tools/steam-scanner',
  '/tools/security-scanner', '/live-threat-dashboard',
]);

function getPriority(path) {
  if (highPriorityPages.has(path)) return '1.0';
  if (path === '/' || path.startsWith('/tools/')) return '0.9';
  if (path.startsWith('/article/')) return '0.8';
  return '0.7';
}

function getChangeFreq(path) {
  if (path === '/') return 'daily';
  if (path.startsWith('/article/')) return 'weekly';
  if (path.startsWith('/tools/')) return 'monthly';
  return 'weekly';
}

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function generateUrlXml(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

// ── Generate sitemap.xml (static pages + tool pages) ────────────────────
function generateSitemap() {
  const urls = staticPages.map(route => {
    const fullUrl = `${siteUrl}${route}`;
    return generateUrlXml(fullUrl, today, getChangeFreq(route), getPriority(route));
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;

  const outputPath = path.join(projectRoot, 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`[sitemap] Written ${staticPages.length} URLs → public/sitemap.xml`);
}

// ── Generate sitemap-articles.xml (only /article/slug, no duplicates) ───
function generateArticleSitemap() {
  const slugs = extractArticleSlugs();
  
  if (slugs.length === 0) {
    console.warn('[sitemap] No article slugs found — skipping article sitemap');
    return;
  }

  const urls = slugs.map(slug => {
    const fullUrl = `${siteUrl}/article/${slug}`;
    return generateUrlXml(fullUrl, today, 'weekly', '0.8');
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>`;

  const outputPath = path.join(projectRoot, 'public', 'sitemap-articles.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`[sitemap] Written ${slugs.length} article URLs → public/sitemap-articles.xml`);
}

// ── Generate sitemap-index.xml ──────────────────────────────────────────
function generateSitemapIndex() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>${siteUrl}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${siteUrl}/sitemap-articles.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${siteUrl}/sitemap-news.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

</sitemapindex>`;

  const outputPath = path.join(projectRoot, 'public', 'sitemap-index.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`[sitemap] Written sitemap index → public/sitemap-index.xml`);
}

// ── Generate sitemap-news.xml ───────────────────────────────────────────
function generateNewsSitemap() {
  const slugs = extractArticleSlugs();
  if (slugs.length === 0) return;

  // Pick the most relevant gaming-security articles for Google News
  const newsSlugs = [
    'gmail-hack-attacks-surge-gamers-2fa-2026',
    'steam-account-takeover-protection-guide-2026',
    'discord-malware-gamers-how-to-stay-safe',
    'chrome-zero-day-warning-gamers-april-2026',
    'nintendo-switch-2-security-guide',
    'sim-swapping-gaming-accounts-protection',
    'fake-game-cheats-malware-account-stealer',
    'twitch-streamer-security-guide-doxxing-swatting',
    'roblox-parents-guide-account-security-safety',
    'twitch-accounts-hacked-breach-guide-2026',
  ].filter(s => slugs.includes(s));

  if (newsSlugs.length === 0) {
    // Fallback: use first 10
    newsSlugs.push(...slugs.slice(0, 10));
  }

  // Get publication date from mockData.ts if possible, else use today
  const mockDataPath = path.join(projectRoot, 'src', 'data', 'mockData.ts');
  const content = fs.readFileSync(mockDataPath, 'utf8');

  // Build a lookup: slug -> publishedAt date
  const dateRegex = /slug:\s*'([^']+)'[^}]*?publishedAt:\s*'([^']+)'/gs;
  const dateMap = {};
  let m;
  while ((m = dateRegex.exec(content)) !== null) {
    dateMap[m[1]] = m[2];
  }

  const urls = newsSlugs.map(slug => {
    const pubDate = dateMap[slug] || today;
    return `  <url>
    <loc>${siteUrl}/article/${slug}</loc>
    <news:news>
      <news:publication>
        <news:name>The Grid Nexus</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</news:title>
    </news:news>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls.join('\n')}
</urlset>`;

  const outputPath = path.join(projectRoot, 'public', 'sitemap-news.xml');
  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log(`[sitemap] Written ${newsSlugs.length} news URLs → public/sitemap-news.xml`);
}

// ── Main ────────────────────────────────────────────────────────────────
generateSitemap();
generateArticleSitemap();
generateNewsSitemap();
generateSitemapIndex();
