import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineFeedAlertProps {
  count: number;
  onViewUpdates: () => void;
  className?: string;
}

export function InlineFeedAlert({ count, onViewUpdates, className }: InlineFeedAlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible || count === 0) return null;

  const handleClick = () => {
    onViewUpdates();
    setVisible(false);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full py-4 px-6 bg-[var(--accent-cyan-glow)] border border-[var(--border-cyan)] rounded-[var(--radius-md)] text-center transition-all duration-[280ms] ease-out animate-inline-alert-enter',
        className
      )}
    >
      <span className="text-[var(--text-primary)] text-sm font-medium">
        {count} new signal{count !== 1 ? 's' : ''} while you were reading
      </span>
      <span className="text-[var(--accent-cyan)] text-sm ml-2 inline-flex items-center gap-1">
        View updates
        <ArrowUp className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}