# Convex Environment-Driven Deployment Pipeline

**Target Deployment:** `intent-akita-728`  
**Last Updated:** 2026-02-06

---

## 🎯 Overview

The Convex deployment pipeline is now **fully environment-driven** and strictly targets `intent-akita-728`. All configuration comes from environment variables, with no hardcoded deployment references.

---

## ✅ Key Principles

1. **Single Source of Truth:** `VITE_CONVEX_URL=https://intent-akita-728.convex.cloud` in `.env` files
2. **Environment-Driven:** `CONVEX_DEPLOY_KEY` from environment controls deployment target
3. **Safety Checks:** Pre-deployment validation ensures correct configuration
4. **No Hardcoding:** All deployment references removed from code

---

## 📋 Configuration Files

### 1. `.env.example` (Template)

```env
# Single Source of Truth
VITE_CONVEX_URL=https://intent-akita-728.convex.cloud

# Deploy Key (must start with prod: or dev:intent-akita-728)
CONVEX_DEPLOY_KEY=dev:intent-akita-728|...
```

**Purpose:** Template for local development. Copy to `.env.local` and fill in values.

---

### 2. `.env.local` (Local Development)

**Create this file** by copying `.env.example`:

```bash
cp .env.example .env.local
```

**Required Variables:**
- `VITE_CONVEX_URL` - Must be `https://intent-akita-728.convex.cloud`
- `CONVEX_DEPLOY_KEY` - Must start with `prod:` or `dev:intent-akita-728`

---

### 3. `.convex.env` (Convex CLI)

```env
CONVEX_DEPLOYMENT=intent-akita-728
```

**Purpose:** Used by Convex CLI for deployment targeting (legacy support).

---

## 🚀 Deployment Scripts

### Deploy Command

```bash
npm run deploy:convex
```

**What it does:**
1. Runs `predeploy:convex` hook (safety check)
2. Executes `npx convex deploy --yes`
3. Convex CLI automatically uses `CONVEX_DEPLOY_KEY` from environment

**Script Definition:**
```json
{
  "deploy:convex": "npx convex deploy --yes",
  "predeploy:convex": "node scripts/check-convex-deploy-key.mjs"
}
```

---

## 🔒 Pre-Deployment Safety Check

**Script:** `scripts/check-convex-deploy-key.mjs`

**Validations:**
1. ✅ `CONVEX_DEPLOY_KEY` is set
2. ✅ `CONVEX_DEPLOY_KEY` starts with `prod:` or `dev:intent-akita-728`
3. ✅ `VITE_CONVEX_URL` is set and equals `https://intent-akita-728.convex.cloud`
4. ✅ No references to old `canny-mule` deployment

**Exit Codes:**
- `0` - All checks passed, deployment can proceed
- `1` - Validation failed, deployment blocked

---

## 🏗️ Build Process

### Local Build

```bash
# Standard build (uses VITE_CONVEX_URL from .env.local)
npm run build

# Explicit Convex URL build
npm run build:convex
```

### CI/CD Build

**Coolify:** See `COOLIFY_CONVEX_SETUP.md`  
**GitHub Actions:** Set environment variables in workflow

**Required Build Time Variables:**
- `VITE_CONVEX_URL` = `https://intent-akita-728.convex.cloud`
- `CONVEX_DEPLOY_KEY` = `prod:...` or `dev:intent-akita-728|...` (if deploying)

---

## 🔍 Verification

### Check Configuration

```bash
# Verify all config files are consistent
npm run verify:convex-config
```

**Checks:**
- `.env.example` uses correct URL
- `.convex.env` references correct deployment
- `package.json` scripts are correct
- `Dockerfile` uses correct defaults
- No `canny-mule` references in code

### Check Deploy Key

```bash
# Run pre-deployment check manually
node scripts/check-convex-deploy-key.mjs
```

---

## 🐳 Docker Build

**File:** `Dockerfile`

**Default Values:**
```dockerfile
ARG VITE_CONVEX_URL=https://intent-akita-728.convex.cloud
ARG CONVEX_DEPLOY_KEY
```

**Usage:**
```bash
docker build \
  --build-arg VITE_CONVEX_URL=https://intent-akita-728.convex.cloud \
  --build-arg CONVEX_DEPLOY_KEY=prod:... \
  -t thegridnexus .
```

