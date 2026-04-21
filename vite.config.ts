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
      order: "pre",
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

  // Resolve VITE_CONVEX_URL: prefer .env file value, then process.env (Docker ARG/ENV),
  // then fall back to the known deployment URL. This ensures the URL is always baked
  // into the bundle even when .env.local is not present (e.g. in Docker builds).
  const envFromFiles = loadEnv(mode, process.cwd(), "VITE_");
  const convexUrl =
    envFromFiles.VITE_CONVEX_URL ||
    process.env.VITE_CONVEX_URL ||
    "https://intent-akita-728.convex.cloud";
  
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
    // Explicitly inject VITE_CONVEX_URL so it's always available as import.meta.env.VITE_CONVEX_URL
    // regardless of whether .env.local exists (critical for Docker/Coolify builds).
    define: {
      "import.meta.env.VITE_CONVEX_URL": JSON.stringify(convexUrl),
    },
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
