#!/usr/bin/env node
/**
 * Static Route Shell Generator — The Grid Nexus
 *
 * ROOT-CAUSE FIX for the September 2026 de-indexation.
 *
 * Production serves `dist/` from nginx, and the Dockerfile builds with
 * `PRERENDER=0` (vite-plugin-prerender needs Chromium, which the image never
 * downloads). As a result only `dist/article/<slug>/index.html` existed, and
 * nginx's `try_files $uri /index.html` fallback served a byte-identical
 * homepage shell for /tech, /ai-pulse, /about, /tools/*, /author/* and every
 * other content route — `<link rel="canonical" href="https://thegridnexus.com/">`
 * included. Google collapsed the whole domain into one URL, which is exactly
 * what Search Console shows: ~1 impression each on "pages" that sit at
 * positions 2-10.
 *
 * This script emits `dist/<route>/index.html` for every route in
 * scripts/lib/route-metadata.mjs, each with its own:
 *   - <title> and <meta name="description">   (CTR + relevance)
 *   - rel=canonical pointing at ITSELF         (no more homepage canonical)
 *   - `index, follow` or `noindex, follow`     (explicit indexability)
 *   - <h1>, breadcrumbs and unique intro copy  (unique, crawlable content)
 *   - contextual internal links + JSON-LD      (orphan rescue + rich results)
 *
 * It also writes `dist/404.html` so nginx can return a real 404 instead of a
 * soft-404 "200 + homepage shell".
 *
 * Run AFTER `vite build` (it needs dist/index.html as the SPA template):
 *   node scripts/generate-static-route-shells.mjs
 *
 * The SPA bundle survives: every generated file is the built index.html with
 * only the <head> metadata and the `#static-shell` <main> replaced, so React
 * still hydrates and interactive routes keep working.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ROUTE_METADATA,
  NON_INDEXABLE_ROUTES,
  SITE_NAME,
  BASE_URL,
  fitDescription,
} from './lib/route-metadata.mjs';
import { loadPublishedContent } from './lib/content-source.mjs';
import { authorProfiles } from './lib/author-source.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const indexPath = path.join(distDir, 'index.html');

const INDEX_DIRECTIVE =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX_DIRECTIVE = 'noindex, follow';

/** Routes that also get a "latest coverage" block (fresh internal links). */
const LATEST_HOSTS = new Set([
  '/', '/news', '/live-updates', '/explore', '/tech', '/security', '/gaming', '/ai-pulse',
]);

