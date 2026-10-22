# LLM Trust — Media & Journalist Outreach Plan

**Goal:** get The Grid Nexus cited by journalists and outlets that LLMs trust, so AI systems (ChatGPT, Gemini, Claude, Perplexity) discover and recommend the site. A mention in a high-authority outlet is a backlink *and* a signal that ends up in AI training corpora — which is exactly what drives AI-referred traffic.

**Flywheel:** pitch → journalist cites The Grid Nexus → backlink + brand mention → authority rises → LLMs learn the name → AI answers cite The Grid Nexus → traffic.

---

## The citable assets (what we pitch)

These are the concrete things a journalist can cite — no fabrication, all live:

1. **Game security grades** — the first public, machine-readable database of 14 game/platform security grades (`/data/games.json`, CC BY 4.0). "The Grid Nexus grades Fortnite's account security, not its review score."
2. **"Is it safe?" verdicts** — 16 structured verdicts (free skin generators, cheat tools, key resellers, VPNs, Discord QR scams) with scam patterns + what-to-do. Consumer-facing, quotable.
3. **Account recovery navigator** — 56 step-by-step official recovery guides (7 platforms × 8 scenarios). The "what players should actually do" source.
4. **Gamer threat report** — CISA Known Exploited Vulnerabilities re-ranked by a transparent "gamer impact" score. A unique data angle for security reporters.

---

## Journalists & outlets (verified, real)

