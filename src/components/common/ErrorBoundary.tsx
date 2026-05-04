import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  toolName?: string;
}

interface State {
  hasError: boolean;
  errorId: string | null;
  errorTimestamp: number | null;
}

function generateErrorId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorId: null, errorTimestamp: null };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true, errorId: generateErrorId(), errorTimestamp: Date.now() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.toolName ? ` - ${this.props.toolName}` : ''}]`, error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorId: null, errorTimestamp: null });
  };

  render() {
    if (this.state.hasError) {
      const tool = this.props.toolName || 'this tool';
      return (
        <div className="min-h-[300px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
              <svg className="w-6 h-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Something went wrong in {tool}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              An unexpected error occurred. Your other tools are unaffected.
            </p>
            {this.state.errorId && (
              <p className="text-xs text-muted-foreground mb-4 font-mono">
                Error code: ERR-{this.state.errorId.slice(0, 8)}
              </p>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="default" size="sm" onClick={this.handleRetry}>
                Retry
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open(`mailto:support@thegridnexus.com?subject=Tool Error ${this.state.errorId ? `ERR-${this.state.errorId.slice(0, 8)}` : ''}`, '_blank')}>
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
