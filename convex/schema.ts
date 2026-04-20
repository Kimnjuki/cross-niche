/**
 * Convex schema – migrated from Supabase (thegridnexus.com)
 *
 * Tables map to: content, users, comments, content_niches, content_tags,
 * content_feeds, feeds, niches, tags, media, content_tables, user_bookmarks.
 *
 * Editorial pipeline fields (editorialLevel, factChecks, editorialStandards,
 * contentType editorial_brief|threat_alert|roadmap_report) align with
 * config/adsense-strategy-thegridnexus.json. We keep string authorId and
 * session userIds where the app already depends on them; optional v.id("users")
 * links are added for stricter relations when you migrate.
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
    isEditorialCurated: v.optional(v.boolean()),
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
    blueskyHandle: v.optional(v.string()),
    // Optional gamification mirrors (see also userGamification table)
    xp: v.optional(v.number()),
    badges: v.optional(v.array(v.string())),
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
    authorUserId: v.optional(v.id("users")), // Optional strict FK when author rows exist in users
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
      v.literal("tutorial"),
      v.literal("editorial_brief"),
      v.literal("threat_alert"),
      v.literal("roadmap_report")
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
    // AdSense / editorial workflow (see config/adsense-strategy-thegridnexus.json)
    editorialLevel: v.optional(
      v.union(v.literal("basic"), v.literal("high"), v.literal("premium"))
    ),
    factCheckId: v.optional(v.id("factChecks")),
    isEditorialSelection: v.optional(v.boolean()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_status_published_at", ["status", "publishedAt"])
    .index("by_legacy_id", ["legacyId"])
    .index("by_externalId", ["externalId"])
    .index("by_publishedAt", ["publishedAt"])
    // CRITICAL: Add composite indexes for performance
    .index("by_author_status", ["authorId", "status"])
    .index("by_author_user_id", ["authorUserId"])
    .index("by_is_featured", ["isFeatured", "publishedAt"])
    .index("by_is_breaking", ["isBreaking", "publishedAt"])
    .index("by_is_premium", ["isPremium", "publishedAt"]),

  // ─── Editorial & fact-checking (AdSense / trust signals) ───────────────
  factChecks: defineTable({
    contentId: v.id("content"),
    claims: v.array(v.string()),
    sources: v.array(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("partially_confirmed"),
      v.literal("needs_update")
    ),
    updatedAt: v.number(),
  }).index("by_content", ["contentId"]),

  editorialStandards: defineTable({
    contentId: v.id("content"),
    editorialLevel: v.union(v.literal("basic"), v.literal("high"), v.literal("premium")),
    needsHumanReview: v.boolean(),
    reviewedBy: v.optional(v.string()), // legacy: display name or external id
    reviewedByUserId: v.optional(v.id("users")), // preferred when reviewer is in users
    reviewedAt: v.optional(v.number()),
  }).index("by_content", ["contentId"]),

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
    // NEW: Categorize the source so you know what is ephemeral vs permanent
    sourceType: v.optional(
      v.union(v.literal("live_wire"), v.literal("nexus_intelligence"), v.literal("permanent"))
    ),
    // NEW: TTL Control
    expiresAt: v.optional(v.number()),
  })
    .index("by_url", ["url"])
    .index("by_publishedAt", ["publishedAt"])
    // NEW INDEX: Target exactly what needs to be deleted
    .index("by_expiresAt", ["expiresAt"])
    .index("by_sourceType", ["sourceType"]),

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
    // NEW: TTL Control
    expiresAt: v.optional(v.number()),
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
      evidence: v.optional(v.string()),
    })),
  })
    .index("by_category", ["category"])
    .index("by_category_published_at", ["category", "publishedAt"])
    .index("by_published_at", ["publishedAt"])
    // NEW INDEX: Crucial for blazing-fast database cleanup
    .index("by_expiresAt", ["expiresAt"]),

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
    userId: v.string(), // User or session identifier (required for anonymous / legacy)
    convexUserId: v.optional(v.id("users")), // when voter is a synced Convex users row
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
    articlesRead: v.optional(v.number()),
    commentsMade: v.optional(v.number()),
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

  // ─── Threat Intelligence (external feeds) ───────────────────────────────
  // Ingested from sources like CISA KEV. Used by Live Threat Dashboard.
  threatIntel: defineTable({
    source: v.string(), // e.g. "cisa_kev"
    sourceId: v.string(), // stable unique ID from source
    title: v.string(),
    description: v.optional(v.string()),
    severity: v.union(
      v.literal("critical"),
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),
    category: v.optional(v.string()),
    publishedAt: v.float64(), // ms
    url: v.optional(v.string()),
    cveIds: v.optional(v.array(v.string())),
    affected: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    raw: v.optional(v.any()),
    lastIngestedAt: v.number(),
    expiresAt: v.optional(v.float64()),
  })
    .index("by_source", ["source"])
    .index("by_source_id", ["source", "sourceId"])
    .index("by_published_at", ["publishedAt"])
    .index("by_severity_published", ["severity", "publishedAt"])
    .index("by_expiresAt", ["expiresAt"]),

  // ─── Threat alert subscriptions & notifications ─────────────────────────
  threatSubscriptions: defineTable({
    userId: v.string(),
    type: v.union(v.literal("cve"), v.literal("tag")),
    value: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type_value", ["type", "value"])
    .index("by_user_type_value", ["userId", "type", "value"]),

  // ─── Newsletter Subscribers ─────────────────────────────────────────────
  newsletterSubscribers: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    subscribedAt: v.number(),
    status: v.optional(v.string()), // "active" | "unsubscribed" | "pending"
    frequency: v.optional(v.string()), // "daily" | "weekly" | "bi-weekly" | "monthly"
    preferences: v.optional(v.array(v.string())),
    newsletterTypes: v.optional(v.array(v.string())),
    topicSubscriptions: v.optional(v.array(v.string())),
    unsubscribedTopics: v.optional(v.array(v.string())),
    verifiedAt: v.optional(v.number()),
    verificationToken: v.optional(v.string()),
    confirmationToken: v.optional(v.string()),
    confirmedAt: v.optional(v.number()),
    unsubscribedAt: v.optional(v.number()),
    lastSentAt: v.optional(v.number()),
    openRate: v.optional(v.float64()),
    clickRate: v.optional(v.float64()),
    isActive: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_active", ["isActive"])
    .index("by_verification_token", ["verificationToken"])
    .index("by_confirmation_token", ["confirmationToken"])
    .index("by_frequency_status", ["frequency", "status"]),

  // ─── Newsletter Send History ────────────────────────────────────────────
  newsletterSends: defineTable({
    subscriberId: v.id("newsletterSubscribers"),
    subject: v.string(),
    articleIds: v.array(v.string()),
    sentAt: v.float64(),
    openedAt: v.optional(v.float64()),
    clickedAt: v.optional(v.float64()),
  })
    .index("by_subscriber", ["subscriberId"])
    .index("by_subscriber_opened", ["subscriberId", "openedAt"])
    .index("by_subscriber_clicked", ["subscriberId", "clickedAt"])
    .index("by_sent_at", ["sentAt"]),

  threatNotifications: defineTable({
    userId: v.string(),
    threatId: v.id("threatIntel"),
    createdAt: v.number(),
    readAt: v.optional(v.number()),
    reason: v.optional(v.string()),
  })
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_user_read", ["userId", "readAt"])
    .index("by_user_threat", ["userId", "threatId"]),

  // ─── SEO & Content Optimization ────────────────────────────────────────────
  contentOptimization: defineTable({
    contentId: v.id("content"),
    targetKeyword: v.string(),
    currentRank: v.optional(v.number()),
    targetRank: v.optional(v.number()),
    optimizationDate: v.number(), // ms
    improvements: v.array(v.string()),
    resultRank: v.optional(v.number()),
    trafficIncrease: v.optional(v.number()),
  })
    .index("by_content", ["contentId"])
    .index("by_keyword", ["targetKeyword"]),

  contentGaps: defineTable({
    keyword: v.string(),
    searchVolume: v.number(),
    keywordDifficulty: v.number(),
    competitorCount: v.number(),
    priority: v.number(),
    status: v.union(
      v.literal("identified"),
      v.literal("in_progress"),
      v.literal("published"),
      v.literal("ranking")
    ),
    targetRank: v.optional(v.number()),
    currentRank: v.optional(v.number()),
    contentId: v.optional(v.id("content")),
    createdAt: v.number(), // ms
  })
    .index("by_keyword", ["keyword"])
    .index("by_status", ["status"])
    .index("by_content", ["contentId"]),

  contentAnalytics: defineTable({
    contentId: v.id("content"),
    date: v.number(), // ms (start of day)
    views: v.number(),
    uniqueVisitors: v.number(),
    avgTimeOnPage: v.number(), // seconds
    bounceRate: v.number(), // 0–100
    organicTraffic: v.number(),
  })
    .index("by_content_date", ["contentId", "date"])
    .index("by_date", ["date"]),

  contentRefreshes: defineTable({
    contentId: v.id("content"),
    refreshDate: v.number(), // ms
    changesMade: v.array(v.string()),
    trafficBefore: v.number(),
    trafficAfter: v.optional(v.number()),
    rankBefore: v.optional(v.number()),
    rankAfter: v.optional(v.number()),
  })
    .index("by_content", ["contentId"])
    .index("by_refreshDate", ["refreshDate"]),

  // ─── Link Intelligence & Redirects ────────────────────────────────────────
  brokenLinks: defineTable({
    url: v.string(),
    statusCode: v.number(),
    backlinkCount: v.number(),
    referringDomains: v.array(v.string()),
    lastChecked: v.number(), // ms
    redirectTo: v.optional(v.string()),
    fixed: v.boolean(),
  })
    .index("by_url", ["url"])
    .index("by_fixed", ["fixed"]),

  internalLinks: defineTable({
    sourceContentId: v.id("content"),
    targetContentId: v.id("content"),
    anchorText: v.string(),
    context: v.string(),
    createdAt: v.number(), // ms
    clickCount: v.optional(v.number()),
  })
    .index("by_source", ["sourceContentId"])
    .index("by_target", ["targetContentId"]),

  linkOpportunities: defineTable({
    domain: v.string(),
    domainRating: v.number(),
    competitorsLinking: v.array(v.string()),
    contactEmail: v.optional(v.string()),
    status: v.union(
      v.literal("identified"),
      v.literal("outreach_sent"),
      v.literal("responded"),
      v.literal("link_acquired"),
      v.literal("rejected")
    ),
    outreachDate: v.optional(v.number()),
    responseDate: v.optional(v.number()),
    linkUrl: v.optional(v.string()),
  })
    .index("by_domain", ["domain"])
    .index("by_status", ["status"]),

  brandMentions: defineTable({
    url: v.string(),
    domain: v.string(),
    mentionContext: v.string(),
    isLinked: v.boolean(),
    domainRating: v.number(),
    outreachStatus: v.optional(v.string()),
    linkAcquired: v.optional(v.boolean()),
    discoveredAt: v.number(), // ms
  })
    .index("by_domain", ["domain"])
    .index("by_is_linked", ["isLinked"]),

  anchorTextAnalysis: defineTable({
    backlinkId: v.string(),
    anchorText: v.string(),
    type: v.union(
      v.literal("exact_match"),
      v.literal("partial_match"),
      v.literal("branded"),
      v.literal("generic"),
      v.literal("naked_url")
    ),
    targetUrl: v.string(),
    isOptimal: v.boolean(),
    suggestedAnchor: v.optional(v.string()),
  })
    .index("by_target_url", ["targetUrl"])
    .index("by_type", ["type"]),

  // ─── Page Speed & SEO Metrics ─────────────────────────────────────────────
  pageSpeed: defineTable({
    url: v.string(),
    fcp: v.number(), // First Contentful Paint (ms)
    lcp: v.number(), // Largest Contentful Paint (ms)
    fid: v.number(), // First Input Delay (ms)
    cls: v.number(), // Cumulative Layout Shift
    timestamp: v.number(), // ms
  })
    .index("by_url", ["url"])
    .index("by_timestamp", ["timestamp"]),

  seoMetrics: defineTable({
    date: v.number(), // ms
    averageRank: v.optional(v.number()),
    keywords1to3: v.optional(v.number()),
    keywords4to10: v.optional(v.number()),
    keywords11to20: v.optional(v.number()),
    totalKeywords: v.optional(v.number()),
    organicVisits: v.optional(v.number()),
    organicVisitsChange: v.optional(v.number()),
    pagesPerSession: v.optional(v.number()),
    avgSessionDuration: v.optional(v.number()),
    bounceRate: v.optional(v.number()),
    publishedPages: v.optional(v.number()),
    indexedPages: v.optional(v.number()),
    featuredSnippets: v.optional(v.number()),
    totalBacklinks: v.optional(v.number()),
    referringDomains: v.optional(v.number()),
    domainRating: v.optional(v.number()),
    criticalIssues: v.optional(v.number()),
    avgPageSpeed: v.optional(v.number()),
    mobileUsability: v.optional(v.number()),
  }).index("by_date", ["date"]),

  seoAudits: defineTable({
    date: v.number(), // ms
    brokenLinksCount: v.number(),
    thinContentCount: v.number(),
    cannibalizationCount: v.number(),
    decliningContentCount: v.number(),
    issues: v.optional(v.any()),
  }).index("by_date", ["date"]),

  // ════════════════════════════════════════════════════════════════════════════
  // NEXUS AI FEATURES SCHEMA (TheGridNexus AI Feature Expansion v2.0)
  // ════════════════════════════════════════════════════════════════════════════

  // ─── FEAT-001: NexusGuard Security Briefs ──────────────────────────────────
  securityBriefs: defineTable({
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    industry: v.string(),
    cloudStack: v.string(),
    frameworks: v.array(v.string()),
    region: v.string(),
    companySize: v.string(),
    briefContent: v.any(), // Structured JSON from AI
    cveIds: v.array(v.string()),
    severitySummary: v.object({
      critical: v.float64(),
      high: v.float64(),
      medium: v.float64(),
      low: v.float64(),
    }),
    articleLinks: v.array(v.object({
      contentId: v.id("content"),
      title: v.string(),
      url: v.string(),
    })),
    shareToken: v.string(), // Unique token for shareable URL
    generatedAt: v.float64(),
    downloadedAt: v.optional(v.float64()),
    emailSentAt: v.optional(v.float64()),
    expiresAt: v.float64(), // TTL: 7 days
  })
    .index("by_user", ["userId"])
    .index("by_share_token", ["shareToken"])
    .index("by_generated_at", ["generatedAt"])
    .index("by_industry", ["industry"]),

  // ─── FEAT-002: Nexus Copilot Interactions ──────────────────────────────────
  copilotInteractions: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.string()),
    contentId: v.id("content"),
    question: v.string(),
    response: v.string(),
    skillLevel: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("expert")
    ),
    relatedArticlesShown: v.array(v.id("content")),
    responseRating: v.optional(v.union(
      v.literal("positive"),
      v.literal("negative")
    )),
    responseTimeMs: v.float64(),
    createdAt: v.float64(),
  })
    .index("by_content", ["contentId"])
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_created_at", ["createdAt"]),

  // ─── FEAT-003: Nexus Path Learning Paths ───────────────────────────────────
  learningPaths: defineTable({
    userId: v.optional(v.string()),
    goal: v.string(),
    goalCategory: v.union(
      v.literal("cybersecurity"),
      v.literal("ai_ml"),
      v.literal("gaming"),
      v.literal("general_tech")
    ),
    skillLevel: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced")
    ),
    hoursPerWeek: v.float64(),
    totalWeeks: v.float64(),
    milestones: v.array(v.object({
      week: v.float64(),
      title: v.string(),
      description: v.string(),
      articles: v.array(v.id("content")),
      externalResources: v.array(v.object({
        title: v.string(),
        url: v.string(),
        type: v.string(),
      })),
      exercise: v.optional(v.string()),
      xpReward: v.float64(),
    })),
    isPublic: v.boolean(),
    shareToken: v.string(),
    totalXP: v.float64(),
    createdAt: v.float64(),
    lastUpdatedAt: v.float64(),
  })
    .index("by_user", ["userId"])
    .index("by_goal_category", ["goalCategory"])
    .index("by_is_public", ["isPublic"])
    .index("by_share_token", ["shareToken"]),

  // User learning progress tracking
  userLearningProgress: defineTable({
    userId: v.string(),
    pathId: v.id("learningPaths"),
    completedMilestones: v.array(v.float64()),
    completedArticles: v.array(v.id("content")),
    totalXPEarned: v.float64(),
    startedAt: v.float64(),
    lastActivityAt: v.float64(),
    completedAt: v.optional(v.float64()),
    weeklyReminderEnabled: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_path", ["userId", "pathId"])
    .index("by_path", ["pathId"]),

  // ─── FEAT-004: Nexus Pulse Real-Time News Feed ─────────────────────────────
  pulseStories: defineTable({
    sourceUrl: v.string(),
    sourceName: v.string(),
    sourceLogo: v.optional(v.string()),
    title: v.string(),
    rawSummary: v.string(),
    aiSummary: v.string(), // One-line AI generated
    impactScore: v.float64(), // 1-10
    impactLevel: v.union(
      v.literal("critical"),
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),
    topics: v.array(v.string()),
    africaRelevance: v.boolean(),
    relatedContentIds: v.array(v.id("content")),
    publishedAt: v.float64(),
    ingestedAt: v.float64(),
    expiresAt: v.float64(),
    urlHash: v.string(), // For deduplication
    viewCount: v.float64(),
  })
    .index("by_impact_published", ["impactScore", "publishedAt"])
    .index("by_topics", ["topics"])
    .index("by_africa_relevance", ["africaRelevance", "publishedAt"])
    .index("by_url_hash", ["urlHash"])
    .index("by_expires_at", ["expiresAt"])
    .index("by_ingested_at", ["ingestedAt"]),

  // RSS source configurations for Pulse
  rssSourceConfigs: defineTable({
    name: v.string(),
    url: v.string(),
    topics: v.array(v.string()),
    isActive: v.boolean(),
    lastFetchedAt: v.optional(v.float64()),
    fetchIntervalMinutes: v.float64(),
    errorCount: v.float64(),
  })
    .index("by_active", ["isActive"])
    .index("by_topics", ["topics"]),

  // ─── Gaming Security Tools ─────────────────────────────────────────────────
  // Backs /security-score interactive quiz
  gamingSecurityScores: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.string()),
    answers: v.array(v.object({
      questionId: v.number(),
      answer: v.union(v.literal("yes"), v.literal("partial"), v.literal("no")),
    })),
    totalScore: v.number(),
    maxScore: v.number(),
    percentScore: v.number(),
    band: v.union(
      v.literal("excellent"),
      v.literal("good"),
      v.literal("fair"),
      v.literal("needs_work")
    ),
    weakAreaCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_created_at", ["createdAt"]),

  // Backs /breach-sim interactive decision-tree scenarios
  breachSimulations: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.string()),
    scenarioId: v.string(),
    scenarioTitle: v.string(),
    decisions: v.array(v.object({
      stepId: v.number(),
      choiceLabel: v.string(),
      riskImpact: v.number(),
      costImpact: v.number(),
    })),
    finalRisk: v.number(),
    finalCost: v.number(),
    finalTime: v.number(),
    outcome: v.union(v.literal("success"), v.literal("partial"), v.literal("failure")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_scenario", ["scenarioId"])
    .index("by_created_at", ["createdAt"]),

  // ─── FEAT-005: Nexus Search Logs ───────────────────────────────────────────
  searchLogs: defineTable({
    query: v.string(),
    userId: v.optional(v.string()),
    sessionId: v.string(),
    resultsCount: v.float64(),
    clickedResultId: v.optional(v.id("content")),
    clickPosition: v.optional(v.float64()),
    hasAiSummary: v.boolean(),
    searchedAt: v.float64(),
  })
    .index("by_query", ["query"])
    .index("by_searched_at", ["searchedAt"])
    .index("by_user", ["userId"]),
});
