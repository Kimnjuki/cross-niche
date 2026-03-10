import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for Convex connection/query errors.
 * Shows a friendly message and retry when Convex URL or connection fails.
 */
export class ConvexErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Convex Error:", error, errorInfo);
    if (
      error.message?.includes("Convex") ||
      error.message?.includes("VITE_CONVEX_URL")
    ) {
      console.error("⚠️ CONVEX CONNECTION ERROR");
      console.error("Check your .env file has VITE_CONVEX_URL set");
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950/20">
          <div className="max-w-md p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-red-200 dark:border-red-800">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              ⚠️ Connection Error
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Failed to connect to the database. This usually means:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <li>Convex URL not configured</li>
              <li>Network connection issues</li>
              <li>Convex deployment not running</li>
            </ul>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
              <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                {this.state.error?.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
