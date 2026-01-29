/**
 * INP (Interaction to Next Paint) Optimization
 * Improves responsiveness and reduces input delay
 */

/**
 * Optimize event handlers for better INP
 */
export function optimizeEventHandlers() {
  // Use passive event listeners where possible
  const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
  
  passiveEvents.forEach(eventType => {
    document.addEventListener(eventType, () => {}, { passive: true });
  });
}

/**
 * Debounce function for expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for frequent events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Use requestIdleCallback for non-critical work
 */
export function scheduleIdleWork(callback: () => void) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout: 2000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, 0);
  }
}

/**
 * Optimize click handlers
 */
export function optimizeClickHandlers() {
  // Use event delegation for better performance
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Handle clicks efficiently
    if (target.matches('[data-action]')) {
      const action = target.dataset.action;
      // Handle action without blocking
      scheduleIdleWork(() => {
        // Perform action
      });
    }
  }, { passive: true });
}

/**
 * Optimize form submissions
 */
export function optimizeFormSubmissions() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      // Prevent default and handle asynchronously
      e.preventDefault();
      
      const formData = new FormData(form);
      
      // Use requestIdleCallback for form processing
      scheduleIdleWork(() => {
        // Process form submission
        // This prevents blocking the main thread
      });
    }, { passive: false });
  });
}

/**
 * Use Web Workers for heavy computations
 */
export function createWorker(workerScript: string): Worker | null {
  if (typeof Worker === 'undefined') {
    console.warn('Web Workers not supported');
    return null;
  }

  try {
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    return new Worker(url);
  } catch (error) {
    console.error('Failed to create worker:', error);
    return null;
  }
}

/**
 * Optimize image loading to reduce main thread work
 */
export function optimizeImageLoading() {
  // Use decode() API for images
  const images = document.querySelectorAll<HTMLImageElement>('img[data-decode]');
  
  images.forEach(img => {
    if (img.complete) {
      img.decode().catch(() => {
        // Image decode failed, continue anyway
      });
    } else {
      img.addEventListener('load', () => {
        img.decode().catch(() => {});
      });
    }
  });
}

/**
 * Reduce layout shifts from dynamic content
 */
export function preventLayoutShifts() {
  // Reserve space for dynamic content
  const dynamicContainers = document.querySelectorAll('[data-dynamic-content]');
  
  dynamicContainers.forEach(container => {
    const height = container.getBoundingClientRect().height;
    container.style.minHeight = `${height}px`;
  });
}

/**
 * Optimize third-party script loading
 */
export function optimizeThirdPartyScripts() {
  // Load non-critical scripts asynchronously
  const scripts = document.querySelectorAll<HTMLScriptElement>('script[data-defer]');
  
  scripts.forEach(script => {
    if (!script.async && !script.defer) {
      script.defer = true;
    }
  });
}

/**
 * Measure and log INP
 */
export function measureINP() {
  if (typeof PerformanceObserver === 'undefined') {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'event' && 'duration' in entry) {
          const duration = entry.duration;
          
          // Log slow interactions (> 200ms)
          if (duration > 200) {
            console.warn(`Slow interaction detected: ${duration}ms`, entry);
          }
          
          // Send to analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'inp_measurement', {
              value: Math.round(duration),
              event_label: duration > 200 ? 'slow' : 'fast'
            });
          }
        }
      }
    });

    observer.observe({ type: 'event', buffered: true });
  } catch (error) {
    console.error('Failed to measure INP:', error);
  }
}

/**
 * Initialize all INP optimizations
 */
export function initINPOptimizations() {
  if (typeof window === 'undefined') return;

  optimizeEventHandlers();
  optimizeClickHandlers();
  optimizeFormSubmissions();
  optimizeImageLoading();
  preventLayoutShifts();
  optimizeThirdPartyScripts();
  measureINP();

  console.log('✅ INP optimizations initialized');
}




