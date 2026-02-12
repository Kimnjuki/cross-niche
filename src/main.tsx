import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/globals.css";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { initExternalScriptErrorHandling } from "./lib/externalScriptHandler";
import { initAllTracking } from "./lib/analytics/ga4";
import { initINPOptimizations } from "./lib/seo/inpOptimization";
import { initCoreWebVitals } from "./lib/seo/coreWebVitals";
import "./sentry";

// Declare global variable for app loaded state
declare global {
  interface Window {
    __VITE_APP_LOADED__?: boolean;
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

console.log("Root element found, attempting to render React app...");

try {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
  
  // Mark app as successfully loaded
  window.__VITE_APP_LOADED__ = true;
  console.log("React app rendered successfully");
} catch (error) {
  console.error('Failed to render app:', error);
  // Fallback rendering
  rootEl.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Error loading app. Check console for details.</div>';
}
