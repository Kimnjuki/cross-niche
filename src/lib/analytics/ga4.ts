/**
 * Google Analytics 4 Implementation
 * Comprehensive event tracking for SEO and content performance
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// GA4 Measurement ID - Replace with your actual ID
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';

/**
 * Initialize GA4
 */
export function initGA4() {
  if (typeof window === 'undefined') return;

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  // Configure GA4
  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: true,
    page_path: window.location.pathname,
    page_title: document.title,
    page_location: window.location.href
  });
}

/**
 * Track page view
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA4_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href
  });
}

/**
 * Track custom events
 */
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    ...parameters,
    event_category: parameters?.event_category || 'engagement',
    event_label: parameters?.event_label || eventName
  });
}

/**
 * Track scroll depth
 */
let scrollDepthTracked = {
  25: false,
  50: false,
  75: false,
  90: false
};

export function trackScrollDepth() {
  if (typeof window === 'undefined') return;

  const trackScroll = () => {
    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    );

    if (scrollPercent >= 25 && !scrollDepthTracked[25]) {
      trackEvent('scroll', { value: 25, event_label: '25% scroll depth' });
      scrollDepthTracked[25] = true;
    }
    if (scrollPercent >= 50 && !scrollDepthTracked[50]) {
      trackEvent('scroll', { value: 50, event_label: '50% scroll depth' });
      scrollDepthTracked[50] = true;
    }
    if (scrollPercent >= 75 && !scrollDepthTracked[75]) {
      trackEvent('scroll', { value: 75, event_label: '75% scroll depth' });
      scrollDepthTracked[75] = true;
    }
    if (scrollPercent >= 90 && !scrollDepthTracked[90]) {
      trackEvent('scroll', { value: 90, event_label: '90% scroll depth' });
      scrollDepthTracked[90] = true;
    }
  };

  window.addEventListener('scroll', trackScroll, { passive: true });
}

/**
 * Track article read time
 */
let readTimeStart: number | null = null;
let readTimeInterval: NodeJS.Timeout | null = null;

export function trackArticleReadTime(articleId: string, readTimeMinutes: number) {
  if (typeof window === 'undefined') return;

  readTimeStart = Date.now();

  // Track when user has read for 30 seconds
  setTimeout(() => {
    trackEvent('article_read_time', {
      article_id: articleId,
      read_time_seconds: 30,
      event_label: '30 seconds read'
    });
  }, 30000);

  // Track when user has read for 60 seconds
  setTimeout(() => {
    trackEvent('article_read_time', {
      article_id: articleId,
      read_time_seconds: 60,
      event_label: '1 minute read'
    });
  }, 60000);

  // Track completion when user reaches end
  const trackCompletion = () => {
    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    );

    if (scrollPercent >= 95 && readTimeStart) {
      const totalReadTime = Math.round((Date.now() - readTimeStart) / 1000);
      trackEvent('article_completed', {
        article_id: articleId,
        read_time_seconds: totalReadTime,
        estimated_read_time: readTimeMinutes * 60,
        event_label: 'Article completed'
      });
      readTimeStart = null;
    }
  };

  if (readTimeInterval) {
    clearInterval(readTimeInterval);
  }

  readTimeInterval = setInterval(trackCompletion, 5000);
}

/**
 * Track external link clicks
 */
export function trackExternalLinks() {
  if (typeof window === 'undefined') return;

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');

    if (link && link.href && !link.href.startsWith(window.location.origin)) {
      trackEvent('click', {
        event_category: 'outbound',
        event_label: link.href,
        transport_type: 'beacon'
      });
    }
  });
}

/**
 * Track social shares
 */
export function trackSocialShare(platform: string, articleId?: string, articleTitle?: string) {
  trackEvent('share', {
    method: platform,
    content_type: 'article',
    item_id: articleId,
    content_title: articleTitle,
    event_label: `Share on ${platform}`
  });
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup(source?: string) {
  trackEvent('newsletter_signup', {
    event_category: 'conversion',
    value: 5, // Estimated value in dollars
    source: source || 'unknown',
    event_label: 'Newsletter subscription'
  });
}

/**
 * Track search queries
 */
export function trackSearch(query: string, resultsCount?: number) {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount || 0,
    event_label: `Search: ${query}`
  });
}

/**
 * Track video engagement
 */
export function trackVideoEngagement(videoId: string, action: 'play' | 'pause' | 'complete', progress?: number) {
  trackEvent('video_engagement', {
    video_id: videoId,
    video_action: action,
    video_progress: progress,
    event_label: `Video ${action}`
  });
}

/**
 * Track content engagement
 */
export function trackContentEngagement(contentType: string, contentId: string, action: string) {
  trackEvent('content_engagement', {
    content_type: contentType,
    content_id: contentId,
    engagement_action: action,
    event_label: `${contentType} ${action}`
  });
}

/**
 * Set custom dimensions
 */
export function setCustomDimension(dimensionName: string, value: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('set', { [dimensionName]: value });
}

/**
 * Track conversions
 */
export function trackConversion(conversionName: string, value?: number, currency: string = 'USD') {
  trackEvent('conversion', {
    conversion_name: conversionName,
    value: value || 0,
    currency: currency,
    event_label: conversionName
  });
}

/**
 * Initialize all tracking
 */
export function initAllTracking() {
  if (typeof window === 'undefined') return;

  initGA4();
  trackScrollDepth();
  trackExternalLinks();

  // Track initial page view
  trackPageView(window.location.pathname, document.title);
}




