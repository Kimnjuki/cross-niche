import { Article, NewsletterSubscriber, NewsletterType, NewsletterTemplate } from '@/types';
import { mockArticles } from '@/data/mockData';

/**
 * AI-Powered Newsletter Curation Engine
 * Generates personalized newsletter content based on subscriber preferences
 */

export interface NewsletterContent {
  id: string;
  title: string;
  type: NewsletterType;
  articles: Article[];
  curatedBy: 'ai' | 'editorial';
  generatedAt: string;
  personalizationScore: number; // 0-1 based on subscriber preferences
  topics: string[];
  estimatedReadTime: number;
}

export interface SubscriberProfile {
  subscriber: NewsletterSubscriber;
  readingHistory: string[]; // Article IDs
  preferredTopics: string[];
  engagementRate: number; // Based on open/click rates
  lastActivity: string;
}

export class NewsletterCurationEngine {
  private templates: NewsletterTemplate[] = [
    {
      id: 'daily-digest',
      type: 'daily-digest',
      title: 'Daily Digest',
      description: 'Top stories from the past 24 hours',
      sampleContent: 'Your daily roundup of the most important tech, security, and gaming news.',
    },
    {
      id: 'weekly-deep-dive',
      type: 'weekly-deep-dive',
      title: 'Weekly Deep Dive',
      description: 'In-depth analysis and feature stories',
      sampleContent: 'Comprehensive analysis of the week\'s most significant developments.',
    },
    {
      id: 'topic-specific-ai',
      type: 'topic-specific',
      title: 'AI & Machine Learning Weekly',
      description: 'Latest developments in artificial intelligence',
      sampleContent: 'Curated insights into AI advancements, machine learning breakthroughs, and their impact on technology.',
    },
    {
      id: 'topic-specific-security',
      type: 'topic-specific',
      title: 'Cybersecurity Focus',
      description: 'Critical security updates and threat intelligence',
      sampleContent: 'Essential security updates, vulnerability disclosures, and threat analysis.',
    },
    {
      id: 'breaking-news',
      type: 'breaking-news',
      title: 'Breaking News Alert',
      description: 'Real-time notifications for major stories',
      sampleContent: 'Urgent updates on breaking developments in tech, security, and gaming.',
    },
  ];

  generateNewsletter(
    subscriber: NewsletterSubscriber,
    availableArticles: Article[],
    subscriberProfile?: SubscriberProfile
  ): NewsletterContent {
    const type = this.determineBestNewsletterType(subscriber);
    const relevantArticles = this.filterRelevantArticles(availableArticles, subscriber, subscriberProfile);
    const curatedArticles = this.curatedArticles(relevantArticles, subscriber, type);
    const personalizationScore = this.calculatePersonalizationScore(curatedArticles, subscriber);

    return {
      id: crypto.randomUUID(),
      title: this.generateTitle(type, curatedArticles),
      type,
      articles: curatedArticles,
      curatedBy: 'ai',
      generatedAt: new Date().toISOString(),
      personalizationScore,
      topics: this.extractTopics(curatedArticles),
      estimatedReadTime: this.calculateTotalReadTime(curatedArticles),
    };
  }

  private determineBestNewsletterType(subscriber: NewsletterSubscriber): NewsletterType {
    // If subscriber has specific type preferences, use those
    if (subscriber.newsletterTypes.length > 0) {
      return subscriber.newsletterTypes[0]; // Use first preference
    }

    // Determine based on frequency preference
    switch (subscriber.frequency) {
      case 'daily':
        return 'daily-digest';
      case 'weekly':
      case 'bi-weekly':
        // Check topic subscriptions for specialization
        if (subscriber.topicSubscriptions.includes('AI & Machine Learning')) {
          return 'topic-specific';
        }
        if (subscriber.topicSubscriptions.includes('Cybersecurity')) {
          return 'topic-specific';
        }
        return 'weekly-deep-dive';
      case 'monthly':
        return 'weekly-deep-dive'; // Monthly users get weekly content
      default:
        return 'daily-digest';
    }
  }

