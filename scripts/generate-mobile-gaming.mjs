/**
 * Rebuild the Mobile Gaming Security Guide end to end.
 *
 *   DOCX --docx-to-html--> body.html --build-module--> src/data/... .ts
 *
 * Single entry point so the page module can never be left stale after the
 * source document changes:
 *
 *   npm run generate:mobile-gaming -- "C:\\path\\Mobile_Gaming_Security_...docx"
 *
 * If no path is given the last-known publish-ready DOCX is used.
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const DOCX =
  process.argv[2] ??
  'C:/Users/Administrator/Downloads/Mobile_Gaming_Security_Guide_TheGridNexus_Publish_Ready.docx';

if (!fs.existsSync(DOCX)) {
  console.error(`[generate-mobile-gaming] DOCX not found: ${DOCX}`);
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mgs-'));
const bodyHtml = path.join(tmp, 'body.html');
const mapJson = path.join(tmp, 'map.json');

function run(label, args) {
  const res = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`[generate-mobile-gaming] ${label} failed (exit ${res.status})`);
    process.exit(res.status ?? 1);
  }
}

run('docx-to-html', ['scripts/docx-to-html.mjs', DOCX, '--out', bodyHtml, '--map', mapJson]);
run('build-mobile-gaming-module', ['scripts/build-mobile-gaming-module.mjs', bodyHtml]);
run('syncMobileGamingSnapshot', [
  path.resolve('node_modules/tsx/dist/cli.mjs'),
  'scripts/syncMobileGamingSnapshot.ts',
]);

console.log(`[generate-mobile-gaming] done. Now run: npm run push:mobile-gaming`);
