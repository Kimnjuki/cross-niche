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
RUN VITE_CONVEX_URL=${VITE_CONVEX_URL} VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY} npm run build:frontend

# Copy sitemap files to dist/ after Vite build
RUN node scripts/copy-sitemap-to-dist.mjs

# Stage 2: Production (Serve with Nginx)
FROM nginx:stable-alpine AS production-stage
# Build cache buster 2026-05-13-2
RUN echo "build-2026-05-13-2" > /dev/null

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
