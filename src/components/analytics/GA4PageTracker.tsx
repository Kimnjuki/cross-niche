import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackListingPageView } from '@/lib/analytics/ga4';

/**
 * Tracks SPA route changes in GA4 with enhanced context.
 * Sends listing_page_view for landing/list pages so Funnel Exploration and Landing page reports work.
 */
export function GA4PageTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    let pageType: string | undefined;
    if (pathname === '/') {
      pageType = 'homepage';
    } else if (pathname.startsWith('/tech') || pathname.startsWith('/security') || pathname.startsWith('/gaming') || pathname.startsWith('/news')) {
      pageType = 'category';
    } else if (pathname.startsWith('/article/')) {
      pageType = 'article';
    }

    trackPageView(pathname, document.title, pageType);

    // Funnel step: listing view (for Reports > Engagement > Landing page & Funnel Exploration)
    if (pathname === '/' || pathname.startsWith('/tech') || pathname.startsWith('/security') || pathname.startsWith('/gaming') || pathname.startsWith('/news')) {
      trackListingPageView(pathname);
    }
  }, [pathname]);

  return null;
}
