import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackListingPageView } from '@/lib/analytics/ga4';

/**
 * All section/hub pages that should fire a listing_page_view event.
 * Article detail pages (e.g. /gaming/some-slug) are excluded by the
 * isArticleDetail check below.
 */
const LISTING_PAGE_PREFIXES = [
  '/',
  '/tech',
  '/security',
  '/gaming',
  '/news',
  '/guides',
  '/tutorials',
  '/reviews',
  '/topics',
  '/explore',
  '/blog',
  '/ai-pulse',
  '/startups',
  '/tools',
  '/roadmap',
  '/nexus-intersection',
  '/security-profile',
  '/community-threats',
  '/nexus-studio',
  '/learn',
  '/pulse',
  '/forums',
  '/podcasts',
  '/live-threat-dashboard',
  '/breach-sim',
  '/security-score',
  '/live-updates',
];

/** True when the path is an article detail under a niche prefix. */
function isArticleDetail(path: string): boolean {
  return /^\/(tech|security|gaming|news)\/[^/]+$/.test(path) ||
    path.startsWith('/article/') ||
    /^\/guides\/[^/]+$/.test(path);
}

/**
 * Tracks SPA route changes in GA4.
 * Sends page_view for every route and listing_page_view for hub/section pages.
 */
export function GA4PageTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView(pathname, document.title);

    // Fire listing_page_view for any section hub page (not article detail pages)
    const isListing =
      !isArticleDetail(pathname) &&
      (pathname === '/' ||
        LISTING_PAGE_PREFIXES.some(
          (prefix) => prefix !== '/' && pathname.startsWith(prefix),
        ));

    if (isListing) {
      trackListingPageView(pathname);
    }
  }, [pathname]);

  return null;
}
