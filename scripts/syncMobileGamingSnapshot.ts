/**
 * Sync the mobile gaming security guide into the committed content snapshot.
 *
 * The build-time sitemap / static-article / prerender generators read
 * src/data/content-snapshot.json in preference to Convex and mockData
 * (see scripts/lib/content-source.mjs), so an article that exists only in
 * mockData.ts never reaches sitemaps or static HTML. This script injects the
 * guide as a Convex-shaped doc, using src/data/mobileGamingSecurityArticle.ts as
 * the single source of truth.
 *
 * Idempotent — re-running replaces the existing entry instead of duplicating it.
 *
 * Run: npx tsx scripts/sync-mobile-gaming-snapshot.ts
 */
import fs from 'fs';
import path from 'path';
import {
  mobileGamingSecurityArticle,
  MOBILE_GAMING_SECURITY_SLUG,
  MOBILE_GAMING_SECURITY_SUMMARY,
  MOBILE_GAMING_SECURITY_SEO_DESCRIPTION,
  MOBILE_GAMING_SECURITY_TAGS,
  MOBILE_GAMING_SECURITY_HERO,
  MOBILE_GAMING_SECURITY_ID,
  MOBILE_GAMING_SECURITY_WORD_COUNT,
  MOBILE_GAMING_SECURITY_READ_TIME,
} from '../src/data/mobileGamingSecurityArticle';

const SNAPSHOT_PATH = path.resolve('src/data/content-snapshot.json');

type Snapshot = {
  meta: Record<string, unknown> & { count?: number };
  items: Array<Record<string, unknown>>;
};

const snapshot = JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')) as Snapshot;
if (!Array.isArray(snapshot.items)) {
  throw new Error(`Unexpected snapshot shape at ${SNAPSHOT_PATH}`);
}

// Word count is derived from the body in the article module, so the snapshot,
// the CMS row and the rendered page can never disagree.
const wordCount = MOBILE_GAMING_SECURITY_WORD_COUNT;
const published = mobileGamingSecurityArticle.publishedAt;
const stamp = Date.parse(`${published}T08:00:00.000Z`);

const doc: Record<string, unknown> = {
  _id: MOBILE_GAMING_SECURITY_ID,
  _creationTime: stamp,
  title: mobileGamingSecurityArticle.title,
  slug: MOBILE_GAMING_SECURITY_SLUG,
  metaTitle: mobileGamingSecurityArticle.title,
  seoDescription: MOBILE_GAMING_SECURITY_SEO_DESCRIPTION,
  summary: MOBILE_GAMING_SECURITY_SUMMARY,
  subtitle:
    'Lock down iOS and Android gaming accounts with unique passwords, two-factor authentication, passkeys and official app stores',
  body: mobileGamingSecurityArticle.content,
  contentType: 'article',
  author: mobileGamingSecurityArticle.author,
  authorName: mobileGamingSecurityArticle.author,
  publishedAt: stamp,
  lastModifiedAt: stamp,
  featuredImageUrl: MOBILE_GAMING_SECURITY_HERO,
  isFeatured: true,
  isBreaking: false,
  isPremium: false,
  canonicalUrl: mobileGamingSecurityArticle.canonicalUrl,
  estimatedReadingTimeMinutes: MOBILE_GAMING_SECURITY_READ_TIME,
  wordCount,
  viewCount: 0,
  status: 'published',
  isDeleted: false,
  gamingPlatforms: MOBILE_GAMING_SECURITY_TAGS,
  noindex: false,
};

const withoutGuide = snapshot.items.filter((item) => item?.slug !== MOBILE_GAMING_SECURITY_SLUG);
snapshot.items = [doc, ...withoutGuide];
snapshot.meta = { ...snapshot.meta, count: snapshot.items.length };

fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

console.log(`[sync-mobile-gaming-snapshot] wrote ${SNAPSHOT_PATH}`);
console.log(`[sync-mobile-gaming-snapshot] slug: ${MOBILE_GAMING_SECURITY_SLUG}`);
console.log(`[sync-mobile-gaming-snapshot] items: ${snapshot.items.length} (was ${withoutGuide.length})`);
console.log(`[sync-mobile-gaming-snapshot] wordCount: ${wordCount}`);
