import { defineConfig, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const isProd = mode === "production";
  
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
    react(),
    mode === "development" && componentTagger(),
  ];

  // Prerender plugin: add in prod when PRERENDER!=0 (requires vite-plugin-prerender + Puppeteer)
  if (isProd && process.env.PRERENDER !== "0") {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const vitePrerender = require("vite-plugin-prerender");
      plugins.push(
        vitePrerender.default({
          staticDir: path.join(__dirname, "dist"),
          routes: prerenderRoutes,
        })
      );
    } catch {
      // Skip if plugin not installed
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins,
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
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            convex: ['convex/react', 'convex'],
            ui: ['framer-motion', '@radix-ui/react-slot', '@radix-ui/react-tooltip'],
            icons: ['lucide-react'],
            radix: [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-tabs',
              '@radix-ui/react-accordion',
              '@radix-ui/react-popover',
              '@radix-ui/react-select',
            ],
            charts: ['recharts'],
            editor: ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-placeholder'],
          },
        },
      },
    },
    base: "/",
  };
});
