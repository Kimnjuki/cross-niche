/**
 * Security Hub — Dynamic dashboard replacing the static ToolsHub.
 * Shows trending threats, quick-scan shortcuts, tool categories,
 * and a "gamers who used X also used Y" recommendation engine.
 */
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Shield,
  Scan,
  Server,
  Gamepad2,
  MessageSquare,
  Bot,
  AlertTriangle,
  Lock,
  Brain,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Clock,
  Users,
  Zap,
  Search,
  Star,
  ExternalLink,
  Activity,
  ShieldAlert,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  threatAlerts,
  quickScanOptions,
  toolCategories,
  toolUsageFallback,
} from '@/data/securityHubData';

const severityColors = {
  critical: 'text-red-500 bg-red-500/10 border-red-500/30',
  high: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
  medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  low: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
};

const severityLabel = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
};

const iconMap: Record<string, React.ElementType> = {
  Shield,
  Scan,
  Server,
  Gamepad2,
  MessageSquare,
  Bot,
  AlertTriangle,
  Lock,
  Brain,
  Search,
  Zap,
  Users,
  Activity,
  ShieldAlert,
  Sparkles,
};

function getIcon(name: string): React.ElementType {
  return iconMap[name] || Shield;
}

export default function SecurityHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleAlerts, setVisibleAlerts] = useState(3);

  // ── Derived State ──────────────────────────────────────────────────

  const filteredTools = useMemo(() => {
    // Show tools from the TOOL_PAGES entry in sitemapGenerator
    const allTools = toolCategories.flatMap((cat) =>
      cat.tools.map((t) => ({ ...t, category: cat.name }))
    );

    if (!searchQuery) return allTools;

    const q = searchQuery.toLowerCase();
    return allTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const categoryFiltered = useMemo(() => {
    if (!selectedCategory) return filteredTools;
    return filteredTools.filter((t) => t.category === selectedCategory);
  }, [filteredTools, selectedCategory]);

  // ── Recommended tools (simulates "used X also used Y") ────────────

  const recommendedTools = useMemo(() => {
    // Show top-used tools not in the first few
    const top = toolUsageFallback
      .filter((u) => u.usageCount > 300)
      .slice(0, 4)
      .map((u) => {
        for (const cat of toolCategories) {
          const found = cat.tools.find((t) => t.slug === u.toolSlug);
          if (found) return { ...found, category: cat.name };
        }
        return null;
      })
      .filter(Boolean);

    return top.slice(0, 4) as ({ slug: string; name: string; tagline: string; category: string })[];
  }, []);

  // ── Total tool count ──────────────────────────────────────────────

  const totalTools = toolCategories.reduce((acc, cat) => acc + cat.tools.length, 0);
  const totalAlerts = threatAlerts.length;

  return (
    <Layout>
      <SEOHead
        title="Security Hub — Gaming Security Dashboard | The Grid Nexus"
        description="Real-time gaming security dashboard. Trending threats, quick account scans, tool recommendations, and the complete Nexus security toolkit — all in one place."
        keywords={['gaming security dashboard', 'threat alerts', 'gaming security hub', 'security tools for gamers', 'gaming threat intelligence']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />

      <div className="container mx-auto px-4 py-8">
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-security/20 to-security/5 border border-security/20">
              <ShieldAlert className="h-7 w-7 text-security" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl md:text-4xl">Security Hub</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {totalTools} interactive tools · {totalAlerts} active threat alerts
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* ── Quick Scan Row ────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-security" />
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickScanOptions.map((opt) => {
              const Icon = getIcon(opt.icon);
              return (
                <Link
                  key={opt.id}
                  to={opt.toolSlug}
                  className={`group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${opt.color} bg-opacity-10 hover:shadow-lg transition-all duration-200 border border-white/10`}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <Icon className="h-6 w-6 text-white" />
                    <span className="text-xs font-semibold text-white leading-tight">
                      {opt.label}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Trending Threats ──────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Trending Threats
              </h2>
              {totalAlerts > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {totalAlerts} active
                </Badge>
              )}
            </div>
            <button
              onClick={() => setVisibleAlerts(visibleAlerts === 3 ? totalAlerts : 3)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {visibleAlerts === 3 ? 'View all threats' : 'Show less'}
            </button>
          </div>

          <div className="space-y-2">
            {threatAlerts.slice(0, visibleAlerts).map((alert) => (
              <Link
                key={alert.id}
                to={alert.toolSlug}
                className="block group"
              >
                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${severityColors[alert.severity]}`}>
                        {severityLabel[alert.severity]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                              {alert.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {alert.description}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {alert.source}
                          </span>
                          {alert.affectedPlatform && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {alert.affectedPlatform}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Category Filter ───────────────────────────────────── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Browse Tools
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-security text-white'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              All Tools
            </button>
            {toolCategories.map((cat) => {
              const Icon = getIcon(cat.icon);
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat.name
                      ? 'bg-security text-white'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tool Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {categoryFiltered.map((tool) => (
            <Link key={tool.slug} to={tool.slug} className="group">
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {tool.category}
                    </Badge>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tool.tagline}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* ── Recommended For You (Top Tools) ───────────────────── */}
        {!searchQuery && !selectedCategory && recommendedTools.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-yellow-500" />
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Most Used Tools
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedTools.map((tool, idx) => {
                if (!tool) return null;
                const usageStat = toolUsageFallback.find((u) => u.toolSlug === tool.slug);
                return (
                  <Link key={tool.slug} to={tool.slug} className="group">
                    <Card className="h-full hover:border-primary/50 transition-all relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-security to-purple-500" />
                      <CardContent className="p-4 pl-5">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            #{idx + 1}
                          </Badge>
                          {usageStat && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {usageStat.usageCount}+ uses
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-sm mb-0.5 group-hover:text-primary transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {tool.tagline}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Top Security Guides ────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Top Security Guides
              </h2>
            </div>
            <Link to="/guides" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              All guides <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/article/2fa-setup-every-gaming-platform" className="group">
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    Two-Factor Authentication on Every Gaming Platform
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Set up 2FA on Xbox, Epic Games, Steam &amp; PlayStation in 20 minutes. Blocks 99% of account takeover attempts.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/article/gaming-pc-security-hardening-guide" className="group">
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    Gaming PC Security Hardening
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Lock down your gaming rig against malware, RATs, and account stealers without losing FPS. Windows 11 guide.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/article/steam-account-takeover-protection-guide-2026" className="group">
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    Steam Account Hacked? Recovery &amp; Lockdown
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Step-by-step Steam account recovery and hardening. Works even if the hacker changed your email and password.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/article/router-security-gamers-2026" className="group">
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    Router Security for Gamers 2026
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    CVE-2025-7850, KadNap backdoor campaign, and the complete router hardening checklist including VLAN segmentation.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/article/minecraft-server-security-guide" className="group">
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    Minecraft Server Security Guide
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Protect your Minecraft server from Log4Shell, DDoS attacks, griefers, and unauthorized admin access.
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/article/what-gamers-think-about-security-sentiment-analysis-2026" className="group">
              <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    Gaming Security Sentiment Analysis
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Which games have the most security complaints? Analysis of 10,000+ player reviews across Steam and Reddit.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* ── Bottom CTA ────────────────────────────────────────── */}
        <div className="border border-border rounded-xl p-8 bg-gradient-to-r from-muted/50 to-muted/30 text-center max-w-3xl mx-auto">
          <h2 className="font-display font-semibold text-xl mb-2">
            Know your threat level in 2 minutes
          </h2>
          <p className="text-muted-foreground text-sm mb-5 max-w-lg mx-auto">
            Start with a Gaming Security Checkup — scans your accounts across Steam, PSN, Xbox, and Epic for compromise signs. Free, no sign-up required.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/tools/gaming-security-checkup" className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Start Security Checkup
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/tools/threat-scanner" className="flex items-center gap-2">
                <Server className="h-4 w-4" /> Scan a Server
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
