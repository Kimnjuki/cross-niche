#!/usr/bin/env node
/**
 * SEO Raw-HTML Crawl Audit — The Grid Nexus
 *
 * P0-T1 of the SEO/growth remediation plan, adapted from the plan's Next.js
 * wording to this repo's ACTUAL stack: Vite + React SPA served by nginx with a
 * hand-rendered `#static-shell` prerender — NOT Next.js App Router.
 *
 * Fetches every representative route with a PLAIN HTTP GET — no browser, no JS
 * execution, no Puppeteer/Playwright — and asserts what a non-JS crawler sees:
 *
 *   1. HTTP 2xx
 *   2. a non-empty <h1>
 *   3. a <link rel="canonical"> that is absolute
 *   4. a <meta name="description"> between 50 and 160 characters
 *   5. at least one <script type="application/ld+json"> that parses as JSON
 *   6. absence of the "Loading full experience" placeholder
 *   7. absence of "JavaScript is required" OUTSIDE <noscript> (inside
 *      <noscript> is legitimate progressive enhancement, not a failure)
 *   8. primary-content word count (catches server-rendered article bodies that
 *      are truncated — plan finding V-06)
 *
 * Writes a markdown report to reports/raw-html-audit.md
 *
 * Usage:
 *   npx tsx scripts/seo-raw-html-audit.ts
 *   BASE_URL=https://www.thegridnexus.com npx tsx scripts/seo-raw-html-audit.ts
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = (process.env.BASE_URL || 'https://www.thegridnexus.com').replace(/\/+$/, '');
const REPORT_PATH = path.resolve(process.cwd(), 'reports', 'raw-html-audit.md');
const TIMEOUT_MS = 25_000;

/**
 * Representative routes, one or more per template.
 *
 * The last two article routes are deliberately chosen because they exist in
 * Convex but NOT in src/data/mockData.ts — they are the empirical probe for
 * plan finding V-03 (published articles missing from the crawlable surface).
 */
type RouteSpec = { path: string; template: string; note?: string };

const ROUTES: RouteSpec[] = [
  { path: '/', template: 'homepage' },
  { path: '/tech', template: 'category' },
  { path: '/security', template: 'category' },
  { path: '/gaming', template: 'category' },
  { path: '/news', template: 'category' },
  { path: '/explore', template: 'category' },
  { path: '/topics', template: 'hub-list' },
  { path: '/guides', template: 'hub-list' },
  { path: '/tools', template: 'hub-list' },
  { path: '/about', template: 'static' },
  { path: '/privacy', template: 'static' },
  { path: '/terms', template: 'static' },
  { path: '/roadmap', template: 'static' },
  { path: '/security-profile', template: 'app' },
  { path: '/community-threats', template: 'app' },
  { path: '/security-score', template: 'tool' },
  { path: '/breach-sim', template: 'tool' },
  { path: '/live-threat-dashboard', template: 'tool' },
  { path: '/ai-pulse', template: 'feed' },
  { path: '/pillar/gaming-security', template: 'pillar' },
  { path: '/research/state-of-gaming-security-2026', template: 'research' },
  { path: '/article/gaming-pc-security-hardening-guide-2026', template: 'article', note: 'present in mockData' },
  { path: '/article/ai-security-threats-2026', template: 'article', note: 'present in mockData' },
  {
    path: '/article/ultimate-guide-steam-xbox-playstation-discord-security',
    template: 'article',
    note: 'Convex-only (NOT in mockData) — V-03 probe',
  },
  {
    path: '/article/gaming-security-in-2026-how-to-actually-keep-your-accounts-safe',
    template: 'article',
    note: 'Convex-only (NOT in mockData) — V-03 probe',
  },
];

const DESC_MIN = 50;
const DESC_MAX = 160;
const MIN_WORDS_BY_TEMPLATE: Record<string, number> = {
  article: 300,
  homepage: 150,
  pillar: 150,
  research: 150,
};


// ── HTML helpers (regex-based on purpose: zero dependencies, mirrors what a
//    simple crawler/parser sees) ─────────────────────────────────────────────

function stripBlocks(html: string, tags: string[]): string {
  let out = html;
  for (const tag of tags) {
    out = out.replace(new RegExp(`<${tag}\\b[^>]*>.*?</${tag}>`, 'gis'), ' ');
  }
  return out;
}

function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstMatch(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1] : null;
}

