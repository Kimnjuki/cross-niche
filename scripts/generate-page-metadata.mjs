#!/usr/bin/env node
/**
 * SPA page-metadata generator — The Grid Nexus
 *
 * WHY THIS EXISTS
 * ---------------
 * `src/lib/seo/pageMetadata.ts` is the runtime metadata map consumed by
 * `getPageMetadata()` and, through it, by `SEOHead` on ~15 pages. It had drifted
 * badly from `scripts/lib/route-metadata.mjs` (the registry that writes the
 * static route shells):
 *
 *   - 21 registry routes were missing entirely (all /tools/*, /pillar/*,
 *     /research/state-of-gaming-security-2026, /comparisons, /gaming/security,
 *     /videos, /newsletter, /methodology), so hydration fell back to the
 *     generic `{ title: SITE_NAME, description: 'Tech, Security & Gaming
 *     Intelligence…' }` and overwrote the correct static title/description.
 *   - 38 of the 38 shared routes carried a DIFFERENT title, description and H1
 *     from the registry, so the hydrated SPA rewrote every one of them.
 *   - 12 descriptions fell outside the 140-158 SERP window.
 *
 * The result was exactly the failure mode the static shells were built to
 * prevent: the served HTML was right, and the page the user (and Google, when
 * it renders) actually saw was wrong.
 *
 * WHAT IT DOES
 * ------------
 * Regenerates `src/lib/seo/pageMetadata.ts` from the registry so the two can
 * never drift again. The public API is preserved exactly:
 *
 *   export const SITE_NAME
 *   export const PAGE_METADATA: Record<string, PageMeta>
 *   export function getArticleTitle(headline: string): string
 *   export function getPageMetadata(pathname, article?): PageMeta
 *
 * Routes that exist only in the SPA (article-specific overrides and the
 * non-indexable utility pages) are carried in `SPA_ONLY_METADATA` below and
 * merged on top of the registry output, so hand-written copy is not lost.
 *
 * Run: node scripts/generate-page-metadata.mjs
 * Checked by: scripts/page-metadata.test.mjs (npm run test:seo)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ROUTE_METADATA,
  NON_INDEXABLE_ROUTES,
  NON_INDEXABLE_METADATA,
  SITE_NAME,
} from './lib/route-metadata.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const targetPath = path.join(projectRoot, 'src/lib/seo/pageMetadata.ts');

/**
 * Routes that live only in the SPA and have no registry entry.
 *
 * These are either per-article overrides (the registry deliberately does not
 * carry article metadata — that comes from Convex) or non-indexable utility
 * pages whose copy is already defined in NON_INDEXABLE_METADATA.
 */
const SPA_ONLY_METADATA = {
  '/article/gaming-pc-antivirus-best-2026': {
    title: 'Best Antivirus for Gaming PC 2026 | Complete Guide',
    description:
      'We tested Norton, McAfee, Bitdefender and Kaspersky on gaming PCs for FPS impact and security. Here is the best antivirus for gaming in 2026.',
    h1: 'Best Antivirus for Gaming PC 2026',
  },
  '/article/minecraft-server-security-guide': {
    title: 'Minecraft Server Security Guide 2026 | Protect Your Server',
    description:
      'Learn how to secure your Minecraft server against DDoS attacks, exploits, and unauthorized access. Essential security guide for server administrators.',
    h1: 'Minecraft Server Security Guide 2026',
  },
  '/article/gaming-pc-security-hardening-guide': {
    title: 'Gaming PC Security Hardening Guide 2026 | Step-by-Step',
    description:
      'Complete step-by-step guide to hardening your gaming PC for maximum security. Includes firewall configuration, encryption, and malware prevention tips.',
    h1: 'Gaming PC Security Hardening Guide 2026',
  },
  '/article/steam-account-security-guide': {
    title: 'Steam Account Security Guide 2026 | Protect Your Games',
    description:
      'Protect your Steam account from hackers, phishing, and scams. Complete security guide with 2FA setup, password best practices, and recovery options.',
    h1: 'Steam Account Security Guide 2026',
  },
  '/article/2fa-setup-gaming-accounts': {
    title: '2FA Setup for Gaming Accounts 2026 | Complete Guide',
    description:
      'Enable two-factor authentication for all your gaming accounts. Step-by-step guides for Steam, Epic, PlayStation, Xbox, and Nintendo accounts.',
    h1: '2FA Setup for Gaming Accounts 2026',
  },
};

