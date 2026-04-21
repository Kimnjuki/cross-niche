import React, { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  ArrowLeft, Search, ExternalLink, Star, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Shield, Zap, Gamepad2, Activity,
  Code2, Eye, Filter, RotateCcw,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type UseCase = 'soc' | 'code_security' | 'gaming_security' | 'streaming' | 'vuln_management' | 'identity';
type PriceTier = 'free' | 'freemium' | 'paid' | 'enterprise';
type SkillLevel = 'beginner' | 'intermediate' | 'expert';
type NexusVerdict = 'recommended' | 'solid_choice' | 'situational' | 'avoid';

interface AITool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  useCases: UseCase[];
  priceTier: PriceTier;
  skillLevel: SkillLevel;
  verdict: NexusVerdict;
  verdictNote: string;
  pros: string[];
  cons: string[];
  url: string;
  category: string;
  isNew?: boolean;
}

// ── Tool directory ────────────────────────────────────────────────────────────

const TOOLS: AITool[] = [
  {
    id: 'microsoft-copilot-security',
    name: 'Microsoft Security Copilot',
    tagline: 'AI-native SOC analyst assistant',
    description: 'GPT-4-powered security analyst that summarises incidents, writes KQL queries, explains CVEs, and generates executive reports. Integrates deeply with Defender, Sentinel, and Intune.',
    useCases: ['soc', 'vuln_management'],
    priceTier: 'enterprise',
    skillLevel: 'intermediate',
    verdict: 'recommended',
    verdictNote: 'Best-in-class for Microsoft-stack SOCs. Dramatically reduces triage time. Expensive but ROI is clear for teams already on Defender.',
    pros: ['Deep Microsoft ecosystem integration', 'Reduces triage time by ~50%', 'Natural-language KQL generation', 'Incident summarisation at scale', 'Executive report automation'],
    cons: ['Requires Microsoft 365 E5 or similar', '$4/SCU per hour — costs add up fast', 'Limited value outside Microsoft stack'],
    url: 'https://www.microsoft.com/en-us/security/business/ai-machine-learning/microsoft-security-copilot',
    category: 'AI SOC Platform',
    isNew: false,
  },
  {
    id: 'github-advanced-security',
    name: 'GitHub Advanced Security (GHAS)',
    tagline: 'AI-powered code vulnerability scanning',
    description: 'Autofix uses AI to automatically generate pull-request patches for code security issues found by CodeQL. Covers SAST, secret scanning, dependency review, and supply chain security.',
    useCases: ['code_security'],
    priceTier: 'paid',
    skillLevel: 'intermediate',
    verdict: 'recommended',
    verdictNote: 'The gold standard for shift-left security in GitHub repositories. Autofix makes remediating SAST findings practical rather than backlogged.',
    pros: ['CodeQL is industry-leading static analysis', 'Autofix reduces remediation effort dramatically', 'Native PR integration (no context switching)', 'Secret scanning with push protection', 'SBOM generation built in'],
    cons: ['GitHub-only (no GitLab/Bitbucket for core features)', 'Autofix quality varies by language/framework', 'Enterprise plan required for full feature set'],
    url: 'https://github.com/features/security',
    category: 'Code Security (SAST/SCA)',
    isNew: false,
  },
  {
    id: 'snyk',
    name: 'Snyk',
    tagline: 'Developer-first security for code and containers',
    description: 'Comprehensive developer security platform covering SCA, SAST, IaC scanning, and container security. AI-powered fix recommendations integrated directly in IDEs and CI/CD pipelines.',
    useCases: ['code_security', 'vuln_management'],
    priceTier: 'freemium',
    skillLevel: 'intermediate',
    verdict: 'recommended',
    verdictNote: 'Best choice for polyglot teams not locked into GitHub. Free tier is genuinely useful for open-source projects. The IDE plugin is excellent.',
    pros: ['Supports all major languages and frameworks', 'Excellent IDE plugins (VS Code, JetBrains)', 'Strong SCA with license compliance', 'Free tier for open-source', 'Container and IaC scanning included'],
    cons: ['PR fix quality can be inconsistent', 'Free tier limited to 200 tests/month', 'Noise level increases on large monorepos'],
    url: 'https://snyk.io/',
    category: 'Code Security (SAST/SCA)',
    isNew: false,
  },
  {
    id: 'wiz',
    name: 'Wiz',
    tagline: 'Agentless cloud security & CNAPP',
    description: 'Cloud-native application protection platform that connects to AWS/Azure/GCP and builds a security graph showing toxic risk combinations. AI surfaces critical attack paths without agents.',
    useCases: ['vuln_management', 'soc'],
    priceTier: 'enterprise',
    skillLevel: 'intermediate',
    verdict: 'recommended',
    verdictNote: 'The fastest-growing cloud security company for a reason. Risk correlation across the entire cloud estate is genuinely novel. Agentless deployment is a huge advantage for cloud teams.',
    pros: ['No agents required', 'Cross-cloud risk correlation ("security graph")', 'Fastest time-to-value of any CNAPP', 'Acquisition by Google Cloud adds trust', 'Excellent attack path visualisation'],
    cons: ['Very expensive at enterprise scale', 'Cloud-only — no on-prem coverage', 'Can surface overwhelming risk counts initially'],
    url: 'https://www.wiz.io/',
    category: 'Cloud Security (CNAPP)',
    isNew: false,
  },
  {
    id: 'gaming-tracker',
    name: 'GTrack (Concept Tool)',
    tagline: 'Gaming account breach monitoring',
    description: 'Monitors gaming credentials across Steam, PSN, Xbox, Riot, and Epic against dark-web breach databases. Sends instant alerts when your gaming email or username appears in new dumps.',
    useCases: ['gaming_security'],
    priceTier: 'freemium',
    skillLevel: 'beginner',
    verdict: 'situational',
    verdictNote: 'Useful as a passive monitoring layer for gaming accounts but should not replace active security hygiene (MFA, unique passwords). Check haveibeenpwned.com first — it\'s free.',
    pros: ['Gaming-specific breach monitoring', 'Works across all major platforms', 'Mobile push notifications', 'Beginner-friendly UX'],
    cons: ['Many features available free via HIBP', 'Gaming-specific breach coverage can lag', 'Limited to reactive monitoring only'],
    url: 'https://haveibeenpwned.com/',
    category: 'Gaming Security',
    isNew: false,
  },
  {
    id: 'streamlabs-security',
    name: 'Streamlabs Security Suite',
    tagline: 'Streaming account and asset protection',
    description: 'Dedicated tooling for streamers covering account takeover prevention, donation fraud detection, moderation AI, and DMCA monitoring. Integrates with Twitch, YouTube, and Kick.',
    useCases: ['streaming', 'identity'],
    priceTier: 'freemium',
    skillLevel: 'beginner',
    verdict: 'solid_choice',
    verdictNote: 'Essential for any streamer with meaningful viewership. Donation fraud and account takeover are the top threats for streamers — this addresses both directly.',
    pros: ['Purpose-built for streaming platforms', 'Donation fraud detection is genuinely useful', 'AI moderation saves significant time', 'Free tier covers the basics', 'DMCA strike prevention alerts'],
    cons: ['Deeper features require Prime subscription', 'Limited to major streaming platforms', 'Over-reliant on Twitch ecosystem'],
    url: 'https://streamlabs.com/dashboard/security',
    category: 'Streaming Security',
    isNew: false,
  },
  {
    id: 'haveibeenpwned',
    name: 'Have I Been Pwned',
    tagline: 'Free breach monitoring for your email',
    description: 'Troy Hunt\'s definitive free service checks if your email addresses and passwords have appeared in known data breaches. Powers thousands of security tools and Firefox Monitor.',
    useCases: ['gaming_security', 'identity'],
    priceTier: 'free',
    skillLevel: 'beginner',
    verdict: 'recommended',
    verdictNote: 'The single most important free security tool that exists. Every person with an email address should check HIBP and subscribe to breach notifications. No excuse not to.',
    pros: ['Completely free for personal use', 'Most comprehensive breach database', 'Password checker via k-anonymity (private)', 'Free breach notification emails', 'API available for developers'],
    cons: ['Reactive only — you find out after a breach', 'No actionable remediation built in', 'Relies on breach data becoming public'],
    url: 'https://haveibeenpwned.com/',
    category: 'Breach Monitoring',
    isNew: false,
  },
  {
    id: 'crowdstrike-falcon',
    name: 'CrowdStrike Falcon',
    tagline: 'AI-native endpoint detection and response',
    description: 'Industry-leading EDR/XDR platform using AI to detect and respond to threats on endpoints. Charlotte AI provides natural-language threat hunting and incident investigation.',
    useCases: ['soc', 'vuln_management'],
    priceTier: 'enterprise',
    skillLevel: 'expert',
    verdict: 'recommended',
    verdictNote: 'The best EDR/XDR money can buy. Charlotte AI significantly lowers the skill floor for threat hunting. Best suited for organisations with a dedicated security team.',
    pros: ['Industry-leading threat detection accuracy', 'Charlotte AI enables natural-language hunting', 'Single agent for EDR/XDR/identity protection', 'Fastest mean time to detection in benchmarks', 'World-class threat intelligence (OverWatch)'],
    cons: ['Very expensive — enterprise pricing only', 'Requires dedicated security team to operate', 'Can be overwhelming for small orgs', '2024 update incident damaged brand trust'],
    url: 'https://www.crowdstrike.com/',
    category: 'EDR / XDR',
    isNew: false,
  },
  {
    id: 'semgrep',
    name: 'Semgrep',
    tagline: 'Fast, customisable SAST for developers',
    description: 'Lightweight static analysis engine with a massive rule library and the ability to write custom security rules in minutes. Free tier, open source core, used by Meta, Dropbox, and Trail of Bits.',
    useCases: ['code_security'],
    priceTier: 'freemium',
    skillLevel: 'intermediate',
    verdict: 'solid_choice',
    verdictNote: 'Best free SAST option for teams that want control over their rules. The custom rule syntax is a superpower. Less hand-holding than Snyk but more flexible.',
    pros: ['Fast (sub-minute scans on large repos)', 'Open-source rule engine', 'Custom rules without deep compiler knowledge', 'Free for open-source and small teams', '30+ languages supported'],
    cons: ['Fewer AI-powered fix suggestions than Snyk/GHAS', 'Rule tuning requires ongoing maintenance', 'SCA coverage is limited vs Snyk'],
    url: 'https://semgrep.dev/',
    category: 'Code Security (SAST)',
    isNew: false,
  },
  {
    id: 'duo-security',
    name: 'Cisco Duo',
    tagline: 'Zero-trust MFA and access management',
    description: 'User-friendly multi-factor authentication and zero-trust network access platform. Covers push notifications, FIDO2 passkeys, device trust, and SSO. Free tier for up to 10 users.',
    useCases: ['identity', 'soc'],
    priceTier: 'freemium',
    skillLevel: 'beginner',
    verdict: 'recommended',
    verdictNote: 'The most painless way to roll out MFA across an organisation. Device health checks and network access policies add zero-trust capabilities without complexity.',
    pros: ['Best-in-class user experience', 'Free for up to 10 users', 'Device health checks built in', 'FIDO2/passkey support', 'Easy SSO integration'],
    cons: ['Pricing escalates steeply above free tier', 'Cisco acquisition has slowed innovation', 'Some advanced features require enterprise tier'],
    url: 'https://duo.com/',
    category: 'Identity & Access (MFA/SSO)',
    isNew: false,
  },
  {
    id: 'nuclei',
    name: 'Nuclei (by ProjectDiscovery)',
    tagline: 'Open-source vulnerability scanner',
    description: 'Community-driven vulnerability scanner with 7,000+ templates covering CVEs, misconfigurations, and exposed panels. Used by bug bounty hunters, red teams, and security engineers worldwide.',
    useCases: ['vuln_management', 'soc'],
    priceTier: 'free',
    skillLevel: 'expert',
    verdict: 'solid_choice',
    verdictNote: 'The best free vulnerability scanner for practitioners. Template ecosystem is incredible. Requires technical skill to use effectively but is unmatched in its class for the price point.',
    pros: ['Free and open source', '7,000+ community templates', 'Lightning fast parallel scanning', 'Excellent CVE coverage within days of disclosure', 'Cloud version available'],
    cons: ['Requires CLI comfort', 'Not beginner-friendly', 'No remediation guidance built in', 'Can generate significant noise'],
    url: 'https://nuclei.projectdiscovery.io/',
    category: 'Vulnerability Scanning',
    isNew: false,
  },
  {
    id: 'burp-suite-ai',
    name: 'Burp Suite Professional',
    tagline: 'Gold-standard web app security testing',
    description: 'Industry-standard web application security testing platform. Recent AI-assisted scanning (BurpAI) adds intelligent crawling and context-aware vulnerability detection.',
    useCases: ['vuln_management', 'code_security'],
    priceTier: 'paid',
    skillLevel: 'expert',
    verdict: 'recommended',
    verdictNote: 'If you\'re doing any web application penetration testing, Burp Suite Professional is non-negotiable. BurpAI makes automated coverage more comprehensive.',
    pros: ['Gold standard for web app pentesting', 'Massive extension ecosystem (BApp Store)', 'BurpAI improves automated scanning accuracy', 'Excellent proxy and interceptor', 'Annual licence is reasonable'],
    cons: ['Steep learning curve', 'Expert-only — not beginner-friendly', 'Collaborator server can be unreliable', 'BurpAI still maturing'],
    url: 'https://portswigger.net/burp',
    category: 'Web App Security Testing',
    isNew: false,
  },
];

