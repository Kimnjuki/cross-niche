/**
 * Generate prerender-routes.json for vite-plugin-prerender
 * Reads article slugs from mockData.ts and generates route paths
 */
import fs from 'fs';
import path from 'path';

const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mockData.ts');
const outputPath = path.join(process.cwd(), 'prerender-routes.json');

// Read the mockData file
const content = fs.readFileSync(mockDataPath, 'utf8');

// Extract all article IDs/slugs from mockData
const routes = ['/', '/tech', '/security', '/gaming', '/news', '/topics', '/guides', '/about', '/contact', '/privacy', '/terms', '/roadmap', '/blog-series', '/security-profile', '/community-threats', '/tools'];

// Find article slugs: prefer explicit slug field over id
const slugPatterns = [/slug:\s*'([^']+)'/g, /id:\s*'([^']+)'/g];
const slugSet = new Set();

// First pass: collect all explicit slugs
let match;
while ((match = slugPatterns[0].exec(content)) !== null) {
  slugSet.add(match[1]);
}
// Second pass: collect all IDs
while ((match = slugPatterns[1].exec(content)) !== null) {
  slugSet.add(match[1]);
}

for (const slug of slugSet) {
  if (slug && slug.length > 5 && !routes.includes(`/article/${slug}`)) {
    routes.push(`/article/${slug}`);
  }
}

// Find niche-based routes: some use /security/{slug} format
const nicheArticleRegex = /(?:niche):\s*'(security|tech|gaming)'.*?(?:slug|id):\s*'([^']+)'/gs;

fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
console.log(`Generated ${routes.length} prerender routes → ${outputPath}`);
