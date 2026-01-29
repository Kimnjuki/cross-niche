import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { initExternalScriptErrorHandling } from "./lib/externalScriptHandler";
import { initAllTracking } from "./lib/analytics/ga4";
import { initINPOptimizations } from "./lib/seo/inpOptimization";

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

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

createRoot(rootEl).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
