# Convex Deployment Fix - intent-akita-728

## Issue
Deployment was going to `canny-mule-83.convex.cloud` instead of `intent-akita-728.convex.cloud`.

## Solution

### 1. Updated Deployment Scripts
Updated `package.json` scripts to ensure correct deployment:
- `deploy:convex`: Uses `CONVEX_DEPLOYMENT=intent-akita-728` environment variable
- `deploy:convex:win`: Updated for Windows CMD
- `deploy:convex:ps`: Updated for PowerShell
- `deploy:convex:explicit`: NEW - Explicitly specifies deployment name as argument

### 3. Manual Deployment (if scripts don't work)

**Option 1: Using Environment Variable (PowerShell):**
```powershell
$env:CONVEX_DEPLOYMENT='intent-akita-728'
npx convex deploy --yes
```

**Option 2: Explicit Deployment Name (Recommended):**
```powershell
npx convex deploy intent-akita-728 --yes
```

**Command Prompt:**
```cmd
set CONVEX_DEPLOYMENT=intent-akita-728
npx convex deploy --yes
```

**Or explicitly:**
```cmd
npx convex deploy intent-akita-728 --yes
```

**Linux/Mac:**
```bash
CONVEX_DEPLOYMENT=intent-akita-728 npx convex deploy --yes
```

**Or explicitly:**
```bash
npx convex deploy intent-akita-728 --yes
```

### 4. Verify Deployment

After deployment, verify:
1. Check the output - should show: `✔ Deployed Convex functions to https://intent-akita-728.convex.cloud`
2. Check [Convex Dashboard](https://dashboard.convex.dev) → Your project → Settings → Deployment URL
3. Should show: `https://intent-akita-728.convex.cloud`

### 5. Frontend Configuration

Ensure `.env.local` (for local dev) has:
```env
VITE_CONVEX_URL=https://intent-akita-728.convex.cloud
```

For production (Coolify), set as **Build Time Variable**:
- Key: `VITE_CONVEX_URL`
- Value: `https://intent-akita-728.convex.cloud`

## Next Steps

### First: Authenticate with Convex

**If you see "401 Unauthorized" or "MissingAccessToken" error:**

1. **Authenticate with Convex:**
   ```powershell
   npx convex dev
   ```
   This will:
   - Open your browser to authenticate
   - Create a `.convex` directory with auth tokens
   - You can press `Ctrl+C` to stop the dev server after authentication

2. **Or login directly:**
   ```powershell
   npx convex login
   ```

### Then: Deploy

1. **Use the env-file script (RECOMMENDED - Most Reliable):**
   ```powershell
   npm run deploy:convex:env-file
   ```
   This uses the `.convex.env` file which explicitly sets `CONVEX_DEPLOYMENT=intent-akita-728`

2. **Or use the PowerShell script:**
   ```powershell
   npm run deploy:convex:ps
   ```

3. **Or manually set environment variable:**
   ```powershell
   $env:CONVEX_DEPLOYMENT='intent-akita-728'
   npx convex deploy --yes
   ```

4. Verify deployment URL in output - should show:
   ```
   ✔ Deployed Convex functions to https://intent-akita-728.convex.cloud
   ```

5. If still deploying to wrong URL, try:
   - Run `npx convex logout` then `npx convex login` to refresh auth
   - Check if there's a `.convex` directory with cached config - delete it
   - Manually set environment variable before running deploy:
     ```powershell
     $env:CONVEX_DEPLOYMENT='intent-akita-728'
     npx convex deploy --yes
     ```
   - Check your Convex dashboard to see which deployment is currently active

## Troubleshooting

If deployment still goes to wrong URL:
1. Check if there's a `.convex` directory with cached config - delete it
2. Run `npx convex logout` then `npx convex login` to refresh auth
3. Explicitly set deployment: `npx convex deploy --prod intent-akita-728 --yes`
