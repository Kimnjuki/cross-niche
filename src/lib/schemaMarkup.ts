/**
 * Comprehensive Schema.org Structured Data Generator
 * Implements all recommended schema types for SEO
 */

import type { Article } from '@/types';
import { authorSlug } from '@/lib/utils';

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
export function generateArticleSchema(article: ArticleWithSlug | null | undefined) {
  if (!article) return null;
  const publishedDate = new Date(article.publishedAt ?? Date.now()).toISOString();
  const modifiedDate = article.updatedAt
    ? new Date(article.updatedAt).toISOString()
    : publishedDate;
  const articleId = (article as Article & { _id?: string }).slug ?? (article as Article & { _id?: string })._id ?? article.id ?? '';

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
      url: `${BASE_URL}/author/${authorSlug(article.author || '') || 'editorial'}`
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
  if (!base) return null;
  return {
    ...base,
    '@type': 'NewsArticle',
    datePublished: new Date(article.publishedAt ?? Date.now()).toISOString(),
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
    const articleSchema = isNews ? generateNewsArticleSchema(art) : generateArticleSchema(art);
    if (articleSchema != null) schemas.push(articleSchema);
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
 * Review Schema (for product/game reviews)
 */
export function generateReviewSchema(review: {
  itemName: string;
  itemType: 'Product' | 'VideoGame' | 'SoftwareApplication' | 'TechArticle';
  reviewBody: string;
  ratingValue: number;
  bestRating?: number;
  worstRating?: number;
  author: string;
  datePublished: string;
  pros?: string[];
  cons?: string[];
  url: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': review.itemType,
      name: review.itemName,
      ...(review.imageUrl && { image: review.imageUrl })
    },
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingValue,
      bestRating: review.bestRating || 10,
      worstRating: review.worstRating || 1
    },
    author: {
      '@type': 'Person',
      name: review.author,
      url: `${BASE_URL}/author/${authorSlug(review.author) || 'editorial'}`
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`
    },
    datePublished: review.datePublished,
    url: review.url.startsWith('http') ? review.url : `${BASE_URL}${review.url}`,
    ...(review.pros && review.pros.length > 0 && {
      positiveNotes: {
        '@type': 'ItemList',
        itemListElement: review.pros.map((pro, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: pro
        }))
      }
    }),
    ...(review.cons && review.cons.length > 0 && {
      negativeNotes: {
        '@type': 'ItemList',
        itemListElement: review.cons.map((con, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: con
        }))
      }
    })
  };
}

/**
 * Person/Author Schema (for E-E-A-T)
 */
export function generatePersonSchema(author: {
  name: string;
  jobTitle?: string;
  description?: string;
  imageUrl?: string;
  sameAs?: string[];
  expertise?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE_URL}/author/${authorSlug(author.name) || 'editorial'}#person`,
    name: author.name,
    url: `${BASE_URL}/author/${authorSlug(author.name) || 'editorial'}`,
    ...(author.jobTitle && { jobTitle: author.jobTitle }),
    ...(author.description && { description: author.description }),
    ...(author.imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: author.imageUrl.startsWith('http') ? author.imageUrl : `${BASE_URL}${author.imageUrl}`
      }
    }),
    ...(author.sameAs && author.sameAs.length > 0 && { sameAs: author.sameAs }),
    ...(author.expertise && author.expertise.length > 0 && {
      knowsAbout: author.expertise
    }),
    worksFor: {
      '@id': `${BASE_URL}/#organization`
    }
  };
}

/**
 * SoftwareApplication Schema (for tool reviews/guides)
 */
export function generateSoftwareSchema(software: {
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: {
    price: number | string;
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: number;
    ratingCount: number;
  };
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: software.name,
    description: software.description,
    applicationCategory: software.applicationCategory,
    ...(software.operatingSystem && { operatingSystem: software.operatingSystem }),
    ...(software.offers && {
      offers: {
        '@type': 'Offer',
        price: software.offers.price,
        priceCurrency: software.offers.priceCurrency
      }
    }),
    ...(software.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: software.aggregateRating.ratingValue,
        ratingCount: software.aggregateRating.ratingCount,
        bestRating: 5,
        worstRating: 1
      }
    }),
    ...(software.url && { url: software.url })
  };
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