**Note:** In Coolify, set these as Build Time Variables in the UI (`.env` files are ignored).

---

## 📝 Environment Variable Reference

| Variable | Required | Format | Example |
|----------|----------|--------|---------|
| `VITE_CONVEX_URL` | ✅ Yes | URL | `https://intent-akita-728.convex.cloud` |
| `CONVEX_DEPLOY_KEY` | ✅ For deploy | `prod:...` or `dev:intent-akita-728\|...` | `prod:abc123...` |

---

## ✅ Deployment Checklist

### Before Deploying

- [ ] `.env.local` exists with `VITE_CONVEX_URL` set
- [ ] `CONVEX_DEPLOY_KEY` is set in environment
- [ ] `CONVEX_DEPLOY_KEY` starts with `prod:` or `dev:intent-akita-728`
- [ ] `VITE_CONVEX_URL` equals `https://intent-akita-728.convex.cloud`
- [ ] Run `npm run verify:convex-config` (all checks pass)

### Deploy

```bash
npm run deploy:convex
```

**Expected Output:**
```
🔍 Pre-deployment safety check...

✅ CONVEX_DEPLOY_KEY is set and valid
✅ CONVEX_DEPLOY_KEY format: production
✅ VITE_CONVEX_URL: https://intent-akita-728.convex.cloud
✅ All safety checks passed - deployment can proceed

✔ Deployed Convex functions to https://intent-akita-728.convex.cloud
```

---

## 🚨 Common Issues

### Error: CONVEX_DEPLOY_KEY is not set

**Fix:** Set `CONVEX_DEPLOY_KEY` in your environment or `.env.local`

```bash
export CONVEX_DEPLOY_KEY=prod:...
# or
echo "CONVEX_DEPLOY_KEY=prod:..." >> .env.local
```

---

### Error: CONVEX_DEPLOY_KEY has invalid format

**Fix:** Deploy key must start with `prod:` or `dev:intent-akita-728`

```bash
# Wrong
CONVEX_DEPLOY_KEY=canny-mule-83|...

# Correct
CONVEX_DEPLOY_KEY=prod:...
# or
CONVEX_DEPLOY_KEY=dev:intent-akita-728|...
```

---

### Error: VITE_CONVEX_URL does not match

**Fix:** Set `VITE_CONVEX_URL` to exact value:

```bash
export VITE_CONVEX_URL=https://intent-akita-728.convex.cloud
# or in .env.local
VITE_CONVEX_URL=https://intent-akita-728.convex.cloud
```

---

### Warning: Found reference to canny-mule

**Fix:** Remove any references to old deployment:
- Check `.env.local` for `canny-mule`
- Check environment variables
- Check `CONVEX_DEPLOY_KEY` value

---

## 🔄 Migration from Old Setup

If you have old configuration:

1. **Remove hardcoded deployment references:**
   ```bash
   # Old (remove)
   CONVEX_DEPLOYMENT=intent-akita-728 npx convex deploy
   
   # New (use)
   npm run deploy:convex
   ```

2. **Update environment variables:**
   ```bash
   # Ensure .env.local has:
   VITE_CONVEX_URL=https://intent-akita-728.convex.cloud
   CONVEX_DEPLOY_KEY=prod:... or dev:intent-akita-728|...
   ```

3. **Verify configuration:**
   ```bash
   npm run verify:convex-config
   ```

---

## 📚 Related Documentation

- `COOLIFY_CONVEX_SETUP.md` - Coolify-specific setup
- `CONVEX_DEPLOYMENT_REFACTOR.md` - Refactoring details
- `scripts/check-convex-deploy-key.mjs` - Safety check script
- `scripts/verify-convex-config.mjs` - Configuration verification

---

## ✅ Summary

**The deployment pipeline is now:**
- ✅ Environment-driven (no hardcoded values)
- ✅ Strictly targets `intent-akita-728`
- ✅ Validates configuration before deployment
- ✅ Prevents deployment drift
- ✅ Single source of truth (`VITE_CONVEX_URL`)

**Deploy with confidence:** `npm run deploy:convex` 🚀
