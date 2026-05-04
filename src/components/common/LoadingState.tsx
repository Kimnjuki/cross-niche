import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done';
}

interface LoadingStateProps {
  title?: string;
  description?: string;
  variant: 'spinner' | 'skeleton' | 'progress';
  steps?: Step[];
  className?: string;
}

export function LoadingState({ title, description, variant, steps, className }: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        {title && <p className="text-lg font-semibold mb-1">{title}</p>}
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    );
  }

  if (variant === 'progress' && steps) {
    return (
      <div className={cn('py-10 max-w-lg mx-auto', className)}>
        {title && <p className="text-lg font-semibold mb-4 text-center">{title}</p>}
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold transition-colors',
                  step.status === 'done' && 'border-[#39FF14] bg-[#39FF14]/10 text-[#39FF14]',
                  step.status === 'active' && 'border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF] animate-pulse',
                  step.status === 'pending' && 'border-muted-foreground/30 text-muted-foreground/50'
                )}
              >
                {step.status === 'done' ? '✓' : step.status === 'active' ? '→' : ''}
              </div>
              <span
                className={cn(
                  'text-sm transition-colors',
                  step.status === 'done' && 'text-[#39FF14]',
                  step.status === 'active' && 'text-[#00F0FF]',
                  step.status === 'pending' && 'text-muted-foreground/50'
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-4 text-center">{description}</p>}
      </div>
    );
  }

  // Skeleton variant
  return (
    <div className={cn('space-y-4 py-6', className)}>
      {title && <p className="text-lg font-semibold">{title}</p>}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-full mb-1" style={{ width: `${Math.random() * 40 + 60}%` }} />
            <div className="h-3 bg-muted rounded w-3/4" />
          </div>
        ))}
      </div>
      {description && <p className="text-xs text-muted-foreground pt-2">{description}</p>}
    </div>
  );
}
