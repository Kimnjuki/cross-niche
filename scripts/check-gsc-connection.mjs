#!/usr/bin/env node
/**
 * Google Search Console / indexing connectivity check.
 * Run: npm run check:gsc
 *
 * Validates production sitemaps, robots.txt, and GSC verification artifacts.
 * Does not call the GSC API (requires service account credentials in Convex env).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const SITE = process.env.SITE_URL || 'https://thegridnexus.com';

const CHECKS = [
  { url: `${SITE}/robots.txt`, type: 'text', mustContain: ['Sitemap:', 'Allow: /'] },
  { url: `${SITE}/sitemap-index.xml`, type: 'xml', mustContain: ['<sitemapindex', 'sitemap.xml'] },
  { url: `${SITE}/sitemap.xml`, type: 'xml', mustContain: ['<urlset', '<loc>'] },
  { url: `${SITE}/sitemap-articles.xml`, type: 'xml', mustContain: ['<urlset'] },
  { url: `${SITE}/sitemap-news.xml`, type: 'xml', mustContain: ['<urlset'] },
  { url: `${SITE}/`, type: 'html', mustContain: ['index, follow', 'The Grid Nexus'] },
  { url: `${SITE}/tech`, type: 'html', mustNotContain: ['noindex'] },
  { url: `${SITE}/news`, type: 'html', mustNotContain: ['noindex'] },
];

async function fetchCheck({ url, type, mustContain = [], mustNotContain = [] }) {
  const result = { url, ok: true, status: 0, issues: [] };
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'GSC-Health-Check/1.0 (+https://thegridnexus.com)' },
      redirect: 'follow',
    });
    result.status = res.status;
    if (res.status >= 400) {
      result.ok = false;
      result.issues.push(`HTTP ${res.status}`);
      return result;
    }
    const body = await res.text();
    const contentType = res.headers.get('content-type') || '';

    if (type === 'xml' && !contentType.includes('xml') && body.trim().startsWith('<!')) {
      result.ok = false;
      result.issues.push('Returned HTML instead of XML (SPA rewrite may be blocking sitemap)');
    }
    for (const needle of mustContain) {
      if (!body.includes(needle)) {
        result.ok = false;
        result.issues.push(`Missing expected content: ${needle}`);
      }
    }
    for (const needle of mustNotContain) {
      if (body.includes(needle)) {
        result.ok = false;
        result.issues.push(`Found blocked content: ${needle}`);
      }
    }
  } catch (err) {
    result.ok = false;
    result.issues.push(err.message);
  }
  return result;
}

function checkLocalVerification() {
  const publicDir = path.join(projectRoot, 'public');
  const files = fs.readdirSync(publicDir);
  const googleHtml = files.filter((f) => /^google[a-z0-9]+\.html$/i.test(f));
  const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const hasMetaTag = /google-site-verification/i.test(indexHtml);

  return {
    googleHtmlFiles: googleHtml,
    hasMetaVerification: hasMetaTag,
    verified: googleHtml.length > 0 || hasMetaTag,
  };
}

async function main() {
  console.log(`\n🔍 GSC / Indexing connectivity check for ${SITE}\n`);

  const results = [];
  for (const check of CHECKS) {
    const result = await fetchCheck(check);
    results.push(result);
    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon} ${result.url} [${result.status || 'ERR'}]`);
    result.issues.forEach((i) => console.log(`   → ${i}`));
  }

  const verification = checkLocalVerification();
  console.log('\n📋 GSC property verification artifacts (local repo):');
  if (verification.verified) {
    console.log('✅ Verification file or meta tag found in project');
    if (verification.googleHtmlFiles.length) {
      console.log(`   HTML files: ${verification.googleHtmlFiles.join(', ')}`);
    }
    if (verification.hasMetaVerification) {
      console.log('   google-site-verification meta tag in index.html');
    }
  } else {
    console.log('❌ No GSC verification file or meta tag found');
    console.log('   Add google*.html to public/ OR google-site-verification meta to index.html');
    console.log('   See cross-niche/GOOGLE_SEARCH_CONSOLE_SETUP.md');
  }

  const gscApiConfigured = Boolean(
    process.env.GSC_SERVICE_ACCOUNT_EMAIL && process.env.GSC_SERVICE_ACCOUNT_PRIVATE_KEY
  );
  console.log('\n🔌 GSC API sync (optional):');
  if (gscApiConfigured) {
    console.log('✅ GSC_SERVICE_ACCOUNT_* env vars present (API sync can be enabled)');
  } else {
    console.log('⚠️  GSC API credentials not set (schema-only; manual GSC dashboard required)');
    console.log('   Set GSC_SERVICE_ACCOUNT_EMAIL + GSC_SERVICE_ACCOUNT_PRIVATE_KEY in Convex env');
  }

  const failed = results.filter((r) => !r.ok).length + (verification.verified ? 0 : 1);
  console.log(`\n${failed === 0 ? '✅ All checks passed' : `❌ ${failed} issue(s) need attention`}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
