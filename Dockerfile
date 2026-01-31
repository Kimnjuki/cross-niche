# Stage 1: Build — use Node + npm (package-lock.json). Do not use Bun in Docker.
# Note: Coolify may inject ARGs (e.g. production_deploy_key). Do not add secrets here;
# set VITE_* and other build args in Coolify Build Time Variables only.
FROM node:22-alpine AS build-stage

WORKDIR /app

# Copy package files and install dependencies (npm ci uses lockfile; no bun.lockb)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy the rest of the code and build
COPY . .

# Build-time env for Vite (Coolify: set these as Build Time Variables, one = only)
ARG VITE_CONVEX_URL
ARG VITE_APP_URL

ENV VITE_CONVEX_URL=${VITE_CONVEX_URL}
ENV VITE_APP_URL=${VITE_APP_URL}

RUN npm run build

# Stage 2: Production (Serve with Nginx)
FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
