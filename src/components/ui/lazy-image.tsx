import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
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
  onLoad,
  onError,
  width,
  height,
  aspectRatio,
}: LazyImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => onLoad?.();
  const handleError = () => {
    setHasError(true);
    onError?.();
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
      src={src}
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
