/**
 * Diagnostic: list every mobile-gaming article across the three sources that
 * feed a page render — the Convex CMS, the committed content snapshot and the
 * in-app mock data — plus which slugs are wired into links/sitemaps.
 *
 * Run: node scripts/audit-mobile-gaming-slugs.mjs
 */
import fs from 'fs';

const SLUG_RE = /mobile-gaming-security-guide(?:-ios-android)?/g;

/** Collect unique slug occurrences from a file's text. */
function slugsIn(text) {
  return [...new Set(text.match(SLUG_RE) ?? [])];
}

const report = {};

// 1. Files that reference either slug (source of links / sitemaps)
const watched = [
  'src/data/mobileGamingSecurityArticle.ts',
  'src/data/mockData.ts',
  'src/data/content-snapshot.json',
  'src/lib/findMockArticle.ts',
  'src/lib/contentMapper.ts',
  'src/components/layout/Footer.tsx',
  'src/components/RelatedArticles.tsx',
  'scripts/generate-feed.mjs',
  'scripts/syncMobileGamingSnapshot.ts',
  'convex/insertMobileGamingSecurityGuide.ts',
  'prerender-routes.json',
  'public/sitemap-articles.xml',
  'public/sitemap-news.xml',
  'public/feed.xml',
  'public/rss.xml',
];

report.fileReferences = {};
for (const f of watched) {
  report.fileReferences[f] = fs.existsSync(f) ? slugsIn(fs.readFileSync(f, 'utf8')) : 'MISSING';
}

// 2. Content snapshot: both entries side by side
const snapshot = JSON.parse(fs.readFileSync('src/data/content-snapshot.json', 'utf8'));
report.snapshot = snapshot.items
  .filter((i) => SLUG_RE.test(String(i.slug)) || /mobile gaming/i.test(String(i.title)))
  .map((i) => ({
    slug: i.slug,
    id: i._id,
    words: i.wordCount,
    images: (String(i.body).match(/<img /g) ?? []).length,
    escapedTags: /&lt;p&gt;|&lt;h2&gt;/.test(String(i.body)),
    semantic: /<p>/.test(String(i.body)) && /<h2>/.test(String(i.body)),
    mojibake: /â€|Ã/.test(String(i.body)),
  }));
// reset lastIndex — SLUG_RE is global and shared
SLUG_RE.lastIndex = 0;

// 3. mockData: duplicate slug check
const mock = fs.readFileSync('src/data/mockData.ts', 'utf8');
const mockSlugs = [...mock.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
report.mockDuplicates = [...new Set(mockSlugs.filter((s, i) => mockSlugs.indexOf(s) !== i))];

console.log(JSON.stringify(report, null, 2));
