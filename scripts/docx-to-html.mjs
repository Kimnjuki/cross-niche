/**
 * Extract a .docx into structured HTML.
 *
 * Used to convert the client-supplied "Publish Ready" Word document
 * (Mobile_Gaming_Security_Guide_TheGridNexus_Publish_Ready.docx) into the
 * clean, semantic HTML frame the site expects, keeping image anchors so each
 * screenshot stays exactly where the document puts it.
 *
 * Handles: Heading1-6, bulleted + numbered lists, tables, inline images
 * (document.xml.rels -> word/media), hyperlinks, bold/italic runs, alignment.
 *
 * Usage: node scripts/docx-to-html.mjs <input.docx> [--out file.html] [--map map.json]
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';

const args = process.argv.slice(2);
const input = args[0];
if (!input) {
  console.error('Usage: node scripts/docx-to-html.mjs <input.docx> [--out file.html] [--map map.json]');
  process.exit(1);
}
const flag = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? dflt : args[i + 1];
};
const outFile = flag('out', null);
const mapFile = flag('map', null);
const tsOutFile = flag('ts', null);

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'docx-'));
const work = path.join(tmp, 'src');
fs.mkdirSync(work, { recursive: true });
// PowerShell's Expand-Archive requires a .zip extension
const zipPath = path.join(tmp, 'doc.zip');
fs.copyFileSync(input, zipPath);
execFileSync('powershell', [
  '-NoProfile', '-Command',
  `Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${work}' -Force`,
]);

const xml = fs.readFileSync(path.join(work, 'word', 'document.xml'), 'utf8');

// ── relationship map: rId -> target ────────────────────────────────────────
const relsXml = fs.readFileSync(path.join(work, 'word', '_rels', 'document.xml.rels'), 'utf8');
const rels = new Map();
for (const m of relsXml.matchAll(/<Relationship\b[^>]*\/>/g)) {
  const id = /Id="([^"]+)"/.exec(m[0])?.[1];
  const target = /Target="([^"]+)"/.exec(m[0])?.[1];
  const mode = /TargetMode="([^"]+)"/.exec(m[0])?.[1];
  if (id && target) rels.set(id, { target, external: mode === 'External' });
}

// ── XML helpers ─────────────────────────────────────────────────────────────
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };
function decode(s) {
  return s.replace(/&(#x?[0-9a-fA-F]+|amp|lt|gt|quot|apos|nbsp);/g, (full, e) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' || e[1] === 'X'
        ? parseInt(e.slice(2), 16)
        : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : full;
    }
    return ENT[e] ?? full;
  });
}
const esc = (s) => fixMojibake(decode(s)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Repair mojibake: the source document stores some characters as UTF-8 bytes
 * that were already decoded as Windows-1252, so "•" arrives as "â€¢" and "—"
 * as "â€"". Re-encode to bytes and decode as UTF-8 to restore the originals.
 * Only applied when the round-trip is lossless and actually changes the text.
 */
function fixMojibake(s) {
  if (!/[ÃÂâ€][\u0080-\u00bf\u2018\u2019\u201c\u201d\u2020-\u2026]/.test(s)) return s;
  try {
    const bytes = Buffer.from(s, 'latin1');
    const fixed = bytes.toString('utf8');
    return fixed.includes('\uFFFD') ? s : fixed;
  } catch {
    return s;
  }
}


const TOKEN_OPEN = '\u0001IMG\u0002';
const TOKEN_CLOSE = '\u0003';

/**
 * Where each extracted image lives in the document, in order, with the alt text
 * and pixel dimensions the site should publish. Keys are the word/media file
 * names (image1.png … image5.png).
 */
