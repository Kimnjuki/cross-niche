/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL?: string;
  readonly VITE_CONVEX_SITE_URL?: string;
  readonly VITE_GA4_MEASUREMENT_ID?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  /** NVIDIA NIM (build.nvidia.com) API key — `nvapi-*`. */
  readonly VITE_NVIDIA_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
