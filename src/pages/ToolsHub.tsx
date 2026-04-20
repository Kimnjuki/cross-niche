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
  ArrowRight,
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
    badge: 'New',
    badgeVariant: 'default' as const,
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
            Subscribe to the Live Threat Dashboard to get instant alerts when gaming platforms you use are compromised.
          </p>
          <Button asChild variant="default">
            <Link to="/live-threat-dashboard" className="flex items-center gap-2 justify-center">
              <Activity className="h-4 w-4" /> Open Threat Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
