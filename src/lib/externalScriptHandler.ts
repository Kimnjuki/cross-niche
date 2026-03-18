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
 * Initialize error handling for external scripts.
 * Also handles stale-cache chunk 404s by reloading once after a new deploy.
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

  // Handle promise rejections — specifically catch stale Vite chunk 404s
  // (e.g. "Failed to fetch dynamically imported module: .../assets/Article-XYZ.js")
  // This happens when the browser has cached the old index.html but assets were
  // replaced by a new deploy. A single hard-reload fixes it.
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const isChunkLoadError =
      reason instanceof TypeError &&
      typeof reason.message === 'string' &&
      (reason.message.includes('Failed to fetch dynamically imported module') ||
        reason.message.includes('Importing a module script failed') ||
        reason.message.includes('error loading dynamically imported module'));

    if (isChunkLoadError) {
      // Prevent the error from surfacing in the console / error boundary
      event.preventDefault();
      // Only reload once per session to avoid infinite loops
      const RELOAD_KEY = '__gnx_chunk_reload__';
      if (!sessionStorage.getItem(RELOAD_KEY)) {
        sessionStorage.setItem(RELOAD_KEY, '1');
        // Hard reload bypasses cache and fetches fresh index.html + assets
        window.location.reload();
      }
      return;
    }

    // Suppress all other unhandled rejections in production
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





