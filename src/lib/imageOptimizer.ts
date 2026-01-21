/**
 * Image optimization utilities for Core Web Vitals
 * Converts images to WebP format and ensures proper dimensions
 */

/**
 * Convert image URL to WebP format if supported
 * Falls back to original if WebP is not supported
 */
export function getWebPImageUrl(url: string): string {
  if (!url) return url;
  
  // If already WebP, return as-is
  if (url.includes('.webp')) return url;
  
  // If using Unsplash, add WebP format parameter
  if (url.includes('unsplash.com')) {
    return url.includes('?') 
      ? `${url}&fm=webp&q=80`
      : `${url}?fm=webp&q=80`;
  }
  
  // For other image sources, try to convert
  // Note: This is a basic implementation. For production, use a CDN or image service
  return url;
}

/**
 * Get optimized image srcset for responsive images
 */
export function getImageSrcSet(url: string, sizes: number[] = [400, 800, 1200, 1600]): string {
  return sizes
    .map(size => {
      const optimizedUrl = getWebPImageUrl(url);
      // For Unsplash, we can add width parameter
      if (optimizedUrl.includes('unsplash.com')) {
        const separator = optimizedUrl.includes('?') ? '&' : '?';
        return `${optimizedUrl}${separator}w=${size} ${size}w`;
      }
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Get image dimensions from aspect ratio
 * Helps prevent CLS (Cumulative Layout Shift)
 */
export function getImageDimensions(
  aspectRatio: '16:9' | '4:3' | '1:1' | '21:9' = '16:9',
  baseWidth: number = 1200
): { width: number; height: number } {
  const ratios: Record<string, number> = {
    '16:9': 16 / 9,
    '4:3': 4 / 3,
    '1:1': 1,
    '21:9': 21 / 9,
  };
  
  const ratio = ratios[aspectRatio] || ratios['16:9'];
  return {
    width: baseWidth,
    height: Math.round(baseWidth / ratio),
  };
}

/**
 * Preload critical images for better LCP
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

