# How to Find Which Deployment npx convex dev is Connected To

## From Your Terminal Output

I can see `npx convex dev` is running successfully, but the deployment URL isn't visible in the snippet shown.

## Ways to Find the Deployment URL

### Method 1: Check Earlier in Terminal Output
When `npx convex dev` first starts, it usually shows a line like:
```
✔ Connected to deployment: https://[deployment-name].convex.cloud
```
or
```
Deployment URL: https://[deployment-name].convex.cloud
```

**Scroll up in your terminal** to see the initial startup messages.

### Method 2: Check if Browser Opened
`npx convex dev` often opens a browser window. Check:
- The browser URL bar
- Or look for a message like "Opening dashboard at..."

### Method 3: Check Convex Dashboard Directly
1. Go to https://dashboard.convex.dev
2. Look at the active project (the one that's selected)
3. Check **Settings → Deployment URL**
4. That's what `npx convex dev` is connected to

### Method 4: Stop Dev and Check
1. Press `Ctrl+C` in the terminal to stop `npx convex dev`
2. Look at the final output - it might show the deployment URL
3. Or run: `npx convex dashboard` to open the dashboard

## What We Need to Know

**Please check one of these:**

1. **Scroll up in terminal** - look for "Connected to deployment" or "Deployment URL"
2. **Check Convex Dashboard** - https://dashboard.convex.dev → Settings → Deployment URL
3. **Check browser** - if `npx convex dev` opened a browser, check that URL

Once we know which deployment `npx convex dev` is connected to, we can:
- If it's `canny-mule-83`: Update frontend URL OR switch to `intent-akita-728` project
- If it's `intent-akita-728`: Great! Just need to fix the deployment command
- If it's something else: We'll figure out the next steps

## Quick Action

**Easiest way:** Go to https://dashboard.convex.dev and check:
- Which project is currently active?
- What's the Deployment URL shown in Settings?

That will tell us exactly what's configured.
