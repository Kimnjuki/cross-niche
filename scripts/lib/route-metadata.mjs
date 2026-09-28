/**
 * Route metadata registry — The Grid Nexus
 *
 * SINGLE SOURCE OF TRUTH for the crawlable metadata of every non-article route.
 *
 * Why this file exists (GSC de-indexation RCA, 2026-09-28):
 *   The production Docker build runs `PRERENDER=0`, so no per-route HTML was
 *   ever emitted. nginx's `try_files $uri /index.html` fallback therefore served
 *   a byte-identical homepage shell — including
 *   `<link rel="canonical" href="https://thegridnexus.com/">` — for /tech,
 *   /ai-pulse, /tools/*, /about, /author/* and every other content route.
 *   Google collapsed the entire domain into one URL, which is why Search
 *   Console attributed ~1 impression each to "pages" sitting at positions 2-10.
 *
 *   scripts/generate-static-route-shells.mjs now emits dist/<path>/index.html
 *   for every route below, so each URL ships its OWN title, description,
 *   canonical, H1, intro copy, breadcrumbs and links BEFORE JavaScript runs.
 *
 * Contract enforced by scripts/route-shells.test.mjs:
 *   - title:       40-60 chars, unique
 *   - description: 140-158 chars, unique
 *   - h1:          unique per route and never a copy of the title
 *   - intro:       >= 25 words of unique, route-specific crawlable copy
 *
 * `indexable: false` routes are still generated (to stop them inheriting the
 * homepage canonical) but are emitted as `noindex, follow` and are excluded
 * from every sitemap.
 */

export const SITE_NAME = 'The Grid Nexus';
export const BASE_URL = 'https://thegridnexus.com';

/**
 * @typedef {{
 *   path: string,
 *   title: string,
 *   description: string,
 *   h1: string,
 *   intro: string,
 *   links?: Array<{ href: string, label: string }>,
 *   changefreq: 'daily'|'weekly'|'monthly',
 *   priority: number,
 *   indexable?: boolean
 * }} RouteMeta
 */

/** Hub links reused by many routes so internal linking is never route-local. */
const CORE_HUBS = [
  { href: '/tech', label: 'Technology' },
  { href: '/security', label: 'Cybersecurity' },
  { href: '/gaming', label: 'Gaming' },
  { href: '/ai-pulse', label: 'AI Pulse' },
  { href: '/tools', label: 'Free tools' },
];

