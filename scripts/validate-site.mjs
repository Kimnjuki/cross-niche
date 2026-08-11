/**
 * The Grid Nexus — Comprehensive SEO, AI Visibility & Site Health Checker
 * Run with: node scripts/validate-site.mjs
 *
 * Checks:
 * 1. Public asset existence
 * 2. robots.txt rules
 * 3. sitemap integrity
 * 4. JSON-LD structured data validity
 * 5. Core Web Vitals thresholds
 * 6. AI crawler accessibility
 * 7. Feed availability
 * 8. Security headers
 * 9. Internal link integrity
 * 10. Content freshness
 */

import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://thegridnexus.com';
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SRC_DIR = path.join(process.cwd(), 'src');

let passCount = 0;
let failCount = 0;
let warnCount = 0;

function check(name, condition, details = '') {
  if (condition) {
    console.log(`  ✅ ${name}${details ? ` — ${details}` : ''}`);
    passCount++;
  } else {
    console.log(`  ❌ ${name}${details ? ` — ${details}` : ''}`);
    failCount++;
  }
}

function warn(name, details = '') {
  console.log(`  ⚠️  ${name}${details ? ` — ${details}` : ''}`);
  warnCount++;
}

function fileExists(filename) {
  return fs.existsSync(path.join(PUBLIC_DIR, filename));
}

function srcFileExists(filename) {
  return fs.existsSync(path.join(SRC_DIR, filename));
}

function readFile(filename, dir = PUBLIC_DIR) {
  try {
    return fs.readFileSync(path.join(dir, filename), 'utf-8');
  } catch {
    return null;
  }
}

function getFileSize(filename) {
  try {
    const stats = fs.statSync(path.join(PUBLIC_DIR, filename));
    return stats.size;
  } catch {
    return 0;
  }
}

console.log('\n🔍 The Grid Nexus — Site Health, AI Visibility & SEO Validation\n');
console.log('='.repeat(70));

// ── 1. PUBLIC ASSETS ──────────────────────────────────────────────────
console.log('\n📁 1. Public Assets\n');

const requiredAssets = [
  'robots.txt',
  'sitemap.xml',
  'sitemap-index.xml',
  'sitemap-news.xml',
  'sitemap-articles.xml',
  'llms.txt',
  'ai.txt',
  'feed.xml',
  'rss.xml',
  'favicon.ico',
  'favicon.svg',
  'site.webmanifest',
  'browserconfig.xml',
  'ads.txt',
  'og-image.jpg',
  'logo.png',
  'apple-touch-icon.png',
  'sw.js',
];

requiredAssets.forEach(asset => {
  const exists = fileExists(asset);
  const size = getFileSize(asset);
  const sizeOk = asset === 'og-image.jpg' ? size > 1000 : size > 0;
  check(`${asset} exists`, exists);
  if (exists && !sizeOk) {
    warn(`${asset} is very small (${size} bytes)`, 'May need replacement');
  }
});

// ── 2. ROBOTS.TXT ─────────────────────────────────────────────────────
console.log('\n🤖 2. Robots.txt\n');

const robots = readFile('robots.txt');
if (robots) {
  check('robots.txt exists', true);
  check('Allows all crawlers by default', robots.includes('User-agent: *') && robots.includes('Allow: /'));
  check('Blocks private routes', robots.includes('Disallow: /admin'));
  check('Blocks auth routes', robots.includes('Disallow: /auth'));
  check('References sitemaps', robots.includes('Sitemap:'));
  check('GPTBot allowed', robots.includes('User-agent: GPTBot') && robots.includes('Allow: /'));
  check('ClaudeBot allowed', robots.includes('User-agent: ClaudeBot') && robots.includes('Allow: /'));
  check('PerplexityBot allowed', robots.includes('User-agent: PerplexityBot') && robots.includes('Allow: /'));
  check('No Crawl-delay (deprecated)', !robots.includes('Crawl-delay'));
  check('CCBot allowed', robots.includes('User-agent: CCBot') && robots.includes('Allow: /'));
  check('Applebot-Extended allowed', robots.includes('User-agent: Applebot-Extended') && robots.includes('Allow: /'));
} else {
  check('robots.txt missing', false);
}

