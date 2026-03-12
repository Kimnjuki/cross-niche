/**
 * TheGridNexus Analytics Tracker
 * Comprehensive analytics tracking with custom events
 */

import React, { useEffect, useRef } from 'react';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

interface PageViewData {
  title: string;
  location: string;
  path: string;
  referrer?: string;
  userId?: string;
  customDimensions?: { [key: string]: any };
}

interface UserEngagement {
  timeOnPage: number;
  scrollDepth: number;
  clicks: number;
  formSubmissions: number;
  videoPlays: number;
  downloads: number;
}

export function useAnalyticsTracker() {
  const pageStartTime = useRef<number>(Date.now());
  const scrollDepthTracked = useRef<number>(0);
  const engagementData = useRef<UserEngagement>({
    timeOnPage: 0,
    scrollDepth: 0,
    clicks: 0,
    formSubmissions: 0,
    videoPlays: 0,
    downloads: 0
  });

  // Initialize analytics
  useEffect(() => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
        custom_map: {
          custom_dimension_1: 'user_type',
          custom_dimension_2: 'content_category',
          custom_dimension_3: 'engagement_score',
          custom_metric_1: 'scroll_depth',
          custom_metric_2: 'time_on_page'
        }
      });
    }

    // Hotjar heatmaps
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('trigger', 'page_view', {
        path: window.location.pathname,
        title: document.title
      });
    }

    // Custom event listeners
    setupEventListeners();

    return () => {
      // Cleanup
      removeEventListeners();
    };
  }, []);

  const setupEventListeners = () => {
    // Track scroll depth
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = Math.round((scrollPosition / scrollHeight) * 100);

      if (scrollPercentage > 25 && scrollDepthTracked.current < 25) {
        trackEvent('engagement', 'scroll_depth', '25%', 25);
        scrollDepthTracked.current = 25;
      }
      if (scrollPercentage > 50 && scrollDepthTracked.current < 50) {
        trackEvent('engagement', 'scroll_depth', '50%', 50);
        scrollDepthTracked.current = 50;
      }
      if (scrollPercentage > 75 && scrollDepthTracked.current < 75) {
        trackEvent('engagement', 'scroll_depth', '75%', 75);
        scrollDepthTracked.current = 75;
      }
      if (scrollPercentage > 90 && scrollDepthTracked.current < 90) {
        trackEvent('engagement', 'scroll_depth', '90%', 90);
        scrollDepthTracked.current = 90;
      }

      engagementData.current.scrollDepth = Math.max(engagementData.current.scrollDepth, scrollPercentage);
    };

    // Track clicks
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const className = target.className;
      const id = target.id;
      const text = target.textContent?.slice(0, 50);

      engagementData.current.clicks++;

      trackEvent('engagement', 'click', `${tagName}:${className || id || text}`);
    };

    // Track form submissions
    const handleSubmit = (event: Event) => {
      const target = event.target as HTMLFormElement;
      const formName = target.name || target.id || 'unknown_form';
      
      engagementData.current.formSubmissions++;
      trackEvent('conversion', 'form_submit', formName);
    };

    // Track video plays
    const handleVideoPlay = (event: Event) => {
      const target = event.target as HTMLVideoElement;
      const videoTitle = target.title || target.src || 'unknown_video';
      
      engagementData.current.videoPlays++;
      trackEvent('engagement', 'video_play', videoTitle);
    };

    // Track downloads
    const handleDownload = (event: Event) => {
      const target = event.target as HTMLAnchorElement;
      const href = target.href;
      const fileName = href.split('/').pop() || 'unknown_file';
      
      engagementData.current.downloads++;
      trackEvent('engagement', 'download', fileName);
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('play', handleVideoPlay, true);

    // Track specific download links
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      if (link && link.href && link.download) {
        handleDownload(event);
      }
    });
  };

  const removeEventListeners = () => {
    window.removeEventListener('scroll', () => {});
    document.removeEventListener('click', () => {});
    document.removeEventListener('submit', () => {});
    document.removeEventListener('play', () => {});
  };

  // Track page view
  const trackPageView = (data: PageViewData) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: data.title,
        page_location: data.location,
        custom_map: data.customDimensions
      });
    }

    // Send to custom analytics endpoint
    sendToAnalytics({
      type: 'pageview',
      data: {
        title: data.title,
        location: data.location,
        path: data.path,
        referrer: data.referrer,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        userId: data.userId,
        customDimensions: data.customDimensions
      }
    });
  };

  // Track custom events
  const trackEvent = (event: AnalyticsEvent) => {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        non_interaction: event.nonInteraction
      });
    }

    // Hotjar
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('event', event.action, {
        category: event.category,
        label: event.label,
        value: event.value
      });
    }

    // Custom analytics
    sendToAnalytics({
      type: 'event',
      data: {
        category: event.category,
        action: event.action,
        label: event.label,
        value: event.value,
        nonInteraction: event.nonInteraction,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href,
        pageTitle: document.title
      }
    });
  };

  // Track guide completion
  const trackGuideCompletion = (guideId: string, guideTitle: string, timeSpent: number) => {
    trackEvent({
      category: 'guides',
      action: 'complete',
      label: guideTitle,
      value: Math.round(timeSpent / 1000) // Convert to seconds
    });

    // Track guide-specific metrics
    sendToAnalytics({
      type: 'guide_completion',
      data: {
        guideId,
        guideTitle,
        timeSpent: Math.round(timeSpent / 1000),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      }
    });
  };

  // Track BAS simulation
  const trackBASSimulation = (platform: string, scenario: string, result: string, timeSpent: number) => {
    trackEvent({
      category: 'bas_simulation',
      action: 'run',
      label: `${platform}:${scenario}`,
      value: Math.round(timeSpent / 1000)
    });

    sendToAnalytics({
      type: 'bas_simulation',
      data: {
        platform,
        scenario,
        result,
        timeSpent: Math.round(timeSpent / 1000),
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href
      }
    });
  };

  // Track convergence interaction
  const trackConvergenceInteraction = (areas: string[], action: string) => {
    trackEvent({
      category: 'convergence',
      action: action,
      label: areas.join('+'),
      value: areas.length
    });

    sendToAnalytics({
      type: 'convergence_interaction',
      data: {
        areas,
        action,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href
      }
    });
  };

  // Track ad engagement
  const trackAdEngagement = (adPosition: string, adType: string, action: string) => {
    trackEvent({
      category: 'ads',
      action: action,
      label: `${adPosition}:${adType}`
    });

    sendToAnalytics({
      type: 'ad_engagement',
      data: {
        adPosition,
        adType,
        action,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href
      }
    });
  };

  // Track search behavior
  const trackSearch = (query: string, category: string, resultsCount: number) => {
    trackEvent({
      category: 'search',
      action: 'perform',
      label: category,
      value: resultsCount
    });

    sendToAnalytics({
      type: 'search',
      data: {
        query,
        category,
        resultsCount,
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href
      }
    });
  };

  // Send data to analytics endpoint
  const sendToAnalytics = (payload: any) => {
    // In production, send to your analytics backend
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }).catch(error => {
        console.warn('Analytics tracking failed:', error);
      });
    } else {
      // In development, log to console
      console.log('Analytics Event:', payload);
    }
  };

  // Track page unload (time on page)
  useEffect(() => {
    const handlePageUnload = () => {
      const timeOnPage = Date.now() - pageStartTime.current;
      engagementData.current.timeOnPage = timeOnPage;

      trackEvent({
        category: 'engagement',
        action: 'time_on_page',
        value: Math.round(timeOnPage / 1000) // Convert to seconds
      });

      sendToAnalytics({
        type: 'page_engagement',
        data: {
          timeOnPage: Math.round(timeOnPage / 1000),
          scrollDepth: engagementData.current.scrollDepth,
          clicks: engagementData.current.clicks,
          formSubmissions: engagementData.current.formSubmissions,
          videoPlays: engagementData.current.videoPlays,
          downloads: engagementData.current.downloads,
          timestamp: new Date().toISOString(),
          pageUrl: window.location.href,
          pageTitle: document.title
        }
      });
    };

    window.addEventListener('beforeunload', handlePageUnload);
    window.addEventListener('pagehide', handlePageUnload);

    return () => {
      window.removeEventListener('beforeunload', handlePageUnload);
      window.removeEventListener('pagehide', handlePageUnload);
    };
  }, []);

  return {
    trackPageView,
    trackEvent,
    trackGuideCompletion,
    trackBASSimulation,
    trackConvergenceInteraction,
    trackAdEngagement,
    trackSearch,
    engagementData: engagementData.current
  };
}

// Global analytics interface
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    hj?: (command: string, ...args: any[]) => void;
  }
}

export default useAnalyticsTracker;
