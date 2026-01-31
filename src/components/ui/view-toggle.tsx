/**
 * Ars Technica / WIRED style: Grid, List, Compact view toggle for article layouts.
 */

import { Button } from '@/components/ui/button';
import { LayoutGrid, List, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'grid' | 'list' | 'compact';

interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  className?: string;
  ariaLabel?: string;
}

export function ViewToggle({ value, onChange, className, ariaLabel = 'View mode' }: ViewToggleProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('flex rounded-lg border border-border p-0.5 bg-muted/30', className)}
    >
      <Button
        variant="ghost"
        size="sm"
        className={cn('gap-1.5 rounded-md', value === 'grid' && 'bg-background shadow-sm')}
        onClick={() => onChange('grid')}
        aria-pressed={value === 'grid'}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">Grid</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn('gap-1.5 rounded-md', value === 'list' && 'bg-background shadow-sm')}
        onClick={() => onChange('list')}
        aria-pressed={value === 'list'}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">List</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn('gap-1.5 rounded-md', value === 'compact' && 'bg-background shadow-sm')}
        onClick={() => onChange('compact')}
        aria-pressed={value === 'compact'}
        aria-label="Compact view"
      >
        <LayoutList className="h-4 w-4" />
        <span className="hidden sm:inline text-xs">Compact</span>
      </Button>
    </div>
  );
}
