/**
 * Wraps ConvexProvider so client creation runs inside React.
 * When VITE_CONVEX_URL is not set or client creation throws, we still render
 * the app with mock data (ConvexDisabledContext = true) so the UI always loads.
 */

import { useMemo, createContext, useContext, type ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const rawUrl = (import.meta.env.VITE_CONVEX_URL ?? "").trim();
const hasConvexUrl = rawUrl.length > 0 && rawUrl.startsWith("http");
const PLACEHOLDER_URL = "https://no-convex-configured.convex.cloud";

export const ConvexDisabledContext = createContext<boolean>(false);

function createClient(): { client: ConvexReactClient; disabled: boolean } {
  let disabled = !hasConvexUrl;
  let url = hasConvexUrl ? rawUrl : PLACEHOLDER_URL;
  try {
    const client = new ConvexReactClient(url, {
      skipConvexDeploymentUrlCheck: true,
    });
    return { client, disabled };
  } catch (err) {
    try {
      const fallback = new ConvexReactClient(PLACEHOLDER_URL, {
        skipConvexDeploymentUrlCheck: true,
      });
      return { client: fallback, disabled: true };
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
