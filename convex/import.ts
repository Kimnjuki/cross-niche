/**
 * Batch import mutations for CSV → Convex migration.
 * Run from scripts/import-csv-to-convex.mjs via: npx convex run import:<name> '<json>'
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

const nicheRow = v.object({
  idNum: v.number(),
  name: v.string(),
  colorCode: v.optional(v.string()),
});

const tagRow = v.object({
  name: v.string(),
  slug: v.string(),
});

const userRow = v.object({
  supabaseUserId: v.string(),
  username: v.string(),
  email: v.string(),
  role: v.optional(v.string()),
  isPremium: v.optional(v.boolean()),
  displayName: v.optional(v.string()),
  bio: v.optional(v.string()),
  avatarUrl: v.optional(v.string()),
  socialLinks: v.optional(v.any()),
  // CRITICAL: Add new user fields
  emailVerified: v.optional(v.boolean()),
  phoneNumber: v.optional(v.string()),
  location: v.optional(v.string()),
  websiteUrl: v.optional(v.string()),
  twitterHandle: v.optional(v.string()),
  linkedinUrl: v.optional(v.string()),
  githubUrl: v.optional(v.string()),
  createdAt: v.number(),
  lastLoginAt: v.optional(v.number()),
  isActive: v.optional(v.boolean()),
  isBanned: v.optional(v.boolean()),
});

const contentRow = v.object({
  title: v.string(),
  slug: v.string(),
  body: v.string(),
  summary: v.optional(v.string()),
  authorId: v.optional(v.string()),
  status: v.string(),
  isPremium: v.optional(v.boolean()),
  securityScore: v.optional(v.number()),
  publishedAt: v.optional(v.number()),
  subtitle: v.optional(v.string()),
  metaTitle: v.optional(v.string()),
  focusKeyword: v.optional(v.string()),
  wordCount: v.optional(v.number()),
  estimatedReadingTimeMinutes: v.optional(v.number()),
  viewCount: v.optional(v.number()),
  legacyId: v.optional(v.string()),
  featuredImageUrl: v.optional(v.string()),
  isFeatured: v.optional(v.boolean()),
  isBreaking: v.optional(v.boolean()),
  contentType: v.optional(v.union(v.literal("article"), v.literal("review"), v.literal("guide"), v.literal("news"), v.literal("opinion"))),
  // CRITICAL: Add new content fields
  seoDescription: v.optional(v.string()),
  canonicalUrl: v.optional(v.string()),
  schema_org: v.optional(v.any()),
  lastModifiedAt: v.optional(v.number()),
  lastModifiedBy: v.optional(v.string()),
  isDeleted: v.optional(v.boolean()),
  deletedAt: v.optional(v.number()),
});

const contentNicheRow = v.object({
  contentId: v.string(), // Convex Id<"content"> as string
  nicheId: v.number(),
});

const contentTagRow = v.object({
  contentId: v.string(),
  tagId: v.string(), // Convex Id<"tags"> as string
});

const contentTableRow = v.object({
  contentId: v.string(),
  tableTitle: v.optional(v.string()),
  tableData: v.any(),
  orderIndex: v.optional(v.number()),
});

export const insertNichesBatch = mutation({
  args: { items: v.array(nicheRow) },
  handler: async (ctx, { items }) => {
    const ids = [];
    for (const row of items) {
      const id = await ctx.db.insert("niches", {
        idNum: row.idNum,
        name: row.name,
        colorCode: row.colorCode ?? undefined,
      });
      ids.push(id);
    }
    return { ids };
  },
});

export const insertTagsBatch = mutation({
  args: { items: v.array(tagRow) },
  handler: async (ctx, { items }) => {
    const ids = [];
    for (const row of items) {
      const id = await ctx.db.insert("tags", {
        name: row.name,
        slug: row.slug,
      });
      ids.push(id);
    }
    return { ids };
  },
});

export const insertUsersBatch = mutation({
  args: { items: v.array(userRow) },
  handler: async (ctx, { items }) => {
    const ids = [];
    for (const row of items) {
      const id = await ctx.db.insert("users", {
        supabaseUserId: row.supabaseUserId,
        username: row.username,
        email: row.email,
        role: row.role ?? undefined,
        isPremium: row.isPremium ?? undefined,
        displayName: row.displayName ?? undefined,
        bio: row.bio ?? undefined,
        avatarUrl: row.avatarUrl ?? undefined,
        socialLinks: row.socialLinks ?? undefined,
        // CRITICAL: Handle new user fields
        emailVerified: row.emailVerified ?? false,
        phoneNumber: row.phoneNumber ?? undefined,
        location: row.location ?? undefined,
        websiteUrl: row.websiteUrl ?? undefined,
        twitterHandle: row.twitterHandle ?? undefined,
        linkedinUrl: row.linkedinUrl ?? undefined,
        githubUrl: row.githubUrl ?? undefined,
        createdAt: row.createdAt ?? Date.now(),
        lastLoginAt: row.lastLoginAt ?? undefined,
        isActive: row.isActive ?? true,
        isBanned: row.isBanned ?? false,
      });
      ids.push(id);
    }
    return { ids };
  },
});

export const insertContentBatch = mutation({
  args: { items: v.array(contentRow) },
  handler: async (ctx, { items }) => {
    const ids = [];
    for (const row of items) {
      const id = await ctx.db.insert("content", {
        title: row.title,
        slug: row.slug,
        body: row.body,
        summary: row.summary ?? undefined,
        authorId: row.authorId ?? undefined,
        status: row.status,
        isPremium: row.isPremium ?? undefined,
        securityScore: row.securityScore ?? undefined,
        publishedAt: row.publishedAt ?? undefined,
        subtitle: row.subtitle ?? undefined,
        metaTitle: row.metaTitle ?? undefined,
        focusKeyword: row.focusKeyword ?? undefined,
        wordCount: row.wordCount ?? undefined,
        estimatedReadingTimeMinutes: row.estimatedReadingTimeMinutes ?? undefined,
        viewCount: row.viewCount ?? undefined,
        legacyId: row.legacyId ?? undefined,
        featuredImageUrl: row.featuredImageUrl ?? undefined,
        isFeatured: row.isFeatured ?? undefined,
        isBreaking: row.isBreaking ?? undefined,
        contentType: row.contentType ?? undefined,
      });
      ids.push(id);
    }
    return { ids };
  },
});

export const insertContentNichesBatch = mutation({
  args: { items: v.array(contentNicheRow) },
  handler: async (ctx, { items }) => {
    for (const row of items) {
      await ctx.db.insert("contentNiches", {
        contentId: row.contentId as any,
        nicheId: row.nicheId,
      });
    }
    return { count: items.length };
  },
});

export const insertContentTagsBatch = mutation({
  args: { items: v.array(contentTagRow) },
  handler: async (ctx, { items }) => {
    for (const row of items) {
      await ctx.db.insert("contentTags", {
        contentId: row.contentId as any,
        tagId: row.tagId as any,
      });
    }
    return { count: items.length };
  },
});

export const insertContentTablesBatch = mutation({
  args: { items: v.array(contentTableRow) },
  handler: async (ctx, { items }) => {
    for (const row of items) {
      await ctx.db.insert("contentTables", {
        contentId: row.contentId as any,
        tableTitle: row.tableTitle ?? undefined,
        tableData: row.tableData,
        orderIndex: row.orderIndex ?? undefined,
      });
    }
    return { count: items.length };
  },
});