/** @type {RouteMeta[]} */
export const ROUTE_METADATA = [
  // ── Homepage ─────────────────────────────────────────────────────────────
  {
    path: '/',
    title: 'Tech, Security & Gaming Intelligence | The Grid Nexus',
    description:
      'Independent intelligence on technology, cybersecurity and gaming: zero-day analysis, AI developments, hardware reviews and practical security guides.',
    h1: 'Technology, security and gaming intelligence, in one place',
    intro:
      'The Grid Nexus reports across three desks — technology, cybersecurity and gaming — with primary sources cited and dates kept honest. Start with a desk below, or open the free security tools if you need an answer in the next five minutes.',
    links: CORE_HUBS,
    changefreq: 'daily',
    priority: 1.0,
  },

  // ── Section hubs ─────────────────────────────────────────────────────────
  {
    path: '/tech',
    title: 'Technology News & Analysis 2026 | The Grid Nexus',
    description:
      'Technology news and analysis: AI model releases, chips, cloud infrastructure, devices and enterprise software, from The Grid Nexus technology desk.',
    h1: 'Technology news and analysis',
    intro:
      'Semiconductors, AI infrastructure, operating systems, devices and enterprise software — covered with numbers and context instead of press-release paraphrase. Every story links to its primary source and is re-dated when the facts change.',
    links: [
      { href: '/ai-pulse', label: 'AI Pulse' },
      { href: '/startups', label: 'Startup funding' },
      { href: '/reviews', label: 'Hardware reviews' },
      { href: '/security', label: 'Cybersecurity desk' },
    ],
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/security',
    title: 'Cybersecurity News & Threat Intelligence | The Grid Nexus',
    description:
      'Zero-day CVEs, breach post-mortems, ransomware and threat actor intelligence, explained in plain language by the security desk at The Grid Nexus.',
    h1: 'Cybersecurity and threat intelligence',
    intro:
      'From exploited zero-days to supply-chain compromises, we track what actually happened, who is affected and what defenders should do next. Advisories are dated, scored by real-world exploitability and linked to the vendor notice.',
    links: [
      { href: '/pillar/zero-trust-architecture', label: 'Zero trust architecture' },
      { href: '/pillar/ai-threat-intelligence', label: 'AI threat intelligence' },
      { href: '/tools/threat-scanner', label: 'Threat scanner' },
      { href: '/live-threat-dashboard', label: 'Live threat dashboard' },
    ],
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/gaming',
    title: 'Gaming News, Reviews & Release Dates | The Grid Nexus',
    description:
      'Gaming news, reviews and release dates for PS5, PC, Xbox and Switch, plus esports, hardware and account security guides from The Grid Nexus.',
    h1: 'Gaming news, reviews and releases',
    intro:
      'Reviews you can trust, release dates you can plan around, and the account-security advice that keeps your library yours. Console, PC and handheld coverage from a team that plays what it reviews before scoring it.',
    links: [
      { href: '/gaming/security-guides', label: 'Gaming security guides' },
      { href: '/pillar/gaming-security', label: 'Gaming security hub' },
      { href: '/reviews', label: 'Game and hardware reviews' },
      { href: '/tools/gaming-security-checkup', label: 'Gaming security checkup' },
    ],
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/news',
    title: 'Breaking Tech & Security News | The Grid Nexus',
    description:
      'Breaking technology, cybersecurity and gaming news as it happens: incidents, launches, breaches and policy moves, reported and timestamped by our newsroom.',
    h1: 'Breaking news',
    intro:
      'A running record of what changed today across technology, security and gaming. Developing stories carry timestamps and corrections rather than being silently rewritten after publication.',
    links: [
      { href: '/live-updates', label: 'Live updates' },
      { href: '/security', label: 'Security news' },
      { href: '/tech', label: 'Technology news' },
    ],
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/blog',
    title: 'Long-Form Features & Analysis | The Grid Nexus',
    description:
      'Long-form features, investigations and opinion across technology, cybersecurity and gaming — the stories that need more than a headline, with sources cited.',
    h1: 'Features and analysis',
    intro:
      'Series, essays and deep dives that follow a thread over weeks rather than minutes. Ideal if you want the reasoning behind a conclusion, not only the conclusion.',
    links: CORE_HUBS,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/topics',
    title: 'Browse Topics: Tech, Security & Gaming | The Grid Nexus',
    description:
      'Browse every topic we cover across technology, cybersecurity and gaming. Follow a subject for its latest articles, guides, explainers and tool walkthroughs.',
    h1: 'Topics we cover',
    intro:
      'An index of the subjects behind our coverage — from ransomware and zero trust to GPU supply, anti-cheat and account takeover. Each topic page collects the reporting that matters on that subject.',
    links: CORE_HUBS,
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/guides',
    title: 'Tech & Security Guides for 2026 | The Grid Nexus',
    description:
      'Step-by-step guides for hardening accounts, devices and networks. Written by practitioners, tested before publishing and dated so you know they still apply.',
    h1: 'Guides and how-tos',
    intro:
      'Practical instructions for the security and technology problems people actually hit: account recovery, two-factor rollouts, router hardening, backup verification and safe device resale. New guides are added weekly, and older ones are re-dated once we re-test the steps ourselves.',
    links: [
      { href: '/gaming/security-guides', label: 'Gaming security guides' },
      { href: '/tutorials', label: 'Tutorials' },
      { href: '/learn/nexus-path', label: 'Nexus Path learning track' },
    ],
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/tutorials',
    title: 'Tutorials for Tech & Security Skills | The Grid Nexus',
    description:
      'Hands-on tutorials that walk through real security and technology tasks — from enabling passkeys to auditing router firmware — with rollback steps.',
    h1: 'Tutorials',
    intro:
      'Each tutorial states the prerequisites, the time it takes and how to undo it, so you can follow along on a live machine without gambling your setup.',
    links: [
      { href: '/guides', label: 'Guides' },
      { href: '/tools', label: 'Free tools' },
      { href: '/learn/nexus-path', label: 'Nexus Path learning track' },
    ],
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    path: '/reviews',
    title: 'Tech & Gaming Hardware Reviews | The Grid Nexus',
    description:
      'Independent reviews of gaming hardware, security software and tech products. Tested in-house, scored on evidence, updated when firmware or pricing shifts.',
    h1: 'Reviews',
    intro:
      'We buy or borrow what we test, publish the methodology, and revisit scores when a vendor patches, re-prices or quietly changes a spec. No review is left to age without a note.',
    links: [
      { href: '/tools/pc-builder', label: 'PC builder' },
      { href: '/comparisons', label: 'Comparisons' },
      { href: '/gaming', label: 'Gaming desk' },
    ],
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/startups',
    title: 'Startup News & Funding Rounds | The Grid Nexus',
    description:
      'Funding rounds, acquisitions and product launches across security, AI and gaming startups — with the numbers, the investors and the competitive context.',
    h1: 'Startups and funding',
    intro:
      'Who raised, how much, at what valuation, and what the money is actually for. We flag the difference between an announced round and cash in the bank.',
    links: [
      { href: '/tech', label: 'Technology desk' },
      { href: '/ai-pulse', label: 'AI Pulse' },
      { href: '/news', label: 'Breaking news' },
    ],
    changefreq: 'daily',
    priority: 0.7,
  },
  {
    path: '/explore',
    title: 'Explore Tech, Security & Gaming Coverage | The Grid Nexus',
    description:
      'Explore the full Grid Nexus archive: filter coverage across technology, cybersecurity and gaming to find analysis, guides, reviews and threat reports.',
    h1: 'Explore coverage',
    intro:
      'The complete archive in one view. Filter by desk, format or recency to find the report, guide or explainer you need without hunting through category pages.',
    links: CORE_HUBS,
    changefreq: 'daily',
    priority: 0.85,
  },
  {
    path: '/ai-pulse',
    title: 'AI Pulse: Model Releases & AI Trends | The Grid Nexus',
    description:
      'AI Pulse tracks model launches, benchmarks, pricing and regulation — evidence-led coverage of what artificial intelligence is doing in production.',
    h1: 'AI Pulse',
    intro:
      'Model releases, benchmark results, chip supply and regulation, tracked in one place. Every entry links to the primary announcement so you can check the claim yourself rather than trusting a summary.',
    links: [
      { href: '/pillar/ai-threat-intelligence', label: 'AI threat intelligence' },
      { href: '/tech', label: 'Technology desk' },
      { href: '/tools/ai-tool-finder', label: 'AI tool finder' },
    ],
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/live-updates',
    title: 'Live Updates: Breaking Coverage | The Grid Nexus',
    description:
      'Chronological live coverage of developing security incidents, outages and product launches — timestamped updates with corrections noted as the story changes.',
    h1: 'Live updates',
    intro:
      'Newest first and never back-dated. When an early report turns out wrong we say so in the timeline instead of deleting the entry and pretending it never ran.',
    links: [
      { href: '/news', label: 'Breaking news' },
      { href: '/live-threat-dashboard', label: 'Live threat dashboard' },
    ],
    changefreq: 'daily',
    priority: 0.8,
  },
  {
    path: '/pillar/ai-threat-intelligence',
    title: 'AI Threat Intelligence Hub | The Grid Nexus',
    description:
      'A pillar resource on AI-driven threats: prompt injection, model abuse, adversarial machine learning and how security teams detect and contain them.',
    h1: 'AI threat intelligence',
    intro:
      'Everything we have published on attacking and defending AI systems, organised as one learning path: the attack classes, the detection signals, and the controls that survive contact with real users.',
    links: [
      { href: '/security', label: 'Cybersecurity desk' },
      { href: '/ai-pulse', label: 'AI Pulse' },
      { href: '/tools/threat-scanner', label: 'Threat scanner' },
    ],
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/pillar/zero-trust-architecture',
    title: 'Zero Trust Architecture Guide | The Grid Nexus',
    description:
      'Zero trust explained without the vendor noise: identity, device posture, micro-segmentation and the maturity steps that reduce breach blast radius.',
    h1: 'Zero trust architecture',
    intro:
      'A staged route from legacy perimeter thinking to identity-centric control, with the trade-offs named. Read it in order or jump to the maturity level your organisation is actually at.',
    links: [
      { href: '/security', label: 'Cybersecurity desk' },
      { href: '/tools/zero-trust-quiz', label: 'Zero-trust readiness quiz' },
      { href: '/guides', label: 'Implementation guides' },
    ],
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/pillar/gaming-security',
    title: 'Gaming Security Hub: Protect Accounts | The Grid Nexus',
    description:
      'The gaming security hub: account takeover, cheat malware, DDoS, SIM swapping and platform two-factor — with step-by-step protection for players.',
    h1: 'Gaming security',
    intro:
      'One place for everything that threatens a games library: phishing, session theft, cheat malware, SIM swapping and console account hijacking. Start with the checkup, then harden platform by platform.',
    links: [
      { href: '/gaming', label: 'Gaming desk' },
      { href: '/gaming/security-guides', label: 'Gaming security guides' },
      { href: '/tools/gaming-security-checkup', label: 'Gaming security checkup' },
    ],
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/research/state-of-gaming-security-2026',
    title: 'State of Gaming Security 2026 | The Grid Nexus',
    description:
      'Our 2026 research report on gaming security: survey data on account theft, cheat malware, two-factor adoption and the gaps players still leave open.',
    h1: 'State of gaming security 2026',
    intro:
      'Original survey and telemetry data on how players actually secure their accounts, where the habits break down, and which protections measurably reduce account loss. Methodology notes, sample sizes and the full question set are published alongside the findings.',
    links: [
      { href: '/pillar/gaming-security', label: 'Gaming security hub' },
      { href: '/gaming/security-guides', label: 'Gaming security guides' },
      { href: '/tools/gaming-security-checkup', label: 'Gaming security checkup' },
    ],
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/comparisons',
    title: 'Product & Service Comparisons | The Grid Nexus',
    description:
      'Side-by-side comparisons of security software, VPNs, gaming hardware and AI tools, scored on tested criteria instead of manufacturer marketing claims.',
    h1: 'Comparisons',
    intro:
      'Decision tables built from hands-on testing: pricing, performance impact, privacy terms and support quality, with the scoring method published alongside the result. Where a vendor will not publish a term we rely on, the comparison says so in the footnotes.',
    links: [
      { href: '/reviews', label: 'Reviews' },
      { href: '/tools', label: 'Free tools' },
      { href: '/security', label: 'Cybersecurity desk' },
    ],
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    path: '/gaming/security-guides',
    title: 'Gaming Security Guides for Players | The Grid Nexus',
    description:
      'Practical gaming security guides for Steam, PlayStation, Xbox, Nintendo and Discord — lock your accounts down in minutes with clear instructions.',
    h1: 'Gaming security guides',
    intro:
      'Platform-by-platform hardening: authenticator apps over SMS, recovery codes stored offline, session revocation, and the privacy settings that stop strangers finding you. Each guide states which platform version it was written against and what changed most recently.',
    links: [
      { href: '/pillar/gaming-security', label: 'Gaming security hub' },
      { href: '/gaming/security', label: 'Gaming security essentials' },
      { href: '/guides', label: 'All guides' },
    ],
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    path: '/gaming/security',
    title: 'Gaming Security Essentials | The Grid Nexus',
    description:
      'Gaming security essentials: protect accounts, hardware and identity from phishing, cheat malware and SIM swapping with our checklists and free tools.',
    h1: 'Gaming security essentials',
    intro:
      'The short version: four changes that stop the majority of account thefts, plus the warning signs that your account is already in someone else’s sights.',
    links: [
      { href: '/pillar/gaming-security', label: 'Gaming security hub' },
      { href: '/gaming/security-guides', label: 'Gaming security guides' },
      { href: '/tools/steam-scanner', label: 'Steam security scanner' },
    ],
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    path: '/tools',
    title: 'Free Security & Gaming Tools | The Grid Nexus',
    description:
      'Free browser-based tools: security score checker, breach simulator, IOC lookup, patch risk tracker and more. No account required, nothing stored.',
    h1: 'Free tools',
    intro:
      'Interactive utilities that run in your browser: audit a password policy, explain a breach, score a hardware build, or check whether a patch should be delayed. No sign-up and no data retention.',
    links: [
      { href: '/tools/security-scanner', label: 'Security scanner' },
      { href: '/tools/breach-explainer', label: 'Breach explainer' },
      { href: '/tools/pc-builder', label: 'PC builder' },
      { href: '/security-score', label: 'Security score checker' },
    ],
    changefreq: 'daily',
    priority: 0.9,
  },
];

