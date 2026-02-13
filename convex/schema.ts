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
    // CRITICAL: Add missing user fields for complete auth
    emailVerified: v.optional(v.boolean()),
    phoneNumber: v.optional(v.string()),
    location: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    twitterHandle: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    createdAt: v.optional(v.number()), // ms timestamp
    lastLoginAt: v.optional(v.number()), // ms timestamp
    isActive: v.optional(v.boolean()),
    isBanned: v.optional(v.boolean()),
  })
    .index("by_supabase_user_id", ["supabaseUserId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"])
    // CRITICAL: Add user performance indexes
    .index("by_created_at", ["createdAt"])
    .index("by_last_login", ["lastLoginAt"])
    .index("by_is_active", ["isActive"]),

  // ─── Content (core) ─────────────────────────────────────────────────────
  // For listPublished/listTrending: set publishedAt (ms) on published items so by_status_published_at ordering is correct.
  // News Agency Ingestion: externalId, source, isAutomated, originalUrl for NewsAPI/Reuters ingested content.
  content: defineTable({
    title: v.string(),
    slug: v.string(),
    body: v.string(),
    summary: v.optional(v.string()),
    authorId: v.optional(v.string()), // Supabase user UUID (or Convex users._id if you migrate users)
    status: v.string(), // "draft" | "published" | "new" | "archived" | "unlisted"
    isPremium: v.optional(v.boolean()),
    securityScore: v.optional(v.number()), // 1–5
    publishedAt: v.optional(v.number()), // ms; required for published items when using by_status_published_at
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
    contentType: v.optional(
    v.union(
      v.literal("article"),
      v.literal("review"), 
      v.literal("guide"),
      v.literal("news"),
      v.literal("opinion"),
      v.literal("technology"),
      v.literal("security"),
      v.literal("gaming"),
      v.literal("feature"),
      v.literal("tutorial")
    )
  ),
    // CRITICAL: Add default values for undefined prevention
    seoDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    schema_org: v.optional(v.any()),
    lastModifiedAt: v.optional(v.number()),
    lastModifiedBy: v.optional(v.string()),
    isDeleted: v.optional(v.boolean()),
    deletedAt: v.optional(v.number()),
    // News Agency Ingestion Pipeline
    externalId: v.optional(v.string()), // NewsAPI article URL or ID for deduplication
    source: v.optional(v.string()), // e.g. "Reuters", "TechCrunch"
    isAutomated: v.optional(v.boolean()), // true for API-ingested content
    originalUrl: v.optional(v.string()), // Link to original article at source
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_status_published_at", ["status", "publishedAt"])
    .index("by_legacy_id", ["legacyId"])
    .index("by_externalId", ["externalId"])
    .index("by_publishedAt", ["publishedAt"])
    // CRITICAL: Add composite indexes for performance
    .index("by_author_status", ["authorId", "status"])
    .index("by_is_featured", ["isFeatured", "publishedAt"])
    .index("by_is_breaking", ["isBreaking", "publishedAt"])
    .index("by_is_premium", ["isPremium", "publishedAt"]),

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
    // CRITICAL: Add missing timestamps
    createdAt: v.number(), // ms timestamp
    editedAt: v.optional(v.number()), // ms timestamp
    likes: v.optional(v.number()),
    isEdited: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean()),
  })
    .index("by_content", ["contentId"])
    .index("by_user", ["userId"])
    .index("by_parent", ["parentCommentId"])
    // CRITICAL: Add composite indexes for performance
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_content_created", ["contentId", "createdAt"]),

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

  // ─── Multi-source news feed (NewsAPI + GNews) ───────────────────────────
  // Dual-index: by_url (deduplication) + by_publishedAt (sorting). Used by ingest + getLatestFeed.
  articles: defineTable({
    title: v.string(),
    url: v.string(),
    summary: v.string(),
    source: v.string(),
    imageUrl: v.optional(v.string()),
    publishedAt: v.number(), // Unix timestamp (ms) for precise sorting
  })
    .index("by_url", ["url"])
    .index("by_publishedAt", ["publishedAt"]),

  // ─── AI-Pulse Roadmap (nexus-002) ──────────────────────────────────────
  // Live-updating timeline: AI/ML tech trends. category = Productivity | Creative | Gaming AI.
  // Enhanced with benchmarks, features, competitive analysis, and future predictions.
  aiUpdates: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // "productivity" | "creative" | "gaming_ai"
    publishedAt: v.number(), // ms
    isHype: v.boolean(), // marketing fluff → dim when Hype view
    hasBenchmarks: v.boolean(), // confirmed ML benchmarks → highlight when Utility view
    sourceUrl: v.optional(v.string()),
    // Enhanced fields for comprehensive roadmap
    benchmarks: v.optional(v.array(v.object({
      name: v.string(),
      score: v.number(),
      unit: v.optional(v.string()),
      source: v.optional(v.string()),
    }))),
    features: v.optional(v.array(v.object({
      name: v.string(),
      description: v.string(),
      sector: v.string(), // "gaming" | "security" | "productivity" | "creative" | "other"
      impact: v.string(), // "high" | "medium" | "low"
    }))),
    competitiveAnalysis: v.optional(v.array(v.object({
      company: v.string(),
      similarFeature: v.optional(v.string()),
      differentiation: v.optional(v.string()),
      gap: v.optional(v.string()),
    }))),
    futurePrediction: v.optional(v.object({
      timeframe: v.string(), // "short" | "medium" | "long"
      prediction: v.string(),
      confidence: v.string(), // "high" | "medium" | "low"
      implications: v.optional(v.array(v.string())),
    })),
  })
    .index("by_category", ["category"])
    .index("by_category_published_at", ["category", "publishedAt"])
    .index("by_published_at", ["publishedAt"]),

  // ─── Guides & Tutorials ───────────────────────────────────────────────
  guides: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    nicheId: v.number(), // 1=Tech, 2=Security, 3=Gaming
    difficulty: v.string(), // "beginner" | "intermediate" | "advanced"
    platform: v.array(v.string()), // ["PC", "Console", "Mobile"]
    steps: v.array(v.string()), // Step-by-step instructions
    readTime: v.number(), // minutes
    publishedAt: v.number(), // ms
    isPublished: v.optional(v.boolean()),
    featuredImageUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_niche", ["nicheId"])
    .index("by_difficulty", ["difficulty"])
    .index("by_published_at", ["publishedAt"]),

  // ─── Guide Progress Tracking ──────────────────────────────────────────
  guideProgress: defineTable({
    userId: v.string(), // User identifier (can be session-based)
    guideId: v.id("guides"),
    completedSteps: v.array(v.number()), // Indices of completed steps
    completedAt: v.optional(v.number()), // ms when fully completed
    lastAccessedAt: v.number(), // ms
  })
    .index("by_user", ["userId"])
    .index("by_guide", ["guideId"])
    .index("by_user_guide", ["userId", "guideId"]),

  // ─── Roadmap Voting System ─────────────────────────────────────────────
  roadmapVotes: defineTable({
    featureId: v.string(), // ID of the roadmap feature
    userId: v.string(), // User or session identifier
    voteType: v.union(v.literal("upvote"), v.literal("downvote")),
    votedAt: v.number(), // ms timestamp
  })
    .index("by_feature", ["featureId"])
    .index("by_user", ["userId"])
    .index("by_feature_user", ["featureId", "userId"]),

  // ─── User Gamification (XP, Levels, Badges) ───────────────────────────
  userGamification: defineTable({
    userId: v.string(), // User identifier
    xp: v.number(), // Total XP points
    level: v.number(), // Current level
    currentStreak: v.number(), // Days of consecutive activity
    longestStreak: v.number(), // Best streak achieved
    lastActivityDate: v.number(), // ms timestamp of last activity
    badges: v.array(v.string()), // Array of badge IDs earned
    achievements: v.array(v.object({
      id: v.string(),
      unlockedAt: v.number(), // ms timestamp
      progress: v.optional(v.number()), // Progress percentage if applicable
    })),
  })
    .index("by_user", ["userId"])
    .index("by_level", ["level"])
    .index("by_xp", ["xp"]),

  // ─── User Preferences ──────────────────────────────────────────────────
  userPreferences: defineTable({
    userId: v.string(),
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    emailNotifications: v.optional(v.boolean()),
    pushNotifications: v.optional(v.boolean()),
    digestFrequency: v.optional(v.union(v.literal("daily"), v.literal("weekly"), v.literal("monthly"), v.literal("never"))),
    preferredTopics: v.optional(v.array(v.string())), // Array of topic IDs
    savedSearches: v.optional(v.array(v.string())), // Array of search queries
  })
    .index("by_user", ["userId"]),
});
