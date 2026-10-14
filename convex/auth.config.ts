// ─────────────────────────────────────────────────────────────────────────────
// Convex authentication configuration (server-side identity).
//
// Enables ctx.auth.getUserIdentity() so the backend resolves the signed-in
// user from the Clerk-issued JWT — never from a client-supplied userId/email.
//
// Requires a Clerk JWT template named "convex" (audience claim = "convex")
// in the Clerk dashboard. See https://docs.convex.dev/auth/clerk
// ─────────────────────────────────────────────────────────────────────────────
export default {
  providers: [
    {
      domain: "https://innocent-mammoth-9790.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
