/**
 * Generate RSS/Atom feed for The Grid Nexus from the real content snapshot
 * (only on-niche, indexable articles — no mock/fabricated slugs).
 * Run with: node scripts/generate-feed.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadPublishedContent } from './lib/content-source.mjs';
import { isOnNicheArticle } from './lib/off-niche-articles.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const BASE_URL = 'https://thegridnexus.com';
const SITE_NAME = 'The Grid Nexus';
const AUTHOR = 'Kim Njuki';

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html) {
  return String(html ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function main() {
  const { items } = await loadPublishedContent();
  const articles = items
    .filter((a) => isOnNicheArticle(a) && a.noindex !== true)
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

  const entries = articles.map((a) => {
    const url = `${BASE_URL}/article/${a.slug}`;
    const excerpt = a.summary || a.description || a.excerpt || stripHtml(a.body).slice(0, 200);
    const published = a.publishedAt ? new Date(a.publishedAt).toISOString() : new Date().toISOString();
    return { url, title: a.title, excerpt, published };
  });

  const now = new Date().toISOString();

  const atom = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_NAME)} — Gaming Security for Players</title>
  <subtitle>Account protection, scam awareness, and platform-specific security guidance for players.</subtitle>
  <link href="${BASE_URL}/feed.xml" rel="self"/>
  <link href="${BASE_URL}"/>
  <updated>${now}</updated>
  <author><name>${escapeXml(AUTHOR)}</name></author>
  <id>${BASE_URL}/</id>
  ${entries.map((e) => `
  <entry>
    <title>${escapeXml(e.title)}</title>
    <link href="${e.url}"/>
    <updated>${e.published}</updated>
    <author><name>${escapeXml(AUTHOR)}</name></author>
    <id>${e.url}</id>
    <summary>${escapeXml(e.excerpt)}</summary>
  </entry>`).join('')}
</feed>`;

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Gaming Security for Players</title>
    <link>${BASE_URL}</link>
    <description>Account protection, scam awareness, and platform-specific security guidance for players.</description>
    <language>en</language>
    <lastBuildDate>${new Date(now).toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/atom+xml"/>
    ${entries.map((e) => `
    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${e.url}</link>
      <guid isPermaLink="true">${e.url}</guid>
      <pubDate>${new Date(e.published).toUTCString()}</pubDate>
      <author>${escapeXml(AUTHOR)}</author>
      <description>${escapeXml(e.excerpt)}</description>
    </item>`).join('')}
  </channel>
</rss>`;

  const outDir = path.join(projectRoot, 'public');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'feed.xml'), atom, 'utf-8');
  fs.writeFileSync(path.join(outDir, 'rss.xml'), rss, 'utf-8');
  console.log(`Feeds generated: ${entries.length} on-niche articles → public/feed.xml, public/rss.xml`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
