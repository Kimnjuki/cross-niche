# Coolify Deployment Guide

## Overview

This site is deployed on Coolify using a multi-stage Docker build:
- **Build stage**: Node 22 Alpine → installs deps → builds with Vite → generates sitemaps + static articles
- **Production stage**: Nginx stable Alpine → serves built files

## Required Coolify Configuration

### Build Time Variables
Only set NON-SENSITIVE vars in Coolify Build Time Variables:
- `VITE_GA4_MEASUREMENT_ID` - Google Analytics ID
- `COOLIFY_URL` - Site URL
- `COOLIFY_FQDN` - Primary domain
- `COOLIFY_BRANCH` - Git branch (usually `main`)
- `COOLIFY_RESOURCE_UUID` - Auto-populated by Coolify

### DO NOT Set These Build Time Variables
Sensitive keys must NOT be set as Coolify Build Time Variables:
- `VITE_NVIDIA_API_KEY` - Production value is hardcoded in source (see `auth0Config.ts` pattern)
- `VITE_OPENAI_API_KEY` - Not currently used in production
- `VITE_AUTH0_DOMAIN` - Hardcoded in `src/lib/auth0Config.ts`
- `VITE_AUTH0_CLIENT_ID` - Hardcoded in `src/lib/auth0Config.ts`
- `VITE_AUTH0_AUDIENCE` - Hardcoded in `src/lib/auth0Config.ts`
- `VITE_CONVEX_URL` - Must be blank for Docker builds; SafeConvexProvider handles runtime connection

**Why?** Coolify auto-injects ALL build-time env vars as Docker ARGs. This exposes secrets in Docker image metadata and `docker history` output. Following the `auth0Config.ts` pattern, production credentials are hardcoded in source to prevent stale Coolify values from overriding them.

### Runtime Environment Variables
No runtime env vars are required. The container serves static files only.

## Known Issues and Gaps

### 1. Orphan Containers
Coolify may fail to clean up old containers after deployment:
```
Found orphan containers for this project.
```

**Impact**: Disk space usage on deployment server.

**Workaround**: Manually remove orphan containers:
```bash
docker container prune -f
```

Or use `--remove-orphans` flag if manually running docker compose.

### 2. Deprecated Docker Flags
Coolify uses deprecated `--time` flag for `docker stop`:
```
Flag --time has been deprecated, use --timeout instead
```

**Impact**: None - Docker still accepts the deprecated flag.

**Workaround**: None - this is a Coolify platform issue.

### 3. Container Race Condition
Sometimes Coolify tries to stop a container that was already removed:
```
Error response from daemon: No such container: <id>
```

**Impact**: None - deployment proceeds normally.

**Workaround**: None - this is a Coolify platform issue.

### 4. npm Network Reliability
During Docker builds, `npm ci` may fail with `ECONNRESET` due to network issues. The Dockerfile includes retry logic and falls back to `npm install`.

**Impact**: Longer build times on first attempt.

**Workaround**: None needed - fallback handles it automatically.

## Troubleshooting

### Build Fails with npm Errors
The Docker build uses `npm ci` with fallback to `npm install`. If both fail:
1. Check network connectivity on the deployment server
2. Try clearing Docker build cache in Coolify
3. Check npm registry status

### Site Shows Mock Data Instead of Real Content
This happens when `VITE_CONVEX_URL` is set in Coolify build env vars. The Dockerfile explicitly blanks it during build. If the site shows mock data:
1. Ensure `VITE_CONVEX_URL` is NOT set in Coolify Build Time Variables
2. Redeploy

### Convex Queries Hang on Article Pages
This happens when a stale Convex deploy key is baked into the bundle. The Dockerfile blanks `VITE_CONVEX_URL` and SafeConvexProvider disables Convex when no URL is configured. To fix:
1. Ensure `VITE_CONVEX_URL` is not set in Coolify
2. The app will use mock data until Convex is configured at runtime

### CSS Warnings During Build
You may see warnings about ambiguous `duration-[*]` classes during CSS minification. These are non-fatal and don't affect functionality.

## Security Considerations

- All client-side API keys (VITE_*) are exposed in the browser bundle by design
- Production Auth0 credentials are hardcoded in `src/lib/auth0Config.ts`
- Do NOT add new secrets to Coolify Build Time Variables - they will be exposed in Docker image metadata
- The Dockerfile explicitly unsets sensitive env vars during build to prevent Docker Scout warnings
