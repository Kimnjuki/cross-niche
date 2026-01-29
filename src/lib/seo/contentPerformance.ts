/**
 * Content Performance Tracking
 * Tracks and analyzes content performance metrics
 */

import type { Article } from '@/types';

export interface ContentPerformanceMetrics {
  articleId: string;
  views: number;
  uniqueViews: number;
  avgEngagementTime: number; // in seconds
  bounceRate: number; // percentage
  pagesPerSession: number;
  socialShares: number;
  backlinks: number;
  keywordRankings: Array<{
    keyword: string;
    position: number;
    change: number; // positive = improved, negative = declined
  }>;
  conversionRate: number; // percentage
  revenue: number; // estimated or actual
  lastUpdated: string;
}

export interface ContentAuditResult {
  articleId: string;
  title: string;
  status: 'high_performer' | 'stable' | 'declining' | 'underperforming';
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
  metrics: ContentPerformanceMetrics;
}

/**
 * Calculate content performance score
 */
export function calculatePerformanceScore(metrics: ContentPerformanceMetrics): number {
  let score = 0;

  // Views (0-25 points)
  if (metrics.views > 10000) score += 25;
  else if (metrics.views > 5000) score += 20;
  else if (metrics.views > 1000) score += 15;
  else if (metrics.views > 500) score += 10;
  else if (metrics.views > 100) score += 5;

  // Engagement time (0-25 points)
  if (metrics.avgEngagementTime > 300) score += 25; // 5+ minutes
  else if (metrics.avgEngagementTime > 180) score += 20; // 3+ minutes
  else if (metrics.avgEngagementTime > 60) score += 15; // 1+ minute
  else if (metrics.avgEngagementTime > 30) score += 10;
  else if (metrics.avgEngagementTime > 15) score += 5;

  // Bounce rate (0-15 points) - lower is better
  if (metrics.bounceRate < 40) score += 15;
  else if (metrics.bounceRate < 50) score += 12;
  else if (metrics.bounceRate < 60) score += 10;
  else if (metrics.bounceRate < 70) score += 7;
  else if (metrics.bounceRate < 80) score += 5;

  // Social shares (0-15 points)
  if (metrics.socialShares > 500) score += 15;
  else if (metrics.socialShares > 200) score += 12;
  else if (metrics.socialShares > 100) score += 10;
  else if (metrics.socialShares > 50) score += 7;
  else if (metrics.socialShares > 20) score += 5;

  // Keyword rankings (0-10 points)
  const top10Keywords = metrics.keywordRankings.filter(k => k.position <= 10).length;
  score += Math.min(top10Keywords * 2, 10);

  // Backlinks (0-10 points)
  if (metrics.backlinks > 50) score += 10;
  else if (metrics.backlinks > 20) score += 7;
  else if (metrics.backlinks > 10) score += 5;
  else if (metrics.backlinks > 5) score += 3;
  else if (metrics.backlinks > 0) score += 1;

  return Math.min(score, 100);
}

/**
 * Audit content performance
 */
export function auditContentPerformance(
  article: Article,
  metrics: ContentPerformanceMetrics
): ContentAuditResult {
  const score = calculatePerformanceScore(metrics);
  const recommendations: string[] = [];
  let status: ContentAuditResult['status'];
  let priority: ContentAuditResult['priority'];

  // Determine status
  if (score >= 70) {
    status = 'high_performer';
    priority = 'low';
    recommendations.push('Maintain current performance');
    recommendations.push('Update quarterly to keep content fresh');
    recommendations.push('Build more content around this topic');
  } else if (score >= 50) {
    status = 'stable';
    priority = 'medium';
    recommendations.push('Optimize title and meta description');
    recommendations.push('Add internal links to related content');
    recommendations.push('Improve engagement with multimedia');
  } else if (score >= 30) {
    status = 'declining';
    priority = 'high';
    recommendations.push('Refresh content with updated information');
    recommendations.push('Improve heading structure');
    recommendations.push('Add FAQ section for featured snippets');
    recommendations.push('Build backlinks to this article');
  } else {
    status = 'underperforming';
    priority = 'high';
    recommendations.push('Major content refresh needed');
    recommendations.push('Consider consolidating with related content');
    recommendations.push('Review keyword targeting');
    recommendations.push('Improve on-page SEO elements');
  }

  // Specific recommendations based on metrics
  if (metrics.bounceRate > 70) {
    recommendations.push('High bounce rate - improve content quality and relevance');
    recommendations.push('Add related articles section');
    recommendations.push('Improve page load speed');
  }

  if (metrics.avgEngagementTime < 60) {
    recommendations.push('Low engagement time - content may be too short or not engaging');
    recommendations.push('Add more depth to content');
    recommendations.push('Include multimedia elements');
  }

  if (metrics.keywordRankings.length === 0 || metrics.keywordRankings.every(k => k.position > 20)) {
    recommendations.push('No strong keyword rankings - optimize for target keywords');
    recommendations.push('Build topical authority around this subject');
  }

  if (metrics.socialShares < 10) {
    recommendations.push('Low social shares - improve shareability');
    recommendations.push('Add compelling visuals');
    recommendations.push('Create share-worthy quotes or statistics');
  }

  return {
    articleId: article.id,
    title: article.title,
    status,
    recommendations,
    priority,
    metrics
  };
}

