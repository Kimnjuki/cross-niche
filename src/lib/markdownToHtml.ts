/**
 * Simple markdown-to-HTML converter for article content.
 * Handles common markdown syntax without external dependencies.
 */

import { normalizeArticleHtml } from './articleHtml';

/**
 * True when a string is already authored as HTML rather than markdown.
 *
 * Article bodies in mockData, Convex and the content snapshot are stored as
 * HTML. Running them through the markdown escape pass turns <p>, <h2> and
 * <div style="…"> into literal visible text, so HTML input must pass through
 * untouched. Requiring a complete tag (`<tag …>`) rather than a bare `<` keeps
 * ordinary prose such as "5 < 10" on the markdown path.
 */
function looksLikeHtml(input: string): boolean {
  return /<(?:[a-z][a-z0-9-]*)(?:\s[^<>]*)?\/?>/i.test(input);
}

export function markdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') return '';

  // Already HTML — return as-is (after the encoding/list repairs) so markup
  // renders instead of showing as text.
  if (looksLikeHtml(markdown)) {
    return normalizeArticleHtml(markdown);
  }

  let html = markdown;

  // Images: ![alt](url) -> <img src="url" alt="alt" />
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4" />');

  // Escape HTML entities first (except for already-HTML content)
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headers: ## Header -> <h2>Header</h2>
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Lists are converted before bold/italic: a "* item" bullet line would
  // otherwise be swallowed by the italic pass and become "<em> item</em>".
  // Blank lines around the generated list keep it out of the paragraph pass.
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
  // The guard keeps bullet markers and bold markers out of the match.
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

  // Paragraphs: wrap lines that aren't already wrapped in tags
  const lines = html.split('\n\n');
  html = lines
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      // Skip blocks that already start with HTML tags
      if (/^<(h[1-6]|ul|ol|li|blockquote|hr|p|div)/.test(trimmed)) {
        return trimmed;
      }
      // Wrap plain text in paragraphs
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    })
    .filter(Boolean)
    .join('\n');

  // Same encoding/bullet repairs the HTML path receives.
  return normalizeArticleHtml(html);
}

/**
 * Safely render content - converts markdown to HTML if needed
 */
export function prepareArticleContent(content: string | null | undefined): string {
  if (!content) return '';
  const trimmed = content.trim();
  if (!trimmed) return '';
  
  // Convert markdown to HTML
  return markdownToHtml(trimmed);
}