/** Shared link target for the tool registry below. */
const TOOL_HUB = { href: '/tools', label: 'All free tools' };

/**
 * Tool-page registry: [path, name, h1, benefit, changefreq, priority].
 * `benefit` is a short (~30-45 char) verb phrase, unique per tool, so the
 * derived <title>/<description>/intro stay unique without 20 near-duplicate
 * hand-written strings drifting apart over time.
 */
const TOOL_ROUTES = [
  ['/tools/security-scanner', 'Security Scanner', 'Security scanner', 'find exposed services and weak headers', 'weekly', 0.9],
  ['/tools/nexusguard', 'NexusGuard Review', 'NexusGuard protection review', 'check device hardening and passkey coverage', 'weekly', 0.8],
  ['/tools/security-briefing', 'Security Briefing Room', 'Security briefing room', 'turn a live incident into a shareable brief', 'weekly', 0.7],
  ['/tools/vr-cyber-training', 'VR Cyber Training', 'VR cyber training', 'rehearse phishing and breach response drills', 'weekly', 0.6],
  ['/tools/steam-scanner', 'Steam Security Scanner', 'Steam security scanner', 'audit a Steam profile for hijack risk', 'weekly', 0.8],
  ['/tools/ioc-lookup', 'IOC Threat-Hunting Lookup', 'IOC threat-hunting lookup', 'enrich a hash, domain or IP indicator', 'daily', 0.8],
  ['/tools/gaming-security-checkup', 'Gaming Security Checkup', 'Gaming security checkup', 'score gaming accounts against known attacks', 'weekly', 0.8],
  ['/tools/breach-explainer', 'Breach Explainer', 'Breach explainer', 'see what a data breach actually exposes', 'weekly', 0.8],
  ['/tools/ai-tool-finder', 'AI Security Tool Finder', 'AI security tool finder', 'match a security problem to the right AI tool', 'weekly', 0.7],
  ['/tools/patch-risk-tracker', 'Game Patch Risk Tracker', 'Game patch risk tracker', 'decide whether a game patch is safe to defer', 'daily', 0.8],
  ['/tools/zero-trust-quiz', 'Zero-Trust Readiness Quiz', 'Zero-trust readiness quiz', 'benchmark zero-trust maturity honestly', 'monthly', 0.7],
  ['/tools/exploit-risk-meter', 'Exploit Risk Meter', 'Exploit risk meter', 'grade a CVE by real-world exploitability', 'daily', 0.8],
  ['/tools/pc-builder', 'AI PC Builder', 'AI PC builder', 'build a balanced, secure gaming PC', 'weekly', 0.8],
  ['/tools/sentiment-analyzer', 'Game Sentiment Analyzer', 'Game sentiment analyzer', 'read player sentiment before launch day', 'weekly', 0.8],
  ['/tools/news-personalizer', 'AI News Personalizer', 'AI news personalizer', 'filter security news to what affects you', 'daily', 0.7],
  ['/tools/recommendation-engine', 'AI Recommendation Engine', 'AI recommendation engine', 'get tool suggestions from a real use case', 'weekly', 0.8],
  ['/tools/threat-scanner', 'Threat Scanner', 'Threat scanner', 'sweep a domain for known threat exposure', 'daily', 0.9],
  ['/tools/community-moderator', 'Community Moderator', 'Community moderator helper', 'keep gaming communities free of scams', 'weekly', 0.7],
  ['/tools/gaming-copilot', 'Gaming Copilot', 'Gaming copilot', 'get plain-language security help mid-game', 'daily', 0.9],
  ['/tools/release-predictor', 'Release Predictor', 'Release predictor', 'forecast launch dates from historical patterns', 'daily', 0.8],
];

