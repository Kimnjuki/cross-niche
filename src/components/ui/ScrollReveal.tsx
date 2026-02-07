import { ReactNode } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * Scroll reveal animation component
 * Reveals content as user scrolls, mimicking storytelling flow
 */
export function ScrollReveal({ 
  children, 
  className,
  delay = 0,
  direction = 'up'
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal({ once: true });

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible 
          ? 'opacity-100 translate-y-0 translate-x-0' 
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

