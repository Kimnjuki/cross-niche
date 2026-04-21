import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Copy sitemaps from public to dist after build
const copySitemaps = () => {
  try {
    const publicSitemap = path.join(projectRoot, 'public', 'sitemap.xml');
    const publicNewsSitemap = path.join(projectRoot, 'public', 'sitemap-news.xml');
    const distSitemap = path.join(projectRoot, 'dist', 'sitemap.xml');
    const distNewsSitemap = path.join(projectRoot, 'dist', 'sitemap-news.xml');

    if (fs.existsSync(publicSitemap)) {
      fs.copyFileSync(publicSitemap, distSitemap);
      console.log('[OK] Sitemap copied to dist/');
    }

    if (fs.existsSync(publicNewsSitemap)) {
      fs.copyFileSync(publicNewsSitemap, distNewsSitemap);
      console.log('[OK] News sitemap copied to dist/');
    }
  } catch (error) {
    console.error('Error copying sitemaps:', error);
    process.exit(1);
  }
};

copySitemaps();
