# The Grid Nexus — Combined Growth Plan

Merges the two strategy documents (player-first "trust layer" + developer-led growth)
into one thesis, validates each point against the current codebase, and specifies
implementation approaches for every core feature/tool.

**Current state (verified 2026-10-20):** 14 game pages · 7 platform hubs · 56 recovery
pages (8 scenarios × 7 platforms) · 22 on-niche articles · weekly `/threats` report
(1,741 CVEs) · scam-triage parser at `src/lib/triage` + checkup evaluator at
`src/lib/checkup` · a `/tools/scam-check` static shell · East Africa as a single article.
No `/developers/`, no `/africa/` hub, no open-source repos, no interactive scam checker.

---

## 1. Unified thesis

The two documents are not competing strategies — they are one flywheel seen from two
sides:

> **The Grid Nexus is the trust layer for gaming.** Players check "is this safe?" before
> downloading, trading, logging in, or recovering. Developers adopt open-source security
> tooling to *build* safer games. Both feed a single threat-data asset that neither
> generic security blogs nor developer-only anti-cheat sites can replicate.

The moat is the **trust graph**: player trust (verdicts) → developer utility (tooling) →
open-source distribution (stars/backlinks) → SEO authority (structured data, original
data) → more players and developers. Each node reinforces the others.

---

## 2. Three connected assets (the "winning formula")

1. **Trust database** — "Is this game / mod / seller / site safe?" (verdict pages).
2. **Emergency utility** — "My account was compromised — what do I do now?" (recovery +
   scam triage).
3. **Live intelligence** — "What new gaming threats should I know today?" (threat report +
   daily brief).

A fourth layer, from the developer document, feeds all three:

4. **Developer & open-source layer** — practical implementation guidance + reusable
   tooling that earns technical trust and backlinks, without diluting player trust.

---

## 3. Opportunity validation ("check all the points")

Each opportunity from the two docs, checked against the actual repo.

| # | Opportunity | Current state | Gap to close | Priority |
|---|---|---|---|---|
| 1 | "Is it safe?" database (games/mods/sites/sellers) | Game pages have grades, but **no** structured "is X safe" verdict pages for mods, sites, cheat tools, sellers, Discord servers | Build templated verdict pages + Convex table | **P0** |
| 2 | Recovery conversion engine | 56 pages exist (8×7), now render 5-step playbooks | Add "act in 10 minutes" checklist, "never pay a third party" trust module, FAQ/HowTo schema | **P0** (upgrade) |
| 3 | Scam Checker (interactive triage) | `src/lib/triage` parser + `/tools/scam-check` shell exist | Wire into a real form: paste URL/game/mod/Discord invite → verdict + red flags + official alternative | **P0** |
| 4 | Layered threat intelligence | Weekly `/threats` (1,741 CVEs) | Daily brief, incident alerts, platform-status page, exploited-CVE watchlist | **P1** |
| 5 | East Africa hub | Single article (`eastAfricaGamingSecurityArticle.ts`) | Dedicated `/africa/gaming-security/` hub + sub-pages | **P1** |
| 6 | Content clusters | 22 articles exist, unlinked into clusters | Internal-link topology (pillar → supporting → tool) | **P1** |
| 7 | Developer hub + checklists | Nothing | `/developers/` hub + 6 downloadable assets | **P1** |
| 8 | Open-source projects (GridGuard/ModSafety/…) | Nothing | One repo (ModSafety) first | **P2** |
| 9 | Original data reports | None | Quarterly link-magnet reports | **P2** |
| 10 | Distribution (Discord alerts) | None (YouTube/newsletter are user-owned) | Discord scam-alerts community | **P2** |
| 11 | Open-core monetization | ads.txt trimmed to Google-only; no affiliate | Defer until adoption proves demand | **P3** |

**Highest-leverage, lowest-risk first: #1, #2, #3.** All three reuse existing assets
(`platform-security.json` scam patterns, the triage lib, the 56 recovery pages) and
target high-intent decision-stage searches.

---

## 4. Core features & tools — implementation approaches

### 4.1 "Is it safe?" database (P0)

**What.** Structured verdict pages for every meaningful gaming asset — games, launchers,
mod sites, cheat tools, private servers, VPNs, skin marketplaces, Discord servers,
"free skin" links.

