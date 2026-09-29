/**
 * Upsert the Gaming PC Security Hardening Guide into Convex.
 *
 * The body, slug, metadata and word count are all imported from
 * src/data/gamingPCSecurityHardeningArticle.ts — the same module the site renders —
 * so the CMS copy can never drift from the published page.
 *
 * Idempotent: re-running updates the existing row rather than duplicating it.
 *
 * Run:
 *   npm run push:gaming-pc-security
 *   (or) npx convex run insertGamingPCSecurityHardeningGuide:upsertGamingPCSecurityGuide
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';
import {
  gamingPCSecurityHardeningArticle,
  GAMING_PC_SECURITY_HARDENING_SLUG,
  GAMING_PC_SECURITY_HARDENING_SUMMARY,
  GAMING_PC_SECURITY_HARDENING_SEO_DESCRIPTION,
  GAMING_PC_SECURITY_HARDENING_TAGS,
  GAMING_PC_SECURITY_HARDENING_HERO,
  GAMING_PC_SECURITY_HARDENING_WORD_COUNT,
  GAMING_PC_SECURITY_HARDENING_READ_TIME,
} from '../src/data/gamingPCSecurityHardeningArticle';

const PUBLISHED_AT = Date.parse('2026-09-29T08:00:00.000Z');
const CANONICAL = `https://thegridnexus.com/article/${GAMING_PC_SECURITY_HARDENING_SLUG}`;

export const upsertGamingPCSecurityGuide = mutation({
  args: {
    trigger: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.trigger === false) return { skipped: true };

    const existing = await ctx.db
      .query('content')
      .withIndex('by_slug', (q) => q.eq('slug', GAMING_PC_SECURITY_HARDENING_SLUG))
      .unique();
    if (existing) {
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
      title: gamingPCSecurityHardeningArticle.title,
      slug: GAMING_PC_SECURITY_HARDENING_SLUG,
      subtitle:
        'Memory Integrity, VBS, Secure Boot, TPM 2.0 and FPS-safe Windows hardening for gaming PCs in 2026',
      summary: GAMING_PC_SECURITY_HARDENING_SUMMARY,
      seoDescription: GAMING_PC_SECURITY_HARDENING_SEO_DESCRIPTION,
      body: gamingPCSecurityHardeningArticle.content,
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
      featuredImageUrl: GAMING_PC_SECURITY_HARDENING_HERO,
      focusKeyword: 'gaming PC security hardening guide Memory Integrity VBS FPS Windows 11 2026',
      gamingPlatforms: GAMING_PC_SECURITY_HARDENING_TAGS,
      viewCount: 0,
      wordCount: GAMING_PC_SECURITY_HARDENING_WORD_COUNT,
      estimatedReadingTimeMinutes: GAMING_PC_SECURITY_HARDENING_READ_TIME,
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
      slug: GAMING_PC_SECURITY_HARDENING_SLUG,
      wordCount: GAMING_PC_SECURITY_HARDENING_WORD_COUNT,
      readTime: GAMING_PC_SECURITY_HARDENING_READ_TIME,
      replaced: Boolean(existing),
    };
  },
});

export const insertGamingPCSecurityGuide = upsertGamingPCSecurityGuide;
