import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'subtle' | 'medium' | 'strong';
  hover?: boolean;
  border?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'subtle',
  hover = false,
  border = true,
  onClick,
}) => {
  const baseClasses = 'relative backdrop-blur-sm transition-all duration-300';
  
  const variantClasses = {
    subtle: 'bg-white/5 dark:bg-black/20',
    medium: 'bg-white/10 dark:bg-black/30',
    strong: 'bg-white/20 dark:bg-black/40',
  };

  const borderClasses = border ? 'border border-white/10 dark:border-white/20' : '';
  const hoverClasses = hover ? 'hover:bg-white/15 dark:hover:bg-black/50 hover:scale-105 hover:shadow-xl' : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        borderClasses,
        hoverClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;