// ── Escaping helpers (mirror scripts/generate-static-articles.mjs) ──────────
function escapeHtml(str) {
  if (!str) return '';
  const amp = String.fromCharCode(38);
  return String(str)
    .replace(/&/g, amp + 'amp;')
    .replace(/</g, amp + 'lt;')
    .replace(/>/g, amp + 'gt;')
    .replace(/"/g, amp + 'quot;')
    .replace(/'/g, '#39;');
}

function escapeAttr(str) {
  return escapeHtml(str);
}

/** Absolute canonical URL for a route path. */
function canonicalFor(routePath) {
  return routePath === '/' ? `${BASE_URL}/` : `${BASE_URL}${routePath}`;
}

/**
 * Replace the first match of `pattern` exactly once and fail loudly when the
 * template no longer contains it — silent no-ops are how a homepage canonical
 * ended up shipping on sixty URLs in the first place.
 */
function replaceOnce(html, pattern, replacement, label) {
  const match = html.match(pattern);
  if (!match) {
    throw new Error(
      `[route-shells] template marker "${label}" not found in dist/index.html. ` +
        'The index.html <head> changed — update the pattern in scripts/generate-static-route-shells.mjs.'
    );
  }
  return html.replace(pattern, () => replacement);
}

/** Build the JSON-LD @graph for a non-article route. */
function buildRouteJsonLd(route, canonical) {
  const isHome = route.path === '/';
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: SITE_NAME,
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png`, width: 512, height: 512 },
      sameAs: [
        'https://twitter.com/thegridnexus',
        'https://facebook.com/thegridnexus',
        'https://linkedin.com/company/thegridnexus',
      ],
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
      '@type': isHome ? 'CollectionPage' : 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: route.title,
      description: route.description,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      inLanguage: 'en-US',
    },
  ];

  if (!isHome) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: route.h1, item: canonical },
      ],
    });
  }

  return `
    <script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}
    </script>`;
}

/** Route-specific crawlable <main> content, replacing the shared shell body. */
function buildMain(route, latestArticles) {
  const isHome = route.path === '/';
  const links = route.links ?? [];

  const breadcrumb = isHome
    ? ''
    : `
      <nav aria-label="Breadcrumb" style="font-size:0.875rem;color:#94a3b8;margin-bottom:1rem">
        <a href="/" style="color:#60a5fa;text-decoration:none">Home</a> &rsaquo;
        <span>${escapeHtml(route.h1)}</span>
      </nav>`;

  const linksBlock = links.length
    ? `
      <section aria-labelledby="related-sections" style="margin-top:2rem">
        <h2 id="related-sections" style="font-size:1.25rem;color:#f8fafc;margin-bottom:0.75rem">Where to go next</h2>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:0.75rem">
          ${links
            .map(
              (l) =>
                `<li><a href="${escapeAttr(l.href)}" style="color:#60a5fa;text-decoration:none">${escapeHtml(l.label)}</a></li>`
            )
            .join('\n          ')}
        </ul>
      </section>`
    : '';

  const latestBlock =
    LATEST_HOSTS.has(route.path) && latestArticles.length
      ? `
      <section aria-labelledby="latest-coverage" style="margin-top:2rem">
        <h2 id="latest-coverage" style="font-size:1.25rem;color:#f8fafc;margin-bottom:0.75rem">Latest coverage</h2>
        <ul style="list-style:none;padding:0;margin:0">
          ${latestArticles
            .map(
              (a) =>
                `<li style="margin-bottom:0.5rem"><a href="/article/${encodeURIComponent(a.slug)}" style="color:#60a5fa;text-decoration:none">${escapeHtml(a.title)}</a>${
                  a.publishedAt
                    ? ` <span style="color:#64748b;font-size:0.8rem">${escapeHtml(a.publishedAt)}</span>`
                    : ''
                }</li>`
            )
            .join('\n          ')}
        </ul>
      </section>`
      : '';

  return `<main id="main-content" style="max-width:80rem;margin:0 auto;padding:2rem 1.5rem">${breadcrumb}
    <h1 style="font-size:2rem;line-height:1.2;margin-bottom:0.75rem;color:#f8fafc">${escapeHtml(route.h1)}</h1>
    <p style="font-size:1.125rem;color:#94a3b8;margin-bottom:1.5rem;max-width:60rem">${escapeHtml(route.intro)}</p>${linksBlock}${latestBlock}
  </main>`;
}

/** A noindex page for private/auth/dev routes — never the homepage shell. */
function buildUtilityMain(routePath) {
  const label = routePath.replace(/^\//, '').replace(/[-/]/g, ' ').trim() || 'page';
  return `<main id="main-content" style="max-width:48rem;margin:0 auto;padding:3rem 1.5rem">
    <h1 style="font-size:1.75rem;color:#f8fafc;margin-bottom:1rem">${escapeHtml(label)}</h1>
    <p style="color:#94a3b8;margin-bottom:1.5rem">This page is part of the signed-in Grid Nexus experience and is deliberately excluded from search results.</p>
  </main>`;
}

/**
 * Replace `ownPattern` if the tag exists, otherwise insert `replacement`
 * immediately after `anchorPattern`. Used for og:/twitter: description tags
 * that the previous hand-written shell only added at runtime via JavaScript.
 */
function replaceOrInsert(html, ownPattern, anchorPattern, replacement, label) {
  if (ownPattern.test(html)) return html.replace(ownPattern, () => replacement);
  const anchor = html.match(anchorPattern);
  if (!anchor) {
    throw new Error(`[route-shells] anchor marker "${label}" not found in dist/index.html`);
  }
  return html.replace(anchorPattern, () => `${anchor[0]}\n    ${replacement}`);
}

/** Rewrite <head> metadata + <main> for one route. */
function buildPage(template, { path: routePath, title, description, h1, canonical, directive, jsonLd, mainHtml }) {
  let html = template;

  // Defensive: strip the legacy runtime meta-injection script. It rewrote
  // title/description/canonical after DOMContentLoaded and fell back to the
  // HOMEPAGE for any route missing from its map — the exact behaviour that
  // gave every page a homepage canonical once Google rendered the page.
  html = html.replace(
    /\s*<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/,
    ''
  );

  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`, 'title');
  html = replaceOnce(
    html,
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    'meta description'
  );
  html = replaceOnce(
    html,
    /<meta name="robots" content="[^"]*"\s*\/>/,
    `<meta name="robots" content="${escapeAttr(directive)}" />`,
    'meta robots'
  );
  html = replaceOnce(
    html,
    /<meta name="googlebot" content="[^"]*"\s*\/>/,
    `<meta name="googlebot" content="${escapeAttr(directive)}" />`,
    'meta googlebot'
  );
  html = replaceOnce(
    html,
    /<meta name="bingbot" content="[^"]*"\s*\/>/,
    `<meta name="bingbot" content="${escapeAttr(directive)}" />`,
    'meta bingbot'
  );
  html = replaceOnce(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    'canonical'
  );
  html = replaceOnce(
    html,
    /<meta property="og:url" content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    'og:url'
  );
  html = replaceOnce(
    html,
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    'og:title'
  );
  html = replaceOrInsert(
    html,
    /<meta property="og:description" content="[^"]*"\s*\/>/,
    /<meta property="og:title" content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    'og:title'
  );
  html = replaceOrInsert(
    html,
    /<meta property="og:image:alt" content="[^"]*"\s*\/>/,
    /<meta property="og:image" content="[^"]*"\s*\/>/,
    `<meta property="og:image:alt" content="${escapeAttr(title)}" />`,
    'og:image'
  );
  html = replaceOnce(
    html,
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    'twitter:title'
  );
  html = replaceOrInsert(
    html,
    /<meta name="twitter:description" content="[^"]*"\s*\/>/,
    /<meta name="twitter:title" content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    'twitter:title'
  );

  // Consolidate structured data: drop the static site-wide block, then write the
  // route-specific @graph (Organization + WebSite + WebPage/CollectionPage + BreadcrumbList).
  html = replaceOnce(
    html,
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    jsonLd.trim(),
    'static JSON-LD'
  );

  // Replace the shared static shell <main> with route-specific content.
  html = replaceOnce(
    html,
    /<main id="main-content"[\s\S]*?<\/main>/,
    mainHtml,
    'static shell <main>'
  );

  return html;
}

