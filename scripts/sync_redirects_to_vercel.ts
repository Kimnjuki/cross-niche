/**
 * Sync data/redirect_map.json entries into vercel.json redirects.
 * Run: npx tsx scripts/sync_redirects_to_vercel.ts
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

interface RedirectEntry {
  from: string;
  to: string;
  status?: number;
  note?: string;
}

const redirectMapPath = join(root, 'data', 'redirect_map.json');
const vercelPath = join(root, 'vercel.json');

const raw = readFileSync(redirectMapPath, 'utf-8');
let map: RedirectEntry[];
try {
  map = JSON.parse(raw);
} catch {
  console.error('Failed to parse redirect_map.json');
  process.exit(1);
}

const vercel = JSON.parse(readFileSync(vercelPath, 'utf-8'));
const existingRedirects = vercel.redirects || [];

// Filter out placeholder entries (e.g. /old-path-example)
const validEntries = map.filter(
  (r) => r.from && r.to && !r.from.includes('example')
);

const newRedirects = validEntries.map((r) => ({
  source: r.from,
  destination: r.to,
  permanent: r.status === 301,
}));

// Keep existing redirects (e.g. www → non-www) and add new ones
vercel.redirects = [...existingRedirects, ...newRedirects];
writeFileSync(vercelPath, JSON.stringify(vercel, null, 2), 'utf-8');
console.log(`Synced ${newRedirects.length} redirects to vercel.json`);
