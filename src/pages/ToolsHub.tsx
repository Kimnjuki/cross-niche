import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Gamepad2, Search, Bot, ArrowRight, LifeBuoy, Lock, BarChart3, AlertTriangle, Download } from 'lucide-react';

const tools = [
  {
    href: '/tools/gaming-security-checkup',
    icon: Gamepad2,
    name: 'Gaming Security Checkup',
    tagline: '7-point account audit',
    description:
      'Answer a short questionnaire across email/recovery, account auth, device hygiene, downloads and payments. Get a self-reported readiness band — a measure of your habits, not a device or account audit.',
    badge: 'Free',
    badgeVariant: 'outline' as const,
    iconColor: 'text-gaming',
  },
  {
    href: '/tools/steam-scanner',
    icon: Shield,
    name: 'Steam Security Scanner',
    tagline: 'Steam account health check',
    description:
      '10 checks in 2 minutes: Steam Guard, API key exposure, trade confirmation, privacy settings and more, with exact fix steps.',
    badge: 'Free',
    badgeVariant: 'outline' as const,
    iconColor: 'text-gaming',
  },
  {
    href: '/tools/scam-check',
    icon: AlertTriangle,
    name: 'Scam Check',
    tagline: 'Link & message triage',
    description:
      'How we triage a suspicious link or message: official-domain matching, lookalike and secret-token detection, and honest verdicts that never call an unknown "safe".',
    badge: 'Free',
    badgeVariant: 'outline' as const,
    iconColor: 'text-gaming',
  },
  {
    href: '/tools/gaming-copilot',
    icon: Bot,
    name: 'Gaming Copilot',
    tagline: 'Gaming security Q&A',
    description:
      'Rule-based Q&A assistant for common gaming security questions. Answers come from a curated knowledge base, not a live AI model.',
    badge: 'FAQ',
    badgeVariant: 'default' as const,
    iconColor: 'text-[#B026FF]',
  },
  {
    href: '/tools/threat-scanner',
    icon: Search,
    name: 'Real-Time Threat Scanner',
    tagline: 'Server/domain threat scan',
    description:
      'Check a domain or IP for known CVEs, open ports, misconfigurations, and threat-intel indicators. Results are indicative, not a clearance.',
    badge: 'Internal',
    badgeVariant: 'default' as const,
    iconColor: 'text-security',
  },
  {
    href: '/tools/patch-risk-tracker',
    icon: AlertTriangle,
    name: 'Patch Risk Tracker',
    tagline: 'Patch vulnerability tracking',
    description:
      'Track which game patches introduce security risks, with CVE references and suggested rollback or mitigation steps.',
    badge: 'Guide',
    badgeVariant: 'outline' as const,
    iconColor: 'text-security',
  },
  {
    href: '/tools/breach-explainer',
    icon: LifeBuoy,
    name: 'Breach Explainer',
    tagline: 'Understand past breaches',
    description:
      'Plain-language explanations of major gaming-related data breaches: what was exposed, what to do, and whether your accounts are likely affected.',
    badge: 'Guide',
    badgeVariant: 'outline' as const,
    iconColor: 'text-gaming',
  },
  {
    href: '/tools/zero-trust-quiz',
    icon: Shield,
    name: 'Zero-Trust Readiness Quiz',
    tagline: 'Test your security knowledge',
    description:
      'A short quiz that scores your security habits across accounts, devices, downloads, and social engineering resistance.',
    badge: 'Quiz',
    badgeVariant: 'outline' as const,
    iconColor: 'text-gaming',
  },
  {
    href: '/tools/sentiment-analyzer',
    icon: BarChart3,
    name: 'Game Sentiment Analyzer',
    tagline: 'Review intelligence',
    description:
      'Aggregate player sentiment about a game\'s security, privacy, and monetization practices from public reviews and discussions.',
    badge: 'Research',
    badgeVariant: 'outline' as const,
    iconColor: 'text-security',
  },
  {
    href: '/tools/release-predictor',
    icon: ArrowRight,
    name: 'Game Release Predictor',
    tagline: 'Launch risk signals',
    description:
      'Signal-based predictions for upcoming game releases: timing, platform, and potential security risks at launch.',
    badge: 'Research',
    badgeVariant: 'outline' as const,
    iconColor: 'text-security',
  },
];

const resources = [
  {
    href: '/recover',
    icon: LifeBuoy,
    name: 'Account Recovery',
    description:
      'Verified step-by-step recovery for Steam, Discord, Epic, EA, Riot, PlayStation and Xbox — no credentials ever requested.',
  },
  {
    href: '/platforms',
    icon: Lock,
    name: 'Platform Security Hubs',
    description:
      'Official domains, two-factor authentication, recovery workflows and the scam patterns that target each platform.',
  },
  {
    href: '/games',
    icon: BarChart3,
    name: 'Security Grades',
    description:
      'Document-based per-game security grades with platform scope, evidence sources, review dates and explicit unknowns.',
  },
];

export default function ToolsHub() {
  return (
    <Layout>
      <SEOHead
        title="Free Gaming Security Tools | The Grid Nexus"
        description="Free browser-based gaming security tools: account checkup, Steam scanner, IOC lookup and gaming copilot. No account required, nothing stored."
        keywords={['gaming security tools', 'account checkup', 'steam scanner', 'ioc lookup', 'gaming copilot']}
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
              <h1 className="font-display font-bold text-4xl">Free gaming security tools</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Check your accounts, triage a suspicious link, and get plain-language answers
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground">
            These tools run in your browser and process only what you enter. No account required, and
            nothing you enter is stored. Read exactly what each tool collects in our{' '}
            <a href="/privacy/tools" className="text-foreground underline underline-offset-2">
              tool privacy disclosure
            </a>
            .
          </p>
        </div>

        {/* Tool grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.href} className="group relative overflow-hidden border hover:border-primary/50 transition-colors bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Icon className={`h-7 w-7 ${tool.iconColor}`} />
                    <Badge variant={tool.badgeVariant} className="text-xs">
                      {tool.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <p className="text-sm font-medium text-muted-foreground">{tool.tagline}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{tool.description}</p>
                  <Button asChild className="w-full group-hover:gap-3 transition-all">
                    <Link to={tool.href} className="flex items-center gap-2">
                      Open tool <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Guides & hubs */}
        <h2 className="font-display font-semibold text-2xl mb-6">More player-security resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((r) => {
            const Icon = r.icon;
            return (
              <Card key={r.href} className="border hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <Icon className="h-6 w-6 text-gaming mb-2" />
                  <CardTitle className="text-lg">{r.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{r.description}</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={r.href} className="flex items-center gap-2">
                      Explore <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