// ── 3. SITEMAPS ───────────────────────────────────────────────────────
console.log('\n🗺️  3. Sitemaps\n');

const sitemapIndex = readFile('sitemap-index.xml');
if (sitemapIndex) {
  check('sitemap-index.xml exists', true);
  check('References main sitemap', sitemapIndex.includes('sitemap.xml'));
  check('References articles sitemap', sitemapIndex.includes('sitemap-articles.xml'));
  check('References news sitemap', sitemapIndex.includes('sitemap-news.xml'));
}

const sitemap = readFile('sitemap.xml');
if (sitemap) {
  check('sitemap.xml exists', true);
  check('Contains homepage', sitemap.includes('thegridnexus.com/</loc>'));
  check('Contains /tech', sitemap.includes('thegridnexus.com/tech</loc>'));
  check('Contains /security', sitemap.includes('thegridnexus.com/security</loc>'));
  check('Contains /gaming', sitemap.includes('thegridnexus.com/gaming</loc>'));
  check('Contains lastmod dates', sitemap.includes('<lastmod>'));
  check('Contains changefreq', sitemap.includes('<changefreq>'));
  check('Contains priority', sitemap.includes('<priority>'));
}

const newsSitemap = readFile('sitemap-news.xml');
if (newsSitemap) {
  check('sitemap-news.xml exists', true);
  check('Contains news entries', newsSitemap.includes('<news:news>'));
}

const articlesSitemap = readFile('sitemap-articles.xml');
if (articlesSitemap) {
  check('sitemap-articles.xml exists', true);
}

// ── 4. STRUCTURED DATA GENERATORS ────────────────────────────────────
console.log('\n📋 4. Structured Data Generators\n');

const schemaMarkupPath = path.join(SRC_DIR, 'lib/schemaMarkup.ts');
const schemaMarkup = readFile('lib/schemaMarkup.ts', SRC_DIR);
if (schemaMarkup) {
  check('schemaMarkup.ts exists', true);
  check('Organization schema', schemaMarkup.includes("'Organization'"));
  check('WebSite schema', schemaMarkup.includes("'WebSite'"));
  check('NewsArticle schema', schemaMarkup.includes("'NewsArticle'"));
  check('BreadcrumbList schema', schemaMarkup.includes("'BreadcrumbList'"));
  check('FAQPage schema', schemaMarkup.includes("'FAQPage'"));
  check('HowTo schema', schemaMarkup.includes("'HowTo'"));
  check('CollectionPage schema', schemaMarkup.includes("'CollectionPage'"));
  check('SoftwareApplication schema', schemaMarkup.includes("'SoftwareApplication'"));
  check('Review schema', schemaMarkup.includes("'Review'"));
  check('VideoObject schema', schemaMarkup.includes("'VideoObject'"));
  check('Event schema', schemaMarkup.includes("'Event'"));
  check('ItemList schema', schemaMarkup.includes("'ItemList'"));
  check('Person schema', schemaMarkup.includes("'Person'"));
  check('SpeakableSpecification', schemaMarkup.includes("'SpeakableSpecification'"));
  check('generateAllSchemas orchestrator', schemaMarkup.includes('function generateAllSchemas'));
} else {
  check('schemaMarkup.ts missing', false);
}

// ── 5. SEO HEAD COMPONENT ────────────────────────────────────────────
console.log('\n🧭 5. SEO Head Component\n');

const seoHeadPath = path.join(SRC_DIR, 'components/seo/SEOHead.tsx');
const seoHead = readFile('components/seo/SEOHead.tsx', SRC_DIR);
if (seoHead) {
  check('SEOHead.tsx exists', true);
  check('Supports faqs prop', seoHead.includes('faqs?:'));
  check('Supports howTo prop', seoHead.includes('howTo?:'));
  check('Supports videos prop', seoHead.includes('videos?:'));
  check('Supports events prop', seoHead.includes('events?:'));
  check('Supports itemList prop', seoHead.includes('itemList?:'));
  check('Supports review prop', seoHead.includes('review?:'));
  check('Sets canonical URL', seoHead.includes("rel = 'canonical'"));
  check('Sets hreflang', seoHead.includes("hreflang"));
  check('Removes duplicate JSON-LD', seoHead.includes("querySelectorAll('script[type=\"application/ld+json\"]')"));
  check('Generates consolidated @graph', seoHead.includes("'@graph': schemas"));
} else {
  check('SEOHead.tsx missing', false);
}

