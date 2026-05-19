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
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (msg.includes('development keys') || msg.includes('Attempting reconnect') || msg.includes('WebSocket reconnected') || msg.includes('closed with code') || msg.includes('CONVEX')) return;
  originalWarn.apply(console, args);
};
console.error = function filterError(...args: unknown[]) {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (msg.includes('WebSocket') || msg.includes('reconnect') || msg.includes('Could not find public function') || msg.includes('[CONVEX Q(') || msg.includes('CONVEX ') || msg.includes('failed')) return;
  originalError.apply(console, args);
};

// When disabled, we don't create a Convex client at all to avoid reconnect spam.
// Instead, children render directly without ConvexProvider.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

function createClient(): { client: ConvexReactClient | null; disabled: boolean } {
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

  // Disabled mode — no Convex client at all. No WebSocket, no reconnects.
  // App uses mock/sample data for everything.
  return { client: null, disabled: true };
}

interface SafeConvexProviderProps {
  children: ReactNode;
}

export function SafeConvexProvider({ children }: SafeConvexProviderProps) {
  const { client, disabled } = useMemo(() => createClient(), []);

  // When disabled, skip the ConvexProvider entirely — no WebSocket, no reconnect noise.
  if (disabled || !client) {
    return (
      <ConvexDisabledContext.Provider value={true}>
        {children}
      </ConvexDisabledContext.Provider>
    );
  }

  return (
    <ConvexDisabledContext.Provider value={false}>
      <ConvexProvider client={client}>{children}</ConvexProvider>
    </ConvexDisabledContext.Provider>
  );
}

export function useConvexDisabled(): boolean {
  return useContext(ConvexDisabledContext);
}
