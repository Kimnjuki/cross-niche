# Stage 1: Build
FROM ovhcom/bun:1.1 AS build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the rest of the code and build
COPY . .

# Setting env variables for the build process (Vite uses VITE_ prefix, not NEXT_PUBLIC_)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_APP_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_APP_URL=$VITE_APP_URL

RUN bun run build

# Stage 2: Production (Serve with Nginx)
FROM nginx:stable-alpine AS production-stage

# Copy the build output from the first stage to Nginx's serve directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