/** Framing shared by every derived tool description (length-checked by tests). */
const TOOL_DESC_PREFIX = (name) => `Free ${name} from The Grid Nexus. `;
const TOOL_DESC_TAIL = 'No account required and nothing you enter is stored.';

/**
 * Padding clauses appended only when a description would otherwise be too short
 * to fill the SERP snippet. Kept short and additive so ordering is stable.
 */
const DESCRIPTION_PADS = [
  ' Runs in your browser.',
  ' Free to use.',
  ' No account required.',
  ' Nothing you enter is stored.',
];

/**
 * Clamp a meta description into the 140-158 character window.
 *
 * Google rewrites snippets that are too long (losing the benefit copy) and
 * under-filled snippets waste the highest-CTR real estate on the page, so the
 * window is enforced deterministically rather than left to editorial discipline.
 */
export function fitDescription(text) {
  let out = String(text ?? '').replace(/\s+/g, ' ').trim();
  for (const pad of DESCRIPTION_PADS) {
    if (out.length >= 140) break;
    if (out.length + pad.length <= 158) out += pad;
  }
  return out;
}

for (const [path, name, h1, benefit, changefreq, priority] of TOOL_ROUTES) {
  ROUTE_METADATA.push({
    path,
    title: `${name} — Free Tool | The Grid Nexus`,
    description: fitDescription(
      `${TOOL_DESC_PREFIX(name)}${benefit.charAt(0).toUpperCase()}${benefit.slice(1)}. ${TOOL_DESC_TAIL}`
    ),
    h1,
    intro:
      `The ${name} is a free Grid Nexus tool that helps you ${benefit}. It runs entirely in your browser, so there is no account, no upload and no record of what you enter. ` +
      'Use it together with our published guides when you need a defensible answer instead of a guess.',
    links: [TOOL_HUB, { href: '/guides', label: 'Guides' }, { href: '/security', label: 'Cybersecurity desk' }],
    changefreq,
    priority,
  });
}

