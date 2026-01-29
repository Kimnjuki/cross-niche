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

try {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (mountError) {
  console.error("App failed to mount:", mountError);
  rootEl.innerHTML =
    '<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;font-family:system-ui,sans-serif;background:#0f172a;color:#f8fafc;text-align:center">' +
    '<h1 style="font-size:1.25rem;margin-bottom:8px">Something went wrong</h1>' +
    '<p style="color:#94a3b8;margin-bottom:16px">The app could not load. Try a hard refresh (Ctrl+F5) or check the console.</p>' +
    '<a href="/" style="padding:10px 20px;background:#3b82f6;color:white;border-radius:8px;text-decoration:none;font-weight:500">Reload</a>' +
    '</div>';
}
