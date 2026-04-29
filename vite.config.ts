import { defineConfig, type ConfigEnv, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

/** Injects VITE_GA4_MEASUREMENT_ID into index.html at build (from .env). */
function injectGa4Id(mode: string) {
  return {
    name: "inject-ga4-id",
    transformIndexHtml: {
      order: "pre" as const,
      handler(html: string) {
        const env = loadEnv(mode, process.cwd(), "");
        const gaId = env.VITE_GA4_MEASUREMENT_ID || "G-TJ1VXE91NE";
        return html.replace(/%VITE_GA4_MEASUREMENT_ID%/g, gaId);
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const isProd = mode === "production";

  // VITE_CONVEX_URL is NOT injected here. SafeConvexProvider handles
  // Convex connection at runtime and disables all queries when the URL
  // is not explicitly set (preventing stale deploy keys from hanging).
  // The old fallback "https://intent-akita-728.convex.cloud" was removed
  // because it forced Convex connection even in Docker builds.
  const convexUrl = (import.meta as Record<string, any>).env?.VITE_CONVEX_URL || "";
  
  // Load prerender routes: static + article routes from prerender-routes.json (generated in prebuild)
  let prerenderRoutes = [
    "/",
    "/tech",
    "/security",
    "/gaming",
    "/news",
    "/topics",
    "/guides",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/roadmap",
    "/blog-series",
    "/security-profile",
    "/community-threats",
    "/tools",
  ];
  try {
    const routesPath = path.join(__dirname, "prerender-routes.json");
    const routesJson = fs.readFileSync(routesPath, "utf8");
    prerenderRoutes = JSON.parse(routesJson);
  } catch {
    // Use static routes only if file not found
  }

  const plugins = [
    injectGa4Id(mode),
    react(),
    mode === "development" && componentTagger(),
  ];

  // Prerender plugin: DISABLED TEMPORARILY to fix React loading issue
  // if (isProd && process.env.PRERENDER !== "0") {
  //   try {
  //     // eslint-disable-next-line @typescript-eslint/no-require-imports
  //     const vitePrerender = require("vite-plugin-prerender");
  //     plugins.push(
  //       vitePrerender.default({
  //         staticDir: path.join(__dirname, "dist"),
  //         routes: prerenderRoutes,
  //       })
  //     );
  //   } catch {
  //     // Skip if plugin not installed
  //   }
  // }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
    // Do NOT explicitly define VITE_CONVEX_URL here. SafeConvexProvider
    // handles connection at runtime and will use the fallback placeholder
    // URL when this env var is not set, disabling all Convex queries.
    // This prevents stale deploy keys from hanging all article pages.
    // NOTE: 'convexUrl' is declared above but not used — kept for clarity.
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      sourcemap: !isProd,
      minify: isProd ? ("esbuild" as const) : false,
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          // Add cache-busting to filenames
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`,
        },
      },
    },
    base: "/",
  };
});
