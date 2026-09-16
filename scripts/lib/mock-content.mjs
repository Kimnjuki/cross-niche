/**
 * Shared mockData.ts reader for build-time generators.
 *
 * Extracted from scripts/generate-static-articles.mjs so the sitemap, prerender
 * and static-HTML generators all share ONE correct parser. The previous
 * per-script copies each carried the V-06 truncation bug independently.
 *
 * IMPORTANT: mockData.ts article bodies are stored as either template literals
 * (backticks) or single-quoted strings containing escaped apostrophes (\').
 * Capturing them with [^']* truncates the body at the first escaped quote, so
 * every pattern below is escape-aware.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(__dirname, '..', '..');

/**
 * Decode a raw JS/TS string-literal body captured from source text.
 */
export function unescapeJsString(raw) {
  if (!raw) return '';
  return raw.replace(/\\([\s\S])/g, (_, ch) => {
    switch (ch) {
      case 'n':
        return '\n';
      case 't':
        return '\t';
      case 'r':
        return '\r';
      case '\\':
        return '\\';
      case "'":
        return "'";
      case '"':
        return '"';
      case '`':
        return '`';
      case '$':
        return '$';
      default:
        return ch;
    }
  });
}

// Escape-aware on both the template-literal and single-quoted branches.
const RE = {
  id: /id:\s*'([^']+)'/,
  slug: /slug:\s*'([^']+)'/,
  title: /title:\s*'((?:\\[\s\S]|[^'\\])*)'/,
  excerpt: /excerpt:\s*'((?:\\[\s\S]|[^'\\])*)'/,
  content: /content:\s*(?:`((?:\\[\s\S]|[^`\\])*)`|'((?:\\[\s\S]|[^'\\])*)')/,
  publishedAt: /publishedAt:\s*'([^']+)'/,
  author: /author:\s*'((?:\\[\s\S]|[^'\\])*)'/,
  niche: /niche:\s*'([^']+)'/,
  readTime: /readTime:\s*(\d+)/,
  imageUrl: /imageUrl:\s*'([^']+)'/,
  tags: /tags:\s*\[([^\]]*)\]/,
};

/**
 * Parse articles out of src/data/mockData.ts.
 * @returns {Array<object>} normalized items (see scripts/lib/content-source.mjs)
 */
export function parseMockArticles() {
  const mockDataPath = path.join(projectRoot, 'src', 'data', 'mockData.ts');
  if (!fs.existsSync(mockDataPath)) return [];

  const source = fs.readFileSync(mockDataPath, 'utf8');
  const blocks = source.split(/\n\s*\{\n/).slice(1);
  const articles = [];

  for (const block of blocks) {
    const idMatch = block.match(RE.id);
    const slugMatch = block.match(RE.slug);
    if (!idMatch || !slugMatch) continue;

    const titleMatch = block.match(RE.title);
    const excerptMatch = block.match(RE.excerpt);
    const contentMatch = block.match(RE.content);
    const publishedMatch = block.match(RE.publishedAt);
    const authorMatch = block.match(RE.author);
    const nicheMatch = block.match(RE.niche);
    const readTimeMatch = block.match(RE.readTime);
    const imageMatch = block.match(RE.imageUrl);
    const tagsMatch = block.match(RE.tags);

    const tags = tagsMatch
      ? tagsMatch[1]
          .split(',')
          .map((t) => t.trim().replace(/^'|'$/g, ''))
          .filter(Boolean)
      : [];

    const body = contentMatch ? unescapeJsString(contentMatch[1] ?? contentMatch[2]) : '';
    const excerpt = excerptMatch ? unescapeJsString(excerptMatch[1]) : '';

    articles.push({
      id: idMatch[1],
      slug: slugMatch[1],
      title: titleMatch ? unescapeJsString(titleMatch[1]) : '',
      metaTitle: titleMatch ? unescapeJsString(titleMatch[1]) : '',
      description: excerpt,
      excerpt,
      body,
      summary: excerpt,
      contentType: nicheMatch ? nicheMatch[1] : 'tech',
      publishedAt: publishedMatch ? publishedMatch[1] : '',
      lastModified: publishedMatch ? publishedMatch[1] : '',
      authorName: authorMatch ? unescapeJsString(authorMatch[1]) : 'The Grid Nexus Editorial Team',
      readTime: readTimeMatch ? parseInt(readTimeMatch[1], 10) : 5,
      featuredImageUrl: imageMatch ? imageMatch[1] : '',
      isFeatured: false,
      isBreaking: false,
      tags,
      source: 'mockData',
    });
  }

  return articles;
}