**Data model** — new Convex table `safetyVerdicts`:
```
slug, assetType (game|launcher|mod|modsite|cheat|marketplace|vpn|discord|seller),
assetName, verdict (safe|cautious|avoid), riskLevel (0-4),
officialSource, scamPatterns[], malwareHistory[], protectionsRequired[],
whatToDoIfCompromised, lastVerified, sources[]
```

**Page template.** A static-shell generator (mirror `scripts/generate-game-pages.mjs`)
that emits `/safety/{slug}` (or `/is-safe/{slug}`) with: verdict badge, risk level,
official download source, known scam patterns, malware/account-theft history, required
protections, "what to do if compromised", last-verified date, sources. Reuse the
noindex-vs-index KEEP list and Kim Njuki byline pipeline already built.

**SEO.** Target `is [X] safe`, `[X] scam`, `[X] malware`, `[X] legit`. Add `SoftwareApplication`
or `WebPage` schema with `review`/`riskRating`. Seed with the highest-search assets
(fake game sites, cheat-tool malware, free-skin Discord scams, skin marketplaces).

**Relationship to other features.** Each verdict page links to the relevant recovery
guide (#2) and the scam checker (#3) — the internal-link flywheel.

### 4.2 Recovery conversion engine (P0 — upgrade)

**What.** Turn the existing 56 pages from "helpful checklist" into a conversion surface.

**Add per page:**
- "Act in the next 10 minutes" ordered checklist (already ~5 steps; add time urgency).
- "Never pay a third party to recover your account" module — signature trust element.
- FAQPage + HowTo structured data (schema.org).
- A single CTA: "Run the checkup" or "Join scam alerts".

**Data.** Already in `src/data/recovery-playbooks.json`; enrich with `urgentSteps[]`,
`revokeSessions`, `backupCodes`, `evidenceToPrepare`, `fakeRecoveryScamWarning`.

**Open-source spin-off (GridRecovery).** Export the runbooks as Markdown/YAML in a repo
so developers and community can reuse/contribute — no proprietary data exposed.

### 4.3 Scam Checker (P0)

**What.** Interactive triage: paste a game/mod name, Discord invite, marketplace/seller
name, URL, or support-message text → risk verdict + red flags + official alternative +
recommended action + "report here" links.

**Implementation.**
- **V1 (rules-based, no API):** extend `src/lib/triage` with heuristics — known scam
  domains, suspicious URL patterns (punycode, typosquats, `free-*`), urgency language,
  requests for credentials/MFA/Steam Guard codes, "free skin/cheat" signals, unsupported
  payment methods. Client-side React form → verdict. No secrets, no backend needed.
- **V2 (reputation):** Convex action calls URLScan / VirusTotal / NVD (keys already in
  Convex env) for URL/file reputation; hash lookup for known-malicious files.
- **Surface:** replace the `/tools/scam-check` static shell with a React route
  (`<Route path="/tools/scam-check" element={<ScamChecker />} />`) + a static shell for
  SEO.

**This is the top link-magnet:** players share it when warning friends.

### 4.4 Layered threat intelligence (P1)

**What.** Move `/threats` from weekly to layered: daily brief, incident alerts,
platform-status page, exploited-vulnerability watchlist, weekly deep report.

**Implementation.**
- Convex **cron job** pulls NVD + CISA KEV daily, transforms each CVE into plain-English
  player questions: *Which games are affected? Can attackers steal my account? Update /
  change password / revoke sessions?*
- Store in a `threatIntel` table; generate a daily static page + feed.
- Reuse the KEV triage logic already built (commit `c0adcf7` IOCLookup triage).

**Differentiator:** never report CVEs like a generic security site — translate each into
player action.

### 4.5 East Africa hub (P1)

**What.** Dedicated `/africa/gaming-security/` hub with sub-pages: M-Pesa payment scams,
fake APK / mod APK risks, SIM-swap defense for gamers, mobile-money phishing via
giveaways, gaming-café security, Swahili-localized guides.

**Implementation.** Same pipeline as `threatGuides.ts` → `upsertThreatGuides.ts` →
static generator. A data file `src/data/africaGuides.ts` + a hub generator emitting
`/africa/gaming-security/*`. Low competition, concrete local threats.

### 4.6 Developer hub + checklists (P1)

**What.** `/developers/` hub with 6 downloadable assets:
1. Game Security Launch Checklist
2. Player Account Security Baseline
3. API Abuse Prevention Starter Kit
4. Marketplace & Trading Fraud Checklist
5. Game Security Threat Model Template (STRIDE-style)
6. Incident Response Runbook

**Implementation.**
- Checklists as Markdown/YAML in `public/developer-assets/` (or a `/developers/*`
  static section) with a download link — zero code, maximal value.
- Hub page as a static shell (`scripts/generate-developer-hub.mjs`) or React route.
- Add `SoftwareApplication`/`TechArticle` schema.
- Developer SEO articles target implementation keywords (rate limiting, secure auth,
  account-takeover prevention) and link to the open-source repos + player pages.

### 4.7 Open-source projects (P2)

**What.** Open-source the reusable components, keep the hosted intelligence proprietary.
Start with **one**: **ModSafety** — URL/file reputation rules + hash checking + static
risk heuristics + community reports. It directly reuses the scam-triage logic (#3) and
feeds the "Is it safe?" database (#1).

**Repo standards** (from the doc): one-sentence value prop, GIF/demo, <5-min quickstart,
threat model, Unity/Unreal/Node/Go/Python examples, roadmap, contributing guide, code of
conduct, security-disclosure policy, license, link back to `/developers/`.

**Second project:** GridGuard (API rate-limiting + request-signing + anomaly-event
schema) — the developer-funnel anchor.

### 4.8 Original data reports (P2)

**What.** Quarterly link magnets: Gaming Scam Exposure Index, State of Gamer Account
Security, Malicious Mod Report, East Africa Gaming Threat Report, Anti-Cheat Trust
Report, Recovery Success Report.

**Implementation.** Aggregate from the Convex tables (safetyVerdicts, threatIntel,
recovery) → publish as an article page + downloadable PDF. Original data → citations →
backlinks → authority.

### 4.9 Content clusters & SEO taxonomy (P1)

**What.** Entity taxonomy `/games/`, `/platforms/`, `/scams/`, `/recover/`, `/tools/`,
`/threats/`, `/africa/`, `/developers/`. Structured data everywhere. Internal links from
every article → grade → recovery guide → checklist → tool.

**Clusters:** account-takeover, malicious-downloads, marketplace/trading,
competitive-player, africa/mobile, developer-security.

---

## 5. Merged 90-day roadmap

**Days 1–30 — core assets (P0):**
1. Ship the "Is it safe?" database with 15–20 seed verdict pages + Convex table.
2. Ship the interactive Scam Checker V1 (rules-based, no API).
3. Upgrade the 56 recovery pages (10-min checklist + "never pay a third party" + FAQ/HowTo schema).
4. Publish a methodology page for security grades.

**Days 31–60 — topical authority (P1):**
5. Launch `/developers/` hub + 6 checklists.
6. Publish 10 developer SEO articles.
7. Launch `/africa/gaming-security/` hub + 4–6 sub-pages.
8. Stand up the daily threat brief (Convex cron + NVD/CISA).
9. Build internal-link templates (article → grade → recovery → tool).

**Days 61–90 — scale (P2):**
10. Open-source ModSafety (first repo) + 48-hour launch.
11. Publish the first original data report.
12. Launch a Discord scam-alerts community.
13. Add email capture to every grade, recovery guide, and tool.
14. Begin affiliate testing with trust-compatible security products only.

---

## 6. North-star metrics (weekly)

- **Trust DB coverage:** verdict pages published; "% of top-100 asset queries covered".
- **Scam Checker:** sessions, share rate, "verdict returned" completions.
- **Recovery:** recovery-page CTR, internal-link click-through to checkup.
- **Organic:** non-brand clicks, impressions, top-10 keyword count (esp. "is X safe").
- **Developer:** checklist downloads, repo stars/forks, contributors, installs.
- **Revenue readiness:** affiliate clicks, API signups, audit inquiries.

---

## 7. What not to do (trust guardrails — already in force)

- Never rank game safety from review sentiment; verdicts are evidence-based with
  `last_verified` + sources.
- Never call an unknown file/hash "clean".
- Never publish unverified victim allegations.
- No casino / skin-gambling / account-selling sponsorships — trust is the product.
- Keep the honest Kim Njuki byline; no fabricated personas or invented data.
