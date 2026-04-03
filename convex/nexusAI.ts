/**
 * Nexus AI - Core AI Functions for TheGridNexus AI Feature Expansion v2.0
 * 
 * This module provides all AI-powered functionality using Anthropic Claude API:
 * - FEAT-001: NexusGuard Security Brief Generator
 * - FEAT-002: Nexus Copilot In-Article Assistant
 * - FEAT-003: Nexus Path Learning Paths
 * - FEAT-004: Nexus Pulse News Enrichment
 * - FEAT-005: Nexus Search AI Summaries
 */

import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ════════════════════════════════════════════════════════════════════════════
// ANTHROPIC API INTEGRATION
// ════════════════════════════════════════════════════════════════════════════

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

/**
 * Internal helper to call Anthropic Claude API
 * Note: API key must be set in Convex environment variables as ANTHROPIC_API_KEY
 */
async function callClaude(
  systemPrompt: string,
  userMessage: string,
  maxTokens: number = 2000
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured in Convex environment");
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// ════════════════════════════════════════════════════════════════════════════
// FEAT-001: NEXUSGUARD SECURITY BRIEF GENERATOR
// ════════════════════════════════════════════════════════════════════════════

/**
 * Generate a personalized security brief based on user's tech stack
 */
export const generateSecurityBrief = action({
  args: {
    industry: v.string(),
    cloudStack: v.string(),
    frameworks: v.array(v.string()),
    region: v.string(),
    companySize: v.string(),
  },
  handler: async (ctx, args) => {
    const { industry, cloudStack, frameworks, region, companySize } = args;

    // Step 1: Fetch recent CVEs related to the user's tech stack
    const relevantCVEs = await fetchRelevantCVEs(frameworks);

    // Step 2: Find related TheGridNexus articles
    const relatedArticles = await findRelatedSecurityArticles(ctx, frameworks);

    // Step 3: Generate brief using Claude
    const systemPrompt = `You are NexusGuard, TheGridNexus's AI security analyst. Generate concise, actionable security briefs for practitioners. Always cite CVE IDs. Structure output as JSON with fields: executive_summary, critical_threats[], high_threats[], medium_threats[], low_threats[], patch_checklist[], compliance_notes, article_recommendations[].

Consider the following context:
- Industry: ${industry}
- Cloud/Stack: ${cloudStack}
- Region: ${region} (consider regional regulations like Kenya Data Protection Act for East Africa, GDPR for EU, etc.)
- Company Size: ${companySize}
- Technologies: ${frameworks.join(", ")}

Be specific, actionable, and prioritize threats by severity.`;

    const userMessage = `Generate a security brief for the following tech stack and context:

Recent CVEs found:
${JSON.stringify(relevantCVEs, null, 2)}

Related articles from TheGridNexus:
${JSON.stringify(relatedArticles, null, 2)}

Generate a comprehensive security brief in JSON format.`;

    const briefContent = await callClaude(systemPrompt, userMessage, 3000);

    // Parse the response
    let parsedBrief;
    try {
      parsedBrief = JSON.parse(briefContent);
    } catch (e) {
      // If not valid JSON, wrap in a basic structure
      parsedBrief = {
        executive_summary: briefContent,
        critical_threats: [],
        high_threats: [],
        medium_threats: [],
        low_threats: [],
        patch_checklist: [],
        compliance_notes: "",
        article_recommendations: relatedArticles.slice(0, 3),
      };
    }

    // Calculate severity summary
    const severitySummary = {
      critical: parsedBrief.critical_threats?.length || 0,
      high: parsedBrief.high_threats?.length || 0,
      medium: parsedBrief.medium_threats?.length || 0,
      low: parsedBrief.low_threats?.length || 0,
    };

    // Generate share token
    const shareToken = generateShareToken();

    // Extract CVE IDs
    const cveIds = relevantCVEs.map((cve: any) => cve.id || "");

    // Map article links
    const articleLinks = relatedArticles.slice(0, 5).map((article: any) => ({
      contentId: article._id,
      title: article.title,
      url: `/articles/${article.slug}`,
    }));

    return {
      briefContent: parsedBrief,
      severitySummary,
      cveIds,
      articleLinks,
      shareToken,
      generatedAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days TTL
    };
  },
});

/**
 * Save a generated security brief to the database
 */
export const saveSecurityBrief = mutation({
  args: {
    userId: v.optional(v.string()),
    email: v.optional(v.string()),
    industry: v.string(),
    cloudStack: v.string(),
    frameworks: v.array(v.string()),
    region: v.string(),
    companySize: v.string(),
    briefData: v.any(),
  },
  handler: async (ctx, args) => {
    const { userId, email, industry, cloudStack, frameworks, region, companySize, briefData } = args;

    const briefId = await ctx.db.insert("securityBriefs", {
      userId,
      email,
      industry,
      cloudStack,
      frameworks,
      region,
      companySize,
      briefContent: briefData.briefContent,
      cveIds: briefData.cveIds,
      severitySummary: briefData.severitySummary,
      articleLinks: briefData.articleLinks,
      shareToken: briefData.shareToken,
      generatedAt: briefData.generatedAt,
      expiresAt: briefData.expiresAt,
    });

    return { briefId, shareToken: briefData.shareToken };
  },
});

/**
 * Get a security brief by share token
 */
export const getBriefByShareToken = query({
  args: { shareToken: v.string() },
  handler: async (ctx, args) => {
    const briefs = await ctx.db
      .query("securityBriefs")
      .withIndex("by_share_token", (q) => q.eq("shareToken", args.shareToken))
      .take(1);

    if (briefs.length === 0) return null;

    const brief = briefs[0];

    // Check if expired
    if (brief.expiresAt && Date.now() > brief.expiresAt) {
      return { expired: true, brief };
    }

    return { expired: false, brief };
  },
});

// ════════════════════════════════════════════════════════════════════════════
// FEAT-002: NEXUS COPILOT IN-ARTICLE ASSISTANT
// ════════════════════════════════════════════════════════════════════════════

/**
 * Ask Nexus Copilot a question about an article
 */
export const askNexusCopilot = action({
  args: {
    articleContent: v.string(),
    articleId: v.id("content"),
    articleTitle: v.string(),
    userQuestion: v.string(),
    conversationHistory: v.optional(v.array(v.object({
      role: v.string(),
      content: v.string(),
    }))),
    skillLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("expert")),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { articleContent, articleId, articleTitle, userQuestion, conversationHistory, skillLevel, userId } = args;

    const startTime = Date.now();

    // Step 1: Find related articles using vector search (if available) or keyword search
    const relatedArticles = await findRelatedArticles(ctx, userQuestion, 3);

    // Step 2: Build context from article and related content
    const relatedContext = relatedArticles.map((article: any, i: number) =>
      `Related Article ${i + 1}: ${article.title}\n${article.summary || article.body.substring(0, 300)}...`
    ).join("\n\n");

    // Step 3: Call Claude with full context
    const systemPrompt = `You are Nexus Copilot, an expert AI assistant for TheGridNexus. You have deep knowledge of cybersecurity, AI/ML, gaming performance, and tech. You answer questions about the article the user is reading and related content on TheGridNexus. Always link to relevant articles when possible. Adapt your explanation depth to the user's skill level: ${skillLevel}. Be concise, direct, and technically accurate.

Skill level guide:
- Beginner: Use simple language, explain jargon, provide analogies
- Intermediate: Assume some technical knowledge, focus on practical applications
- Expert: Deep technical details, advanced concepts, industry best practices`;

    const conversationContext = conversationHistory?.map((msg: any) =>
      `${msg.role}: ${msg.content}`
    ).join("\n") || "";

    const userMessage = `The user is reading: "${articleTitle}"

Article content:
${articleContent.substring(0, 8000)}

${relatedContext ? `Related articles on TheGridNexus:\n${relatedContext}` : ""}

${conversationContext ? `Previous conversation:\n${conversationContext}` : ""}

User's question: ${userQuestion}

Provide a helpful, accurate response. If you reference any articles, include their titles and suggest the user read them for more details.`;

    const response = await callClaude(systemPrompt, userMessage, 1500);

    const responseTimeMs = Date.now() - startTime;

    // Step 4: Log the interaction
    const relatedArticleIds = relatedArticles.map((a: any) => a._id);

    // Log interaction directly to database
    await ctx.db.insert("copilotInteractions", {
      sessionId: args.conversationHistory?.[0]?.content || `session_${Date.now()}`,
      userId,
      contentId: articleId,
      question: userQuestion,
      response,
      skillLevel,
      relatedArticlesShown: relatedArticleIds,
      responseTimeMs,
      createdAt: Date.now(),
    });

    return {
      response,
      relatedArticles: relatedArticles.map((a: any) => ({
        _id: a._id,
        title: a.title,
        slug: a.slug,
        url: `/articles/${a.slug}`,
      })),
      responseTimeMs,
    };
  },
});