// ── Filter configs ────────────────────────────────────────────────────────────

const USE_CASE_LABELS: Record<UseCase, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  soc:              { label: 'SOC / Threat Hunting', icon: Activity },
  code_security:    { label: 'Code Security', icon: Code2 },
  gaming_security:  { label: 'Gaming Security', icon: Gamepad2 },
  streaming:        { label: 'Streaming / Content', icon: Eye },
  vuln_management:  { label: 'Vuln Management', icon: Shield },
  identity:         { label: 'Identity & Access', icon: Zap },
};

const PRICE_LABELS: Record<PriceTier, { label: string; color: string }> = {
  free:       { label: 'Free', color: 'text-green-600 dark:text-green-400' },
  freemium:   { label: 'Freemium', color: 'text-blue-600 dark:text-blue-400' },
  paid:       { label: 'Paid', color: 'text-yellow-600 dark:text-yellow-400' },
  enterprise: { label: 'Enterprise', color: 'text-muted-foreground' },
};

const SKILL_LABELS: Record<SkillLevel, string> = {
  beginner:     'Beginner',
  intermediate: 'Intermediate',
  expert:       'Expert',
};

const VERDICT_CONFIG: Record<NexusVerdict, { label: string; color: string; bg: string }> = {
  recommended:   { label: 'Nexus Pick', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  solid_choice:  { label: 'Solid Choice', color: 'text-tech', bg: 'bg-tech/10 border-tech/30' },
  situational:   { label: 'Situational', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  avoid:         { label: 'Avoid', color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/30' },
};

// ── Tool Card ────────────────────────────────────────────────────────────────

function ToolCard({ tool }: { tool: AITool }) {
  const [expanded, setExpanded] = useState(false);
  const verdictCfg = VERDICT_CONFIG[tool.verdict];
  const priceCfg = PRICE_LABELS[tool.priceTier];

  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardContent className="pt-5 pb-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={cn('text-xs px-2 py-0.5 rounded-full border font-semibold', verdictCfg.color, verdictCfg.bg)}>
                {verdictCfg.label}
              </span>
              <span className={cn('text-xs font-medium', priceCfg.color)}>{priceCfg.label}</span>
              <span className="text-xs text-muted-foreground">{SKILL_LABELS[tool.skillLevel]}</span>
            </div>
            <h3 className="font-display font-bold text-lg leading-tight">{tool.name}</h3>
            <p className="text-xs text-muted-foreground">{tool.tagline} · <span className="font-medium">{tool.category}</span></p>
          </div>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{tool.description}</p>

        {/* Use cases */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tool.useCases.map(uc => {
            const UIcon = USE_CASE_LABELS[uc].icon;
            return (
              <span key={uc} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted/50 border text-muted-foreground">
                <UIcon className="h-3 w-3" />
                {USE_CASE_LABELS[uc].label}
              </span>
            );
          })}
        </div>

        {/* Nexus verdict note */}
        <div className={cn('rounded-lg p-3 border mb-3 text-xs', verdictCfg.color, verdictCfg.bg)}>
          <span className="font-semibold">Nexus: </span>
          <span className="text-muted-foreground">{tool.verdictNote}</span>
        </div>

        {/* Expand pros/cons */}
        <button
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {expanded ? 'Hide' : 'Show'} pros & cons
        </button>

        {expanded && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Pros
              </p>
              <ul className="space-y-1">
                {tool.pros.map(p => (
                  <li key={p} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5 shrink-0">+</span> {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-destructive mb-1.5 flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5" /> Cons
              </p>
              <ul className="space-y-1">
                {tool.cons.map(c => (
                  <li key={c} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5 shrink-0">−</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-3 pt-3 border-t">
          <Button asChild variant="outline" className="w-full" size="sm">
            <a href={tool.url} target="_blank" rel="noopener noreferrer">
              Visit {tool.name} <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AIToolFinder() {
  const [search, setSearch] = useState('');
  const [useCase, setUseCase] = useState<UseCase | 'all'>('all');
  const [price, setPrice] = useState<PriceTier | 'all'>('all');
  const [skill, setSkill] = useState<SkillLevel | 'all'>('all');
  const [verdict, setVerdict] = useState<NexusVerdict | 'all'>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return TOOLS.filter(t => {
      if (useCase !== 'all' && !t.useCases.includes(useCase)) return false;
      if (price !== 'all' && t.priceTier !== price) return false;
      if (skill !== 'all' && t.skillLevel !== skill) return false;
      if (verdict !== 'all' && t.verdict !== verdict) return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, useCase, price, skill, verdict]);

  const hasFilters = useCase !== 'all' || price !== 'all' || skill !== 'all' || verdict !== 'all' || search;

  const clearFilters = () => {
    setSearch('');
    setUseCase('all');
    setPrice('all');
    setSkill('all');
    setVerdict('all');
  };

  return (
    <Layout>
      <SEO
        title="AI Security Tool Finder | The Grid Nexus"
        description="Find the best AI security tools by use case, price, and skill level. Curated directory with Nexus verdicts covering SOC, code security, gaming, identity, and vulnerability management."
        canonical="https://thegridnexus.com/tools/ai-tool-finder"
        ogType="website"
      />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/tools" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Security Tools
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">AI Tool Finder</span>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-tech/10 border border-tech/20 mb-4">
            <Star className="h-8 w-8 text-tech" />
          </div>
          <h1 className="font-display font-bold text-4xl mb-2">AI Security Tool Finder</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Cut through the noise. {TOOLS.length} curated AI security tools with Nexus verdicts, pros/cons, and plain-language recommendations.
          </p>
        </div>

        {/* Search + filter bar */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input className="pl-9" placeholder="Search tools…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button
              variant="outline"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={cn(hasFilters && 'border-tech text-tech')}
            >
              <Filter className="h-4 w-4 mr-1.5" />
              Filters
              {hasFilters && <span className="ml-1.5 text-xs bg-tech text-black rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {[useCase !== 'all', price !== 'all', skill !== 'all', verdict !== 'all'].filter(Boolean).length || null}
              </span>}
            </Button>
          </div>

          {filtersOpen && (
            <div className="rounded-xl border p-4 bg-muted/20 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Use case */}
                <div>
                  <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Use Case</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => setUseCase('all')} className={cn('text-xs px-2.5 py-1 rounded-full border transition-colors', useCase === 'all' ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50')}>All</button>
                    {(Object.keys(USE_CASE_LABELS) as UseCase[]).map(uc => (
                      <button key={uc} onClick={() => setUseCase(uc)} className={cn('text-xs px-2.5 py-1 rounded-full border transition-colors', useCase === uc ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50')}>
                        {USE_CASE_LABELS[uc].label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Price */}
                <div>
                  <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Price Tier</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => setPrice('all')} className={cn('text-xs px-2.5 py-1 rounded-full border transition-colors', price === 'all' ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50')}>All</button>
                    {(['free', 'freemium', 'paid', 'enterprise'] as PriceTier[]).map(p => (
                      <button key={p} onClick={() => setPrice(p)} className={cn('text-xs px-2.5 py-1 rounded-full border transition-colors', price === p ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50', PRICE_LABELS[p].color)}>
                        {PRICE_LABELS[p].label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Skill */}
                <div>
                  <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Skill Level</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => setSkill('all')} className={cn('text-xs px-2.5 py-1 rounded-full border transition-colors', skill === 'all' ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50')}>All</button>
                    {(['beginner', 'intermediate', 'expert'] as SkillLevel[]).map(s => (
                      <button key={s} onClick={() => setSkill(s)} className={cn('text-xs px-2.5 py-1 rounded-full border transition-colors', skill === s ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50')}>
                        {SKILL_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Verdict */}
                <div>
                  <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Nexus Verdict</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => setVerdict('all')} className={cn('text-xs px-2.5 py-1 rounded-full border transition-colors', verdict === 'all' ? 'bg-foreground text-background border-foreground' : 'hover:bg-muted/50')}>All</button>
                    {(Object.keys(VERDICT_CONFIG) as NexusVerdict[]).map(v => (
                      <button key={v} onClick={() => setVerdict(v)} className={cn('text-xs px-2.5 py-1 rounded-full border transition-colors', VERDICT_CONFIG[v].color, VERDICT_CONFIG[v].bg, verdict === v ? 'ring-1 ring-current' : '')}>
                        {VERDICT_CONFIG[v].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  <RotateCcw className="h-3 w-3 mr-1" /> Clear all filters
                </Button>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {filtered.length} tool{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Tool cards */}
        <div className="space-y-4">
          {filtered.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-3" />
              <p className="font-medium">No tools match your filters</p>
              <Button variant="ghost" className="mt-3" onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
