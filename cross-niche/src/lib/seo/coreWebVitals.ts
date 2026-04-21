/**
 * Core Web Vitals Monitoring and Optimization
 * Tracks LCP, INP, CLS and sends to analytics
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

/**
 * Core Web Vitals thresholds
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  INP: { good: 200, poor: 500 }, // Interaction to Next Paint (ms)
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FID: { good: 100, poor: 300 }, // First Input Delay (ms) - deprecated but still tracked
};

/**
 * Get rating for a metric value
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'needs-improvement';
  
  if (value <= threshold.good) return 'good';
  if (value >= threshold.poor) return 'poor';
  return 'needs-improvement';
}

/**
 * Track Core Web Vitals to GA4
 */
function trackWebVital(metric: WebVitalMetric) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.value),
    event_label: metric.rating,
    non_interaction: true,
    custom_map: {
      metric_id: metric.id,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    }
  });

  // Also send as custom event
  window.gtag('event', 'core_web_vital', {
    metric_name: metric.name,
    metric_value: Math.round(metric.value),
    metric_rating: metric.rating,
    metric_id: metric.id,
    metric_delta: metric.delta,
  });
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP() {
  if (typeof PerformanceObserver === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      
      const lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
      const rating = getRating('LCP', lcp);
      
      trackWebVital({
        name: 'LCP',
        value: lcp,
        rating,
        id: lastEntry.name,
      });

      if (import.meta.env.DEV) {
        console.log(`LCP: ${Math.round(lcp)}ms (${rating})`);
      }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.error('Failed to measure LCP:', error);
  }
}

/**
 * Measure Interaction to Next Paint (INP)
 */
export function measureINP() {
  if (typeof PerformanceObserver === 'undefined') return;

  try {
    let maxINP = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'event' && 'duration' in entry) {
          const duration = entry.duration;
          if (duration > maxINP) {
            maxINP = duration;
          }
        }
      }
    });

    observer.observe({ type: 'event', buffered: true });

    // Report INP when page is hidden (user leaves)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && maxINP > 0) {
        const rating = getRating('INP', maxINP);
        trackWebVital({
          name: 'INP',
          value: maxINP,
          rating,
        });

        if (import.meta.env.DEV) {
          console.log(`INP: ${Math.round(maxINP)}ms (${rating})`);
        }
      }
    });
  } catch (error) {
    console.error('Failed to measure INP:', error);
  }
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS() {
  if (typeof PerformanceObserver === 'undefined') return;

  try {
    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = clsEntries[0];
          const lastSessionEntry = clsEntries[clsEntries.length - 1];

          if (
            !firstSessionEntry ||
            entry.startTime - lastSessionEntry.startTime < 1000 ||
            entry.startTime - firstSessionEntry.startTime > 5000
          ) {
            clsEntries = [entry];
          } else {
            clsEntries.push(entry);
          }

          clsValue = clsEntries.reduce((sum, e) => {
            const entry = e as any;
            return sum + (entry.value || 0);
          }, 0);
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });

    // Report CLS when page is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && clsValue > 0) {
        const rating = getRating('CLS', clsValue);
        trackWebVital({
          name: 'CLS',
          value: clsValue,
          rating,
        });

        if (import.meta.env.DEV) {
          console.log(`CLS: ${clsValue.toFixed(3)} (${rating})`);
        }
      }
    });
  } catch (error) {
    console.error('Failed to measure CLS:', error);
  }
}

/**
 * Measure First Input Delay (FID) - deprecated but still useful
 */
export function measureFID() {
  if (typeof PerformanceObserver === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = (entry as any).processingStart - entry.startTime;
        const rating = getRating('FID', fid);
        
        trackWebVital({
          name: 'FID',
          value: fid,
          rating,
          id: entry.name,
        });

        if (import.meta.env.DEV) {
          console.log(`FID: ${Math.round(fid)}ms (${rating})`);
        }
      }
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.error('Failed to measure FID:', error);
  }
}

/**
 * Initialize all Core Web Vitals monitoring
 */
export function initCoreWebVitals() {
  if (typeof window === 'undefined') return;

  measureLCP();
  measureINP();
  measureCLS();
  measureFID();

  if (import.meta.env.DEV) {
    console.log('✅ Core Web Vitals monitoring initialized');
  }
}

/**
 * Get current Core Web Vitals scores (for debugging)
 */
export function getWebVitalsSummary(): Record<string, { value: number; rating: string }> {
  // This would need to be implemented with a state management system
  // For now, returns empty object - metrics are tracked via PerformanceObserver
  return {};
}