/**
 * Log a Copilot interaction
 */
export const logCopilotInteraction = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    contentId: v.id("content"),
    question: v.string(),
    response: v.string(),
    skillLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("expert")),
    relatedArticlesShown: v.array(v.id("content")),
    responseRating: v.optional(v.union(v.literal("positive"), v.literal("negative"))),
    responseTimeMs: v.float64(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("copilotInteractions", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

/**
 * Rate a Copilot response
 */
export const rateCopilotResponse = mutation({
  args: {
    sessionId: v.string(),
    rating: v.union(v.literal("positive"), v.literal("negative")),
  },
  handler: async (ctx, args) => {
    // Find the latest interaction for this session and update its rating
    const interactions = await ctx.db
      .query("copilotInteractions")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(1);

    if (interactions.length > 0) {
      await ctx.db.patch(interactions[0]._id, {
        responseRating: args.rating,
      });
    }
  },
});

// ════════════════════════════════════════════════════════════════════════════
// FEAT-003: NEXUS PATH LEARNING PATHS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Generate a personalized learning path
 */
export const generateLearningPath = action({
  args: {
    goal: v.string(),
    skillLevel: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    hoursPerWeek: v.float64(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { goal, skillLevel, hoursPerWeek } = args;

    // Determine goal category
    const goalCategory = categorizeGoal(goal);

    // Calculate total weeks based on skill level and hours per week
    const totalWeeks = calculateTotalWeeks(skillLevel, hoursPerWeek);

    // Step 1: Find relevant articles for this goal
    const relevantArticles = await findArticlesForGoal(ctx, goal, goalCategory, skillLevel);

    // Step 2: Generate learning path structure using Claude
    const systemPrompt = `You are an expert learning path designer for TheGridNexus. Create structured, progressive learning paths for tech topics. Consider the user's skill level and available time.

Goal: ${goal}
Category: ${goalCategory}
Skill Level: ${skillLevel}
Hours per Week: ${hoursPerWeek}
Total Duration: ${totalWeeks} weeks

Create a week-by-week curriculum that:
1. Starts with fundamentals and progresses to advanced topics
2. Balances theory with practical exercises
3. Includes 2-4 articles per week from TheGridNexus
4. Suggests external resources for deeper learning
5. Includes practical exercises for hands-on experience
6. Awards XP based on difficulty (50-200 XP per milestone)

Output as JSON with a "milestones" array where each milestone has: week, title, description, articles (array of article indices from the provided list), externalResources (array of {title, url, type}), exercise (optional), xpReward.`;

    const articlesContext = relevantArticles.map((article: any, i: number) =>
      `${i}: ${article.title} - ${article.summary?.substring(0, 100) || article.body.substring(0, 100)}...`
    ).join("\n");

    const userMessage = `Available articles from TheGridNexus:

${articlesContext}

Create a ${totalWeeks}-week learning path using these articles. Reference articles by their index number.`;

    const pathContent = await callClaude(systemPrompt, userMessage, 3000);

    // Parse the response
    let parsedPath;
    try {
      parsedPath = JSON.parse(pathContent);
    } catch (e) {
      parsedPath = { milestones: [] };
    }

    // Map article indices to actual article IDs
    const milestones = parsedPath.milestones?.map((milestone: any) => ({
      ...milestone,
      articles: (milestone.articles || []).map((idx: number) =>
        relevantArticles[idx]?._id || relevantArticles[0]?._id
      ).filter(Boolean),
    })) || [];

    // Calculate total XP
    const totalXP = milestones.reduce((sum: number, m: any) => sum + (m.xpReward || 100), 0);

    // Generate share token
    const shareToken = generateShareToken();

    return {
      goal,
      goalCategory,
      skillLevel,
      hoursPerWeek,
      totalWeeks,
      milestones,
      isPublic: true,
      shareToken,
      totalXP,
      createdAt: Date.now(),
      lastUpdatedAt: Date.now(),
    };
  },
});

/**
 * Save a learning path
 */
export const saveLearningPath = mutation({
  args: {
    userId: v.optional(v.string()),
    pathData: v.any(),
  },
  handler: async (ctx, args) => {
    const { userId, pathData } = args;

    const pathId = await ctx.db.insert("learningPaths", {
      ...pathData,
      userId,
    });

    // Create initial progress tracking if user is logged in
    if (userId) {
      await ctx.db.insert("userLearningProgress", {
        userId,
        pathId,
        completedMilestones: [],
        completedArticles: [],
        totalXPEarned: 0,
        startedAt: Date.now(),
        lastActivityAt: Date.now(),
        weeklyReminderEnabled: false,
      });
    }

    return { pathId };
  },
});

/**
 * Update learning path progress
 */
export const updatePathProgress = mutation({
  args: {
    userId: v.string(),
    pathId: v.id("learningPaths"),
    milestoneIndex: v.float64(),
    articleIds: v.array(v.id("content")),
  },
  handler: async (ctx, args) => {
    const { userId, pathId, milestoneIndex, articleIds } = args;

    // Get the path and progress
    const path = await ctx.db.get(pathId);
    if (!path) throw new Error("Path not found");

    const progress = await ctx.db
      .query("userLearningProgress")
      .withIndex("by_user_path", (q) => q.eq("userId", userId).eq("pathId", pathId))
      .first();

    if (!progress) throw new Error("Progress not found");

    // Get milestone XP reward
    const milestone = path.milestones.find((m: any) => m.week === milestoneIndex);
    const xpReward = milestone?.xpReward || 100;

    // Update progress
    const updatedCompletedMilestones = [...new Set([...progress.completedMilestones, milestoneIndex])];
    const updatedCompletedArticles = [...new Set([...progress.completedArticles, ...articleIds])];
    const updatedXPEarned = progress.totalXPEarned + xpReward;

    await ctx.db.patch(progress._id, {
      completedMilestones: updatedCompletedMilestones,
      completedArticles: updatedCompletedArticles,
      totalXPEarned: updatedXPEarned,
      lastActivityAt: Date.now(),
    });

    // Update user gamification (XP)
    // Update user gamification (XP) directly
    const existingGamification = await ctx.db
      .query("userGamification")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingGamification) {
      const newXP = existingGamification.xp + xpReward;
      const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 5000, 10000];
      let newLevel = 1;
      for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (newXP >= LEVEL_THRESHOLDS[i]) newLevel = i + 1;
      }
      await ctx.db.patch(existingGamification._id, {
        xp: newXP,
        level: newLevel,
        lastActivityDate: Date.now(),
      });
    } else {
      await ctx.db.insert("userGamification", {
        userId,
        xp: xpReward,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: Date.now(),
        badges: [],
        achievements: [],
      });
    }

    // Check if path is complete
    const isComplete = updatedCompletedMilestones.length >= path.totalWeeks;
    if (isComplete) {
      await ctx.db.patch(progress._id, {
        completedAt: Date.now(),
      });
    }

    return {
      completed: isComplete,
      xpEarned: xpReward,
      totalXPEarned: updatedXPEarned,
    };
  },
});

