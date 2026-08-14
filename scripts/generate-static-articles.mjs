#!/usr/bin/env node
/**
 * Static Article HTML Generator — The Grid Nexus
 *
 * Generates static, crawlable HTML files for every article route so that
 * Googlebot (and other crawlers) can see the full article content WITHOUT
 * executing JavaScript. This fixes:
 *   - "Discovered - currently not indexed" (SPA pages Google can't render)
 *   - "Crawled - currently not indexed" (same)
 *   - "Server error (5xx)" (SPA rendering failures)
 *
 * The generated files are placed in dist/article/{slug}/index.html and are
 * served by nginx via the existing `try_files $uri /index.html` fallback.
 *
 * Run AFTER `vite build`: node scripts/generate-static-articles.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

// ── Parse mockData.ts ──────────────────────────────────────────────────────
function parseMockArticles() {
  const mockDataPath = path.join(projectRoot, 'src', 'data', 'mockData.ts');
  const content = fs.readFileSync(mockDataPath, 'utf8');
  const blocks = content.split(/\n\s*\{\n/).slice(1);
  const articles = [];

  for (const block of blocks) {
    const idMatch = block.match(/id:\s*'([^']+)'/);
    const slugMatch = block.match(/slug:\s*'([^']+)'/);
    const titleMatch = block.match(/title:\s*'([^']+)'/);
    const excerptMatch = block.match(/excerpt:\s*'([^']+)'/);
    const contentMatch = block.match(/content:\s*(?:`([\s\S]*?)`|'([^']*)')/);
    const publishedMatch = block.match(/publishedAt:\s*'([^']+)'/);
    const authorMatch = block.match(/author:\s*'([^']+)'/);
    const nicheMatch = block.match(/niche:\s*'([^']+)'/);
    const readTimeMatch = block.match(/readTime:\s*(\d+)/);
    const imageMatch = block.match(/imageUrl:\s*'([^']+)'/);
    const tagsMatch = block.match(/tags:\s*\[([^\]]*)\]/);

    if (!idMatch) continue;
    if (!slugMatch) continue;

    const tags = tagsMatch
      ? tagsMatch[1].split(',').map((t) => t.trim().replace(/^'|'$/g, '')).filter(Boolean)
      : [];

    articles.push({
      id: idMatch[1],
      slug: slugMatch[1],
      title: titleMatch ? titleMatch[1] : '',
      excerpt: excerptMatch ? excerptMatch[1] : '',
      content: contentMatch ? (contentMatch[1] ?? contentMatch[2]) : '',
      publishedAt: publishedMatch ? publishedMatch[1] : '',
      author: authorMatch ? authorMatch[1] : 'The Grid Nexus Editorial Team',
      niche: nicheMatch ? nicheMatch[1] : 'tech',
      readTime: readTimeMatch ? parseInt(readTimeMatch[1], 10) : 5,
      imageUrl: imageMatch ? imageMatch[1] : '',
      tags,
    });
  }

  return articles;
}

function escapeHtml(str) {
  if (!str) return '';
  const amp = String.fromCharCode(38);
  return String(str)
    .replace(/&/g, amp + 'amp;')
    .replace(/</g, amp + 'lt;')
    .replace(/>/g, amp + 'gt;')
    .replace(/"/g, amp + 'quot;')
    .replace(/'/g, amp + '#39;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, String.fromCharCode(38) + 'quot;');
}

// ── Generate a static HTML page for an article ────────────────────────────
function generateArticleHtml(article, bundleScript) {
  const canonical = `${BASE_URL}/article/${article.slug}`;
  const nicheLabel = article.niche === 'tech' ? 'Technology' : article.niche === 'security' ? 'Cybersecurity' : 'Gaming';
  const nicheUrl = `/${article.niche}`;
  const imageUrl = article.imageUrl || `${BASE_URL}/og-image.jpg`;
  const dateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  const tagsHtml = article.tags.length
    ? `<div class="article-tags">${article.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>`
    : '';

  return `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(article.title)} | ${SITE_NAME}</title>
    <meta name="description" content="${escapeAttr(article.excerpt)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeAttr(article.title)}" />
    <meta property="og:description" content="${escapeAttr(article.excerpt)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(article.title)}" />
    <meta name="twitter:description" content="${escapeAttr(article.excerpt)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="@thegridnexus" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": ${JSON.stringify(article.title)},
      "description": ${JSON.stringify(article.excerpt)},
      "image": ${JSON.stringify(imageUrl)},
      "author": { "@type": "Person", "name": ${JSON.stringify(article.author)} },
      "publisher": { "@type": "Organization", "name": "${SITE_NAME}", "url": "${BASE_URL}" },
      "datePublished": ${JSON.stringify(article.publishedAt)},
      "mainEntityOfPage": ${JSON.stringify(canonical)}
    }
    </script>
    ${bundleScript}
  </head>
  <body>
    <div id="root">
      <div id="static-shell" style="min-height:100vh;font-family:system-ui,sans-serif;background:#0f172a;color:#f8fafc">
        <header style="border-bottom:1px solid rgba(148,163,184,0.2);padding:1rem 1.5rem">
          <nav aria-label="Main navigation" style="max-width:80rem;margin:0 auto;display:flex;flex-wrap:wrap;gap:1rem;align-items:center">
            <a href="/" aria-label="${SITE_NAME} home" style="font-weight:700;font-size:1.25rem;color:#f8fafc;text-decoration:none">${SITE_NAME}</a>
            <a href="/tech" style="color:#94a3b8;text-decoration:none">Tech</a>
            <a href="/security" style="color:#94a3b8;text-decoration:none">Security</a>
            <a href="/gaming" style="color:#94a3b8;text-decoration:none">Gaming</a>
            <a href="/news" style="color:#94a3b8;text-decoration:none">News</a>
            <a href="/topics" style="color:#94a3b8;text-decoration:none">Topics</a>
            <a href="/about" style="color:#94a3b8;text-decoration:none">About</a>
          </nav>
        </header>
        <main id="main-content" style="max-width:80rem;margin:0 auto;padding:2rem 1.5rem">
          <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#94a3b8;margin-bottom:1rem">
            <a href="/" style="color:#60a5fa;text-decoration:none">Home</a> &rsaquo;
            <a href="${nicheUrl}" style="color:#60a5fa;text-decoration:none">${nicheLabel}</a> &rsaquo;
            <span>${escapeHtml(article.title)}</span>
          </nav>
          <article>
            <h1 style="font-size:2.25rem;line-height:1.2;margin-bottom:1rem;color:#f8fafc">${escapeHtml(article.title)}</h1>
            <div style="display:flex;flex-wrap:wrap;gap:1rem;font-size:0.875rem;color:#94a3b8;margin-bottom:1.5rem">
              <span>By ${escapeHtml(article.author)}</span>
              ${dateStr ? `<span>${dateStr}</span>` : ''}
              <span>${article.readTime} min read</span>
            </div>
            <p style="font-size:1.125rem;color:#cbd5e1;line-height:1.6;margin-bottom:1.5rem">${escapeHtml(article.excerpt)}</p>
            <div style="color:#cbd5e1;line-height:1.7;font-size:1.0625rem">
              ${article.content}
            </div>
            ${tagsHtml}
          </article>
        </main>
        <footer style="border-top:1px solid rgba(148,163,184,0.2);padding:1.5rem;text-align:center;color:#64748b;font-size:0.875rem">
          <p>&copy; 2026 ${SITE_NAME}. All rights reserved. <a href="/privacy" style="color:#60a5fa">Privacy</a> &middot; <a href="/terms" style="color:#60a5fa">Terms</a> &middot; <a href="/sitemap.xml" style="color:#64748b">Sitemap</a></p>
        </footer>
      </div>
    </div>
  </body>
</html>`;
}

// ── Main ──────────────────────────────────────────────────────────────────
function main() {
  const distDir = path.join(projectRoot, 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ dist/index.html not found. Run `vite build` first.');
    process.exit(1);
  }

  // Extract the module script tag from the built index.html so the SPA still hydrates
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  const moduleScriptMatch = indexHtml.match(/<script type="module"[^>]*src="[^"]*"[^>]*><\/script>/);
  const bundleScript = moduleScriptMatch ? moduleScriptMatch[0] : '';

  const articles = parseMockArticles();
  console.log(`📄 Found ${articles.length} articles with valid slugs`);

  let generated = 0;
  for (const article of articles) {
    const articleDir = path.join(distDir, 'article', article.slug);
    fs.mkdirSync(articleDir, { recursive: true });
    const html = generateArticleHtml(article, bundleScript);
    fs.writeFileSync(path.join(articleDir, 'index.html'), html, 'utf-8');
    generated++;
  }

  console.log(`✅ Generated ${generated} static article HTML files in dist/article/`);
}

main();