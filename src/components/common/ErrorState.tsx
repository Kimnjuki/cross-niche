import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  errorCode?: string;
}

export function ErrorState({ message, onRetry, errorCode }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
        <AlertTriangle className="w-6 h-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-4">{message}</p>
      {errorCode && (
        <p className="text-xs text-muted-foreground mb-4 font-mono">Error code: {errorCode}</p>
      )}
      <Button variant="default" size="sm" onClick={onRetry}>
        Try Again
      </Button>
    </div>
  );
}
