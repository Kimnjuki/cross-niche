import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
  toolName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary] ${this.props.toolName ?? 'Tool'} crashed:`, error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8 text-center">
        <div className="p-4 rounded-full bg-destructive/10 border border-destructive/30">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-1">
            {this.props.toolName ? `${this.props.toolName} encountered an error` : 'Something went wrong'}
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            An unexpected error occurred. Try refreshing or reloading the tool.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={this.reset}>
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Try again
        </Button>
      </div>
    );
  }
}
