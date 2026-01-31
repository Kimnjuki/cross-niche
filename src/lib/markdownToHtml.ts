/**
 * Simple markdown-to-HTML converter for article content.
 * Handles common markdown syntax without external dependencies.
 */

export function markdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') return '';
  
  // If content already contains HTML tags, return as-is
  if (/<[^>]+>/.test(markdown)) {
    return markdown;
  }

  let html = markdown;

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

  // Bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ -> <em>text</em>
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Links: [text](url) -> <a href="url">text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Inline code: `code` -> <code>code</code>
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquotes: > text -> <blockquote>text</blockquote>
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rule: --- or *** -> <hr>
  html = html.replace(/^(---|===|\*\*\*)$/gm, '<hr>');

  // Unordered lists: - item or * item
  html = html.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Ordered lists: 1. item
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

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

  return html;
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
