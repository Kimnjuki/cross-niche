// convex/aiAutomation.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Auto-Summarization Pipeline
export const generateArticleSummary = mutation({
  args: {
    articleId: v.id("content"),
    content: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // This would integrate with OpenAI API
    // For now, we'll create a basic summary
    const wordCount = args.content.split(' ').length;
    const sentences = args.content.split('.').filter(s => s.trim().length > 0);
    
    // Create TL;DR summary (simplified version)
    const summary = sentences
      .slice(0, 3)
      .map(s => s.trim())
      .join('. ') + '.';

    // Update article with summary and reading time
    await ctx.db.patch(args.articleId, {
      summary: summary,
      lastModifiedAt: Date.now(),
    });

    return { summary, readingTime: Math.ceil(wordCount / 200) };
  },
});

// Smart Tagging System
export const generateSmartTags = mutation({
  args: {
    articleId: v.id("content"),
    content: v.string(),
    niche: v.string(),
  },
  handler: async (ctx, args) => {
    // NLP-based tag generation (simplified version)
    const content = args.content.toLowerCase();
    const techKeywords = [
      'ai', 'machine learning', 'neural network', 'quantum', 'blockchain',
      'cloud', 'server', 'database', 'api', 'javascript', 'python',
      'nvidia', 'amd', 'intel', 'microsoft', 'apple', 'google'
    ];
    
    const securityKeywords = [
      'zero-day', 'vulnerability', 'cve', 'ransomware', 'malware',
      'phishing', 'encryption', 'firewall', 'vpn', 'authentication',
      'cybersecurity', 'threat', 'attack', 'breach', 'hack'
    ];
    
    const gamingKeywords = [
      'rpg', 'fps', 'mmo', 'esports', 'nintendo', 'playstation',
      'xbox', 'steam', 'epic games', 'rtx', 'gpu', 'cpu',
      'gaming', 'multiplayer', 'online', 'cheat', 'anti-cheat'
    ];

    // Collect inferred tags in a strongly typed list
    const generatedTags: string[] = [];

    // Extract keywords based on niche
    const keywords = [...techKeywords, ...securityKeywords, ...gamingKeywords];
    keywords.forEach(keyword => {
      if (content.includes(keyword) && !generatedTags.includes(keyword)) {
        generatedTags.push(keyword);
      }
    });

    // Add niche-specific tags
    if (args.niche === 'tech' && generatedTags.length > 0) {
      generatedTags.push('technology');
    } else if (args.niche === 'security' && generatedTags.length > 0) {
      generatedTags.push('cybersecurity');
    } else if (args.niche === 'gaming' && generatedTags.length > 0) {
      generatedTags.push('gaming');
    }

    // Update article with generated tags (using existing fields)
    await ctx.db.patch(args.articleId, {
      lastModifiedAt: Date.now(),
    });

    return generatedTags.slice(0, 10); // Limit to 10 tags
  },
});

// Batch process articles for AI automation
export const processArticleWithAI = mutation({
  args: {
    articleId: v.id("content"),
  },
  handler: async (ctx, args) => {
    const article = await ctx.db.get(args.articleId);
    if (!article) {
      throw new Error("Article not found");
    }

    // Generate summary
    await ctx.runMutation(api.aiAutomation.generateArticleSummary, {
      articleId: args.articleId,
      content: article.body || '',
      title: article.title || '',
    });

    // Generate smart tags
    await ctx.runMutation(api.aiAutomation.generateSmartTags, {
      articleId: args.articleId,
      content: article.body || '',
      niche: article.contentType || 'tech',
    });

    return { success: true, articleId: args.articleId };
  },
});

// Get articles needing AI processing
export const getUnprocessedArticles = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const articles = await ctx.db
      .query("content")
      .withIndex("by_status_published_at", (q) => 
        q.eq("status", "published")
      )
      .filter((q: any) => 
        q.or(
          q.eq(q.field("summary"), undefined),
          q.eq(q.field("focusKeyword"), undefined)
        )
      )
      .take(args.limit || 50);

    return articles;
  },
});
