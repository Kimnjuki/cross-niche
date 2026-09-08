# Coolify Traefik Labels — ACTIVE REDIRECT LOOP FIX

**Confirmed loop source:** Coolify Traefik proxy, not app code.

## Apply this in Coolify UI
1. Open Coolify → your application → **Deployments** → select current deployment → **Advanced**.
2. Find these labels and change the `middlewares=` values from `redirect-to-https` to `gzip`:
   - `traefik.http.routers.http-0-x2njvj4owio2rehys3l97m81.middlewares`
   - `traefik.http.routers.http-1-x2njvj4owio2rehys3l97m81.middlewares`
3. Delete the redirect middleware definition label if present:
   - `traefik.http.middlewares.redirect-to-https.redirectscheme.scheme=https`
4. Keep gzip middleware:
   - `traefik.http.middlewares.gzip.compress=true`
5. Save and redeploy.

## Why
Cloudflare Flexible sends HTTPS requests to origin as HTTP on port 80. If Traefik redirects that back to HTTPS, it loops forever. Use `gzip` instead so Traefik passes requests through; nginx handles direct-origin HTTP→HTTPS only when `CF-Ray` is absent.

## Verify after deploy
- `https://thegridnexus.com/` should return `200`
- `https://www.thegridnexus.com/` should return single `301` to non-www, then `200`
- No `ERR_TOO_MANY_REDIRECTS`
