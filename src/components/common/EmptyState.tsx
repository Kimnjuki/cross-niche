import React from 'react';
import { Button } from '@/components/ui/button';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  suggestions?: string[];
  suggestionLabel?: string;
}

export function EmptyState({ title, description, actionLabel, onAction, suggestions, suggestionLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="h-12 w-12 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {suggestions && suggestions.length > 0 && (
        <div className="mt-4">
          {suggestionLabel && <p className="text-xs text-muted-foreground mb-2">{suggestionLabel}</p>}
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((s) => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