const IMAGE_ASSETS = {
  'image1.png': {
    src: '/images/articles/mobile-gaming-security/mobile-gaming-security-hero.png',
    alt: 'Layered defence diagram for mobile gaming accounts: device, account, apps, network and messages, and recovery.',
    width: 1340,
    height: 860,
  },
  'image2.png': {
    src: '/images/articles/mobile-gaming-security/ios-app-store-listing.png',
    alt: "Review an iPhone game listing's developer and reviews before installing.",
    width: 1024,
    height: 1536,
  },
  'image3.png': {
    src: '/images/articles/mobile-gaming-security/android-play-protect-scan.png',
    alt: 'Run a Google Play Protect scan to check mobile gaming app safety on Android.',
    width: 1024,
    height: 1536,
  },
  'image4.png': {
    src: '/images/articles/mobile-gaming-security/authenticator-setup.png',
    alt: 'Set up an authenticator app to enable two-factor authentication for gaming accounts.',
    width: 1024,
    height: 1536,
  },
  'image5.png': {
    src: '/images/articles/mobile-gaming-security/sessions-and-apps-review.png',
    alt: 'Review installed apps and active sessions to catch mobile gaming account risks.',
    width: 1024,
    height: 1536,
  },
};

const imageMap = [];
function renderImage(body) {
  const ids = [
    /r:embed="([^"]+)"/.exec(body)?.[1],
    /r:id="([^"]+)"/.exec(body)?.[1],
  ].filter(Boolean);
  for (const id of ids) {
    const rel = rels.get(id);
    if (!rel) continue;
    const file = path.basename(rel.target);
    if (!/\.(png|jpe?g|gif|webp)$/i.test(file)) continue;
    const index = imageMap.length + 1;
    const asset = IMAGE_ASSETS[file];
    imageMap.push({ index, file, relId: id, target: rel.target, ...(asset ?? {}) });
    if (!asset) {
      return `${TOKEN_OPEN}<!--IMAGE:${index}:${file}-->${TOKEN_CLOSE}`;
    }
    const img =
      `<img src="${asset.src}" alt="${esc(asset.alt)}" ` +
      `width="${asset.width}" height="${asset.height}" loading="lazy" decoding="async" />`;
    return `${TOKEN_OPEN}${img}${TOKEN_CLOSE}`;
  }
  return '';
}

/**
 * Build an anchor, rewriting absolute first-party URLs to root-relative paths
 * so the article keeps its link equity on the canonical host.
 */
function anchor(href, label) {
  let url = href;
  let external = /^https?:/i.test(url);
  const internal = url.match(/^https?:\/\/(?:www\.)?thegridnexus\.com(\/[^?#]*)?/i);
  if (internal) {
    url = internal[1] || '/';
    external = false;
  }
  return `<a href="${esc(url)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`;
}

// ── inline (run) rendering ──────────────────────────────────────────────────
/**
 * Render the inline children of a paragraph in document order.
 * Handles <w:r> runs and <w:hyperlink> wrappers — hyperlink runs must be
 * rendered in place, otherwise the anchor text is silently dropped.
 */
function renderInline(containerXml) {
  let out = '';
  const re = /<w:hyperlink\b(?![a-zA-Z])[^>]*r:id="([^"]+)"[^>]*>([\s\S]*?)<\/w:hyperlink>|<w:r\b(?![a-zA-Z])[^>]*>([\s\S]*?)<\/w:r>/g;
  let m;
  while ((m = re.exec(containerXml)) !== null) {
    if (m[1] !== undefined) {
      const href = rels.get(m[1])?.target ?? '#';
      const label = renderInline(m[2]);
      if (!label) continue;
      out += anchor(href, label);
    } else {
      out += renderRun(m[3] ?? '');
    }
  }
  return out;
}

function renderRun(body) {
  if (/<w:drawing\b/.test(body) || /<w:pict\b/.test(body)) return renderImage(body);
  let text = '';
  for (const t of body.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>|<w:tab\b[^>]*\/>|<w:br\b[^>]*\/>/g)) {
    if (t[0].startsWith('<w:tab') || t[0].startsWith('<w:br')) text += ' ';
    else text += t[1] ?? '';
  }
  if (!text) return '';
  const rPr = /<w:rPr\b[^>]*>([\s\S]*?)<\/w:rPr>/.exec(body)?.[1] ?? '';
  const val = esc(text);
  const on = (tag) => new RegExp(`<w:${tag}\\b(?![a-zA-Z])[^>]*(?:\\/>|>)`).test(rPr);
  if (on('b')) return `<strong>${val}</strong>`;
  if (on('i')) return `<em>${val}</em>`;
  return val;
}

