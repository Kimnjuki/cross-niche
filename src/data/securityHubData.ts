/**
 * Security Hub Dashboard data
 * Powers the dynamic SecurityHub dashboard — replaces static ToolsHub.
 * Data is fallback for when Convex is not available (demo mode).
 */

export interface ThreatAlert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  affectedPlatform: string;
  timestamp: string;
  description: string;
  toolSlug: string;
}

export interface QuickScanOption {
  id: string;
  label: string;
  icon: string;
  description: string;
  toolSlug: string;
  color: string;
}

export interface ToolUsageStats {
  toolSlug: string;
  toolName: string;
  usageCount: number;
  category: string;
}

// ── Trending Threat Alerts ──────────────────────────────────────────────

export const threatAlerts: ThreatAlert[] = [
  {
    id: 'alert-1',
    title: 'Steam Phishing Campaign — Fake Trade Offers Spreading',
    severity: 'critical',
    source: 'Community Intel',
    affectedPlatform: 'Steam',
    timestamp: '2 hours ago',
    description: 'A new wave of Steam trade offer phishing links is targeting inventory items. Links lead to fake Steam login pages that steal credentials.',
    toolSlug: '/tools/steam-scanner',
  },
  {
    id: 'alert-2',
    title: 'Discord Nitro Scam — Malware via Voice Chat Mods',
    severity: 'high',
    source: 'Threat Intel Feed',
    affectedPlatform: 'Discord',
    timestamp: '6 hours ago',
    description: 'Attackers are distributing malware through fake Discord Nitro giveaways in voice channels. Payload installs info-stealing trojan.',
    toolSlug: '/tools/scam-check',
  },
  {
    id: 'alert-3',
    title: 'CVE-2026-4417 — Critical RCE in Unreal Engine 5.4',
    severity: 'critical',
    source: 'NVD',
    affectedPlatform: 'PC Gaming',
    timestamp: '12 hours ago',
    description: 'Remote code execution vulnerability affecting all games built on Unreal Engine 5.4.x. Patch available — verify your game servers.',
    toolSlug: '/tools/patch-risk-tracker',
  },
  {
    id: 'alert-4',
    title: 'PlayStation Network Credential Stuffing Surge',
    severity: 'high',
    source: 'Community Intel',
    affectedPlatform: 'PlayStation',
    timestamp: '1 day ago',
    description: 'Credential stuffing attacks targeting PSN accounts using credentials from past breaches. 2FA blocks most attempts — enable if you haven\'t.',
    toolSlug: '/tools/gaming-security-checkup',
  },
  {
    id: 'alert-5',
    title: 'Minecraft Server Log4Shell Scanning Spike',
    severity: 'medium',
    source: 'Threat Intel Feed',
    affectedPlatform: 'Minecraft',
    timestamp: '2 days ago',
    description: 'Automated scanners probing public Minecraft servers for unpatched Log4Shell (CVE-2021-44228). Patch your Java runtime if you host.',
    toolSlug: '/tools/threat-scanner',
  },
];

// ── Quick Scan Options ─────────────────────────────────────────────────

export const quickScanOptions: QuickScanOption[] = [
  {
    id: 'scan-account',
    label: 'Scan My Gaming Accounts',
    icon: 'Scan',
    description: 'Check Steam, PSN, Xbox, and Epic for compromise signs',
    toolSlug: '/tools/gaming-security-checkup',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'scan-steam',
    label: 'Scan Steam Account',
    icon: 'Gamepad2',
    description: 'Check login locations, API keys, and trade anomalies',
    toolSlug: '/tools/steam-scanner',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'check-link',
    label: 'Check a Suspicious Link',
    icon: 'AlertTriangle',
    description: 'Triage a URL, message, or game/mod name for scam patterns',
    toolSlug: '/tools/scam-check',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'scan-server',
    label: 'Scan My Game Server',
    icon: 'Server',
    description: 'Check domain/IP for CVEs, open ports, and misconfigurations',
    toolSlug: '/tools/threat-scanner',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'track-patch',
    label: 'Track Patch Risks',
    icon: 'AlertTriangle',
    description: 'See which game patches introduce security risks',
    toolSlug: '/tools/patch-risk-tracker',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'ask-copilot',
    label: 'Ask the Gaming Copilot',
    icon: 'Bot',
    description: 'Get answers about game security, hardware, and CVEs',
    toolSlug: '/tools/gaming-copilot',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'learn-security',
    label: 'Test Security Knowledge',
    icon: 'Shield',
    description: 'Zero-trust readiness quiz for gamers',
    toolSlug: '/tools/zero-trust-quiz',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'analyze-game',
    label: 'Analyze Game Reviews',
    icon: 'MessageSquare',
    description: 'See what players say about security in any game',
    toolSlug: '/tools/sentiment-analyzer',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'track-release',
    label: 'Track Game Releases',
    icon: 'Calendar',
    description: 'Signal-based launch predictions and risk signals',
    toolSlug: '/tools/release-predictor',
    color: 'from-violet-500 to-purple-600',
  },
];

