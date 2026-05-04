import React from 'react';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

interface NotFoundStateProps {
  query: string;
  suggestions?: string[];
  onSelectSuggestion?: (s: string) => void;
  onRequestAdd?: () => void;
}

export function NotFoundState({ query, suggestions, onSelectSuggestion, onRequestAdd }: NotFoundStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <SearchX className="h-12 w-12 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-semibold mb-2">No data found for "{query}"</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-4">
        We couldn't find matching data in our system. You can request it or browse our available options below.
      </p>
      {suggestions && suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Try one of these:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => onSelectSuggestion?.(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-border hover:border-[#B026FF]/40 hover:text-[#B026FF] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
      {onRequestAdd && (
        <Button variant="outline" size="sm" onClick={onRequestAdd}>
          Request this data
        </Button>
      )}
    </div>
  );
}