// ── table rendering ─────────────────────────────────────────────────────────
function renderTable(tblXml) {
  const rows = [];
  for (const rm of tblXml.matchAll(/<w:tr\b(?![a-zA-Z])[^>]*>([\s\S]*?)<\/w:tr>/g)) {
    const cells = [];
    let header = false;
    for (const cm of rm[1].matchAll(/<w:tc\b(?![a-zA-Z])[^>]*>([\s\S]*?)<\/w:tc>/g)) {
      cells.push(renderParagraphs(cm[1], true).trim());
      if (/<w:tcPr\b[^>]*>[\s\S]*?<w:b\b/.test(cm[0]) || /<w:tblHeader\b/.test(cm[0])) header = true;
    }
    if (cells.length) rows.push({ cells, header });
  }
  if (!rows.length) return '';
  // A leading all-bold row is the header
  const firstIsHeader = rows[0].header;
  const head = firstIsHeader ? rows[0] : null;
  const body = firstIsHeader ? rows.slice(1) : rows;
  const th = head ? `<tr>${head.cells.map((c) => `<th>${c}</th>`).join('')}</tr>` : '';
  const trs = body
    .map((r) => `<tr>${r.cells.map((c) => `<td>${c}</td>`).join('')}</tr>`)
    .join('\n');
  return head
    ? `<table>\n<thead>\n${th}\n</thead>\n<tbody>\n${trs}\n</tbody>\n</table>`
    : `<table>\n<tbody>\n${[rows[0], ...body]
        .map((r) => `<tr>${r.cells.map((c) => `<td>${c}</td>`).join('')}</tr>`)
        .join('\n')}\n</tbody>\n</table>`;
}

// ── paragraph rendering ──────────────────────────────────────────────────────
/**
 * Classify one <w:p> into a block descriptor.
 *
 * The source document is hand-authored and inconsistent: some headings carry a
 * real Heading1/2/3 style, others are plain bold runs at sz=24/23/21, and list
 * items are sometimes real ListParagraphs but often literal "• " or "1. "
 * characters in an ordinary paragraph. Both forms must become real <ul>/<ol>.
 */
