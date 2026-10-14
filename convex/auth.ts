import { query, mutation } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";

/**
 * Server-side identity resolution (T02 foundation).
 *
 * The signed-in user is resolved from `ctx.auth` (the verified Clerk JWT),
 * then bound to a `users` row via the `authIdentities` join table. Never
 * trust a client-supplied userId/email — every owner-scoped function must
 * resolve identity here and derive ownership from it.
 */

export interface AuthedUser {
  /** Convex users._id */
  userId: string;
  /** Clerk subject (user id) */
  identitySubject: string;
  /** JWT issuer, e.g. https://innocent-mammoth-9790.clerk.accounts.dev */
  issuer: string;
  email?: string;
  name?: string;
}

export async function getCurrentUser(
  ctx: QueryCtx | MutationCtx
): Promise<AuthedUser | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const binding = await ctx.db
    .query("authIdentities")
    .withIndex("by_issuer_subject", (q) =>
      q.eq("issuer", identity.issuer).eq("subject", identity.subject)
    )
    .first();

  if (!binding) return null;

  const user = await ctx.db.get(binding.userId);
  if (!user) return null;

  return {
    userId: binding.userId,
    identitySubject: identity.subject,
    issuer: identity.issuer,
    email: identity.email ?? user.email,
    name: identity.name ?? user.displayName ?? user.username,
  };
}

export async function requireUser(
  ctx: QueryCtx | MutationCtx
): Promise<AuthedUser> {
  const user = await getCurrentUser(ctx);
  if (!user) throw new Error("Authentication required.");
  return user;
}

/**
 * Test probe: returns the verified identity (or null) for the caller.
 * Used to confirm the Clerk JWT → ctx.auth → authIdentities chain end-to-end.
 */
export const whoami = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { authenticated: false, reason: "no identity token" };
    }
    const user = await getCurrentUser(ctx);
    return {
      authenticated: true,
      subject: identity.subject,
      issuer: identity.issuer,
      name: identity.name,
      email: identity.email,
      boundToUser: user ? { userId: user.userId } : null,
    };
  },
});

/**
 * Provisions (or looks up) the local users row for the signed-in identity.
 * Idempotent — call it once after sign-in. Returns the Convex users._id.
 * The real identity binding lives in authIdentities; supabaseUserId is only
 * populated because the legacy users table still requires it.
 */
export const ensureUser = mutation({
  handler: async (ctx): Promise<{ userId: string; created: boolean }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Authentication required.");

    const existing = await ctx.db
      .query("authIdentities")
      .withIndex("by_issuer_subject", (q) =>
        q.eq("issuer", identity.issuer).eq("subject", identity.subject)
      )
      .first();
    if (existing) {
      return { userId: existing.userId, created: false };
    }

    const email = identity.email ?? "";
    const baseName =
      identity.nickname ??
      identity.preferredUsername ??
      (email ? email.split("@")[0] : `player_${identity.subject.slice(-6)}`);

    const userId = await ctx.db.insert("users", {
      supabaseUserId: identity.subject,
      username: baseName,
      email,
      role: "reader",
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      isActive: true,
    });

    await ctx.db.insert("authIdentities", {
      userId,
      issuer: identity.issuer,
      subject: identity.subject,
      createdAt: Date.now(),
    });

    return { userId, created: true };
  },
});
