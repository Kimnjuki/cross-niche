# The Grid Nexus — Data Flow Diagram (T01)

**Date**: 2026-11-24  
**Scope**: Player-facing security tools and data processing

---

## 1. Anonymous Self-Assessment Flow (SteamScanner)

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Browser   │────▶│ sessionStorage│────▶│   Results UI     │
│  (React)    │     │  (gnx_steam_  │     │  (pct, band,     │
│             │     │  _scan_session)│    │   action plan)   │
└─────────────┘     └──────────────┘     └──────────────────┘
      │                    │                       │
      │                    │                       │
      ▼                    ▼                       ▼
  No network         No server              No persistence
  requests           persistence            beyond session
```

**Data Collected**: None (answers stored in memory + sessionStorage only)  
**Identifiers**: Random UUID sessionId (not linked to user)  
**Third Parties**: None  

---

## 2. Multi-Platform Checkup Flow (GamingSecurityCheckup)

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Browser   │────▶│ sessionStorage│────▶│   Results UI     │
│  (React)    │     │ (gnx_gaming_  │     │  (pct, tier,     │
│             │     │  _checkup_    │     │   action plan)   │
│             │     │  session)     │     └────────┬─────────┘
└─────────────┘     └──────────────┘              │
      │                    │                      │ (optional)
      │                    │                      ▼
      │                    │              ┌──────────────┐
      │                    │              │  Convex      │
      │                    └────────────▶│ saveSecurity │
      │                       consentId  │  Score       │
      │                                  └──────┬───────┘
      │                                         │
      ▼                                         ▼
┌─────────────┐                         ┌──────────────┐
│   Clerk     │                         │ gamingSecurity│
│  (if auth)  │                         │   Scores     │
└─────────────┘                         │ (30-day TTL)  │
                                        └──────────────┘
```

**Data Collected** (only with consent):
- Answers (questionId + yes/no/unknown)
- Score (total, max, percent, band)
- SessionId, optional userId, consentId
- Platform, gameSlug

**Identifiers**: sessionId (UUID), optional Clerk userId  
**Retention**: 30 days (expiresAt)  
**Third Parties**: Convex (backend), Clerk (auth)  

**Consent Gap**: Current code calls `saveSecurityScore` with `userId` from Clerk auth but `consentId` is optional. No consent UI shown before save.

---

## 3. Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Browser   │────▶│   Clerk     │────▶│   Convex     │
│  (Clerk     │     │  (hosted    │     │  authIdentities│
│   React)    │     │   auth UI)  │     │  (issuer +    │
│             │     │             │     │   subject)   │
└─────────────┘     └─────────────┘     └──────┬───────┘
      │                                        │
      │           ┌────────────────────────────┘
      │           │
      ▼           ▼
┌─────────────────────────────┐
│  Convex ctx.auth (validated) │
│  → userId for mutations      │
└─────────────────────────────┘
```

**Data Stored in Convex `users` table**:
- Clerk `supabaseUserId` (UUID)
- username, email, displayName
- role, isPremium, lifecycleStage
- PII: location, website, social links
- Public profile flags

**Third Parties**: Clerk (identity provider)

---

## 4. Analytics & Ads Flow

```
┌─────────────┐     ┌──────────────┐
│   Browser   │────▶│   GA4        │
│  (GA4Page   │     │  (Google)    │
│   Tracker)  │     │              │
└─────────────┘     └──────────────┘
      │
      ├──────────────────┐
      ▼                  ▼
┌─────────────┐     ┌──────────────┐
│  AdSense    │     │  Adsterra    │
│  (Google)   │     │  (Popunder/  │
│             │     │   Native)    │
└─────────────┘     └──────────────┘
```

**Data Shared**:
- GA4: page views, events, user pseudonymous ID
- AdSense: cookies for personalized ads, page context
- Adsterra: IP, user agent, page URL

**Consent**: `CookieConsent` component present but integration with GA4/Ads not verified

---

## 5. Content & Threat Intelligence Flow

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Admin/    │────▶│   Convex     │────▶│   Public Site    │
│   Ingestion │     │   (content,  │     │   (SSR + Static) │
│   Scripts   │     │   articles,  │     │                  │
└─────────────┘     │   threatIntel)│     └──────────────────┘
                    └──────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Search   │  │ Sitemap  │  │  RSS/    │
        │ (Algolia)│  │ Generator│  │  Feed    │
        └──────────┘  └──────────┘  └──────────┘
```

