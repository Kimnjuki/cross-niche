import { UserBehavior, ContentRecommendation, PersonalizedFeed, Article, Niche, ReadingPrediction, SemanticSimilarity } from '@/types';
import { mockArticles } from '@/data/mockData';

/**
 * AI-Powered Personalization Engine
 * Implements machine learning algorithms for content recommendations
 */

// User behavior tracking (privacy-compliant)
export class UserBehaviorTracker {
  private behaviors: UserBehavior[] = [];
  private readonly STORAGE_KEY = 'user-behaviors';
  private readonly MAX_BEHAVIORS = 1000;

  constructor() {
    this.loadBehaviors();
  }

  trackBehavior(behavior: Omit<UserBehavior, 'id' | 'timestamp'>) {
    const newBehavior: UserBehavior = {
      ...behavior,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    this.behaviors.unshift(newBehavior); // Add to beginning

    // Keep only recent behaviors
    if (this.behaviors.length > this.MAX_BEHAVIORS) {
      this.behaviors = this.behaviors.slice(0, this.MAX_BEHAVIORS);
    }

    this.saveBehaviors();
  }

  getUserBehaviors(userId: string, limit = 100): UserBehavior[] {
    return this.behaviors
      .filter(b => b.userId === userId)
      .slice(0, limit);
  }

  getPopularTags(userId: string): string[] {
    const userBehaviors = this.getUserBehaviors(userId, 200);
    const tagCounts: Record<string, number> = {};

    userBehaviors.forEach(behavior => {
      if (behavior.tags) {
        behavior.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }

  getPreferredNiches(userId: string): Niche[] {
    const userBehaviors = this.getUserBehaviors(userId, 200);
    const nicheCounts: Record<Niche, number> = {
      tech: 0,
      security: 0,
      gaming: 0,
    };

    userBehaviors.forEach(behavior => {
      if (behavior.niche) {
        nicheCounts[behavior.niche]++;
      }
    });

    return Object.entries(nicheCounts)
      .sort(([, a], [, b]) => b - a)
      .filter(([, count]) => count > 0)
      .map(([niche]) => niche as Niche);
  }

  private loadBehaviors() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.behaviors = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to load user behaviors:', error);
        this.behaviors = [];
      }
    }
  }

  private saveBehaviors() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.behaviors));
    } catch (error) {
      console.error('Failed to save user behaviors:', error);
    }
  }
}

// Content recommendation engine
export class ContentRecommender {
  private behaviorTracker: UserBehaviorTracker;

  constructor() {
    this.behaviorTracker = new UserBehaviorTracker();
  }

