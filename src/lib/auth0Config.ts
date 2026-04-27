// ─────────────────────────────────────────────────────────────────────────────
// Auth0 configuration
// ─────────────────────────────────────────────────────────────────────────────
// Credentials are embedded directly into code to eliminate env-var passthrough
// failures (Coolify encrypts/hashes env vars, stale values override at build).
//
// The Dockerfile deliberately does NOT declare VITE_AUTH0_* as ARG/ENV,
// so Coolify Build Time Variables cannot inject old or corrupted values.
// ─────────────────────────────────────────────────────────────────────────────

export const AUTH0_DOMAIN_DEV = "dev-8xpcd4uk1evoq05o.eu.auth0.com";
export const AUTH0_CLIENT_ID_DEV = "db09XFkE8qzD6cJHYuuWvVnTW7kjCd8L";
export const AUTH0_AUDIENCE_DEV = "https://dev-8xpcd4uk1evoq05o.eu.auth0.com/api/v2/";

// Hardcoded — not read from env. See Dockerfile comment for rationale.
export const auth0Domain: string = AUTH0_DOMAIN_DEV;
export const auth0ClientId: string = AUTH0_CLIENT_ID_DEV;
export const auth0Audience: string = AUTH0_AUDIENCE_DEV;

export const isAuth0Enabled =
  auth0Domain.length > 0 && auth0ClientId.length > 0;