/** Interactive destinations, product routes and trust pages. */
ROUTE_METADATA.push(
  {
    path: '/security-score',
    title: 'Free Security Score Checker | The Grid Nexus',
    description:
      'Score your personal or small-business security posture in a few minutes: passwords, two-factor, backups, patching and device hygiene, with fixes ranked.',
    h1: 'Security score checker',
    intro:
      'Answer a short questionnaire and get a weighted score across the controls attackers actually exploit, plus the two or three changes that would move the number most.',
    links: [TOOL_HUB, { href: '/guides', label: 'Remediation guides' }],
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/breach-sim',
    title: 'Breach Simulator | Free Security Training | The Grid Nexus',
    description:
      'Run a breach simulation to see how an attacker chains phishing, credential reuse and privilege escalation — and where your defences would have stopped them.',
    h1: 'Breach simulator',
    intro:
      'A guided, non-destructive scenario for security training and tabletop exercises. Each step explains the attacker’s options and the control that would have broken the chain.',
    links: [TOOL_HUB, { href: '/pillar/zero-trust-architecture', label: 'Zero trust guide' }],
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/live-threat-dashboard',
    title: 'Live Threat Dashboard | CVEs & Alerts | The Grid Nexus',
    description:
      'A live cyber threat dashboard: newly exploited CVEs, active campaigns and breach alerts, filtered so you see what is being exploited rather than all noise.',
    h1: 'Live threat dashboard',
    intro:
      'Continuously updated view of exploited vulnerabilities and active campaigns, prioritised by exploitation evidence instead of raw CVSS score alone. Figures refresh throughout the day and every alert links to the vendor advisory that triggered it.',
    links: [
      { href: '/security', label: 'Cybersecurity desk' },
      { href: '/tools/exploit-risk-meter', label: 'Exploit risk meter' },
      { href: '/tools/patch-risk-tracker', label: 'Patch risk tracker' },
    ],
    changefreq: 'daily',
    priority: 0.8,
  },
  {
    path: '/learn/nexus-path',
    title: 'Nexus Path: Security Learning Track | The Grid Nexus',
    description:
      'Nexus Path is a structured security learning track: short lessons, practical checkpoints and quizzes that build from fundamentals to threat hunting.',
    h1: 'Nexus Path learning track',
    intro:
      'A guided sequence rather than a link dump. Work through identity, device, network and detection modules, with a checkpoint after each so you can prove the skill before moving on.',
    links: [
      { href: '/tutorials', label: 'Tutorials' },
      { href: '/guides', label: 'Guides' },
      { href: '/tools/zero-trust-quiz', label: 'Zero-trust quiz' },
    ],
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/pulse/nexus-pulse',
    title: 'Nexus Pulse: Daily Intelligence Brief | The Grid Nexus',
    description:
      'Nexus Pulse is the daily Grid Nexus intelligence brief: the security, AI and gaming developments that changed something, summarised with sources attached.',
    h1: 'Nexus Pulse daily brief',
    intro:
      'One page, newest first, covering only what moved: exploited vulnerabilities, model releases, platform policy changes and the gaming security incidents worth knowing about. Past briefs stay online, so you can trace how a story developed from first report to resolution.',
    links: [
      { href: '/ai-pulse', label: 'AI Pulse' },
      { href: '/news', label: 'Breaking news' },
      { href: '/live-updates', label: 'Live updates' },
    ],
    changefreq: 'daily',
    priority: 0.8,
  },
  {
    path: '/nexus-studio',
    title: 'Nexus Studio: Publish With Us | The Grid Nexus',
    description:
      'Nexus Studio is where contributors draft, review and publish with The Grid Nexus — structured briefs, editorial checks and a clear revision history.',
    h1: 'Nexus Studio',
    intro:
      'Our contribution workspace, with the same standards applied to staff and guest writers: source requirements, fact-check notes and a public correction policy. Assignments, drafts and review comments stay inside the workspace until an editor signs the piece off.',
    links: [
      { href: '/editorial', label: 'Editorial policy' },
      { href: '/quality-guidelines', label: 'Quality guidelines' },
      { href: '/contact', label: 'Contact editorial' },
    ],
    changefreq: 'weekly',
    priority: 0.6,
  },
  {
    path: '/nexus-intersection',
    title: 'The Nexus Intersection: Desks Overlap | The Grid Nexus',
    description:
      'The Nexus Intersection is where our three desks overlap: AI in games, security in cloud infrastructure, and the stories that need tech, cyber and gaming.',
    h1: 'The Nexus Intersection',
    intro:
      'Cross-desk reporting for stories that refuse to sit in one category — anti-cheat versus privacy, AI-generated content in game stores, and supply-chain risk in consoles.',
    links: CORE_HUBS,
    changefreq: 'weekly',
    priority: 0.7,
  },
  {
    path: '/community-threats',
    title: 'Community Threat Reports | The Grid Nexus',
    description:
      'Threat reports submitted and verified by the Grid Nexus community: phishing domains, cheat malware, scam storefronts and the evidence behind each listing.',
    h1: 'Community threat reports',
    intro:
      'Player-sourced threat intelligence, reviewed before publication so a mistake does not become a false accusation. Each entry records what was observed, when, and how it was verified.',
    links: [
      { href: '/security', label: 'Cybersecurity desk' },
      { href: '/tools/ioc-lookup', label: 'IOC lookup' },
      { href: '/community-guidelines', label: 'Community guidelines' },
    ],
    changefreq: 'daily',
    priority: 0.8,
  },
  {
    path: '/forums',
    title: 'Community Forums for Tech & Gaming | The Grid Nexus',
    description:
      'Discussion forums for technology, cybersecurity and gaming: ask questions, share findings and get answers from practitioners and other readers.',
    h1: 'Community forums',
    intro:
      'Moderated, low-noise discussion threads. Experts and readers compare notes on incidents, hardware choices and the security advice that turned out to be wrong. Threads that become genuinely useful reference material are promoted into guides and credited to their authors.',
    links: [
      { href: '/community-guidelines', label: 'Community guidelines' },
      { href: '/content-policy', label: 'Content policy' },
      { href: '/guides', label: 'Guides' },
    ],
    changefreq: 'weekly',
    priority: 0.6,
  },
  {
    path: '/podcasts',
    title: 'Podcasts & Audio Briefings | The Grid Nexus',
    description:
      'Grid Nexus podcasts and audio briefings: weekly threat round-ups, long interviews with practitioners, and short explainers for the commute, with transcripts.',
    h1: 'Podcasts and audio briefings',
    intro:
      'Audio versions of our reporting plus original interviews, with full transcripts published alongside so the content stays searchable and quotable. Episodes are indexed by topic, so you can jump straight to the segment on the vulnerability you are chasing.',
    links: [
      { href: '/videos', label: 'Video coverage' },
      { href: '/news', label: 'Breaking news' },
      { href: '/pulse/nexus-pulse', label: 'Nexus Pulse brief' },
    ],
    changefreq: 'weekly',
    priority: 0.6,
  },
  {
    path: '/videos',
    title: 'Video Coverage & Explainers | The Grid Nexus',
    description:
      'Video explainers, tool walkthroughs and event coverage from The Grid Nexus, each paired with a written article so nothing is locked inside a video.',
    h1: 'Video coverage',
    intro:
      'Short, captioned explainers and longer walkthroughs. Written versions sit beside every video so readers can skim, quote and cite the substance. Walkthroughs are recorded against current software versions and re-shot when an interface change breaks the steps.',
    links: [
      { href: '/podcasts', label: 'Podcasts' },
      { href: '/tutorials', label: 'Written tutorials' },
      { href: '/tools', label: 'Free tools' },
    ],
    changefreq: 'weekly',
    priority: 0.6,
  },
  {
    path: '/mobile',
    title: 'Grid Nexus Mobile App: Alerts & Tools | The Grid Nexus',
    description:
      'Take The Grid Nexus with you: breaking security alerts, saved articles and the free tools in a fast mobile app for iOS and Android devices.',
    h1: 'Mobile app',
    intro:
      'Push alerts for exploited vulnerabilities that affect you, offline reading for saved articles, and the same free tools in a touch-friendly layout. Sign-in mirrors your web account, and you can clear all locally stored data from the settings screen at any time.',
    links: CORE_HUBS,
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    path: '/roadmap',
    title: 'Platform Roadmap & Feature Voting | The Grid Nexus',
    description:
      'See what we are building next and vote on it. The Grid Nexus public roadmap covers new tools, coverage areas and platform features in progress.',
    h1: 'Product roadmap',
    intro:
      'A public, dated roadmap with the current state of each item. Suggestions that get enough votes are reviewed by the editorial and product teams each month.',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/contact', label: 'Contact' },
      { href: '/tools', label: 'Free tools' },
    ],
    changefreq: 'weekly',
    priority: 0.6,
  },
  {
    path: '/newsletter',
    title: 'Newsletter: Daily Intelligence Briefing | The Grid Nexus',
    description:
      'A short daily briefing on security, AI and gaming developments that matter, plus a weekly deep dive. Free, with one-click unsubscribe and no data resale.',
    h1: 'Newsletter',
    intro:
      'What changed, why it matters and what to do about it — in a brief you can read in three minutes. We link to sources and never sell your address.',
    links: [
      { href: '/news', label: 'Breaking news' },
      { href: '/pulse/nexus-pulse', label: 'Nexus Pulse brief' },
      { href: '/privacy', label: 'Privacy policy' },
    ],
    changefreq: 'daily',
    priority: 0.7,
  },
);

