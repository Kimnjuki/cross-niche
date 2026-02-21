# Architecture & Database Decision

**Last updated:** February 2026

## Database: Convex (Primary)

The Grid Nexus uses **Convex** as the primary backend for:

- **Content & articles** – `convex/content.ts`, `convex/articles.ts`
- **News feed** – ingested content and live wire
- **Sitemaps** – scripts pull from Convex
- **Real-time queries** – React hooks via `useQuery(api.content.*)`

**Convex deployment:** `intent-akita-728` (production URL: `https://intent-akita-728.convex.cloud`).

## Supabase (Legacy / Optional)

The `/supabase` folder contains:

- **Migrations** – legacy or reference schema (e.g. `insert_nvidia_rubin_article.sql`)
- **Edge functions** – optional serverless

The app does **not** require Supabase to run. Authentication and content are handled by Convex and optional Clerk. If you need Supabase, set `VITE_SUPABASE_*` in `.env`.

## Environment

- **Single source of truth:** `.env.example` lists all variables.
- **Required for run:** `VITE_CONVEX_URL` (and Convex deploy key for production builds if using `convex deploy`).
- **Local:** Copy `.env.example` to `.env.local` and set `VITE_CONVEX_URL` (or use `npm run dev:convex` which sets it).

## Frontend

- **Vite + React 18** – SPA with client-side routing.
- **Build output:** `dist/` (static assets).
- **Deployment:** Serve `dist/` with nginx or any static host; SPA fallback to `index.html`.
