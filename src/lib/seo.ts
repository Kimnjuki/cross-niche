/**
 * Single source of truth for SEO meta tag data.
 * Use with SEOHead component or for static/SSR meta output.
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

const DEFAULT_OG = '/og-image.jpg';

/** Resolve full URL for og:image (origin + path if relative). */
function resolveOgImage(ogImage: string | undefined, fallback: string): string {
  const img = ogImage || fallback;
  if (typeof window === 'undefined') return img;
  return img.startsWith('http') ? img : `${window.location.origin}${img}`;
}

/**
 * Generates a consistent meta-tag payload from config.
 * Use this object to drive <meta> tags or pass into SEOHead props.
 */
export function generateMetaTags(config: SEOConfig): {
  title: string;
  description: string;
  keywords: string;
  'og:title': string;
  'og:description': string;
  'og:image': string;
  'og:url': string;
  'twitter:card': string;
  'twitter:title': string;
  'twitter:description': string;
  canonical: string;
  robots: string;
} {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const canonical = config.canonical ?? (typeof window !== 'undefined' ? window.location.href.split('?')[0].split('#')[0] : '');
  const ogImage = resolveOgImage(config.ogImage, DEFAULT_OG);

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    'og:title': config.title,
    'og:description': config.description,
    'og:image': ogImage,
    'og:url': canonical,
    'twitter:card': 'summary_large_image',
    'twitter:title': config.title,
    'twitter:description': config.description,
    canonical,
    robots: config.noindex ? 'noindex, nofollow' : 'index, follow',
  };
}
