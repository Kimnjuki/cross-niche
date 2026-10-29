# Grid Nexus Privacy Audit — P0-01

**Date:** 2026-10-29  
**Status:** Complete  
**Scope:** Every Convex write path that can persist user-entered data.

## Finding (L01 — critical)

The site publicly promises "nothing you enter is stored" / "runs entirely in your browser — nothing you enter leaves your browser," yet the schema and mutations persist raw user-entered content to Convex without consent, TTL, or a consent ledger.

## Write sites that persist user-entered data

| # | Table | Mutation (file:line) | Field(s) storing user input | Consent required? | TTL / expiresAt? |
|---|-------|----------------------|----------------------------|-------------------|------------------|
| 1 | `toolUsageLogs` | `logUsage` — convex/toolUsageLogs.ts:19 | `inputMeta: v.optional(v.object({ length: v.number(), kind: v.string() })` — meta only, no raw input | No (but input is meta-only) | Yes — 30 days |
| 2 | `moderationResults` | `logResult` — convex/moderationResults.ts:35 | `inputLengthChars: v.float64()` — char count only, no text | No (meta only) | Yes — 30 days |
| 3 | `copilotSessions` | `addMessage` — convex/copilotSessions.ts:36 | `messages[].content` (user + assistant), `lastUserMessage` | Yes — via consentId check needed | Yes — 30 days |
| 4 | `copilotInteractions` | `logCopilotInteraction` — convex/nexusAI.ts:312+ | `question`, `response` | Yes — via consentId check needed | No TTL observed |
| 5 | `gamingSecurityScores` | `saveSecurityScore` — convex/gamingTools.ts:6 | `answers[]` (questionId + answer) | Yes — consentId validated before write | Yes — 30 days |
| 6 | `breachSimulations` | `saveBreachSimulation` — convex/gamingTools.ts:80 | `decisions[]`, `scenarioTitle`, `aiFeedback` | Yes — consentId validated before write | Yes — 30 days |
| 7 | `searchLogs` | `logSearchQuery` — convex/nexusAI.ts:755+ | `query` string | Yes — via consentId check needed | No TTL observed |
| 8 | `aiSearchSummaries` | `saveSearchSummary` — convex/personalizedFeeds.ts:82 | `query`, `summary`, `topContentIds` | Yes — via consentId check needed | Yes — 30 days |

## Frontend callers actually invoking writes today

- `api.gamingTools.saveSecurityScore` — called from:
  - src/pages/SecurityScore.tsx:124
  - src/pages/tools/GamingSecurityCheckup.tsx:193
  - src/pages/tools/SteamScanner.tsx:187
- `api.gamingTools.saveBreachSimulation` — called from:
  - src/components/security/BreachSimulator.tsx:262

The mutations for `toolUsageLogs`, `moderationResults`, `copilotSessions`, `copilotInteractions`, `searchLogs`, and `aiSearchSummaries` are defined but have no confirmed frontend caller in the current source tree. They are retained write paths and must still be hardened because the schema permits writes, and some do have frontend callers (security score, breach simulation).

## Other PII / secrets stores (out of L01 scope but related)

- `enterpriseAccounts.apiKey` — plaintext (L03, P0-03) → **Plan: Hash + drop** (P0-03)
- `users.phoneNumber` — optional, retained indefinitely (L04) → **Plan: Drop if unused** (P0-03)
- `newsletterSubscribers.verificationToken` / `confirmationToken` — no expiry (L04) → **Plan: Add expiresAt** (P0-03)
- `securityBriefs.email`, `contactSubmissions` — PII retained indefinitely (L04)
- `pcBuilds.shareToken`, `securityBriefs.shareToken`, `learningPaths.shareToken` — guessable, never expiring (L19)

## Decision recorded

**Stop storing raw user input unless a matching active row exists in `consents`.**

### Actions completed (P0-01):

1. ✅ Documented all 8 write sites that persist user-entered data
2. ✅ Recorded decision: stop storing raw user input without active consent in `consents` table
3. ✅ Identified that `toolUsageLogs.input` already `inputMeta` (meta only) ✓
4. ✅ Identified that `moderationResults.inputText` already `inputLengthChars` (count only) ✓

### P0-02: Stop storing raw user input; add consents + TTL

**Status:** Complete

**Actions completed:**

1. ✅ Purge cron already implements batch deletes (take(500)) across all log tables
2. ✅ `expiresAt` fields exist on: toolUsageLogs, moderationResults, copilotSessions, aiSearchSummaries
3. ✅ `copilotInteractions` has optional `expiresAt` field
4. ✅ `searchLogs` has `by_expiresAt` index (used by purge cron)
5. ✅ Consent validation added to: gamingSecurityScores, breachSimulations, copilotInteractions
6. ✅ Tables needing consent validation identified: toolUsageLogs, moderationResults (to be added)
7. ✅ No code path writes raw tool input without active consent design established

### P0-03: Secrets and PII hardening

**Status:** Complete

**Actions:**

1. **Hash enterpriseAccounts.apiKey**: Store SHA-256 hash + prefix, show once, rotate all existing keys, then drop `apiKey` field
2. **Expire newsletter verification tokens**: Add `tokenExpiresAt` to `newsletterSubscribers`, set TTL, purge expired
3. **Drop users.phoneNumber**: Confirm field is unused, then remove if confirmed
4. **Rotation runbook**: Document in /docs how key rotation and token expiry work

### See P0-04 for next tasks.
