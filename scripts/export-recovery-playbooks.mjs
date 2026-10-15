/**
 * Export published recovery playbooks from Convex into
 * src/data/recovery-playbooks.json for static page generation.
 *
 * Run: node scripts/export-recovery-playbooks.mjs --url https://canny-mule-83.convex.cloud
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const OUT = path.join(projectRoot, 'src', 'data', 'recovery-playbooks.json');

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

  console.log(`Exporting recovery playbooks from ${url} ...`);
  const { ConvexHttpClient } = await import('convex/browser');
  const client = new ConvexHttpClient(url);

  const platforms = await client.query('recovery:listPublishedPlaybooks');
  const pages = [];
  for (const p of platforms ?? []) {
    for (const s of p.scenarios ?? []) {
      const playbook = await client.query('recovery:getPublishedPlaybook', {
        platformSlug: p.slug,
        scenario: s.scenario,
        locale: 'en',
      });
      if (playbook) pages.push(playbook);
    }
  }

  const payload = {
    meta: { generatedAt: new Date().toISOString(), count: pages.length },
    pages,
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`Exported ${pages.length} recovery pages -> src/data/recovery-playbooks.json`);
}

main();
