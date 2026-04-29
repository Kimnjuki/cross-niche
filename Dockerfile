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

# Explicitly blank VITE_CONVEX_URL to override Coolify's injected ARG.
# Coolify auto-injects ALL build-time env vars as Docker ARG at the top
# of the Dockerfile. Even though Docker makes ARG values available during
# RUN commands, we unset the var at the shell level before running Vite.
# This prevents Vite from baking the stale Convex deploy key into the
# bundle, which would cause Convex queries to hang on article pages.
RUN VITE_CONVEX_URL= npm run build:frontend

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
