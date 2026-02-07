import { useEffect } from 'react';
import type { Article } from '@/types';
import { optimizeTitle, optimizeMetaDescription, generateArticleTitle, generateArticleMetaDescription } from '@/lib/seoUtils';
import { generateAllSchemas, generatePersonSchema } from '@/lib/schemaMarkup';

/** Person/author for E-E-A-T schema on author pages */
interface PersonSchema {
  name: string;
  jobTitle?: string;
  description?: string;
  imageUrl?: string;
  sameAs?: string[];
  expertise?: string[];
}

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
  autoGenerate?: boolean; // Auto-generate optimized title/description for articles
  noindex?: boolean; // Add noindex meta tag to prevent indexing
  /** FAQ items for FAQPage schema (homepage, landing pages) */
  faqs?: Array<{ question: string; answer: string }>;
  /** HowTo for guides/tutorials schema */
  howTo?: { name: string; description: string; steps: Array<{ name: string; text: string; image?: string }>; totalTime?: string };
  /** Person schema for author pages (E-E-A-T) */
  person?: PersonSchema;
}

export function SEOHead({
  title: providedTitle,
  description: providedDescription,
  keywords = ['technology', 'cybersecurity', 'gaming', 'AI', 'tech news', 'security', 'intelligence'],
  image = '/og-image.jpg',
  url = window.location.href,
  type = 'website',
  article,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  autoGenerate = true,
  noindex = false,
  faqs,
  howTo,
  person
}: SEOHeadProps) {
  // Auto-generate optimized title and description for articles if enabled
  const title = type === 'article' && article && autoGenerate
    ? generateArticleTitle(article)
    : providedTitle || 'The Grid Nexus - Tech, Security & Gaming Intelligence';
  
  const description = type === 'article' && article && autoGenerate
    ? generateArticleMetaDescription(article)
    : providedDescription || 'Stay ahead of the curve with expert analysis on technology, cybersecurity, and gaming. Get personalized insights, AI-powered tools, and community-driven intelligence.';
  
  // Ensure optimized values are calculated (60 chars for title, 160 for description)
  const optimizedTitle = optimizeTitle(title, 60);
  const optimizedDescription = optimizeMetaDescription(description, 160);

  useEffect(() => {
    // Update document title (ensure it's under 75 characters for SEO)
    document.title = optimizedTitle;

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
    updateMetaTag('description', optimizedDescription);
    updateMetaTag('keywords', [...keywords, ...tags].join(', '));
    updateMetaTag('author', author || 'The Grid Nexus');
    if (!noindex) {
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      updateMetaTag('googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      updateMetaTag('bingbot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }
    updateMetaTag('revisit-after', '1 days');
    updateMetaTag('distribution', 'global');
    updateMetaTag('rating', 'general');
    updateMetaTag('language', 'English');
    updateMetaTag('copyright', 'The Grid Nexus');

    // Open Graph tags (complete set for Ahrefs/social)
    updateMetaTag('og:title', optimizedTitle, true);
    updateMetaTag('og:description', optimizedDescription, true);
    const ogImage = image.startsWith('http') ? image : `${window.location.origin}${image}`;
    updateMetaTag('og:image', ogImage, true);
    if (ogImage.startsWith('https://')) {
      updateMetaTag('og:image:secure_url', ogImage, true);
    }
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:alt', optimizedTitle, true);
    updateMetaTag('og:image:type', 'image/jpeg', true);
    const canonicalForOg = (() => {
      try {
        const parsed = new URL(url.split('?')[0].split('#')[0]);
        const pathname = parsed.pathname || '/';
        const isHome = pathname === '/' || pathname === '';
        return isHome ? `${parsed.origin}/` : `${parsed.origin}${pathname.replace(/\/$/, '') || pathname}`;
      } catch {
        return url.split('?')[0].split('#')[0];
      }
    })();
    updateMetaTag('og:url', canonicalForOg, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'The Grid Nexus', true);
    updateMetaTag('og:locale', 'en_US', true);
    updateMetaTag('og:locale:alternate', 'en_GB', true);
    if (type === 'article' && article) {
      updateMetaTag('og:article:author', author || article.author || 'The Grid Nexus', true);
      if (section) {
        updateMetaTag('og:article:section', section, true);
      }
      tags.forEach(tag => {
        updateMetaTag('og:article:tag', tag, true);
      });
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', optimizedTitle);
    updateMetaTag('twitter:description', optimizedDescription);
    const twitterImage = image.startsWith('http') ? image : `${window.location.origin}${image}`;
    updateMetaTag('twitter:image', twitterImage);
    updateMetaTag('twitter:image:alt', optimizedTitle);
    updateMetaTag('twitter:site', '@thegridnexus');
    updateMetaTag('twitter:creator', '@thegridnexus');
    updateMetaTag('twitter:url', url);

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

    // Robots meta tag (noindex for 404 etc.)
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.name = 'robots';
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.content = 'noindex, nofollow';
    }

    // Canonical URL - consistent format: homepage with trailing slash, other pages without (matches sitemap)
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    try {
      const parsed = new URL(url.split('?')[0].split('#')[0]);
      const pathname = parsed.pathname || '/';
      const isHome = pathname === '/' || pathname === '';
      canonicalLink.href = isHome ? `${parsed.origin}/` : `${parsed.origin}${pathname.replace(/\/$/, '') || pathname}`;
    } catch {
      canonicalLink.href = url.split('?')[0].split('#')[0].replace(/\/$/, '') || url;
    }

    // Structured Data (JSON-LD) - Article + Organization for ranking (schema.org)
    let schemas = generateAllSchemas({
      article: type === 'article' && article ? article : undefined,
      breadcrumbs: type === 'article' && article ? [
        { name: 'Home', url: '/' },
        { name: (article.niche === 'tech' ? 'Tech' : article.niche === 'security' ? 'Security' : 'Gaming'), url: `/${article.niche}` },
        { name: article.title ?? 'Article', url: `/article/${article.slug ?? article._id ?? article.id ?? ''}` }
      ] : undefined,
      faqs: faqs && faqs.length > 0 ? faqs : undefined,
      howTo,
      isHomepage: url === window.location.origin || url === `${window.location.origin}/`,
      category: type === 'website' && !article ? {
        name: title,
        description: description,
        url: url
      } : undefined
    });

    // Add Person schema for author pages (E-E-A-T)
    if (person) {
      schemas = [...schemas, generatePersonSchema(person)];
    }

    // Remove existing schema scripts
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(script => script.remove());

    // Output schemas (Organization + Article always included for technical health)
    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = `schema-${index}`;
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // WebPage/WebSite @graph for non-article pages (Organization included)
    let structuredDataScript = document.querySelector('script[type="application/ld+json"][id="schema-graph"]') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.type = 'application/ld+json';
      structuredDataScript.id = 'schema-graph';
      document.head.appendChild(structuredDataScript);
    }

    const structuredData = type === 'article' && article ? null : {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${window.location.origin}/#website`,
          url: window.location.origin,
          name: 'The Grid Nexus',
          description: optimizedDescription,
          publisher: {
            '@id': `${window.location.origin}/#organization`
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${window.location.origin}/topics?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'Organization',
          '@id': `${window.location.origin}/#organization`,
          name: 'The Grid Nexus',
          url: window.location.origin,
          logo: {
            '@type': 'ImageObject',
            url: `${window.location.origin}/logo.png`
          },
          sameAs: [
            'https://twitter.com/thegridnexus',
            'https://facebook.com/thegridnexus'
          ]
        },
        {
          '@type': 'WebPage',
          '@id': `${url}#webpage`,
          url: url,
          name: optimizedTitle,
          description: optimizedDescription,
          isPartOf: {
            '@id': `${window.location.origin}/#website`
          },
          about: {
            '@id': `${window.location.origin}/#organization`
          },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: image.startsWith('http') ? image : `${window.location.origin}${image}`
          }
        }
      ]
    };

    if (structuredData) {
      structuredDataScript.textContent = JSON.stringify(structuredData);
    } else {
      structuredDataScript.textContent = '';
    }

  }, [optimizedTitle, optimizedDescription, title, description, keywords, image, url, type, article, publishedTime, modifiedTime, author, section, tags, noindex, faqs, howTo, person]);

  return null; // This component doesn't render anything
}