  generateRecommendations(userId: string, availableArticles: Article[]): ContentRecommendation[] {
    const userBehaviors = this.behaviorTracker.getUserBehaviors(userId, 100);
    const preferredNiches = this.behaviorTracker.getPreferredNiches(userId);
    const popularTags = this.behaviorTracker.getPopularTags(userId);

    const recommendations: ContentRecommendation[] = [];

    availableArticles.forEach(article => {
      let score = 0;
      let confidence = 0.5;
      let reason: ContentRecommendation['reason'] = 'behavior';

      // Behavior-based scoring
      const behaviorScore = this.calculateBehaviorScore(article, userBehaviors);
      if (behaviorScore > 0) {
        score += behaviorScore * 0.4;
        reason = 'behavior';
        confidence = Math.min(confidence + 0.2, 0.9);
      }

      // Niche preference scoring
      const nicheScore = this.calculateNicheScore(article.niche, preferredNiches);
      score += nicheScore * 0.3;

      // Tag similarity scoring
      const tagScore = this.calculateTagScore(article.tags, popularTags);
      score += tagScore * 0.2;

      // Collaborative filtering (simplified)
      const collaborativeScore = this.calculateCollaborativeScore(article, userBehaviors);
      score += collaborativeScore * 0.1;

      // Trending boost (recent articles get slight boost)
      const daysSincePublished = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePublished < 7) {
        score += 0.1;
        if (reason === 'behavior') reason = 'trending';
      }

      if (score > 0.1) { // Only recommend if score is meaningful
        recommendations.push({
          articleId: article.id,
          score: Math.min(score, 1),
          reason,
          confidence,
        });
      }
    });

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // Top 20 recommendations
  }

  private calculateBehaviorScore(article: Article, userBehaviors: UserBehavior[]): number {
    const relevantBehaviors = userBehaviors.filter(b =>
      b.articleId === article.id ||
      (b.tags && article.tags.some(tag => b.tags!.includes(tag))) ||
      b.niche === article.niche
    );

    if (relevantBehaviors.length === 0) return 0;

    // Weight different actions
    const weights = {
      read: 1.0,
      bookmark: 0.8,
      like: 0.7,
      comment: 0.6,
      share: 0.5,
      view: 0.3,
    };

    let totalScore = 0;
    relevantBehaviors.forEach(behavior => {
      const weight = weights[behavior.action] || 0.1;
      const timeDecay = Math.exp(-(Date.now() - new Date(behavior.timestamp).getTime()) / (1000 * 60 * 60 * 24 * 30)); // 30-day decay
      totalScore += weight * timeDecay;
    });

    return Math.min(totalScore / relevantBehaviors.length, 1);
  }

  private calculateNicheScore(articleNiche: Niche, preferredNiches: Niche[]): number {
    if (preferredNiches.length === 0) return 0.5; // Neutral if no preferences
    return preferredNiches.includes(articleNiche) ? 1 : 0.2;
  }

  private calculateTagScore(articleTags: string[], userTags: string[]): number {
    if (userTags.length === 0) return 0.5;
    const overlap = articleTags.filter(tag => userTags.includes(tag)).length;
    return overlap / Math.max(articleTags.length, userTags.length);
  }

  private calculateCollaborativeScore(article: Article, userBehaviors: UserBehavior[]): number {
    // Simplified collaborative filtering based on reading patterns
    const similarUsers = this.findSimilarUsers(userBehaviors);
    if (similarUsers.length === 0) return 0;

    // In a real implementation, this would query a database for similar users' preferences
    // For now, return a small boost based on article popularity
    return article.isFeatured ? 0.2 : 0.1;
  }

  private findSimilarUsers(userBehaviors: UserBehavior[]): string[] {
    // In a real implementation, this would use ML to find similar users
    // For now, return empty array as this is a simplified implementation
    return [];
  }
}

// Reading time prediction
export class ReadingTimePredictor {
  predictReadingTime(article: Article): ReadingPrediction {
    const wordCount = this.estimateWordCount(article.content);
    const complexity = this.calculateComplexity(article);
    const imageCount = this.countImages(article.content);

    // Base reading speed: 200 words per minute
    let baseTime = wordCount / 200;

    // Adjust for complexity
    baseTime *= (1 + complexity * 0.5);

    // Adjust for images (add 10 seconds per image)
    baseTime += (imageCount * 10) / 60;

    // Adjust for niche (tech articles often have code/dense content)
    const nicheMultiplier = {
      tech: 1.2,
      security: 1.1,
      gaming: 1.0,
    };

    baseTime *= nicheMultiplier[article.niche];

    return {
      articleId: article.id,
      predictedTime: Math.max(Math.round(baseTime), 1), // At least 1 minute
      factors: {
        wordCount,
        complexity,
        images: imageCount,
        niche: article.niche,
      },
    };
  }

  private estimateWordCount(content: string): number {
    // Simple word count estimation
    return content.split(/\s+/).length;
  }

  private calculateComplexity(article: Article): number {
    let complexity = 0;

    // Check for technical terms
    const technicalTerms = ['algorithm', 'quantum', 'encryption', 'neural', 'blockchain', 'cybersecurity'];
    const contentLower = article.content.toLowerCase();
    const technicalMatches = technicalTerms.filter(term => contentLower.includes(term)).length;
    complexity += technicalMatches * 0.1;

    // Check title length (longer titles might indicate complex topics)
    complexity += Math.min(article.title.length / 100, 0.2);

    // Check for code-like content
    if (contentLower.includes('```') || contentLower.includes('function') || contentLower.includes('class')) {
      complexity += 0.2;
    }

    return Math.min(complexity, 1);
  }

