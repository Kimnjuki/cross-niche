/**
 * Centralised SEO metadata for every routed page.
 *
 * ⚠️ GENERATED FILE — do not edit by hand.
 *
 * Regenerate with:  node scripts/generate-page-metadata.mjs
 * Source of truth:  scripts/lib/route-metadata.mjs
 *
 * Why it is generated
 * -------------------
 * This map is read at runtime by `getPageMetadata()`, which `SEOHead` uses to
 * write <title>/<meta name="description"> after hydration. It used to be
 * hand-maintained and drifted from the registry that writes the static route
 * shells: 21 registry routes were missing and all 38 shared routes carried a
 * different title, description and H1. Hydration therefore overwrote correct
 * static metadata with stale copy, and unmapped routes fell back to the generic
 * homepage description. Generating it from the registry makes that impossible.
 *
 * Rules enforced by scripts/route-shells.test.mjs and
 * scripts/page-metadata.test.mjs:
 *  - title:       40-60 chars, unique
 *  - description: 140-158 chars, unique
 *  - h1:          unique per route and never a copy of the <title> tag
 */

export const SITE_NAME = 'The Grid Nexus';

interface PageMeta {
  /** <title> tag — 40-60 chars */
  title: string;
  /** meta description — 140-158 chars */
  description: string;
  /** Visible H1 on the page — different from the title tag */
  h1?: string;
}

