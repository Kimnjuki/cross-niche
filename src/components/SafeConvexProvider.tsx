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

// Placeholder URL — Convex will try to connect but our custom WebSocket fails immediately.
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

/**
 * A fake WebSocket constructor that immediately closes on creation.
 * This prevents the Convex client from ever establishing a real connection
 * while still allowing the ConvexProvider to render (so useQuery hooks
 * don't throw). The app falls back to mock data because queries return
 * undefined indefinitely.
 */
function noopWebSocket(this: WebSocket, _url: string | URL, _protocols?: string | string[]): void {
  // Immediately invoke onclose asynchronously
  setTimeout(() => {
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code: 1000, wasClean: true }));
    }
  }, 0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(noopWebSocket as any).CLOSED = 3;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(noopWebSocket as any).CLOSING = 2;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(noopWebSocket as any).CONNECTING = 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(noopWebSocket as any).OPEN = 1;

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

  // Disabled mode: create a client that can never connect.
  // The noop WebSocket ensures zero reconnect attempts.
  try {
    const placeholder = new ConvexReactClient(PLACEHOLDER_URL, {
      skipConvexDeploymentUrlCheck: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      webSocketConstructor: noopWebSocket as any,
      unsavedChangesWarning: false,
    });
    return { client: placeholder, disabled: true };
  } catch {
    // Last resort — minimal fake client
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
