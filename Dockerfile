# Stage 1: Build — use Node + npm (package-lock.json). Do not use Bun in Docker.
# Build version: auth0-credentials-embedded-v2 - Auth0 creds baked into code, not env vars.
#   auth0Config.ts has hardcoded fallbacks for the new EU Auth0 tenant.
#   Coolify ARG injection no longer can override them with stale values.
FROM node:22-alpine AS build-stage

# Explicit ARG declarations for Coolify-injected build-time variables.
# Only safe, non-sensitive vars are declared here. Sensitive API keys must NOT
# be set in Coolify Build Time Variables — they are exposed in Docker image
# metadata and `docker history`. Production values are hardcoded in source
# (see auth0Config.ts pattern) or injected at runtime.
ARG VITE_GA4_MEASUREMENT_ID=G-XMGRJBSN5Y
ARG COOLIFY_URL=https://thegridnexus.com
ARG COOLIFY_FQDN=thegridnexus.com
ARG COOLIFY_BRANCH=main
ARG COOLIFY_RESOURCE_UUID=x2njvj4owio2rehys3l97m81

WORKDIR /app

# Copy package files and install dependencies (npm ci uses lockfile; no bun.lockb)
COPY package.json package-lock.json ./
# Skip heavy browser downloads and reduce npm noise
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true PUPPETEER_SKIP_DOWNLOAD=true \
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
    SENTRY_SKIP_DOWNLOAD=1 \
    npm_config_loglevel=warn \
    npm_config_audit=false \
    npm_config_fund=false \
    npm_config_progress=false \
    npm_config_legacy_peer_deps=true \
    NODE_OPTIONS=--max-old-space-size=4096

# Improve npm network resilience for flaky CI/CD networks and add retry logic
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 2 \
    && npm config set fetch-retry-maxtimeout 60000 \
    && npm config set fetch-retry-mintimeout 10000 \
    && npm ci --legacy-peer-deps --no-audit --no-fund --prefer-offline \
    || npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline

# Copy the rest of the code and build
COPY . .

# IMPORTANT: VITE_CONVEX_URL must be explicitly emptied at build time.
# Coolify auto-injects ALL build-time env vars as Docker ARG, which
# Docker makes available as environment variables during RUN commands.
# If we don't explicitly blank it, Vite picks up Coolify's injected
# VITE_CONVEX_URL and bakes the stale key into the bundle, which
# causes all Convex queries to hang indefinitely on article pages.
# SafeConvexProvider detects the empty/missing URL and disables all
# Convex queries, allowing mock data to render immediately.
#
# Auth0 env vars are also deliberately omitted — credentials are
# hardcoded in src/lib/auth0Config.ts as production defaults.
#
# PRERENDER=0 disables vite-plugin-prerender. That plugin launches a
# headless Chromium to statically render routes, but Chromium is never
# downloaded here (PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true), so the plugin
# crashes the build with exit code 255 on Linux. Static article HTML is
# generated separately by scripts/generate-static-articles.mjs below.

# Unset VITE_CONVEX_URL so Vite doesn't bake a stale deploy key into the bundle.
RUN VITE_CONVEX_URL= PRERENDER=0 npm run build:frontend

# Generate SEO sitemaps (only valid, indexable URLs) and static article HTML
# files so Googlebot can crawl article content without executing JavaScript.
# This fixes "Discovered/Crawled - currently not indexed" and "Server error (5xx)".
RUN node scripts/generate-seo-sitemaps.mjs && node scripts/generate-static-articles.mjs

# Stage 2: Production (Serve with Nginx)
FROM nginx:stable-alpine AS production-stage

# Copy built files from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Change ownership to non-root user
RUN chown -R nginx:nginx /usr/share/nginx/html

# Create cache directories with proper permissions
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
    && chown -R nginx:nginx /var/cache/nginx \
    && chmod -R 755 /var/cache/nginx

# Redirect PID file to /tmp (survives container tmpfs mounts) and fix log ownership
RUN sed -i 's|pid\s*/run/nginx.pid;|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf \
    && chown -R nginx:nginx /var/log/nginx

# Switch to non-root user for security
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
