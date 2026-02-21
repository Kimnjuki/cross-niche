# Convex Deployment Guide

## Official Production Deployment

**Production URL:** `https://intent-akita-728.convex.cloud`

This is the official Convex deployment URL used in production. The `intent-akita-728` deployment serves all production traffic.

## Deployment Commands

### Deploy to Production (intent-akita-728)

**Standard (cross-platform):**
```bash
npm run deploy:convex
```

**Windows Command Prompt:**
```bash
npm run deploy:convex:win
```

**Windows PowerShell:**
```bash
npm run deploy:convex:ps
```

**Manual (if scripts don't work):**
```bash
# Windows CMD
set CONVEX_DEPLOYMENT=intent-akita-728 && npx convex deploy --yes

# Windows PowerShell
$env:CONVEX_DEPLOYMENT='intent-akita-728'; npx convex deploy --yes

# Linux/Mac
CONVEX_DEPLOYMENT=intent-akita-728 npx convex deploy --yes
```

This command:
- Sets `CONVEX_DEPLOYMENT=intent-akita-728` environment variable
- Uses `--yes` flag to skip confirmation prompts
- Deploys to `intent-akita-728` deployment

**Note:** The `--yes` flag automatically answers "yes" to any prompts, and the `CONVEX_DEPLOYMENT` environment variable tells Convex which deployment to use. This bypasses the prompt about `canny-mule-83`.

### Deploy to Dev (if needed)

```bash
npm run deploy:convex:dev
```

## Environment Configuration

### Local Development (.env.local)

```env
CONVEX_DEPLOYMENT=intent-akita-728
VITE_CONVEX_URL=https://intent-akita-728.convex.cloud
```

### Production Build (Coolify)

Set as **Build Time Variable** in Coolify:

| Key | Value |
|-----|-------|
| `VITE_CONVEX_URL` | `https://intent-akita-728.convex.cloud` |

## Important Notes

1. **intent-akita-728 is Production**: This deployment is configured as the production/official deployment, not dev.

2. **Old Deployment (canny-mule-83)**: If Convex CLI asks about deploying to `canny-mule-83`, answer **"n"** (no). This is an old production deployment that should not be used.

3. **Always Use npm Scripts**: Use `npm run deploy:convex` instead of running `npx convex deploy` directly to ensure the correct deployment is targeted.

4. **Verification**: After deployment, verify the deployment URL in the [Convex Dashboard](https://dashboard.convex.dev):
   - Go to your project → Settings → Deployment URL
   - Confirm it shows `https://intent-akita-728.convex.cloud`

## Troubleshooting

### "Do you want to push to canny-mule-83?"

**Answer: No (n)**

The old `canny-mule-83` deployment should not be used. Always deploy to `intent-akita-728`.

### Deployment URL Mismatch

If your app is not connecting to Convex:

1. Check `.env.local` has `VITE_CONVEX_URL=https://intent-akita-728.convex.cloud`
2. Check Coolify Build Time Variables include `VITE_CONVEX_URL`
3. Verify the Convex Dashboard shows `intent-akita-728` as active
4. Hard refresh browser (`Ctrl+F5` / `Cmd+Shift+R`)

### Missing Script Error

If you see `npm error Missing script: "deploy:convex"`:

1. Make sure you're in the project root directory
2. Run `npm install` to ensure all dependencies are installed
3. Check `package.json` includes the `deploy:convex` script

### 'cross-env' is not recognized (Windows)

If you see `'cross-env' is not recognized as an internal or external command`:

1. Run `npm install` to install `cross-env` (it's in devDependencies)
2. Or use the Windows-specific scripts:
   - Command Prompt: `npm run deploy:convex:win`
   - PowerShell: `npm run deploy:convex:ps`
3. Or manually set the environment variable (see Manual commands above)