**Data Sources**:
- Manual content (CMS)
- Automated ingestion (NewsAPI, GNews, NVD CVEs)
- Community threat reports (user submissions)

**Third Parties**: Algolia (search), NewsAPI, GNews, NVD

---

## 6. Community Threat Reports Flow

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   Browser   │────▶│   Convex     │────▶│  Moderation      │
│  (User)     │     │ community    │     │  Queue (pending/ │
│             │     │ ThreatReports│     │  verified/       │
└─────────────┘     └──────────────┘     │  dismissed)      │
      │                    │             └──────────────────┘
      │                    │                      │
      ▼                    ▼                      ▼
  Optional           Stored with:            Admin review
  displayName        - userId (opt)           → verify/dismiss
                     - platform, severity     → link to threatIntel
                     - threatType
                     - evidence (URL/text)
```

**Data Collected**: User-provided title, description, platform, severity, threatType, evidence URL  
**Identifiers**: Optional userId, optional displayName ("Anonymous" if not provided)  
**Moderation**: Status field (pending/verified/dismissed), verifiedByAdmin flag  
**Gap**: No moderation UI observed; no spam/abuse controls; no reporter safety controls

---

## 7. Data Inventory Summary

| Data Category | Source | Storage | Retention | Legal Basis | Shared With |
|---------------|--------|---------|-----------|-------------|-------------|
| Checkup answers (anon) | Browser | sessionStorage | Session | Legitimate interest (tool function) | None |
| Checkup scores (opt-in) | Browser → Convex | gamingSecurityScores | 30 days | Consent | Convex |
| Auth identity | Clerk | users, authIdentities | Account lifetime | Contract | Clerk, Convex |
| Analytics events | Browser | GA4 | 14-26 months | Consent | Google |
| Ad cookies | Browser | AdSense/Adsterra | Varies | Consent | Google, Adsterra |
| Community reports | Browser → Convex | communityThreatReports | Until moderated | Legitimate interest | Convex, moderators |
| Content/articles | Admin/scripts | Convex content | Indefinite | Legitimate interest | Public, Algolia |

---

## 8. Cross-Border Transfers

| Data | Origin | Destination | Mechanism |
|------|--------|-------------|-----------|
| Auth tokens | User browser | Clerk (US) | Standard contractual clauses |
| Analytics | User browser | Google (US) | EU-US Data Privacy Framework |
| Ads | User browser | Google/Adsterra (US/Global) | Consent + SCCs |
| Backend data | Convex (US) | Vercel (US) | Same region |

**Kenya ODPC Applicability**: Site targets East Africa content; if Kenyan users' data processed, ODPC guidance (S15, S16) applies — requires DPIA assessment.

---

## 9. Deletion / Rights Flow

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   User      │────▶│  Email to    │────▶│  Manual Convex   │
│  Requests   │     │  kimnjuki2@  │     │  Deletion by     │
│  (access/   │     │  gmail.com   │     │  Admin           │
│   deletion) │     └──────────────┘     └──────────────────┘
└─────────────┘
```

**Gap**: No automated DSAR (Data Subject Access Request) system; manual process only; no verification of 30-day response claim in privacy policy.

---

## 10. Security Controls Map

| Control | Status | Evidence |
|---------|--------|----------|
| TLS/HTTPS | ✅ | Vercel + Convex managed |
| CSP | ❌ | Not configured (T11) |
| HSTS | ✅ | Vercel default |
| Secure Cookies | ⚠️ | Clerk manages; GA/Ads cookies vary |
| Rate Limiting | ❌ | Not on Convex mutations (T10) |
| Input Validation | ⚠️ | Zod schemas in some mutations |
| SQL Injection | ✅ | Convex query builder (parameterized) |
| XSS Prevention | ⚠️ | React auto-escape; rich text via TipTap (sanitize?) |
| SSRF Prevention | ❌ | No URL fetching in mutations yet (T17) |
| Audit Logging | ❌ | Not implemented (T21) |
| Secret Scanning | ⚠️ | Not in CI (T19) |

---

*End of Data Flow Document*