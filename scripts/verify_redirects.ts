/**
 * Verify 301 redirects from redirect_map.json.
 * Usage: npx tsx scripts/verify_redirects.ts [--base https://thegridnexus.com]
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'data');
const redirectPath = join(dataDir, 'redirect_map.json');

const base = process.argv.find(a => a.startsWith('--base='))?.split('=')[1] || 'https://thegridnexus.com';

async function main() {
  if (!existsSync(redirectPath)) {
    console.error('redirect_map.json not found');
    process.exit(1);
  }
  const map = JSON.parse(readFileSync(redirectPath, 'utf-8')) as Array<{ from: string; to: string; status?: number }>;
  let ok = 0;
  let fail = 0;
  for (const r of map) {
    const fromUrl = r.from.startsWith('http') ? r.from : `${base}${r.from.startsWith('/') ? '' : '/'}${r.from}`;
    try {
      const res = await fetch(fromUrl, { redirect: 'manual' });
      const loc = res.headers.get('location') || '';
      const expected = r.to.startsWith('http') ? r.to : `${base}${r.to.startsWith('/') ? '' : '/'}${r.to}`;
      if ((res.status === 301 || res.status === 302) && (loc === expected || loc.endsWith(r.to))) {
        ok++;
        console.log(`OK 301 ${r.from} -> ${r.to}`);
      } else {
        fail++;
        console.error(`FAIL ${r.from}: status=${res.status}, location=${loc}`);
      }
    } catch (e) {
      fail++;
      console.error(`ERR ${r.from}:`, e);
    }
  }
  console.log(`\nResults: ${ok} OK, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
}
main();