function classifyParagraph(pXml, inTable = false) {
  const pPr = /<w:pPr\b[^>]*>([\s\S]*?)<\/w:pPr>/.exec(pXml)?.[1] ?? '';
  const pStyle = /<w:pStyle\b[^>]*w:val="([^"]+)"/.exec(pPr)?.[1] ?? '';
  const numId = /<w:numId\b[^>]*w:val="([^"]+)"/.exec(pPr)?.[1];
  const ilvl = Number(/<w:ilvl\b[^>]*w:val="([^"]+)"/.exec(pPr)?.[1] ?? '0');
  // <w:sz> may sit on the run properties rather than the paragraph mark, so
  // scan the whole paragraph. Body copy in this document is default-sized;
  // anything bold and larger than body text is a heading the author styled by hand.
  const sz = Math.max(
    0,
    ...[...pXml.matchAll(/<w:sz\b[^>]*w:val="(\d+)"/g)].map((m) => Number(m[1]))
  );
  const isBold = /<w:b\b(?![a-zA-Z])/.test(pXml);
  const indented = /<w:ind\b[^>]*w:left="\d+"/.test(pPr);

  const content = renderInline(pXml).trim();
  // Bullet/number detection must ignore the <strong> wrapper the author applied
  // to checklist items, so test against the de-marked-up text too.
  const bare = content.replace(/<\/?strong>/g, '');
  const plain = bare.replace(/<[^>]+>/g, '').trim();

  // ── Editorial scaffolding that must never reach the published page ──
  // Everything from "PART 3 | EDITORIAL AUDIT NOTES" onward is internal notes.
  if (/PART\s*\d\s*[|—-]/i.test(plain) || /EDITORIAL AUDIT NOTES/i.test(plain)) {
    return { kind: 'stop' };
  }
  // Preamble: the "Summarize this blog post with: ChatGPT | Perplexity | …" block
  if (/^Summarize this blog post with/i.test(plain)) return { kind: 'drop' };
  // …and the row of AI-summariser links that follows it. The row is made up
  // entirely of anchors labelled ChatGPT / Perplexity / Claude / Grok.
  if (/chatgpt\.com|perplexity\.ai|claude\.ai\/new|grok\.com/i.test(content)) {
    const labels = [...content.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)]
      .map((a) => a[1].replace(/<[^>]+>/g, '').trim());
    // Strip the anchor labels and separators; whatever prose remains means this
    // is a real sentence that merely cites an AI tool, not the preamble row.
    const residue = plain
      .replace(/ChatGPT|Perplexity|Claude|Grok/gi, '')
      .replace(/[\s|,]+/g, '');
    if (labels.length > 0 && labels.every((l) => /^(ChatGPT|Perplexity|Claude|Grok)$/i.test(l)) && !residue) {
      return { kind: 'drop' };
    }
  }
  if (/^HUMAN INPUT NEEDED/i.test(plain)) return { kind: 'drop' };
  if (/^Slot E-\d/i.test(plain)) return { kind: 'drop' };
  // Bracketed CMS placeholders: "[Insert …]", "[Link …]", "[Kim]", "[eight]"
  if (/^\[(Insert|Link)\b/.test(plain)) return { kind: 'drop' };
  // The byline and the "Updated …" note are rendered by the article page header
  if (/^By\s[\w'’ -]+?\|/.test(plain)) return { kind: 'drop' };
  if (/^Updated\s+\w+\s+\d{1,2}\s+\d{4}\s*:/.test(plain)) return { kind: 'drop' };
  // Known stand-alone section labels the author left as plain paragraphs
  if (/^(Takeaways|Key Takeaways|Do This Now|Maintain Security Monthly)$/i.test(plain)) {
    return { kind: 'heading', level: 2, content };
  }
  // Author/reviewer boilerplate and Related Reading are rendered by the site chrome
  if (/^About the Author and Reviewer$/i.test(plain)) return { kind: 'drop' };
  if (/^(Written by|Reviewed by|Headshots:)/i.test(plain)) return { kind: 'drop' };
  if (/^Related Reading$/i.test(plain)) return { kind: 'drop' };

  // ── Figure caption: small indented text under an image ──
  if (sz === 18 && indented && content) return { kind: 'caption', content };

  // ── Images ──
  if (/<w:drawing\b|<w:pict\b/.test(pXml) && !content) {
    return { kind: 'figure', token: renderImage(pXml) };
  }
  if (!content) return { kind: 'empty' };

  // ── List items ──
  // Checked before heading styles: this document marks checklist items with the
  // Heading3 style *and* a literal "• ", and those must become <li>, not <h3>.
  const bullet = /^[\u2022\u00b7\u25cf\u25aa\u2043\u2219]\s+(.*)$/s.exec(bare);
  if (bullet) return { kind: 'li', list: 'ul', text: bullet[1] };
  const numbered = /^(\d{1,2})[.)]\s+(.*)$/s.exec(bare);
  if (numbered) return { kind: 'li', list: 'ol', text: numbered[2] };
  if (/<w:numPr\b/.test(pPr) || /ListParagraph/i.test(pStyle)) {
    return { kind: 'li', list: numId && orderedIds.has(numId) ? 'ol' : 'ul', depth: ilvl, text: content };
  }

  // ── Headings ──
  const heading = /^Heading(\d)$/i.exec(pStyle);
  if (heading) {
    // The document title is rendered by the page <h1>; don't repeat it in the body
    if (Number(heading[1]) === 1) return { kind: 'drop' };
    // A long paragraph wearing a heading style is body copy the author styled
    // by accident (e.g. the "A 10-minute mobile gaming security checklist is…" lede).
    const level = plain.length > 200 ? 0 : Number(heading[1]);
    if (level) return { kind: 'heading', level, content };
  }
  // Pseudo-headings the author styled by hand. They are bold, short and end in
  // a question mark or nothing at all — never a full stop. The explicit font
  // size is unreliable here (some carry no <w:sz> and inherit the document
  // default), so bold + brevity is the dependable signal. Table cells are
  // excluded: a bold cell like "Security dimension" is a column header.
  if (!inTable && isBold && plain.length < 120 && !/\.$/.test(plain)) {
    return { kind: 'heading', level: 3, content: bare };
  }
  // Plain-text labels the author never bolded, e.g. "What Is Mobile Gaming Security?"
  if (!inTable && plain.length < 80 && /^(What|Why|How|Which|When|Where|Who|Is|Are|Do|Does|Can|Should)\b/.test(plain)) {
    return { kind: 'heading', level: 3, content };
  }
  // Bold standalone labels such as "Takeaways" and "Do This Now"
  if (isBold && plain.length < 90 && !/[.!?]$/.test(plain) && !content.includes('<')) {
    return { kind: 'heading', level: 3, content: `<strong>${content}</strong>` };
  }

  return { kind: 'p', content };
}

function renderParagraphs(containerXml, inTable = false) {
  const out = [];
  for (const pm of containerXml.matchAll(
    /<w:p\b(?![a-zA-Z])[^>]*?(?:\/>|>([\s\S]*?)<\/w:p>)/g
  )) {
    const block = classifyParagraph(pm[1] ?? '', inTable);
    if (block.kind === 'drop' || block.kind === 'empty') continue;
    if (block.kind === 'stop') break;
    if (block.kind === 'figure') {
      out.push({ kind: 'figure', token: block.token });
      continue;
    }
    if (block.kind === 'heading') {
      out.push({ kind: 'block', html: `<h${block.level}>${block.content}</h${block.level}>` });
      continue;
    }
    if (block.kind === 'caption') {
      out.push({ kind: 'block', html: `<figcaption>${block.content}</figcaption>` });
      continue;
    }
    if (block.kind === 'li') {
      out.push({ kind: 'li', list: block.list, depth: block.depth ?? 0, text: block.text });
      continue;
    }
    out.push({ kind: 'block', html: `<p>${block.content}</p>` });
  }

  // Merge consecutive list items into a single <ul>/<ol>. Images are emitted as
  // bare tokens; a post-pass wraps each token plus its following <figcaption>
  // in a <figure> (see wrapFigures).
  const final = [];
  let buf = null;
  const flush = () => {
    if (!buf) return;
    final.push(`<${buf.tag}>\n${buf.items.map((i) => `<li>${i}</li>`).join('\n')}\n</${buf.tag}>`);
    buf = null;
  };
  for (const item of out) {
    if (item.kind === 'li') {
      if (buf && buf.tag === item.list && buf.depth === item.depth) buf.items.push(item.text);
      else {
        flush();
        buf = { tag: item.list, depth: item.depth, items: [item.text] };
      }
      continue;
    }
    flush();
    if (item.kind === 'figure') {
      final.push(item.token);
      continue;
    }
    final.push(item.html);
  }
  flush();
  return final.join('\n');
}

/**
 * Wrap each image token (plus an immediately-following <figcaption>) in <figure>.
 * Anchored so a token that is already inside a paragraph is not matched twice.
 */
function wrapFigures(html) {
  return html.replace(
    new RegExp(
      `(^|\\n)(?:<p>)?${TOKEN_OPEN}([^\\n]*?)${TOKEN_CLOSE}(?:</p>)?\\n?` +
        `(?:<p><em>([\\s\\S]*?)<\\/em><\\/p>|<figcaption>([\\s\\S]*?)<\\/figcaption>)?`,
      'g'
    ),
    (_m, lead, img, em, cap) => {
      const caption = cap ?? (em ? `<figcaption>${em}</figcaption>` : '');
      return `${lead}<figure>${img}${caption}</figure>`;
    }
  );
}

// ── numbering: which numIds render as ordered lists? ────────────────────────
const numberingXml = fs.existsSync(path.join(work, 'word', 'numbering.xml'))
  ? fs.readFileSync(path.join(work, 'word', 'numbering.xml'), 'utf8')
  : '';
const orderedIds = new Set();
{
  const numToAbstract = new Map();
  for (const m of numberingXml.matchAll(/<w:num\b[^>]*w:numId="([^"]+)"[^>]*>([\s\S]*?)<\/w:num>/g)) {
    const abs = /<w:abstractNumId\b[^>]*w:val="([^"]+)"/.exec(m[2])?.[1];
    if (abs) numToAbstract.set(m[1], abs);
  }
  for (const m of numberingXml.matchAll(/<w:abstractNum\b[^>]*w:abstractNumId="([^"]+)"[^>]*>([\s\S]*?)<\/w:abstractNum>/g)) {
    const lvl0 = /<w:lvl\b[^>]*w:ilvl="0"[^>]*>([\s\S]*?)<\/w:lvl>/.exec(m[2])?.[1] ?? '';
    const fmt = /<w:numFmt\b[^>]*w:val="([^"]+)"/.exec(lvl0)?.[1];
    if (fmt && fmt !== 'bullet') {
      for (const [numId, absId] of numToAbstract) if (absId === m[1]) orderedIds.add(numId);
    }
  }
}

