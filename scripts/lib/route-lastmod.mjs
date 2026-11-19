/**
 * Per-route <lastmod> resolution — The Grid Nexus
 *
 * Why this exists: 51 of the 134 URLs in sitemap.xml shipped with no <lastmod>.
 * Google uses lastmod as a freshness and recrawl signal, and the generator's own
 * comments warn that "uniform values defeat its purpose" — a shared build
 * timestamp on every page is worse than no lastmod at all, because it tells
 * Google every page changed on the same day.
 *
 * The honest signal is: when did the source that produces this page last change?
 * Every static route on this site is generated from a known script or data file,
 * and git records when each of those last changed. So we map route -> source
 * file(s) and read that file's last commit date.
 *
 * Resolution order (first hit wins):
 *   1. git last-commit date of the route's most specific source file
 *   2. mtime of the built dist/<route>/index.html (only if git is unavailable)
 *   3. '' — omit <lastmod> entirely, exactly as before
 *
 * Omitting is always safe: an absent lastmod is valid; a fabricated one is not.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { projectRoot } from './mock-content.mjs';

/** Route prefix -> the source file(s) that generate it, most specific first. */
const ROUTE_SOURCES = [
  { prefix: '/safety', files: ['scripts/generate-safety-pages.mjs', 'src/data/safety-verdicts.json'] },
  { prefix: '/recover', files: ['scripts/generate-recovery-pages.mjs', 'src/data/recovery-playbooks.json'] },
  { prefix: '/platforms', files: ['scripts/generate-platform-hubs.mjs', 'src/data/platforms.json'] },
  { prefix: '/games', files: ['scripts/generate-game-pages.mjs', 'src/data/game-library.json', 'src/data/games.json'] },
  { prefix: '/threats', files: ['scripts/generate-threat-page.mjs'] },
  { prefix: '/methodology', files: ['scripts/generate-trust-pages.mjs'] },
  { prefix: '/privacy/tools', files: ['scripts/generate-trust-pages.mjs'] },
  { prefix: '/editorial-standards', files: ['scripts/generate-trust-pages.mjs'] },
  { prefix: '/corrections', files: ['scripts/generate-trust-pages.mjs'] },
  { prefix: '/security-disclosure', files: ['scripts/generate-trust-pages.mjs'] },
  { prefix: '/anti-cheat', files: ['scripts/generate-trust-pages.mjs'] },
  { prefix: '/tools/download-check', files: ['scripts/generate-trust-pages.mjs'] },
  { prefix: '/report', files: ['scripts/generate-trust-pages.mjs'] },
  { prefix: '/parents', files: ['scripts/generate-trust-pages.mjs'] },
  { prefix: '/data', files: ['scripts/generate-trust-pages.mjs'] },
  { prefix: '/research', files: ['scripts/generate-research-report.mjs'] },
  // Everything else in INDEXABLE_ROUTES is a prerendered shell built from the
  // shared route registry.
  { prefix: '/', files: ['scripts/lib/route-metadata.mjs'] },
];

/** Cache git lookups — the same file backs many routes. */
const gitDateCache = new Map();
let gitAvailable = null;

function gitAvailable_() {
  if (gitAvailable !== null) return gitAvailable;
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: projectRoot, stdio: 'ignore' });
    gitAvailable = true;
  } catch {
    gitAvailable = false;
  }
  return gitAvailable;
}

/** Last commit date (YYYY-MM-DD) of a repo-relative file, or '' if unknown. */
function gitLastCommitDate(relFile) {
  if (gitDateCache.has(relFile)) return gitDateCache.get(relFile);
  let date = '';
  if (gitAvailable_()) {
    try {
      const out = execFileSync('git', ['log', '-1', '--format=%ad', '--date=short', '--', relFile], {
        cwd: projectRoot,
        stdio: ['ignore', 'pipe', 'ignore'],
      }).toString().trim();
      // A file can be tracked but uncommitted, or the path may not exist.
      if (/^\d{4}-\d{2}-\d{2}$/.test(out)) date = out;
    } catch {
      date = '';
    }
  }
  gitDateCache.set(relFile, date);
  return date;
}

/** mtime of the built page, as a YYYY-MM-DD string. */
function builtFileDate(routePath) {
  const rel = routePath === '/' ? 'index.html' : `${routePath.replace(/^\/+/, '')}/index.html`;
  const abs = path.join(projectRoot, 'dist', rel);
  try {
    if (!fs.existsSync(abs)) return '';
    return fs.statSync(abs).mtime.toISOString().slice(0, 10);
  } catch {
    return '';
  }
}

/**
 * Resolve the <lastmod> for a route.
 * @param {string} routePath e.g. '/platforms/steam/security'
 * @returns {string} 'YYYY-MM-DD' or '' to omit the tag
 */
export function lastmodForRoute(routePath) {
  const clean = `/${String(routePath || '/').replace(/^\/+/, '').replace(/\/+$/, '')}`;
  const match = ROUTE_SOURCES.find((entry) => clean === entry.prefix || clean.startsWith(`${entry.prefix}/`));
  const files = match ? match.files : ROUTE_SOURCES[ROUTE_SOURCES.length - 1].files;

  for (const file of files) {
    const date = gitLastCommitDate(file);
    if (date) return date;
  }
  // Git unavailable or the file is untracked: fall back to the built file's
  // mtime, then to omitting the tag.
  return builtFileDate(clean);
}

/** Exposed for tests: which source files back a route. */
export function sourceFilesForRoute(routePath) {
  const clean = `/${String(routePath || '/').replace(/^\/+/, '').replace(/\/+$/, '')}`;
  const match = ROUTE_SOURCES.find((entry) => clean === entry.prefix || clean.startsWith(`${entry.prefix}/`));
  return match ? match.files : ROUTE_SOURCES[ROUTE_SOURCES.length - 1].files;
}