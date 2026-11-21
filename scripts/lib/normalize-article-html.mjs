/**
 * Build-time mirror of src/lib/articleHtml.ts.
 *
 * The static-article, feed and sitemap generators run in plain Node and cannot
 * import the TypeScript module, so the two conversions the app applies at render
 * time are duplicated here:
 *
 *   1. repairMojibake       — UTF-8 text that was decoded as Windows-1252
 *                             ("â€”" instead of an em dash, "â€¢" instead of a
 *                             bullet).
 *   2. expandInlineBulletRuns — bullet characters buried inside a single <p>
 *                             become a real <ul>/<li> list.
 *
 * Keep this file and src/lib/articleHtml.ts in step; both are covered by
 * scripts/verify-article-html.mjs.
 */

/** Windows-1252 0x80–0x9F → code point. */
const CP1252_TO_BYTE = {
  '\u20ac': 0x80, '\u201a': 0x82, '\u0192': 0x83, '\u201e': 0x84, '\u2026': 0x85,
  '\u2020': 0x86, '\u2021': 0x87, '\u02c6': 0x88, '\u2030': 0x89, '\u0160': 0x8a,
  '\u2039': 0x8b, '\u0152': 0x8c, '\u017d': 0x8e, '\u2018': 0x91, '\u2019': 0x92,
  '\u201c': 0x93, '\u201d': 0x94, '\u2022': 0x95, '\u2013': 0x96, '\u2014': 0x97,
  '\u02dc': 0x98, '\u2122': 0x99, '\u0161': 0x9a, '\u203a': 0x9b, '\u0153': 0x9c,
  '\u017e': 0x9e, '\u0178': 0x9f,
};

function toCp1252Byte(char) {
  const code = char.charCodeAt(0);
  if (code <= 0xff) return code;
  return Object.prototype.hasOwnProperty.call(CP1252_TO_BYTE, char) ? CP1252_TO_BYTE[char] : null;
}

export function repairMojibake(input) {
  if (!input) return '';

  let out = '';
  let i = 0;

  while (i < input.length) {
    const code = input.charCodeAt(i);
    const runLength = code === 0xe2 ? 3 : code === 0xc2 || code === 0xc3 ? 2 : 0;

    if (runLength > 1 && i + runLength <= input.length) {
      const bytes = [];
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
          const decoded = new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes));
          if (decoded.length === 1) {
            const decodedCode = decoded.charCodeAt(0);
            if (decodedCode >= 0xa0 || decodedCode === 0x20) {
              out += decoded;
              i += runLength;
              continue;
            }
          }
        } catch {
          // Not valid UTF-8 once re-encoded — leave the text untouched.
        }
      }
    }

    out += input[i];
    i += 1;
  }

  return out;
}

export function expandInlineBulletRuns(html) {
  if (!html || !html.includes('\u2022')) return html;

  return html.replace(/<p(\s[^>]*)?>([\s\S]*?)<\/p>/gi, (whole, attrs, inner) => {
    const attributes = typeof attrs === 'string' ? attrs : '';
    const body = typeof inner === 'string' ? inner : '';
    if (!body.includes('\u2022')) return whole;
    if (/<(ul|ol|li)\b/i.test(body)) return whole;

    const parts = body.split(/\s*\u2022\s*/);
    if (parts.length < 3) return whole;

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
 * Mirrors stripFrontMatter in src/lib/articleHtml.ts. Some CMS exports store
 * the body as "---\nmeta_title: …\n---\n<p>Real content…</p>"; rendering that
 * raw prints the metadata block as visible body text.
 */
export function stripFrontMatter(input) {
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
function stripMetadataLines(body) {
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

export function normalizeArticleHtml(html) {
  if (!html) return '';
  return expandInlineBulletRuns(repairMojibake(stripFrontMatter(html)));
}