/** Trim a description to the SERP window at a word boundary, then pad it. */
function clampDescription(text) {
  let out = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (out.length > 158) {
    out = out.slice(0, 157);
    const cut = out.lastIndexOf(' ');
    if (cut > 100) out = out.slice(0, cut);
    out = out.replace(/[.,;:\s]+$/, '') + '.';
  }
  return fitDescription(out);
}

/** Turn '/subscription/management' into 'Subscription management'. */
function humanise(routePath) {
  const label = routePath.replace(/^\//, '').replace(/[-/]+/g, ' ').trim();
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : 'The Grid Nexus';
}

/** `dist/<route>/index.html` (or `dist/index.html` for the homepage). */
function writeRoute(routePath, html) {
  if (routePath === '/') {
    fs.writeFileSync(indexPath, html, 'utf8');
    return;
  }
  const dir = path.join(distDir, ...routePath.split('/').filter(Boolean));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

/**
 * Author profile routes from src/data/authorData.ts.
 *
 * These are already listed in sitemap.xml, but before this script they had no
 * HTML of their own and fell through to the homepage shell — the classic
 * "orphan + duplicate" combination.
 */
function buildAuthorRoutes() {
  return Object.entries(authorProfiles)
    .filter(([slug]) => slug && slug !== 'the-grid-nexus-editorial-team')
    .map(([slug, profile]) => {
      const name = String(profile?.name ?? humanise(slug));
      const jobTitle = String(profile?.jobTitle ?? 'Contributor');
      const bio = String(profile?.bio ?? '').replace(/\s+/g, ' ').trim();
      const suffix = ` | ${SITE_NAME}`;
      const fullTitle = `${name} — ${jobTitle}${suffix}`;
      const title = fullTitle.length <= 60 ? fullTitle : `${name}${suffix}`;

      return {
        path: `/author/${slug}`,
        title,
        description: clampDescription(
          `${bio || `${name} writes technology, security and gaming analysis for The Grid Nexus.`} ` +
            `Articles, guides and threat analysis by ${name}.`
        ),
        h1: name,
        intro:
          `${name} writes for The Grid Nexus as ${jobTitle.toLowerCase()}. ` +
          `${bio || 'Their work covers technology, cybersecurity and gaming with sources attached and dates kept current.'} ` +
          `Follow this page for every article, guide and analysis piece published under this byline, including corrections and updates after publication.`,
        links: [
          { href: '/about', label: 'About The Grid Nexus' },
          { href: '/editorial', label: 'Editorial policy' },
          { href: '/news', label: 'Latest news' },
        ],
      };
    });
}

async function main() {
  if (!fs.existsSync(indexPath)) {
    throw new Error('dist/index.html not found — run `vite build` first.');
  }

  const template = fs.readFileSync(indexPath, 'utf8');
  const { items: articles, source } = await loadPublishedContent();
  console.log(`📄 Content source: ${source} (${articles.length} published articles)`);

  const latestArticles = articles
    .filter((a) => a.slug && a.title && a.noindex !== true)
    .sort((a, b) => String(b.publishedAt ?? '').localeCompare(String(a.publishedAt ?? '')))
    .slice(0, 8);

  const groups = [
    { label: 'indexable content routes', routes: ROUTE_METADATA, directive: INDEX_DIRECTIVE },
    { label: 'author profile routes', routes: buildAuthorRoutes(), directive: INDEX_DIRECTIVE },
    {
      label: 'private / non-indexable routes',
      routes: NON_INDEXABLE_ROUTES.map((routePath) => ({
        path: routePath,
        title: `${humanise(routePath)} | ${SITE_NAME}`,
        description: `${humanise(routePath)} on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.`,
        h1: humanise(routePath),
        intro: '',
        links: [],
      })),
      directive: NOINDEX_DIRECTIVE,
    },
  ];

  let written = 0;
  let canonicalMismatches = 0;

  for (const group of groups) {
    for (const route of group.routes) {
      const canonical = canonicalFor(route.path);
      const html = buildPage(template, {
        path: route.path,
        title: route.title,
        description: route.description,
        h1: route.h1,
        canonical,
        directive: group.directive,
        jsonLd: buildRouteJsonLd(route, canonical),
        mainHtml: route.intro ? buildMain(route, latestArticles) : buildUtilityMain(route.path),
      });

      // Sanity check: every emitted file must self-canonicalise. A homepage
      // canonical leaking back in is the exact failure this script exists for.
      if (!html.includes(`<link rel="canonical" href="${canonical}" />`)) {
        canonicalMismatches += 1;
        console.error(`   ✖ ${route.path}: canonical is not self-referencing`);
        continue;
      }

      writeRoute(route.path, html);
      written += 1;
    }
    console.log(`[OK] ${group.label}: ${group.routes.length} routes`);
  }

  // ── 404 page (nginx emits the real 404 status for this file) ────────────
  const notFoundRoute = {
    path: '/404',
    title: `Page not found (404) | ${SITE_NAME}`,
    description:
      'That URL does not exist on The Grid Nexus. Use the links here to reach our technology, cybersecurity and gaming coverage, or search the archive.',
    h1: 'Page not found',
    intro: '',
    links: [],
  };
  const notFoundHtml = buildPage(template, {
    path: '/404',
    title: notFoundRoute.title,
    description: notFoundRoute.description,
    h1: notFoundRoute.h1,
    canonical: `${BASE_URL}/404`,
    directive: `${NOINDEX_DIRECTIVE}, noarchive`,
    jsonLd: buildRouteJsonLd(notFoundRoute, `${BASE_URL}/404`),
    mainHtml: `<main id="main-content" style="max-width:48rem;margin:0 auto;padding:3rem 1.5rem">
    <h1 style="font-size:2rem;color:#f8fafc;margin-bottom:1rem">Page not found</h1>
    <p style="color:#94a3b8;margin-bottom:1.5rem">The page you asked for is not here. It may have moved, or the link that brought you here may be wrong.</p>
    <ul style="list-style:none;padding:0;margin:0 0 1.5rem 0">
      <li style="margin-bottom:0.5rem"><a href="/tech" style="color:#60a5fa">Technology news and analysis</a></li>
      <li style="margin-bottom:0.5rem"><a href="/security" style="color:#60a5fa">Cybersecurity and threat intelligence</a></li>
      <li style="margin-bottom:0.5rem"><a href="/gaming" style="color:#60a5fa">Gaming news, reviews and releases</a></li>
      <li style="margin-bottom:0.5rem"><a href="/tools" style="color:#60a5fa">Free security tools</a></li>
      <li style="margin-bottom:0.5rem"><a href="/explore" style="color:#60a5fa">Explore the full archive</a></li>
    </ul>
    <p><a href="/" style="color:#60a5fa">Back to the homepage</a></p>
  </main>`,
  });
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');
  console.log('[OK] 404 page → dist/404.html');

  console.log(`\n✅ Emitted ${written} route shells (${canonicalMismatches} canonical mismatch(es)).`);
  console.log('   nginx serves them via `try_files $uri $uri/index.html` — see nginx.conf.');

  if (canonicalMismatches > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  // Hard failure on purpose: a missing route-shell set is what de-indexed the
  // site, so this must break the build instead of passing silently.
  console.error('❌ generate-static-route-shells failed:', error);
  process.exit(1);
});
