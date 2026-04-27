// ─────────────────────────────────────────────────────────────────────────────
// Auth0 configuration
// ─────────────────────────────────────────────────────────────────────────────
// Production defaults are embedded here so the site works even when Coolify
// env vars don't reach Vite at build time (e.g. encrypted/hashed values).
//
// Override any value via VITE_AUTH0_DOMAIN / VITE_AUTH0_CLIENT_ID /
// VITE_AUTH0_AUDIENCE in Coolify Build Time Variables or .env.local.
// ─────────────────────────────────────────────────────────────────────────────

export const AUTH0_DOMAIN_DEV = "dev-8xpcd4uk1evoq05o.eu.auth0.com";
export const AUTH0_CLIENT_ID_DEV = "db09XFkE8qzD6cJHYuuWvVnTW7kjCd8L";
export const AUTH0_AUDIENCE_DEV = "https://dev-8xpcd4uk1evoq05o.eu.auth0.com/api/v2/";

export const auth0Domain: string =
  (import.meta.env.VITE_AUTH0_DOMAIN as string | undefined) ?? AUTH0_DOMAIN_DEV;

export const auth0ClientId: string =
  (import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined) ?? AUTH0_CLIENT_ID_DEV;

export const auth0Audience: string =
  (import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined) ?? AUTH0_AUDIENCE_DEV;

export const isAuth0Enabled =
  auth0Domain.length > 0 && auth0ClientId.length > 0;
