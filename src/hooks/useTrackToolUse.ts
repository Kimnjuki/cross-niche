/**
 * Track tool usage events in GA4 as key events
 * Fires gtag event and also stores locally
 */
export function useTrackToolUse() {
  const trackTool = (toolName: string, action: 'start' | 'complete' | 'share' | 'error', details?: Record<string, string | number>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'tool_use', {
        tool_name: toolName,
        tool_action: action,
        ...details,
        tool_category: 'security',
        engagement_time_msec: 1
      });
    }
  };

  const trackSignup = (method: 'email' | 'google' | 'discord') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'signup', {
        method,
        engagement_time_msec: 1
      });
    }
  };

  const trackArticle = (slug: string, action: 'read' | 'share' | 'bookmark') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'article_' + action, {
        article_slug: slug,
        engagement_time_msec: 1
      });
    }
  };

  const trackSearch = (query: string, results: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search', {
        search_term: query,
        results_count: results,
        engagement_time_msec: 1
      });
    }
  };

  return { trackTool, trackSignup, trackArticle, trackSearch };
}
