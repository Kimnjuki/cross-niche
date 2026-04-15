import { useEffect } from 'react';
import type { Article } from '@/types';
import { optimizeTitle, optimizeMetaDescription, generateArticleMetaDescription } from '@/lib/seoUtils';
import { generateAllSchemas, generatePersonSchema } from '@/lib/schemaMarkup';

const SITE_NAME = 'The Grid Nexus';
const BASE_URL = 'https://thegridnexus.com';

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
  autoGenerate?: boolean;
  noindex?: boolean;
  faqs?: Array<{ question: string; answer: string }>;
  howTo?: {
    name: string;
    description: string;
    steps: Array<{ name: string; text: string; image?: string }>;
    totalTime?: string;
  };
  person?: PersonSchema;
}

export function SEOHead({
  title: providedTitle,
  description: providedDescription,
  keywords = ['technology', 'cybersecurity', 'gaming', 'AI', 'tech news', 'security intelligence'],
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
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
  person,
}: SEOHeadProps) {
  // ── Title construction (unique per page, 50-60 chars) ──────────────────
  const rawTitle =
    type === 'article' && article && autoGenerate
      ? `${article.title || 'Untitled'} | ${SITE_NAME}`
      : providedTitle || SITE_NAME;

  const rawDescription =
    type === 'article' && article && autoGenerate
      ? generateArticleMetaDescription(article)
      : providedDescription || '';

  const optimizedTitle       = optimizeTitle(rawTitle, 60);
  const optimizedDescription = optimizeMetaDescription(rawDescription, 160);

  // ── Canonical URL (strip query + fragment, always HTTPS production) ────
  function buildCanonical(href: string): string {
    try {
      const parsed = new URL(href.split('?')[0].split('#')[0]);
      const origin =
        typeof import.meta !== 'undefined' && import.meta.env?.PROD
          ? BASE_URL
          : parsed.origin;
      return `${origin}${parsed.pathname}`;
    } catch {
      return href.split('?')[0].split('#')[0];
    }
  }
  const canonical = buildCanonical(url);

  // ── Absolute image URL (always HTTPS — fixes "mixed content" warnings) ─
  function absoluteImage(src: string): string {
    if (src.startsWith('https://')) return src;
    if (src.startsWith('http://')) return src.replace('http://', 'https://');
    const origin =
      typeof window !== 'undefined' ? window.location.origin : BASE_URL;
    return `${origin}${src.startsWith('/') ? src : `/${src}`}`;
  }
  const ogImage = absoluteImage(image);

  useEffect(() => {
    // ── document.title ──────────────────────────────────────────────────
    document.title = optimizedTitle;

    // ── Helper: upsert meta tag ────────────────────────────────────────
    function upsertMeta(attr: 'name' | 'property', key: string, value: string) {
      let el = document.querySelector(
        `meta[${attr}="${key}"]`
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    }

    // ── Basic meta ─────────────────────────────────────────────────────
    upsertMeta('name', 'description',   optimizedDescription);
    upsertMeta('name', 'keywords',      [...keywords, ...tags].join(', '));
    upsertMeta('name', 'author',        author || SITE_NAME);
    upsertMeta('name', 'language',      'en');
    upsertMeta('name', 'copyright',     SITE_NAME);
    upsertMeta('name', 'distribution',  'global');
    upsertMeta('name', 'rating',        'general');
    upsertMeta('name', 'revisit-after', '1 days');

    // ── Robots ─────────────────────────────────────────────────────────
    const robotsValue = noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    upsertMeta('name', 'robots',    robotsValue);
    upsertMeta('name', 'googlebot', robotsValue);
    upsertMeta('name', 'bingbot',   robotsValue);

    // ── Open Graph ─────────────────────────────────────────────────────
    upsertMeta('property', 'og:title',              optimizedTitle);
    upsertMeta('property', 'og:description',        optimizedDescription);
    upsertMeta('property', 'og:url',                canonical);
    upsertMeta('property', 'og:type',               type);
    upsertMeta('property', 'og:image',              ogImage);
    upsertMeta('property', 'og:image:secure_url',   ogImage);
    upsertMeta('property', 'og:image:width',        '1200');
    upsertMeta('property', 'og:image:height',       '630');
    upsertMeta('property', 'og:image:alt',          optimizedTitle);
    upsertMeta('property', 'og:image:type',         'image/jpeg');
    upsertMeta('property', 'og:site_name',          SITE_NAME);
    upsertMeta('property', 'og:locale',             'en_US');
    upsertMeta('property', 'og:locale:alternate',   'en_GB');

    if (type === 'article' && article) {
      upsertMeta('property', 'og:article:author',  author || article.author || SITE_NAME);
      if (section) upsertMeta('property', 'og:article:section', section);
      if (publishedTime || article.publishedAt) {
        upsertMeta('property', 'article:published_time', publishedTime || article.publishedAt);
      }
      if (modifiedTime) {
        upsertMeta('property', 'article:modified_time', modifiedTime);
      }
      if (author) upsertMeta('property', 'article:author', author);
      if (section) upsertMeta('property', 'article:section', section);
    }

    // ── Twitter Card ───────────────────────────────────────────────────
    upsertMeta('name', 'twitter:card',        'summary_large_image');
    upsertMeta('name', 'twitter:title',       optimizedTitle);
    upsertMeta('name', 'twitter:description', optimizedDescription);
    upsertMeta('name', 'twitter:image',       ogImage);
    upsertMeta('name', 'twitter:image:alt',   optimizedTitle);
    upsertMeta('name', 'twitter:site',        '@thegridnexus');
    upsertMeta('name', 'twitter:creator',     '@thegridnexus');
    upsertMeta('name', 'twitter:url',         canonical);

    // ── Canonical link ─────────────────────────────────────────────────
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    // ── hreflang (fixes "Missing hreflang" warning) ────────────────────
    const hreflangPairs: [string, string][] = [
      ['en',       canonical],
      ['en-US',    canonical],
      ['x-default', canonical],
    ];
    hreflangPairs.forEach(([lang, href]) => {
      let el = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = 'alternate';
        el.setAttribute('hreflang', lang);
        document.head.appendChild(el);
      }
      el.href = href;
    });

    // ── Structured Data: single consolidated @graph ────────────────────
    // Remove ALL existing JSON-LD scripts first (prevents duplicates)
    document.querySelectorAll('script[type="application/ld+json"]').forEach(s => s.remove());

    const schemas = generateAllSchemas({
      article: type === 'article' && article ? article : undefined,
      breadcrumbs:
        type === 'article' && article
          ? [
              { name: 'Home', url: '/' },
              {
                name:
                  article.niche === 'tech'
                    ? 'Tech'
                    : article.niche === 'security'
                    ? 'Security'
                    : 'Gaming',
                url: `/${article.niche}`,
              },
              {
                name: article.title ?? 'Article',
                url: `/article/${article.slug ?? article._id ?? article.id ?? ''}`,
              },
            ]
          : undefined,
      faqs:     faqs && faqs.length > 0 ? faqs : undefined,
      howTo,
      isHomepage:
        typeof window !== 'undefined' &&
        (url === window.location.origin || url === `${window.location.origin}/`),
      category:
        type === 'website' && !article
          ? { name: optimizedTitle, description: optimizedDescription, url: canonical }
          : undefined,
    });

    if (person) schemas.push(generatePersonSchema(person));

    // Build one consolidated @graph script — no duplicate Organization/WebSite
    const graphScript = document.createElement('script');
    graphScript.type = 'application/ld+json';
    graphScript.id   = 'schema-graph-main';
    graphScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemas,
    });
    document.head.appendChild(graphScript);

  }, [
    optimizedTitle, optimizedDescription, keywords, ogImage, canonical,
    type, article, publishedTime, modifiedTime, author, section, tags,
    noindex, faqs, howTo, person,
  ]);

  return null;
}
