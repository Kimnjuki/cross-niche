/**
 * Generate prerender-routes.json for vite-plugin-prerender
 * Reads article slugs from Convex (preferred) or mockData.ts and generates route paths
 */
import fs from 'fs';
import path from 'path';

const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mockData.ts');
const outputPath = path.join(process.cwd(), 'prerender-routes.json');

const routes = [
  '/',
  '/tech',
  '/security',
  '/gaming',
  '/news',
  '/topics',
  '/guides',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/roadmap',
  '/blog-series',
  '/security-profile',
  '/community-threats',
  '/tools',
];

async function fetchConvexRoutes() {
  const convexUrl = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) return [];

  try {
    const { ConvexHttpClient } = await import('convex/browser');
    const client = new ConvexHttpClient(convexUrl);

    const [contentRows, guides, topics] = await Promise.all([
      client.query('content:getAllPublishedContent', {}).catch(() => []),
      client.query('guides:list', {}).catch(() => []),
      client.query('topics:list', {}).catch(() => []),
    ]);

    const articleSlugs = (contentRows ?? [])
      .filter((c) => c.slug && c.status === 'published' && c.isDeleted !== true)
      .map((c) => `/article/${c.slug}`);

    const guideSlugs = (guides ?? [])
      .filter((g) => g.slug && g.isPublished !== false)
      .map((g) => `/guides/${g.slug}`);

    const topicSlugs = (topics ?? [])
      .filter((t) => t.slug)
      .map((t) => `/topics/${t.slug}`);

    return [...articleSlugs, ...guideSlugs, ...topicSlugs];
  } catch (error) {
    console.warn('Failed to fetch Convex routes:', error.message);
    return [];
  }
}

async function main() {
  const convexRoutes = await fetchConvexRoutes();

  if (convexRoutes.length > 0) {
    console.log(`Fetched ${convexRoutes.length} routes from Convex`);
    routes.push(...convexRoutes);
  } else {
    console.log('Convex unavailable, falling back to mockData.ts');

    // Read the mockData file
    const content = fs.readFileSync(mockDataPath, 'utf8');

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
  }

  fs.writeFileSync(outputPath, JSON.stringify(routes, null, 2));
  console.log(`Generated ${routes.length} prerender routes → ${outputPath}`);
}

main();
