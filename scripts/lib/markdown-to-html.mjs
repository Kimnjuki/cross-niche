/**
 * Markdown → HTML for the static build pipeline.
 *
 * Mirrors src/lib/markdownToHtml.ts byte-for-byte so the prerendered static
 * HTML and the hydrated SPA render the SAME article body. Article bodies in
 * Convex/snapshot are stored as Markdown (99 of 102) or HTML (the two flagship
 * guides). The SPA already converts via src/lib/markdownToHtml.ts; this module
 * closes the gap where the static generator was emitting raw `##`/`**` to
 * Google and AI crawlers.
 */
import { normalizeArticleHtml } from './normalize-article-html.mjs';

/** True when a string is already authored as HTML rather than markdown. */
function looksLikeHtml(input) {
  return /<(?:[a-z][a-z0-9-]*)(?:\s[^<>]*)?\/?>/i.test(input);
}

export function markdownToHtml(markdown) {
  if (!markdown || typeof markdown !== 'string') return '';

  // Already HTML — return as-is (after repairs) so markup renders instead of
  // showing as literal text.
  if (looksLikeHtml(markdown)) {
    return normalizeArticleHtml(markdown);
  }

  let html = markdown;

  // Images: ![alt](url) -> <img src="url" alt="alt" />
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4" />');

  // Escape HTML entities first (except for already-HTML content).
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headers: ## Header -> <h2>Header</h2> (longest marker first).
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Unordered lists: - item / * item  → <ul><li>…</li></ul>
  html = html.replace(/(?:^|\n)((?:[-*]\s+.+\n?)+)/g, (_match, block) => {
    const items = String(block)
      .trim()
      .split('\n')
      .map((line) => `<li>${line.replace(/^[-*]\s+/, '')}</li>`)
      .join('\n');
    return `\n\n<ul>\n${items}\n</ul>\n\n`;
  });

  // Ordered lists: 1. item → <ol><li>…</li></ol>
  html = html.replace(/(?:^|\n)((?:\d+\.\s+.+\n?)+)/g, (_match, block) => {
    const items = String(block)
      .trim()
      .split('\n')
      .map((line) => `<li>${line.replace(/^\d+\.\s+/, '')}</li>`)
      .join('\n');
    return `\n\n<ol>\n${items}\n</ol>\n\n`;
  });

  // Bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ -> <em>text</em>
  html = html.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Links: [text](url) -> <a href="url">text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Inline code: `code` -> <code>code</code>
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquotes: > text -> <blockquote>text</blockquote>
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rule: --- or *** -> <hr>
  html = html.replace(/^(---|===|\*\*\*)$/gm, '<hr>');

  // Paragraphs: wrap lines that aren't already wrapped in tags.
  const lines = html.split('\n\n');
  html = lines
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-6]|ul|ol|li|blockquote|hr|p|div)/.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .filter(Boolean)
    .join('\n');

  return normalizeArticleHtml(html);
}
