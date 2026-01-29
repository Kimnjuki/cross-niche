/**
 * Comprehensive Schema.org Structured Data Generator
 * Implements all recommended schema types for SEO
 */

import type { Article } from '@/types';

const BASE_URL = 'https://thegridnexus.com';

/**
 * Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'The Grid Nexus',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo.png`,
      width: 512,
      height: 512
    },
    sameAs: [
      'https://twitter.com/thegridnexus',
      'https://facebook.com/thegridnexus',
      'https://linkedin.com/company/thegridnexus'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@thegridnexus.com',
      availableLanguage: ['English']
    },
    description: 'Tech, Security & Gaming Intelligence - Breaking news, expert analysis, and comprehensive guides.'
  };
}

/**
 * WebSite Schema with SearchAction
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'The Grid Nexus',
    description: 'Your trusted source for tech news, cybersecurity insights, and gaming industry analysis.',
    publisher: {
      '@id': `${BASE_URL}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/topics?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-US'
  };
}

/** Article type may have optional slug from CMS */
type ArticleWithSlug = Article & { slug?: string; updatedAt?: string; summary?: string };

/**
 * Article Schema
 */
export function generateArticleSchema(article: ArticleWithSlug) {
  const publishedDate = new Date(article.publishedAt).toISOString();
  const modifiedDate = article.updatedAt
    ? new Date(article.updatedAt).toISOString()
    : publishedDate;
  const articleId = article.slug || article.id;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${BASE_URL}/article/${articleId}#article`,
    headline: article.title,
    name: article.title,
    description: article.excerpt || (article as ArticleWithSlug).summary,
    url: `${BASE_URL}/article/${articleId}`,
    image: article.imageUrl ? [
      {
        '@type': 'ImageObject',
        url: article.imageUrl.startsWith('http') ? article.imageUrl : `${BASE_URL}${article.imageUrl}`,
        width: 1200,
        height: 630
      }
    ] : undefined,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Person',
      name: article.author || 'The Grid Nexus Editorial Team',
      url: `${BASE_URL}/author/${article.author?.toLowerCase().replace(/\s+/g, '-') || 'editorial'}`
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/article/${articleId}`
    },
    articleSection: article.niche || 'Technology',
    keywords: article.tags?.join(', ') || '',
    wordCount: article.content ? Math.floor(article.content.split(' ').length) : 0,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    ...(article.readTime && { timeRequired: `PT${article.readTime}M` })
  };
}

/**
 * NewsArticle Schema (for breaking/news content - rich snippets)
 */
export function generateNewsArticleSchema(article: ArticleWithSlug) {
  const base = generateArticleSchema(article);
  return {
    ...base,
    '@type': 'NewsArticle',
    datePublished: new Date(article.publishedAt).toISOString(),
    ...(article.impactLevel === 'high' && { dateline: 'Breaking' })
  };
}

/**
 * BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };
}

/**
 * FAQ Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * HowTo Schema (for guides/tutorials)
 */
export function generateHowToSchema(howTo: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: step.image.startsWith('http') ? step.image : `${BASE_URL}${step.image}`
      })
    })),
    ...(howTo.totalTime && { totalTime: howTo.totalTime })
  };
}

/**
 * Speakable Schema (for voice search optimization)
 */
export function generateSpeakableSchema(contents: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: contents.map((_, index) => `h1, h2:nth-of-type(${index + 1})`).join(', ')
    }
  };
}

/**
 * VideoObject Schema
 */
export function generateVideoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  embedUrl?: string;
  duration?: string;
  uploadDate: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    contentUrl: video.contentUrl,
    embedUrl: video.embedUrl || video.contentUrl,
    duration: video.duration,
    uploadDate: video.uploadDate,
    publisher: {
      '@id': `${BASE_URL}/#organization`
    }
  };
}

/**
 * CollectionPage Schema (for category pages)
 */
export function generateCollectionPageSchema(category: {
  name: string;
  description: string;
  url: string;
  itemCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: category.url.startsWith('http') ? category.url : `${BASE_URL}${category.url}`,
    ...(category.itemCount && { numberOfItems: category.itemCount }),
    isPartOf: {
      '@id': `${BASE_URL}/#website`
    }
  };
}

/**
 * Generate all schemas for a page
 */
export function generateAllSchemas(options: {
  article?: Article;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  howTo?: {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string; image?: string }>;
    totalTime?: string;
  };
  isHomepage?: boolean;
  category?: {
    name: string;
    description: string;
    url: string;
    itemCount?: number;
  };
}) {
  const schemas: any[] = [];

  // Always include Organization and WebSite
  schemas.push(generateOrganizationSchema());
  schemas.push(generateWebSiteSchema());

  // Add Article or NewsArticle schema if present
  if (options.article) {
    const art = options.article as ArticleWithSlug;
    const isNews = art.impactLevel === 'high' || (art as { isBreaking?: boolean }).isBreaking;
    schemas.push(isNews ? generateNewsArticleSchema(art) : generateArticleSchema(art));
  }

  // Add Breadcrumbs if present
  if (options.breadcrumbs && options.breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(options.breadcrumbs));
  }

  // Add FAQ schema if present
  if (options.faqs && options.faqs.length > 0) {
    schemas.push(generateFAQSchema(options.faqs));
  }

  // Add HowTo schema if present
  if (options.howTo) {
    schemas.push(generateHowToSchema(options.howTo));
  }

  // Add CollectionPage for category pages
  if (options.category) {
    schemas.push(generateCollectionPageSchema(options.category));
  }

  return schemas;
}

/**
 * Render schema as JSON-LD script tag
 */
export function renderSchemaScript(schema: any): string {
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

/**
 * Render multiple schemas as JSON-LD script tags
 */
export function renderSchemaScripts(schemas: any[]): string {
  return schemas.map(schema => renderSchemaScript(schema)).join('\n');
}




