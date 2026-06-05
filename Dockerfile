# Stage 1: Build — use Node + npm (package-lock.json). Do not use Bun in Docker.
# Build version: auth0-credentials-embedded-v2 - Auth0 creds baked into code, not env vars.
#   auth0Config.ts has hardcoded fallbacks for the new EU Auth0 tenant.
#   Coolify ARG injection no longer can override them with stale values.
FROM node:22-alpine AS build-stage

WORKDIR /app

# Copy package files and install dependencies (npm ci uses lockfile; no bun.lockb)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy the rest of the code and build
COPY . .

# IMPORTANT: VITE_CONVEX_URL is passed through at build time so the Convex
# client connects to the real production backend instead of the placeholder.
# Coolify injects this as a Docker ARG; we pass it through when running Vite.
# If VITE_CONVEX_URL is not set (local dev), SafeConvexProvider falls back to
# a placeholder client and mock data — no crashes, just offline mode.
#
# Auth0 env vars are deliberately hardcoded in src/lib/auth0Config.ts.

# Generate clean sitemap files from mock article slugs
RUN node scripts/generate-sitemap-vite.mjs

# Build with production env vars from Coolify (or defaults)
ARG VITE_CONVEX_URL
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_NVIDIA_API_KEY
RUN VITE_CONVEX_URL=${VITE_CONVEX_URL} VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY} VITE_NVIDIA_API_KEY=${VITE_NVIDIA_API_KEY} npm run build:frontend

# Copy sitemap files to dist/ after Vite build
RUN node scripts/copy-sitemap-to-dist.mjs

# Generate prerendered static HTML pages for SEO (blog articles, static pages, niches)
# These are served by nginx directly so Googlebot gets content without JS
RUN node scripts/generate-prerender-pages.mjs

# Stage 2: Production (Serve with Nginx)
FROM nginx:stable-alpine AS production-stage
# Build cache buster 2026-06-04-1 — NVIDIA proxy via envsubst
RUN echo "build-2026-06-04-1" > /dev/null

# Install envsubst (gettext) for runtime env var injection into nginx config
RUN apk add --no-cache gettext

# Copy built files from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration (template with \${VARIABLE} placeholders)
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Change ownership to non-root user
RUN chown -R nginx:nginx /usr/share/nginx/html

# Create cache directories with proper permissions
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
    && chown -R nginx:nginx /var/cache/nginx \
    && chmod -R 755 /var/cache/nginx

# Redirect PID file, error log to /tmp (survives container tmpfs mounts)
# and redirect access log to stdout for container-friendly logging
RUN sed -i \
    -e 's|pid\s*/run/nginx.pid;|pid /tmp/nginx.pid;|' \
    -e 's|error_log /var/log/nginx/error.log;|error_log /tmp/error.log;|' \
    -e 's|access_log /var/log/nginx/access.log;|access_log /dev/stdout;|' \
    -e '/^user /s/^/# /' \
    /etc/nginx/nginx.conf

# Install su-exec for privilege dropping in entrypoint (run as root, drop to nginx)
RUN apk add --no-cache su-exec

# Copy entrypoint script for runtime env var injection
COPY scripts/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Keep root as default so ENTRYPOINT can do envsubst, then drops to nginx
EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
