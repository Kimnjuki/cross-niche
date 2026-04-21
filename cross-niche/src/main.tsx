import { createRoot } from "react-dom/client";
import { ConvexProvider } from "convex/react";
import { Auth0Provider } from "@auth0/auth0-react";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./styles/design-tokens.css";
import "./styles/globals.css";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { ConvexErrorBoundary } from "./components/ConvexErrorBoundary";
import { validateConvexSetup } from "./lib/convex-validator";
import { initExternalScriptErrorHandling } from "./lib/externalScriptHandler";
import { initAllTracking } from "./lib/analytics/ga4";
import { initINPOptimizations } from "./lib/seo/inpOptimization";
import { initCoreWebVitals } from "./lib/seo/coreWebVitals";
import "./sentry";
import "./lib/errorHandlers";
import { convex } from "./lib/convex";
import { auth0Domain, auth0ClientId, auth0Audience, isAuth0Enabled } from "./lib/auth0Config";

if (import.meta.env.DEV) {
  validateConvexSetup();
}

// Declare global variable for app loaded state
declare global {
  interface Window {
    __VITE_APP_LOADED__?: boolean;
    __GRIDNEXUS_BUILD__?: number;
  }
}

// Never let init scripts block or break the app (critical for Coolify/deployment)
try {
  initExternalScriptErrorHandling();
} catch {
  // ignore
}
try {
  if (import.meta.env.PROD) initAllTracking();
} catch {
  // ignore
}
try {
  initINPOptimizations();
} catch {
  // ignore
}
try {
  if (import.meta.env.PROD) initCoreWebVitals();
} catch {
  // ignore
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error("Root element #root not found");
  throw new Error("Root element #root not found");
}

const app = (
  <ErrorBoundary>
    <ConvexErrorBoundary>
      <ConvexProvider client={convex}>
        <HelmetProvider>
        {isAuth0Enabled && auth0Domain && auth0ClientId ? (
          <Auth0Provider
            domain={auth0Domain}
            clientId={auth0ClientId}
            authorizationParams={{
              redirect_uri: window.location.origin,
              audience: auth0Audience,
            }}
          >
            <App />
          </Auth0Provider>
        ) : (
          <App />
        )}
        </HelmetProvider>
      </ConvexProvider>
    </ConvexErrorBoundary>
  </ErrorBoundary>
);

try {
  const root = createRoot(rootEl);
  root.render(app);
  window.__VITE_APP_LOADED__ = true;
} catch (error) {
  console.error("Failed to render app:", error);
}
