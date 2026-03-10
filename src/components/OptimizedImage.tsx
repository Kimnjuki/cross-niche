import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

/**
 * Image with lazy loading, async decoding, and placeholder until loaded.
 * Reduces LCP impact and avoids layout shift.
 */
export function OptimizedImage({
  src,
  alt,
  className = "",
  loading = "lazy",
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`max-w-full h-auto ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-200 ${className}`}
      />
    </div>
  );
}