// ── walk the body in document order ─────────────────────────────────────────
const bodyStart = xml.indexOf('<w:body>');
const bodyEnd = xml.lastIndexOf('</w:body>');
const bodyXml = xml.slice(bodyStart, bodyEnd);

const blocks = [];
{
  const re = /<w:tbl\b(?![a-zA-Z])[^>]*>[\s\S]*?<\/w:tbl>|<w:p\b(?![a-zA-Z])[^>]*?(?:\/>|>[\s\S]*?<\/w:p>)/g;
  let m;
  let pending = [];
  // "PART 3 | EDITORIAL AUDIT NOTES" ends the publishable article. The stop has to
  // be tracked across the whole body walk, not just the current paragraph run,
  // because tables split the body into separate renderParagraphs() calls.
  let stopped = false;
  while ((m = re.exec(bodyXml)) !== null && !stopped) {
    if (m[0].startsWith('<w:tbl')) {
      if (pending.length) { blocks.push(renderParagraphs(pending.join(''))); pending = []; }
      blocks.push(renderTable(m[0]));
    } else {
      // Cheap text-only peek. Must NOT call renderInline here — that would
      // register the paragraph's image in imageMap a second time.
      const text = [...m[0].matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)]
        .map((t) => t[1])
        .join('')
        .trim();
      if (/PART\s*\d\s*[|—-]/i.test(text) || /EDITORIAL AUDIT NOTES/i.test(text)) {
        stopped = true;
        break;
      }
      pending.push(m[0]);
    }
  }
  if (pending.length) blocks.push(renderParagraphs(pending.join('')));
}

