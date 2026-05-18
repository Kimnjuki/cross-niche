// ─────────────────────────────────────────────────────────────────────────────
// Clerk authentication configuration
// ─────────────────────────────────────────────────────────────────────────────
// Production key read from VITE_CLERK_PUBLISHABLE_KEY env var (set in Coolify)
// with dev key fallback for local development.
// ─────────────────────────────────────────────────────────────────────────────

const DEV_KEY = "pk_test_c2V0dGxpbmctb3lzdGVyLTg2LmNsZXJrLmFjY291bnRzLmRldiQ";

export const CLERK_PUBLISHABLE_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY) ||
  DEV_KEY;

export const clerkPublishableKey = CLERK_PUBLISHABLE_KEY;
export const isClerkEnabled = true;