// ── Tool Categories (for browsing) ──────────────────────────────────────

export interface ToolCategory {
  name: string;
  description: string;
  tools: { slug: string; name: string; tagline: string }[];
  icon: string;
}

export const toolCategories: ToolCategory[] = [
  {
    name: 'Secure My Account',
    description: 'Protect your gaming identities — Steam, PSN, Xbox, Epic — and understand past breaches.',
    icon: 'Lock',
    tools: [
      { slug: '/tools/gaming-security-checkup', name: 'Gaming Security Checkup', tagline: '7-point account audit' },
      { slug: '/tools/steam-scanner', name: 'Steam Security Scanner', tagline: 'Steam account health check' },
      { slug: '/tools/breach-explainer', name: 'Breach Explainer', tagline: 'Understand past breaches' },
    ],
  },
  {
    name: 'Check a Link / Message',
    description: 'Triage a suspicious URL, Discord message, or game/mod name for scam patterns.',
    icon: 'AlertTriangle',
    tools: [
      { slug: '/tools/scam-check', name: 'Scam Check', tagline: 'Link & message triage' },
    ],
  },
  {
    name: 'Manage a Game Server',
    description: 'Scan your server/domain for CVEs, open ports, and patch-related risks.',
    icon: 'Server',
    tools: [
      { slug: '/tools/threat-scanner', name: 'Real-Time Threat Scanner', tagline: 'Live threat analysis' },
      { slug: '/tools/patch-risk-tracker', name: 'Patch Risk Tracker', tagline: 'Patch vulnerability tracking' },
    ],
  },
  {
    name: 'Learn Gaming Security',
    description: 'Ask security questions and test your knowledge with curated content.',
    icon: 'Bot',
    tools: [
      { slug: '/tools/gaming-copilot', name: 'Gaming Copilot AI', tagline: 'Security Q&A assistant' },
      { slug: '/tools/zero-trust-quiz', name: 'Zero-Trust Readiness Quiz', tagline: 'Test your security knowledge' },
    ],
  },
  {
    name: 'Research Games',
    description: 'Analyze player sentiment and release signals for any game.',
    icon: 'Search',
    tools: [
      { slug: '/tools/sentiment-analyzer', name: 'Game Sentiment Analyzer', tagline: 'Review intelligence' },
      { slug: '/tools/release-predictor', name: 'Game Release Predictor', tagline: 'Launch risk signals' },
    ],
  },
];

// ── Tool Analytics (fallback stats for demo mode) ───────────────────────

export const toolUsageFallback: ToolUsageStats[] = [
  { toolSlug: '/tools/threat-scanner', toolName: 'Threat Scanner', usageCount: 1240, category: 'Manage a Game Server' },
  { toolSlug: '/tools/steam-scanner', toolName: 'Steam Scanner', usageCount: 980, category: 'Secure My Account' },
  { toolSlug: '/tools/gaming-copilot', toolName: 'Gaming Copilot', usageCount: 760, category: 'Learn Gaming Security' },
  { toolSlug: '/tools/sentiment-analyzer', toolName: 'Sentiment Analyzer', usageCount: 540, category: 'Research Games' },
  { toolSlug: '/tools/gaming-security-checkup', toolName: 'Gaming Security Checkup', usageCount: 490, category: 'Secure My Account' },
  { toolSlug: '/tools/release-predictor', toolName: 'Release Predictor', usageCount: 380, category: 'Research Games' },
  { toolSlug: '/tools/scam-check', toolName: 'Scam Check', usageCount: 310, category: 'Check a Link / Message' },
  { toolSlug: '/tools/patch-risk-tracker', toolName: 'Patch Risk Tracker', usageCount: 170, category: 'Manage a Game Server' },
  { toolSlug: '/tools/breach-explainer', toolName: 'Breach Explainer', usageCount: 120, category: 'Secure My Account' },
  { toolSlug: '/tools/zero-trust-quiz', toolName: 'Zero-Trust Quiz', usageCount: 80, category: 'Learn Gaming Security' },
];