const html = wrapFigures(blocks.filter(Boolean).join('\n\n'))
  .replace(/[ \t]+\n/g, '\n')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

/**
 * Emit the article body as a TypeScript module.
 *
 * The body is written as a single-quoted-safe template literal: backticks and
 * ${ are escaped so the generated file cannot break out of the literal, and the
 * block is split into readable chunks at top-level heading boundaries.
 */
function toTypeScript(html) {
  const safe = html
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');

  // Split on blank lines so each paragraph/heading/list is its own line
  const chunks = safe
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean);

  const body = chunks.map((c) => c).join('\n');
  return body;
}

if (outFile) {
  fs.writeFileSync(outFile, html, 'utf8');
  console.log(`[docx-to-html] wrote ${outFile}`);
}
if (mapFile) {
  fs.writeFileSync(mapFile, JSON.stringify(imageMap, null, 2), 'utf8');
  console.log(`[docx-to-html] wrote ${mapFile}`);
}
if (tsOutFile) {
  fs.writeFileSync(tsOutFile, toTypeScript(html), 'utf8');
  console.log(`[docx-to-html] wrote ${tsOutFile}`);
}
const words = html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/g, ' ')
  .split(/\s+/).filter(Boolean).length;
console.log(`[docx-to-html] blocks: ${blocks.length}, images: ${imageMap.length}, words: ${words}`);
if (!outFile) console.log(html);

