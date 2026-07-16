#!/usr/bin/env node
/**
 * SEO Indexing Fix Script for thegridnexus.com
 *
 * This script:
 * 1. Generates a comprehensive sitemap with all canonical URLs
 * 2. Creates a redirect map for 404 tracking
 * 3. Generates internal linking suggestions
 * 4. Validates canonical URL consistency
 *
 * Run: node scripts/fix-seo-indexing.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://thegridnexus.com';
const today = new Date().toISOString().split('T')[0];

// All known routes from App.tsx (canonical only)
const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/tech', priority: 0.9, changefreq: 'daily' },
  { path: '/security', priority: 0.9, changefreq: 'daily' },
  { path: '/gaming', priority: 0.9, changefreq: 'daily' },
  { path: '/news', priority: 0.9, changefreq: 'daily' },
  { path: '/blog', priority: 0.8, changefreq: 'daily' },
  { path: '/explore', priority: 0.85, changefreq: 'daily' },
  { path: '/topics', priority: 0.9, changefreq: 'daily' },
  { path: '/guides', priority: 0.7, changefreq: 'weekly' },
  { path: '/tutorials', priority: 0.7, changefreq: 'weekly' },
  { path: '/reviews', priority: 0.7, changefreq: 'weekly' },
  { path: '/startups', priority: 0.7, changefreq: 'weekly' },
  { path: '/roadmap', priority: 0.6, changefreq: 'weekly' },
  { path: '/ai-pulse', priority: 0.7, changefreq: 'weekly' },
  { path: '/breach-sim', priority: 0.6, changefreq: 'monthly' },
  { path: '/security-score', priority: 0.7, changefreq: 'weekly' },
  { path: '/live-threat-dashboard', priority: 0.7, changefreq: 'daily' },
  { path: '/tools', priority: 0.9, changefreq: 'daily' },
  { path: '/tools/security-scanner', priority: 0.6, changefreq: 'weekly' },
  { path: '/tools/nexusguard', priority: 0.7, changefreq: 'weekly' },
  { path: '/tools/steam-scanner', priority: 0.7, changefreq: 'weekly' },
  { path: '/tools/ioc-lookup', priority: 0.7, changefreq: 'daily' },
  { path: '/tools/gaming-security-checkup', priority: 0.7, changefreq: 'weekly' },
  { path: '/tools/breach-explainer', priority: 0.7, changefreq: 'weekly' },
  { path: '/tools/ai-tool-finder', priority: 0.6, changefreq: 'weekly' },
  { path: '/tools/patch-risk-tracker', priority: 0.7, changefreq: 'daily' },
  { path: '/tools/zero-trust-quiz', priority: 0.6, changefreq: 'monthly' },
  { path: '/tools/exploit-risk-meter', priority: 0.7, changefreq: 'daily' },
  { path: '/tools/pc-builder', priority: 0.7, changefreq: 'weekly' },
  { path: '/tools/threat-scanner', priority: 0.8, changefreq: 'daily' },
  { path: '/tools/gaming-copilot', priority: 0.8, changefreq: 'daily' },
  { path: '/tools/security-briefing', priority: 0.7, changefreq: 'weekly' },
  { path: '/tools/vr-cyber-training', priority: 0.6, changefreq: 'weekly' },
  { path: '/tools/sentiment-analyzer', priority: 0.8, changefreq: 'weekly' },
  { path: '/tools/news-personalizer', priority: 0.7, changefreq: 'daily' },
  { path: '/tools/recommendation-engine', priority: 0.8, changefreq: 'weekly' },
  { path: '/tools/community-moderator', priority: 0.7, changefreq: 'weekly' },
  { path: '/tools/release-predictor', priority: 0.8, changefreq: 'daily' },
  { path: '/nexus-intersection', priority: 0.6, changefreq: 'weekly' },
  { path: '/security-profile', priority: 0.7, changefreq: 'weekly' },
  { path: '/community-threats', priority: 0.7, changefreq: 'weekly' },
  { path: '/forums', priority: 0.6, changefreq: 'weekly' },
  { path: '/media', priority: 0.5, changefreq: 'monthly' },
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
  { path: '/contact', priority: 0.4, changefreq: 'monthly' },
  { path: '/editorial', priority: 0.4, changefreq: 'monthly' },
  { path: '/disclosure', priority: 0.4, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.4, changefreq: 'monthly' },
  { path: '/terms', priority: 0.4, changefreq: 'monthly' },
  { path: '/quality-guidelines', priority: 0.4, changefreq: 'monthly' },
  { path: '/content-policy', priority: 0.4, changefreq: 'monthly' },
  { path: '/sitemap', priority: 0.4, changefreq: 'weekly' },
  { path: '/learn/nexus-path', priority: 0.6, changefreq: 'weekly' },
  { path: '/pulse/nexus-pulse', priority: 0.6, changefreq: 'weekly' },
  { path: '/nexus-studio', priority: 0.6, changefreq: 'weekly' },
  { path: '/gaming/security-guides', priority: 0.7, changefreq: 'weekly' },
];

// Redirect sources that must NEVER appear in sitemap
const REDIRECT_SOURCES = new Set([
  '/blog-series', '/articles', '/live', '/ai', '/security-tools',
  '/billing', '/settings', '/cybersecurity', '/cyber', '/gamming',
  '/feed', '/rss', '/atom', '/simple', '/enhanced', '/enhanced-simple',
  '/test-features', '/original-index', '/tools-old', '/auth',
  '/nexus/nexusguard', '/nexus/nexuspath', '/nexus/nexuspulse',
]);

// Generate sitemap XML
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/[&]/g, '&#38;')
    .replace(/[<]/g, '&#60;')
    .replace(/[>]/g, '&#62;')
    .replace(/["]/g, '&#34;')
    .replace(/[']/g, '&#39;');
}

function generateSitemapXml(urls) {
  const entries = urls.map(function(u) {
    return '  <url>\n    <loc>' + escapeXml(u.loc) + '</loc>\n    <lastmod>' + u.lastmod + '</lastmod>\n    <changefreq>' + u.changefreq + '</changefreq>\n    <priority>' + u.priority + '</priority>\n  </url>';
  }).join('\n');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n' + entries + '\n</urlset>';
}

async function main() {
  console.log('=== SEO Indexing Fix Script ===\n');

  // 1. Generate static sitemap
  console.log('Generating static sitemap...');
  const staticUrls = STATIC_ROUTES
    .filter(function(r) { return !REDIRECT_SOURCES.has(r.path); })
    .map(function(r) {
      return {
        loc: BASE_URL + r.path,
        lastmod: today,
        changefreq: r.changefreq,
        priority: r.priority,
      };
    });
  console.log('  -> ' + staticUrls.length + ' static URLs');

  // 2. Write sitemap
  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapXml = generateSitemapXml(staticUrls);
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log('  -> sitemap.xml written');

  // 3. Generate sitemap index
  const indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>' + BASE_URL + '/sitemap.xml</loc>\n    <lastmod>' + today + '</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>' + BASE_URL + '/sitemap-articles.xml</loc>\n    <lastmod>' + today + '</lastmod>\n  </sitemap>\n  <sitemap>\n    <loc>' + BASE_URL + '/sitemap-news.xml</loc>\n    <lastmod>' + today + '</lastmod>\n  </sitemap>\n</sitemapindex>';
  fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml, 'utf-8');
  console.log('  -> sitemap-index.xml written\n');

  // 4. Generate redirect map for 404 tracking
  console.log('Generating redirect map...');
  const redirectMap = [
    { from: '/gamming', to: '/gaming', type: 'nginx' },
    { from: '/secuirty', to: '/security', type: 'nginx' },
    { from: '/teck', to: '/tech', type: 'nginx' },
    { from: '/securty', to: '/security', type: 'nginx' },
    { from: '/cyber', to: '/security', type: 'nginx' },
    { from: '/cybersecurity', to: '/security', type: 'nginx' },
    { from: '/p/', to: '/article/', type: 'nginx' },
    { from: '/post/', to: '/article/', type: 'nginx' },
    { from: '/posts/', to: '/article/', type: 'nginx' },
    { from: '/2026/', to: '/article/', type: 'nginx' },
    { from: '/articles', to: '/blog', type: 'nginx' },
    { from: '/live', to: '/live-updates', type: 'nginx' },
    { from: '/ai', to: '/ai-pulse', type: 'nginx' },
    { from: '/security-tools', to: '/tools/security-scanner', type: 'nginx' },
    { from: '/blog-series', to: '/blog', type: 'nginx' },
    { from: '/billing', to: '/subscription/management', type: 'nginx' },
    { from: '/settings', to: '/subscription/management', type: 'nginx' },
    { from: '/nexus/nexusguard', to: '/tools/nexusguard', type: 'nginx' },
    { from: '/nexus/nexuspath', to: '/learn/nexus-path', type: 'nginx' },
    { from: '/nexus/nexuspulse', to: '/pulse/nexus-pulse', type: 'nginx' },
    { from: '/cybersecurity', to: '/security', type: 'react-router' },
    { from: '/blog-series', to: '/blog', type: 'react-router' },
    { from: '/articles', to: '/blog', type: 'react-router' },
    { from: '/live', to: '/live-updates', type: 'react-router' },
    { from: '/ai', to: '/ai-pulse', type: 'react-router' },
    { from: '/security-tools', to: '/tools/security-scanner', type: 'react-router' },
    { from: '/billing', to: '/subscription/management', type: 'react-router' },
    { from: '/settings', to: '/subscription/management', type: 'react-router' },
    { from: '/auth', to: '/signin', type: 'react-router' },
    { from: '/nexus/nexusguard', to: '/tools/nexusguard', type: 'react-router' },
    { from: '/nexus/nexuspath', to: '/learn/nexus-path', type: 'react-router' },
    { from: '/nexus/nexuspulse', to: '/pulse/nexus-pulse', type: 'react-router' },
  ];
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(dataDir, 'redirect_map.json'),
    JSON.stringify(redirectMap, null, 2),
    'utf-8'
  );
  console.log('  -> redirect_map.json (' + redirectMap.length + ' rules)\n');

  // 5. Generate internal linking suggestions
  console.log('Generating internal linking suggestions...');
  const internalLinks = [
    { from: '/', to: '/tech', anchor: 'Technology News', context: 'homepage-nav' },
    { from: '/', to: '/security', anchor: 'Cybersecurity and Threat Intelligence', context: 'homepage-nav' },
    { from: '/', to: '/gaming', anchor: 'Gaming and Esports', context: 'homepage-nav' },
    { from: '/', to: '/tools', anchor: 'Security Tools Hub', context: 'homepage-nav' },
    { from: '/', to: '/guides', anchor: 'Guides and How-Tos', context: 'homepage-nav' },
    { from: '/', to: '/topics', anchor: 'Browse Topics', context: 'homepage-nav' },
    { from: '/', to: '/news', anchor: 'Breaking News', context: 'homepage-nav' },
    { from: '/', to: '/ai-pulse', anchor: 'AI Pulse Tracker', context: 'homepage-nav' },
    { from: '/', to: '/security-profile', anchor: 'Security Profile', context: 'homepage-nav' },
    { from: '/', to: '/community-threats', anchor: 'Community Threat Hub', context: 'homepage-nav' },
    { from: '/', to: '/breach-sim', anchor: 'Breach Simulation', context: 'homepage-nav' },
    { from: '/', to: '/security-score', anchor: 'Security Score', context: 'homepage-nav' },
    { from: '/', to: '/live-threat-dashboard', anchor: 'Live Threat Dashboard', context: 'homepage-nav' },
    { from: '/', to: '/nexus-intersection', anchor: 'Nexus Intersection', context: 'homepage-nav' },
    { from: '/', to: '/roadmap', anchor: 'Platform Roadmap', context: 'homepage-nav' },
    { from: '/', to: '/startups', anchor: 'Startup News', context: 'homepage-nav' },
    { from: '/', to: '/reviews', anchor: 'Product and Game Reviews', context: 'homepage-nav' },
    { from: '/', to: '/tutorials', anchor: 'Tutorials', context: 'homepage-nav' },
    { from: '/', to: '/blog', anchor: 'Blog and Features', context: 'homepage-nav' },
    { from: '/', to: '/sitemap', anchor: 'HTML Sitemap', context: 'homepage-nav' },
    { from: '/tech', to: '/security', anchor: 'Cybersecurity News', context: 'cross-niche' },
    { from: '/tech', to: '/gaming', anchor: 'Gaming Security', context: 'cross-niche' },
    { from: '/tech', to: '/ai-pulse', anchor: 'AI Pulse', context: 'cross-niche' },
    { from: '/security', to: '/tech', anchor: 'Tech News', context: 'cross-niche' },
    { from: '/security', to: '/gaming', anchor: 'Gaming Security Guides', context: 'cross-niche' },
    { from: '/security', to: '/tools/security-scanner', anchor: 'Security Scanner', context: 'cross-niche' },
    { from: '/security', to: '/breach-sim', anchor: 'Breach Simulation', context: 'cross-niche' },
    { from: '/security', to: '/security-score', anchor: 'Security Score', context: 'cross-niche' },
    { from: '/security', to: '/live-threat-dashboard', anchor: 'Live Threat Dashboard', context: 'cross-niche' },
    { from: '/security', to: '/community-threats', anchor: 'Community Threats', context: 'cross-niche' },
    { from: '/gaming', to: '/security', anchor: 'Gaming Security', context: 'cross-niche' },
    { from: '/gaming', to: '/tech', anchor: 'Tech News', context: 'cross-niche' },
    { from: '/gaming', to: '/tools/gaming-security-checkup', anchor: 'Gaming Security Checkup', context: 'cross-niche' },
    { from: '/gaming', to: '/tools/steam-scanner', anchor: 'Steam Scanner', context: 'cross-niche' },
    { from: '/gaming', to: '/tools/gaming-copilot', anchor: 'Gaming Copilot', context: 'cross-niche' },
    { from: '/tools', to: '/tools/security-scanner', anchor: 'Security Scanner', context: 'tools-hub' },
    { from: '/tools', to: '/tools/nexusguard', anchor: 'NexusGuard', context: 'tools-hub' },
    { from: '/tools', to: '/tools/steam-scanner', anchor: 'Steam Scanner', context: 'tools-hub' },
    { from: '/tools', to: '/tools/ioc-lookup', anchor: 'IOC Lookup', context: 'tools-hub' },
    { from: '/tools', to: '/tools/gaming-security-checkup', anchor: 'Gaming Security Checkup', context: 'tools-hub' },
    { from: '/tools', to: '/tools/breach-explainer', anchor: 'Breach Explainer', context: 'tools-hub' },
    { from: '/tools', to: '/tools/patch-risk-tracker', anchor: 'Patch Risk Tracker', context: 'tools-hub' },
    { from: '/tools', to: '/tools/exploit-risk-meter', anchor: 'Exploit Risk Meter', context: 'tools-hub' },
    { from: '/tools', to: '/tools/pc-builder', anchor: 'PC Builder', context: 'tools-hub' },
    { from: '/tools', to: '/tools/threat-scanner', anchor: 'Threat Scanner', context: 'tools-hub' },
    { from: '/tools', to: '/tools/gaming-copilot', anchor: 'Gaming Copilot', context: 'tools-hub' },
    { from: '/tools', to: '/security-score', anchor: 'Security Score', context: 'tools-hub' },
    { from: '/tools', to: '/breach-sim', anchor: 'Breach Simulation', context: 'tools-hub' },
    { from: '/tools', to: '/live-threat-dashboard', anchor: 'Live Threat Dashboard', context: 'tools-hub' },
    { from: '/guides', to: '/tutorials', anchor: 'Tutorials', context: 'guides' },
    { from: '/guides', to: '/security', anchor: 'Security Guides', context: 'guides' },
    { from: '/guides', to: '/tech', anchor: 'Tech Guides', context: 'guides' },
    { from: '/blog', to: '/tech', anchor: 'Tech News', context: 'blog' },
    { from: '/blog', to: '/security', anchor: 'Security News', context: 'blog' },
    { from: '/blog', to: '/gaming', anchor: 'Gaming News', context: 'blog' },
    { from: '/about', to: '/editorial', anchor: 'Editorial Policy', context: 'about' },
    { from: '/about', to: '/disclosure', anchor: 'Disclosure Policy', context: 'about' },
    { from: '/about', to: '/contact', anchor: 'Contact Us', context: 'about' },
    { from: '/about', to: '/quality-guidelines', anchor: 'Quality Guidelines', context: 'about' },
    { from: '/about', to: '/content-policy', anchor: 'Content Policy', context: 'about' },
    { from: '/privacy', to: '/terms', anchor: 'Terms of Service', context: 'legal' },
    { from: '/terms', to: '/privacy', anchor: 'Privacy Policy', context: 'legal' },
    { from: '/security-profile', to: '/security-score', anchor: 'Security Score', context: 'profile' },
    { from: '/security-profile', to: '/breach-sim', anchor: 'Breach Simulation', context: 'profile' },
    { from: '/security-profile', to: '/tools/threat-scanner', anchor: 'Threat Scanner', context: 'profile' },
    { from: '/security-profile', to: '/community-threats', anchor: 'Community Threats', context: 'profile' },
    { from: '/community-threats', to: '/security', anchor: 'Security News', context: 'community' },
    { from: '/community-threats', to: '/live-threat-dashboard', anchor: 'Live Threat Dashboard', context: 'community' },
    { from: '/nexus-intersection', to: '/tech', anchor: 'Tech', context: 'intersection' },
    { from: '/nexus-intersection', to: '/security', anchor: 'Security', context: 'intersection' },
    { from: '/nexus-intersection', to: '/gaming', anchor: 'Gaming', context: 'intersection' },
    { from: '/ai-pulse', to: '/tech', anchor: 'Tech News', context: 'ai-pulse' },
    { from: '/ai-pulse', to: '/security', anchor: 'AI Security', context: 'ai-pulse' },
    { from: '/roadmap', to: '/about', anchor: 'About Us', context: 'roadmap' },
    { from: '/roadmap', to: '/contact', anchor: 'Feedback', context: 'roadmap' },
  ];
  fs.writeFileSync(
    path.join(dataDir, 'internal-linking-map.json'),
    JSON.stringify(internalLinks, null, 2),
    'utf-8'
  );
  console.log('  -> internal-linking-map.json (' + internalLinks.length + ' links)\n');

  // 6. Validate canonical URL consistency
  console.log('Validating canonical URL consistency...');
  const issues = [];
  for (const route of STATIC_ROUTES) {
    if (REDIRECT_SOURCES.has(route.path)) {
      issues.push('WARNING: Redirect source in static routes: ' + route.path);
    }
  }
  if (issues.length > 0) {
    console.log('  Issues found:');
    issues.forEach(function(i) { console.log('  ' + i); });
  } else {
    console.log('  All static routes are canonical (no redirect sources)');
  }

  console.log('\n=== SEO Fix Summary ===');
  console.log('  Static sitemap URLs: ' + staticUrls.length);
  console.log('  Redirect rules: ' + redirectMap.length);
  console.log('  Internal linking suggestions: ' + internalLinks.length);
  console.log('\nNext steps:');
  console.log('  1. Deploy to production');
  console.log('  2. Submit sitemap-index.xml to Google Search Console');
  console.log('  3. Request re-crawl for critical pages');
  console.log('  4. Monitor GSC Coverage report for improvements');
}

main().catch(console.error);