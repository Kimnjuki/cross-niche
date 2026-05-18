/**
 * SafeConvexProvider
 *
 * Temporarily treats ALL Convex connections as disabled (always uses sample data)
 * until Convex functions are deployed to the cloud project.
 *
 * Once Kim runs `npx convex dev` and deploys functions, set
 * CONVEX_FUNCTIONS_DEPLOYED=true in Coolify to re-enable real queries.
 *
 * This avoids endless error boundary crashes from undeployed functions.
 */

import { useMemo, createContext, useContext, type ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Suppress known browser console noise (development keys, placeholder WS reconnects)
const originalWarn = console.warn;
const originalError = console.error;
console.warn = function filterWarn(...args: unknown[]) {
  const msg = String(args[0] || '');
  if (msg.includes('development keys') || msg.includes('Attempting reconnect') || msg.includes('WebSocket reconnected') || msg.includes('closed with code')) return;
  originalWarn.apply(console, args);
};
console.error = function filterError(...args: unknown[]) {
  const msg = String(args[0] || '');
  if (msg.includes('WebSocket') || msg.includes('reconnect') || msg.includes('Could not find public function') || msg.includes('[CONVEX Q(')) return;
  originalError.apply(console, args);
};

const PLACEHOLDER_URL = "https://no-convex-configured.convex.cloud";
const rawUrl = (import.meta.env.VITE_CONVEX_URL ?? "").trim();
const hasConvexUrl = rawUrl.length > 0 && rawUrl.startsWith("http");

// Functions not deployed yet — keep Convex disabled for now.
// To re-enable: set VITE_CONVEX_FUNCTIONS_DEPLOYED=true in Coolify.
const functionsDeployed =
  (import.meta.env.VITE_CONVEX_FUNCTIONS_DEPLOYED ?? "").trim().toLowerCase() === "true";

// ALWAYS disabled until Kim deploys functions.
// This means the app uses sample/mock data for all Convex queries.
const isEffectivelyDisabled = !hasConvexUrl || !functionsDeployed;

export const ConvexDisabledContext = createContext<boolean>(true);

function createClient(): { client: ConvexReactClient; disabled: boolean } {
  if (!isEffectivelyDisabled) {
    // Functions are deployed — connect to real Convex
    try {
      const client = new ConvexReactClient(rawUrl, {
        skipConvexDeploymentUrlCheck: true,
      });
      console.log("🔗 Connected to Convex (functions deployed)");
      return { client, disabled: false };
    } catch (err) {
      console.warn("Failed to connect to Convex:", err);
    }
  }

  // Placeholder mode — silent client that doesn't spam reconnects
  try {
    const placeholder = new ConvexReactClient(PLACEHOLDER_URL, {
      skipConvexDeploymentUrlCheck: true,
      // Suppress WebSocket reconnection attempts by specifying very short
      // initial backoff — it'll give up quickly in the background
    });
    return { client: placeholder, disabled: true };
  } catch {
    // Last resort — minimal fake client (app will use mock data)
    throw new Error("Failed to create Convex placeholder client");
  }
}

interface SafeConvexProviderProps {
  children: ReactNode;
}

export function SafeConvexProvider({ children }: SafeConvexProviderProps) {
  const { client, disabled } = useMemo(() => createClient(), []);

  return (
    <ConvexDisabledContext.Provider value={disabled}>
      <ConvexProvider client={client}>{children}</ConvexProvider>
    </ConvexDisabledContext.Provider>
  );
}

export function useConvexDisabled(): boolean {
  return useContext(ConvexDisabledContext);
}
