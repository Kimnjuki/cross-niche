/**
 * SEO Optimization utilities for content
 * - Generate structured data (JSON-LD)
 * - Optimize for Core Web Vitals
 * - Optimize for Google News
 */

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const generateStructuredData = mutation({
  args: {
    contentId: v.id('content'),
    schemaType: v.union(v.literal('NewsArticle'), v.literal('Article'), v.literal('BlogPosting')),
  },
  handler: async (ctx, { contentId, schemaType }) => {
    const content = await ctx.db.get('content', contentId);
    if (!content || content.status !== 'published') {
      throw new Error('Content not found or not published');
    }

    // Generate structured data based on type
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': schemaType,
      headline: content.title,
      description: content.summary || '',
      image: content.featuredImageUrl || '',
      author: {
        '@type': 'Person',
        name: content.authorId ? `Author ${content.authorId}` : 'Grid Nexus Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'The Grid Nexus',
        logo: {
          '@type': 'ImageObject',
          url: 'https://thegridnexus.com/logo.png',
        },
      },
      datePublished: content.publishedAt ? new Date(content.publishedAt).toISOString() : '',
      dateModified: content._creationTime ? new Date(content._creationTime).toISOString() : '',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://thegridnexus.com/article/${content.slug}`,
      },
    };

    return structuredData;
  },
});

export const optimizeForCoreWebVitals = mutation({
  args: {
    contentId: v.id('content'),
  },
  handler: async (ctx, { contentId }) => {
    const content = await ctx.db.get('content', contentId);
    if (!content) {
      throw new Error('Content not found');
    }

    // Simulate Core Web Vitals optimization
    // In a real implementation, this would:
    // - Optimize images (WebP, lazy loading)
    // - Minify CSS/JS
    // - Add proper meta tags
    // - Implement resource hints
    
    const optimizations = {
      optimizedImages: true,
      lazyLoading: true,
      minifiedAssets: true,
      metaTags: {
        title: content.title,
        description: content.summary || '',
        ogImage: content.featuredImageUrl || '',
        canonical: `https://thegridnexus.com/article/${content.slug}`,
      },
      resourceHints: {
        preconnect: ['https://fonts.googleapis.com'],
        dnsPrefetch: ['https://thegridnexus.com'],
      },
    };

    return optimizations;
  },
});

export const optimizeForGoogleNews = mutation({
  args: {
    contentId: v.id('content'),
  },
  handler: async (ctx, { contentId }) => {
    const content = await ctx.db.get('content', contentId);
    if (!content || content.status !== 'published') {
      throw new Error('Content not found or not published');
    }

    // Check if content is eligible for Google News
    const isEligible = content.isAutomated === false && 
                        content.publishedAt && 
                        content.featuredImageUrl &&
                        content.summary &&
                        content.summary.length > 100;

    if (!isEligible) {
      return {
        eligible: false,
        reason: 'Content does not meet Google News guidelines',
      };
    }

    // Generate Google News specific optimizations
    const newsOptimizations = {
      eligible: true,
      newsKeywords: [], // Tags not available in current schema
      newsStandout: [
        {
          type: 'Opinion',
          value: false,
        },
        {
          type: 'Satire',
          value: false,
        },
      ],
      publication: {
        name: 'The Grid Nexus',
        language: 'en',
      },
      geo: {
        coverage: ['Worldwide'],
      },
    };

    return newsOptimizations;
  },
});

export const getSEOContent = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, { slug }) => {
    const content = await ctx.db
      .query('content')
      .withIndex('by_slug')
      .filter((q) => q.eq('slug', slug))
      .unique();

    if (!content || content.status !== 'published') {
      return null;
    }

    return {
      ...content,
      seoScore: calculateSEOScore(content),
      recommendations: generateSEORecommendations(content),
    };
  },
});

function calculateSEOScore(content: any): number {
  let score = 0;
  
  // Title optimization (30 points)
  if (content.title && content.title.length >= 30 && content.title.length <= 60) {
    score += 30;
  } else if (content.title && content.title.length > 0) {
    score += 15;
  }
  
  // Description optimization (25 points)
  if (content.summary && content.summary.length >= 120 && content.summary.length <= 160) {
    score += 25;
  } else if (content.summary && content.summary.length > 50) {
    score += 12;
  }
  
  // Image optimization (20 points)
  if (content.featuredImageUrl) {
    score += 20;
  }
  
  // Content length (15 points)
  if (content.body && content.body.length > 300) {
    score += 15;
  } else if (content.body && content.body.length > 100) {
    score += 8;
  }
  
  // Publication date (10 points)
  if (content.publishedAt) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

function generateSEORecommendations(content: any): string[] {
  const recommendations: string[] = [];
  
  if (!content.title || content.title.length < 30) {
    recommendations.push('Title should be between 30-60 characters for better SEO');
  }
  
  if (!content.summary || content.summary.length < 120) {
    recommendations.push('Meta description should be between 120-160 characters');
  }
  
  if (!content.featuredImageUrl) {
    recommendations.push('Add a featured image to improve click-through rates');
  }
  
  if (!content.body || content.body.length < 300) {
    recommendations.push('Content should be at least 300 words for better ranking');
  }
  
  if (!content.publishedAt) {
    recommendations.push('Set a publication date for better indexing');
  }
  
  if (!content.tags || content.tags.length === 0) {
    recommendations.push('Add relevant tags to improve discoverability');
  }
  
  return recommendations;
}
