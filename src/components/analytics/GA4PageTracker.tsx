import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics/ga4';

/**
 * Tracks SPA route changes in GA4 with enhanced context.
 * GA4's default page_view fires on initial load; this ensures
 * virtual page views are sent when users navigate client-side.
 */
export function GA4PageTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Determine page type from pathname
    let pageType: string | undefined;
    if (pathname === '/') {
      pageType = 'homepage';
    } else if (pathname.startsWith('/tech') || pathname.startsWith('/security') || pathname.startsWith('/gaming')) {
      pageType = 'category';
    } else if (pathname.startsWith('/article/')) {
      pageType = 'article';
    }

    trackPageView(pathname, document.title, pageType);
  }, [pathname]);

  return null;
}
