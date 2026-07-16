#!/usr/bin/env node
/**
 * Deep indexing health check – scans local source for noindex on public routes.
 * Run: npm run check:indexing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src');

const PUBLIC_ROUTES_SHOULD_INDEX = [
  '/', '/tech', '/security', '/gaming', '/news', '/blog', '/explore',
  '/topics', '/guides', '/tutorials', '/about', '/contact', '/sitemap',
];

const DEV_ROUTES_SHOULD_NOINDEX = [
  '/simple', '/enhanced', '/enhanced-simple', '/test-features', '/original-index',
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const rel = path.relative(path.join(__dirname, '..'), filePath);
  const issues = [];

  if (rel.includes('pages/Sitemap.tsx') && /noindex\s*=\s*\{?\s*true/.test(content)) {
    issues.push('HTML sitemap page has noindex (blocks crawl hub)');
  }
  if (rel.includes('pages/Article.tsx')) {
    const noindexMatches = [...content.matchAll(/noindex\s*=\s*\{?\s*true/g)];
    if (noindexMatches.length > 1) {
      issues.push('Article page may have noindex on valid articles');
    }
  }
  if (/EnhancedIndex\.tsx|IndexSimple\.tsx|TestFeatures\.tsx|EnhancedIndexSimple\.tsx/.test(rel)) {
    if (!/noindex/i.test(content)) {
      issues.push('Dev/test route page missing noindex directive');
    }
  }

  return issues.map((msg) => ({ file: rel, msg }));
}

function checkRobotsTxt() {
  const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
  const content = fs.readFileSync(robotsPath, 'utf8');
  const issues = [];
  if (/CONVEX_DEPLOY_KEY|eyJ/i.test(content)) {
    issues.push('robots.txt contains exposed API key');
  }
  for (const route of DEV_ROUTES_SHOULD_NOINDEX) {
    const slug = route.replace(/^\//, '');
    if (!content.includes(`Disallow: ${route}`) && !content.includes(`Disallow: /${slug}`)) {
      issues.push(`robots.txt missing Disallow for dev route ${route}`);
    }
  }
  if (!content.includes('sitemap-index.xml')) {
    issues.push('robots.txt missing sitemap-index.xml reference');
  }
  return issues;
}

function checkNginx() {
  const nginxPath = path.join(__dirname, '..', 'nginx.conf');
  const content = fs.readFileSync(nginxPath, 'utf8');
  const issues = [];
  if (/rewrite \^\/news/.test(content)) {
    issues.push('nginx.conf has /news redirect loop (causes 5xx)');
  }
  if (/rewrite \^\/p\/\?/.test(content) || /rewrite \^\/p\/\?\(\.\*\)/.test(content)) {
    issues.push('nginx.conf /p/? rewrite hijacks /profile and /podcasts');
  }
  if (/deny all/.test(content) && /location ~ \/\\./.test(content)) {
    issues.push('nginx.conf returns 403 for dotfiles — prefer return 404 for Ahrefs 4XX');
  }
  if (!/absolute_redirect off/.test(content)) {
    issues.push('nginx.conf missing absolute_redirect off (http/https redirect flips)');
  }
  if (/server_name www\.thegridnexus\.com;[\s\S]*?return 301 http:\/\//.test(content)) {
    issues.push('nginx.conf www block redirects to http:// — use https:// apex');
  }
  if (/X-Robots-Tag "noindex"/.test(content)) {
    issues.push('nginx.conf sets X-Robots-Tag noindex on sitemap files');
  }
  return issues;
}

function main() {
  console.log('\n🔎 Local indexing health scan\n');

  const fileIssues = walk(srcDir).flatMap(scanFile);
  const robotsIssues = checkRobotsTxt();
  const nginxIssues = checkNginx();

  const all = [
    ...fileIssues.map((i) => `[src] ${i.file}: ${i.msg}`),
    ...robotsIssues.map((i) => `[robots.txt] ${i}`),
    ...nginxIssues.map((i) => `[nginx.conf] ${i}`),
  ];

  if (all.length === 0) {
    console.log('✅ No local indexing issues detected');
    console.log(`   Public routes expected to index: ${PUBLIC_ROUTES_SHOULD_INDEX.length}`);
    console.log(`   Dev routes blocked: ${DEV_ROUTES_SHOULD_NOINDEX.length}`);
  } else {
    console.log(`❌ Found ${all.length} issue(s):\n`);
    all.forEach((i) => console.log(`  • ${i}`));
  }

  console.log('');
  process.exit(all.length > 0 ? 1 : 0);
}

main();
