/**
 * Debug helper: dump a .docx paragraph-by-paragraph with its style + direct
 * formatting so the real structure (headings, pseudo-headings, literal bullet
 * characters, images, tables) can be inspected before conversion.
 *
 * Usage: node scripts/docx-inspect.mjs <input.docx> [--lines 400]
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';

const args = process.argv.slice(2);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'docxd-'));
const work = path.join(tmp, 'src');
fs.mkdirSync(work, { recursive: true });
const zipPath = path.join(tmp, 'd.zip');
fs.copyFileSync(args[0], zipPath);
execFileSync('powershell', ['-NoProfile', '-Command',
  `Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${work}' -Force`]);

const xml = fs.readFileSync(path.join(work, 'word', 'document.xml'), 'utf8');
const body = xml.slice(xml.indexOf('<w:body>'), xml.lastIndexOf('</w:body>'));

const rels = new Map();
for (const m of fs.readFileSync(path.join(work, 'word', '_rels', 'document.xml.rels'), 'utf8')
  .matchAll(/<Relationship\b[^>]*\/>/g)) {
  rels.set(/Id="([^"]+)"/.exec(m[0])?.[1], /Target="([^"]+)"/.exec(m[0])?.[1]);
}

let imgN = 0;
const lines = [];
const re = /<w:tbl\b(?![a-zA-Z])[^>]*>[\s\S]*?<\/w:tbl>|<w:p\b(?![a-zA-Z])[^>]*?(?:\/>|>[\s\S]*?<\/w:p>)/g;
let m;
while ((m = re.exec(body)) !== null) {
  const frag = m[0];
  if (frag.startsWith('<w:tbl')) {
    const rows = [...frag.matchAll(/<w:tr\b(?![a-zA-Z])[^>]*>([\s\S]*?)<\/w:tr>/g)].length;
    const cells = [...frag.matchAll(/<w:tc\b(?![a-zA-Z])[^>]*>/g)].length;
    lines.push(`[TABLE rows=${rows} cells=${cells}]`);
    continue;
  }
  const inner = /<w:p\b(?![a-zA-Z])[^>]*>([\s\S]*?)<\/w:p>/.exec(frag)?.[1] ?? '';
  const pPr = /<w:pPr\b[^>]*>([\s\S]*?)<\/w:pPr>/.exec(inner)?.[1] ?? '';
  const style = /<w:pStyle\b[^>]*w:val="([^"]+)"/.exec(pPr)?.[1] ?? '-';
  const ind = /<w:ind\b[^>]*w:left="(\d+)"/.exec(pPr)?.[1];
  const hasImg = /<w:drawing\b|<w:pict\b/.test(inner);
  if (hasImg) {
    const id = /r:embed="([^"]+)"/.exec(inner)?.[1] ?? /r:id="([^"]+)"/.exec(inner)?.[1];
    lines.push(`[IMAGE ${path.basename(rels.get(id) ?? '?')}]`);
  }
  let text = '';
  for (const hm of inner.matchAll(/<w:hyperlink\b[^>]*r:id="([^"]+)"[^>]*>([\s\S]*?)<\/w:hyperlink>/g)) {
    let lbl = '';
    for (const t of hm[2].matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)) lbl += t[1];
    text += `{LINK:${rels.get(hm[1])}|${lbl}}`;
  }
  const stripped = inner.replace(/<w:hyperlink\b[\s\S]*?<\/w:hyperlink>/g, '');
  for (const t of stripped.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)) text += t[1];
  const bold = /<w:b\/>/.test(inner) || /<w:b\/>/.test(inner);
  const sz = /<w:sz w:val="(\d+)"\/>/.exec(inner)?.[1];
  const meta = [`style=${style}`, bold ? 'B' : '', sz ? `sz=${sz}` : '', ind ? `ind=${ind}` : '']
    .filter(Boolean).join(' ');
  if (text.trim() || hasImg) lines.push(`${meta} :: ${text}`);
  imgN++;
}
const limit = Number(args.includes('--lines') ? args[args.indexOf('--lines') + 1] : 400);
console.log(lines.slice(0, limit).join('\n'));
console.log(`\n--- total blocks: ${lines.length} ---`);