/** Trust, policy and legal pages — thin but required for E-E-A-T signals. */
ROUTE_METADATA.push(
  {
    path: '/about',
    title: 'About The Grid Nexus | Technology, Security & Gaming',
    description:
      'Who publishes The Grid Nexus, how the editorial team works, and the standards we apply to sourcing, corrections and advertising across three desks.',
    h1: 'About The Grid Nexus',
    intro:
      'The Grid Nexus publishes technology, cybersecurity and gaming intelligence with named authors, cited sources and a public corrections policy. This page explains who we are and how the work is produced.',
    links: [
      { href: '/editorial', label: 'Editorial policy' },
      { href: '/quality-guidelines', label: 'Quality guidelines' },
      { href: '/contact', label: 'Contact us' },
    ],
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    path: '/contact',
    title: 'Contact The Grid Nexus | Editorial & Press',
    description:
      'Contact The Grid Nexus for corrections, editorial tips, press enquiries, partnerships or advertising. Response targets and secure tip routes are listed here.',
    h1: 'Contact us',
    intro:
      'Reach the right desk directly: corrections, news tips, press requests, partnership and advertising. We answer correction requests first and publish fixes with a dated note.',
    links: [
      { href: '/editorial', label: 'Editorial policy' },
      { href: '/about', label: 'About us' },
      { href: '/media', label: 'Media kit' },
    ],
    changefreq: 'monthly',
    priority: 0.4,
  },
  {
    path: '/editorial',
    title: 'Editorial Policy & Standards | The Grid Nexus',
    description:
      'Our editorial policy: sourcing rules, independence from advertisers, correction and update practice, and how we label sponsored or AI-assisted content.',
    h1: 'Editorial policy and standards',
    intro:
      'How we decide what to publish, how sources are verified and what we do when we get something wrong. This is the standard we hold staff and contributors to.',
    links: [
      { href: '/quality-guidelines', label: 'Quality guidelines' },
      { href: '/content-policy', label: 'Content policy' },
      { href: '/disclosure', label: 'Disclosure policy' },
    ],
    changefreq: 'monthly',
    priority: 0.4,
  },
  {
    path: '/media',
    title: 'Media Kit & Press Resources | The Grid Nexus',
    description:
      'Press resources for The Grid Nexus: brand assets, audience and traffic data, spokesperson details, and the correct attribution for our reporting.',
    h1: 'Media kit and press resources',
    intro:
      'Everything a journalist, partner or conference organiser needs: approved logos, usage rules, audience figures and how to request an interview with our editors. Trademark, screenshot and quotation rules are stated explicitly so partners never have to guess.',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/contact', label: 'Press contact' },
      { href: '/editorial', label: 'Editorial policy' },
    ],
    changefreq: 'monthly',
    priority: 0.4,
  },
  {
    path: '/disclosure',
    title: 'Disclosure & Affiliate Policy | The Grid Nexus',
    description:
      'How The Grid Nexus handles affiliate links, sponsorship, review samples and advertising — and how those relationships are disclosed on every affected page.',
    h1: 'Disclosure and affiliate policy',
    intro:
      'Commercial relationships are disclosed where they apply, never hidden in a footer. Sponsorship never buys a score, and review samples are declared on the article itself.',
    links: [
      { href: '/editorial', label: 'Editorial policy' },
      { href: '/content-policy', label: 'Content policy' },
      { href: '/about', label: 'About us' },
    ],
    changefreq: 'monthly',
    priority: 0.4,
  },
  {
    path: '/quality-guidelines',
    title: 'Content Quality Guidelines | The Grid Nexus',
    description:
      'The quality bar every Grid Nexus article must clear: accuracy checks, source requirements, update cadence and the review steps before anything publishes.',
    h1: 'Content quality guidelines',
    intro:
      'The checklist our editors run before publication: primary sources for every claim, no unsourced statistics, dated updates, and a named human accountable for the page.',
    links: [
      { href: '/editorial', label: 'Editorial policy' },
      { href: '/about', label: 'About us' },
      { href: '/community-guidelines', label: 'Community guidelines' },
    ],
    changefreq: 'monthly',
    priority: 0.4,
  },
  {
    path: '/content-policy',
    title: 'Content Policy & AI Disclosure | The Grid Nexus',
    description:
      'What we publish and what we refuse to publish: disclosure of AI assistance, sponsored content labelling, and rules on security research and exploit detail.',
    h1: 'Content policy',
    intro:
      'Our boundaries in writing: how AI assistance is disclosed, how sponsored material is labelled, and how we handle responsible-disclosure topics without publishing a working exploit.',
    links: [
      { href: '/editorial', label: 'Editorial policy' },
      { href: '/quality-guidelines', label: 'Quality guidelines' },
      { href: '/disclosure', label: 'Disclosure policy' },
    ],
    changefreq: 'monthly',
    priority: 0.4,
  },
  {
    path: '/community-guidelines',
    title: 'Community Guidelines & Moderation | The Grid Nexus',
    description:
      'How to take part in Grid Nexus comments, forums and threat reports: evidence standards, no doxxing, no vendor shilling and the moderation ladder we apply.',
    h1: 'Community guidelines',
    intro:
      'The rules that keep discussion useful: bring evidence, argue the point not the person, never post personal data, and expect moderation to be consistent and explained.',
    links: [
      { href: '/forums', label: 'Community forums' },
      { href: '/community-threats', label: 'Threat reports' },
      { href: '/content-policy', label: 'Content policy' },
    ],
    changefreq: 'monthly',
    priority: 0.4,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy: Data, Cookies & Rights | The Grid Nexus',
    description:
      'What data The Grid Nexus collects, the legal basis for processing it, how long we keep it, and the access, export and deletion rights you can exercise.',
    h1: 'Privacy policy',
    intro:
      'Plain-language detail on cookies, analytics, advertising partners and newsletter data, plus the exact steps to request a copy of your data or have it deleted.',
    links: [
      { href: '/terms', label: 'Terms of service' },
      { href: '/disclosure', label: 'Disclosure policy' },
      { href: '/contact', label: 'Contact us' },
    ],
    changefreq: 'monthly',
    priority: 0.3,
  },
  {
    path: '/terms',
    title: 'Terms of Service & Acceptable Use | The Grid Nexus',
    description:
      'The terms that govern use of The Grid Nexus: acceptable use, intellectual property, third-party links, liability limits and how disputes are handled.',
    h1: 'Terms of service',
    intro:
      'What you may do with our content, what we promise in return, and where responsibility sits for third-party links and tool output. Written to be read, not to hide behind.',
    links: [
      { href: '/privacy', label: 'Privacy policy' },
      { href: '/content-policy', label: 'Content policy' },
      { href: '/contact', label: 'Contact us' },
    ],
    changefreq: 'monthly',
    priority: 0.3,
  },
);

