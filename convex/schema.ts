/**
 * Convex schema – migrated from Supabase (thegridnexus.com)
 *
 * Tables map to: content, users, comments, content_niches, content_tags,
 * content_feeds, feeds, niches, tags, media, content_tables, user_bookmarks.
 *
 * Use this with: npx convex dev (push schema)
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ─── Lookup / reference tables (no app FKs) ─────────────────────────────
  niches: defineTable({
    idNum: v.number(), // Supabase niches.id (smallint) – 1=Tech, 2=Security, 3=Gaming
    name: v.string(),
    colorCode: v.optional(v.string()),
  })
    .index("by_name", ["name"])
    .index("by_id_num", ["idNum"]),

  tags: defineTable({
    name: v.string(),
    slug: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_name", ["name"]),

  feeds: defineTable({
    slug: v.string(),
    name: v.string(),
    isActive: v.optional(v.boolean()),
    displayOrder: v.optional(v.number()),
    colorCode: v.optional(v.string()),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_active_order", ["isActive", "displayOrder"]),

  // ─── Users (optional: use if you sync from Supabase Auth) ────────────────
  users: defineTable({
    supabaseUserId: v.string(), // Supabase auth.users.id (UUID)
    username: v.string(),
    email: v.string(),
    role: v.optional(v.string()), // "reader" | "author" | "admin"
    isPremium: v.optional(v.boolean()),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    socialLinks: v.optional(v.any()), // JSON
  })
    .index("by_supabase_user_id", ["supabaseUserId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"]),

  // ─── Content (core) ─────────────────────────────────────────────────────
  content: defineTable({
    title: v.string(),
    slug: v.string(),
    body: v.string(),
    summary: v.optional(v.string()),
    authorId: v.optional(v.string()), // Supabase user UUID (or Convex users._id if you migrate users)
    status: v.string(), // "draft" | "published" | "archived"
    isPremium: v.optional(v.boolean()),
    securityScore: v.optional(v.number()), // 1–5
    publishedAt: v.optional(v.number()), // ms (Convex uses numbers for dates in indexes)
    subtitle: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    focusKeyword: v.optional(v.string()),
    wordCount: v.optional(v.number()),
    estimatedReadingTimeMinutes: v.optional(v.number()),
    viewCount: v.optional(v.number()),
    legacyId: v.optional(v.string()), // Supabase content.id (UUID) for redirects / migration
    featuredImageUrl: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
    isBreaking: v.optional(v.boolean()),
    contentType: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_status_published_at", ["status", "publishedAt"])
    .index("by_legacy_id", ["legacyId"]),

  // ─── Content ↔ Niches (many-to-many) ─────────────────────────────────────
  contentNiches: defineTable({
    contentId: v.id("content"),
    nicheId: v.number(), // matches niches table; Convex has no smallint, use number
  })
    .index("by_content", ["contentId"])
    .index("by_niche", ["nicheId"])
    .index("by_content_niche", ["contentId", "nicheId"]),

  // ─── Content ↔ Tags (many-to-many) ──────────────────────────────────────
  contentTags: defineTable({
    contentId: v.id("content"),
    tagId: v.id("tags"),
  })
    .index("by_content", ["contentId"])
    .index("by_tag", ["tagId"])
    .index("by_content_tag", ["contentId", "tagId"]),

  // ─── Content ↔ Feeds (many-to-many) ─────────────────────────────────────
  contentFeeds: defineTable({
    contentId: v.id("content"),
    feedId: v.id("feeds"),
  })
    .index("by_content", ["contentId"])
    .index("by_feed", ["feedId"])
    .index("by_content_feed", ["contentId", "feedId"]),

  // ─── Comments ──────────────────────────────────────────────────────────
  comments: defineTable({
    contentId: v.id("content"),
    userId: v.string(), // Supabase auth user id (or Convex users._id)
    parentCommentId: v.optional(v.id("comments")),
    body: v.string(),
    isFlagged: v.optional(v.boolean()),
  })
    .index("by_content", ["contentId"])
    .index("by_user", ["userId"])
    .index("by_parent", ["parentCommentId"]),

  // ─── User bookmarks (content ids) ───────────────────────────────────────
  userBookmarks: defineTable({
    userId: v.string(), // Supabase auth user id
    contentId: v.id("content"),
  })
    .index("by_user", ["userId"])
    .index("by_content", ["contentId"])
    .index("by_user_content", ["userId", "contentId"]),

  // ─── Media (images etc. per content) ─────────────────────────────────────
  media: defineTable({
    contentId: v.id("content"),
    url: v.string(),
    altText: v.optional(v.string()),
    caption: v.optional(v.string()),
    mediaType: v.optional(v.string()),
    positionInArticle: v.optional(v.number()),
  }).index("by_content", ["contentId"]),

  // ─── Content tables (e.g. comparison tables, JSON) ───────────────────────
  contentTables: defineTable({
    contentId: v.id("content"),
    tableTitle: v.optional(v.string()),
    tableData: v.any(), // JSON
    orderIndex: v.optional(v.number()),
  }).index("by_content", ["contentId"]),

  // ─── Nexus Risk-to-Reward Gaming Index (nexus-001) ────────────────────
  // Privacy & Security rating per game/review. NexusSecurityScore 0–100 from E, M, P.
  securityRatings: defineTable({
    contentId: v.optional(v.id("content")), // link to review article
    gameTitle: v.optional(v.string()),
    gameSlug: v.optional(v.string()),
    dataEncryption: v.boolean(), // E
    accountMFA: v.boolean(), // M
    dataSharingPolicy: v.string(), // "minimal" | "standard" | "extensive" | "unknown" → P
    nexusSecurityScore: v.number(), // 0–100, computed from E,M,P
    funFactor: v.optional(v.number()), // 0–100 for radar (Fun vs Security Risk)
  })
    .index("by_content", ["contentId"])
    .index("by_game_slug", ["gameSlug"]),

  // ─── AI-Pulse Roadmap (nexus-002) ──────────────────────────────────────
  // Live-updating timeline: AI/ML tech trends. category = Productivity | Creative | Gaming AI.
  aiUpdates: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // "productivity" | "creative" | "gaming_ai"
    publishedAt: v.number(), // ms
    isHype: v.boolean(), // marketing fluff → dim when Hype view
    hasBenchmarks: v.boolean(), // confirmed ML benchmarks → highlight when Utility view
    sourceUrl: v.optional(v.string()),
  })
    .index("by_category", ["category"])
    .index("by_category_published_at", ["category", "publishedAt"])
    .index("by_published_at", ["publishedAt"]),
});
