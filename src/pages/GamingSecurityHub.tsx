import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Smartphone, AlertTriangle, ExternalLink, Clock, Users } from 'lucide-react';

const PILLARS = [
  {
    icon: Shield,
    title: 'Account Protection',
    description: 'Secure Steam, PlayStation, Xbox, Epic, and Discord accounts with 2FA, strong passwords, and breach monitoring.',
    href: '/gaming/security-guides',
  },
  {
    icon: Lock,
    title: 'Scams & Threats',
    description: 'Learn to identify phishing, fake giveaways, social engineering, and other threats targeting gamers.',
    href: '/gaming?q=scams',
  },
  {
    icon: AlertTriangle,
    title: 'PC & Device Security',
    description: 'Antivirus for gaming, malware removal, firmware updates, and network hardening for gaming setups.',
    href: '/article/gaming-pc-antivirus-best-2026',
  },
];

const KEY_STATISTICS = [
  { value: '340%', label: 'YoY increase in gaming account takeovers' },
  { value: '15B+', label: 'Stolen gaming credentials circulating' },
  { value: '$1,900', label: 'Avg. Steam library value at risk' },
  { value: '99.9%', label: 'Of attacks blocked by TOTP 2FA' },
];

const RECOMMENDED_TOOLS = [
  { icon: Shield, label: 'Steam Security Scanner', href: '/tools/steam-scanner', desc: 'Scan your Steam account for compromise' },
  { icon: Lock, label: 'Gaming Security Checkup', href: '/tools/gaming-security-checkup', desc: 'Quick 3-question risk assessment' },
  { icon: Smartphone, label: 'Security Score', href: '/security-score', desc: 'Calculate your overall security posture' },
];

export default function GamingSecurityHub() {
  return (
    <Layout>
      <SEOHead
        title="Gaming Security Hub: Protect Your Gaming Accounts & Privacy"
        description="The ultimate gaming security resource. Learn how to secure Steam, PlayStation, Xbox, Discord, and Epic accounts, avoid scams, and harden your gaming PC against malware."
        keywords={['gaming security', 'gaming account protection', 'steam security', 'xbox security', 'gaming privacy', 'gaming scams', 'account takeover', '2FA', 'gaming malware']}
        canonical="https://thegridnexus.com/gaming/security"
        type="website"
      />

      <article className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-security/10 border border-security/20 text-sm mb-6">
            <Shield className="h-4 w-4 text-security" />
            <span className="text-security font-medium">Cornerstone Content</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6 text-foreground">
            Gaming Security Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Protect your gaming accounts, privacy, and devices from hackers, scams, and malware.
            Covers Steam, PlayStation, Xbox, Epic Games, Discord, and more.
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12" aria-label="Gaming security statistics">
          {KEY_STATISTICS.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-muted/30 rounded-lg border">
              <div className="text-2xl font-bold text-security">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </section>

        <section className="space-y-8 mb-12">
          <h2 className="font-display font-bold text-2xl text-center">Everything You Need to Know</h2>
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="border border-border rounded-xl p-6 hover:border-security/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-security/10 border border-security/20">
                    <Icon className="h-6 w-6 text-security" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-xl mb-2">{pillar.title}</h3>
                    <p className="text-muted-foreground mb-4">{pillar.description}</p>
                    <Button asChild variant="link" className="p-0">
                      <Link to={pillar.href}>
                        Read all {pillar.title.toLowerCase()} guides
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mb-12">
          <h2 className="font-display font-bold text-2xl mb-6">Security Tools</h2>
          <p className="text-muted-foreground mb-6">
            Run these free tools to check your exposure and harden your accounts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECOMMENDED_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  to={tool.href}
                  className="block p-4 border border-border rounded-lg hover:border-security/30 transition-colors text-center group"
                >
                  <div className="inline-flex items-center justify-center p-3 rounded-lg bg-security/10 border border-security/20 mb-3">
                    <Icon className="h-6 w-6 text-security group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-semibold mb-1">{tool.label}</h4>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="text-center py-12 bg-muted/30 rounded-xl">
          <Users className="h-12 w-12 text-security mx-auto mb-4" />
          <h2 className="font-display font-bold text-2xl mb-4">Stay Protected</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get weekly gaming security alerts, breach notifications, and protection tips delivered to your inbox.
          </p>
          <Button asChild size="lg">
            <Link to="/newsletter/verify">Subscribe to Security Alerts</Link>
          </Button>
        </section>
      </article>
    </Layout>
  );
}
