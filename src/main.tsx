import { createRoot } from "react-dom/client";
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

try {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );

  window.__VITE_APP_LOADED__ = true;
} catch (error) {
  console.error('Failed to render app:', error);
  // Fallback rendering
  rootEl.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Error loading app. Check console for details.</div>';
}
