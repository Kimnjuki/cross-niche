import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Zap,
  Activity,
  ScanLine,
  Target,
  Gamepad2,
  ArrowRight,
  Search,
  AlertTriangle,
  Star,
  AlertOctagon,
  BookOpen,
  Users,
  ChevronRight,
} from 'lucide-react';

const tools = [
  {
    href: '/tools/nexusguard',
    icon: Shield,
    name: 'NexusGuard',
    tagline: 'Personalized Threat Assessment',
    description:
      'Answer 5 questions about your stack and get a tailored threat report — severity breakdown, patch checklist, and compliance notes.',
    badge: 'AI-Powered',
    badgeVariant: 'default' as const,
    gradient: 'from-security/20 to-security/5',
    iconColor: 'text-security',
  },
  {
    href: '/tools/ioc-lookup',
    icon: Search,
    name: 'IOC Threat-Hunting Lookup',
    tagline: 'IP · Domain · Hash · Email Analysis',
    description:
      'Analyse IPs, domains, file hashes, and email addresses across VirusTotal, AbuseIPDB, Shodan & GreyNoise in one shot. See risk score, malware families, and Nexus verdict.',
    badge: 'New',
    badgeVariant: 'default' as const,
    gradient: 'from-security/20 to-security/5',
    iconColor: 'text-security',
  },
  {
    href: '/tools/gaming-security-checkup',
    icon: Gamepad2,
    name: 'Gaming Security Checkup',
    tagline: 'Multi-Platform Account Security Audit',
    description:
      'Platform-specific 7-point security audit for Steam, PSN, Xbox, Riot Games, Epic & Battle.net. Get your Fort Knox → Exposed tier in 3 minutes.',
    badge: 'New',
    badgeVariant: 'default' as const,
    gradient: 'from-gaming/20 to-gaming/5',
    iconColor: 'text-gaming',
  },
  {
    href: '/tools/breach-explainer',
    icon: AlertTriangle,
    name: 'Breach Explainer',
    tagline: 'Plain-Language Incident Breakdowns',
    description:
      'Understand Change Healthcare, AT&T 73M, Salt Typhoon, PowerSchool & Snowflake breaches — what was stolen, who\'s affected, and exactly what to do next.',
    badge: 'New',
    badgeVariant: 'default' as const,
    gradient: 'from-destructive/20 to-destructive/5',
    iconColor: 'text-destructive',
  },
  {
    href: '/tools/ai-tool-finder',
    icon: Star,
    name: 'AI Security Tool Finder',
    tagline: 'Curated AI Tool Directory',
    description:
      '12+ curated AI security tools with Nexus verdicts, pros/cons, and recommendations. Filter by use case (SOC, gaming, code security), price tier, and skill level.',
    badge: 'New',
    badgeVariant: 'default' as const,
    gradient: 'from-tech/20 to-tech/5',
    iconColor: 'text-tech',
  },
  {
    href: '/tools/patch-risk-tracker',
    icon: Gamepad2,
    name: 'Game Patch Risk Tracker',
    tagline: 'Live Security Risks Across 8 Games',
    description:
      'Active vulnerabilities, CVE IDs, and player actions for Fortnite, Valorant, CS2, Minecraft, GTA Online, Apex Legends, WoW, and LoL.',
    badge: 'Live',
    badgeVariant: 'destructive' as const,
    gradient: 'from-gaming/20 to-gaming/5',
    iconColor: 'text-gaming',
  },
  {
    href: '/tools/zero-trust-quiz',
    icon: Shield,
    name: 'Zero-Trust Readiness Quiz',
    tagline: '7-Domain Org Security Assessment',
    description:
      '15 questions across identity, device management, network, patching, backups, IR, and monitoring. Get a scored tier from "Exposed" to "Zero-Trust Architect" with a fix plan.',
    badge: 'New',
    badgeVariant: 'default' as const,
    gradient: 'from-security/20 to-security/5',
    iconColor: 'text-security',
  },
  {
    href: '/tools/exploit-risk-meter',
    icon: AlertOctagon,
    name: 'Exploit Risk Meter',
    tagline: 'CVE Severity for Software You Use',
    description:
      'Real-time CVE risk levels for Windows 11, Chrome, Fortnite, Valorant, Steam, Discord, OBS, and VS Code — with patch status and exploitation state.',
    badge: 'Live',
    badgeVariant: 'destructive' as const,
    gradient: 'from-destructive/20 to-destructive/5',
    iconColor: 'text-destructive',
  },
  {
    href: '/tools/steam-scanner',
    icon: Gamepad2,
    name: 'Steam Security Scanner',
    tagline: 'Steam Account Health Check',
    description:
      '10 checks in 2 minutes: Steam Guard, API key exposure, trade confirmation, privacy settings, and more. Get a scored report with exact fix steps.',
    badge: 'Free',
    badgeVariant: 'outline' as const,
    gradient: 'from-gaming/20 to-gaming/5',
    iconColor: 'text-gaming',
  },
  {
    href: '/breach-sim',
    icon: Target,
    name: 'Breach Simulator',
    tagline: 'Live Attack Decision Trees',
    description:
      'Step through phishing, ransomware, and data-breach scenarios. Every choice updates your real-time risk and cost exposure.',
    badge: 'Interactive',
    badgeVariant: 'secondary' as const,
    gradient: 'from-gaming/20 to-gaming/5',
    iconColor: 'text-gaming',
  },
  {
    href: '/security-score',
    icon: Zap,
    name: 'Security Score',
    tagline: 'Personal Security Self-Assessment',
    description:
      'Ten questions about your gaming account hygiene. Get a scored report with prioritised recommendations in under two minutes.',
    badge: 'Free',
    badgeVariant: 'outline' as const,
    gradient: 'from-tech/20 to-tech/5',
    iconColor: 'text-tech',
  },
  {
    href: '/tools/security-scanner',
    icon: ScanLine,
    name: 'Security Scanner',
    tagline: 'Website Vulnerability Check',
    description:
      'Enter any URL and get a security score with a full vulnerability list and actionable fix recommendations.',
    badge: 'Free',
    badgeVariant: 'outline' as const,
    gradient: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    href: '/live-threat-dashboard',
    icon: Activity,
    name: 'Live Threat Dashboard',
    tagline: 'Real-Time Gaming Threat Intel',
    description:
      'Subscribe to CVE tags and gaming platform alerts. Get notified the moment a breach or exploit hits your stack.',
    badge: 'Live',
    badgeVariant: 'destructive' as const,
    gradient: 'from-destructive/20 to-destructive/5',
    iconColor: 'text-destructive',
  },
];

