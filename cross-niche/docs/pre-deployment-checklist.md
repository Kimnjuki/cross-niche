# Pre-Deployment Checklist

Use this before deploying to production (e.g. thegridnexus.com).

## Build & quality

- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes (no errors)
- [ ] `npm run type-check` passes (if available)
- [ ] No uncommitted secrets in `.env` or `.env.local`

## Environment

- [ ] Production env has `VITE_CONVEX_URL` (Convex deployment URL)
- [ ] Convex deploy key set in CI/hosting for `convex deploy` (if used)
- [ ] `VITE_APP_URL` set to production URL (e.g. `https://thegridnexus.com`)

## Content & SEO

- [ ] Sitemaps generated: `npm run generate:sitemap` (or prebuild does it)
- [ ] `robots.txt` and `sitemap.xml` accessible at production URL
- [ ] Canonical and meta tags correct (no duplicate titles/descriptions)

## Post-deploy

- [ ] Homepage loads without error
- [ ] At least one article/category page loads
- [ ] No console errors (check Sentry if configured)
- [ ] Analytics (GA4) receiving events if enabled

## Rollback

If deployment fails:

1. Revert to previous commit and redeploy, or
2. Use your host’s rollback to previous deployment.

```bash
# Revert last commit and push (use with care)
git revert HEAD --no-edit
git push origin master
```
