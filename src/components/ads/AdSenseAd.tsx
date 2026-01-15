import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { hasAdConsent } from '@/lib/adsenseConfig';

interface AdSenseAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
  fullWidthResponsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

/**
 * Google AdSense Ad Component
 * 
 * Usage:
 * <AdSenseAd 
 *   adSlot="1234567890" 
 *   adFormat="auto"
 *   responsive
 * />
 */
export function AdSenseAd({
  adSlot,
  adFormat = 'auto',
  style,
  className,
  responsive = true,
  fullWidthResponsive = false,
}: AdSenseAdProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adBlocked, setAdBlocked] = useState(false);

  useEffect(() => {
    // Check if advertising cookies are allowed
    if (!hasAdConsent()) {
      setAdLoaded(false);
      return; // Don't load ads if user hasn't consented
    }

    // Wait for AdSense script to load
    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        try {
          // Check if ad element exists
          const adElement = document.querySelector(`[data-ad-slot="${adSlot}"]`);
          if (adElement && !adLoaded) {
            window.adsbygoogle.push({});
            setAdLoaded(true);
          }
        } catch (error) {
          console.warn('AdSense error:', error);
          setAdBlocked(true);
        }
      } else {
        // Retry after a short delay
        setTimeout(loadAd, 100);
      }
    };

    // Check if ads are blocked
    const checkAdBlock = async () => {
      try {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        testAd.style.position = 'absolute';
        testAd.style.left = '-9999px';
        document.body.appendChild(testAd);
        
        setTimeout(() => {
          const blocked = testAd.offsetHeight === 0;
          setAdBlocked(blocked);
          document.body.removeChild(testAd);
          if (!blocked) {
            loadAd();
          }
        }, 100);
      } catch {
        loadAd();
      }
    };

    // Listen for consent changes
    const handleConsentChange = () => {
      if (hasAdConsent() && !adLoaded) {
        checkAdBlock();
      }
    };

    window.addEventListener('cookieConsentUpdated', handleConsentChange);
    checkAdBlock();

    return () => {
      window.removeEventListener('cookieConsentUpdated', handleConsentChange);
    };
  }, [adSlot, adLoaded]);

  // Don't render if user hasn't consented
  if (!hasAdConsent()) {
    return null;
  }

  // Don't render if ads are blocked
  if (adBlocked) {
    return null;
  }

  const adStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    minHeight: adFormat === 'auto' ? 100 : 250,
    ...style,
  };

  const adClass = cn(
    'adsbygoogle',
    responsive && 'adsbygoogle-responsive',
    fullWidthResponsive && 'adsbygoogle-full-width',
    className
  );

  return (
    <div className="my-8 flex justify-center">
      <ins
        className={adClass}
        style={adStyle}
        data-ad-client="ca-pub-5474544069931649"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
}

/**
 * Predefined Ad Components for common placements
 */

import { ADSENSE_CONFIG } from '@/lib/adsenseConfig';

// Banner Ad (728x90 or responsive)
export function BannerAd({ className }: { className?: string }) {
  return (
    <AdSenseAd
      adSlot={ADSENSE_CONFIG.adSlots.header}
      adFormat="auto"
      responsive
      className={className}
    />
  );
}

// In-Article Ad (responsive)
export function InArticleAd({ className }: { className?: string }) {
  return (
    <AdSenseAd
      adSlot={ADSENSE_CONFIG.adSlots.inArticle}
      adFormat="auto"
      responsive
      fullWidthResponsive
      className={className}
    />
  );
}

// Sidebar Ad (300x250 or responsive)
export function SidebarAd({ className }: { className?: string }) {
  return (
    <AdSenseAd
      adSlot={ADSENSE_CONFIG.adSlots.sidebar}
      adFormat="auto"
      responsive
      className={className}
      style={{ minWidth: 300, minHeight: 250 }}
    />
  );
}

// In-Feed Ad (responsive)
export function InFeedAd({ className }: { className?: string }) {
  return (
    <AdSenseAd
      adSlot={ADSENSE_CONFIG.adSlots.inFeed}
      adFormat="auto"
      responsive
      className={className}
    />
  );
}