/** Like firstMatch, but for patterns with no capture group (returns the whole tag). */
function firstTag(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[0] : null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

type Check = { label: string; ok: boolean; detail: string };

/** Homepage H1/title, used as the baseline for the "served the homepage shell"
 *  detection below (nginx `try_files $uri /index.html` returns index.html for
 *  any route that has no generated static file). */
export type Baseline = { h1: string; title: string };

function evaluate(route: RouteSpec, status: number, html: string, baseline?: Baseline): Check[] {
  const checks: Check[] = [];

  checks.push({
    label: 'HTTP 2xx',
    ok: status >= 200 && status < 300,
    detail: `status ${status}`,
  });

  // 2. <h1>
  const h1Raw = firstMatch(html, /<h1\b[^>]*>(.*?)<\/h1>/is);
  const h1 = h1Raw ? decodeEntities(textOf(h1Raw)) : '';
  checks.push({
    label: 'H1',
    ok: h1.length > 0,
    detail: h1 ? `${h1.slice(0, 60)}${h1.length > 60 ? '...' : ''}` : 'MISSING <h1>',
  });

  // 3. canonical
  const canonicalTag = firstTag(html, /<link\b[^>]*rel=["']?canonical["']?[^>]*>/i);
  const canonicalHref = canonicalTag ? firstMatch(canonicalTag, /href=["']([^"']+)["']/i) : null;
  checks.push({
    label: 'canonical',
    ok: !!canonicalHref && /^https?:\/\//i.test(canonicalHref),
    detail: canonicalHref ?? 'MISSING <link rel="canonical">',
  });

  // 4. meta description
  const descTag = firstTag(html, /<meta\b[^>]*name=["']description["'][^>]*>/i);
  const desc = descTag ? (firstMatch(descTag, /content=["']([^"']*)["']/i) ?? '') : '';
  const descLen = decodeEntities(desc).length;
  checks.push({
    label: `description (${DESC_MIN}-${DESC_MAX})`,
    ok: descLen >= DESC_MIN && descLen <= DESC_MAX,
    detail: descLen === 0 ? 'MISSING meta description' : `${descLen} chars`,
  });

  // 5. JSON-LD
  const ldBlocks = [
    ...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gis),
  ];
  const parseErrors: string[] = [];
  const types: string[] = [];
  ldBlocks.forEach((m, i) => {
    try {
      const parsed = JSON.parse(m[1].trim()) as unknown;
      const collect = (node: unknown): void => {
        if (Array.isArray(node)) {
          node.forEach(collect);
        } else if (node && typeof node === 'object') {
          const rec = node as Record<string, unknown>;
          const nodeType = rec['@type'];
          if (typeof nodeType === 'string') types.push(nodeType);
          if (rec['@graph']) collect(rec['@graph']);
        }
      };
      collect(parsed);
    } catch (e) {
      parseErrors.push(`block ${i + 1}: ${(e as Error).message}`);
    }
  });
  checks.push({
    label: 'JSON-LD valid',
    ok: ldBlocks.length > 0 && parseErrors.length === 0,
    detail:
      ldBlocks.length === 0
        ? 'MISSING application/ld+json'
        : parseErrors.length
          ? `invalid: ${parseErrors.join('; ')}`
          : `${ldBlocks.length} block(s): ${types.join(', ') || 'no @type'}`,
  });

  // 6. loading placeholder
  const hasLoadingPlaceholder = /loading full experience/i.test(html);
  checks.push({
    label: 'no "Loading full experience"',
    ok: !hasLoadingPlaceholder,
    detail: hasLoadingPlaceholder ? 'placeholder string present in HTML' : 'absent',
  });

  // 7. JS-required string outside <noscript>
  const withoutNoscript = stripBlocks(html, ['noscript']);
  const jsRequiredOutside = /javascript is required/i.test(withoutNoscript);
  checks.push({
    label: 'no JS-required outside <noscript>',
    ok: !jsRequiredOutside,
    detail: jsRequiredOutside ? 'hard JS dependency leaked into visible DOM' : 'absent',
  });

  // 8. primary content volume
  const visible = textOf(stripBlocks(html, ['script', 'style', 'noscript', 'svg']));
  const words = visible ? visible.split(' ').filter(Boolean).length : 0;
  const minWords = MIN_WORDS_BY_TEMPLATE[route.template];
  checks.push({
    label: minWords ? `content >= ${minWords} words` : 'content volume',
    ok: minWords ? words >= minWords : words > 0,
    detail: `${words} words of body text`,
  });

  // 9. route served its OWN shell, not the nginx homepage fallback
  //    (nginx.conf uses `try_files $uri /index.html`, so any route with no
  //    generated static file silently serves the homepage HTML).
  const title = firstMatch(html, /<title>(.*?)<\/title>/is);
  if (baseline && route.path !== '/') {
    const sameH1 = h1.length > 0 && h1 === baseline.h1;
    checks.push({
      label: 'serves own shell (not homepage)',
      ok: !sameH1,
      detail: sameH1
        ? `SERVED HOMEPAGE SHELL — H1 "${h1.slice(0, 50)}" is identical to / (title: ${title ?? 'n/a'})`
        : `distinct H1 (title: ${(title ?? '').slice(0, 70) || 'n/a'})`,
    });
  }

  return checks;
}
async function fetchRoute(route: RouteSpec): Promise<{ status: number; html: string; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${route.path}`, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'TheGridNexus-SEO-Audit/1.0 (+raw-html; no-JS)' },
    });
    const html = await res.text();
    return { status: res.status, html };
  } catch (e) {
    return { status: 0, html: '', error: (e as Error).message };
  } finally {
    clearTimeout(timer);
  }
}

function mdEscape(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

const CHECK_LABELS = [
  'HTTP 2xx',
  'H1',
  'canonical',
  `description (${DESC_MIN}-${DESC_MAX})`,
  'JSON-LD valid',
  'no "Loading full experience"',
  'no JS-required outside <noscript>',
  'serves own shell (not homepage)',
];

type Row = { route: RouteSpec; status: number; checks: Check[]; error?: string };

function renderReport(rows: Row[]): string {
  const header =
    `# Raw-HTML crawl audit (no JavaScript)\n\n` +
    `- **Target:** ${BASE_URL}\n` +
    `- **Generated:** ${new Date().toISOString()}\n` +
    `- **Method:** plain HTTP GET via \`fetch\`; no browser, no JS execution\n` +
    `- **Script:** \`npx tsx scripts/seo-raw-html-audit.ts\`\n\n` +
    `This is the P0-T1 deliverable, re-specified for this repo's real stack\n` +
    `(Vite + React SPA + nginx-served \`#static-shell\`, not Next.js App Router).\n\n` +
    `| Route | Template | ${CHECK_LABELS.join(' | ')} | Content | Notes |\n` +
    `| --- | --- | ${CHECK_LABELS.map(() => '---').join(' | ')} | --- | --- |\n`;

  const body = rows
    .map(({ route, checks, error }) => {
      const byLabel = new Map(checks.map((c) => [c.label, c]));
      const cells = CHECK_LABELS.map((label) => {
        if (error) return 'n-a';
        const c = byLabel.get(label);
        return c ? (c.ok ? 'PASS' : '**FAIL**') : 'n-a';
      });
      const contentCheck = checks.find((c) => c.label.startsWith('content'));
      const failing = checks.filter((c) => !c.ok);
      const notes = error
        ? `ERROR: ${error}`
        : failing.length
          ? failing.map((c) => `**${c.label}** -> ${c.detail}`).join('; ')
          : (route.note ?? 'all checks passed');
      return `| \`${mdEscape(route.path)}\` | ${route.template} | ${cells.join(' | ')} | ${mdEscape(
        contentCheck?.detail ?? 'n/a',
      )} | ${mdEscape(notes)} |`;
    })
    .join('\n');

  const detail = rows
    .map(({ route, checks, error }) => {
      const lines = checks.map((c) => `- ${c.ok ? 'PASS' : 'FAIL'} **${c.label}**: ${c.detail}`);
      return `### \`${route.path}\` (${route.template})\n\n${
        error ? `- FAIL fetch error: ${error}\n` : ''
      }${lines.join('\n')}\n`;
    })
    .join('\n');

  const summaryOf = (label: string): string => {
    const applicable = rows.filter((r) => !r.error);
    const passed = applicable.filter((r) => r.checks.find((c) => c.label === label)?.ok).length;
    return `${passed}/${applicable.length}`;
  };

  const summary =
    `\n## Summary by check\n\n| Check | Routes passed |\n| --- | --- |\n` +
    CHECK_LABELS.map((l) => `| ${l} | ${summaryOf(l)} |`).join('\n') +
    `\n\n## Per-route evidence\n\n${detail}\n`;

  return header + body + summary;
}

async function main(): Promise<void> {
  console.log(`Raw-HTML crawl audit against ${BASE_URL}`);

  // Baseline: the homepage H1/title, so we can detect routes that silently
  // inherited the homepage shell via the nginx try_files fallback.
  const home = await fetchRoute(ROUTES[0]);
  const baseline: Baseline = {
    h1: decodeEntities(textOf(firstMatch(home.html, /<h1\b[^>]*>(.*?)<\/h1>/is) ?? '')),
    title: firstMatch(home.html, /<title>(.*?)<\/title>/is) ?? '',
  };

  const rows: Row[] = [];

  for (const route of ROUTES) {
    const { status, html, error } = await fetchRoute(route);
    const checks = html ? evaluate(route, status, html, baseline) : [];
    rows.push({ route, status, checks, error });
    const failed = checks.filter((c) => !c.ok).length;
    console.log(
      `${!error && failed === 0 ? 'PASS' : 'FAIL'} ${route.path}` +
        (error ? `  (${error})` : failed ? `  (${failed} check(s) failed)` : ''),
    );
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, renderReport(rows), 'utf-8');

  const totalFailures = rows.reduce(
    (n, r) => n + r.checks.filter((c) => !c.ok).length + (r.error ? 1 : 0),
    0,
  );
  console.log(`\n${totalFailures === 0 ? 'All checks passed' : `${totalFailures} check failure(s)`}`);
  console.log(`Report written to ${REPORT_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

