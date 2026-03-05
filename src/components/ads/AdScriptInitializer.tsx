import { useEffect } from 'react';
import { useThirdPartyScript, useDefensiveObject } from '@/hooks/useThirdPartyScript';

/**
 * Component for safely initializing third-party advertising scripts
 * Prevents crashes when ad scripts fail to load due to CORS or blocking
 */
export function AdScriptInitializer() {
  // Initialize Clickio consent safely
  useThirdPartyScript('clickioConsent', 'addEventListener', () => {
    console.warn('Clickio consent not available, using fallback');
  });

  // Create defensive objects only when needed
  useDefensiveObject('clickioConsent', {
    hasConsent: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  });

  useDefensiveObject('Vl', {
    init: () => {
      console.warn('Vl.init called but library not loaded');
    }
  });

  // This component doesn't render anything visible
  return null;
}
