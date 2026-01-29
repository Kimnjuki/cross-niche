import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initExternalScriptErrorHandling } from "./lib/externalScriptHandler";
import { initAllTracking } from "./lib/analytics/ga4";
import { initINPOptimizations } from "./lib/seo/inpOptimization";

// Initialize error handling for external scripts
initExternalScriptErrorHandling();

// Initialize Google Analytics 4 tracking
if (import.meta.env.PROD) {
  initAllTracking();
}

// Initialize INP optimizations
initINPOptimizations();

createRoot(document.getElementById("root")!).render(<App />);
