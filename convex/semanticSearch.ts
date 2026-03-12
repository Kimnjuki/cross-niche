// convex/semanticSearch.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Store search history for personalization
export const updateSearchHistory = mutation({
  args: {
    userId: v.optional(v.string()),
    query: v.string(),
    resultsCount: v.number(),
    clickedResult: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Create a simple search history record using userBookmarks table structure
    // In a real implementation, you'd add a dedicated searchHistory table
    await ctx.db.insert("userBookmarks", {
      userId: args.userId || "anonymous",
      contentId: "search_" + Date.now() as any, // Use as search record identifier
    });
    
    return { success: true };
  },
});

// Semantic search query using existing content table
export const semanticSearch = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
    niche: v.optional(v.number()), // Use niche ID (1=tech, 2=security, 3=gaming)
  },
  handler: async (ctx, args) => {
    // Get published content
    let contentQuery = ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      );

    // Filter by niche if specified
    if (args.niche !== undefined) {
      const nicheId: number = args.niche;
      const contentIds = await ctx.db
        .query("contentNiches")
        .withIndex("by_niche", (q) => q.eq("nicheId", nicheId))
        .collect();
      
      const contentIdSet = new Set(contentIds.map(cn => cn.contentId));
      contentQuery = contentQuery.filter((q: any) => 
        contentIdSet.has(q._id)
      );
    }

    const articles = await contentQuery.take(args.limit || 10);

    // Simple relevance scoring based on query terms
    const queryTerms = args.query.toLowerCase().split(' ');
    const scoredArticles = articles.map(article => {
      let score = 0;
      const searchText = `${article.title} ${article.summary || ''} ${article.body}`.toLowerCase();
      
      queryTerms.forEach(term => {
        if (searchText.includes(term)) {
          score += 1;
        }
        // Title matches get higher score
        if (article.title.toLowerCase().includes(term)) {
          score += 2;
        }
      });
      
      return { ...article, relevanceScore: score };
    });

    // Sort by relevance and return top results
    return scoredArticles
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, args.limit || 10);
  },
});

// Natural language Q&A using content search
export const answerQuestion = query({
  args: {
    question: v.string(),
    niche: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Find relevant articles using the same logic as semanticSearch
    // (Convex queries are descriptors, so we re-run the query logic here
    //  instead of calling semanticSearch() directly.)

    // Get published content
    let contentQuery = ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) =>
        q.eq("status", "published")
      );

    // Optional niche filter
    if (args.niche !== undefined) {
      const nicheId = args.niche;
      const contentIds = await ctx.db
        .query("contentNiches")
        .withIndex("by_niche", (q) => q.eq("nicheId", nicheId))
        .collect();

      const contentIdSet = new Set(contentIds.map((cn) => cn.contentId));
      contentQuery = contentQuery.filter((q: any) =>
        contentIdSet.has(q._id)
      );
    }

    const articles = await contentQuery.take(5);

    // Simple relevance scoring based on question terms
    const queryTerms = args.question.toLowerCase().split(" ");
    const relevantArticles = articles
      .map((article: any) => {
        let score = 0;
        const searchText = `${article.title} ${article.summary || ""} ${article.body}`.toLowerCase();

        queryTerms.forEach((term) => {
          if (searchText.includes(term)) {
            score += 1;
          }
          if (article.title.toLowerCase().includes(term)) {
            score += 2;
          }
        });

        return { ...article, relevanceScore: score };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5);

    // Extract relevant text from articles
    const relevantTexts = relevantArticles.map((article: any) => ({
      title: article.title,
      content: article.summary || article.body.substring(0, 500),
      url: `/articles/${article.slug}`,
      relevanceScore: article.relevanceScore,
    }));

    // Return relevant articles as context
    return {
      question: args.question,
      answer: `Based on Grid Nexus content, here are the most relevant articles about "${args.question}":`,
      sources: relevantTexts,
      articleCount: relevantArticles.length,
    };
  },
});

// Get personalized content based on niche preferences
export const getPersonalizedContent = query({
  args: {
    userId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.userId) {
      // Return default trending content for non-logged users
      return await ctx.db
        .query("content")
        .withIndex("by_is_featured", (q) => 
          q.eq("isFeatured", true)
        )
        .take(args.limit || 10);
    }

    // Get user's bookmarked content to understand preferences
    const userId = args.userId;

    const userBookmarks = await ctx.db
      .query("userBookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get content IDs from bookmarks
    const bookmarkedContentIds = userBookmarks.map(b => b.contentId);
    
    // Get bookmarked content to analyze niche preferences
    const bookmarkedContent = await Promise.all(
      bookmarkedContentIds.map(id => ctx.db.get(id))
    );

    // Analyze niche preferences
    const nicheCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0 }; // 1=tech, 2=security, 3=gaming
    for (const content of bookmarkedContent) {
      if (content) {
        const contentNiches = await ctx.db
          .query("contentNiches")
          .withIndex("by_content", (q) => q.eq("contentId", content._id))
          .collect();
        
        contentNiches.forEach((cn) => {
          if (typeof cn.nicheId === "number") {
            nicheCounts[cn.nicheId] = (nicheCounts[cn.nicheId] ?? 0) + 1;
          }
        });
      }
    }

    // Determine preferred niche
    const preferredNicheEntry = Object.entries(nicheCounts).sort(
      ([, a], [, b]) => b - a
    )[0];
    const preferredNiche = Number(preferredNicheEntry?.[0] ?? 1);

    // Get more content from preferred niche
    const preferredContentIds = await ctx.db
      .query("contentNiches")
      .withIndex("by_niche", (q) => q.eq("nicheId", preferredNiche))
      .take(Math.ceil((args.limit || 10) * 0.7));

    const preferredContent = await Promise.all(
      preferredContentIds.map(cn => ctx.db.get(cn.contentId))
    );

    // Get some content from other niches for variety
    const otherContent = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .take(Math.floor((args.limit || 10) * 0.3));

    return [...preferredContent.filter(Boolean), ...otherContent].slice(0, args.limit || 10);
  },
});
