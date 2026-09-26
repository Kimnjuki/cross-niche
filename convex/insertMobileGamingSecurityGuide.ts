/**
 * Upsert the Mobile Gaming Security Guide into Convex.
 *
 * The body, slug, metadata and word count are all imported from
 * src/data/mobileGamingSecurityArticle.ts — the same module the site renders —
 * so the CMS copy can never drift from the published page. (The previous version
 * carried a hand-copied, truncated body and a hardcoded wordCount: 1.)
 *
 * Idempotent: re-running updates the existing row rather than duplicating it.
 *
 * Run:
 *   npm run push:mobile-gaming
 *   (or) npx convex run insertMobileGamingSecurityGuide:upsertMobileGamingGuide
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';
import {
  mobileGamingSecurityArticle,
  MOBILE_GAMING_SECURITY_SLUG,
  MOBILE_GAMING_SECURITY_SUMMARY,
  MOBILE_GAMING_SECURITY_SEO_DESCRIPTION,
  MOBILE_GAMING_SECURITY_TAGS,
  MOBILE_GAMING_SECURITY_HERO,
  MOBILE_GAMING_SECURITY_WORD_COUNT,
  MOBILE_GAMING_SECURITY_READ_TIME,
} from '../src/data/mobileGamingSecurityArticle';

const PUBLISHED_AT = Date.parse('2026-09-24T08:00:00.000Z');
const CANONICAL = `https://thegridnexus.com/article/${MOBILE_GAMING_SECURITY_SLUG}`;

export const upsertMobileGamingGuide = mutation({
  args: {
    // Optional so `npm run push:mobile-gaming` needs no payload; kept as an
    // explicit opt-in so the mutation is never wired to a hot path by accident.
    trigger: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.trigger === false) return { skipped: true };

    // Replace the row if it already exists so re-runs never duplicate the article
    const existing = await ctx.db
      .query('content')
      .withIndex('by_slug', (q) => q.eq('slug', MOBILE_GAMING_SECURITY_SLUG))
      .unique();
    if (existing) {
      // Convex has no cascade, so detach the old niche/feed links first —
      // otherwise every re-run leaves orphan rows behind.
      for (const stale of await ctx.db
        .query('contentNiches')
        .withIndex('by_content', (q) => q.eq('contentId', existing._id))
        .collect()) {
        await ctx.db.delete(stale._id);
      }
      for (const stale of await ctx.db
        .query('contentFeeds')
        .withIndex('by_content', (q) => q.eq('contentId', existing._id))
        .collect()) {
        await ctx.db.delete(stale._id);
      }
      await ctx.db.delete(existing._id);
    }

    const contentId = await ctx.db.insert('content', {
      title: mobileGamingSecurityArticle.title,
      slug: MOBILE_GAMING_SECURITY_SLUG,
      subtitle:
        'Lock down iOS and Android gaming accounts with unique passwords, two-factor authentication, passkeys and official app stores',
      summary: MOBILE_GAMING_SECURITY_SUMMARY,
      seoDescription: MOBILE_GAMING_SECURITY_SEO_DESCRIPTION,
      body: mobileGamingSecurityArticle.content,
      status: 'published',
      publishedAt: PUBLISHED_AT,
      lastModifiedAt: PUBLISHED_AT,
      contentType: 'gaming',
      isFeatured: true,
      isBreaking: false,
      isPremium: false,
      isAutomated: false,
      editorialLevel: 'high',
      source: 'thegridnexus.com',
      originalUrl: CANONICAL,
      canonicalUrl: CANONICAL,
      featuredImageUrl: MOBILE_GAMING_SECURITY_HERO,
      focusKeyword: 'mobile gaming security guide iOS Android 2026',
      gamingPlatforms: MOBILE_GAMING_SECURITY_TAGS,
      viewCount: 0,
      wordCount: MOBILE_GAMING_SECURITY_WORD_COUNT,
      estimatedReadingTimeMinutes: MOBILE_GAMING_SECURITY_READ_TIME,
    });

    const niche = await ctx.db
      .query('niches')
      .withIndex('by_name', (q) => q.eq('name', 'Gaming'))
      .first();
    if (niche) {
      await ctx.db.insert('contentNiches', {
        contentId,
        nicheId: niche.idNum,
      });
    }

    const feed = await ctx.db
      .query('feeds')
      .withIndex('by_slug', (q) => q.eq('slug', 'play'))
      .first();
    if (feed) {
      await ctx.db.insert('contentFeeds', {
        contentId,
        feedId: feed._id,
      });
    }

    return {
      contentId,
      slug: MOBILE_GAMING_SECURITY_SLUG,
      wordCount: MOBILE_GAMING_SECURITY_WORD_COUNT,
      readTime: MOBILE_GAMING_SECURITY_READ_TIME,
      replaced: Boolean(existing),
    };
  },
});

/** Legacy export name kept so existing runbooks and CI steps keep working. */
export const insertMobileGamingGuide = upsertMobileGamingGuide;
