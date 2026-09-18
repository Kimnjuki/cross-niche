import React from 'react';
import { Button } from '@/components/ui/button';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Alternate callers pass a structured action object instead of label+handler. */
  action?: { label: string; onClick: () => void };
  actionLabel?: string;
  onAction?: () => void;
  suggestions?: string[];
  suggestionLabel?: string;
}

export function EmptyState({ title, description, action, actionLabel, onAction, suggestions, suggestionLabel }: EmptyStateProps) {
  const resolvedLabel = action?.label ?? actionLabel;
  const resolvedHandler = action?.onClick ?? onAction;
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Inbox className="h-12 w-12 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md mb-4">{description}</p>}
      {resolvedLabel && resolvedHandler && (
        <Button variant="outline" size="sm" onClick={resolvedHandler}>
          {resolvedLabel}
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
