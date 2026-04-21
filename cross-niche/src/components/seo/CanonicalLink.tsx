import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface CanonicalLinkProps {
  customUrl?: string;
}

/**
 * Article pages under /tech/:slug, /security/:slug, /gaming/:slug all serve
 * the same ArticlePage component as /article/:slug. Their SEOHead sets the
 * canonical to /article/:slug explicitly. If CanonicalLink also runs and sets
 * the canonical to /tech/:slug first, it creates a race that Ahrefs sees as a
 * "duplicate page without canonical". We skip setting the canonical for these
 * category-article sub-routes and let SEOHead (in Article.tsx) own it.
 *
 * Alias routes (/billing, /settings, /nexus/*) are now 301-redirected in
 * vercel.json so they never reach this component.
 */
const ARTICLE_SUBROUTE_RE = /^\/(tech|security|gaming)\/[^/]+/;

export const CanonicalLink = ({ customUrl }: CanonicalLinkProps) => {
  const location = useLocation();

  useEffect(() => {
    // Let SEOHead in ArticlePage handle the canonical for category article routes
    if (!customUrl && ARTICLE_SUBROUTE_RE.test(location.pathname)) {
      return;
    }

    const baseUrl = 'https://thegridnexus.com';
    const rawPath = customUrl
      ? (customUrl.startsWith('/') ? customUrl : `/${customUrl}`)
      : location.pathname;
    const pathWithoutQuery = rawPath.split('?')[0].split('#')[0];
    const normalizedPath =
      pathWithoutQuery === '/' ? '/' : pathWithoutQuery.replace(/\/+$/, '');
    const canonicalUrl = `${baseUrl}${normalizedPath}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.href = canonicalUrl;
  }, [location.pathname, customUrl]);

  return null;
};
