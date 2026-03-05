/**
 * External Script Error Handler
 * Handles broken external JavaScript files gracefully
 */

/**
 * Load external script with error handling
 */
export function loadExternalScript(
  src: string,
  options: {
    async?: boolean;
    defer?: boolean;
    onError?: (error: Error) => void;
    onLoad?: () => void;
  } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = options.async ?? true;
    script.defer = options.defer ?? false;

    script.onload = () => {
      options.onLoad?.();
      resolve();
    };

    script.onerror = (error) => {
      const err = new Error(`Failed to load script: ${src}`);
      console.warn('External script failed to load:', src, error);
      
      // Only log in development, suppress in production
      if (import.meta.env.DEV) {
        console.error(err);
      }
      
      options.onError?.(err);
      // Don't reject - fail gracefully
      resolve();
    };

    document.head.appendChild(script);
  });
}

/**
 * Initialize error handling for external scripts
 */
export function initExternalScriptErrorHandling() {
  // Handle unhandled script errors
  window.addEventListener('error', (event) => {
    // Check if error is from an external script
    if (event.filename && !event.filename.startsWith(window.location.origin)) {
      // Suppress external script errors in production
      if (!import.meta.env.DEV) {
        event.preventDefault();
      }
    }
  }, true);

  // Handle promise rejections from scripts
  window.addEventListener('unhandledrejection', (event) => {
    // Suppress external script promise rejections in production
    if (!import.meta.env.DEV) {
      event.preventDefault();
    }
  });
}

/**
 * Safe AdSense initialization with error handling
 */
export function safeInitAdSense() {
  if (typeof window === 'undefined') return;

  // Wait for AdSense script to load
  const checkAdSense = () => {
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      try {
        window.adsbygoogle.push({});
      } catch (error: any) {
        // Suppress "No slot size" errors
        if (error?.message && !error.message.includes('No slot size')) {
          if (import.meta.env.DEV) {
            console.warn('AdSense initialization error:', error);
          }
        }
      }
    } else {
      // Retry after delay
      setTimeout(checkAdSense, 100);
    }
  };

  checkAdSense();
}