/** Escape a string for embedding inside a single-quoted TS literal. */
function tsString(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

/** Escape a string for embedding inside a double-quoted TS literal. */
function tsDoubleQuoted(value) {
  return String(value ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/** Group label used for the section comment above a block of routes. */
function sectionFor(routePath) {
  if (routePath === '/') return 'Homepage';
  if (routePath.startsWith('/tools/')) return 'Tools';
  if (routePath.startsWith('/pillar/')) return 'Pillar pages';
  if (routePath.startsWith('/research/')) return 'Research & reports';
  if (routePath.startsWith('/learn/') || routePath.startsWith('/pulse/')) return 'AI modules & learning';
  if (routePath.startsWith('/gaming/')) return 'Gaming security';
  if (
    ['/about', '/contact', '/privacy', '/terms', '/editorial', '/media', '/disclosure',
     '/quality-guidelines', '/content-policy', '/community-guidelines', '/methodology'].includes(routePath)
  ) {
    return 'Company / legal';
  }
  if (NON_INDEXABLE_ROUTES.includes(routePath)) return 'Non-indexable utility pages';
  return 'Section hubs & platform';
}

/** `// ── <label> ───…` padded to a fixed 78-column width. */
function sectionComment(label) {
  const prefix = `  // ── ${label} `;
  const fill = Math.max(3, 78 - prefix.length);
  return `${prefix}${'─'.repeat(fill)}`;
}

/** Emit one `'/path': { … },` entry. */
function emitEntry(routePath, meta, indent = '  ') {
  const lines = [];
  lines.push(`${indent}'${tsString(routePath)}': {`);
  lines.push(`${indent}  title: '${tsString(meta.title)}',`);
  lines.push(`${indent}  description: '${tsString(meta.description)}',`);
  if (meta.h1) lines.push(`${indent}  h1: '${tsString(meta.h1)}',`);
  lines.push(`${indent}},`);
  return lines.join('\n');
}

function build() {
  // Registry routes first, in registry order, grouped by section.
  const registryEntries = [];
  let lastSection = null;
  for (const route of ROUTE_METADATA) {
    const section = sectionFor(route.path);
    if (section !== lastSection) {
      registryEntries.push(`\n${sectionComment(section)}`);
      lastSection = section;
    }
    registryEntries.push(
      emitEntry(route.path, {
        title: route.title,
        description: route.description,
        h1: route.h1,
      })
    );
  }

  // Non-indexable routes that are not already in ROUTE_METADATA.
  const registryPaths = new Set(ROUTE_METADATA.map((r) => r.path));
  const extraNonIndexable = [];
  let extraSection = null;
  for (const routePath of NON_INDEXABLE_ROUTES) {
    if (registryPaths.has(routePath)) continue;
    const section = sectionFor(routePath);
    if (section !== extraSection) {
      extraNonIndexable.push(`\n${sectionComment(section)}`);
      extraSection = section;
    }
    const meta = NON_INDEXABLE_METADATA[routePath];
    if (meta) {
      extraNonIndexable.push(emitEntry(routePath, meta));
    } else {
      // Humanised fallback, matching generate-static-route-shells.mjs.
      const label = routePath.replace(/^\//, '').replace(/[-/]/g, ' ').trim() || 'page';
      const humanised = label.charAt(0).toUpperCase() + label.slice(1);
      extraNonIndexable.push(
        emitEntry(routePath, {
          title: `${humanised} | ${SITE_NAME}`,
          description: `${humanised} on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.`,
          h1: humanised,
        })
      );
    }
  }

  // SPA-only entries (article overrides).
  const spaOnly = Object.entries(SPA_ONLY_METADATA).map(([routePath, meta]) =>
    emitEntry(routePath, meta)
  );

  const body = [
    ...registryEntries,
    ...extraNonIndexable,
    `\n${sectionComment('Article-specific metadata')}`,
    ...spaOnly,
  ].join('\n');

  return `/**
 * Centralised SEO metadata for every routed page.
 *
 * ⚠️ GENERATED FILE — do not edit by hand.
 *
 * Regenerate with:  node scripts/generate-page-metadata.mjs
 * Source of truth:  scripts/lib/route-metadata.mjs
 *
 * Why it is generated
 * -------------------
 * This map is read at runtime by \`getPageMetadata()\`, which \`SEOHead\` uses to
 * write <title>/<meta name="description"> after hydration. It used to be
 * hand-maintained and drifted from the registry that writes the static route
 * shells: 21 registry routes were missing and all 38 shared routes carried a
 * different title, description and H1. Hydration therefore overwrote correct
 * static metadata with stale copy, and unmapped routes fell back to the generic
 * homepage description. Generating it from the registry makes that impossible.
 *
 * Rules enforced by scripts/route-shells.test.mjs and
 * scripts/page-metadata.test.mjs:
 *  - title:       40-60 chars, unique
 *  - description: 140-158 chars, unique
 *  - h1:          unique per route and never a copy of the <title> tag
 */

export const SITE_NAME = '${tsString(SITE_NAME)}';

interface PageMeta {
  /** <title> tag — 40-60 chars */
  title: string;
  /** meta description — 140-158 chars */
  description: string;
  /** Visible H1 on the page — different from the title tag */
  h1?: string;
}

export const PAGE_METADATA: Record<string, PageMeta> = {${body}
};

/** Article <title> tag: "[Headline] | The Grid Nexus" */
export function getArticleTitle(headline: string): string {
  const clean = (headline || 'Article').trim();
  const full  = \`\${clean} | \${SITE_NAME}\`;
  return full.length > 60 ? full.substring(0, 57) + '…' : full;
}

/** Resolve metadata for a given pathname. */
export function getPageMetadata(
  pathname: string,
  article?: { title?: string; excerpt?: string }
): PageMeta {
  const base = pathname.replace(/\\/$/, '') || '/';

  // Article detail pages
  if (article && base.startsWith('/article/')) {
    const rawDesc = (article.excerpt || '').slice(0, 155);
    return {
      title:       getArticleTitle(article.title || ''),
      description: rawDesc || \`Read \${article.title || 'this article'} on \${SITE_NAME}.\`,
      h1:          article.title || 'Article',
    };
  }

  return (
    PAGE_METADATA[base] ?? {
      title:       SITE_NAME,
      description: '${tsDoubleQuoted('Tech, Security & Gaming Intelligence from The Grid Nexus.')}',
      h1:          SITE_NAME,
    }
  );
}
`;
}

const output = build();
fs.writeFileSync(targetPath, output, 'utf8');

const routeCount = (output.match(/^\s{2}'\/[^']*': \{$/gm) || []).length;
console.log(`[OK] wrote src/lib/seo/pageMetadata.ts (${routeCount} routes)`);
console.log('     source: scripts/lib/route-metadata.mjs');