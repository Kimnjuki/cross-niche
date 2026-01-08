# Stage 1: Build
FROM oven/bun:1.1 AS build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the rest of the code and build
COPY . .

# Map Coolify/Next variables to Vite variables
# Coolify may inject NEXT_PUBLIC_ variables, so we map them to VITE_ variables
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_APP_URL

# Use NEXT_PUBLIC_ if provided (Coolify), otherwise fall back to VITE_ variables
ENV VITE_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL:-${VITE_SUPABASE_URL}}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY:-${VITE_SUPABASE_PUBLISHABLE_KEY}}
ENV VITE_APP_URL=${VITE_APP_URL}

RUN bun run build

# Stage 2: Production (Serve with Nginx)
FROM nginx:stable-alpine AS production-stage

# Copy the build output from the first stage to Nginx's serve directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