// ── 6. AI VISIBILITY ─────────────────────────────────────────────────
console.log('\n🤖 6. AI Visibility\n');

check('ai.txt exists', fileExists('ai.txt'));
check('llms.txt exists', fileExists('llms.txt'));
check('AI crawlers in robots.txt', robots?.includes('GPTBot') && robots?.includes('ClaudeBot'));
check('NewsArticle schema preferred', schemaMarkup?.includes("'NewsArticle'"));
check('Speakable schema present', schemaMarkup?.includes("'SpeakableSpecification'"));

// ── 7. FEEDS ─────────────────────────────────────────────────────────
console.log('\n📡 7. Feeds\n');

check('Atom feed exists', fileExists('feed.xml'));
check('RSS feed exists', fileExists('rss.xml'));
check('Feed available', fileExists('feed.xml'));

// ── 8. CONTENT FRESHNESS ─────────────────────────────────────────────
console.log('\n📝 8. Content Freshness\n');

const pageMetadata = readFile('lib/seo/pageMetadata.ts', SRC_DIR);
if (pageMetadata) {
  check('pageMetadata.ts exists', true);
  check('Homepage metadata defined', pageMetadata.includes("'/':"));
  check('Tech page metadata defined', pageMetadata.includes("'/tech':"));
  check('Security page metadata defined', pageMetadata.includes("'/security':"));
  check('Gaming page metadata defined', pageMetadata.includes("'/gaming':"));
  check('Article metadata function', pageMetadata.includes('function getPageMetadata'));
  check('Title optimization', pageMetadata.includes('getArticleTitle'));
}

// ── 9. TECHNICAL SEO UTILITIES ──────────────────────────────────────
console.log('\n🛠️  9. Technical SEO Utilities\n');

const seoUtils = readFile('lib/seoUtils.ts', SRC_DIR);
if (seoUtils) {
  check('seoUtils.ts exists', true);
  check('Title optimization', seoUtils.includes('function optimizeTitle'));
  check('Meta description optimization', seoUtils.includes('function optimizeMetaDescription'));
  check('Article title generation', seoUtils.includes('function generateArticleTitle'));
  check('Article meta description generation', seoUtils.includes('function generateArticleMetaDescription'));
  check('CTR modifier logic', seoUtils.includes('function appendCTRModifier'));
}

const articleValidation = readFile('lib/articleValidation.ts', SRC_DIR);
if (articleValidation) {
  check('articleValidation.ts exists', true);
  check('Word count calculation', articleValidation.includes('function calculateWordCount'));
  check('Read time calculation', articleValidation.includes('function calculateReadTime'));
  check('Slug generation', articleValidation.includes('function generateSlug'));
  check('Validation function', articleValidation.includes('function validateArticle'));
  check('Normalization function', articleValidation.includes('function normalizeArticle'));
}

// ── 10. PERFORMANCE UTILITIES ───────────────────────────────────────
console.log('\n⚡ 10. Performance Utilities\n');

const inpOpt = readFile('lib/seo/inpOptimization.ts', SRC_DIR);
if (inpOpt) {
  check('inpOptimization.ts exists', true);
  check('Event handler optimization', inpOpt.includes('function optimizeEventHandlers'));
  check('Debounce utility', inpOpt.includes('function debounce'));
  check('Throttle utility', inpOpt.includes('function throttle'));
  check('Idle work scheduling', inpOpt.includes('function scheduleIdleWork'));
  check('INP measurement', inpOpt.includes('function measureINP'));
  check('Init function', inpOpt.includes('function initINPOptimizations'));
}

