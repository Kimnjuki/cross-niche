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
    toolSlug: '/tools/community-moderator',
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
  {
    id: 'alert-6',
    title: 'Riot Games API Key Leak — Secure Your Keys',
    severity: 'high',
    source: 'Developer Advisory',
    affectedPlatform: 'Riot Games',
    timestamp: '3 days ago',
    description: 'Exposed Riot API keys being used for unauthorized data scraping. Rotate your keys and check for unusual API usage in Riot Developer Portal.',
    toolSlug: '/tools/ioc-lookup',
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
    id: 'scan-server',
    label: 'Scan My Game Server',
    icon: 'Server',
    description: 'Check domain/IP for CVEs, open ports, and misconfigurations',
    toolSlug: '/tools/threat-scanner',
    color: 'from-violet-500 to-purple-600',
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
    id: 'analyze-game',
    label: 'Analyze Game Reviews',
    icon: 'MessageSquare',
    description: 'See what players say about security in any game',
    toolSlug: '/tools/sentiment-analyzer',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'ask-copilot',
    label: 'Ask the Gaming Copilot',
    icon: 'Bot',
    description: 'Get AI answers about game security, hardware, and CVEs',
    toolSlug: '/tools/gaming-copilot',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'track-patch',
    label: 'Track Patch Risks',
    icon: 'AlertTriangle',
    description: 'See which game patches introduce security risks',
    toolSlug: '/tools/patch-risk-tracker',
    color: 'from-amber-500 to-orange-600',
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
    name: 'Threat Detection',
    description: 'Find vulnerabilities and compromise signs across your gaming life',
    icon: 'Shield',
    tools: [
      { slug: '/tools/security-scanner', name: 'Security Scanner', tagline: 'Full domain & server scan' },
      { slug: '/tools/threat-scanner', name: 'Real-Time Threat Scanner', tagline: 'Live threat analysis' },
      { slug: '/tools/steam-scanner', name: 'Steam Security Scanner', tagline: 'Steam account scan' },
      { slug: '/tools/nexusguard', name: 'NexusGuard', tagline: 'Security monitoring dashboard' },
      { slug: '/tools/patch-risk-tracker', name: 'Patch Risk Tracker', tagline: 'Patch vulnerability tracking' },
    ],
  },
  {
    name: 'Account Security',
    description: 'Secure your gaming identities across all platforms',
    icon: 'Lock',
    tools: [
      { slug: '/tools/gaming-security-checkup', name: 'Gaming Security Checkup', tagline: '7-point account audit' },
      { slug: '/tools/breach-explainer', name: 'Breach Explainer', tagline: 'Understand past breaches' },
      { slug: '/tools/ioc-lookup', name: 'IOC Threat-Hunting Lookup', tagline: 'Check indicators of compromise' },
      { slug: '/tools/exploit-risk-meter', name: 'Exploit Risk Meter', tagline: 'CVE risk scoring' },
      { slug: '/tools/zero-trust-quiz', name: 'Zero-Trust Readiness Quiz', tagline: 'Test your security knowledge' },
    ],
  },
  {
    name: 'Intelligence & Analysis',
    description: 'AI-powered analysis of games, reviews, and security threats',
    icon: 'Brain',
    tools: [
      { slug: '/tools/sentiment-analyzer', name: 'Game Sentiment Analyzer', tagline: 'Review intelligence' },
      { slug: '/tools/news-personalizer', name: 'AI News Personalizer', tagline: 'Curated security news feed' },
      { slug: '/tools/security-briefing', name: 'Security Briefing Room', tagline: 'Daily threat briefings' },
      { slug: '/tools/release-predictor', name: 'Game Release Predictor', tagline: 'Signal-based launch predictions' },
      { slug: '/tools/ai-tool-finder', name: 'AI Security Tool Finder', tagline: 'Find the right tool for you' },
    ],
  },
  {
    name: 'AI Assistants & Community',
    description: 'Interactive AI tools and community management',
    icon: 'Bot',
    tools: [
      { slug: '/tools/gaming-copilot', name: 'Gaming Copilot AI', tagline: 'Your security AI assistant' },
      { slug: '/tools/community-moderator', name: 'Community AI Moderator', tagline: 'Content moderation engine' },
      { slug: '/tools/recommendation-engine', name: 'AI Recommendation Engine', tagline: 'Game & hardware picks' },
      { slug: '/tools/pc-builder', name: 'AI PC Builder', tagline: 'Security-scored builds' },
      { slug: '/tools/vr-cyber-training', name: 'VR Cyber Training', tagline: 'Immersive security learning' },
    ],
  },
];

// ── Tool Analytics (fallback stats for demo mode) ───────────────────────

export const toolUsageFallback: ToolUsageStats[] = [
  { toolSlug: '/tools/threat-scanner', toolName: 'Threat Scanner', usageCount: 1240, category: 'Threat Detection' },
  { toolSlug: '/tools/steam-scanner', toolName: 'Steam Scanner', usageCount: 980, category: 'Threat Detection' },
  { toolSlug: '/tools/gaming-copilot', toolName: 'Gaming Copilot', usageCount: 760, category: 'AI Assistants' },
  { toolSlug: '/tools/sentiment-analyzer', toolName: 'Sentiment Analyzer', usageCount: 540, category: 'Intelligence' },
  { toolSlug: '/tools/gaming-security-checkup', toolName: 'Gaming Security Checkup', usageCount: 490, category: 'Account Security' },
  { toolSlug: '/tools/security-scanner', toolName: 'Security Scanner', usageCount: 410, category: 'Threat Detection' },
  { toolSlug: '/tools/release-predictor', toolName: 'Release Predictor', usageCount: 380, category: 'Intelligence' },
  { toolSlug: '/tools/news-personalizer', toolName: 'News Personalizer', usageCount: 310, category: 'Intelligence' },
  { toolSlug: '/tools/pc-builder', toolName: 'AI PC Builder', usageCount: 280, category: 'AI Assistants' },
  { toolSlug: '/tools/community-moderator', toolName: 'Community Moderator', usageCount: 210, category: 'AI Assistants' },
  { toolSlug: '/tools/ioc-lookup', toolName: 'IOC Lookup', usageCount: 190, category: 'Account Security' },
  { toolSlug: '/tools/patch-risk-tracker', toolName: 'Patch Risk Tracker', usageCount: 170, category: 'Threat Detection' },
  { toolSlug: '/tools/recommendation-engine', toolName: 'Recommendation Engine', usageCount: 160, category: 'AI Assistants' },
  { toolSlug: '/tools/exploit-risk-meter', toolName: 'Exploit Risk Meter', usageCount: 140, category: 'Account Security' },
  { toolSlug: '/tools/breach-explainer', toolName: 'Breach Explainer', usageCount: 120, category: 'Account Security' },
  { toolSlug: '/tools/nexusguard', toolName: 'NexusGuard', usageCount: 90, category: 'Threat Detection' },
  { toolSlug: '/tools/zero-trust-quiz', toolName: 'Zero-Trust Quiz', usageCount: 80, category: 'Account Security' },
  { toolSlug: '/tools/ai-tool-finder', toolName: 'AI Tool Finder', usageCount: 60, category: 'Intelligence' },
  { toolSlug: '/tools/security-briefing', toolName: 'Security Briefing Room', usageCount: 50, category: 'Intelligence' },
  { toolSlug: '/tools/vr-cyber-training', toolName: 'VR Cyber Training', usageCount: 30, category: 'AI Assistants' },
];
