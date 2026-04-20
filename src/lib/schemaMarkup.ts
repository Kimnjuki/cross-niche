/**
 * Schema.org Structured Data Generators
 * All functions return plain objects (no @context) to be embedded
 * in a single consolidated @graph by SEOHead — prevents duplicate
 * Organization / WebSite schemas that cause SEMrush markup errors.
 */

import type { Article } from '@/types';
import { authorSlug } from '@/lib/utils';

const BASE_URL = 'https://thegridnexus.com';

// ────────────────────────────────────────────────────────────────────────────
// Organization (NewsMediaOrganization for E-E-A-T + AI trust signals)
// ────────────────────────────────────────────────────────────────────────────
export function generateOrganizationSchema() {
  return {
    '@type': ['Organization', 'NewsMediaOrganization'],
    '@id': `${BASE_URL}/#organization`,
    name: 'The Grid Nexus',
    alternateName: 'GridNexus',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#logo`,
      url: `${BASE_URL}/logo.png`,
      contentUrl: `${BASE_URL}/logo.png`,
      width: 512,
      height: 512,
      caption: 'The Grid Nexus',
    },
    image: { '@id': `${BASE_URL}/#logo` },
    sameAs: [
      'https://twitter.com/thegridnexus',
      'https://facebook.com/thegridnexus',
      'https://linkedin.com/company/thegridnexus',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'contact@thegridnexus.com',
      availableLanguage: ['English'],
    },
    description:
      'Gaming cybersecurity intelligence hub — protecting gamers and analyzing threats where gaming meets security. Expert analysis, interactive tools, and comprehensive security guides.',
    knowsAbout: [
      'Gaming Cybersecurity',
      'Threat Intelligence',
      'Game Security',
      'Cybersecurity News',
      'Tech Innovation',
      'Online Gaming Safety',
    ],
    foundingDate: '2024',
    publishingPrinciples: `${BASE_URL}/editorial`,
    ownershipFundingInfo: `${BASE_URL}/disclosure`,
    correctionsPolicy: `${BASE_URL}/editorial`,
    ethicsPolicy: `${BASE_URL}/content-policy`,
    masthead: `${BASE_URL}/about`,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// WebSite (SearchAction for sitelinks search box)
// ────────────────────────────────────────────────────────────────────────────
export function generateWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'The Grid Nexus',
    description:
      'Your security intelligence hub for the gaming and tech world. We protect gamers, secure systems, and analyze threats where gaming meets cybersecurity.',
    publisher: { '@id': `${BASE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/topics?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Article / NewsArticle
// ────────────────────────────────────────────────────────────────────────────
type ArticleWithSlug = Article & {
  slug?: string;
  updatedAt?: string;
  summary?: string;
  isBreaking?: boolean;
};

export function generateArticleSchema(article: ArticleWithSlug | null | undefined) {
  if (!article) return null;
  const publishedDate = new Date(article.publishedAt ?? Date.now()).toISOString();
  const modifiedDate  = article.updatedAt
    ? new Date(article.updatedAt).toISOString()
    : publishedDate;
  const articleId =
    (article as ArticleWithSlug).slug ??
    (article as Article & { _id?: string })._id ??
    article.id ??
    '';
  const articleUrl = `${BASE_URL}/article/${articleId}`;

  const wordCount = article.content
    ? Math.max(1, Math.floor(article.content.split(/\s+/).length))
    : 300;

  return {
    '@type': 'Article',
    '@id': `${articleUrl}#article`,
    headline: article.title,
    name: article.title,
    description: article.excerpt || (article as ArticleWithSlug).summary || '',
    url: articleUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    image: article.imageUrl
      ? [
          {
            '@type': 'ImageObject',
            url: article.imageUrl.startsWith('http')
              ? article.imageUrl
              : `${BASE_URL}${article.imageUrl}`,
            width: 1200,
            height: 630,
          },
        ]
      : [`${BASE_URL}/og-image.jpg`],
    datePublished:  publishedDate,
    dateModified:   modifiedDate,
    author: {
      '@type': 'Person',
      '@id': `${BASE_URL}/author/${authorSlug(article.author || '') || 'editorial'}#person`,
      name:  article.author || 'The Grid Nexus Editorial Team',
      url:   `${BASE_URL}/author/${authorSlug(article.author || '') || 'editorial'}`,
      worksFor: { '@id': `${BASE_URL}/#organization` },
    },
    publisher: { '@id': `${BASE_URL}/#organization` },
    isPartOf:  { '@id': `${BASE_URL}/#website` },
    articleSection: article.niche
      ? article.niche.charAt(0).toUpperCase() + article.niche.slice(1)
      : 'Technology',
    keywords:         (article.tags ?? []).join(', '),
    wordCount,
    inLanguage:       'en-US',
    isAccessibleForFree: true,
    ...(article.readTime ? { timeRequired: `PT${article.readTime}M` } : {}),
    // Speakable for voice search / AI assistants
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', '.article-summary', '.article-excerpt'],
    },
  };
}

