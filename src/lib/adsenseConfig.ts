/**
 * Google AdSense Configuration
 * 
 * Replace the placeholder ad slot IDs with your actual AdSense ad unit IDs
 * You can find these in your Google AdSense dashboard under Ads > By ad unit
 */

export const ADSENSE_CONFIG = {
  // Your AdSense Publisher ID (from the script tag)
  clientId: 'ca-pub-9278124025449370',
  
  // Ad Slot IDs - Replace these with your actual ad unit IDs from AdSense
  adSlots: {
    // Header/Banner ads
    header: '1234567890', // Replace with your header ad slot ID
    footer: '1234567890', // Replace with your footer ad slot ID
    
    // Content ads
    inArticle: '1234567890', // Replace with your in-article ad slot ID
    inFeed: '1234567890', // Replace with your in-feed ad slot ID
    betweenContent: '1234567890', // Replace with your between-content ad slot ID
    
    // Sidebar ads
    sidebar: '1234567890', // Replace with your sidebar ad slot ID
  },
  
  // Ad display settings
  settings: {
    // Only show ads if user has consented to advertising cookies
    requireConsent: true,
    
    // Enable responsive ads by default
    responsive: true,
    
    // Enable full-width responsive for in-article ads
    fullWidthResponsive: true,
  },
};

/**
 * Check if user has consented to advertising cookies
 */
export function hasAdConsent(): boolean {
  if (!ADSENSE_CONFIG.settings.requireConsent) {
    return true; // If consent not required, always show ads
  }
  
  try {
    const consent = localStorage.getItem('cookie-consent');
    const preferences = localStorage.getItem('cookie-preferences');
    
    if (consent === 'true' && preferences) {
      const prefs = JSON.parse(preferences);
      return prefs.advertising === true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Listen for cookie consent changes and reload ads if needed
 */
export function setupAdConsentListener(callback: () => void) {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('cookieConsentUpdated', (event: any) => {
    const prefs = event.detail;
    if (prefs?.advertising === true) {
      // User just consented to ads, reload ads
      callback();
    }
  });
}



