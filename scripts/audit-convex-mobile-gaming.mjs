/**
 * Diagnostic: query production Convex for every mobile-gaming content row.
 *
 * The CLI is invoked from Node with an argument array (no shell), so the JSON
 * payload reaches `convex run` unmodified — PowerShell's quoting rules would
 * otherwise strip the inner quotes and make the query silently return null.
 *
 * Run: node scripts/audit-convex-mobile-gaming.mjs [--prod]
 */
import { execFileSync } from 'child_process';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
// Resolve the CLI entry directly so we can spawn it with an argument array.
// Going through `npx` (or any shell) re-quotes the JSON payload and strips the
// inner double quotes, which makes every query silently return null.
// `convex` restricts its package `exports`, so the bin path is read from
// package.json rather than resolved through the public entry points.
const CONVEX_PKG = path.join(
  path.dirname(require.resolve('convex/package.json')),
  JSON.parse(fs.readFileSync(require.resolve('convex/package.json'), 'utf8')).bin.convex
);

const prod = process.argv.includes('--prod') ? ['--prod'] : [];

/** Run a Convex query and return parsed JSON, or null. */
function run(fn, args) {
  const argv = [CONVEX_PKG, 'run', ...(args ? [fn, JSON.stringify(args)] : [fn]), ...prod];
  try {
    const out = execFileSync(process.execPath, argv, {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    }).trim();
    return out ? JSON.parse(out) : null;
  } catch (err) {
    return { __error: String(err.stdout ?? err.message).slice(0, 500) };
  }
}

// 1. Control: a slug known to exist proves the plumbing works
const control = run('content:getContentBySlug', { slug: 'gaming-pc-antivirus-best-2026' });
console.log('control (gaming-pc-antivirus-best-2026):', control?.slug ?? control);

// 2. The two candidate slugs
for (const slug of [
  'mobile-gaming-security-guide',
  'mobile-gaming-security-guide-ios-android',
]) {
  const row = run('content:getContentBySlug', { slug });
  if (row && !row.__error && row.slug) {
    console.log(`\n${slug}: FOUND`, {
      id: row._id,
      status: row.status,
      isDeleted: row.isDeleted,
      wordCount: row.wordCount,
      bodyChars: String(row.body ?? '').length,
      images: (String(row.body).match(/<img /g) ?? []).length,
      escapedTags: /&lt;p&gt;|&lt;h2&gt;/.test(String(row.body)),
    });
  } else {
    console.log(`\n${slug}: ${row?.__error ? 'ERROR ' + row.__error : 'not present'}`);
  }
}

// 3. Full scan for anything mobile-gaming related (catches a third slug)
const all = run('content:listAll');
if (Array.isArray(all)) {
  const hits = all.filter((r) => /mobile[- ]gaming/i.test(`${r.slug} ${r.title}`));
  console.log(`\nlistAll rows matching mobile-gaming: ${hits.length}`);
  for (const h of hits) {
    console.log('  -', h.slug, '|', h.status, '| words', h.wordCount, '|', h.title);
  }
} else {
  console.log('\nlistAll:', all?.__error ? 'ERROR ' + all.__error : all);
}

// 5. Scan mode: `node scripts/audit-convex-mobile-gaming.mjs --scan`
//    Flags rows that look broken: wordCount 1/absent, body shorter than the
//    published word count implies, or a body that still carries visible tags.
if (process.argv.includes('--scan') && Array.isArray(all)) {
  const suspicious = all.filter((r) => {
    const body = String(r.body ?? '');
    const plain = body.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
    const words = plain.split(/\s+/).filter(Boolean).length;
    return (
      !r.wordCount ||
      r.wordCount <= 1 ||
      words < 800 ||
      /&lt;(?:p|h[1-6]|div|ul)&gt;/.test(body)
    );
  });
  console.log(`\n--scan: ${suspicious.length} suspicious of ${all.length} rows`);
  for (const r of suspicious) {
    const body = String(r.body ?? '');
    const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    console.log('  -', r.slug, '| wc', r.wordCount, '| computed', words, '|', r.title);
  }
}

// 4. Optional deep dump: `node scripts/audit-convex-mobile-gaming.mjs --dump <slug>`
const dumpIdx = process.argv.indexOf('--dump');
if (dumpIdx !== -1 && process.argv[dumpIdx + 1]) {
  const row = run('content:getContentBySlug', { slug: process.argv[dumpIdx + 1] });
  if (!row || row.__error || !row.slug) {
    console.log('\n--dump: row not found', row);
  } else {
    const body = String(row.body ?? '');
    const plain = body.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
    console.log('\n--dump', row.slug, {
      status: row.status,
      isDeleted: row.isDeleted,
      wordCountField: row.wordCount,
      computedWords: plain.split(/\s+/).filter(Boolean).length,
      bodyChars: body.length,
      images: (body.match(/<img /g) ?? []).length,
      escapedTags: /&lt;p&gt;|&lt;h2&gt;|&lt;div/.test(body),
      semanticH2: (body.match(/<h2>/g) ?? []).length,
      mojibake: /â€|Ã/.test(body),
      canonicalUrl: row.canonicalUrl,
      publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : null,
      featuredImageUrl: row.featuredImageUrl,
      lastModifiedAt: row.lastModifiedAt ? new Date(row.lastModifiedAt).toISOString() : null,
    });
    console.log('\n--dump first 600 chars of body:\n' + body.slice(0, 600));
  }
}
