# Ahrefs Health & SEO Deployment Notes

## Serving robots.txt and sitemaps (fix "Robots.txt is not accessible")

Static files in `public/` are copied to the root of `dist/` at build time. **Your server must serve these as static files**, not through the SPA fallback, so that:

- `GET /robots.txt` → returns `dist/robots.txt` with `Content-Type: text/plain`
- `GET /ads.txt` → returns `dist/ads.txt` with `Content-Type: text/plain` (required for AdSense)
- `GET /sitemap.xml` → returns `dist/sitemap.xml` with `Content-Type: application/xml`
- `GET /sitemap-news.xml` → returns `dist/sitemap-news.xml`

### Vercel / Netlify

- **Vercel**: `vercel.json` in the repo sets correct `Content-Type` headers for these paths.
- **Netlify**: `netlify.toml` sets headers; static files from `dist/` are served automatically.

### Nginx (e.g. Coolify, VPS)

Add **before** the SPA fallback location:

```nginx
location = /robots.txt {
    alias /path/to/dist/robots.txt;
    add_header Content-Type "text/plain; charset=utf-8";
}
location = /sitemap.xml {
    alias /path/to/dist/sitemap.xml;
    add_header Content-Type "application/xml; charset=utf-8";
}
location = /sitemap-news.xml {
    alias /path/to/dist/sitemap-news.xml;
    add_header Content-Type "application/xml; charset=utf-8";
}
location = /ads.txt {
    alias /path/to/dist/ads.txt;
    add_header Content-Type "text/plain; charset=utf-8";
}
```

### Apache

Ensure `.htaccess` or vhost does not rewrite these to `index.html`:

```apache
RewriteCond %{REQUEST_URI} ^/(robots\.txt|ads\.txt|sitemap.*\.xml)$ [NC]
RewriteRule ^ - [L]
```

## Ads platform (Google AdSense)

- **ads.txt** in `public/ads.txt` is copied to `dist/` and must be served at `https://yourdomain.com/ads.txt` with `Content-Type: text/plain`. Vercel and Netlify headers are set in `vercel.json` and `netlify.toml`. The publisher ID in `public/ads.txt` must match `src/lib/adsenseConfig.ts` and the AdSense script in `index.html` (e.g. `ca-pub-9278124025449370`). Add more lines if you use other ad networks (see [IAB ads.txt](https://iabtechlab.com/ads-txt/)).

## Sitemap and canonical (fix "Non-canonical page in sitemap")

- **Sitemap** includes only routes that exist in the app (see `scripts/generate-sitemap.mjs`). Removed: `/about`, `/contact`, `/privacy`, `/terms`, `/disclosure`, `/editorial`, `/reviews`, `/nexus-intersection` (no matching routes in `App.tsx`).
- **Canonical**: Production canonical uses `https://thegridnexus.com` so it always matches the sitemap. The default canonical was removed from `index.html`; `SEOHead` sets it per route.

After adding new routes, run:

```bash
npm run generate:sitemap
npm run generate:news-sitemap
npm run generate:all-sitemaps
```

## 404 and 4XX

- The app’s catch-all route renders a **404 page** (noindex, self-canonical). No internal links point to non-existent URLs; the sitemap only lists existing routes and Convex-backed articles.

## JavaScript (fix "Page has broken JavaScript")

- `crypto.randomUUID` is replaced with `safeRandomUUID()` where needed.
- Convex `getRelated` is only called with a valid content ID (no slug).
- `useLocalStorage` uses a stable setter to avoid infinite loops.

If Ahrefs still reports broken JS, check the reported URL and fix any runtime error or missing dependency for that page.
