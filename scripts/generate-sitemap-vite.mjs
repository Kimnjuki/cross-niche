import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const siteUrl = 'https://thegridnexus.com';
const distDir = path.join(projectRoot, 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');
const robotsPath = path.join(distDir, 'robots.txt');

// Static routes that should be included
const staticRoutes = [
  '/',
  '/tech',
  '/security', 
  '/gaming',
  '/news',
  '/topics',
  '/guides',
  '/tutorials',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/roadmap',
  '/blog-series',
  '/explore',
];

// Dynamic article routes (would be fetched from API/database in real implementation)
const dynamicRoutes = [
  // These would be generated from your content management system
  '/article/deus-ex-remastered-controversy-2026',
  '/article/high-on-life-2-release-2026',
  '/article/grok-ai-market-share-growth-2026',
  '/article/china-ai-scraping-bot-traffic-2026',
  '/article/tiktok-us-deal-algorithm-control-2026',
];

// Combine all routes
const allRoutes = [...staticRoutes, ...dynamicRoutes];

// Generate sitemap XML
function generateSitemap() {
  const urls = allRoutes.map(route => {
    const fullUrl = `${siteUrl}${route}`;
    const priority = getPriority(route);
    const changefreq = getChangeFreq(route);
    const lastmod = new Date().toISOString().split('T')[0];
    
    return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return sitemap;
}

// Generate robots.txt
function generateRobots() {
  return `# The Grid Nexus - robots.txt (SEO-optimized)
# https://thegridnexus.com

# Default: allow all crawlers, block sensitive paths
User-agent: *
Allow: /
Allow: /tech
Allow: /security
Allow: /gaming
Allow: /news
Allow: /explore
Allow: /blog-series
Allow: /topics
Allow: /guides
Allow: /tutorials
Allow: /about
Allow: /contact
Allow: /privacy
Allow: /terms
Allow: /disclosure
Allow: /editorial
Allow: /roadmap
Allow: /security-score
Allow: /article/
Allow: /sitemap
Disallow: /api/
Disallow: /admin/
Disallow: /profile
Disallow: /auth
Disallow: /auth/
Disallow: /wp-admin/
Disallow: /wp-includes/
Disallow: /search/
Disallow: /*?s=

# Google
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /profile
Disallow: /auth
User-agent: Googlebot-Image
Allow: /
User-agent: Googlebot-News
Allow: /

# Bing
User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /auth

# AI Crawlers
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: Claude-Web
Allow: /
User-agent: CCBot
Allow: /
User-agent: Applebot-Extended
Allow: /

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml`;
}

function getPriority(route) {
  if (route === '/') return '1.0';
  if (route.startsWith('/tech') || route.startsWith('/security') || route.startsWith('/gaming')) return '0.9';
  if (route.startsWith('/article/')) return '0.8';
  if (route.startsWith('/news') || route.startsWith('/topics')) return '0.7';
  if (route.startsWith('/guides') || route.startsWith('/blog-series')) return '0.6';
  return '0.5';
}

function getChangeFreq(route) {
  if (route.startsWith('/article/')) return 'monthly';
  if (route.startsWith('/news')) return 'daily';
  if (route.startsWith('/tech') || route.startsWith('/security') || route.startsWith('/gaming')) return 'weekly';
  return 'monthly';
}

// Main execution
try {
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Generate and write sitemap
  const sitemap = generateSitemap();
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Sitemap generated: ${sitemapPath}`);

  // Generate and write robots.txt
  const robots = generateRobots();
  fs.writeFileSync(robotsPath, robots);
  console.log(`✅ Robots.txt generated: ${robotsPath}`);

  console.log(`📊 Generated sitemap with ${allRoutes.length} URLs`);
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}
