import React from 'react';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

export function TableOfContents({ items, activeId, onItemClick, className }: TableOfContentsProps) {
  return (
    <div className={cn('sticky top-24', className)}>
      <h4 className="font-[var(--font-label)] uppercase tracking-[0.1em] text-[var(--text-tertiary)] text-xs mb-3">
        ON THIS PAGE
      </h4>
      <nav className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={cn(
              'w-full text-left py-1 pl-3 border-l-2 transition-all duration-[180ms] ease-out text-sm',
              activeId === item.id
                ? 'text-[var(--accent-cyan)] border-l-[var(--accent-cyan)]'
                : 'text-[var(--text-secondary)] border-l-transparent hover:text-[var(--text-primary)] hover:border-l-[var(--border-cyan)]'
            )}
            style={{ paddingLeft: `${(item.level - 2) * 12 + 12}px` }}
          >
            {item.title}
          </button>
        ))}
      </nav>
    </div>
  );
}