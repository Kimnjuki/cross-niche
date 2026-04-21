/**
 * TheGridNexus Schema.org Structured Data Components
 * Implements SEO-critical structured data for rich snippets
 */

import React from 'react';

interface SchemaMarkupProps {
  type: 'Article' | 'NewsArticle' | 'BreadcrumbList' | 'FAQPage' | 'WebSite';
  data: any;
}

export function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const generateSchema = () => {
    switch (type) {
      case 'Article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.headline,
          description: data.description,
          image: data.image,
          author: {
            '@type': 'Person',
            name: data.author?.name || 'TheGridNexus Editorial Team',
            url: data.author?.url || 'https://thegridnexus.com'
          },
          publisher: {
            '@type': 'Organization',
            name: 'TheGridNexus',
            url: 'https://thegridnexus.com',
            logo: {
              '@type': 'ImageObject',
              url: 'https://thegridnexus.com/logo.png'
            }
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url
          },
          articleSection: data.category,
          keywords: data.tags?.join(', '),
          wordCount: data.wordCount,
          ...data.customFields
        };

      case 'NewsArticle':
        return {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: data.headline,
          description: data.description,
          image: data.image,
          author: {
            '@type': 'Person',
            name: data.author?.name || 'TheGridNexus Editorial Team'
          },
          publisher: {
            '@type': 'Organization',
            name: 'TheGridNexus',
            url: 'https://thegridnexus.com'
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url
          },
          articleSection: data.category,
          dateline: data.dateline,
          ...data.customFields
        };

      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.breadcrumbs.map((crumb: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url
          }))
        };

      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.faqs.map((faq: any) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        };

      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'TheGridNexus',
          url: 'https://thegridnexus.com',
          description: 'Intelligence Layer at the Intersection of Technology, Security, and Gaming',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://thegridnexus.com/search?q={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
          },
          publisher: {
            '@type': 'Organization',
            name: 'TheGridNexus',
            url: 'https://thegridnexus.com'
          }
        };

      default:
        return {};
    }
  };

  const schema = generateSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  );
}

// Hook for generating article schema
export function useArticleSchema(article: any) {
  return {
    headline: article.title,
    description: article.excerpt || article.description,
    image: article.featuredImageUrl || article.image,
    url: `https://thegridnexus.com${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    category: article.category,
    tags: article.tags,
    wordCount: article.wordCount || Math.ceil(article.body?.length / 5) || 500,
    author: article.author,
    customFields: {
      isAccessibleForFree: !article.premium,
      audience: article.audience || 'Professionals',
      about: article.niche
    }
  };
}

// Hook for generating breadcrumb schema
export function useBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return { breadcrumbs };
}

// Hook for generating FAQ schema
export function useFAQSchema(faqs: Array<{question: string, answer: string}>) {
  return { faqs };
}