/**
 * Get content refresh priority
 */
export function getContentRefreshPriority(
  auditResults: ContentAuditResult[]
): Array<ContentAuditResult & { refreshScore: number }> {
  return auditResults
    .map(result => {
      let refreshScore = 0;

      // High priority items get higher score
      if (result.priority === 'high') refreshScore += 50;
      else if (result.priority === 'medium') refreshScore += 30;
      else refreshScore += 10;

      // Declining/underperforming get boost
      if (result.status === 'declining') refreshScore += 30;
      if (result.status === 'underperforming') refreshScore += 40;

      // Articles ranking 11-20 (page 2) get boost
      const page2Keywords = result.metrics.keywordRankings.filter(
        k => k.position > 10 && k.position <= 20
      ).length;
      refreshScore += page2Keywords * 5;

      // High traffic but low conversion
      if (result.metrics.views > 1000 && result.metrics.conversionRate < 2) {
        refreshScore += 20;
      }

      return {
        ...result,
        refreshScore
      };
    })
    .sort((a, b) => b.refreshScore - a.refreshScore);
}

/**
 * Generate content performance report
 */
export function generatePerformanceReport(
  audits: ContentAuditResult[]
): {
  summary: {
    totalArticles: number;
    highPerformers: number;
    stable: number;
    declining: number;
    underperforming: number;
    avgScore: number;
  };
  topPerformers: ContentAuditResult[];
  needsAttention: ContentAuditResult[];
  recommendations: string[];
} {
  const highPerformers = audits.filter(a => a.status === 'high_performer');
  const stable = audits.filter(a => a.status === 'stable');
  const declining = audits.filter(a => a.status === 'declining');
  const underperforming = audits.filter(a => a.status === 'underperforming');

  const avgScore = audits.reduce((sum, a) => {
    return sum + calculatePerformanceScore(a.metrics);
  }, 0) / audits.length;

  const topPerformers = audits
    .map(a => ({
      ...a,
      score: calculatePerformanceScore(a.metrics)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const needsAttention = audits
    .filter(a => a.priority === 'high')
    .sort((a, b) => {
      const scoreA = calculatePerformanceScore(a.metrics);
      const scoreB = calculatePerformanceScore(b.metrics);
      return scoreA - scoreB; // Lower scores first
    })
    .slice(0, 10);

  const recommendations: string[] = [];
  
  if (declining.length > 0) {
    recommendations.push(`Refresh ${declining.length} declining articles to improve rankings`);
  }
  
  if (underperforming.length > 0) {
    recommendations.push(`Major refresh needed for ${underperforming.length} underperforming articles`);
  }

  const refreshPriority = getContentRefreshPriority(audits);
  if (refreshPriority.length > 0) {
    recommendations.push(`Top refresh priority: "${refreshPriority[0].title}" (Score: ${refreshPriority[0].refreshScore})`);
  }

  return {
    summary: {
      totalArticles: audits.length,
      highPerformers: highPerformers.length,
      stable: stable.length,
      declining: declining.length,
      underperforming: underperforming.length,
      avgScore: Math.round(avgScore)
    },
    topPerformers,
    needsAttention,
    recommendations
  };
}