// ════════════════════════════════════════════════════════════════════════════
// FEAT-004: NEXUS PULSE NEWS ENRICHMENT
// ════════════════════════════════════════════════════════════════════════════

/**
 * Enrich a news story with AI-generated summary and impact score
 */
export const enrichPulseStory = action({
  args: {
    title: v.string(),
    rawSummary: v.string(),
    sourceName: v.string(),
    publishedAt: v.float64(),
  },
  handler: async (ctx, args) => {
    const { title, rawSummary, sourceName, publishedAt } = args;

    const systemPrompt = `You are Nexus Pulse, TheGridNexus's AI news analyst. Analyze tech news stories and provide:
1. A one-line AI summary (max 20 words)
2. An impact score (1-10) based on significance
3. Topic tags (from: AI, LLM, cybersecurity, gaming, cloud, startup, regulation, hardware, software, africa-tech)
4. Whether this is particularly relevant to Africa/East Africa

Respond in JSON format: { aiSummary, impactScore, topics, africaRelevance }`;

    const userMessage = `Analyze this news story:

Title: ${title}

Summary: ${rawSummary}

Source: ${sourceName}

Provide your analysis in JSON format.`;

    const analysis = await callClaude(systemPrompt, userMessage, 500);

    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch (e) {
      parsedAnalysis = {
        aiSummary: rawSummary.substring(0, 100),
        impactScore: 5,
        topics: ["general"],
        africaRelevance: false,
      };
    }

    // Determine impact level
    const impactScore = Math.min(10, Math.max(1, parsedAnalysis.impactScore || 5));
    let impactLevel: "critical" | "high" | "medium" | "low";
    if (impactScore >= 9) impactLevel = "critical";
    else if (impactScore >= 7) impactLevel = "high";
    else if (impactScore >= 4) impactLevel = "medium";
    else impactLevel = "low";

    // Find related TheGridNexus articles
    const relatedContentIds = await findRelatedContentForPulse(ctx, title, rawSummary);

    return {
      aiSummary: parsedAnalysis.aiSummary,
      impactScore,
      impactLevel,
      topics: parsedAnalysis.topics || ["general"],
      africaRelevance: parsedAnalysis.africaRelevance || false,
      relatedContentIds,
      publishedAt,
      ingestedAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days TTL
    };
  },
});

