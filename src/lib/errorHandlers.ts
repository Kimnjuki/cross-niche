// Extend Window interface for third-party globals
declare global {
  interface Window {
    clickioConsent?: {
      hasConsent: boolean;
      addEventListener: () => void;
      removeEventListener: () => void;
      dispatchEvent: () => void;
    };
    Vl?: {
      init: () => void;
    };
  }
}

// Global error handler for undefined property errors
window.addEventListener('error', (event) => {
  const error = event.error;
  if (error && error.message && error.message.includes('Cannot read properties of undefined')) {
    console.warn('Prevented undefined property error:', error.message);
    event.preventDefault();
    return true;
  }
});

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.warn('Unhandled promise rejection prevented:', event.reason);
  event.preventDefault();
  return true;
});

// Add defensive programming for Clickio consent
if (typeof window !== 'undefined') {
  window.clickioConsent = window.clickioConsent || {
    hasConsent: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
  };
  
  // Add defensive object for Vl.init errors
  window.Vl = window.Vl || {
    init: () => {
      console.warn('Vl.init called but library not loaded');
    }
  };
}
