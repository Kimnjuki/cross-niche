/**
 * One-off maintenance: retire the runtime per-route meta injector from
 * index.html. Per-route metadata is now emitted as static HTML by
 * scripts/generate-static-route-shells.mjs, so the runtime rewrite (which fell
 * back to the HOMEPAGE canonical for unlisted routes) must never run again.
 *
 * Safe to keep in the repo: it is idempotent (no-op when the block is gone).
 * Run: node scripts/retire-runtime-meta-injector.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.resolve(__dirname, '..', 'index.html');

const PATTERN = /\s*<!-- ── Per-route title\/description\/canonical injection[\s\S]*?<\/script>/;

const html = fs.readFileSync(indexPath, 'utf8');

if (!PATTERN.test(html)) {
  console.log('✓ runtime meta injector already retired — nothing to do');
  process.exit(0);
}

const next = html.replace(PATTERN, '');
fs.writeFileSync(indexPath, next, 'utf8');
console.log(`✓ removed runtime meta injector (${html.length - next.length} chars) from index.html`);
console.log(`  DOMContentLoaded handler still present: ${next.includes('DOMContentLoaded')}`);