export function generateNewsArticleSchema(article: ArticleWithSlug) {
  const base = generateArticleSchema(article);
  if (!base) return null;
  return {
    ...base,
    '@type': 'NewsArticle',
    ...(article.impactLevel === 'high' || article.isBreaking
      ? { dateline: 'Breaking' }
      : {}),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// BreadcrumbList
// ────────────────────────────────────────────────────────────────────────────
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item:  item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// FAQPage
// ────────────────────────────────────────────────────────────────────────────
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text:  faq.answer,
      },
    })),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// HowTo (for guides / tutorials)
// ────────────────────────────────────────────────────────────────────────────
export function generateHowToSchema(howTo: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
}) {
  return {
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name:  step.name,
      text:  step.text,
      ...(step.image
        ? { image: step.image.startsWith('http') ? step.image : `${BASE_URL}${step.image}` }
        : {}),
    })),
    ...(howTo.totalTime ? { totalTime: howTo.totalTime } : {}),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// CollectionPage (category hub — with ItemList for AI rich results)
// ────────────────────────────────────────────────────────────────────────────
export function generateCollectionPageSchema(category: {
  name: string;
  description: string;
  url: string;
  itemCount?: number;
}) {
  const pageUrl = category.url.startsWith('http') ? category.url : `${BASE_URL}${category.url}`;
  return {
    '@type': 'CollectionPage',
    '@id': `${pageUrl}#collection`,
    name: category.name,
    description: category.description,
    url: pageUrl,
    ...(category.itemCount ? { numberOfItems: category.itemCount } : {}),
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about:    { '@id': `${BASE_URL}/#organization` },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2'],
    },
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Person / Author (E-E-A-T signals)
// ────────────────────────────────────────────────────────────────────────────
export function generatePersonSchema(author: {
  name: string;
  jobTitle?: string;
  description?: string;
  imageUrl?: string;
  sameAs?: string[];
  expertise?: string[];
}) {
  const slug = authorSlug(author.name) || 'editorial';
  return {
    '@type': 'Person',
    '@id': `${BASE_URL}/author/${slug}#person`,
    name: author.name,
    url:  `${BASE_URL}/author/${slug}`,
    ...(author.jobTitle    ? { jobTitle:     author.jobTitle }    : {}),
    ...(author.description ? { description:  author.description } : {}),
    ...(author.imageUrl
      ? {
          image: {
            '@type': 'ImageObject',
            url: author.imageUrl.startsWith('http') ? author.imageUrl : `${BASE_URL}${author.imageUrl}`,
          },
        }
      : {}),
    ...(author.sameAs?.length      ? { sameAs:     author.sameAs }     : {}),
    ...(author.expertise?.length   ? { knowsAbout: author.expertise }  : {}),
    worksFor: { '@id': `${BASE_URL}/#organization` },
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Review (product / game reviews)
// ────────────────────────────────────────────────────────────────────────────
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
    '@type': 'Review',
    itemReviewed: {
      '@type': review.itemType,
      name:  review.itemName,
      ...(review.imageUrl ? { image: review.imageUrl } : {}),
    },
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type':       'Rating',
      ratingValue:   review.ratingValue,
      bestRating:    review.bestRating  ?? 10,
      worstRating:   review.worstRating ?? 1,
    },
    author: {
      '@type': 'Person',
      name:    review.author,
      url:     `${BASE_URL}/author/${authorSlug(review.author) || 'editorial'}`,
    },
    publisher:    { '@id': `${BASE_URL}/#organization` },
    datePublished: review.datePublished,
    url: review.url.startsWith('http') ? review.url : `${BASE_URL}${review.url}`,
    ...(review.pros?.length
      ? {
          positiveNotes: {
            '@type': 'ItemList',
            itemListElement: review.pros.map((pro, i) => ({
              '@type': 'ListItem', position: i + 1, name: pro,
            })),
          },
        }
      : {}),
    ...(review.cons?.length
      ? {
          negativeNotes: {
            '@type': 'ItemList',
            itemListElement: review.cons.map((con, i) => ({
              '@type': 'ListItem', position: i + 1, name: con,
            })),
          },
        }
      : {}),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// SoftwareApplication (tool pages)
// ────────────────────────────────────────────────────────────────────────────
export function generateSoftwareSchema(software: {
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: { price: number | string; priceCurrency: string };
  aggregateRating?: { ratingValue: number; ratingCount: number };
  url?: string;
}) {
  return {
    '@type': 'SoftwareApplication',
    name:                software.name,
    description:         software.description,
    applicationCategory: software.applicationCategory,
    ...(software.operatingSystem ? { operatingSystem: software.operatingSystem } : {}),
    ...(software.offers
      ? { offers: { '@type': 'Offer', price: software.offers.price, priceCurrency: software.offers.priceCurrency } }
      : {}),
    ...(software.aggregateRating
      ? {
          aggregateRating: {
            '@type':      'AggregateRating',
            ratingValue:  software.aggregateRating.ratingValue,
            ratingCount:  software.aggregateRating.ratingCount,
            bestRating:   5,
            worstRating:  1,
          },
        }
      : {}),
    ...(software.url ? { url: software.url } : {}),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// VideoObject
// ────────────────────────────────────────────────────────────────────────────
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
    '@type':        'VideoObject',
    name:           video.name,
    description:    video.description,
    thumbnailUrl:   video.thumbnailUrl,
    contentUrl:     video.contentUrl,
    embedUrl:       video.embedUrl || video.contentUrl,
    uploadDate:     video.uploadDate,
    ...(video.duration ? { duration: video.duration } : {}),
    publisher: { '@id': `${BASE_URL}/#organization` },
  };
}

// ────────────────────────────────────────────────────────────────────────────
// generateAllSchemas — orchestrator
// Returns an array of schema objects (no @context) suitable for a @graph.
// ────────────────────────────────────────────────────────────────────────────
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
  const schemas: object[] = [];

  // Always include Organization + WebSite
  schemas.push(generateOrganizationSchema());
  schemas.push(generateWebSiteSchema());

  // Article / NewsArticle
  if (options.article) {
    const art    = options.article as ArticleWithSlug;
    const isNews = art.impactLevel === 'high' || art.isBreaking;
    const schema = isNews ? generateNewsArticleSchema(art) : generateArticleSchema(art);
    if (schema) schemas.push(schema);
  }

  // Breadcrumbs
  if (options.breadcrumbs?.length) {
    schemas.push(generateBreadcrumbSchema(options.breadcrumbs));
  }

  // FAQ
  if (options.faqs?.length) {
    schemas.push(generateFAQSchema(options.faqs));
  }

  // HowTo
  if (options.howTo) {
    schemas.push(generateHowToSchema(options.howTo));
  }

  // Category collection page
  if (options.category) {
    schemas.push(generateCollectionPageSchema(options.category));
  }

  return schemas;
}

// ────────────────────────────────────────────────────────────────────────────
// Render helpers (for SSR / static output)
// ────────────────────────────────────────────────────────────────────────────
export function renderSchemaScript(schema: object): string {
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

export function renderSchemaScripts(schemas: object[]): string {
  return schemas.map(renderSchemaScript).join('\n');
}