  private countImages(content: string): number {
    // Simple image counting (in real implementation, parse HTML)
    const imageMatches = content.match(/<img[^>]*>/g);
    return imageMatches ? imageMatches.length : 0;
  }
}

// Semantic similarity engine
export class SemanticSimilarityEngine {
  calculateSimilarity(article1: Article, article2: Article): SemanticSimilarity {
    const commonTags = article1.tags.filter(tag => article2.tags.includes(tag));
    const commonEntities = this.extractCommonEntities(article1, article2);

    // Simple cosine similarity based on tags and content overlap
    const tagSimilarity = commonTags.length / Math.sqrt(article1.tags.length * article2.tags.length) || 0;

    const contentSimilarity = this.calculateContentSimilarity(article1.content, article2.content);

    const totalSimilarity = (tagSimilarity * 0.6) + (contentSimilarity * 0.4);

    return {
      sourceArticleId: article1.id,
      targetArticleId: article2.id,
      similarity: totalSimilarity,
      commonTags,
      commonEntities,
    };
  }

  findRelatedArticles(sourceArticle: Article, allArticles: Article[], limit = 5): Article[] {
    const similarities = allArticles
      .filter(article => article.id !== sourceArticle.id)
      .map(article => ({
        article,
        similarity: this.calculateSimilarity(sourceArticle, article).similarity,
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return similarities.map(s => s.article);
  }

  private calculateContentSimilarity(content1: string, content2: string): number {
    // Simple Jaccard similarity of words
    const words1 = new Set(content1.toLowerCase().split(/\s+/).slice(0, 100)); // First 100 words
    const words2 = new Set(content2.toLowerCase().split(/\s+/).slice(0, 100));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  private extractCommonEntities(article1: Article, article2: Article): string[] {
    // Simple entity extraction (in real implementation, use NLP)
    const entities1 = this.extractEntities(article1.title + ' ' + article1.excerpt);
    const entities2 = this.extractEntities(article2.title + ' ' + article2.excerpt);

    return entities1.filter(entity => entities2.includes(entity));
  }

  private extractEntities(text: string): string[] {
    // Simple extraction of capitalized words (potential entities)
    const matches = text.match(/\b[A-Z][a-z]+\b/g);
    return matches || [];
  }
}

// Main personalization engine
export class PersonalizationEngine {
  private recommender: ContentRecommender;
  private predictor: ReadingTimePredictor;
  private similarityEngine: SemanticSimilarityEngine;

  constructor() {
    this.recommender = new ContentRecommender();
    this.predictor = new ReadingTimePredictor();
    this.similarityEngine = new SemanticSimilarityEngine();
  }

  generatePersonalizedFeed(userId: string, availableArticles: Article[]): PersonalizedFeed {
    const recommendations = this.recommender.generateRecommendations(userId, availableArticles);

    return {
      userId,
      recommendations,
      lastUpdated: new Date().toISOString(),
      preferences: {
        niches: [], // Would be loaded from user profile
        topics: [],
        difficulty: ['beginner', 'intermediate', 'advanced'],
      },
    };
  }

  predictReadingTime(article: Article): ReadingPrediction {
    return this.predictor.predictReadingTime(article);
  }

  findRelatedArticles(article: Article, allArticles: Article[]): Article[] {
    return this.similarityEngine.findRelatedArticles(article, allArticles);
  }

  trackUserBehavior(behavior: Omit<UserBehavior, 'id' | 'timestamp'>) {
    this.recommender['behaviorTracker'].trackBehavior(behavior);
  }
}

// Singleton instance
export const personalizationEngine = new PersonalizationEngine();