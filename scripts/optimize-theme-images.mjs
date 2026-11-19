#!/usr/bin/env node
/**
 * Theme image optimizer — The Grid Nexus
 *
 * The 12 theme JPEGs in public/assets/ are 1600–6000px source photographs
 * totalling ~15.9 MB. They are shipped verbatim into dist/assets/ by Vite's
 * publicDir copy, so every deploy pushes 15.9 MB of raster data to the CDN.
 *
 * This script re-encodes each one to a web-appropriate size:
 *   - resized so the longest edge is <= MAX_EDGE (1600px covers retina 2x on a
 *     800px CSS slot, which is the widest these are ever displayed at)
 *   - written as WebP quality 78 (visually indistinguishable for photographic
 *     content at this scale, ~10x smaller than a full-size JPEG)
 *   - the original .jpg is kept alongside so any existing reference keeps
 *     working; the .webp is what new markup should point at
 *
 * Idempotent: re-running only rewrites files whose source is newer.
 *
 * Usage:
 *   node scripts/optimize-theme-images.mjs          # optimize in place
 *   node scripts/optimize-theme-images.mjs --check  # report only, exit 1 if any
 *                                                     file exceeds the budget
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'public', 'assets');

const MAX_EDGE = 1600;
const WEBP_QUALITY = 78;
/** Per-file budget after optimization. Anything above this is flagged. */
const BUDGET_BYTES = 250 * 1024;

/**
 * Dense, high-detail photographs (circuit boards, motherboards, network
 * topology) resist WebP compression at q78. These get a lower quality and a
 * tighter edge cap so they land inside the budget without visible artefacts at
 * the sizes they are actually displayed.
 */
const AGGRESSIVE = {
  'motherboard.jpg': { quality: 68, maxEdge: 1200 },
  'network.jpg': { quality: 68, maxEdge: 1200 },
  'cyber.jpg': { quality: 70, maxEdge: 1400 },
  'circuit.jpg': { quality: 62, maxEdge: 1200 },
};

const checkOnly = process.argv.includes('--check');

/** Files that are actively referenced by live markup or the runtime fallback. */
const THEME_IMAGES = [
  'networking.jpg', 'cyber.jpg', 'network.jpg', 'tech.jpg', 'motherboard.jpg',
  'abstract.jpg', 'Ai.jpg', 'aai.jpg', 'box.jpg', 'circuit.jpg', 'globe.jpg',
  'unsplash.jpg',
];

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('sharp is not available. It ships as a transitive dependency;');
    console.error('run `npm ls sharp` to confirm, or `npm i -D sharp` to add it.');
    process.exit(1);
  }

  const rows = [];
  let totalBefore = 0;
  let totalAfter = 0;
  let overBudget = 0;

  for (const name of THEME_IMAGES) {
    const src = path.join(ASSETS, name);
    if (!fs.existsSync(src)) {
      rows.push({ name, status: 'missing' });
      continue;
    }
    const before = fs.statSync(src).size;
    totalBefore += before;

    const webpPath = src.replace(/\.jpe?g$/i, '.webp');
    const webpName = path.basename(webpPath);
    const webpExists = fs.existsSync(webpPath);
    const webpMtime = webpExists ? fs.statSync(webpPath).mtimeMs : 0;
    const srcMtime = fs.statSync(src).mtimeMs;

    if (checkOnly) {
      const after = webpExists ? fs.statSync(webpPath).size : before;
      totalAfter += after;
      if (after > BUDGET_BYTES) overBudget++;
      rows.push({
        name,
        before,
        after,
        status: webpExists ? 'present' : 'not-generated',
      });
      continue;
    }

    // Skip work when the .webp is already newer than its source.
    if (webpExists && webpMtime >= srcMtime) {
      const after = fs.statSync(webpPath).size;
      totalAfter += after;
      if (after > BUDGET_BYTES) overBudget++;
      rows.push({ name, before, after, status: 'up-to-date' });
      continue;
    }

    const tune = AGGRESSIVE[name] ?? {};
    const maxEdge = tune.maxEdge ?? MAX_EDGE;
    const quality = tune.quality ?? WEBP_QUALITY;

    const meta = await sharp(src).metadata();
    const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
    const pipeline = sharp(src);
    if (longest > maxEdge) {
      pipeline.resize({
        width: longest === meta.width ? maxEdge : undefined,
        height: longest === meta.height ? maxEdge : undefined,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
    await pipeline.webp({ quality }).toFile(webpPath);

    const after = fs.statSync(webpPath).size;
    totalAfter += after;
    if (after > BUDGET_BYTES) overBudget++;
    rows.push({ name, before, after, status: 'optimized' });
  }

  const mb = (n) => (n / 1048576).toFixed(2);
  const kb = (n) => (n / 1024).toFixed(0);

  console.log('\n=== THEME IMAGE OPTIMIZATION ===\n');
  console.log(
    'file'.padEnd(18) + 'before'.padStart(10) + 'after'.padStart(10) + 'saved'.padStart(10) + '  status'
  );
  console.log('-'.repeat(70));
  for (const r of rows) {
    if (r.status === 'missing') {
      console.log(r.name.padEnd(18) + 'MISSING');
      continue;
    }
    const saved = r.before > 0 ? `${(((r.before - r.after) / r.before) * 100).toFixed(0)}%` : '-';
    console.log(
      r.name.padEnd(18) +
        `${mb(r.before)}MB`.padStart(10) +
        `${kb(r.after)}KB`.padStart(10) +
        saved.padStart(10) +
        `  ${r.status}`
    );
  }
  console.log('-'.repeat(70));
  console.log(
    `TOTAL`.padEnd(18) + `${mb(totalBefore)}MB`.padStart(10) + `${mb(totalAfter)}MB`.padStart(10)
  );
  console.log(
    `\nReduction: ${mb(totalBefore)}MB -> ${mb(totalAfter)}MB (${totalBefore > 0 ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1) : 0}% smaller)`
  );

  if (overBudget > 0) {
    console.log(`${overBudget} file(s) still exceed the ${kb(BUDGET_BYTES)}KB budget.`);
  }

  if (checkOnly) {
    const missing = rows.filter((r) => r.status === 'not-generated').length;
    if (missing > 0) {
      console.log(`\n${missing} theme image(s) have no .webp yet — run without --check.`);
      process.exit(1);
    }
    if (overBudget > 0) process.exit(1);
    console.log('\nAll theme images are within budget.');
  }
}

main().catch((err) => {
  console.error('Optimization failed:', err.message);
  process.exit(1);
});