/**
 * Routes that must exist for the app but must never be indexed.
 *
 * They are still generated as real HTML files so they can never inherit the
 * homepage canonical (the bug that de-indexed the site), but they ship
 * `noindex, follow` and are excluded from every sitemap. Several are also
 * blocked in robots.txt — having them in a sitemap would otherwise produce
 * "Submitted URL blocked by robots.txt" errors in Search Console.
 */
export const NON_INDEXABLE_ROUTES = [
  '/signin',
  '/signup',
  '/search',
  '/notifications',
  '/settings',
  '/bookmarks',
  '/profile',
  '/security-profile',
  '/subscription',
  '/subscription/management',
  '/newsletter/verify',
  '/simple',
  '/enhanced',
  '/enhanced-simple',
  '/original-index',
  '/tools-old',
  '/seo-checklist',
  '/keyword-gap-analysis',
  '/sitemap',
  // robots.txt blocks /api/*; listing /api in a sitemap would produce
  // "Submitted URL blocked by robots.txt" and it has no search demand.
  '/api',
];

// Final pass: normalise every description into the 140-158 SERP window. Titles
// are hand-written for CTR and are enforced by scripts/route-shells.test.mjs.
for (const route of ROUTE_METADATA) {
  route.description = fitDescription(route.description);
}

/** Every route that must be emitted with `index, follow`. */
export const INDEXABLE_ROUTES = ROUTE_METADATA.filter((route) => route.indexable !== false);

/** Look up metadata by path (tolerates a trailing slash). */
export function getRouteMetadata(pathname) {
  const normalised = String(pathname ?? '').split('?')[0].split('#')[0];
  const base = normalised.length > 1 ? normalised.replace(/\/+$/, '') : '/';
  return ROUTE_METADATA.find((route) => route.path === base) ?? null;
}

/** True when the route must be excluded from sitemaps and carry noindex. */
export function isNonIndexable(pathname) {
  const base = String(pathname ?? '').replace(/\/+$/, '') || '/';
  return NON_INDEXABLE_ROUTES.includes(base);
}

export default ROUTE_METADATA;
