# PowerShell Environment Setup for Convex Deployment

**Last Updated:** 2026-02-06

---

## ⚡ Quick Fix for Current Session

To get deployment working **right now** in your current PowerShell terminal, set the environment variable explicitly:

```powershell
$env:CONVEX_DEPLOY_KEY = "dev:intent-akita-728|eyJ2MiI6IjYzZjcxNzE0ZjI0MjQ3NzU5NmNhZDZhOTgwMGI1Yzk1In0="
```

**Important:** Use quotes because `|` is a PowerShell pipe operator. Without quotes, PowerShell will try to pipe the value.

---

## ✅ Automatic Environment Loading

The `package.json` scripts now automatically load environment variables from `.env.local` and `.env` files using Node's built-in `--env-file` flag (Node 20+).

### Updated Scripts

```json
{
  "predeploy:convex": "node --env-file=.env.local --env-file=.env scripts/check-convex-deploy-key.mjs",
  "deploy:convex": "npm run predeploy:convex && npx convex deploy --yes",
  "verify:convex-config": "node --env-file=.env.local --env-file=.env scripts/verify-convex-config.mjs"
}
```

**How it works:**
- Node automatically loads variables from `.env.local` first (if exists)
- Then loads from `.env` (if exists)
- Environment variables are available to the script
- No need to manually export variables

---

## 📋 Setup Steps

### 1. Create `.env.local` File

Copy `.env.example` to `.env.local`:

```powershell
Copy-Item .env.example .env.local
```

### 2. Set CONVEX_DEPLOY_KEY in `.env.local`

Open `.env.local` and ensure it contains:

```env
VITE_CONVEX_URL=https://intent-akita-728.convex.cloud
CONVEX_DEPLOY_KEY=dev:intent-akita-728|eyJ2MiI6IjYzZjcxNzE0ZjI0MjQ3NzU5NmNhZDZhOTgwMGI1Yzk1In0=
```

### 3. Deploy

```powershell
npm run deploy:convex
```

The script will automatically:
1. Load environment variables from `.env.local`
2. Run pre-deployment safety check
3. Deploy to Convex

---

## 🔍 Verification

### Check Environment Variables Are Loaded

```powershell
# Run the check script manually
node --env-file=.env.local --env-file=.env scripts/check-convex-deploy-key.mjs
```

**Expected Output:**
```
🔍 Pre-deployment safety check...

✅ CONVEX_DEPLOY_KEY is set and valid
✅ CONVEX_DEPLOY_KEY format: dev:intent-akita-728
✅ VITE_CONVEX_URL: https://intent-akita-728.convex.cloud
✅ All safety checks passed - deployment can proceed
```

---

## 🚨 Troubleshooting

### Error: CONVEX_DEPLOY_KEY is not set

**Cause:** `.env.local` doesn't exist or doesn't contain `CONVEX_DEPLOY_KEY`

**Fix:**
1. Create `.env.local` from `.env.example`
2. Add `CONVEX_DEPLOY_KEY` with your deploy key
3. Ensure format is correct: `dev:intent-akita-728|...` or `prod:...`

---

### Error: Cannot find module or file

**Cause:** Node version < 20 (--env-file flag requires Node 20+)

**Fix:**
```powershell
# Check Node version
node --version

# Should be v20.0.0 or higher
# If not, update Node.js
```

---

### PowerShell: Pipe Operator Error

**Cause:** Setting variable without quotes in PowerShell

**Fix:**
```powershell
# Wrong (no quotes - PowerShell treats | as pipe)
$env:CONVEX_DEPLOY_KEY = dev:intent-akita-728|...

# Correct (with quotes)
$env:CONVEX_DEPLOY_KEY = "dev:intent-akita-728|..."
```

---

## 💡 Best Practices

1. **Use `.env.local` for local development**
   - Add to `.gitignore` (already done)
   - Contains your actual deploy keys
   - Never commit to git

2. **Use `.env.example` as template**
   - Commit to git
   - Documents required variables
   - No actual secrets

3. **Set in PowerShell session (temporary)**
   - Only for current terminal session
   - Lost when terminal closes
   - Use `.env.local` for persistence

---

## 📚 Related Documentation

- `CONVEX_ENVIRONMENT_DRIVEN_SETUP.md` - Complete setup guide
- `COOLIFY_CONVEX_SETUP.md` - Coolify-specific setup
- `.env.example` - Environment variable template

---

## ✅ Quick Reference

| Task | Command |
|------|---------|
| Set for current session | `$env:CONVEX_DEPLOY_KEY = "dev:intent-akita-728\|..."` |
| Create .env.local | `Copy-Item .env.example .env.local` |
| Deploy | `npm run deploy:convex` |
| Verify config | `npm run verify:convex-config` |
| Check manually | `node --env-file=.env.local scripts/check-convex-deploy-key.mjs` |

---

**✅ Environment loading is now automatic!**

Just ensure `.env.local` exists with your `CONVEX_DEPLOY_KEY`, and `npm run deploy:convex` will work automatically.
