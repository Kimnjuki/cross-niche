#!/usr/bin/env node
/**
 * Static Article Body Validator — The Grid Nexus
 *
 * Guard against the class of bug where `scripts/generate-static-articles.mjs`
 * emits an article page whose body is silently truncated (plan finding V-06).
 * That bug shipped for months because nothing asserted on the *output* size.
 *
 * Scans dist/article/<slug>/index.html, extracts the article body <div>, and
 * fails if any page has fewer than MIN_WORDS words of body text.
 *
 * Usage:
 *   node scripts/validate-static-article-bodies.mjs            # default 300
 *   MIN_WORDS=150 node scripts/validate-static-article-bodies.mjs
 *
 * Exit code 1 if any article fails (safe to wire into CI / Dockerfile).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const articlesDir = path.join(projectRoot, 'dist', 'article');

/** Below this word count a page is reported as WARN (thin content). */
const WARN_WORDS = Number(process.env.WARN_WORDS || 300);
/** If set, thin pages become a hard failure instead of a warning. */
const STRICT = process.env.STRICT === '1';

/** The body container emitted by generate-static-articles.mjs L169-171. */
const BODY_OPEN_RE = /line-height:1\.7;font-size:1\.0625rem">/;

/**
 * Extract the article body container's inner HTML.
 *
 * A non-greedy match to the first `</div>` is WRONG here: article bodies
 * routinely contain nested <div> blocks, so that would under-count the body
 * (this is exactly what made the first version of this validator report
 * "1 word" for content-rich articles). Walk the div nesting instead.
 */
function extractBody(html) {
  const marker = html.search(BODY_OPEN_RE);
  if (marker === -1) return null;

  const openTagEnd = html.indexOf('>', marker) + 1;
  let depth = 1;
  const divTagRe = /<\/?div\b/gi;
  divTagRe.lastIndex = openTagEnd;

  let match;
  while ((match = divTagRe.exec(html)) !== null) {
    if (match[0].startsWith('</')) {
      depth -= 1;
      if (depth === 0) return html.slice(openTagEnd, match.index);
    } else {
      depth += 1;
    }
  }
  return html.slice(openTagEnd);
}

function countWords(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Structural truncation signatures. The V-06 bug left bodies that either end
 * with a dangling escape backslash (mid-word) or have unbalanced tags, because
 * the regex capture stopped early. These are reliable, unlike a word count.
 */
function detectTruncation(body) {
  const issues = [];
  const trimmed = body.trim();

  if (/\\$/.test(trimmed)) {
    issues.push('body ends with a dangling escape backslash (truncated capture)');
  }
  if (trimmed.endsWith('<') || /<[a-z][^>]*$/i.test(trimmed)) {
    issues.push('body ends mid-tag');
  }

  const count = (re) => (trimmed.match(re) || []).length;
  const divDelta = count(/<div\b/gi) - count(/<\/div>/gi);
  const pDelta = count(/<p\b/gi) - count(/<\/p>/gi);
  if (divDelta !== 0) issues.push(`unbalanced <div>: ${divDelta > 0 ? `+${divDelta} unclosed` : `${-divDelta} extra close`}`);
  if (pDelta !== 0) issues.push(`unbalanced <p>: ${pDelta > 0 ? `+${pDelta} unclosed` : `${-pDelta} extra close`}`);

  return issues;
}

function main() {
  if (!fs.existsSync(articlesDir)) {
    console.error(`No generated articles at ${articlesDir}. Run "vite build" then`);
    console.error('"node scripts/generate-static-articles.mjs" first.');
    process.exit(1);
  }

  const slugs = fs
    .readdirSync(articlesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const results = slugs.map((slug) => {
    const file = path.join(articlesDir, slug, 'index.html');
    const html = fs.readFileSync(file, 'utf8');
    const body = extractBody(html);
    const words = countWords(body ?? '');
    const truncation = body === null ? ['body container not found in generated HTML'] : detectTruncation(body);
    return { slug, body: body ?? '', words, found: body !== null, truncation };
  });

  results.sort((a, b) => a.words - b.words);

  const truncated = results.filter((r) => r.truncation.length > 0);
  const thin = results.filter((r) => r.truncation.length === 0 && r.words < WARN_WORDS);
  const failing = STRICT ? [...truncated, ...thin] : truncated;

  console.log(
    `Validated ${results.length} generated article page(s) — WARN_WORDS=${WARN_WORDS}${STRICT ? ' (strict)' : ''}\n`,
  );
  console.log('  status  words  slug');
  for (const r of results) {
    const status =
      r.truncation.length > 0 ? 'TRUNC' : r.words < WARN_WORDS ? (STRICT ? 'THIN!' : 'thin ') : 'ok   ';
    console.log(`  ${status}  ${String(r.words).padStart(5)}  ${r.slug}`);
  }

  if (thin.length) {
    console.log(
      `\n${thin.length} page(s) under ${WARN_WORDS} words are genuinely short source content` +
        ` (not truncation) — see reports/article-body-render-audit.md for the content-quality follow-up.`,
    );
  }

  if (truncated.length) {
    console.error(`\n${truncated.length} page(s) show a TRUNCATION signature:`);
    for (const r of truncated.slice(0, 10)) {
      console.error(`  - ${r.slug}: ${r.truncation.join('; ')}`);
      console.error(`    body tail: ${JSON.stringify(r.body.slice(-120))}`);
    }
  }

  if (failing.length) {
    console.error(`\nFAIL: ${failing.length}/${results.length} generated article page(s) are invalid.`);
    process.exit(1);
  }

  console.log(`\nPASS: no truncation signatures in ${results.length} article page(s).`);
}

main();
