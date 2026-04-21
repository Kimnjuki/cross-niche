import { AdSenseAd, InArticleAd, SidebarAd, InFeedAd } from './AdSenseAd';
import { cn } from '@/lib/utils';
import { hasAdConsent, ADSENSE_CONFIG } from '@/lib/adsenseConfig';

interface AdPlacementProps {
  position: 'header' | 'sidebar' | 'in-article' | 'in-feed' | 'footer' | 'between-content';
  className?: string;
  contentLength?: number; // Word count of surrounding content
  hasSubstantialContent?: boolean; // Whether page has meaningful content
}

/**
 * Smart Ad Placement Component
 * Automatically places ads in optimal locations based on position prop
 * Enforces AdSense policy: only show ads on pages with substantial content
 */
export function AdPlacement({ 
  position, 
  className, 
  contentLength = 0,
  hasSubstantialContent = false 
}: AdPlacementProps) {
  // Check if user has consented to advertising cookies
  if (!hasAdConsent()) {
    return null; // Don't show ads if user hasn't consented
  }

  // AdSense Policy: No ads on pages without substantial content
  // Minimum requirements: 300+ words, meaningful content, not just navigation
  const MIN_CONTENT_LENGTH = 300;
  const hasMinimumContent = contentLength >= MIN_CONTENT_LENGTH || hasSubstantialContent;
  
  if (!hasMinimumContent) {
    // Don't show ads on pages with insufficient content
    // This prevents "Google-served ads on screens without publisher-content" violations
    return null;
  }

  const baseClasses = cn('w-full', className);

  switch (position) {
    case 'header':
      return (
        <div className={cn(baseClasses, 'mb-6')}>
          <AdSenseAd
            adSlot={ADSENSE_CONFIG.adSlots.header}
            adFormat="auto"
            responsive
          />
        </div>
      );

    case 'sidebar':
      return (
        <div className={cn(baseClasses, 'sticky top-20')}>
          <SidebarAd />
        </div>
      );

    case 'in-article':
      // Only show in-article ads if there's substantial content
      if (contentLength < 500) {
        return null;
      }
      return (
        <div className={cn(baseClasses, 'my-8')}>
          <InArticleAd />
        </div>
      );

    case 'in-feed':
      return (
        <div className={cn(baseClasses, 'my-6')}>
          <InFeedAd />
        </div>
      );

    case 'footer':
      return (
        <div className={cn(baseClasses, 'mt-12')}>
          <AdSenseAd
            adSlot={ADSENSE_CONFIG.adSlots.footer}
            adFormat="auto"
            responsive
          />
        </div>
      );

    case 'between-content':
      return (
        <div className={cn(baseClasses, 'my-8 py-4 border-y border-border/50')}>
          <AdSenseAd
            adSlot={ADSENSE_CONFIG.adSlots.betweenContent}
            adFormat="auto"
            responsive
          />
        </div>
      );

    default:
      return null;
  }
}

