/**
 * Export the gameLibrary (game + security grade) catalogue from Convex into
 * src/data/game-library.json, so the static build can generate crawlable
 * per-game security-grade pages without hitting Convex at build time.
 *
 * Mirrors scripts/export-content-snapshot.mjs.
 *
 * Run:
 *   node scripts/export-game-library.mjs --url https://canny-mule-83.convex.cloud
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const OUT = path.join(projectRoot, 'src', 'data', 'game-library.json');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        out[key] = next;
        i++;
      } else {
        out[key] = true;
      }
    }
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const url = args.url || process.env.CONVEX_URL || process.env.VITE_CONVEX_URL;
  if (!url) {
    console.error('No Convex URL. Pass --url <deployment>.');
    process.exit(1);
  }

  console.log(`Exporting game library from ${url} ...`);
  const { ConvexHttpClient } = await import('convex/browser');
  const client = new ConvexHttpClient(url);

  const { games } = await client.query('gameLibrary:list', { limit: 200 });
  const items = (games ?? []).filter((g) => g && g.slug);

  if (items.length === 0) {
    console.error('gameLibrary returned zero games — refusing to overwrite.');
    process.exit(1);
  }

  const payload = {
    meta: { generatedAt: new Date().toISOString(), count: items.length },
    games: items,
  };

  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
  console.log(`Wrote ${items.length} games -> ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