export default function ToolsHub() {
  return (
    <Layout>
      <SEOHead
        title="Security Tools — The Grid Nexus"
        description="Free interactive security tools for gamers: threat assessments, breach simulations, security score checker, website scanner, and live threat dashboard."
        keywords={['gaming security tools', 'breach simulator', 'security score', 'threat assessment', 'vulnerability scanner']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-security/10">
              <Shield className="h-8 w-8 text-security" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Security Tools</h1>
              <p className="text-muted-foreground text-sm mt-1">Free tools to protect your gaming life</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            Hands-on security tools built for gamers. No sign-up required for most — just open and use.
          </p>
        </div>

        {/* Nexus Security Suite unified CTA */}
        <div className="mb-10 p-6 rounded-2xl border border-[#00F0FF]/30 bg-gradient-to-r from-[#00F0FF]/5 via-[#B026FF]/5 to-black/40 backdrop-blur">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
                <span className="text-xs text-[#00F0FF] uppercase tracking-wider font-semibold">
                  Nexus Security Suite — New
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mb-1">
                Start with your Nexus Security Profile
              </h2>
              <p className="text-sm text-gray-400 max-w-lg">
                Get a unified view of your security posture across accounts, devices, and games. The Suite routes you to the right tool — Detection, Simulation, Intel, or Audit — based on your risk profile.
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button asChild className="bg-[#00F0FF] text-black font-bold hover:bg-[#00F0FF]/80">
                <Link to="/security-profile" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" /> My Security Profile
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-[#FF007A]/40 text-[#FF007A] hover:bg-[#FF007A]/10">
                <Link to="/community-threats" className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Community Threat Hub
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
            <span>Suite modules:</span>
            {["Detection → NexusGuard", "Simulation → Breach Sim", "Intel → Threat Dashboard", "Audit → Security Scanner", "Learning → NexusPath"].map((m) => (
              <span key={m} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Tool grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.href}
                className={`group relative overflow-hidden border hover:border-primary/50 transition-colors bg-gradient-to-br ${tool.gradient}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Icon className={`h-7 w-7 ${tool.iconColor}`} />
                    <Badge variant={tool.badgeVariant} className="text-xs shrink-0">
                      {tool.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <p className="text-sm font-medium text-muted-foreground">{tool.tagline}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {tool.description}
                  </p>
                  <Button asChild className="w-full group-hover:gap-3 transition-all">
                    <Link to={tool.href} className="flex items-center gap-2">
                      Launch Tool <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="border border-border rounded-xl p-8 bg-muted/30 text-center max-w-2xl mx-auto">
          <h2 className="font-display font-semibold text-xl mb-2">Stay ahead of threats</h2>
          <p className="text-muted-foreground text-sm mb-5">
            Subscribe to the Live Threat Dashboard, or join the Community Threat Hub to crowd-source intelligence with other gamers.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild variant="default">
              <Link to="/live-threat-dashboard" className="flex items-center gap-2">
                <Activity className="h-4 w-4" /> Open Threat Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/community-threats" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Community Threats
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
