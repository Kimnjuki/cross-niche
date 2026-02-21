import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'strong';
  hover?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', hover = false, glow = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-xl transition-all duration-300 ease-standard';
    
    const variantClasses = {
      default: 'glass',
      subtle: 'glass-subtle',
      strong: 'glass-strong'
    };
    
    const hoverClasses = hover ? 'hover:scale-102 hover:shadow-xl hover:border-nexus-cyan/20' : '';
    const glowClasses = glow ? 'animate-pulse-glow' : '';
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          hoverClasses,
          glowClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
