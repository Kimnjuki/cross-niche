# Migrate Convex Deployment to intent-akita-728

**Date:** 2026-02-06  
**Purpose:** Transfer all changes from old deployment (canny-mule) to new deployment (intent-akita-728)

---

## 🎯 Objective

Deploy all Convex functions, schema, and configurations to `intent-akita-728` so that all changes previously made are reflected on the platform.

---

## ✅ What Gets Deployed

### Schema (`convex/schema.ts`)
- All table definitions
- Indexes
- Data models

### Functions
- `convex/content.ts` - Content queries and mutations
- `convex/articles.ts` - News articles
- `convex/aiUpdates.ts` - AI Pulse updates
- `convex/guides.ts` - Guides and tutorials
- `convex/ingest.ts` - News ingestion
- `convex/newsIngestor.ts` - News ingestor
- `convex/crons.ts` - Scheduled tasks
- `convex/securityRatings.ts` - Security ratings
- `convex/seed.ts` - Seed data
- `convex/verify.ts` - Verification functions
- `convex/import.ts` - Import functions
- `convex/insertFeaturedArticle.ts` - Featured article insertion

---

## 🚀 Quick Migration

### Option 1: Using Migration Script (Recommended)

```powershell
npm run migrate:convex
```

This script will:
1. ✅ Verify `CONVEX_DEPLOY_KEY` is set and valid
2. ✅ Check `VITE_CONVEX_URL` matches expected deployment
3. ✅ List all Convex functions to be deployed
4. ✅ Deploy everything to `intent-akita-728`
5. ✅ Provide verification steps

### Option 2: Standard Deployment

```powershell
npm run deploy:convex
```

This runs the pre-deployment check and then deploys.

---

## 📋 Pre-Deployment Checklist

Before running migration, ensure:

- [ ] `.env.local` exists with `CONVEX_DEPLOY_KEY` set
- [ ] `CONVEX_DEPLOY_KEY` starts with `prod:` or `dev:intent-akita-728`
- [ ] `VITE_CONVEX_URL` is set to `https://intent-akita-728.convex.cloud`
- [ ] You're authenticated with Convex (`npx convex login`)

---

## 🔧 Step-by-Step Migration

### Step 1: Set Environment Variables

**PowerShell (Current Session):**
```powershell
$env:CONVEX_DEPLOY_KEY = "dev:intent-akita-728|eyJ2MiI6IjYzZjcxNzE0ZjI0MjQ3NzU5NmNhZDZhOTgwMGI1Yzk1In0="
```

**Or ensure `.env.local` has:**
```env
VITE_CONVEX_URL=https://intent-akita-728.convex.cloud
CONVEX_DEPLOY_KEY=dev:intent-akita-728|eyJ2MiI6IjYzZjcxNzE0ZjI0MjQ3NzU5NmNhZDZhOTgwMGI1Yzk1In0=
```

### Step 2: Authenticate with Convex (if needed)

```powershell
npx convex login
```

This opens your browser to authenticate. After authentication, you can proceed.

### Step 3: Deploy Everything

```powershell
npm run migrate:convex
```

**Expected Output:**
```
🚀 Migrating Convex deployment to intent-akita-728...

📋 Pre-deployment checks:

✅ CONVEX_DEPLOY_KEY is set and valid
✅ Deploy key format: dev:intent-akita-728
✅ VITE_CONVEX_URL: https://intent-akita-728.convex.cloud

📦 Convex functions found:

  • aiUpdates.ts
  • articles.ts
  • content.ts
  • crons.ts
  • guides.ts
  • ingest.ts
  • insertFeaturedArticle.ts
  • newsIngestor.ts
  • schema.ts
  • securityRatings.ts
  • seed.ts
  • verify.ts
  • import.ts

🚀 Deploying to intent-akita-728...

✔ Deployed Convex functions to https://intent-akita-728.convex.cloud

✅ Deployment completed successfully!

📋 Next steps:
   1. Verify deployment in Convex Dashboard
   2. Check that all functions are available
   3. Verify schema is updated
   4. Test your application
```

---

## ✅ Post-Deployment Verification

### 1. Verify in Convex Dashboard

