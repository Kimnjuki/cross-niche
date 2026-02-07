# Coolify Convex Environment Variables Setup

**Target Deployment:** `intent-akita-728`  
**Last Updated:** 2026-02-06

---

## ⚠️ Important: Environment Variables in Coolify

**Coolify ignores `.env` files in production builds.** All environment variables must be configured through the Coolify UI.

---

## Required Environment Variables

Configure these in **Coolify → Your Application → Environment Variables** tab:

### 1. VITE_CONVEX_URL (Build Time Variable)

**Key:** `VITE_CONVEX_URL`  
**Value:** `https://intent-akita-728.convex.cloud`  
**Type:** Build Time Variable (required)  
**Purpose:** Single source of truth for Convex deployment URL

**Why Build Time:** This value is embedded into the built JavaScript bundle. It must be available during `npm run build`.

**How to Set:**
1. Go to Coolify → Your Application
2. Click **"Environment Variables"** tab
3. Click **"Add Variable"**
4. Set:
   - **Key:** `VITE_CONVEX_URL`
   - **Value:** `https://intent-akita-728.convex.cloud`
   - **Type:** Build Time Variable ✅
5. Save and redeploy

---

### 2. CONVEX_DEPLOY_KEY (Optional - for CI/CD deployments)

**Key:** `CONVEX_DEPLOY_KEY`  
**Value:** `prod:...` or `dev:intent-akita-728|...`  
**Type:** Build Time Variable (if deploying from Coolify)  
**Purpose:** Allows Convex CLI to deploy from CI/CD

**Note:** Only needed if you're deploying Convex functions from Coolify. If deploying manually or from GitHub Actions, set this in your CI/CD environment instead.

**How to Get:**
1. Go to https://dashboard.convex.dev
2. Select your project
3. Go to **Settings → Deploy Keys**
4. Copy the deploy key (starts with `prod:` or `dev:`)

**How to Set in Coolify:**
1. Go to Coolify → Your Application
2. Click **"Environment Variables"** tab
3. Click **"Add Variable"**
4. Set:
   - **Key:** `CONVEX_DEPLOY_KEY`
   - **Value:** `prod:...` (your actual deploy key)
   - **Type:** Build Time Variable ✅
5. Save

---

## Environment Variable Checklist

### ✅ Required for Build
- [ ] `VITE_CONVEX_URL` = `https://intent-akita-728.convex.cloud` (Build Time Variable)

### ✅ Optional (if deploying Convex from Coolify)
- [ ] `CONVEX_DEPLOY_KEY` = `prod:...` or `dev:intent-akita-728|...` (Build Time Variable)

### ✅ Optional (for other features)
- [ ] `VITE_APP_URL` = Your app URL (Build Time Variable)
- [ ] `VITE_GA4_MEASUREMENT_ID` = Your GA4 ID (Build Time Variable)

---

## Verification Steps

### 1. Verify Environment Variables Are Set

After adding variables in Coolify:
1. Go to **Environment Variables** tab
2. Confirm `VITE_CONVEX_URL` is listed
3. Confirm it's marked as **Build Time Variable**
4. Confirm value is exactly: `https://intent-akita-728.convex.cloud`

### 2. Verify Build Uses Correct URL

After deployment:
1. Open your deployed site
2. Open browser DevTools → Network tab
3. Look for requests to `*.convex.cloud`
4. Confirm URL is `intent-akita-728.convex.cloud` (not `canny-mule-83`)

### 3. Verify Deployment Target

If deploying Convex from Coolify:
```bash
# SSH into Coolify container or run in build logs
echo $CONVEX_DEPLOY_KEY | head -c 30
# Should show: prod:... or dev:intent-akita-728|...
```

---

## Common Issues

### ❌ Issue: App shows "Demo mode" banner

**Cause:** `VITE_CONVEX_URL` not set or wrong value  
**Fix:** 
1. Check Coolify Environment Variables tab
2. Ensure `VITE_CONVEX_URL` is set as Build Time Variable
3. Value must be exactly: `https://intent-akita-728.convex.cloud`
4. Redeploy application

---

### ❌ Issue: Deployment goes to wrong Convex project

**Cause:** `CONVEX_DEPLOY_KEY` points to wrong deployment  
**Fix:**
1. Check deploy key format in Coolify
2. Must start with `prod:` or `dev:intent-akita-728`
3. Get correct key from Convex Dashboard → Settings → Deploy Keys
4. Update in Coolify and redeploy

---

### ❌ Issue: Build fails with "CONVEX_DEPLOY_KEY not set"

**Cause:** Deploy key missing but deployment script expects it  
**Fix:**
- If deploying Convex from Coolify: Add `CONVEX_DEPLOY_KEY` as Build Time Variable
- If deploying manually: Set in your local environment or CI/CD

---

## Best Practices

1. **Always use Build Time Variables** for `VITE_*` variables
   - These are embedded at build time
   - Runtime environment variables won't work for Vite

2. **Never commit `.env` files** with secrets
   - Use `.env.example` for documentation
   - Set actual values in Coolify UI

3. **Verify after each deployment**
   - Check network requests use correct Convex URL
   - Confirm no "Demo mode" banner appears

4. **Keep deployment consistent**
   - Always use `intent-akita-728` deployment
   - Never use `canny-mule-83` (old deployment)

---

## Quick Reference

| Variable | Type | Required | Example Value |
|----------|------|----------|---------------|
| `VITE_CONVEX_URL` | Build Time | ✅ Yes | `https://intent-akita-728.convex.cloud` |
| `CONVEX_DEPLOY_KEY` | Build Time | ⚠️ If deploying | `prod:...` or `dev:intent-akita-728|...` |
| `VITE_APP_URL` | Build Time | ⚠️ Optional | `https://thegridnexus.com` |
| `VITE_GA4_MEASUREMENT_ID` | Build Time | ⚠️ Optional | `G-XXXXXXXXXX` |

---

## Support

If you encounter issues:
1. Check Coolify build logs for environment variable errors
2. Verify variables are set as **Build Time Variables** (not Runtime)
3. Confirm `VITE_CONVEX_URL` matches exactly: `https://intent-akita-728.convex.cloud`
4. Check Convex Dashboard to confirm deployment exists

---

**✅ Configuration Complete!**

After setting these variables in Coolify, redeploy your application to apply changes.
