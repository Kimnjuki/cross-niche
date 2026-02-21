# Convex Deployment Pipeline Refactor

**Date:** 2026-02-06  
**Status:** ✅ Complete

---

## ✅ Changes Implemented

### 1. Simplified Deploy Script
**File:** `package.json`

**Before:**
```json
"deploy:convex": "cross-env CONVEX_DEPLOYMENT=intent-akita-728 npx convex deploy --yes"
```

**After:**
```json
"deploy:convex": "node scripts/check-convex-deploy-key.mjs && npx convex deploy --yes",
"predeploy:convex": "node scripts/check-convex-deploy-key.mjs"
```

**Benefits:**
- Simpler command
- Uses `CONVEX_DEPLOY_KEY` (Convex's standard)
- Pre-deploy validation prevents errors

---

### 2. CONVEX_DEPLOY_KEY Prioritization

**Created:** `scripts/check-convex-deploy-key.mjs`

**Features:**
- ✅ Validates `CONVEX_DEPLOY_KEY` is set
- ✅ Exits with error if missing (prevents deployment drift)
- ✅ Warns if `VITE_CONVEX_URL` doesn't match expected deployment
- ✅ Blocks deployment if old `canny-mule` references found

**Usage:**
- Automatically runs before `deploy:convex`
- Can be run standalone: `node scripts/check-convex-deploy-key.mjs`

---

### 3. Consistent VITE_CONVEX_URL

**Verified/Updated in:**
- ✅ `.env.example` - Set to `https://intent-akita-728.convex.cloud`
- ✅ `package.json` - `build:convex` script uses correct URL
- ✅ `Dockerfile` - Default ARG set to correct URL
- ✅ `scripts/generate-sitemap.mjs` - Validates URL
- ✅ `scripts/generate-news-sitemap.mjs` - Validates URL

**All files now consistently use:** `https://intent-akita-728.convex.cloud`

---

### 4. Removed Canny-Mule References

**Removed from:**
- ✅ `nginx.conf` - Removed redirect rules for canny-mule
- ✅ Documentation files updated (references remain for historical context only)

**Note:** Documentation files (`CHECK_DEPLOYMENT.md`, etc.) still mention `canny-mule` for troubleshooting context, but no code references remain.

---

### 5. Build Process Enhancement

**Updated:**
- ✅ `Dockerfile` - Added `CONVEX_DEPLOY_KEY` ARG and ENV
- ✅ `Dockerfile` - Added warning check for missing deploy key
- ✅ `package.json` - `prebuild` script includes deploy key check

**Build Process:**
1. Checks `CONVEX_DEPLOY_KEY` (warns if missing, doesn't fail build)
2. Generates sitemaps
3. Generates prerender routes
4. Builds application

---

## 📋 Configuration Files

### .env.example
```env
VITE_CONVEX_URL=https://intent-akita-728.convex.cloud
CONVEX_DEPLOY_KEY=dev:intent-akita-728|...
```

### .convex.env
```env
CONVEX_DEPLOYMENT=intent-akita-728
```

### package.json
```json
{
  "scripts": {
    "deploy:convex": "node scripts/check-convex-deploy-key.mjs && npx convex deploy --yes",
    "predeploy:convex": "node scripts/check-convex-deploy-key.mjs",
    "build:convex": "cross-env VITE_CONVEX_URL=https://intent-akita-728.convex.cloud vite build",
    "verify:convex-config": "node scripts/verify-convex-config.mjs"
  }
}
```

### Dockerfile
```dockerfile
ARG VITE_CONVEX_URL=https://intent-akita-728.convex.cloud
ARG CONVEX_DEPLOY_KEY
ENV VITE_CONVEX_URL=${VITE_CONVEX_URL}
ENV CONVEX_DEPLOY_KEY=${CONVEX_DEPLOY_KEY}
```

---

## 🚀 Usage

### Deploy to Convex
```bash
# Set CONVEX_DEPLOY_KEY in environment or .env
export CONVEX_DEPLOY_KEY=dev:intent-akita-728|...

# Deploy (automatically checks deploy key)
npm run deploy:convex
```

### Verify Configuration
```bash
# Check all config files are consistent
npm run verify:convex-config

# Check deploy key is set
node scripts/check-convex-deploy-key.mjs
```

### Build with Convex
```bash
# Build with Convex URL set
npm run build:convex

# Or set environment variable
VITE_CONVEX_URL=https://intent-akita-728.convex.cloud npm run build
```

---

## ✅ Validation Checks

### Pre-Deploy Check (`check-convex-deploy-key.mjs`)
- ✅ `CONVEX_DEPLOY_KEY` is set (exits with error if missing)
- ✅ No `canny-mule` references found
- ✅ `VITE_CONVEX_URL` matches expected (warning if not)

### Configuration Verification (`verify-convex-config.mjs`)
- ✅ `.env.example` uses correct URL
- ✅ `.convex.env` uses correct deployment
- ✅ `package.json` scripts are correct
- ✅ `Dockerfile` uses correct defaults
- ✅ No `canny-mule` references in code

---

## 🔒 Security Notes

1. **CONVEX_DEPLOY_KEY** should be kept secret
   - Never commit to git
   - Use environment variables or secret management
   - Set in CI/CD as secret variable

2. **Build Time Variables** (Coolify)
   - Set `VITE_CONVEX_URL` as Build Time Variable
   - Set `CONVEX_DEPLOY_KEY` as Build Time Variable (if needed)
   - Never expose in Dockerfile ARGs publicly

---

## 📊 Migration Checklist

- [x] Updated `deploy:convex` script
- [x] Created deploy key check script
- [x] Updated `.env.example` with CONVEX_DEPLOY_KEY
- [x] Verified VITE_CONVEX_URL consistency
- [x] Removed canny-mule references from code
- [x] Updated Dockerfile with deploy key support
- [x] Added configuration verification script
- [x] Updated build process

---

## 🎯 Expected Behavior

### Successful Deployment:
```bash
$ npm run deploy:convex

🔍 Checking Convex deployment configuration...

✅ CONVEX_DEPLOY_KEY is set
✅ VITE_CONVEX_URL: https://intent-akita-728.convex.cloud
✅ Configuration check passed

✔ Deployed Convex functions to https://intent-akita-728.convex.cloud
```

### Missing Deploy Key:
```bash
$ npm run deploy:convex

🔍 Checking Convex deployment configuration...

❌ ERROR: CONVEX_DEPLOY_KEY is not set!

   This environment variable is required for Convex deployment.
   Set it in your environment or .env file:
   
   CONVEX_DEPLOY_KEY=dev:intent-akita-728|...
```

---

## ✅ All Refactoring Complete!

**The deployment pipeline now:**
- ✅ Uses simplified `npx convex deploy --yes`
- ✅ Prioritizes `CONVEX_DEPLOY_KEY`
- ✅ Validates configuration before deployment
- ✅ Ensures consistent `VITE_CONVEX_URL`
- ✅ Prevents deployment drift
- ✅ Exits with error if deploy key missing
