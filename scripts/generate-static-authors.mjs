#!/usr/bin/env node
/**
 * Static Author Profile HTML Generator — The Grid Nexus
 *
 * Generates static, crawlable HTML pages for every author, including:
 *   - Real <title> and <meta description> (unique per author)
 *   - Canonical URL
 *   - Person + Organization JSON-LD schema (worksFor)
 *   - BreadcrumbList JSON-LD
 *   - Full author bio, expertise, social links, and article index
 *
 * All content is server-rendered in the initial HTML — no JS required.
 * Run AFTER `vite build`: node scripts/generate-static-authors.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadPublishedContent } from './lib/content-source.mjs';
// authorData.ts is TypeScript; plain node cannot import it directly.
// scripts/lib/author-source.mjs parses the exported literals instead.
import { authorProfiles, defaultAuthorProfile, authorSlug } from './lib/author-source.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function escapeAttr(str) {
  return str ? str.replace(/"/g, '&quot;') : '';
}

function generateAuthorJsonLd(authorSlug, author) {
  const authorUrl = `${BASE_URL}/author/${authorSlug}`;
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
      inLanguage: 'en-US',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Authors', item: `${BASE_URL}/authors` },
        { '@type': 'ListItem', position: 3, name: author.name, item: authorUrl },
      ],
    },
    {
      '@type': 'Person',
      '@id': `${authorUrl}#person`,
      name: author.name,
      jobTitle: author.jobTitle,
      description: author.bio,
      url: authorUrl,
      worksFor: { '@id': `${BASE_URL}/#organization` },
      ...(author.imageUrl ? { sameAs: author.sameAs || [], image: { '@type': 'ImageObject', url: author.imageUrl } } : {}),
      ...(author.expertise && author.expertise.length ? { knowsAbout: author.expertise } : {}),
    },
    {
      '@type': 'WebPage',
      '@id': authorUrl,
      url: authorUrl,
      name: `${author.name} | ${SITE_NAME}`,
      description: author.bio.substring(0, 155),
      isPartOf: { '@id': `${BASE_URL}/#website` },
      primaryImageOfPage: author.imageUrl ? { '@type': 'ImageObject', url: author.imageUrl } : undefined,
      inLanguage: 'en-US',
    },
  ];

  // Remove undefined values
  graph.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (item[key] === undefined) delete item[key];
    });
  });

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

async function main() {
  const distDir = path.join(projectRoot, 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ dist/index.html not found. Run `vite build` first.');
    process.exit(1);
  }

  const { items: contentItems } = await loadPublishedContent();

  // Collect all unique authors from content
  const authorSet = new Map();
  for (const item of contentItems) {
    const authorName = (item.authorName && item.authorName.trim()) || 'The Grid Nexus Editorial Team';
    const slug = authorSlug(authorName);
    if (!authorSet.has(slug)) authorSet.set(slug, authorName);
  }

  // Also include all authors from the authorProfiles registry
  for (const [slug, profile] of Object.entries(authorProfiles)) {
    if (!authorSet.has(slug)) authorSet.set(slug, profile.name);
  }

  let generated = 0;
  let skipped = 0;

  for (const [authorSlug, authorName] of authorSet) {
    if (authorSlug === 'the-grid-nexus-editorial-team') {
      skipped++;
      continue;
    }

    const profile = authorProfiles[authorSlug] || defaultAuthorProfile;
    const bio = profile.bio || 'Contributor at The Grid Nexus.';
    const seoDescription = bio.substring(0, 155);
    const articlesByAuthor = contentItems
      .filter((item) => {
        const itemAuthorSlug = (item.authorName || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return itemAuthorSlug === authorSlug;
      })
      .slice(0, 12);

        const authorUrl = `${BASE_URL}/author/${authorSlug}`;
    const jsonLd = generateAuthorJsonLd(authorSlug, { ...profile, name: authorName });

    const articlesHtml = articlesByAuthor.length
      ? `
      <h2 style="font-size:1.5rem;font-weight:700;margin:2rem 0 1rem;color:#f8fafc">Articles by ${escapeHtml(authorName)}</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem">
        ${articlesByAuthor.map((item) => {
          const articleUrl = `${BASE_URL}/article/${item.slug}`;
          const img = item.featuredImageUrl || `${BASE_URL}/og-image.jpg`;
          const articleDate = item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '';
          return `
          <article style="background:rgba(30,41,59,0.5);border-radius:8px;padding:1.25rem;border:1px solid rgba(148,163,184,0.1)">
            <a href="${articleUrl}" style="text-decoration:none">
              <img src="${img}" alt="${escapeAttr(item.title)}" width="320" height="180" style="width:100%;height:180px;object-fit:cover;border-radius:6px;margin-bottom:0.75rem" loading="lazy" />
              <h3 style="font-size:1.05rem;font-weight:600;margin-bottom:0.5rem;color:#f8fafc;line-height:1.4">${escapeHtml(item.title.substring(0, 120))}</h3>
            </a>
            <p style="font-size:0.85rem;color:#94a3b8;margin-bottom:0.75rem">${escapeHtml(item.excerpt ? item.excerpt.substring(0, 120) : '')}</p>
            ${articleDate ? `<time style="font-size:0.8rem;color:#60a5fa">${articleDate}</time>` : ''}
          </article>`;
        }).join('')}
      </div>
      <p style="margin-top:1.5rem"><a href="/topics" style="color:#60a5fa;text-decoration:none">Browse all topics &rarr;</a></p>`
      : `
      <p style="margin-top:2rem;color:#94a3b8">More articles from this author are coming soon.</p>`;

    const socialLinks = profile.sameAs && profile.sameAs.length
      ? `<div style="display:flex;gap:1rem;margin-top:1rem"><p style="color:#94a3b8">Follow:</p> ${profile.sameAs.map((url) => {
          const label = url.includes('twitter') || url.includes('x.com') ? 'Twitter' : url.includes('github') ? 'GitHub' : url.includes('linkedin') ? 'LinkedIn' : url.includes('youtube') ? 'YouTube' : 'Profile';
          return `<a href="${url}" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:none">${label}</a>`;
        }).join(' ')}</div>`
                  : '';

    const expertiseHtml = profile.expertise && profile.expertise.length
      ? `<p style="margin-top:1rem"><strong style="color:#f8fafc">Expertise:</strong> ${profile.expertise.map((e) => `<span style="background:rgba(96,165,250,0.15);border:1px solid rgba(96,165,250,0.3);border-radius:9999px;padding:0.15rem 0.6rem;font-size:0.8rem;color:#60a5fa;margin-right:0.4rem">${escapeHtml(e)}</span>`).join('')}</p>`
      : '';

    const authorNameEsc = escapeHtml(authorName);
    const profileJobTitleEsc = escapeHtml(profile.jobTitle || '');
    const seoDescriptionEsc = escapeAttr(seoDescription || '');
    const bioEsc = escapeHtml(bio);
    const jsonLdEsc = escapeHtml(jsonLd);

    const html = `<!doctype html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${authorNameEsc}${profile.jobTitle ? ` - ${profileJobTitleEsc}` : ''} | ${SITE_NAME}</title>
    <meta name="description" content="${seoDescriptionEsc}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${authorUrl}" />
    <meta property="og:type" content="profile" />
    <meta property="og:url" content="${authorUrl}" />
    <meta property="og:title" content="${authorNameEsc} | ${SITE_NAME}" />
    <meta property="og:description" content="${seoDescriptionEsc}" />
    ${profile.imageUrl ? `<meta property="og:image" content="${profile.imageUrl}" />` : ''}
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${authorNameEsc} | ${SITE_NAME}" />
    <meta name="twitter:description" content="${seoDescriptionEsc}" />
    ${profile.imageUrl ? `<meta name="twitter:image" content="${profile.imageUrl}" />` : ''}
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <script type="application/ld+json">
${jsonLd}
    </script>
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
        <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#94a3b8;margin-bottom:1.5rem">
            <a href="/" style="color:#60a5fa;text-decoration:none">Home</a> &rsaquo;
            <a href="/authors" style="color:#60a5fa;text-decoration:none">Authors</a> &rsaquo;
            <span>${authorNameEsc}</span>
          </nav>
          <div style="display:flex;align-items:flex-start;gap:2rem;flex-wrap:wrap">
            ${profile.imageUrl ? `<img src="${profile.imageUrl}" alt="${escapeAttr(authorName)}" width="120" height="120" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:2px solid rgba(96,165,250,0.3)" loading="eager" />` : ''}
            <div>
              <h1 style="font-size:2.5rem;line-height:1.2;margin-bottom:0.5rem;color:#f8fafc">${authorNameEsc}</h1>
              ${profile.jobTitle ? `<p style="font-size:1.1rem;color:#60a5fa;margin-bottom:1rem">${profileJobTitleEsc}</p>` : ''}
              ${articlesByAuthor.length ? `<p style="color:#94a3b8">${articlesByAuthor.length} published ${articlesByAuthor.length === 1 ? 'article' : 'articles'}</p>` : ''}
              ${socialLinks}
            </div>
          </div>
          <section style="margin-top:2rem">
            <h2 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem;color:#f8fafc">About ${authorNameEsc}</h2>
            <p style="color:#cbd5e1;line-height:1.7;font-size:1.0625rem">${bioEsc}</p>
            ${expertiseHtml}
          </section>
          ${articlesHtml}
        </main>
        <footer style="border-top:1px solid rgba(148,163,184,0.2);padding:1.5rem;text-align:center;color:#64748b;font-size:0.875rem">
          <p>&copy; 2026 ${SITE_NAME}. All rights reserved. <a href="/privacy" style="color:#60a5fa">Privacy</a> &middot; <a href="/terms" style="color:#60a5fa">Terms</a> &middot; <a href="/sitemap.xml" style="color:#64748b">Sitemap</a></p>
        </footer>
      </div>
    </div>
  </body>
</html>`;

    const outDir = path.join(distDir, 'author', authorSlug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
    generated++;
  }

  console.log(`\n Generated ${generated} author profile pages (${skipped} skipped as generic)`);
}

main().catch((err) => {
  console.error(' Error generating author pages:', err);
  process.exit(1);
});