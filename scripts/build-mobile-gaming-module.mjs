/**
 * Rebuild src/data/mobileGamingSecurityArticle.ts from the converted DOCX body.
 *
 * Keeps the module's hand-written header (metadata, FAQ schema, export names)
 * and swaps only the CONTENT template literal, so re-running is safe and the
 * published article always matches the approved Word document.
 *
 * Run: node scripts/build-mobile-gaming-module.mjs <body.html>
 */
import fs from 'fs';

const bodyFile = process.argv[2];
if (!bodyFile) {
  console.error('Usage: node scripts/build-mobile-gaming-module.mjs <body.html>');
  process.exit(1);
}

const TARGET = 'src/data/mobileGamingSecurityArticle.ts';
// Tolerate CRLF sources: normalise before locating the template literal.
const source = fs.readFileSync(TARGET, 'utf8').replace(/\r\n/g, '\n');
const raw = fs.readFileSync(bodyFile, 'utf8');

/**
 * Editorial clean-ups applied after conversion.
 *
 * These are fixes to the source document that must survive re-runs, so they
 * live here rather than being hand-edited into the generated file.
 */
function normalise(html) {
  return (
    html
      // Source typo: stray full stop after "You"
      .replace(/How Can You\. Avoid Gaming Phishing Scams/g, 'How Can You Avoid Gaming Phishing Scams')
      // The checklist lede is body copy the author left in Heading3 style
      .replace(
        /<h3>(A 10-minute mobile gaming security checklist is[^<]{40,}<\/h3>)/,
        '<p>$1</p>'
      )
      // "Takeaways" should sit at the same level as the other section headings
      .replace(/<h2>Takeaways<\/h2>/, '<h2>Key Takeaways</h2>')
      // Collapse any whitespace runs the conversion left behind
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

const body = normalise(raw)
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

// Guardrails: fail the build rather than publish a shrunken or image-less article
const plainText = raw.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
const wordCount = plainText.split(/\s+/).filter(Boolean).length;
const imageCount = (raw.match(/<img /g) ?? []).length;

const problems = [];
if (wordCount < 3000) problems.push(`word count ${wordCount} is below the 3000 minimum`);
if (imageCount < 5) problems.push(`only ${imageCount} of 5 images embedded`);
if (!/<h2>/.test(raw) || !/<p>/.test(raw)) {
  problems.push('no semantic <h2>/<p> markup found — raw HTML may be leaking');
}
if (problems.length) {
  console.error(`[build-mobile-gaming-module] REFUSING TO WRITE:\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}

const startMarker = 'const CONTENT = `\n';
const endMarker = '\n`;';
const start = source.indexOf(startMarker);
if (start === -1) throw new Error('CONTENT start marker not found');
const end = source.indexOf(endMarker, start);
if (end === -1) throw new Error('CONTENT end marker not found');

const next = source.slice(0, start + startMarker.length) + body + source.slice(end);

if (next === source) {
  console.log('[build-mobile-gaming-module] body unchanged');
} else {
  fs.writeFileSync(TARGET, next, 'utf8');
  console.log(`[build-mobile-gaming-module] rewrote CONTENT in ${TARGET}`);
}

const words = plainText.split(/\s+/).filter(Boolean).length;
console.log(`[build-mobile-gaming-module] body words: ${words}, images: ${imageCount}`);
