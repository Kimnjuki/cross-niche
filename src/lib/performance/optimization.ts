/**
 * Performance Optimization Utilities
 * Based on best practices from industry leaders
 */

/**
 * Lazy load images with intersection observer
 */
export function lazyLoadImage(img: HTMLImageElement, src: string) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        observer.unobserve(img);
      }
    });
  });

  observer.observe(img);
}

/**
 * Debounce function for search and filters
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
 * Throttle function for scroll events
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
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Prefetch next page resources
 */
export function prefetchResource(href: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Optimize images - convert to WebP if supported
 */
export function getOptimizedImageUrl(url: string, width?: number): string {
  // In production, use a CDN or image optimization service
  // For now, return the original URL
  if (width) {
    // If using a service like Cloudinary, Imgix, etc.
    // return `${url}?w=${width}&q=80&format=webp`;
  }
  return url;
}

/**
 * Measure Core Web Vitals
 */
export function measureWebVitals() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  // Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // Browser doesn't support LCP
  }

  // First Input Delay (FID)
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // Browser doesn't support FID
  }

  // Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // Browser doesn't support CLS
  }
}

