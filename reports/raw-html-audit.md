# Raw-HTML crawl audit (no JavaScript)

- **Target:** https://www.thegridnexus.com
- **Generated:** 2026-09-16T19:06:52.046Z
- **Method:** plain HTTP GET via `fetch`; no browser, no JS execution
- **Script:** `npx tsx scripts/seo-raw-html-audit.ts`

This is the P0-T1 deliverable, re-specified for this repo's real stack
(Vite + React SPA + nginx-served `#static-shell`, not Next.js App Router).

| Route | Template | HTTP 2xx | H1 | canonical | description (50-160) | JSON-LD valid | no "Loading full experience" | no JS-required outside <noscript> | serves own shell (not homepage) | Content | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | homepage | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | n-a | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description |
| `/tech` | category | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/security` | category | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/gaming` | category | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/news` | category | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/explore` | category | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/topics` | hub-list | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/guides` | hub-list | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/tools` | hub-list | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/about` | static | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/privacy` | static | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/terms` | static | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/roadmap` | static | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/security-profile` | app | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/community-threats` | app | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/security-score` | tool | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/breach-sim` | tool | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/live-threat-dashboard` | tool | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/ai-pulse` | feed | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/pillar/gaming-security` | pillar | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/research/state-of-gaming-security-2026` | research | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/article/gaming-pc-security-hardening-guide-2026` | article | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | 212 words of body text | **content >= 300 words** -> 212 words of body text |
| `/article/ai-security-threats-2026` | article | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | 103 words of body text | **content >= 300 words** -> 103 words of body text |
| `/article/ultimate-guide-steam-xbox-playstation-discord-security` | article | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
| `/article/gaming-security-in-2026-how-to-actually-keep-your-accounts-safe` | article | PASS | PASS | **FAIL** | **FAIL** | PASS | PASS | PASS | **FAIL** | 564 words of body text | **canonical** -> MISSING <link rel="canonical">; **description (50-160)** -> MISSING meta description; **serves own shell (not homepage)** -> SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players \| The Grid Nexus) |
## Summary by check

| Check | Routes passed |
| --- | --- |
| HTTP 2xx | 25/25 |
| H1 | 25/25 |
| canonical | 2/25 |
| description (50-160) | 2/25 |
| JSON-LD valid | 25/25 |
| no "Loading full experience" | 25/25 |
| no JS-required outside <noscript> | 25/25 |
| serves own shell (not homepage) | 2/25 |

## Per-route evidence

### `/` (homepage)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content >= 150 words**: 564 words of body text

### `/tech` (category)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/security` (category)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/gaming` (category)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/news` (category)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/explore` (category)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/topics` (hub-list)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/guides` (hub-list)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/tools` (hub-list)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/about` (static)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/privacy` (static)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/terms` (static)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/roadmap` (static)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/security-profile` (app)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/community-threats` (app)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/security-score` (tool)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/breach-sim` (tool)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/live-threat-dashboard` (tool)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/ai-pulse` (feed)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content volume**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/pillar/gaming-security` (pillar)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content >= 150 words**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/research/state-of-gaming-security-2026` (research)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content >= 150 words**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/article/gaming-pc-security-hardening-guide-2026` (article)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: Gaming PC Security Hardening Guide 2026: Lock Down Your Rig ...
- PASS **canonical**: https://thegridnexus.com/article/gaming-pc-security-hardening-guide-2026
- PASS **description (50-160)**: 143 chars
- PASS **JSON-LD valid**: 1 block(s): Article
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- FAIL **content >= 300 words**: 212 words of body text
- PASS **serves own shell (not homepage)**: distinct H1 (title: Gaming PC Security Hardening Guide 2026: Lock Down Your Rig Without Lo)

### `/article/ai-security-threats-2026` (article)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: AI Security Threats 2026: Weaponized AI, Deepfakes, and Quan...
- PASS **canonical**: https://thegridnexus.com/article/ai-security-threats-2026
- PASS **description (50-160)**: 135 chars
- PASS **JSON-LD valid**: 1 block(s): Article
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- FAIL **content >= 300 words**: 103 words of body text
- PASS **serves own shell (not homepage)**: distinct H1 (title: AI Security Threats 2026: Weaponized AI, Deepfakes, and Quantum Risks )

### `/article/ultimate-guide-steam-xbox-playstation-discord-security` (article)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content >= 300 words**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

### `/article/gaming-security-in-2026-how-to-actually-keep-your-accounts-safe` (article)

- PASS **HTTP 2xx**: status 200
- PASS **H1**: The Grid Nexus – Tech, Security Gaming News
- FAIL **canonical**: MISSING <link rel="canonical">
- FAIL **description (50-160)**: MISSING meta description
- PASS **JSON-LD valid**: 1 block(s): Organization, WebSite
- PASS **no "Loading full experience"**: absent
- PASS **no JS-required outside <noscript>**: absent
- PASS **content >= 300 words**: 564 words of body text
- FAIL **serves own shell (not homepage)**: SERVED HOMEPAGE SHELL — H1 "The Grid Nexus – Tech, Security Gaming News" is identical to / (title: Gaming Security Intelligence for Players | The Grid Nexus)

