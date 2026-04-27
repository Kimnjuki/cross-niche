// Hardcoded fallback ensures Clerk always initialises even if Coolify fails
// to inject VITE_CLERK_PUBLISHABLE_KEY at build time.
// CLERK_SECRET_KEY is server-side only — never embed it here.
const FALLBACK_PUBLISHABLE_KEY =
  'pk_test_c2V0dGxpbmctb3lzdGVyLTg2LmNsZXJrLmFjY291bnRzLmRldiQ';

export const clerkPublishableKey =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ||
  FALLBACK_PUBLISHABLE_KEY;

