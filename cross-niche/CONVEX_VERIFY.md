# Verify Supabase vs Convex Data

Before switching off Supabase and using Convex on Coolify, run this verification to ensure all migrated data matches.

## What it checks

1. **Table counts** — Row counts for:
   - `niches`, `tags`, `users`, `content`
   - `content_niches`, `content_tags`, `content_tables`

2. **Spot-checks** — Key fields match:
   - **Content**: every Supabase content slug exists in Convex (and vice versa)
   - **Niches**: every `(idNum, name)` pair from Convex exists in Supabase `(id, name)`
   - **Tags**: every `(slug, name)` pair matches between Supabase and Convex

## How to run

1. **Env** — Ensure you have:
   - **Supabase**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env` (or `.env.local`)
   - **Convex**: `VITE_CONVEX_URL` in `.env.local` (from `npx convex dev`)

2. **Convex deployed** — Run `npx convex dev` at least once so the `verify` queries are deployed.

3. **Run the script**:
   ```bash
   npm run verify:convex
   ```

4. **If Supabase is unreachable** (e.g. "fetch failed" on your machine or Coolify server):
   ```bash
   npm run verify:convex-only
   ```
   Or: `VERIFY_CONVEX_ONLY=1 npm run verify:convex` (Windows: `set VERIFY_CONVEX_ONLY=1 && npm run verify:convex`).
   This skips Supabase and only prints Convex table counts and key counts (content slugs, niches, tags). Use it to confirm Convex has the expected data when you can’t reach Supabase (e.g. after switching off Supabase, or from a restricted network).

## Output

- **All checks passed** — Exit code 0, message: *"ALL CHECKS PASSED — data matches. Safe to switch to Convex on Coolify."*
- **Any mismatch** — Exit code 1, message: *"MISMATCHES FOUND — fix discrepancies before switching off Supabase."*  
  Fix the reported counts or key mismatches (re-run import or fix Convex/Supabase data), then run the script again until it passes.

## After verification

Once `npm run verify:convex` passes:

1. Point your app (e.g. on Coolify) to Convex: set `VITE_CONVEX_URL` to your Convex deployment URL (dev or production).
2. Deploy frontend changes that read from Convex instead of Supabase (see `CONVEX_MIGRATION_CHECKLIST.md`).
3. Switch off Supabase when you are ready.
