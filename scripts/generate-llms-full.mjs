/**
 * Generate llms-full.txt — concatenated full article text for LLM training/RAG.
 *
 * llms.txt is a directory/map; llms-full.txt is the full-text corpus that
 * training and retrieval pipelines actually ingest. Reuses the same build-time
 * content source as the sitemap/static-HTML generators so the corpus always
 * matches what the site serves.
 *
 * Wire into the build (prebuild:seo) so it stays in sync with the snapshot.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadPublishedContent } from './lib/content-source.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BASE_URL = 'https://thegridnexus.com';

function stripTags(html) {
  return String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  const { items, source } = await loadPublishedContent();
  const blocks = items.map((a) =>
    [
      `# ${a.metaTitle || a.title}`,
      `URL: ${BASE_URL}/article/${a.slug}`,
      `Author: ${a.authorName || 'The Grid Nexus Editorial Team'}`,
      `Published: ${a.publishedAt || ''}`,
      `Topics: ${(a.tags || []).join(', ')}`,
      '',
      stripTags(a.body),
    ].join('\n'),
  );

  const body = blocks.join('\n\n---\n\n') + '\n';
  const outPublic = path.join(projectRoot, 'public', 'llms-full.txt');
  fs.writeFileSync(outPublic, body, 'utf8');
  // Also write to dist/ (production builds run this AFTER vite build has already
  // copied public/ -> dist/, so dist/ needs a direct write — same as sitemaps).
  const distDir = path.join(projectRoot, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'llms-full.txt'), body, 'utf8');
  }
  console.log(
    `Wrote ${items.length} articles (source: ${source}) -> public/llms-full.txt ` +
      `(${(fs.statSync(outPublic).size / 1024).toFixed(0)} KB)`,
  );
}

main().catch((error) => {
  console.error('generate-llms-full failed:', error);
  process.exit(1);
});