1. Go to https://dashboard.convex.dev
2. Select your project
3. Check **Settings → Deployment URL**
   - Should show: `https://intent-akita-728.convex.cloud`
4. Check **Functions** tab
   - All functions should be listed
5. Check **Data** tab
   - Schema should be updated with all tables

### 2. Verify Schema

In Convex Dashboard → **Data**:
- [ ] `content` table exists
- [ ] `articles` table exists
- [ ] `aiUpdates` table exists
- [ ] `guides` table exists
- [ ] `guideProgress` table exists
- [ ] `securityRatings` table exists
- [ ] All other tables from `schema.ts` exist

### 3. Verify Functions

In Convex Dashboard → **Functions**:
- [ ] `content:*` functions available
- [ ] `articles:*` functions available
- [ ] `aiUpdates:*` functions available
- [ ] `guides:*` functions available
- [ ] `ingest:*` functions available
- [ ] `crons:*` functions available

### 4. Test Application

1. **Start your app:**
   ```powershell
   npm run dev
   ```

2. **Check for errors:**
   - Open browser console
   - Look for Convex connection errors
   - Verify data loads correctly

3. **Test features:**
   - Load articles
   - Check AI Pulse page
   - Test Guides functionality
   - Verify news feed works

---

## 🚨 Troubleshooting

### Error: CONVEX_DEPLOY_KEY is not set

**Fix:**
```powershell
# Set in current session
$env:CONVEX_DEPLOY_KEY = "dev:intent-akita-728|..."

# Or add to .env.local
echo "CONVEX_DEPLOY_KEY=dev:intent-akita-728|..." >> .env.local
```

---

### Error: 401 Unauthorized

**Fix:**
```powershell
npx convex login
```

This will authenticate you with Convex.

---

### Error: Deployment goes to wrong URL

**Fix:**
1. Check `.env.local` has correct `CONVEX_DEPLOY_KEY`
2. Verify `CONVEX_DEPLOY_KEY` format (must start with `prod:` or `dev:intent-akita-728`)
3. Run `npm run verify:convex-config` to check configuration

---

### Functions not appearing after deployment

**Possible causes:**
1. Deployment failed silently
2. Wrong project selected in Convex Dashboard
3. Functions have TypeScript errors

**Fix:**
1. Check deployment output for errors
2. Verify you're looking at the correct project in Dashboard
3. Check `convex/` directory for TypeScript errors:
   ```powershell
   npx convex dev
   ```
   (Press Ctrl+C after checking)

---

### Schema not updated

**Fix:**
1. Ensure `convex/schema.ts` is saved
2. Re-run deployment:
   ```powershell
   npm run deploy:convex
   ```
3. Check Convex Dashboard → Data → Schema

---

## 📊 Migration Status

After successful migration, you should see:

- ✅ All Convex functions deployed to `intent-akita-728`
- ✅ Schema updated with all tables
- ✅ Application connects to `intent-akita-728.convex.cloud`
- ✅ All features working correctly

---

## 🔄 Data Migration (if needed)

If you have data in the old deployment (`canny-mule`) that needs to be migrated:

1. **Export from old deployment:**
   ```powershell
   # Set old deployment key temporarily
   $env:CONVEX_DEPLOY_KEY = "old-deploy-key"
   npx convex export --output old-data.zip
   ```

2. **Import to new deployment:**
   ```powershell
   # Set new deployment key
   $env:CONVEX_DEPLOY_KEY = "dev:intent-akita-728|..."
   npx convex import old-data.zip
   ```

**Note:** Only migrate data if necessary. Schema and functions are automatically deployed.

---

## 📚 Related Documentation

- `CONVEX_ENVIRONMENT_DRIVEN_SETUP.md` - Environment setup
- `COOLIFY_CONVEX_SETUP.md` - Production deployment setup
- `POWERSHELL_ENV_SETUP.md` - PowerShell environment setup

---

## ✅ Summary

**To migrate everything to intent-akita-728:**

1. Set `CONVEX_DEPLOY_KEY` in environment or `.env.local`
2. Run: `npm run migrate:convex`
3. Verify in Convex Dashboard
4. Test your application

**All changes from the old deployment will now be on intent-akita-728! 🚀**
