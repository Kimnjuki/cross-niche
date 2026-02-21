import { AdSenseAd, InArticleAd, SidebarAd, InFeedAd } from './AdSenseAd';
import { cn } from '@/lib/utils';
import { hasAdConsent, ADSENSE_CONFIG } from '@/lib/adsenseConfig';

interface AdPlacementProps {
  position: 'header' | 'sidebar' | 'in-article' | 'in-feed' | 'footer' | 'between-content';
  className?: string;
}

/**
 * Smart Ad Placement Component
 * Automatically places ads in optimal locations based on position prop
 */
export function AdPlacement({ position, className }: AdPlacementProps) {
  // Check if user has consented to advertising cookies
  if (!hasAdConsent()) {
    return null; // Don't show ads if user hasn't consented
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

