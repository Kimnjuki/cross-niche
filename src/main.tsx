import { createRoot, hydrateRoot } from "react-dom/client";
import { ConvexProvider } from "convex/react";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.tsx";
import "./index.css";
import "./styles/design-tokens.css";
import "./styles/globals.css";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { initExternalScriptErrorHandling } from "./lib/externalScriptHandler";
import { initAllTracking } from "./lib/analytics/ga4";
import { initINPOptimizations } from "./lib/seo/inpOptimization";
import { initCoreWebVitals } from "./lib/seo/coreWebVitals";
import "./sentry";
import "./lib/errorHandlers";
import { convex } from "./lib/convex";
import { auth0Domain, auth0ClientId, auth0Audience, isAuth0Enabled } from "./lib/auth0Config";

// Build timestamp for cache busting
const BUILD_TIMESTAMP = Date.now();

// Declare global variable for app loaded state
declare global {
  interface Window {
    __VITE_APP_LOADED__?: boolean;
    __GRIDNEXUS_BUILD__?: number;
  }
}

// Set build timestamp globally
window.__GRIDNEXUS_BUILD__ = BUILD_TIMESTAMP;

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
    <ConvexProvider client={convex}>
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
    </ConvexProvider>
  </ErrorBoundary>
);

try {
  if (rootEl.hasChildNodes()) {
    hydrateRoot(rootEl, app);
  } else {
    createRoot(rootEl).render(app);
  }
  window.__VITE_APP_LOADED__ = true;
} catch (error) {
  console.error('Failed to render app:', error);
  rootEl.innerHTML = '';
  createRoot(rootEl).render(app);
}
