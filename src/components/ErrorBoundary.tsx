/**
 * Catches React render errors so the app never shows a blank page after deployment.
 * Shows a minimal fallback UI with link to reload and home.
 * Uses <a href> not <Link> because this renders outside BrowserRouter (wraps entire App).
 * Sets noindex so error pages are not indexed (fixes non-indexed pages / SEO errors).
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    if (this.state.hasError && !prevState.hasError && typeof document !== 'undefined') {
      let meta = document.querySelector('meta[name="robots"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'robots');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', 'noindex, nofollow');
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      const err = this.state.error;
      const showDetail = typeof window !== 'undefined' && (import.meta.env.DEV || new URLSearchParams(window.location.search).get('error') === '1');
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            fontFamily: 'system-ui, sans-serif',
            background: 'var(--background, #0f172a)',
            color: 'var(--foreground, #f8fafc)',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ color: 'var(--muted-foreground, #94a3b8)', marginBottom: 8, textAlign: 'center', maxWidth: 420 }}>
            The page could not load. This can happen if the deployment is still updating or a script failed to load.
          </p>
          {!showDetail && (
            <p style={{ color: 'var(--muted-foreground, #64748b)', marginBottom: 24, textAlign: 'center', fontSize: 14 }}>
              Add <code style={{ background: '#334155', padding: '2px 6px', borderRadius: 4 }}>?error=1</code> to the URL and reload to see the error.
            </p>
          )}
          {showDetail && (
            <pre style={{ background: '#1e293b', padding: 12, borderRadius: 8, fontSize: 12, overflow: 'auto', maxWidth: '90vw', marginBottom: 24, textAlign: 'left' }}>
              {err.message}
            </pre>
          )}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a
              href="/"
              style={{
                padding: '10px 20px',
                background: 'var(--primary, #3b82f6)',
                color: 'white',
                borderRadius: 8,
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Go to homepage
            </a>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                background: 'var(--muted, #334155)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Reload page
            </button>
            {typeof window !== 'undefined' && err.message.includes('CONVEX') && (
              <button
                type="button"
                onClick={() => {
                  try {
                    sessionStorage.setItem('convexFallback', '1');
                  } catch {
                    // ignore
                  }
                  window.location.href = '/?convex_fallback=1';
                }}
                style={{
                  padding: '10px 20px',
                  background: 'var(--accent, #22c55e)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Load with demo data
              </button>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
