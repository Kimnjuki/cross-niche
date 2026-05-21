import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'rect';
  width?: string;
  height?: string;
}

export function Skeleton({ className = '', variant = 'text', width, height }: SkeletonProps) {
  const baseClass = 'animate-shimmer bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:800px_100%] rounded';
  
  const variantClass = {
    text: 'h-4 w-full',
    card: 'h-48 w-full rounded-xl',
    circle: 'h-10 w-10 rounded-full',
    rect: 'h-24 w-full rounded-lg',
  };

  return (
    <div
      className={`${baseClass} ${variantClass[variant]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="space-y-3 p-4 bg-nexus-card rounded-xl border border-zinc-800">
      <Skeleton variant="rect" className="h-40" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="text" className="w-16 h-6" />
        <Skeleton variant="text" className="w-20 h-6" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
      <div className="space-y-6">
        <Skeleton variant="text" className="w-48 h-4" />
        <Skeleton variant="rect" className="h-16 w-full" />
        <Skeleton variant="rect" className="h-8 w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
        <div className="flex gap-3">
          <Skeleton variant="rect" className="h-12 w-40" />
          <Skeleton variant="rect" className="h-12 w-36" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton variant="card" className="h-48" />
        <Skeleton variant="card" className="h-24" />
      </div>
    </div>
  );
}
