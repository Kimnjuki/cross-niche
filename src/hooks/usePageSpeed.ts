import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const PAGE_SPEED_MUTATION = 'pageSpeed:recordPageSpeed' as const;

interface CWV {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
}

function measureFCP(): number {
  if (typeof performance === 'undefined') return 0;
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (nav && nav.responseStart > 0) {
    return nav.responseStart - nav.startTime;
  }
  const paintEntries = performance.getEntriesByType('paint');
  const fcpEntry = paintEntries.find((e) => e.name === 'first-contentful-paint');
  return fcpEntry ? fcpEntry.startTime : 0;
}

function measureLCP(): number {
  if (typeof performance === 'undefined') return 0;
  const entries = performance.getEntriesByType('largest-contentful-paint');
  if (entries.length === 0) return 0;
  const lastEntry = entries[entries.length - 1];
  return lastEntry.startTime;
}

function measureFID(): number {
  if (typeof performance === 'undefined') return 0;
  const entries = performance.getEntriesByType('first-input');
  if (entries.length === 0) return 0;
  return entries[0].startTime;
}

function measureCLS(): number {
  if (typeof performance === 'undefined') return 0;
  const entries = performance.getEntriesByType('layout-shift');
  let cls = 0;
  for (const entry of entries) {
    if (!(entry as any).hadRecentInput) {
      cls += (entry as any).value;
    }
  }
  return cls;
}

export function usePageSpeed(url?: string) {
  const reportPageSpeed = useMutation(api.pageSpeed.recordPageSpeed);

  useEffect(() => {
    if (typeof window === 'undefined' || !url) return;

    const report = async () => {
      const metrics: CWV = {
        fcp: measureFCP(),
        lcp: measureLCP(),
        fid: measureFID(),
        cls: measureCLS(),
      };

      try {
        await reportPageSpeed({
          url,
          ...metrics,
        });
      } catch (error) {
        console.warn('Failed to report page speed:', error);
      }
    };

    if (document.readyState === 'complete') {
      setTimeout(report, 1000);
    } else {
      window.addEventListener('load', () => setTimeout(report, 1000));
    }
  }, [url, reportPageSpeed]);
}