// ════════════════════════════════════════════════════════════════════════════
// FEAT-005: NEXUS SEARCH AI SUMMARIES
// ════════════════════════════════════════════════════════════════════════════

/**
 * Generate an AI summary for search results
 */
export const generateSearchSummary = action({
  args: {
    query: v.string(),
    results: v.array(v.object({
      title: v.string(),
      summary: v.optional(v.string()),
      body: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const { query, results } = args;

    const systemPrompt = `You are Nexus Search, TheGridNexus's AI search assistant. Synthesize search results into a concise, informative answer that directly addresses the user's query. Include citations to the source articles.

Format your response as:
1. A direct answer to the query (2-3 sentences)
2. Key points from the articles (bullet points)
3. Citations with article titles

Be accurate and only use information from the provided articles.`;

    const resultsContext = results.map((r, i) =>
      `Article ${i + 1}: ${r.title}\n${r.summary || r.body.substring(0, 300)}...`
    ).join("\n\n");

    const userMessage = `User query: ${query}

Search results from TheGridNexus:

${resultsContext}

Provide a synthesized answer with citations.`;

    const summary = await callClaude(systemPrompt, userMessage, 1500);

    return { summary, citations: results.slice(0, 3).map((r, i) => `Article ${i + 1}`) };
  },
});

/**
 * Log a search query
 */
export const logSearchQuery = mutation({
  args: {
    query: v.string(),
    userId: v.optional(v.string()),
    sessionId: v.string(),
    resultsCount: v.float64(),
    clickedResultId: v.optional(v.id("content")),
    clickPosition: v.optional(v.float64()),
    hasAiSummary: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("searchLogs", {
      ...args,
      searchedAt: Date.now(),
    });
  },
});

// ════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════

/**
 * Fetch relevant CVEs from NIST NVD API
 */
async function fetchRelevantCVEs(frameworks: string[]) {
  const nvdApiKey = process.env.NVD_API_KEY;
  if (!nvdApiKey) {
    console.warn("NVD_API_KEY not configured, skipping CVE fetch");
    return [];
  }

  const keyword = frameworks.join(" OR ");
  const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(keyword)}&resultsPerPage=20`;

  try {
    const response = await fetch(url, {
      headers: {
        apiKey: nvdApiKey,
      },
    });

    if (!response.ok) {
      console.warn(`NVD API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.vulnerabilities?.map((v: any) => ({
      id: v.cve.id,
      summary: v.cve.descriptions?.[0]?.value,
      severity: v.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity,
      score: v.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore,
      published: v.cve.published,
    })) || [];
  } catch (error) {
    console.warn("Error fetching CVEs:", error);
    return [];
  }
}

/**
 * Find related security articles
 */
async function findRelatedSecurityArticles(ctx: any, frameworks: string[]) {
  const keyword = frameworks[0] || "security";
  const publishedContent = await ctx.db
    .query("content")
    .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
    .order("desc")
    .take(20);

  // Filter for security-related content
  return publishedContent.filter((c: any) =>
    c.title.toLowerCase().includes("security") ||
    c.body.toLowerCase().includes(keyword.toLowerCase()) ||
    c.contentType === "security"
  ).slice(0, 5);
}

/**
 * Find related articles for a question
 */
async function findRelatedArticles(ctx: any, question: string, limit: number = 3) {
  // Use keyword search to find related articles
  const publishedContent = await ctx.db
    .query("content")
    .withIndex("by_status_published_at", (q: any) => q.eq("status", "published"))
    .order("desc")
    .take(50);

  const questionTerms = question.toLowerCase().split(/\s+/).filter(t => t.length > 3);

  const scored = publishedContent.map((c: any) => {
    let score = 0;
    const text = `${c.title} ${c.summary || ""} ${c.body.substring(0, 500)}`.toLowerCase();
    questionTerms.forEach(term => {
      if (text.includes(term)) score += 1;
      if (c.title.toLowerCase().includes(term)) score += 3;
    });
    return { ...c, score };
  });

  return scored
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Find articles relevant to a learning goal
 */
async function findArticlesForGoal(ctx: any, goal: string, category: string, skillLevel: string) {
  const goalKeywords = goal.toLowerCase().split(/\s+/);

  // Get published content
  const publishedContent = await ctx.db
    .query("content")
    .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
    .order("desc")
    .take(100);

  // Score articles by relevance to goal
  const scored = publishedContent.map((c: any) => {
    let score = 0;
    const text = `${c.title} ${c.summary || ""} ${c.body.substring(0, 500)}`.toLowerCase();

    goalKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 2;
      if (c.title.toLowerCase().includes(keyword)) score += 5;
    });

    // Bonus for matching category
    if (category === "cybersecurity" && c.contentType === "security") score += 3;
    if (category === "ai_ml" && (c.contentType === "technology" || c.title.toLowerCase().includes("ai") || c.title.toLowerCase().includes("ml"))) score += 3;
    if (category === "gaming" && c.contentType === "gaming") score += 3;

    // Adjust for skill level
    const difficultyKeywords = {
      beginner: ["introduction", "beginner", "basics", "getting started", "fundamentals"],
      intermediate: ["intermediate", "advanced concepts", "deep dive"],
      advanced: ["advanced", "expert", "mastering", "deep dive", "internals"],
    };

    const levelKeywords = difficultyKeywords[skillLevel as keyof typeof difficultyKeywords] || [];
    levelKeywords.forEach(kw => {
      if (text.includes(kw)) score += 1;
    });

    return { ...c, score };
  });

  return scored
    .sort((a: any, b: any) => b.score - a.score)
    .filter((c: any) => c.score > 0)
    .slice(0, 20);
}

