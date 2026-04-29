/**
 * Wraps ConvexProvider so client creation runs inside React.
 * When VITE_CONVEX_URL is not set or client creation throws, we still render
 * the app with mock data (ConvexDisabledContext = true) so the UI always loads.
 */

import { useMemo, createContext, useContext, type ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Convex URL resolution: only connect when VITE_CONVEX_URL is explicitly set.
// Not set in Dockerfile at build time — avoids stale deploy keys hanging queries.
const rawUrl = (import.meta.env.VITE_CONVEX_URL ?? "").trim();
const hasConvexUrl = rawUrl.length > 0 && rawUrl.startsWith("http");
const PLACEHOLDER_URL = "https://no-convex-configured.convex.cloud";

export const ConvexDisabledContext = createContext<boolean>(!hasConvexUrl);

function createClient(): { client: ConvexReactClient; disabled: boolean } {
  if (!hasConvexUrl) {
    // No Convex URL configured — create a placeholder client that skips all queries
    try {
      const placeholder = new ConvexReactClient(PLACEHOLDER_URL, {
        skipConvexDeploymentUrlCheck: true,
      });
      return { client: placeholder, disabled: true };
    } catch {
      // If placeholder fails too, create a minimal mock
      throw new Error("Failed to create Convex placeholder client");
    }
  }
  try {
    const client = new ConvexReactClient(rawUrl, {
      skipConvexDeploymentUrlCheck: true,
    });
    return { client, disabled: false };
  } catch (err) {
    // Fallback to placeholder if the actual URL fails
    try {
      const placeholder = new ConvexReactClient(PLACEHOLDER_URL, {
        skipConvexDeploymentUrlCheck: true,
      });
      return { client: placeholder, disabled: true };
    } catch {
      throw err;
    }
  }
}

interface SafeConvexProviderProps {
  children: ReactNode;
}

const CONVEX_FALLBACK_KEY = "convexFallback";

function getConvexFallback(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(CONVEX_FALLBACK_KEY) === "1") return true;
    if (new URLSearchParams(window.location.search).get("convex_fallback") === "1") return true;
  } catch {
    // ignore
  }
  return false;
}

export function SafeConvexProvider({ children }: SafeConvexProviderProps) {
  const { client, disabled } = useMemo(() => createClient(), []);
  const forceFallback = useMemo(() => getConvexFallback(), []);
  const isConvexDisabled = disabled || forceFallback;

  return (
    <ConvexDisabledContext.Provider value={isConvexDisabled}>
      <ConvexProvider client={client}>{children}</ConvexProvider>
    </ConvexDisabledContext.Provider>
  );
}

export function useConvexDisabled(): boolean {
  return useContext(ConvexDisabledContext);
}