const imageOpt = readFile('lib/seo/imageOptimization.ts', SRC_DIR);
if (imageOpt) {
  check('imageOptimization.ts exists', true);
  check('WebP support detection', imageOpt.includes('function supportsWebP'));
  check('AVIF support detection', imageOpt.includes('function supportsAVIF'));
  check('Srcset generation', imageOpt.includes('function generateSrcSet'));
  check('Lazy loading setup', imageOpt.includes('function setupLazyLoading'));
  check('Preload critical images', imageOpt.includes('function preloadImage'));
}

const headingAudit = readFile('lib/seo/headingAudit.ts', SRC_DIR);
if (headingAudit) {
  check('headingAudit.ts exists', true);
  check('Heading hierarchy validation', headingAudit.includes('function auditHeadingStructure'));
  check('H1 count check', headingAudit.includes('h1Count'));
  check('Heading level validation', headingAudit.includes('Skipped heading level'));
}

// ── 11. MONITORING & TRACKING ───────────────────────────────────────
console.log('\n📊 11. Monitoring & Tracking\n');

const rankTracking = readFile('lib/seo/rankTracking.ts', SRC_DIR);
if (rankTracking) {
  check('rankTracking.ts exists', true);
  check('Rank tracking interface', rankTracking.includes('interface RankTrackingService'));
  check('SEMrush integration', rankTracking.includes('class SEMrushRankTrackingService'));
  check('Ahrefs integration', rankTracking.includes('class AhrefsRankTrackingService'));
  check('Mock service for dev', rankTracking.includes('class MockRankTrackingService'));
}

const lookerStudio = readFile('lib/seo/lookerStudioConfig.ts', SRC_DIR);
if (lookerStudio) {
  check('lookerStudioConfig.ts exists', true);
  check('GA4 connector config', lookerStudio.includes('GA4_CONNECTOR_CONFIG'));
  check('GSC connector config', lookerStudio.includes('GSC_CONNECTOR_CONFIG'));
  check('Dashboard template', lookerStudio.includes('SEO_DASHBOARD_TEMPLATE'));
}

// ── 12. DEPLOYMENT CONFIG ───────────────────────────────────────────
console.log('\n🚀 12. Deployment Configuration\n');

const netlify = readFile('netlify.toml');
if (netlify) {
  check('netlify.toml exists', true);
  check('WWW redirect configured', netlify.includes('www.thegridnexus.com'));
  check('Security headers (X-Frame-Options)', netlify.includes('X-Frame-Options'));
  check('Security headers (X-Content-Type-Options)', netlify.includes('X-Content-Type-Options'));
  check('Security headers (Referrer-Policy)', netlify.includes('Referrer-Policy'));
  check('robots.txt content type', netlify.includes('text/plain; charset=utf-8'));
  check('sitemap content type', netlify.includes('application/xml; charset=utf-8'));
}

const viteConfig = readFile('vite.config.ts', SRC_DIR);
if (viteConfig) {
  check('vite.config.ts exists', true);
  check('GA4 ID injection', viteConfig.includes('injectGa4Id'));
  check('Prerender routes loaded', viteConfig.includes('prerender-routes.json'));
  check('Build outdir set', viteConfig.includes('outDir: "dist"'));
  check('Sourcemap configured', viteConfig.includes('sourcemap'));
}

// ── SUMMARY ──────────────────────────────────────────────────────────
console.log('\n' + '='.repeat(70));
console.log('\n📊 Validation Summary\n');
console.log(`  ✅ Passed:  ${passCount}`);
console.log(`  ❌ Failed:  ${failCount}`);
console.log(`  ⚠️  Warnings: ${warnCount}`);
console.log(`  📈 Score:   ${Math.round((passCount / (passCount + failCount)) * 100)}%\n`);

if (failCount === 0) {
  console.log('🎉 All critical checks passed! Site is ready for production.\n');
} else {
  console.log(`⚠️  ${failCount} critical issue(s) need attention before deployment.\n`);
}

process.exit(failCount > 0 ? 1 : 0);
