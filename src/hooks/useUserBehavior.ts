import { useEffect, useCallback } from 'react';
import { UserBehavior, Article, Niche } from '@/types';
import { personalizationEngine } from '@/lib/ai/personalization';

export function useUserBehavior(userId: string = 'demo-user') {
  const trackBehavior = useCallback(
    (behavior: Omit<UserBehavior, 'id' | 'userId' | 'timestamp'>) => {
      personalizationEngine.trackUserBehavior({
        ...behavior,
        userId,
      });
    },
    [userId]
  );

  const trackArticleView = useCallback(
    (article: Article | null | undefined) => {
      if (!article) return;
      trackBehavior({
        articleId: article._id ?? article.id ?? article.slug ?? '',
        action: 'view',
        niche: article.niche ?? 'tech',
        tags: Array.isArray(article.tags) ? article.tags : [],
      });
    },
    [trackBehavior]
  );

  const trackArticleRead = useCallback(
    (article: Article | null | undefined, timeSpent?: number, scrollDepth?: number) => {
      if (!article) return;
      trackBehavior({
        articleId: article._id ?? article.id ?? article.slug ?? '',
        action: 'read',
        timeSpent,
        scrollDepth,
        niche: article.niche ?? 'tech',
        tags: Array.isArray(article.tags) ? article.tags : [],
      });
    },
    [trackBehavior]
  );

  const trackArticleBookmark = useCallback(
    (article: Article | null | undefined) => {
      if (!article) return;
      trackBehavior({
        articleId: article._id ?? article.id ?? article.slug ?? '',
        action: 'bookmark',
        niche: article.niche ?? 'tech',
        tags: Array.isArray(article.tags) ? article.tags : [],
      });
    },
    [trackBehavior]
  );

  const trackArticleLike = useCallback(
    (article: Article | null | undefined) => {
      if (!article) return;
      trackBehavior({
        articleId: article._id ?? article.id ?? article.slug ?? '',
        action: 'like',
        niche: article.niche ?? 'tech',
        tags: Array.isArray(article.tags) ? article.tags : [],
      });
    },
    [trackBehavior]
  );

  const trackArticleShare = useCallback(
    (article: Article | null | undefined) => {
      if (!article) return;
      trackBehavior({
        articleId: article._id ?? article.id ?? article.slug ?? '',
        action: 'share',
        niche: article.niche ?? 'tech',
        tags: Array.isArray(article.tags) ? article.tags : [],
      });
    },
    [trackBehavior]
  );

  const trackArticleComment = useCallback(
    (article: Article | null | undefined) => {
      if (!article) return;
      trackBehavior({
        articleId: article._id ?? article.id ?? article.slug ?? '',
        action: 'comment',
        niche: article.niche ?? 'tech',
        tags: Array.isArray(article.tags) ? article.tags : [],
      });
    },
    [trackBehavior]
  );

  return {
    trackBehavior,
    trackArticleView,
    trackArticleRead,
    trackArticleBookmark,
    trackArticleLike,
    trackArticleShare,
    trackArticleComment,
  };
}

// Hook for tracking reading progress and time spent (no-op when article is undefined)
export function useReadingTracker(article: Article | undefined, userId: string = 'demo-user') {
  const { trackArticleRead } = useUserBehavior(userId);

  useEffect(() => {
    // Hard guard: never touch article properties if missing or partial (avoids Hook Dead Zone crash)
    if (!article || !(article._id ?? article.id ?? article.slug)) return;

    let startTime = Date.now();
    let scrollDepth = 0;
    let hasTrackedView = false;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      scrollDepth = Math.max(scrollDepth, scrollPercent);

      // Track view when user scrolls past 25%
      if (!hasTrackedView && scrollPercent > 25) {
        trackArticleRead(article, Math.floor((Date.now() - startTime) / 1000), scrollDepth);
        hasTrackedView = true;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User left the page, track current reading progress
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        if (timeSpent > 10) { // Only track if spent more than 10 seconds
          trackArticleRead(article, timeSpent, scrollDepth);
        }
      } else {
        // User returned, reset start time
        startTime = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent > 10) {
        trackArticleRead(article, timeSpent, scrollDepth);
      }
    };

    // Track initial view
    trackArticleRead(article, 0, 0);

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Cleanup
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Final tracking on unmount
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent > 10) {
        trackArticleRead(article, timeSpent, scrollDepth);
      }
    };
  }, [article, trackArticleRead]);
}