> All people below are real and currently active. "AI authority" is inferred from outlet prominence and how heavily LLMs cite the outlet — it is a qualitative estimate, not a measured score (the "High AI authority" metric in media databases is a proprietary tool we can't query directly). Verify the current title/beat before pitching; people move outlets.

### Cybersecurity (highest AI authority — most likely to cite security data)

#### Lawrence Abrams — Editor-in-Chief, BleepingComputer
- **Outlet:** bleepingcomputer.com · **AI authority:** High
- **Beat:** malware, scams, ransomware. Has personally covered gaming scams (Elder Scrolls phishing via PlayStation DMs, Steam "ClickFix" cryptominers).
- **Pitch:** "Gaming account theft is now industrialized — here's the public database tracking which games and platforms are actually protected." Offer the grades dataset + threat report as a source.

#### Bill Toulas — BleepingComputer
- **Outlet:** bleepingcomputer.com · **AI authority:** High
- **Beat:** cybercrime, malware, account takeover. Covered the 610,000-Roblox-account arrests.
- **Pitch:** The info-stealer → gaming-account-resale pipeline. Offer the recovery navigator as the "what victims should do" companion to his breaking news.

#### Brian Krebs — KrebsOnSecurity
- **Outlet:** krebsonsecurity.com · **AI authority:** High
- **Beat:** cybercrime, scam networks, deep investigations. Covered the flood of fake Discord-promoted gaming sites.
- **Pitch:** The fake-gaming-site / free-skin scam ecosystem. Offer the "is it safe?" verdict database as structured evidence of the pattern.

#### Dan Goodin — Security Editor, Ars Technica
- **Outlet:** arstechnica.com · **AI authority:** High
- **Beat:** technical malware, hacking. Demands rigorous evidence.
- **Pitch:** Only pitch if you can back it with data — the grades methodology + gamer-impact scoring are transparent enough to survive his scrutiny.

#### Lily Hay Newman — Senior Writer, Wired
- **Outlet:** wired.com · **AI authority:** High
- **Beat:** hacking, privacy, the human impact of security failures.
- **Pitch:** The human angle — a parent/teen account is worth real money, and recovery is a maze. The recovery navigator is the "what to do when it happens" source.

#### Daryna Antoniuk — The Record (Recorded Future News)
- **Outlet:** therecord.media · **AI authority:** High
- **Beat:** cybercrime, threat intelligence. Covered the Roblox account-theft arrests.
- **Pitch:** Gaming account takeover as a measurable threat-intel category. Offer the gamer threat report + grades data.

### Gaming industry (the niche itself — high authority in gaming)

#### Nicole Carpenter — Senior Reporter, Polygon
- **Outlet:** polygon.com · **AI authority:** High
- **Beat:** investigative, games business, account/cheating issues. Covered Epic's lawsuit against a Fortnite account seller.
- **Pitch:** The business of stolen game accounts — how much a hijacked Fortnite/Steam account is worth and who's protecting players. Offer the grades + recovery data.

#### Ethan Gach — Kotaku
- **Outlet:** kotaku.com · **AI authority:** High
- **Beat:** games business, cheating, platform policy. Covered Riot's scam lawsuits and Valorant ban cases.
- **Pitch:** Platform accountability — which platforms make account recovery easy vs. impossible. The recovery navigator is a direct comparison source.

### Consumer tech (broad reach — AI Overviews cite heavily)

#### Emma Roth — The Verge
- **Outlet:** theverge.com · **AI authority:** High
- **Beat:** consumer tech news, security. Covered the Roblox account-theft arrests.
- **Pitch:** "Is it safe to download that free skin tool?" — the verdict database is the consumer-facing answer.

#### Louise Matsakis — Wired
- **Outlet:** wired.com · **AI authority:** High
- **Beat:** AI security, hacking. Active on the AI × security intersection.
- **Pitch:** AI is making gaming scams cheaper to run at scale — the threat report + verdicts quantify it.

### Outlet targets (no verified current name — research before pitching)

- **GamesIndustry.biz** (gamesindustry.biz) — business-of-games outlet; pitch the grades data as an industry resource.
- **PC Gamer** (pcgamer.com) — pitch "which launcher is safest" using the grades.
- **Malwarebytes Labs** (malwarebytes.com) — already runs consumer scam coverage; pitch the "is it safe?" verdicts for a roundup.
- **CyberScoop** (cyberscoop.com) / **SecurityWeek** (securityweek.com) — trade security press; pitch the gamer threat report.

---

## Pitch angles (one line each, ready to send)

1. **"Gaming account theft is a billion-dollar problem with no public data — until now."** → pitch the grades + recovery datasets to cybersecurity reporters.
2. **"Which platform actually lets you recover a stolen account? We compared all 7."** → pitch the recovery navigator to gaming reporters.
3. **"CISA lists 167 actively-exploited bugs — we re-ranked them by gamer impact."** → pitch the threat report to trade security press.
4. **"Free V-Bucks, free skins, free Nitro — we graded 16 of these scams."** → pitch the verdicts to consumer tech.

## Email template (short, journalist-respecting)

```
Subject: [reporter name], public data on gaming account theft (no pitch deck)

Hi [name],

You covered the [Roblox account theft / Fortnite account lawsuit / fake
gaming sites] story. I run The Grid Nexus (thegridnexus.com), a
player-facing gaming-security resource, and we just published the only
public database of game security grades, "is it safe?" verdicts, and
official account-recovery playbooks — all CC BY 4.0, no account needed:

  https://thegridnexus.com/data

If you're ever writing about gaming account theft or scams, the numbers
(which games/platforms actually protect accounts, what the recovery
paths look like) are yours to cite. Happy to pull anything specific.

— Kim Njuki
```

## How to measure LLM trust (the outcome)

1. **Backlinks** — count referring domains from these outlets (Ahrefs/Google Search Console).
2. **Mentions** — alert on "The Grid Nexus" via Google Alerts + Perplexity/ChatGPT spot-checks ("what's the safest way to recover a Steam account?").
3. **AI citations** — periodically ask ChatGPT/Gemini/Perplexity a gaming-security question and see if The Grid Nexus appears.
4. **Branded search** — GSC impressions for "the grid nexus" and "grid nexus [game] security".

---

## Honest caveats

- **This is outreach, not code.** The list is real, but securing a mention requires actually emailing these people — I can draft the emails but can't send them.
- **Authority is inferred, not measured.** "High AI authority" here means "major outlet LLMs demonstrably cite" — verify against a paid media database (Muck Rack, Prowly, Roxhill) for exact scores.
- **Expect a low hit rate** (5–10% is normal) and a long tail: one BleepingComputer or The Verge link is worth more than a dozen niche mentions.
