import { useEffect } from 'react';
import type { Article } from '@/types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: Article;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function SEOHead({
  title = 'The Grid Nexus - Tech, Security & Gaming Intelligence',
  description = 'Stay ahead of the curve with expert analysis on technology, cybersecurity, and gaming. Get personalized insights, AI-powered tools, and community-driven intelligence.',
  keywords = ['technology', 'cybersecurity', 'gaming', 'AI', 'tech news', 'security', 'intelligence'],
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  article,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}: SEOHeadProps) {

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', [...keywords, ...tags].join(', '));
    updateMetaTag('author', author || 'The Grid Nexus');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image.startsWith('http') ? image : `${window.location.origin}${image}`, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'The Grid Nexus', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image.startsWith('http') ? image : `${window.location.origin}${image}`);

    // Article-specific meta tags
    if (type === 'article' && article) {
      updateMetaTag('article:published_time', publishedTime || article.publishedAt, true);
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      if (author) {
        updateMetaTag('article:author', author, true);
      }
      if (section) {
        updateMetaTag('article:section', section, true);
      }
      tags.forEach(tag => {
        updateMetaTag('article:tag', tag, true);
      });
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = url;

    // Structured Data (JSON-LD)
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : 'WebSite',
      name: title,
      description: description,
      url: url,
      ...(type === 'article' && article ? {
        headline: article.title,
        image: image.startsWith('http') ? image : `${window.location.origin}${image}`,
        datePublished: article.publishedAt,
        author: {
          '@type': 'Person',
          name: author || article.author
        },
        publisher: {
          '@type': 'Organization',
          name: 'The Grid Nexus',
          logo: {
            '@type': 'ImageObject',
            url: `${window.location.origin}/logo.png`
          }
        },
        keywords: tags.join(', '),
        articleSection: section || article.niche,
        wordCount: Math.floor((article.content || article.excerpt).split(' ').length)
      } : {
        potentialAction: {
          '@type': 'SearchAction',
          target: `${window.location.origin}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      })
    };

    structuredDataScript.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, url, type, article, publishedTime, modifiedTime, author, section, tags]);

  return null; // This component doesn't render anything
}