export const PAGE_METADATA: Record<string, PageMeta> = {
  // ── Homepage ─────────────────────────────────────────────────────────────
  '/': {
    title: 'Gaming Security for Players | The Grid Nexus',
    description: 'Per-game security grades, a weekly gamer threat report, account-recovery guides and free tools to protect Steam, console and mobile accounts.',
    h1: 'Gaming security for players — protect your accounts, games and devices',
  },

  // ── Section hubs & platform ──────────────────────────────────────────────
  '/tech': {
    title: 'Technology News & Analysis 2026 | The Grid Nexus',
    description: 'Technology news and analysis: AI model releases, chips, cloud infrastructure, devices and enterprise software, from The Grid Nexus technology desk.',
    h1: 'Technology news and analysis',
  },
  '/security': {
    title: 'Gamer Threat Intelligence | The Grid Nexus',
    description: 'The threats that affect players: exploited CVEs in Windows, Chrome, GPU drivers and game platforms, triaged by gamer impact with plain-language fixes.',
    h1: 'Gamer threat intelligence',
  },
  '/gaming': {
    title: 'Gaming Security: Grades, Threats & Guides | The Grid Nexus',
    description: 'Per-game security grades, the weekly gamer threat report, account-recovery and 2FA guides, and free tools for Steam, PlayStation, Xbox, Switch and mobile.',
    h1: 'Gaming security for players',
  },
  '/news': {
    title: 'Breaking Tech & Security News | The Grid Nexus',
    description: 'Breaking technology, cybersecurity and gaming news as it happens: incidents, launches, breaches and policy moves, reported and timestamped by our newsroom.',
    h1: 'Breaking news',
  },
  '/blog': {
    title: 'Long-Form Features & Analysis | The Grid Nexus',
    description: 'Long-form features, investigations and opinion across technology, cybersecurity and gaming — the stories that need more than a headline, with sources cited.',
    h1: 'Features and analysis',
  },
  '/topics': {
    title: 'Browse Topics: Tech, Security & Gaming | The Grid Nexus',
    description: 'Browse every topic we cover across technology, cybersecurity and gaming. Follow a subject for its latest articles, guides, explainers and tool walkthroughs.',
    h1: 'Topics we cover',
  },
  '/guides': {
    title: 'Tech & Security Guides for 2026 | The Grid Nexus',
    description: 'Step-by-step guides for hardening accounts, devices and networks. Written by practitioners, tested before publishing and dated so you know they still apply.',
    h1: 'Guides and how-tos',
  },
  '/tutorials': {
    title: 'Tutorials for Tech & Security Skills | The Grid Nexus',
    description: 'Hands-on tutorials that walk through real security and technology tasks — from enabling passkeys to auditing router firmware — with rollback steps.',
    h1: 'Tutorials',
  },
  '/reviews': {
    title: 'Tech & Gaming Hardware Reviews | The Grid Nexus',
    description: 'Independent reviews of gaming hardware, security software and tech products. Tested in-house, scored on evidence, updated when firmware or pricing shifts.',
    h1: 'Reviews',
  },
  '/startups': {
    title: 'Startup News & Funding Rounds | The Grid Nexus',
    description: 'Funding rounds, acquisitions and product launches across security, AI and gaming startups — with the numbers, the investors and the competitive context.',
    h1: 'Startups and funding',
  },
  '/explore': {
    title: 'Explore Tech, Security & Gaming Coverage | The Grid Nexus',
    description: 'Explore the full Grid Nexus archive: filter coverage across technology, cybersecurity and gaming to find analysis, guides, reviews and threat reports.',
    h1: 'Explore coverage',
  },
  '/ai-pulse': {
    title: 'AI Pulse: Model Releases & AI Trends | The Grid Nexus',
    description: 'AI Pulse tracks model launches, benchmarks, pricing and regulation — evidence-led coverage of what artificial intelligence is doing in production.',
    h1: 'AI Pulse',
  },
  '/live-updates': {
    title: 'Live Updates: Breaking Coverage | The Grid Nexus',
    description: 'Chronological live coverage of developing security incidents, outages and product launches — timestamped updates with corrections noted as the story changes.',
    h1: 'Live updates',
  },

  // ── Pillar pages ─────────────────────────────────────────────────────────
  '/pillar/ai-threat-intelligence': {
    title: 'AI Threat Intelligence Hub | The Grid Nexus',
    description: 'A pillar resource on AI-driven threats: prompt injection, model abuse, adversarial machine learning and how security teams detect and contain them.',
    h1: 'AI threat intelligence',
  },
  '/pillar/zero-trust-architecture': {
    title: 'Zero Trust Architecture Guide | The Grid Nexus',
    description: 'Zero trust explained without the vendor noise: identity, device posture, micro-segmentation and the maturity steps that reduce breach blast radius.',
    h1: 'Zero trust architecture',
  },
  '/pillar/gaming-security': {
    title: 'Gaming Security Hub: Protect Accounts | The Grid Nexus',
    description: 'The gaming security hub: account takeover, cheat malware, DDoS, SIM swapping and platform two-factor — with step-by-step protection for players.',
    h1: 'Gaming security',
  },

  // ── Research & reports ───────────────────────────────────────────────────
  '/research/state-of-gaming-security-2026': {
    title: 'State of Gaming Security 2026 Report | The Grid Nexus',
    description: 'Our 2026 report: security grades for 14 games and platforms, plus a gamer-impact triage of actively-exploited vulnerabilities from the CISA KEV catalog.',
    h1: 'State of gaming security 2026',
  },

  // ── Section hubs & platform ──────────────────────────────────────────────
  '/comparisons': {
    title: 'Product & Service Comparisons | The Grid Nexus',
    description: 'Side-by-side comparisons of security software, VPNs, gaming hardware and AI tools, scored on tested criteria instead of manufacturer marketing claims.',
    h1: 'Comparisons',
  },

  // ── Gaming security ──────────────────────────────────────────────────────
  '/gaming/security-guides': {
    title: 'Gaming Security Guides for Players | The Grid Nexus',
    description: 'Practical gaming security guides for Steam, PlayStation, Xbox, Nintendo and Discord — lock your accounts down in minutes with clear instructions.',
    h1: 'Gaming security guides',
  },
  '/gaming/security': {
    title: 'Gaming Security Essentials | The Grid Nexus',
    description: 'Gaming security essentials: protect accounts, hardware and identity from phishing, cheat malware and SIM swapping with our checklists and free tools.',
    h1: 'Gaming security essentials',
  },

  // ── Section hubs & platform ──────────────────────────────────────────────
  '/tools': {
    title: 'Free Gaming Security Tools | The Grid Nexus',
    description: 'Free browser-based gaming security tools: account checkup, Steam scanner, IOC lookup and scam triage. No account required, nothing stored. Free to use.',
    h1: 'Free gaming security tools',
  },

  // ── Tools ────────────────────────────────────────────────────────────────
  '/tools/security-scanner': {
    title: 'Security Scanner — Free Tool | The Grid Nexus',
    description: 'Free Security Scanner from The Grid Nexus. Find exposed services and weak headers. No account required and nothing you enter is stored. Runs in your browser.',
    h1: 'Security scanner',
  },
  '/tools/nexusguard': {
    title: 'NexusGuard Review — Free Tool | The Grid Nexus',
    description: 'Free NexusGuard Review from The Grid Nexus. Check device hardening and passkey coverage. No account required and nothing you enter is stored.',
    h1: 'NexusGuard protection review',
  },
  '/tools/security-briefing': {
    title: 'Security Briefing Room — Free Tool | The Grid Nexus',
    description: 'Free Security Briefing Room from The Grid Nexus. Turn a live incident into a shareable brief. No account required and nothing you enter is stored.',
    h1: 'Security briefing room',
  },
  '/tools/vr-cyber-training': {
    title: 'VR Cyber Training — Free Tool | The Grid Nexus',
    description: 'Free VR Cyber Training from The Grid Nexus. Rehearse phishing and breach response drills. No account required and nothing you enter is stored.',
    h1: 'VR cyber training',
  },
  '/tools/steam-scanner': {
    title: 'Steam Security Scanner — Free Tool | The Grid Nexus',
    description: 'Free Steam Security Scanner from The Grid Nexus. Audit a Steam profile for hijack risk. No account required and nothing you enter is stored.',
    h1: 'Steam security scanner',
  },
  '/tools/ioc-lookup': {
    title: 'IOC Threat-Hunting Lookup — Free Tool | The Grid Nexus',
    description: 'Free IOC Threat-Hunting Lookup from The Grid Nexus. Enrich a hash, domain or IP indicator. No account required and nothing you enter is stored.',
    h1: 'IOC threat-hunting lookup',
  },
  '/tools/gaming-security-checkup': {
    title: 'Gaming Security Checkup — Free Tool | The Grid Nexus',
    description: 'Free Gaming Security Checkup from The Grid Nexus. Score gaming accounts against known attacks. No account required and nothing you enter is stored.',
    h1: 'Gaming security checkup',
  },
  '/tools/scam-check': {
    title: 'Scam Checker — Free Tool | The Grid Nexus',
    description: 'Free Scam Checker from The Grid Nexus. Triage a game link, Discord invite or message. No account required and nothing you enter is stored. Free to use.',
    h1: 'Scam checker',
  },
  '/tools/breach-explainer': {
    title: 'Breach Explainer — Free Tool | The Grid Nexus',
    description: 'Free Breach Explainer from The Grid Nexus. See what a data breach actually exposes. No account required and nothing you enter is stored. Runs in your browser.',
    h1: 'Breach explainer',
  },
  '/tools/ai-tool-finder': {
    title: 'AI Security Tool Finder — Free Tool | The Grid Nexus',
    description: 'Free AI Security Tool Finder from The Grid Nexus. Match a security problem to the right AI tool. No account required and nothing you enter is stored.',
    h1: 'AI security tool finder',
  },
  '/tools/patch-risk-tracker': {
    title: 'Game Patch Risk Tracker — Free Tool | The Grid Nexus',
    description: 'Free Game Patch Risk Tracker from The Grid Nexus. Decide whether a game patch is safe to defer. No account required and nothing you enter is stored.',
    h1: 'Game patch risk tracker',
  },
  '/tools/zero-trust-quiz': {
    title: 'Zero-Trust Readiness Quiz — Free Tool | The Grid Nexus',
    description: 'Free Zero-Trust Readiness Quiz from The Grid Nexus. Benchmark zero-trust maturity honestly. No account required and nothing you enter is stored.',
    h1: 'Zero-trust readiness quiz',
  },
  '/tools/exploit-risk-meter': {
    title: 'Exploit Risk Meter — Free Tool | The Grid Nexus',
    description: 'Free Exploit Risk Meter from The Grid Nexus. Grade a CVE by real-world exploitability. No account required and nothing you enter is stored. Free to use.',
    h1: 'Exploit risk meter',
  },
  '/tools/pc-builder': {
    title: 'AI PC Builder — Free Tool | The Grid Nexus',
    description: 'Free AI PC Builder from The Grid Nexus. Build a balanced, secure gaming PC. No account required and nothing you enter is stored. Runs in your browser.',
    h1: 'AI PC builder',
  },
  '/tools/sentiment-analyzer': {
    title: 'Game Sentiment Analyzer — Free Tool | The Grid Nexus',
    description: 'Free Game Sentiment Analyzer from The Grid Nexus. Read player sentiment before launch day. No account required and nothing you enter is stored.',
    h1: 'Game sentiment analyzer',
  },
  '/tools/news-personalizer': {
    title: 'AI News Personalizer — Free Tool | The Grid Nexus',
    description: 'Free AI News Personalizer from The Grid Nexus. Filter security news to what affects you. No account required and nothing you enter is stored.',
    h1: 'AI news personalizer',
  },
  '/tools/recommendation-engine': {
    title: 'AI Recommendation Engine — Free Tool | The Grid Nexus',
    description: 'Free AI Recommendation Engine from The Grid Nexus. Get tool suggestions from a real use case. No account required and nothing you enter is stored.',
    h1: 'AI recommendation engine',
  },
  '/tools/threat-scanner': {
    title: 'Threat Scanner — Free Tool | The Grid Nexus',
    description: 'Free Threat Scanner from The Grid Nexus. Sweep a domain for known threat exposure. No account required and nothing you enter is stored. Runs in your browser.',
    h1: 'Threat scanner',
  },
  '/tools/community-moderator': {
    title: 'Community Moderator — Free Tool | The Grid Nexus',
    description: 'Free Community Moderator from The Grid Nexus. Keep gaming communities free of scams. No account required and nothing you enter is stored. Free to use.',
    h1: 'Community moderator helper',
  },
  '/tools/gaming-copilot': {
    title: 'Gaming Copilot — Free Tool | The Grid Nexus',
    description: 'Free Gaming Copilot from The Grid Nexus. Get plain-language security help mid-game. No account required and nothing you enter is stored. Runs in your browser.',
    h1: 'Gaming copilot',
  },
  '/tools/release-predictor': {
    title: 'Release Predictor — Free Tool | The Grid Nexus',
    description: 'Free Release Predictor from The Grid Nexus. Forecast launch dates from historical patterns. No account required and nothing you enter is stored.',
    h1: 'Release predictor',
  },

  // ── Section hubs & platform ──────────────────────────────────────────────
  '/security-score': {
    title: 'Free Security Score Checker | The Grid Nexus',
    description: 'Score your personal or small-business security posture in a few minutes: passwords, two-factor, backups, patching and device hygiene, with fixes ranked.',
    h1: 'Security score checker',
  },
  '/breach-sim': {
    title: 'Breach Simulator | Free Security Training | The Grid Nexus',
    description: 'Run a breach simulation to see how an attacker chains phishing, credential reuse and privilege escalation — and where your defences would have stopped them.',
    h1: 'Breach simulator',
  },
  '/live-threat-dashboard': {
    title: 'Live Threat Dashboard | CVEs & Alerts | The Grid Nexus',
    description: 'A live cyber threat dashboard: newly exploited CVEs, active campaigns and breach alerts, filtered so you see what is being exploited rather than all noise.',
    h1: 'Live threat dashboard',
  },

  // ── AI modules & learning ────────────────────────────────────────────────
  '/learn/nexus-path': {
    title: 'Nexus Path: Security Learning Track | The Grid Nexus',
    description: 'Nexus Path is a structured security learning track: short lessons, practical checkpoints and quizzes that build from fundamentals to threat hunting.',
    h1: 'Nexus Path learning track',
  },
  '/pulse/nexus-pulse': {
    title: 'Nexus Pulse: Daily Intelligence Brief | The Grid Nexus',
    description: 'Nexus Pulse is the daily Grid Nexus intelligence brief: the security, AI and gaming developments that changed something, summarised with sources attached.',
    h1: 'Nexus Pulse daily brief',
  },

  // ── Section hubs & platform ──────────────────────────────────────────────
  '/nexus-studio': {
    title: 'Nexus Studio: Publish With Us | The Grid Nexus',
    description: 'Nexus Studio is where contributors draft, review and publish with The Grid Nexus — structured briefs, editorial checks and a clear revision history.',
    h1: 'Nexus Studio',
  },
  '/nexus-intersection': {
    title: 'The Nexus Intersection: Desks Overlap | The Grid Nexus',
    description: 'The Nexus Intersection is where our three desks overlap: AI in games, security in cloud infrastructure, and the stories that need tech, cyber and gaming.',
    h1: 'The Nexus Intersection',
  },
  '/community-threats': {
    title: 'Community Threat Reports | The Grid Nexus',
    description: 'Threat reports submitted and verified by the Grid Nexus community: phishing domains, cheat malware, scam storefronts and the evidence behind each listing.',
    h1: 'Community threat reports',
  },
  '/forums': {
    title: 'Community Forums for Tech & Gaming | The Grid Nexus',
    description: 'Discussion forums for technology, cybersecurity and gaming: ask questions, share findings and get answers from practitioners and other readers.',
    h1: 'Community forums',
  },
  '/podcasts': {
    title: 'Podcasts & Audio Briefings | The Grid Nexus',
    description: 'Grid Nexus podcasts and audio briefings: weekly threat round-ups, long interviews with practitioners, and short explainers for the commute, with transcripts.',
    h1: 'Podcasts and audio briefings',
  },
  '/videos': {
    title: 'Video Coverage & Explainers | The Grid Nexus',
    description: 'Video explainers, tool walkthroughs and event coverage from The Grid Nexus, each paired with a written article so nothing is locked inside a video.',
    h1: 'Video coverage',
  },
  '/mobile': {
    title: 'Grid Nexus Mobile App: Alerts & Tools | The Grid Nexus',
    description: 'Take The Grid Nexus with you: breaking security alerts, saved articles and the free tools in a fast mobile app for iOS and Android devices. Free to use.',
    h1: 'Mobile app',
  },
  '/roadmap': {
    title: 'Platform Roadmap & Feature Voting | The Grid Nexus',
    description: 'See what we are building next and vote on it. The Grid Nexus public roadmap covers new tools, coverage areas and platform features in progress.',
    h1: 'Product roadmap',
  },
  '/newsletter': {
    title: 'Newsletter: Daily Intelligence Briefing | The Grid Nexus',
    description: 'A short daily briefing on security, AI and gaming developments that matter, plus a weekly deep dive. Free, with one-click unsubscribe and no data resale.',
    h1: 'Newsletter',
  },

  // ── Company / legal ──────────────────────────────────────────────────────
  '/about': {
    title: 'About The Grid Nexus | Technology, Security & Gaming',
    description: 'Who publishes The Grid Nexus, how the editorial team works, and the standards we apply to sourcing, corrections and advertising across three desks.',
    h1: 'About The Grid Nexus',
  },
  '/contact': {
    title: 'Contact The Grid Nexus | Editorial & Press',
    description: 'Contact The Grid Nexus for corrections, editorial tips, press enquiries, partnerships or advertising. Response targets and secure tip routes are listed here.',
    h1: 'Contact us',
  },
  '/editorial': {
    title: 'Editorial Policy & Standards | The Grid Nexus',
    description: 'Our editorial policy: sourcing rules, independence from advertisers, correction and update practice, and how we label sponsored or AI-assisted content.',
    h1: 'Editorial policy and standards',
  },
  '/methodology': {
    title: 'Methodology: How We Grade & Verify | The Grid Nexus',
    description: 'How The Grid Nexus produces security grades, checkup scores, threat advisories and scam verdicts — sources, confidence and what we do not claim.',
    h1: 'Methodology and evidence standards',
  },
  '/media': {
    title: 'Media Kit & Press Resources | The Grid Nexus',
    description: 'Press resources for The Grid Nexus: brand assets, audience and traffic data, spokesperson details, and the correct attribution for our reporting.',
    h1: 'Media kit and press resources',
  },
  '/disclosure': {
    title: 'Disclosure & Affiliate Policy | The Grid Nexus',
    description: 'How The Grid Nexus handles affiliate links, sponsorship, review samples and advertising — and how those relationships are disclosed on every affected page.',
    h1: 'Disclosure and affiliate policy',
  },
  '/quality-guidelines': {
    title: 'Content Quality Guidelines | The Grid Nexus',
    description: 'The quality bar every Grid Nexus article must clear: accuracy checks, source requirements, update cadence and the review steps before anything publishes.',
    h1: 'Content quality guidelines',
  },
  '/content-policy': {
    title: 'Content Policy & AI Disclosure | The Grid Nexus',
    description: 'What we publish and what we refuse to publish: disclosure of AI assistance, sponsored content labelling, and rules on security research and exploit detail.',
    h1: 'Content policy',
  },
  '/community-guidelines': {
    title: 'Community Guidelines & Moderation | The Grid Nexus',
    description: 'How to take part in Grid Nexus comments, forums and threat reports: evidence standards, no doxxing, no vendor shilling and the moderation ladder we apply.',
    h1: 'Community guidelines',
  },
  '/privacy': {
    title: 'Privacy Policy: Data, Cookies & Rights | The Grid Nexus',
    description: 'What data The Grid Nexus collects, the legal basis for processing it, how long we keep it, and the access, export and deletion rights you can exercise.',
    h1: 'Privacy policy',
  },
  '/terms': {
    title: 'Terms of Service & Acceptable Use | The Grid Nexus',
    description: 'The terms that govern use of The Grid Nexus: acceptable use, intellectual property, third-party links, liability limits and how disputes are handled.',
    h1: 'Terms of service',
  },

  // ── Non-indexable utility pages ──────────────────────────────────────────
  '/signin': {
    title: 'Signin | The Grid Nexus',
    description: 'Signin on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Signin',
  },
  '/signup': {
    title: 'Signup | The Grid Nexus',
    description: 'Signup on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Signup',
  },
  '/search': {
    title: 'Search | The Grid Nexus',
    description: 'Search on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Search',
  },
  '/notifications': {
    title: 'Notifications | The Grid Nexus',
    description: 'Notifications on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Notifications',
  },
  '/settings': {
    title: 'Settings | The Grid Nexus',
    description: 'Settings on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Settings',
  },
  '/bookmarks': {
    title: 'Bookmarks | The Grid Nexus',
    description: 'Bookmarks on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Bookmarks',
  },
  '/profile': {
    title: 'Profile | The Grid Nexus',
    description: 'Profile on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Profile',
  },
  '/security-profile': {
    title: 'Security Profile Dashboard | The Grid Nexus',
    description: 'Your personal cybersecurity profile and risk assessment dashboard. Track account security scores, breach exposure, and recommended security actions.',
    h1: 'Security Profile Dashboard',
  },
  '/subscription': {
    title: 'Subscription | The Grid Nexus',
    description: 'Subscription on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Subscription',
  },
  '/subscription/management': {
    title: 'Subscription management | The Grid Nexus',
    description: 'Subscription management on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Subscription management',
  },
  '/newsletter/verify': {
    title: 'Newsletter verify | The Grid Nexus',
    description: 'Newsletter verify on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Newsletter verify',
  },
  '/simple': {
    title: 'Simple | The Grid Nexus',
    description: 'Simple on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Simple',
  },
  '/enhanced': {
    title: 'Enhanced | The Grid Nexus',
    description: 'Enhanced on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Enhanced',
  },
  '/enhanced-simple': {
    title: 'Enhanced simple | The Grid Nexus',
    description: 'Enhanced simple on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Enhanced simple',
  },
  '/original-index': {
    title: 'Original index | The Grid Nexus',
    description: 'Original index on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Original index',
  },
  '/tools-old': {
    title: 'Tools old | The Grid Nexus',
    description: 'Tools old on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Tools old',
  },
  '/seo-checklist': {
    title: 'SEO Audit Checklist – Issues & Ideas | The Grid Nexus',
    description: 'Track remediation of SEO issues and improvement ideas from our audit. Interactive checklist covering security headers, content quality, hreflang, canonicals, and more.',
    h1: 'SEO Audit Checklist',
  },
  '/keyword-gap-analysis': {
    title: 'Keyword gap analysis | The Grid Nexus',
    description: 'Keyword gap analysis on The Grid Nexus — a signed-in experience that is deliberately excluded from search results.',
    h1: 'Keyword gap analysis',
  },
  '/sitemap': {
    title: 'Site Map | The Grid Nexus',
    description: 'Complete site map for The Grid Nexus. Find all published pages, articles, tools, guides, and category sections in one place.',
    h1: 'Site Map',
  },
  '/api': {
    title: 'API Documentation | The Grid Nexus',
    description: 'The Grid Nexus API documentation. Access security data, threat intelligence, gaming stats, and AI insights programmatically via REST endpoints.',
    h1: 'API Documentation',
  },

  // ── Article-specific metadata ────────────────────────────────────────────
  '/article/gaming-pc-antivirus-best-2026': {
    title: 'Best Antivirus for Gaming PC 2026 | Complete Guide',
    description: 'We tested Norton, McAfee, Bitdefender and Kaspersky on gaming PCs for FPS impact and security. Here is the best antivirus for gaming in 2026.',
    h1: 'Best Antivirus for Gaming PC 2026',
  },
  '/article/minecraft-server-security-guide': {
    title: 'Minecraft Server Security Guide 2026 | Protect Your Server',
    description: 'Learn how to secure your Minecraft server against DDoS attacks, exploits, and unauthorized access. Essential security guide for server administrators.',
    h1: 'Minecraft Server Security Guide 2026',
  },
  '/article/gaming-pc-security-hardening-guide': {
    title: 'Gaming PC Security Hardening Guide 2026 | Step-by-Step',
    description: 'Complete step-by-step guide to hardening your gaming PC for maximum security. Includes firewall configuration, encryption, and malware prevention tips.',
    h1: 'Gaming PC Security Hardening Guide 2026',
  },
  '/article/steam-account-security-guide': {
    title: 'Steam Account Security Guide 2026 | Protect Your Games',
    description: 'Protect your Steam account from hackers, phishing, and scams. Complete security guide with 2FA setup, password best practices, and recovery options.',
    h1: 'Steam Account Security Guide 2026',
  },
  '/article/2fa-setup-gaming-accounts': {
    title: '2FA Setup for Gaming Accounts 2026 | Complete Guide',
    description: 'Enable two-factor authentication for all your gaming accounts. Step-by-step guides for Steam, Epic, PlayStation, Xbox, and Nintendo accounts.',
    h1: '2FA Setup for Gaming Accounts 2026',
  },
};

/** Article <title> tag: "[Headline] | The Grid Nexus" */
export function getArticleTitle(headline: string): string {
  const clean = (headline || 'Article').trim();
  const full  = `${clean} | ${SITE_NAME}`;
  return full.length > 60 ? full.substring(0, 57) + '…' : full;
}

/** Resolve metadata for a given pathname. */
export function getPageMetadata(
  pathname: string,
  article?: { title?: string; excerpt?: string }
): PageMeta {
  const base = pathname.replace(/\/$/, '') || '/';

  // Article detail pages
  if (article && base.startsWith('/article/')) {
    const rawDesc = (article.excerpt || '').slice(0, 155);
    return {
      title:       getArticleTitle(article.title || ''),
      description: rawDesc || `Read ${article.title || 'this article'} on ${SITE_NAME}.`,
      h1:          article.title || 'Article',
    };
  }

  return (
    PAGE_METADATA[base] ?? {
      title:       SITE_NAME,
      description: 'Tech, Security & Gaming Intelligence from The Grid Nexus.',
      h1:          SITE_NAME,
    }
  );
}
