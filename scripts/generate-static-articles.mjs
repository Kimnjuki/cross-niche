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
import { loadPublishedContent } from './lib/content-source.mjs';
import { normalizeArticleHtml, repairMojibake } from './lib/normalize-article-html.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

/** Map a Convex contentType to the site's three niche sections. */
function nicheOf(contentType) {
  const ct = String(contentType ?? '').toLowerCase();
  if (ct === 'security' || ct === 'threat_alert' || ct === 'threat_intelligence') return 'security';
  if (ct === 'gaming' || ct === 'gaming_security_guide') return 'gaming';
  return 'tech';
}

// ── mockData.ts parsing lives in scripts/lib/mock-content.mjs ─────────────
// (extracted so the sitemap, prerender and static-HTML generators share one
//  escape-aware parser — the per-script copies each had the V-06 bug.)

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

// ── Strip HTML tags for fallback descriptions ─────────────────────────────────
function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 158;

/**
 * Trim to <= maxLength chars at a word boundary (adds an ellipsis when cut).
 * Mirrors src/lib/seoUtils.ts optimizeTitle/optimizeMetaDescription so the
 * prerendered HTML and the hydrated SPA emit the same <title>/description —
 * otherwise Google sees two different values for one URL.
 */
function truncateAtWord(str, maxLength) {
  const clean = String(str ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  const cut = clean.substring(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const body = lastSpace > maxLength * 0.6 ? cut.substring(0, lastSpace) : cut;
  return body.replace(/[,\s]+$/, '') + '\u2026';
}

/**
 * Build a unique-ish, length-safe <title>.
 * Prefers the editorial metaTitle (content.metaTitle), then title, and keeps
 * the " | The Grid Nexus" brand suffix when it fits. Fixes the audit's
 * "duplicate title tag" and "title element is too long" findings by deriving a
 * deterministic, distinct suffix from slug/date instead of repeating the brand.
 */
function buildTitle(article) {
  const base = String(article.metaTitle || article.title || 'Untitled').trim();
  const brand = ` | ${SITE_NAME}`;
  if (base.length + brand.length <= TITLE_MAX) return base + brand;

  // Too long with brand: keep the headline, drop the brand, disambiguate.
  const headline = truncateAtWord(base, TITLE_MAX - brand.length);
  if (headline.length + brand.length <= TITLE_MAX) return headline + brand;

  // Still too long: drop the brand entirely and truncate the headline.
  return truncateAtWord(base, TITLE_MAX);
}

/**
 * Meta description with a guaranteed non-empty fallback chain (P1-03):
 *   content.seoDescription -> description -> excerpt -> first 155 words of body
 * Never returns '' so no page ships a missing/empty description tag.
 */
function buildDescription(article) {
  const candidates = [
    article.seoDescription,
    article.description,
    article.excerpt,
    article.summary,
    article.body ? stripTags(normalizeArticleHtml(article.body)) : '',
  ].map((c) => (typeof c === 'string' ? repairMojibake(c) : c));
  const chosen = candidates.find((c) => typeof c === 'string' && c.trim().length >= 50);
  const fallback = candidates.find((c) => typeof c === 'string' && c.trim().length > 0);
  return truncateAtWord(chosen || fallback || fallbackDescription(article), DESCRIPTION_MAX);
}

/** Absolute last-resort description so the tag is never empty. */
function fallbackDescription(article) {
  const label = nicheOf(article.contentType);
  const section =
    label === 'security' ? 'cybersecurity threat intelligence'
    : label === 'gaming' ? 'gaming security'
    : 'technology and security';
  return `${article.title || 'The Grid Nexus article'} — in-depth ${section} analysis, context and practical guidance from The Grid Nexus.`;
}

// ── Generate comprehensive JSON-LD structured data for an article ───────────
function generateArticleJsonLd(article) {
  const schemaType = article.isBreaking ? 'NewsArticle' : 'Article';
  const publishedDate = article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString();
  const modifiedDate = article.lastModified ? new Date(article.lastModified).toISOString() : publishedDate;
  const articleUrl = `${BASE_URL}/article/${article.slug}`;
  const canonical = article.canonicalUrl || articleUrl;

  const authorName = article.authorName || 'The Grid Nexus Editorial Team';
  const authorSlugValue = authorName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const authorUrl = `${BASE_URL}/author/${authorSlugValue}`;

  const wordCount = article.body ? Math.max(1, Math.floor(article.body.split(/\s+/).length)) : 300;
  const niche = nicheOf(article.contentType);

  // Same length-safe, non-empty values the <head> uses, so the HTML and the
  // JSON-LD never disagree about this page's title/description.
  const pageTitle = buildTitle(article);
  const metaDescription = buildDescription(article);

  const graph = [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: SITE_NAME,
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png`, width: 512, height: 512 },
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: SITE_NAME,
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/topics?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        {
          '@type': 'ListItem', position: 2,
          name: niche === 'security' ? 'Cybersecurity' : niche === 'gaming' ? 'Gaming' : 'Technology',
          item: `${BASE_URL}/${niche}`,
        },
        { '@type': 'ListItem', position: 3, name: article.title, item: articleUrl },
      ],
    },
    {
      '@type': schemaType,
      '@id': `${articleUrl}#article`,
      headline: pageTitle,
      name: pageTitle,
      description: metaDescription,
      image: article.featuredImageUrl
        ? [{ '@type': 'ImageObject', url: article.featuredImageUrl, width: 1200, height: 630 }]
        : [`${BASE_URL}/og-image.jpg`],
      datePublished: publishedDate,
      dateModified: modifiedDate,
      author: {
        '@type': 'Person',
        '@id': `${authorUrl}#person`,
        name: authorName,
        url: authorUrl,
        worksFor: { '@id': `${BASE_URL}/#organization` },
      },
      publisher: { '@id': `${BASE_URL}/#organization` },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      articleSection: niche,
      keywords: (article.tags || []).join(', '),
      wordCount,
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      ...(article.readTime ? { timeRequired: `PT${article.readTime}M` } : {}),
      ...(article.isBreaking ? { dateline: 'Breaking News', urgency: 'Breaking' } : {}),
    },
    {
      '@type': 'WebPage',
      '@id': articleUrl,
      url: canonical,
      name: article.title,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      primaryImageOfPage: { '@type': 'ImageObject', url: article.featuredImageUrl || `${BASE_URL}/og-image.jpg` },
      datePublished: publishedDate,
      dateModified: modifiedDate,
      inLanguage: 'en-US',
    },
  ];

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

// ── Generate security metadata card HTML (for security articles) ────────────
function generateSecurityMetaCard(article) {
  if (nicheOf(article.contentType) !== 'security') return '';

  const formattedDate = article.lastModified
    ? new Date(article.lastModified).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return `
    <section style="background:rgba(248,135,51,0.1);border:1px solid rgba(248,135,51,0.3);border-radius:12px;padding:2rem;margin:2rem 0;color:#f8fafc">
      <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem;color:#f8fafc;display:flex;align-items:center;gap:0.75rem">
        Threat Intelligence Snapshot
      </h2>
      ${formattedDate ? `<p style="color:#94a3b8;margin-bottom:0.75rem">Last updated: ${escapeHtml(formattedDate)}</p>` : ''}
      <div style="display:flex;flex-wrap:gap:2rem;margin-top:1rem">
        <div>
          <span style="font-size:0.75rem;text-transform:uppercase;color:#94a3b8">Severity</span>
          <p style="font-size:1.125rem;font-weight:600;color:#f8fafc">${article.isBreaking ? 'Breaking' : 'Active threat'}</p>
        </div>
        <div>
          <span style="font-size:0.75rem;text-transform:uppercase;color:#94a3b8">Content Type</span>
          <p style="font-size:1.125rem;font-weight:600;color:#f8fafc">${escapeHtml(article.contentType || 'threat intelligence')}</p>
        </div>
      </div>
      <p style="margin-top:1rem;color:#cbd5e1;line-height:1.6;font-size:0.95rem">
        This ${article.isBreaking ? 'breaking' : 'in-depth'} threat intelligence report covers the latest security research,
        attack vectors, and mitigation strategies. Read the full analysis below for detailed
        recommendations and real-world implications.
      </p>
    </section>
  `;
}

/**
 * Build a "Related reading" block from shared tags, then niche, then recency.
 * Every generated article therefore links out to >= 3 other articles and, in
 * turn, receives inbound links — the fix for the 64 orphan pages / 122 orphaned
 * sitemap pages reported by Ahrefs and the technical audit (P2-01).
 */
function buildRelatedHtml(article, allArticles, limit = 5) {
  const tags = new Set((article.tags || []).map((t) => String(t).toLowerCase()));
  const niche = nicheOf(article.contentType);
  const selfSlug = article.slug;

  const scored = allArticles
    .filter((a) => a.slug && a.slug !== selfSlug)
    .map((a) => {
      const shared = (a.tags || []).filter((t) => tags.has(String(t).toLowerCase())).length;
      const sameNiche = nicheOf(a.contentType) === niche ? 1 : 0;
      return { article: a, score: shared * 2 + sameNiche };
    })
    .sort((x, y) => {
      if (y.score !== x.score) return y.score - x.score;
      return (y.article.publishedAt || 0) - (x.article.publishedAt || 0);
    })
    .slice(0, limit);

  if (!scored.length) return '';

  const items = scored
    .map(
      ({ article: a }) =>
        `<li style="margin-bottom:0.5rem"><a href="/article/${encodeURIComponent(a.slug)}" style="color:#60a5fa;text-decoration:none">${escapeHtml(a.title)}</a></li>`
    )
    .join('');

  return `
    <section aria-labelledby="related-heading" style="margin-top:2.5rem;border-top:1px solid rgba(148,163,184,0.2);padding-top:1.5rem">
      <h2 id="related-heading" style="font-size:1.25rem;font-weight:700;margin-bottom:0.75rem;color:#f8fafc">Related reading</h2>
      <ul style="list-style:none;padding:0;margin:0;color:#cbd5e1">${items}</ul>
    </section>`;
}

// ── Generate a static HTML page for an article ────────────────────────────
function generateArticleHtml(article, bundleScript, allArticles = []) {
  const niche = nicheOf(article.contentType);
  const canonical = article.canonicalUrl || `${BASE_URL}/article/${article.slug}`;
  const nicheLabel = niche === 'tech' ? 'Technology' : niche === 'security' ? 'Cybersecurity' : 'Gaming';
  const nicheUrl = `/${niche}`;
  const imageUrl = article.featuredImageUrl || `${BASE_URL}/og-image.jpg`;
  const dateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  const tagsHtml = (article.tags && article.tags.length)
    ? `<div style="margin-top:2rem"><div style="display:flex;flex-wrap:wrap;gap:0.5rem">${article.tags.map((t) => `<span class="tag" style="background:rgba(96,165,250,0.15);border:1px solid rgba(96,165,250,0.3);border-radius:9999px;padding:0.25rem 0.75rem;font-size:0.8rem;color:#60a5fa">${escapeHtml(t)}</span>`).join('')}</div></div>`
    : '';

  const securityMetaCard = generateSecurityMetaCard(article);
  const relatedHtml = buildRelatedHtml(article, allArticles);
  const jsonLd = generateArticleJsonLd(article);
  const pageTitle = buildTitle(article);
  const metaDescription = buildDescription(article);

  // Explicit, data-driven indexability (P0-02). Only an explicit content.noindex
  // flag on a published document suppresses indexing — never template guesswork.
  const robotsDirective = article.noindex === true
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const modifiedStr = article.lastModified
    ? new Date(article.lastModified).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeAttr(metaDescription)}" />
    <meta name="robots" content="${robotsDirective}" />
    <meta name="googlebot" content="${robotsDirective}" />
    <meta name="bingbot" content="${robotsDirective}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeAttr(pageTitle)}" />
    <meta property="og:description" content="${escapeAttr(metaDescription)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(pageTitle)}" />
    <meta name="twitter:description" content="${escapeAttr(metaDescription)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="@thegridnexus" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <script type="application/ld+json">
${jsonLd}
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
            <span>${escapeHtml(repairMojibake(article.title))}</span>
          </nav>
          <article>
            <h1 style="font-size:2.25rem;line-height:1.2;margin-bottom:1rem;color:#f8fafc">${escapeHtml(repairMojibake(article.title))}</h1>
            <div style="display:flex;flex-wrap:wrap;gap:1rem;font-size:0.875rem;color:#94a3b8;margin-bottom:1.5rem">
              <span>By ${escapeHtml(article.authorName || 'The Grid Nexus Editorial Team')}</span>
              ${dateStr ? `<span>${dateStr}</span>` : ''}
                            ${modifiedStr ? `<span>Updated: ${modifiedStr}</span>` : ""}
              <span>${article.readTime} min read</span>
            </div>
            <p style="font-size:1.125rem;color:#cbd5e1;line-height:1.6;margin-bottom:1.5rem">${escapeHtml(repairMojibake(article.excerpt))}</p>
            <div style="color:#cbd5e1;line-height:1.7;font-size:1.0625rem">
              ${normalizeArticleHtml(article.body)}
            </div>
            ${securityMetaCard}
            ${tagsHtml}
            ${relatedHtml}
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
async function main() {
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

  const { items: articles, source } = await loadPublishedContent();
  console.log(`📄 Loaded ${articles.length} published articles (source: ${source})`);
  let generated = 0;
  for (const article of articles) {
    const articleDir = path.join(distDir, 'article', article.slug);
    fs.mkdirSync(articleDir, { recursive: true });
    const html = generateArticleHtml(article, bundleScript, articles);
    fs.writeFileSync(path.join(articleDir, 'index.html'), html, 'utf-8');
    generated++;
  }

  console.log(`✅ Generated ${generated} static article HTML files in dist/article/`);
}

main().catch((error) => {
  console.error('❌ generate-static-articles failed:', error);
  process.exit(0);
});