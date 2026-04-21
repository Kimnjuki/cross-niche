/**
 * Regenerate sitemap.xml with updated lastmod dates for specified URLs.
 * Usage: npx tsx scripts/update_sitemap.ts
 * Reads data/urls_to_update.json (optional) or public/sitemap.xml
 * Outputs updated public/sitemap.xml with today's date for changed URLs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const today = new Date().toISOString().split('T')[0];
const dataDir = join(process.cwd(), 'data');
const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
const urlsToUpdatePath = join(dataDir, 'urls_to_update.json');

function main() {
  if (!existsSync(sitemapPath)) {
    console.error('sitemap.xml not found at public/sitemap.xml');
    process.exit(1);
  }
  let xml = readFileSync(sitemapPath, 'utf-8');
  const urlsToUpdate: string[] = existsSync(urlsToUpdatePath)
    ? JSON.parse(readFileSync(urlsToUpdatePath, 'utf-8'))
    : [];
  if (urlsToUpdate.length === 0) {
    xml = xml.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  } else {
    for (const url of urlsToUpdate) {
      const locRegex = new RegExp(`(<url>\\s*<loc>${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\/loc>\\s*)<lastmod>[^<]+</lastmod>`, 'g');
      xml = xml.replace(locRegex, `$1<lastmod>${today}</lastmod>`);
    }
  }
  writeFileSync(sitemapPath, xml);
  console.log(`Updated sitemap.xml with lastmod=${today}`);
}
main();
