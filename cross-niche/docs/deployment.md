# Deployment Guide

## Build

```bash
npm ci --legacy-peer-deps
npm run build
```

Output: `dist/`. Ensure `VITE_CONVEX_URL` and `VITE_APP_URL` are set at build time (e.g. in CI or Coolify Build Time Variables).

## Docker

Use the repo `Dockerfile` and `nginx.conf`:

- **Build:** Uses Node 22 for build, then nginx to serve `dist/`.
- **Env:** Pass `VITE_CONVEX_URL`, `VITE_APP_URL`, and optionally `CONVEX_DEPLOY_KEY` as build args.

Example (Coolify / generic):

```bash
docker build -t gridnexus .
docker run -p 80:80 gridnexus
```

## Static host (Vercel, Netlify, Cloudflare Pages)

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 18 or 20
- Set env vars in the dashboard: `VITE_CONVEX_URL`, `VITE_APP_URL`

## Pre-deploy

See [pre-deployment-checklist.md](pre-deployment-checklist.md).

## Convex

To deploy Convex backend separately:

```bash
npm run deploy:convex
```

Requires `CONVEX_DEPLOY_KEY` in `.env` or environment.
