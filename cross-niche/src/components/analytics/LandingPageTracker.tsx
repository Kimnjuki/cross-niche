import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackLandingPageEngagement, trackScrollDepth } from '@/lib/analytics/ga4';

interface LandingPageTrackerProps {
  /** Page type: 'homepage' or 'category' */
  pageType: 'homepage' | 'category';
  /** Optional: number of articles viewed on this page */
  articlesViewed?: number;
}

/**
 * Tracks engagement metrics for landing pages (homepage, category pages).
 * Sends engagement data when user leaves the page or after 30 seconds.
 */
export function LandingPageTracker({ pageType, articlesViewed = 0 }: LandingPageTrackerProps) {
  const { pathname } = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<number>(0);
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    scrollDepthRef.current = 0;
    hasTrackedRef.current = false;

    // Track scroll depth
    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );
      scrollDepthRef.current = Math.max(scrollDepthRef.current, scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track engagement after 30 seconds
    const engagementTimeout = setTimeout(() => {
      if (!hasTrackedRef.current) {
        const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
        trackLandingPageEngagement(pathname, pageType, {
          articlesViewed,
          timeOnPage,
          scrollDepth: scrollDepthRef.current,
        });
        hasTrackedRef.current = true;
      }
    }, 30000);

    // Track on page unload
    const handleBeforeUnload = () => {
      if (!hasTrackedRef.current) {
        const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
        trackLandingPageEngagement(pathname, pageType, {
          articlesViewed,
          timeOnPage,
          scrollDepth: scrollDepthRef.current,
        });
        hasTrackedRef.current = true;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(engagementTimeout);

      // Final tracking on unmount
      if (!hasTrackedRef.current) {
        const timeOnPage = Math.floor((Date.now() - startTimeRef.current) / 1000);
        trackLandingPageEngagement(pathname, pageType, {
          articlesViewed,
          timeOnPage,
          scrollDepth: scrollDepthRef.current,
        });
      }
    };
  }, [pathname, pageType, articlesViewed]);

  return null;
}