  private filterRelevantArticles(
    articles: Article[],
    subscriber: NewsletterSubscriber,
    subscriberProfile?: SubscriberProfile
  ): Article[] {
    return articles.filter(article => {
      // Basic filters
      if (!subscriber.preferences.includes(article.niche)) {
        return false;
      }

      // Topic filtering
      if (subscriber.topicSubscriptions.length > 0) {
        const hasRelevantTopic = subscriber.topicSubscriptions.some(topic =>
          article.tags.some(tag =>
            tag.toLowerCase().includes(topic.toLowerCase()) ||
            topic.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasRelevantTopic) return false;
      }

      // Exclude unsubscribed topics
      if (subscriber.unsubscribedTopics) {
        const hasUnsubscribedTopic = subscriber.unsubscribedTopics.some(topic =>
          article.tags.some(tag =>
            tag.toLowerCase().includes(topic.toLowerCase())
          )
        );
        if (hasUnsubscribedTopic) return false;
      }

      // Reading history filter (avoid recently read articles)
      if (subscriberProfile?.readingHistory.includes(article.id)) {
        return false;
      }

      // Recency filter based on newsletter type
      const daysSincePublished = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
      const maxAge = subscriber.frequency === 'daily' ? 1 : subscriber.frequency === 'weekly' ? 7 : 30;

      return daysSincePublished <= maxAge;
    });
  }

  private curatedArticles(articles: Article[], subscriber: NewsletterSubscriber, type: NewsletterType): Article[] {
    let curated: Article[] = [];
    const maxArticles = this.getMaxArticlesForType(type);

    // Sort by relevance score
    const scoredArticles = articles.map(article => ({
      article,
      score: this.calculateArticleRelevanceScore(article, subscriber, type),
    })).sort((a, b) => b.score - a.score);

    curated = scoredArticles.slice(0, maxArticles).map(item => item.article);

    // Ensure diversity - different niches
    if (curated.length > 3) {
      curated = this.ensureDiversity(curated, subscriber.preferences);
    }

    return curated;
  }

  private calculateArticleRelevanceScore(article: Article, subscriber: NewsletterSubscriber, type: NewsletterType): number {
    let score = 0;

    // Niche preference (40% weight)
    if (subscriber.preferences.includes(article.niche)) {
      score += 0.4;
    }

    // Topic relevance (30% weight)
    if (subscriber.topicSubscriptions.length > 0) {
      const topicMatches = subscriber.topicSubscriptions.filter(topic =>
        article.tags.some(tag =>
          tag.toLowerCase().includes(topic.toLowerCase()) ||
          topic.toLowerCase().includes(tag.toLowerCase())
        )
      ).length;
      score += (topicMatches / subscriber.topicSubscriptions.length) * 0.3;
    }

    // Article quality indicators (20% weight)
    if (article.isFeatured) score += 0.1;
    if (article.readTime <= 10) score += 0.05; // Prefer shorter articles for newsletters
    if (article.tags.length > 2) score += 0.025; // Well-tagged articles

    // Type-specific scoring (10% weight)
    switch (type) {
      case 'daily-digest': {
        // Prioritize recent, high-impact articles
        const daysSincePublished = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
        score += Math.max(0, (1 - daysSincePublished) * 0.1);
        break;
      }
      case 'weekly-deep-dive': {
        // Prioritize in-depth, analytical content
        if (article.readTime > 8) score += 0.05;
        if (article.tags.some(tag => ['analysis', 'deep-dive', 'guide'].includes(tag.toLowerCase()))) {
          score += 0.05;
        }
        break;
      }
      case 'topic-specific':
        // Already handled in topic filtering
        score += 0.1;
        break;
      case 'breaking-news': {
        // Prioritize very recent, high-impact content
        const hoursSincePublished = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
        if (hoursSincePublished < 24) score += 0.1;
        break;
      }
    }

    return Math.min(score, 1);
  }

  private ensureDiversity(articles: Article[], preferredNiches: string[]): Article[] {
    const nicheCount: Record<string, number> = {};
    const diverse: Article[] = [];

    // First pass: ensure we have representation from preferred niches
    preferredNiches.forEach(niche => {
      const nicheArticles = articles.filter(a => a.niche === niche).slice(0, 2);
      diverse.push(...nicheArticles);
      nicheCount[niche] = nicheArticles.length;
    });

    // Second pass: fill remaining slots with other articles
    const remaining = articles.filter(a => !diverse.includes(a));
    const remainingSlots = 5 - diverse.length;

    diverse.push(...remaining.slice(0, remainingSlots));

    return diverse;
  }

  private calculatePersonalizationScore(articles: Article[], subscriber: NewsletterSubscriber): number {
    if (articles.length === 0) return 0;

    let totalScore = 0;
    articles.forEach(article => {
      if (subscriber.preferences.includes(article.niche)) totalScore += 0.5;
      if (subscriber.topicSubscriptions.some(topic =>
        article.tags.some(tag => tag.toLowerCase().includes(topic.toLowerCase()))
      )) totalScore += 0.5;
    });

    return Math.min(totalScore / articles.length, 1);
  }

  private generateTitle(type: NewsletterType, articles: Article[]): string {
    const template = this.templates.find(t => t.type === type);
    if (!template) return 'Newsletter';

    // Generate dynamic titles based on content
    if (articles.length === 0) return template.title;

    switch (type) {
      case 'daily-digest': {
        const mainTopic = this.getMainTopic(articles);
        return mainTopic ? `${mainTopic} Digest` : template.title;
      }
      case 'weekly-deep-dive':
        return articles[0] ? `Deep Dive: ${articles[0].title.split(':')[0]}` : template.title;
      case 'topic-specific':
        return template.title; // Already specific
      case 'breaking-news':
        return articles[0] ? `Breaking: ${articles[0].title.split(':')[0]}` : template.title;
      default:
        return template.title;
    }
  }

  private getMainTopic(articles: Article[]): string | null {
    const allTags = articles.flatMap(a => a.tags);
    const tagCounts: Record<string, number> = {};

    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);
    return sortedTags[0]?.[0] || null;
  }

  private extractTopics(articles: Article[]): string[] {
    const allTags = articles.flatMap(a => a.tags);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.slice(0, 5); // Top 5 topics
  }

  private calculateTotalReadTime(articles: Article[]): number {
    return articles.reduce((total, article) => total + article.readTime, 0);
  }

  private getMaxArticlesForType(type: NewsletterType): number {
    switch (type) {
      case 'daily-digest': return 5;
      case 'weekly-deep-dive': return 7;
      case 'topic-specific': return 6;
      case 'breaking-news': return 3;
      default: return 5;
    }
  }

  getAvailableTemplates(): NewsletterTemplate[] {
    return this.templates;
  }

  getTemplateByType(type: NewsletterType): NewsletterTemplate | undefined {
    return this.templates.find(t => t.type === type);
  }

  previewNewsletter(subscriber: NewsletterSubscriber, availableArticles: Article[]): NewsletterContent {
    // Generate a preview with limited articles
    const fullNewsletter = this.generateNewsletter(subscriber, availableArticles);
    return {
      ...fullNewsletter,
      articles: fullNewsletter.articles.slice(0, 2), // Only show first 2 articles in preview
      title: `Preview: ${fullNewsletter.title}`,
    };
  }
}

// Singleton instance
export const newsletterEngine = new NewsletterCurationEngine();