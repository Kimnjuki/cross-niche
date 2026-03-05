/**
 * TheGridNexus Open Graph Meta Tags Component
 * Implements dynamic OG images and meta descriptions for social sharing
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OpenGraphProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  siteName?: string;
  locale?: string;
}

export function OpenGraph({
  title = 'TheGridNexus - Intelligence at the Intersection',
  description = 'TheGridNexus delivers intelligence at the intersection of technology, cybersecurity, and gaming. Expert coverage for professionals who don\'t compromise.',
  image = 'https://thegridnexus.com/og-default.jpg',
  url = 'https://thegridnexus.com',
  type = 'website',
  article,
  siteName = 'TheGridNexus',
  locale = 'en_US'
}: OpenGraphProps) {
  
  const metaTags = [
    // Basic Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:url', content: url },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteName },
    { property: 'og:locale', content: locale },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:site', content: '@thegridnexus' },
    
    // Additional meta
    { name: 'description', content: description },
    { name: 'author', content: article?.author || 'TheGridNexus' },
    { name: 'keywords', content: article?.tags?.join(', ') || 'technology, cybersecurity, gaming, tech news, security threats, gaming industry' }
  ];

  // Article-specific meta tags
  if (type === 'article' && article) {
    if (article.publishedTime) {
      metaTags.push({ property: 'article:published_time', content: article.publishedTime });
    }
    if (article.modifiedTime) {
      metaTags.push({ property: 'article:modified_time', content: article.modifiedTime });
    }
    if (article.author) {
      metaTags.push({ property: 'article:author', content: article.author });
    }
    if (article.section) {
      metaTags.push({ property: 'article:section', content: article.section });
    }
    if (article.tags && article.tags.length > 0) {
      article.tags.forEach(tag => {
        metaTags.push({ property: 'article:tag', content: tag });
      });
    }
  }

  return (
    <Helmet>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      {metaTags.map((tag, index) => (
        <meta key={index} {...tag} />
      ))}
    </Helmet>
  );
}

// Hook for generating article Open Graph data
export function useArticleOpenGraph(article: any) {
  const title = article.title;
  const description = article.excerpt || article.description || 
    `Read ${article.title} on TheGridNexus - Expert coverage of ${article.category || 'technology, security, and gaming'}.`;
  const image = article.featuredImageUrl || article.image || 'https://thegridnexus.com/og-default.jpg';
  const url = `https://thegridnexus.com${article.slug}`;
  
  return {
    title,
    description,
    image,
    url,
    type: 'article' as const,
    article: {
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      author: article.author?.name || 'TheGridNexus Editorial Team',
      section: article.category,
      tags: article.tags || []
    }
  };
}

// Hook for generating category Open Graph data
export function useCategoryOpenGraph(category: string, description?: string) {
  const title = `${category} - TheGridNexus`;
  const url = `https://thegridnexus.com/${category.toLowerCase()}`;
  
  return {
    title,
    description: description || `Latest ${category} news and analysis from TheGridNexus. Expert coverage at the intersection of technology, cybersecurity, and gaming.`,
    url,
    type: 'website' as const
  };
}
