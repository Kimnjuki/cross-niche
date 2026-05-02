import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Copy sitemaps from public to dist after build
const copySitemaps = () => {
  try {
    const sitemapFiles = ['sitemap.xml', 'sitemap-news.xml', 'sitemap-articles.xml', 'sitemap-index.xml'];
    sitemapFiles.forEach(file => {
      const src = path.join(projectRoot, 'public', file);
      const dest = path.join(projectRoot, 'dist', file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`[OK] ${file} copied to dist/`);
      }
    });
  } catch (error) {
    console.error('Error copying sitemaps:', error);
    process.exit(1);
  }
};

copySitemaps();
