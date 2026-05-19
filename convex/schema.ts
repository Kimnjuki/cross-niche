/**
 * THE GRID NEXUS — CONVEX SCHEMA v3.0
 *
 * Gaming Security Intelligence Hub — clean, lean schema.
 * Stripped of all thesynlab.com/nova bloat. Only tables gridnexus actually uses.
 *
 * ⚠️ Deploy: npx convex deploy
 */

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // ───────────────────────────────────────────────────────────────────────────
  // TAXONOMY — reference/lookup tables (no app-level foreign keys)
  // ───────────────────────────────────────────────────────────────────────────

  /** Content categories: "Security", "Gaming", "Tech", "Community" */
  categories: defineTable({
    name: v.string(),       // display name
    slug: v.string(),       // url-safe
    description: v.optional(v.string()),
    colorCode: v.optional(v.string()),
    icon: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  })
    .index("by_slug", ["slug"])
    .index("by_active_order", ["isActive", "displayOrder"]),

  /** Gaming platforms — canonical list so we validate instead of free-text */
  gamingPlatforms: defineTable({
    name: v.string(),       // "Steam", "PlayStation", "Xbox", "PC", "Mobile"
    slug: v.string(),
    icon: v.optional(v.string()),
    colorCode: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_name", ["name"]),

  /** Content tags — cross-cutting topics like "phishing", "MFA", "cheat-engine" */
  tags: defineTable({
    name: v.string(),
    slug: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_name", ["name"]),

  niches: defineTable({
    idNum: v.number(),
    name: v.string(),
    colorCode: v.optional(v.string()),
  })
    .index("by_id_num", ["idNum"])
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


  // ───────────────────────────────────────────────────────────────────────────
  // USERS
  // ───────────────────────────────────────────────────────────────────────────

  /** User profiles — synced from Supabase Auth (or Clerk) */
  users: defineTable({
    supabaseUserId: v.string(),
    username: v.string(),
    email: v.string(),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    role: v.optional(v.union(v.literal("reader"), v.literal("author"), v.literal("admin"))),
    isPremium: v.optional(v.boolean()),
    emailVerified: v.optional(v.boolean()),
    location: v.optional(v.string()),
    socialLinks: v.optional(v.any()),
    // Gamification
    xp: v.optional(v.number()),
    badges: v.optional(v.array(v.string())),
    headline: v.optional(v.string()),
    primaryPersona: v.optional(v.union(v.literal("gamer"), v.literal("security_enthusiast"), v.literal("builder"))),
    // Lifecycle & attribution
    lifecycleStage: v.optional(v.union(
      v.literal("visitor"),
      v.literal("free_user"),
      v.literal("newsletter_only"),
      v.literal("paying_individual"),
      v.literal("enterprise_contact"),
      v.literal("churned"),
    )),
    source: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    lastLoginAt: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    isBanned: v.optional(v.boolean()),
  })
    .index("by_supabase_user_id", ["supabaseUserId"])
    .index("by_email", ["email"])
    .index("by_username", ["username"])
    .index("by_lifecycle_stage", ["lifecycleStage"]),

  // ───────────────────────────────────────────────────────────────────────────
  // CONTENT — articles, news, guides, threat reports
  // ───────────────────────────────────────────────────────────────────────────

  /** Primary content table — all article-like content lives here */
  content: defineTable({
    title: v.string(),
    slug: v.string(),
    body: v.string(),              // article HTML/markdown body
    summary: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    contentType: v.union(
      v.literal("article"),
      v.literal("news"),
      v.literal("guide"),
      v.literal("review"),
      v.literal("opinion"),
      v.literal("tutorial"),
      v.literal("threat_alert"),
      v.literal("gaming_security_guide"),
      v.literal("threat_intelligence"),
    ),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived"), v.literal("unlisted")),
    categoryId: v.optional(v.id("categories")),       // FK to categories
    // Authoring
    authorId: v.optional(v.string()),                  // Supabase auth user id
    authorUserId: v.optional(v.id("users")),           // FK when user row exists
    // SEO
    metaTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    focusKeyword: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    // Timing
    publishedAt: v.optional(v.number()),
    lastModifiedAt: v.optional(v.number()),
    scheduledFor: v.optional(v.number()),
    // Media
    featuredImageUrl: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    // Flags
    isFeatured: v.optional(v.boolean()),
    isBreaking: v.optional(v.boolean()),
    isPremium: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean()),
    isEditorialSelection: v.optional(v.boolean()),
    // Gaming security enrichment
    gamingPlatforms: v.optional(v.array(v.id("gamingPlatforms"))),
    securityDifficulty: v.optional(v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced"))),
    // Metrics & ingest
    viewCount: v.optional(v.number()),
    wordCount: v.optional(v.number()),
    estimatedReadingTimeMinutes: v.optional(v.number()),
    securityScore: v.optional(v.number()),   // 0–100 computed gaming security relevance
    // External ingest (NewsAPI, GNews etc.)
    externalId: v.optional(v.string()),      // NewsAPI URL for dedup
    source: v.optional(v.string()),          // "Reuters", "TechCrunch", "Nexus Intelligence"
    isAutomated: v.optional(v.boolean()),    // true for API-ingested
    originalUrl: v.optional(v.string()),
    // Schema.org structured data
    schema_org: v.optional(v.any()),
  })
    .index("by_slug", ["slug"])
    .index("by_status_published", ["status", "publishedAt"])
    .index("by_category_published", ["categoryId", "status", "publishedAt"])
    .index("by_author", ["authorId"])
    .index("by_external_id", ["externalId"])
    .index("by_featured", ["isFeatured", "publishedAt"])
    .index("by_breaking", ["isBreaking", "publishedAt"])
    .index("by_premium", ["isPremium", "publishedAt"]),

  /** Many-to-many: content ↔ tags */
  contentTags: defineTable({
    contentId: v.id("content"),
    tagId: v.id("tags"),
  })
    .index("by_content", ["contentId"])
    .index("by_tag", ["tagId"])
    .index("by_content_tag", ["contentId", "tagId"]),

  contentNiches: defineTable({
    contentId: v.id("content"),
    nicheId: v.number(),
  })
    .index("by_content", ["contentId"])
    .index("by_niche", ["nicheId"]),

  contentFeeds: defineTable({
    contentId: v.id("content"),
    feedId: v.id("feeds"),
  })
    .index("by_content", ["contentId"])
    .index("by_feed", ["feedId"]),

  contentTables: defineTable({
    contentId: v.id("content"),
    tableTitle: v.optional(v.string()),
    tableData: v.any(),
    orderIndex: v.optional(v.number()),
  }).index("by_content", ["contentId"]),

  /** Editorial audit trail - content revision history */
  editorialStandards: defineTable({
    standard_name: v.string(),
    version: v.string(),
    isActive: v.boolean(),
    criteria: v.any(),
  }).index("by_active_standard", ["isActive", "standard_name"]),

  factChecks: defineTable({
    contentId: v.id("content"),
    claim: v.string(),
    verdict: v.string(),
    sourceUrl: v.optional(v.string()),
    checkedBy: v.string(),
    checkedAt: v.number(),
  })
    .index("by_content", ["contentId"])
    .index("by_verdict", ["verdict"]),

  contentRevisions: defineTable({
    contentId: v.id("content"),
    revisionNumber: v.number(),
    body: v.string(),
    summary: v.optional(v.string()),
    changedBy: v.string(),
    changeNote: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_content", ["contentId", "revisionNumber"])
    .index("by_created_at", ["createdAt"]),


  // ───────────────────────────────────────────────────────────────────────────
  // NEWS FEED — Live Wire / Nexus Pulse (ephemeral news from external sources)
  // ───────────────────────────────────────────────────────────────────────────

  /** Multi-source news feed for the Live Wire section (NewsAPI + GNews ingest) */
  articles: defineTable({
    title: v.string(),
    url: v.string(),        // source URL for dedup
    summary: v.string(),
    source: v.string(),     // publisher name
    imageUrl: v.optional(v.string()),
    publishedAt: v.number(), // ms — for precise sort
    sourceType: v.optional(v.union(
      v.literal("live_wire"),
      v.literal("nexus_intelligence"),
      v.literal("permanent"),
    )),
    expiresAt: v.optional(v.number()), // TTL for auto-cleanup
  })
    .index("by_url", ["url"])
    .index("by_published_at", ["publishedAt"])
    .index("by_expires_at", ["expiresAt"])
    .index("by_source_type", ["sourceType"]),

  pulseStories: defineTable({
    sourceUrl: v.string(),
    sourceName: v.string(),
    sourceLogo: v.optional(v.string()),
    title: v.string(),
    rawSummary: v.string(),
    aiSummary: v.string(),
    impactScore: v.number(),
    impactLevel: v.union(v.literal("critical"), v.literal("high"), v.literal("medium"), v.literal("low")),
    topics: v.array(v.string()),
    africaRelevance: v.boolean(),
    relatedContentIds: v.array(v.id("content")),
    publishedAt: v.number(),
    ingestedAt: v.number(),
    expiresAt: v.number(),
    urlHash: v.string(),
    viewCount: v.number(),
  })
    .index("by_impact_published", ["impactScore", "publishedAt"])
    .index("by_topics", ["topics"])
    .index("by_africa_relevance", ["africaRelevance", "publishedAt"])
    .index("by_url_hash", ["urlHash"])
    .index("by_expires_at", ["expiresAt"])
    .index("by_ingested_at", ["ingestedAt"]),

  rssSourceConfigs: defineTable({
    name: v.string(),
    url: v.string(),
    topics: v.array(v.string()),
    isActive: v.boolean(),
    lastFetchedAt: v.optional(v.number()),
    fetchIntervalMinutes: v.number(),
    errorCount: v.number(),
  })
    .index("by_active", ["isActive"])
    .index("by_topics", ["topics"]),

  // ───────────────────────────────────────────────────────────────────────────
  // M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@
  // GUIDES M-bM-^@M-^T step-by-step learning paths
  // M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@M-bM-^TM-^@

  guides: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    nicheId: v.number(),
    difficulty: v.string(),
    platform: v.array(v.string()),
    steps: v.array(v.string()),
    readTime: v.number(),
    publishedAt: v.number(),
    isPublished: v.optional(v.boolean()),
    featuredImageUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_niche", ["nicheId"])
    .index("by_published_at", ["publishedAt"]),

  guideProgress: defineTable({
    userId: v.string(),
    guideId: v.id("guides"),
    completedSteps: v.array(v.number()),
    completedAt: v.optional(v.number()),
    lastAccessedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_guide", ["guideId"])
    .index("by_user_guide", ["userId", "guideId"]),

  /** Living guide tracking - review-by expiry */
  livingGuides: defineTable({
    contentId: v.id("content"),
    slug: v.string(),
    nextReviewDue: v.number(),
    lastReviewedAt: v.number(),
    reviewIntervalDays: v.number(),
    updateFrequency: v.union(v.literal("weekly"), v.literal("monthly"), v.literal("quarterly"), v.literal("per_event")),
    editorAssigned: v.optional(v.string()),
    changeLog: v.optional(v.array(v.object({
      date: v.number(),
      summary: v.string(),
      editor: v.string(),
    }))),
  })
    .index("by_next_review", ["nextReviewDue"])
    .index("by_content", ["contentId"])
    .index("by_slug", ["slug"]),

  // THREAT INTELLIGENCE — CISA KEV, CVE feeds, Live Dashboard
  // ───────────────────────────────────────────────────────────────────────────

  /** Ingested from CISA KEV, NVD, etc. */
  threatIntel: defineTable({
    source: v.string(),       // "cisa_kev", "nvd", "custom"
    sourceId: v.string(),     // stable unique ID from source
    title: v.string(),
    description: v.optional(v.string()),
    severity: v.union(v.literal("critical"), v.literal("high"), v.literal("medium"), v.literal("low")),
    category: v.optional(v.string()),
    publishedAt: v.number(),  // ms
    url: v.optional(v.string()),
    // CVE linking — CRITICAL for dashboard queries
    cveIds: v.optional(v.array(v.string())),
    cve: v.optional(v.string()), // single primary CVE for index lookup
    affected: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    // Gaming relevance
    affectsGamers: v.optional(v.boolean()),
    gamingPlatforms: v.optional(v.array(v.id("gamingPlatforms"))),
    gamerImpactScore: v.optional(v.number()),  // 0–100
    // TTL
    expiresAt: v.optional(v.number()),
    lastIngestedAt: v.number(),
  })
    .index("by_source_id", ["source", "sourceId"])
    .index("by_severity_published", ["severity", "publishedAt"])
    .index("by_affects_gamers", ["affectsGamers", "publishedAt"])
    .index("by_cve", ["cve"])                // NEW: direct CVE lookup for dashboard
    .index("by_expires_at", ["expiresAt"]),

  /** Community-submitted threat reports */
  communityThreatReports: defineTable({
    userId: v.optional(v.string()),
    displayName: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    platformId: v.optional(v.id("gamingPlatforms")),  // FK instead of free-text
    severity: v.union(v.literal("critical"), v.literal("high"), v.literal("medium"), v.literal("low")),
    threatType: v.string(),     // "phishing" | "account_takeover" | "malware" | ...
    evidence: v.optional(v.string()),
    // Moderation
    upvotes: v.number(),
    status: v.union(v.literal("pending"), v.literal("verified"), v.literal("dismissed")),
    verifiedByAdmin: v.optional(v.boolean()),
    linkedThreatId: v.optional(v.id("threatIntel")),
    // Clustering
    clusterId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status", "createdAt"])
    .index("by_severity", ["severity", "createdAt"])
    .index("by_user", ["userId"])
    .index("by_platform", ["platformId"]),

  /** Threat alert subscriptions */
  threatSubscriptions: defineTable({
    userId: v.string(),
    type: v.union(v.literal("cve"), v.literal("tag")),
    value: v.string(),
    persona: v.optional(v.union(v.literal("gamer"), v.literal("it_pro"), v.literal("developer"))),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_type_value", ["type", "value"]),

  /** Per-user threat notifications */
  threatNotifications: defineTable({
    userId: v.string(),
    threatId: v.id("threatIntel"),
    createdAt: v.number(),
    readAt: v.optional(v.number()),
  })
    .index("by_user", ["userId", "createdAt"])
    .index("by_user_threat", ["userId", "threatId"]),
  threatContentLinks: defineTable({
    threatId: v.id("threatIntel"),
    contentId: v.id("content"),
    linkType: v.union(v.literal("primary"), v.literal("related"), v.literal("advisory")),
    createdAt: v.number(),
  })
    .index("by_threat", ["threatId"])
    .index("by_content", ["contentId"])
    .index("by_threat_content", ["threatId", "contentId"]),

  /** Community threat clusters - grouped reports */
  communityThreatClusters: defineTable({
    clusterId: v.string(),
    title: v.string(),
    description: v.string(),
    platforms: v.array(v.id("gamingPlatforms")),
    gameSlugs: v.optional(v.array(v.string())),
    severity: v.union(v.literal("critical"), v.literal("high"), v.literal("medium"), v.literal("low")),
    createdAt: v.number(),
    updatedAt: v.number(),
    reportIds: v.array(v.id("communityThreatReports")),
    linkedThreatIds: v.optional(v.array(v.id("threatIntel"))),
  })
    .index("by_severity", ["severity", "updatedAt"])
    .index("by_cluster_id", ["clusterId"]),


  // ───────────────────────────────────────────────────────────────────────────
  // GAMING SECURITY TOOLS
  // ───────────────────────────────────────────────────────────────────────────

  /** Security Score quiz results */
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
    band: v.union(v.literal("excellent"), v.literal("good"), v.literal("fair"), v.literal("needs_work")),
    weakAreaCount: v.number(),
    gameSlug: v.optional(v.string()),
    platformId: v.optional(v.id("gamingPlatforms")),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_created_at", ["createdAt"]),

  /** Breach Simulator scenario results */
  breachSimulations: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.string()),
    scenarioId: v.string(),
    scenarioTitle: v.string(),
    decisions: v.array(v.object({
      stepId: v.string(),
      choiceLabel: v.string(),
      riskImpact: v.number(),
      costImpact: v.number(),
    })),
    finalRisk: v.number(),
    finalCost: v.number(),
    finalTime: v.number(),
    outcome: v.union(v.literal("success"), v.literal("partial"), v.literal("failure")),
    aiFeedback: v.optional(v.object({
      summary: v.string(),
      strengths: v.array(v.string()),
      weaknesses: v.array(v.string()),
      recommendedContentIds: v.optional(v.array(v.id("content"))),
    })),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_scenario", ["scenarioId"]),

  /** Game-vs-game security comparison ratings (Nexus Risk-to-Reward Index) */
  securityRatings: defineTable({
    contentId: v.optional(v.id("content")),
    gameSlug: v.string(),
    gameTitle: v.optional(v.string()),
    platformId: v.optional(v.id("gamingPlatforms")),
    // The E-M-P formula
    dataEncryption: v.boolean(),
    accountMFA: v.boolean(),
    dataSharingPolicy: v.union(v.literal("minimal"), v.literal("standard"), v.literal("extensive"), v.literal("unknown")),
    nexusSecurityScore: v.number(),         // 0–100 computed
    funFactor: v.optional(v.number()),      // 0–100 for radar chart
    riskVector: v.optional(v.array(v.string())),
    publishedAt: v.optional(v.number()),    // NEW: recency sort for comparison lists
    lastReviewedAt: v.optional(v.number()),
  })
    .index("by_game_slug", ["gameSlug"])
    .index("by_content", ["contentId"])
    .index("by_score_published", ["nexusSecurityScore", "publishedAt"]),

  /** Game Security Advisories — per-game security bulletins */
  gameSecurityAdvisories: defineTable({
    gameSlug: v.string(),
    platformId: v.optional(v.id("gamingPlatforms")),
    threatIds: v.array(v.id("threatIntel")),
    generatedSummary: v.string(),
    recommendations: v.array(v.string()),
    riskLevel: v.union(v.literal("informational"), v.literal("elevated"), v.literal("high"), v.literal("critical")),
    createdAt: v.number(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_game", ["gameSlug", "createdAt"])
    .index("by_risk", ["riskLevel", "createdAt"]),

  /** Consolidated game metadata — used by Game Security Copilot */
  gameLibrary: defineTable({
    slug: v.string(),
    name: v.string(),
    aliases: v.array(v.string()),
    genres: v.array(v.string()),
    platforms: v.array(v.id("gamingPlatforms")),
    releaseYear: v.optional(v.number()),
    developer: v.optional(v.string()),
    publisher: v.optional(v.string()),
    securityGrade: v.union(v.literal("A"), v.literal("B"), v.literal("C"), v.literal("D"), v.literal("F")),
    securityNotes: v.optional(v.string()),
    isSupported: v.boolean(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_security_grade", ["securityGrade"]),

  // ───────────────────────────────────────────────────────────────────────────
  // AI TOOLS & COPILOT
  // ───────────────────────────────────────────────────────────────────────────

  /** Copilot session history (conversations about articles/threats) */
  copilotSessions: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.string()),
    messages: v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
      timestamp: v.number(),
      tokensUsed: v.optional(v.number()),
    })),
    systemPromptVersion: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    guardrailTriggered: v.optional(v.boolean()),
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId", "createdAt"])
    .index("by_updated", ["updatedAt"]),

  /** Copilot interactions scoped to specific content (article-level Q&A) */
  copilotInteractions: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.string()),
    contentId: v.id("content"),
    question: v.string(),
    response: v.string(),
    skillLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("expert")),
    relatedArticlesShown: v.array(v.id("content")),
    responseRating: v.optional(v.union(v.literal("positive"), v.literal("negative"))),
    responseTimeMs: v.number(),
    createdAt: v.number(),
  })
    .index("by_content", ["contentId"])
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"]),

  /** AI-generated learning paths */
  learningPaths: defineTable({
    userId: v.optional(v.string()),
    goal: v.string(),
    goalCategory: v.union(v.literal("cybersecurity"), v.literal("ai_ml"), v.literal("gaming"), v.literal("general_tech")),
    skillLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    hoursPerWeek: v.number(),
    totalWeeks: v.number(),
    milestones: v.array(v.object({
      week: v.number(),
      title: v.string(),
      description: v.string(),
      articles: v.array(v.id("content")),
      xpReward: v.number(),
    })),
    isPublic: v.boolean(),
    shareToken: v.string(),
    totalXP: v.number(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_goal_category", ["goalCategory"])
    .index("by_share_token", ["shareToken"]),

  /** User's progress through learning paths */
  userLearningProgress: defineTable({
    userId: v.string(),
    pathId: v.id("learningPaths"),
    completedMilestones: v.array(v.number()),
    completedArticles: v.array(v.id("content")),
    totalXPEarned: v.number(),
    startedAt: v.number(),
    lastActivityAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_path", ["userId", "pathId"]),

  /** AI-generated search summaries */
  aiSearchSummaries: defineTable({
    sessionId: v.string(),
    query: v.string(),
    summary: v.string(),
    topContentIds: v.array(v.id("content")),
    generatedAt: v.number(),
  })
    .index("by_session", ["sessionId", "generatedAt"])
    .index("by_query", ["query"]),

  /** Personalized feed recommendations */
  personalizedFeeds: defineTable({
    userId: v.string(),
    generatedAt: v.number(),
    items: v.array(v.object({
      type: v.string(),
      contentId: v.optional(v.id("content")),
      threatId: v.optional(v.id("threatIntel")),
      score: v.number(),
    })),
  })
    .index("by_user", ["userId", "generatedAt"]),

  aiUpdates: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.union(v.literal("productivity"), v.literal("creative"), v.literal("gaming_ai")),
    publishedAt: v.number(),
    isHype: v.boolean(),
    hasBenchmarks: v.boolean(),
    sourceUrl: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    features: v.optional(v.array(v.object({
      name: v.string(),
      description: v.string(),
      sector: v.string(),
      impact: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
    }))),
  })
    .index("by_category", ["category", "publishedAt"])
    .index("by_published_at", ["publishedAt"])
    .index("by_expires_at", ["expiresAt"]),

  securityBriefs: defineTable({
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    industry: v.string(),
    cloudStack: v.string(),
    frameworks: v.array(v.string()),
    region: v.string(),
    companySize: v.string(),
    briefContent: v.any(),
    cveIds: v.array(v.string()),
    severitySummary: v.object({
      critical: v.number(),
      high: v.number(),
      medium: v.number(),
      low: v.number(),
    }),
    shareToken: v.string(),
    generatedAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_share_token", ["shareToken"])
    .index("by_generated_at", ["generatedAt"]),

  editorialAiBriefs: defineTable({
    contentId: v.optional(v.id("content")),
    status: v.union(v.literal("draft"), v.literal("in_review"), v.literal("approved"), v.literal("cancelled")),
    createdAt: v.number(),
    createdBy: v.optional(v.string()),
    targetKeyword: v.optional(v.string()),
    briefJson: v.any(),
  })
    .index("by_status", ["status", "createdAt"])
    .index("by_content", ["contentId"]),

  learningRecommendations: defineTable({
    userId: v.string(),
    pathId: v.optional(v.id("learningPaths")),
    contentIds: v.array(v.id("content")),
    generatedAt: v.number(),
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed")),
  })
    .index("by_user", ["userId", "generatedAt"])
    .index("by_status", ["status", "generatedAt"]),

  /** AI PC builder configurator */
  pcBuilds: defineTable({
    userId: v.optional(v.string()),
    sessionId: v.string(),
    buildName: v.string(),
    components: v.array(v.object({
      type: v.string(),
      name: v.string(),
      price: v.number(),
      asin: v.optional(v.string()),
      securityVulnScore: v.optional(v.number()),
      notes: v.optional(v.string()),
    })),
    totalPrice: v.number(),
    compatibilityScore: v.number(),
    aiSecurityScore: v.number(),
    useCase: v.string(),
    budget: v.number(),
    isPublic: v.boolean(),
    shareToken: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId", "createdAt"])
    .index("by_share_token", ["shareToken"]),

  // ───────────────────────────────────────────────────────────────────────────
  // ENGAGEMENT & COMMUNITY
  // ───────────────────────────────────────────────────────────────────────────

  /** Comments on content */
  comments: defineTable({
    contentId: v.id("content"),
    userId: v.string(),
    parentCommentId: v.optional(v.id("comments")),
    body: v.string(),
    isFlagged: v.optional(v.boolean()),
    likes: v.optional(v.number()),
    createdAt: v.number(),
    editedAt: v.optional(v.number()),
    isDeleted: v.optional(v.boolean()),
  })
    .index("by_content", ["contentId", "createdAt"])
    .index("by_user", ["userId", "createdAt"])
    .index("by_parent", ["parentCommentId"]),

  /** User bookmarks (saved articles) */
  userBookmarks: defineTable({
    userId: v.string(),
    contentId: v.id("content"),
    bookmarkedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_content", ["userId", "contentId"]),

  /** Roadmap feature voting */
  roadmapVotes: defineTable({
    featureId: v.string(),
    userId: v.string(),
    voteType: v.union(v.literal("upvote"), v.literal("downvote")),
    votedAt: v.number(),
  })
    .index("by_feature", ["featureId"])
    .index("by_feature_user", ["featureId", "userId"]),

  /** User XP/badges/achievements */
  userGamification: defineTable({
    userId: v.string(),
    xp: v.number(),
    level: v.number(),
    articlesRead: v.optional(v.number()),
    commentsMade: v.optional(v.number()),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActivityDate: v.number(),
    badges: v.array(v.string()),
    achievements: v.array(v.object({
      id: v.string(),
      unlockedAt: v.number(),
      progress: v.optional(v.number()),
    })),
  })
    .index("by_user", ["userId"]),

  /** User preferences */
  userPreferences: defineTable({
    userId: v.string(),
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    emailNotifications: v.optional(v.boolean()),
    pushNotifications: v.optional(v.boolean()),
    preferredTopics: v.optional(v.array(v.string())),
  })
    .index("by_user", ["userId"]),

  // ───────────────────────────────────────────────────────────────────────────
  userRiskProfiles: defineTable({
    userId: v.string(),
    overallRiskScore: v.number(),
    riskBand: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    lastUpdatedAt: v.number(),
    topRisks: v.array(v.object({
      id: v.string(),
      title: v.string(),
      severity: v.string(),
      relatedGameSlug: v.optional(v.string()),
      relatedThreatId: v.optional(v.id("threatIntel")),
      status: v.union(v.literal("open"), v.literal("in_progress"), v.literal("resolved")),
    })),
    recommendationSummary: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_risk_band", ["riskBand", "overallRiskScore"]),

  userRiskEvents: defineTable({
    userId: v.string(),
    eventType: v.union(
      v.literal("threat_added"),
      v.literal("threat_resolved"),
      v.literal("score_change"),
      v.literal("config_change"),
    ),
    eventAt: v.number(),
    deltaScore: v.optional(v.number()),
    threatId: v.optional(v.id("threatIntel")),
    gameSlug: v.optional(v.string()),
    metadata: v.optional(v.any()),
  })
    .index("by_user", ["userId", "eventAt"])
    .index("by_threat", ["threatId", "eventAt"]),

  // NEWSLETTER
  // ───────────────────────────────────────────────────────────────────────────

  /** Newsletter subscribers */
  newsletterSubscribers: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("unsubscribed"), v.literal("pending"), v.literal("bounced")),
    frequency: v.optional(v.union(v.literal("daily"), v.literal("weekly"), v.literal("bi-weekly"))),
    topicSubscriptions: v.optional(v.array(v.string())),
    isActive: v.boolean(),
    source: v.optional(v.string()),
    subscribedAt: v.number(),
    verifiedAt: v.optional(v.number()),
    unsubscribedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_active", ["isActive", "subscribedAt"]),

  /** Newsletter send log */
  newsletterSends: defineTable({
    subscriberId: v.id("newsletterSubscribers"),
    subject: v.string(),
    articleIds: v.array(v.id("content")),
    sentAt: v.number(),
    openedAt: v.optional(v.number()),
    clickedAt: v.optional(v.number()),
  })
    .index("by_subscriber", ["subscriberId", "sentAt"]),

  // ───────────────────────────────────────────────────────────────────────────
  newsletterSubscriptions: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    source: v.optional(v.string()),
    topics: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
    subscribedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_active", ["isActive", "subscribedAt"]),

  // SEO & ANALYTICS
  // ───────────────────────────────────────────────────────────────────────────

  /** Per-content daily analytics */
  contentAnalytics: defineTable({
    contentId: v.id("content"),
    date: v.number(),            // start-of-day ms
    views: v.number(),
    uniqueVisitors: v.number(),
    avgTimeOnPage: v.number(),   // seconds
    organicTraffic: v.number(),
  })
    .index("by_content_date", ["contentId", "date"])
    .index("by_date", ["date"]),

  /** Aggregate SEO KPIs by day */
  seoMetrics: defineTable({
    date: v.number(),
    averageRank: v.optional(v.number()),
    keywords1to3: v.optional(v.number()),
    keywords4to10: v.optional(v.number()),
    keywords11to20: v.optional(v.number()),
    totalKeywords: v.optional(v.number()),
    organicVisits: v.optional(v.number()),
    indexedPages: v.optional(v.number()),
    featuredSnippets: v.optional(v.number()),
    totalBacklinks: v.optional(v.number()),
    referringDomains: v.optional(v.number()),
    newsletterSubscribers: v.optional(v.number()),
    registeredUsers: v.optional(v.number()),
  })
    .index("by_date", ["date"]),

  /** Broken link tracker */
  brokenLinks: defineTable({
    url: v.string(),
    statusCode: v.number(),
    backlinkCount: v.number(),
    referringDomains: v.array(v.string()),
    lastChecked: v.number(),
    redirectTo: v.optional(v.string()),
    fixed: v.boolean(),
  })
    .index("by_url", ["url"])
    .index("by_fixed", ["fixed"]),

  /** Internal link graph */
  internalLinks: defineTable({
    sourceContentId: v.id("content"),
    targetContentId: v.id("content"),
    anchorText: v.string(),
    context: v.string(),
    createdAt: v.number(),
    clickCount: v.optional(v.number()),
    positionInContent: v.optional(v.union(v.literal("top"), v.literal("middle"), v.literal("bottom"), v.literal("sidebar"))),
  })
    .index("by_source", ["sourceContentId"])
    .index("by_target", ["targetContentId"]),

  /** SEO content gap analysis */
  contentGaps: defineTable({
    keyword: v.string(),
    searchVolume: v.number(),
    keywordDifficulty: v.number(),
    competitorCount: v.number(),
    priority: v.number(),
    status: v.union(v.literal("identified"), v.literal("in_progress"), v.literal("published"), v.literal("ranking")),
    contentId: v.optional(v.id("content")),
    createdAt: v.number(),
  })
    .index("by_keyword", ["keyword"])
    .index("by_status", ["status"])
    .index("by_content", ["contentId"]),

  brandMentions: defineTable({
    url: v.string(),
    domain: v.string(),
    mentionContext: v.string(),
    isLinked: v.boolean(),
    domainRating: v.number(),
    outreachStatus: v.optional(v.string()),
    linkAcquired: v.optional(v.boolean()),
    discoveredAt: v.number(),
  })
    .index("by_domain", ["domain"])
    .index("by_is_linked", ["isLinked"]),

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
      v.literal("rejected"),
    ),
    outreachDate: v.optional(v.number()),
    responseDate: v.optional(v.number()),
    linkUrl: v.optional(v.string()),
  })
    .index("by_domain", ["domain"])
    .index("by_status", ["status"]),

  anchorTextAnalysis: defineTable({
    backlinkId: v.string(),
    anchorText: v.string(),
    type: v.union(
      v.literal("exact_match"),
      v.literal("partial_match"),
      v.literal("branded"),
      v.literal("generic"),
      v.literal("naked_url"),
    ),
    targetUrl: v.string(),
    isOptimal: v.boolean(),
    suggestedAnchor: v.optional(v.string()),
  })
    .index("by_target_url", ["targetUrl"])
    .index("by_type", ["type"]),

  // ───────────────────────────────────────────────────────────────────────────
  // CONTACT & SITE CONFIG
  // ───────────────────────────────────────────────────────────────────────────

  /** Contact submissions / security disclosures */
  contactSubmissions: defineTable({
    name: v.string(),
    email: v.string(),
    category: v.union(v.literal("press"), v.literal("partnership"), v.literal("tip"), v.literal("security_disclosure"), v.literal("other")),
    subject: v.string(),
    message: v.string(),
    attachmentUrl: v.optional(v.string()),
    status: v.union(v.literal("new"), v.literal("in_review"), v.literal("responded"), v.literal("closed")),
    submittedAt: v.number(),
  })
    .index("by_status", ["status", "submittedAt"])
    .index("by_category", ["category", "submittedAt"]),

  /** Global site configuration (key-value) */
  siteConfig: defineTable({
    key: v.string(),
    value: v.any(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  })
    .index("by_key", ["key"]),

  // ───────────────────────────────────────────────────────────────────────────
  // SEARCH & USAGE LOGGING
  // ───────────────────────────────────────────────────────────────────────────

  /** Site search log */
  searchLogs: defineTable({
    query: v.string(),
    userId: v.optional(v.string()),
    sessionId: v.string(),
    resultsCount: v.number(),
    clickedResultId: v.optional(v.id("content")),
    searchedAt: v.number(),
  })
    .index("by_query", ["query"])
    .index("by_searched_at", ["searchedAt"])
    .index("by_user", ["userId"]),

  /** Tool usage analytics */
  toolUsageLogs: defineTable({
    toolId: v.string(),
    userId: v.optional(v.string()),
    sessionId: v.string(),
    input: v.any(),
    status: v.union(v.literal("success"), v.literal("error"), v.literal("empty"), v.literal("notFound")),
    latencyMs: v.number(),
    createdAt: v.number(),
  })
    .index("by_tool", ["toolId", "createdAt"])
    .index("by_user", ["userId", "createdAt"]),

  /** News bookmark persistence (Live Wire) */
  newsBookmarks: defineTable({
    userId: v.string(),
    articleId: v.string(),   // articles table URL or external id
    source: v.optional(v.string()),
    bookmarkedAt: v.number(),
  })
    .index("by_user", ["userId", "bookmarkedAt"])
    .index("by_user_article", ["userId", "articleId"]),

  /** Community Moderator — moderation audit trail */
  moderationResults: defineTable({
    sessionId: v.string(),
    userId: v.optional(v.string()),
    inputText: v.string(),
    verdict: v.union(v.literal("approved"), v.literal("flagged"), v.literal("removed")),
    ruleHits: v.array(v.object({
      ruleId: v.string(),
      category: v.string(),
      severity: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
      description: v.string(),
      snippet: v.optional(v.string()),
    })),
    scores: v.object({
      profanity: v.number(),
      harassment: v.number(),
      spam: v.number(),
      pii: v.number(),
      nsfw: v.number(),
    }),
    analyzedAt: v.number(),
  })
    .index("by_session", ["sessionId", "analyzedAt"])
    .index("by_verdict", ["verdict", "analyzedAt"]),

  // ───────────────────────────────────────────────────────────────────────────
  // (REMOVED) Bloat tables from shared repo not used by gridnexus:
  //   novaProducts, novaPosts, novaUsers, novaIntegrationScores, novaTrustScores,
  //   adCompliance*, adPolicyRules, adSubmissions, advertiserCertifications,
  //   aiCompatibility*, aiComparisonNarratives, aiConsultationRequests,
  //   aiEcosystemHealthSnapshots, aiEditorialDrafts, aiIntegrationGraph,
  //   aiMigrationRoadmaps, aiPlaybooks, aiReview*, aiRisk*, aiScenarioResults,
  //   aiStackSessions, aiWorkflowRecipes, forum*, hubActivityFeed,
  //   leadMagnets, membershipTiers, affiliate programs tables,
  //   experiments/experimentAssignments (move to analytics service),
  //   enterpriseAccounts/enterpriseMembers/geoVisibility/subscriptions/revenueEvents
  // ───────────────────────────────────────────────────────────────────────────
});
