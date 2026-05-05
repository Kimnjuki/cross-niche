import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = sessionStorage.getItem('_nxSessionId');
  if (!id) {
    id = typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    sessionStorage.setItem('_nxSessionId', id);
  }
  return id;
}

export function useTrackToolUse() {
  const logToConvex = useMutation(api.toolAnalytics.logToolUse);

  const trackTool = (
    toolName: string,
    action: 'start' | 'complete' | 'share' | 'error',
    details?: Record<string, string | number>
  ) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'tool_use', {
        tool_name: toolName,
        tool_action: action,
        ...details,
        tool_category: 'security',
        engagement_time_msec: 1,
      });
    }

    if (action === 'start') {
      logToConvex({
        toolId: toolName,
        sessionId: getSessionId(),
        input: details ?? {},
        status: 'success',
        latencyMs: 0,
        createdAt: Date.now(),
      }).catch(() => {});
    }
  };

  const trackSignup = (method: 'email' | 'google' | 'discord') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'signup', {
        method,
        engagement_time_msec: 1,
      });
    }
  };

  const trackArticle = (slug: string, action: 'read' | 'share' | 'bookmark') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'article_' + action, {
        article_slug: slug,
        engagement_time_msec: 1,
      });
    }
  };

  const trackSearch = (query: string, results: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'search', {
        search_term: query,
        results_count: results,
        engagement_time_msec: 1,
      });
    }
  };

  return { trackTool, trackSignup, trackArticle, trackSearch };
}
