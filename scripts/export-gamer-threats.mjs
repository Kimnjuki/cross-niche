/**
 * Export gamer-relevant threats (affectsGamers=true, ranked by gamerImpactScore)
 * from Convex into src/data/gamer-threats.json for static page generation.
 *
 * Run:
 *   node scripts/export-gamer-threats.mjs --url https://canny-mule-83.convex.cloud
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const OUT = path.join(projectRoot, 'src', 'data', 'gamer-threats.json');

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

  console.log(`Exporting gamer threats from ${url} ...`);
  const { ConvexHttpClient } = await import('convex/browser');
  const client = new ConvexHttpClient(url);

  const threats = await client.query('threatIntel:listGamerThreats', { limit: 200 });
  const items = (threats ?? []).map((t) => ({
    title: t.title ?? '',
    description: t.description ?? '',
    severity: t.severity ?? 'medium',
    gamerImpactScore: t.gamerImpactScore ?? 0,
    gamingPlatforms: t.gamingPlatforms ?? [],
    publishedAt: t.publishedAt ?? null,
    url: t.url ?? '',
    cveIds: t.cveIds ?? [],
  }));

  const payload = {
    meta: { generatedAt: new Date().toISOString(), count: items.length },
    threats: items,
  };

  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + '\n', 'utf-8');
  console.log(`Wrote ${items.length} gamer threats -> ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
