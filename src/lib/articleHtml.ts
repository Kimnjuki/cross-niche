/**
 * Article body normalisation.
 *
 * Two defects recur in bodies that reach us from the CMS and the DOCX →
 * HTML conversion for the mobile gaming guide:
 *
 * 1. Mojibake. UTF-8 text decoded as Windows-1252 leaves sequences such as
 *    "â€”" (em dash), "â€™" (right single quote) and "â€¢" (bullet) in the
 *    stored HTML. Editors see them as garbage on the published page.
 * 2. Inline bullet runs. A markdown-style list pasted into an HTML paragraph
 *    ("Examples include:• A …• B …- C …") arrives as one <p>. The browser
 *    collapses the newlines, so the bullets render as literal characters in a
 *    single blob instead of a list.
 *
 * Both conversions are conservative: they only rewrite a character when the
 * decoded result is a single printable code point, and only split a paragraph
 * when it contains at least two bullet markers.
 *
 * Keep in sync with scripts/lib/normalize-article-html.mjs (the build-time
 * mirror used by the static HTML / feed generators, which cannot import TS).
 */

/**
 * Windows-1252 0x80–0x9F → code point. These are the characters that appear
 * when UTF-8 continuation bytes 0x80–0x9F are decoded as Windows-1252.
 */
const CP1252_TO_BYTE: Record<string, number> = {
  '\u20ac': 0x80, // €
  '\u201a': 0x82, // ‚
  '\u0192': 0x83, // ƒ
  '\u201e': 0x84, // „
  '\u2026': 0x85, // …
  '\u2020': 0x86, // †
  '\u2021': 0x87, // ‡
  '\u02c6': 0x88, // ˆ
  '\u2030': 0x89, // ‰
  '\u0160': 0x8a, // Š
  '\u2039': 0x8b, // ‹
  '\u0152': 0x8c, // Œ
  '\u017d': 0x8e, // Ž
  '\u2018': 0x91, // ‘
  '\u2019': 0x92, // ’
  '\u201c': 0x93, // “
  '\u201d': 0x94, // ”
  '\u2022': 0x95, // •
  '\u2013': 0x96, // –
  '\u2014': 0x97, // —
  '\u02dc': 0x98, // ˜
  '\u2122': 0x99, // ™
  '\u0161': 0x9a, // š
  '\u203a': 0x9b, // ›
  '\u0153': 0x9c, // œ
  '\u017e': 0x9e, // ž
  '\u0178': 0x9f, // Ÿ
};

/** Code point → the Windows-1252 byte it would have produced, or null. */
function toCp1252Byte(char: string): number | null {
  const code = char.charCodeAt(0);
  if (code <= 0xff) return code;
  return CP1252_TO_BYTE[char] ?? null;
}

/**
 * Repair UTF-8-as-Windows-1252 mojibake.
 *
 * Walks the string looking for the lead bytes of a mis-decoded UTF-8 sequence
 * (0xC2/0xC3 = two bytes, 0xE2 = three bytes as CP1252 characters), re-encodes
 * exactly that many characters back to bytes and re-decodes them as UTF-8. If
 * the round trip does not produce a single printable character the text is left
 * untouched, so ordinary prose is never corrupted.
 */
export function repairMojibake(input: string | null | undefined): string {
  if (!input) return '';

  let out = '';
  let i = 0;

  while (i < input.length) {
    const code = input.charCodeAt(i);
    const runLength = code === 0xe2 ? 3 : code === 0xc2 || code === 0xc3 ? 2 : 0;

    if (runLength > 1 && i + runLength <= input.length) {
      const bytes: number[] = [];
      let encodable = true;
      for (let k = 0; k < runLength; k += 1) {
        const byte = toCp1252Byte(input[i + k]);
        if (byte === null) {
          encodable = false;
          break;
        }
        bytes.push(byte);
      }

      if (encodable) {
        try {
          const decoded = new TextDecoder('utf-8', { fatal: true }).decode(
            new Uint8Array(bytes),
          );
          if (decoded.length === 1) {
            const decodedCode = decoded.charCodeAt(0);
            // Printable only — never emit C0/C1 control characters.
            if (decodedCode >= 0xa0 || decodedCode === 0x20) {
              out += decoded;
              i += runLength;
              continue;
            }
          }
        } catch {
          // Not a valid UTF-8 sequence after re-encoding — leave the text alone.
        }
      }
    }

    out += input[i];
    i += 1;
  }

  return out;
}

