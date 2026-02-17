import type { ReactNode } from 'react';
import { LazyImage } from '@/components/ui/lazy-image';
import { cn } from '@/lib/utils';

interface ImageOverlayProps {
  src: string;
  alt: string;
  className?: string;
  children?: ReactNode;
  width?: number;
  height?: number;
  /** Optional aspect ratio, e.g. '16/9' */
  aspectRatio?: string;
}

/**
 * Verge-style image overlay with subtle cyan gradient on hover.
 * Uses LazyImage for optimized sizing and fetch priority hints.
 */
export function ImageOverlay({
  src,
  alt,
  className,
  children,
  width,
  height,
  aspectRatio,
}: ImageOverlayProps) {
  return (
    <div
      className={cn(
        'group relative w-full h-full overflow-hidden',
        'bg-card border border-border rounded-none',
        'transition-transform duration-300 will-change-transform',
        'hover:scale-[1.01]',
        className
      )}
    >
      <LazyImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        aspectRatio={aspectRatio}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
      />

      {/* Cyan-to-transparent gradient mask on hover – Verge-style glow */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          'bg-gradient-to-tr from-cyan-400/35 via-transparent to-transparent',
          'opacity-0 group-hover:opacity-100',
          'transition-opacity duration-500',
          'mix-blend-screen'
        )}
        aria-hidden
      />

      {/* Optional content overlay (title, meta, etc.) */}
      {children && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 md:p-6">
          {children}
        </div>
      )}
    </div>
  );
}

