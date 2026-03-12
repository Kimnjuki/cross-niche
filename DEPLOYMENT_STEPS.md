# Convex Deployment Steps - Quick Guide

## Step 1: Authenticate (If Not Already Done)

If you see "401 Unauthorized" or "MissingAccessToken" error:

```powershell
npx convex login
```

This will open your browser to authenticate with Convex. After authentication, you can proceed to deployment.

**Alternative:** Run `npx convex dev` which will also authenticate you (press Ctrl+C to stop after auth).

## Step 2: Deploy to intent-akita-728

**Recommended method:**
```powershell
npm run deploy:convex:env-file
```

**Alternative methods:**
```powershell
# PowerShell
npm run deploy:convex:ps

# Or manually
$env:CONVEX_DEPLOYMENT='intent-akita-728'
npx convex deploy --yes
```

## Step 3: Verify Deployment

Check the output - it should show:
```
✔ Deployed Convex functions to https://intent-akita-728.convex.cloud
```

**NOT:**
```
✖ Deployed to https://canny-mule-83.convex.cloud  ❌ WRONG!
```

## Troubleshooting

### Still deploying to wrong URL?

1. **Check authentication:**
   ```powershell
   npx convex whoami
   ```

2. **Logout and login again:**
   ```powershell
   npx convex logout
   npx convex login
   ```

3. **Check current deployment:**
   - Go to [Convex Dashboard](https://dashboard.convex.dev)
   - Check which deployment is active
   - Make sure you're logged into the correct account/project

4. **Use env-file method:**
   ```powershell
   npm run deploy:convex:env-file
   ```

5. **Manually verify .convex.env file:**
   - Open `.convex.env`
   - Should contain: `CONVEX_DEPLOYMENT=intent-akita-728`

## After Successful Deployment

1. **Verify in Convex Dashboard:**
   - Go to https://dashboard.convex.dev
   - Select your project
   - Check Settings → Deployment URL
   - Should show: `https://intent-akita-728.convex.cloud`

2. **Verify frontend connection:**
   - Ensure `.env.local` has: `VITE_CONVEX_URL=https://intent-akita-728.convex.cloud`
   - For production, set as Build Time Variable in Coolify
