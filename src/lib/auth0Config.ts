// Production fallbacks ensure Auth0 always works even if Coolify fails to inject build-time vars.
const FALLBACK_DOMAIN = 'dev-8xpcd4uk1evoq05o.eu.auth0.com';
const FALLBACK_CLIENT_ID = 'db09XFkE8qzD6cJHYuuWvVnTW7kjCd8L';
const FALLBACK_AUDIENCE = 'https://dev-8xpcd4uk1evoq05o.eu.auth0.com/api/v2/';

export const auth0Domain =
  (import.meta.env.VITE_AUTH0_DOMAIN as string | undefined) || FALLBACK_DOMAIN;
export const auth0ClientId =
  (import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined) || FALLBACK_CLIENT_ID;
export const auth0Audience =
  (import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined) || FALLBACK_AUDIENCE;

export const isAuth0Enabled = true;

