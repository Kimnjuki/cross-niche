/**
 * Google Analytics 4 Implementation
 * Comprehensive event tracking for SEO and content performance
 * Aligned with index.html gtag (G-TJ1VXE91NE) - avoids duplicate script load
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// GA4 Measurement ID - must match index.html; env override for flexibility
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-TJ1VXE91NE';

/**
 * Initialize GA4 - uses existing gtag from index.html when present
 */
export function initGA4() {
  if (typeof window === 'undefined') return;

  // Ensure dataLayer exists (index.html may have already initialized)
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  // Only load script if gtag.js not already loaded (index.html loads it)
  const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  // Configure GA4 (safe to call multiple times)
  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID, {
    send_page_view: true,
    page_path: window.location.pathname,
    page_title: document.title,
    page_location: window.location.href,
  });
}

/**
 * Track page view with enhanced landing page context
 */
export function trackPageView(path: string, title?: string, pageType?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Determine page type if not provided
  const detectedPageType = pageType || detectPageType(path);
  
  // Determine content group for GA4 reporting
  const contentGroup = getContentGroup(path);

  const config: Record<string, any> = {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
    page_type: detectedPageType,
    content_group: contentGroup,
  };

  window.gtag('config', GA4_MEASUREMENT_ID, config);

  // Also send as event for better filtering in GA4
  trackEvent('page_view', {
    page_path: path,
    page_title: title || document.title,
    page_type: detectedPageType,
    content_group: contentGroup,
    event_label: title || path,
  });
}

/**
 * Detect page type from path
 */
function detectPageType(path: string): string {
  if (path === '/') return 'homepage';
  if (path.startsWith('/article/')) return 'article';
  if (path.startsWith('/tech')) return 'category';
  if (path.startsWith('/security')) return 'category';
  if (path.startsWith('/gaming')) return 'category';
  if (path.startsWith('/news')) return 'category';
  if (path.startsWith('/topics')) return 'topics';
  if (path.startsWith('/guides')) return 'guides';
  if (path.startsWith('/blog-series')) return 'blog-series';
  return 'other';
}

/**
 * Get content group for GA4 reporting
 */
function getContentGroup(path: string): string {
  if (path === '/') return 'homepage';
  if (path.startsWith('/tech')) return 'tech';
  if (path.startsWith('/security')) return 'security';
  if (path.startsWith('/gaming')) return 'gaming';
  if (path.startsWith('/news')) return 'news';
  if (path.startsWith('/article/')) {
    // Extract niche from article if possible
    return 'articles';
  }
  return 'other';
}

/**
 * Track landing page engagement (for category/homepage pages)
 */
export function trackLandingPageEngagement(
  pagePath: string,
  pageType: 'homepage' | 'category',
  engagementData?: {
    articlesViewed?: number;
    timeOnPage?: number;
    scrollDepth?: number;
  }
) {
  trackEvent('landing_page_engagement', {
    page_path: pagePath,
    page_type: pageType,
    content_group: getContentGroup(pagePath),
    articles_viewed: engagementData?.articlesViewed || 0,
    time_on_page: engagementData?.timeOnPage || 0,
    scroll_depth: engagementData?.scrollDepth || 0,
    event_label: pagePath,
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
 * Track social shares - uses GA4 recommended share event
 */
export function trackSocialShare(platform: string, articleId?: string, articleTitle?: string) {
  trackEvent('share', {
    method: platform,
    content_type: 'article',
    item_id: articleId,
    content_title: articleTitle,
    event_label: `Share on ${platform}`,
  });
}

/**
 * Track newsletter signup - uses GA4 recommended event generate_lead
 */
export function trackNewsletterSignup(source?: string) {
  const params = {
    event_category: 'conversion',
    value: 5,
    source: source || 'unknown',
    event_label: 'Newsletter subscription',
  };
  trackEvent('generate_lead', params);
  trackEvent('newsletter_signup', params); // Custom event for flexibility
}

/**
 * Track article view - GA4 recommended view_item for content (mark as Key event in GA4 UI).
 */
export function trackArticleView(articleId: string, articleTitle: string, niche?: string) {
  trackEvent('view_item', {
    content_type: 'article',
    item_id: articleId,
    item_name: articleTitle,
    content_group: niche || 'tech',
    event_label: articleTitle,
  });
  trackEvent('article_view', {
    article_id: articleId,
    article_title: articleTitle,
    niche: niche || 'tech',
    event_label: articleTitle,
  });
}

/**
 * Track related article click (internal navigation)
 */
export function trackRelatedArticleClick(
  sourceArticleId: string,
  targetArticleId: string,
  targetTitle?: string
) {
  trackEvent('related_article_click', {
    source_article_id: sourceArticleId,
    target_article_id: targetArticleId,
    target_title: targetTitle,
    event_category: 'engagement',
    event_label: targetTitle || targetArticleId,
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

/** Fired once per session when user has been on site 10+ seconds (GA4 engaged-session threshold). */
let engagedSessionEventFired = false;

/**
 * Fire engaged-session event at 10s so GA4 can count Engaged sessions and you can mark it as a Key event.
 */
function trackEngagedSessionThreshold() {
  if (typeof window === 'undefined' || engagedSessionEventFired) return;
  setTimeout(() => {
    if (engagedSessionEventFired) return;
    engagedSessionEventFired = true;
    trackEvent('user_engagement', {
      engagement_time_msec: 10000,
      event_category: 'engagement',
      event_label: '10s_engaged_session',
    });
  }, 10000);
}

/**
 * Initialize all tracking
 */
export function initAllTracking() {
  if (typeof window === 'undefined') return;

  initGA4();
  trackScrollDepth();
  trackExternalLinks();
  trackEngagedSessionThreshold();

  // Track initial page view
  trackPageView(window.location.pathname, document.title);
}




