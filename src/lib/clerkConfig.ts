// ─────────────────────────────────────────────────────────────────────────────
// Clerk authentication configuration
// ─────────────────────────────────────────────────────────────────────────────
// Publishable key is embedded directly (not via env vars) to avoid Coolify
// build-time injection issues. The secret key stays in your Clerk dashboard.
// ─────────────────────────────────────────────────────────────────────────────

export const CLERK_PUBLISHABLE_KEY =
  "pk_test_c2V0dGxpbmctb3lzdGVyLTg2LmNsZXJrLmFjY291bnRzLmRldiQ";

export const clerkPublishableKey = CLERK_PUBLISHABLE_KEY;
export const isClerkEnabled = true;
