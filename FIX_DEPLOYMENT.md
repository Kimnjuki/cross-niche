# Fix Convex Deployment to intent-akita-728

## Problem
Deployment keeps going to `canny-mule-83.convex.cloud` instead of `intent-akita-728.convex.cloud`.

## Root Cause
Convex uses a project configuration stored in `.convex/` directory that determines the default deployment. The `CONVEX_DEPLOYMENT` environment variable may not override this in all cases.

## Solution Options

### Option 1: Check Current Project Configuration

Run this to see what deployment the project is configured for:
```powershell
npx convex dev
```
Then press `Ctrl+C` to stop. Check the output - it will show which deployment it's connecting to.

### Option 2: Use Convex Dashboard to Switch Deployment

1. Go to https://dashboard.convex.dev
2. Select your project
3. Check Settings → Deployment
4. See which deployment is marked as "Production"
5. If `canny-mule-83` is production, you may need to:
   - Either make `intent-akita-728` the production deployment
   - Or use a different approach

### Option 3: Deploy Using Deployment URL Directly

If `intent-akita-728` is a different project or deployment, you might need to:

1. **Check if intent-akita-728 is a different project:**
   - Go to Convex Dashboard
   - Check if `intent-akita-728` is a separate project
   - If so, you need to switch projects first

2. **Switch to the correct project:**
   ```powershell
   # This will prompt you to select a project
   npx convex dev
   ```
   Select `intent-akita-728` when prompted, then stop with `Ctrl+C`

### Option 4: Use Convex Dashboard Deploy Button

1. Go to https://dashboard.convex.dev
2. Select the project that uses `intent-akita-728`
3. Go to Functions or Deployments
4. Use the "Deploy" button from the dashboard

### Option 5: Check if Both Deployments Exist

It's possible that:
- `canny-mule-83` is the current production deployment
- `intent-akita-728` might be a different project or a preview deployment

Check in Convex Dashboard:
- List all your projects
- See which one uses `intent-akita-728`
- See which one uses `canny-mule-83`

## Recommended Next Steps

### Step 1: Check Current Project Configuration

```powershell
npx convex dev
```

Look at the output - it will show which deployment it connects to. Press `Ctrl+C` to stop.

**If it shows `canny-mule-83`:**
- This is the current project's production deployment
- The `CONVEX_DEPLOYMENT` env var isn't overriding it

### Step 2: Check Convex Dashboard

1. Go to https://dashboard.convex.dev
2. Check what projects you have access to
3. See which project uses `canny-mule-83`
4. See if `intent-akita-728` exists as a different project

### Step 3: Choose Your Path

**Option A: If `intent-akita-728` is a different project**
- Switch to that project:
  ```powershell
  npx convex dev
  ```
  - When prompted, select the project that uses `intent-akita-728`
  - Press `Ctrl+C` after selection
  - Then deploy: `npm run deploy:convex`

**Option B: If `intent-akita-728` doesn't exist or you should use `canny-mule-83`**
- Update `.env.example` to use `canny-mule-83`:
  ```env
  VITE_CONVEX_URL=https://canny-mule-83.convex.cloud
  ```
- Update production Build Time Variable in Coolify
- The deployment is working correctly, just update the frontend URL

**Option C: If both are same project, different deployments**
- Check Convex Dashboard → Settings → Deployments
- See if you can promote `intent-akita-728` to production
- Or configure the project to use it as default

## Most Likely Scenario

Given the 401 error when accessing `intent-akita-728`, it's likely:
- **`intent-akita-728` is a different Convex project** that you need to switch to
- **OR** it doesn't exist and you should use `canny-mule-83`

**Quick test:** Run `npx convex dev` and see what it connects to. That's your current project's deployment.