/**
 * Convert bullet characters that ended up inside a single <p> into a real list.
 * A lead-in sentence is preserved as its own paragraph:
 *   <p>Examples include:• A … • B …</p>
 *   → <p>Examples include:</p><ul><li>A …</li><li>B …</li></ul>
 */
export function expandInlineBulletRuns(html: string): string {
  if (!html || !html.includes('\u2022')) return html;

  return html.replace(/<p(\s[^>]*)?>([\s\S]*?)<\/p>/gi, (whole, attrs, inner) => {
    const attributes = typeof attrs === 'string' ? attrs : '';
    const body = typeof inner === 'string' ? inner : '';
    if (!body.includes('\u2022')) return whole;
    // Never touch material that is already a list.
    if (/<(ul|ol|li)\b/i.test(body)) return whole;

    const parts = body.split(/\s*\u2022\s*/);
    if (parts.length < 3) return whole; // need at least two bullets

    const lead = (parts.shift() ?? '').trim();
    const items = parts
      .map((part) => part.trim().replace(/^[-–—]\s*/, ''))
      .filter(Boolean);
    if (items.length < 2) return whole;

    const leadHtml = lead ? `<p${attributes}>${lead}</p>\n` : '';
    const list = `<ul>\n${items.map((item) => `  <li>${item}</li>`).join('\n')}\n</ul>`;
    return `${leadHtml}${list}`;
  });
}

/**
 * Strip a leading YAML front-matter block from an article body.
 *
 * Some CMS exports store the body as:
 *
 *   ---
 *   meta_title: Is Retrac Safe?
 *   meta_description: …
 *   ---
 *   <p>Real content…</p>
 *
 * When the template renders the raw body, that block becomes visible body text
 * ("---" delimiters and "meta-*" lines), which pollutes the snippet and makes
 * the page look broken. The metadata belongs in <head>, never in the body.
 *
 * Rules (deliberately conservative):
 *  - The block must start at the very beginning of the body (leading whitespace
 *    allowed) and open with a `---` line.
 *  - A closing `---` line must exist; an unterminated block is left untouched
 *    so a legitimate horizontal rule at the top of an article survives.
 *  - After the block, any contiguous run of `meta-*:` / `meta_*:` lines is
 *    removed too — some exports emit the metadata keys without the delimiters.
 */
export function stripFrontMatter(input: string | null | undefined): string {
  if (!input) return '';

  const text = String(input);
  const leading = text.match(/^\s*/)?.[0] ?? '';
  const body = text.slice(leading.length);

  // Case 1 — delimited YAML front matter.
  if (/^---[ \t]*\r?\n/.test(body)) {
    const closing = /^---[ \t]*$/m.exec(body.slice(4));
    if (closing && closing.index !== undefined) {
      const block = body.slice(4, 4 + closing.index);
      // Require at least one `key:` line so a legitimate horizontal rule at the
      // top of an article is not mistaken for front matter.
      if (/^[ \t]*[A-Za-z0-9_-]+[ \t]*:/m.test(block)) {
        const afterBlock = body.slice(4 + closing.index + closing[0].length);
        return stripMetadataLines(afterBlock.replace(/^\r?\n/, ''));
      }
    }
  }

  // Case 2 — undelimited metadata keys at the top of the body.
  return stripMetadataLines(body);
}

/** Remove a contiguous run of `meta-*:` / `meta_*:` lines from the top of a body. */
function stripMetadataLines(body: string): string {
  const lines = body.split(/\r?\n/);
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (/^\s*meta[-_][a-z0-9_-]*\s*:/i.test(line)) {
      index += 1;
      continue;
    }
    break;
  }
  if (index === 0) return body;
  return lines.slice(index).join('\n');
}

/** Full clean-up pass for an article body: strip front matter, repair encoding, fix lists. */
export function normalizeArticleHtml(html: string | null | undefined): string {
  if (!html) return '';
  return expandInlineBulletRuns(repairMojibake(stripFrontMatter(html)));
}
