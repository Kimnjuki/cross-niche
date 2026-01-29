/**
 * Wraps ConvexProvider so client creation runs inside React.
 * If ConvexReactClient throws (e.g. invalid URL), ErrorBoundary can catch it
 * and we show a fallback instead of a blank page after Coolify redeploy.
 */

import { useMemo, type ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const url = (import.meta.env.VITE_CONVEX_URL ?? "").trim();
const hasConvexUrl = url.length > 0 && url.startsWith("http");

function createClient(): ConvexReactClient | null {
  if (!hasConvexUrl) return null;
  try {
    return new ConvexReactClient(url, {
      // Allow .convex.site URLs (HTTP Actions / preview) as well as .convex.cloud
      skipConvexDeploymentUrlCheck: true,
    });
  } catch {
    return null;
  }
}

interface SafeConvexProviderProps {
  children: ReactNode;
}

export function SafeConvexProvider({ children }: SafeConvexProviderProps) {
  const client = useMemo(() => createClient(), []);

  if (!client) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "system-ui, sans-serif",
          background: "var(--background, #0f172a)",
          color: "var(--foreground, #f8fafc)",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", marginBottom: 8 }}>Setup required</h1>
        <p style={{ color: "var(--muted-foreground, #94a3b8)", marginBottom: 24, textAlign: "center" }}>
          Set <code style={{ background: "#334155", padding: "2px 6px", borderRadius: 4 }}>VITE_CONVEX_URL</code> as a Build Time Variable in Coolify, then redeploy.
        </p>
        <a
          href="/"
          style={{
            padding: "10px 20px",
            background: "var(--primary, #3b82f6)",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Reload
        </a>
      </div>
    );
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
