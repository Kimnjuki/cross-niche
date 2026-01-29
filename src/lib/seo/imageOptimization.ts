/**
 * Image Optimization Utilities
 * Handles WebP conversion, lazy loading, and responsive images
 */

export interface ImageOptimizationOptions {
  quality?: number; // 0-100, default 80
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'avif' | 'original';
  lazy?: boolean;
  responsive?: boolean;
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Check if browser supports AVIF
 */
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

/**
 * Get optimal image format for current browser
 */
export async function getOptimalImageFormat(): Promise<'webp' | 'avif' | 'original'> {
  if (await supportsAVIF()) {
    return 'avif';
  }
  if (await supportsWebP()) {
    return 'webp';
  }
  return 'original';
}

/**
 * Generate responsive image srcset
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [400, 800, 1200, 1600, 2000],
  format?: 'webp' | 'avif'
): string {
  return widths
    .map(width => {
      const url = format 
        ? `${baseUrl}?w=${width}&format=${format}`
        : `${baseUrl}?w=${width}`;
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: Record<string, string> = {}): string {
  const defaultBreakpoints = {
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    'default': '33vw'
  };

  const sizes = { ...defaultBreakpoints, ...breakpoints };
  const sizeStrings = Object.entries(sizes)
    .filter(([key]) => key !== 'default')
    .map(([breakpoint, size]) => `${breakpoint} ${size}`);

  if (sizes.default) {
    sizeStrings.push(sizes.default);
  }

  return sizeStrings.join(', ');
}

/**
 * Optimize image URL (adds query parameters for optimization)
 * Note: This assumes your image service/CDN supports these parameters
 */
export function optimizeImageUrl(
  url: string,
  options: ImageOptimizationOptions = {}
): string {
  const params = new URLSearchParams();
  
  if (options.quality) {
    params.set('q', options.quality.toString());
  }
  
  if (options.maxWidth) {
    params.set('w', options.maxWidth.toString());
  }
  
  if (options.maxHeight) {
    params.set('h', options.maxHeight.toString());
  }
  
  if (options.format && options.format !== 'original') {
    params.set('format', options.format);
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

/**
 * Create optimized image element attributes
 */
export async function createOptimizedImageAttributes(
  src: string,
  alt: string,
  options: ImageOptimizationOptions = {}
): Promise<{
  src: string;
  srcSet?: string;
  sizes?: string;
  loading: 'lazy' | 'eager';
  decoding: 'async';
  alt: string;
}> {
  const format = options.format || await getOptimalImageFormat();
  const optimizedSrc = optimizeImageUrl(src, { ...options, format });
  
  const attributes: any = {
    src: optimizedSrc,
    alt,
    loading: options.lazy !== false ? 'lazy' : 'eager',
    decoding: 'async'
  };

  if (options.responsive) {
    attributes.srcSet = generateSrcSet(src, undefined, format);
    attributes.sizes = generateSizes();
  }

  return attributes;
}

/**
 * Lazy load images with intersection observer
 */
export function setupLazyLoading(selector: string = 'img[loading="lazy"]') {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    const images = document.querySelectorAll<HTMLImageElement>(selector);
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px' // Start loading 50px before image enters viewport
  });

  const images = document.querySelectorAll<HTMLImageElement>(selector);
  images.forEach(img => {
    if (img.dataset.src) {
      imageObserver.observe(img);
    }
  });
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, as: 'image' = 'image') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
}

/**
 * Convert image to WebP format (client-side, requires canvas)
 * Note: For production, use server-side conversion or CDN
 */
export function convertToWebP(
  file: File,
  quality: number = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Conversion failed'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}




