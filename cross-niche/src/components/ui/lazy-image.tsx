import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Fallback image URL when src fails (e.g. 403, CORS). Prevents broken image. */
  fallbackSrc?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;
  /** Kept for API compatibility; no-op (all images load eager) */
  priority?: boolean;
}

/**
 * Image component that always loads immediately (no lazy loading).
 * Renders the exact same content as a full page refresh for troubleshooting.
 */
export function LazyImage({
  src,
  alt,
  className,
  fallbackSrc,
  onLoad,
  onError,
  width,
  height,
  aspectRatio,
}: LazyImageProps) {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleLoad = () => onLoad?.();
  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      onError?.();
    }
  };

  const finalAspectRatio = aspectRatio || '16/9';
  const finalWidth = width || '1200';
  const finalHeight = height || '675';

  if (hasError) {
    return (
      <div className={cn('relative overflow-hidden bg-muted flex items-center justify-center', className)} style={{ aspectRatio: finalAspectRatio, minHeight: height || '225px' }}>
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={cn('w-full h-full object-cover', className)}
      onLoad={handleLoad}
      onError={handleError}
      loading="eager"
      decoding="async"
      {...({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)}
      width={finalWidth}
      height={finalHeight}
      style={{ aspectRatio: finalAspectRatio }}
    />
  );
}