/**
 * Find related content for Pulse stories
 */
async function findRelatedContentForPulse(ctx: any, title: string, summary: string) {
  const keywords = `${title} ${summary}`.toLowerCase().split(/\s+/).filter(w => w.length > 4);

  const publishedContent = await ctx.db
    .query("content")
    .withIndex("by_status_published_at", (q) => q.eq("status", "published"))
    .order("desc")
    .take(50);

  const scored = publishedContent.map((c: any) => {
    let score = 0;
    const text = `${c.title} ${c.summary || ""}`.toLowerCase();
    keywords.forEach(kw => {
      if (text.includes(kw)) score += 1;
    });
    return { ...c, score };
  });

  return scored
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 3)
    .map((c: any) => c._id);
}

/**
 * Categorize a learning goal
 */
function categorizeGoal(goal: string): "cybersecurity" | "ai_ml" | "gaming" | "general_tech" {
  const goalLower = goal.toLowerCase();

  if (goalLower.includes("security") || goalLower.includes("soc") || goalLower.includes("ethical hacker") || goalLower.includes("penetration")) {
    return "cybersecurity";
  }
  if (goalLower.includes("ai") || goalLower.includes("ml") || goalLower.includes("llm") || goalLower.includes("machine learning") || goalLower.includes("deep learning")) {
    return "ai_ml";
  }
  if (goalLower.includes("gaming") || goalLower.includes("game dev") || goalLower.includes("game development")) {
    return "gaming";
  }

  return "general_tech";
}

/**
 * Calculate total weeks for a learning path
 */
function calculateTotalWeeks(skillLevel: string, hoursPerWeek: number): number {
  const baseWeeks = {
    beginner: 8,
    intermediate: 6,
    advanced: 4,
  };

  const base = baseWeeks[skillLevel as keyof typeof baseWeeks] || 6;

  // Adjust based on hours per week
  if (hoursPerWeek < 5) return Math.min(base + 2, 12);
  if (hoursPerWeek > 15) return Math.max(base - 2, 2);

  return base;
}

/**
 * Generate a unique share token
 */
function generateShareToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}