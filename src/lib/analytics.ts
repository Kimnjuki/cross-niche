/**
 * Analytics utilities for tracking user behavior
 * Integrates with Ahrefs Web Analytics and other analytics platforms
 */

/**
 * Track a page view
 * This is automatically handled by Ahrefs, but can be used for custom tracking
 */
export function trackPageView(url: string, title?: string) {
  // Ahrefs automatically tracks page views
  // This function can be extended for other analytics platforms
  
  if (typeof window !== 'undefined' && (window as any).ahrefs) {
    // If Ahrefs exposes a custom tracking API, use it here
    console.log('Page view tracked:', { url, title });
  }
}

/**
 * Track a custom event
 * Useful for tracking specific user interactions
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Track with Ahrefs if API is available
    // Also can be extended for Google Analytics, etc.
    console.log('Event tracked:', { eventName, eventData });
    
    // Dispatch custom event for other analytics tools
    window.dispatchEvent(new CustomEvent('analytics:track', {
      detail: { eventName, eventData }
    }));
  }
}

/**
 * Track article views
 */
export function trackArticleView(articleId: string, articleTitle: string) {
  trackEvent('article_view', {
    article_id: articleId,
    article_title: articleTitle,
  });
}

/**
 * Track article engagement
 */
export function trackArticleEngagement(
  articleId: string,
  action: 'bookmark' | 'share' | 'comment' | 'read',
  metadata?: Record<string, any>
) {
  trackEvent('article_engagement', {
    article_id: articleId,
    action,
    ...metadata,
  });
}

/**
 * Track search queries
 */
export function trackSearch(query: string, resultsCount: number) {
  trackEvent('search', {
    query,
    results_count: resultsCount,
  });
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup(email: string) {
  trackEvent('newsletter_signup', {
    email: email.substring(0, 3) + '***', // Privacy-friendly
  });
}

/**
 * Track user authentication
 */
export function trackAuth(action: 'login' | 'signup' | 'logout', method?: string) {
  trackEvent('auth', {
    action,
    method,
  });
}

