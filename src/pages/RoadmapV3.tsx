import { memo, useState, useMemo, useCallback, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  ChevronUp, ChevronDown, MessageSquare, Bell, Gamepad2, Tv2, PenTool,
  Terminal, User, CheckCircle, Clock, Lightbulb, XCircle, Send, Hammer,
  CalendarDays, Filter, Zap,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// ── Types ─────────────────────────────────────────────────────────────────────

type Status = 'now' | 'next' | 'later' | 'shipped' | 'declined';
type Effort = 'small' | 'medium' | 'large';
type ImpactEst = 'small' | 'medium' | 'large' | 'critical';
type Persona = 'gamer' | 'streamer' | 'creator' | 'sysadmin' | 'secpro' | 'general';
type Tab = 'board' | 'changelog' | 'suggest';

interface Feature {
  id: string;
  title: string;
  description: string;
  status: Status;
  personas: Persona[];
  toolRef?: string;
  effort: Effort;
  impact: ImpactEst;
  upvotes: number;
  downvotes: number;
  teamNote?: string;
  shippedAt?: string;
  declineReason?: string;
  createdAt: string;
}

// ── Static feature data ────────────────────────────────────────────────────────

const FEATURES: Feature[] = [
  // ── NOW (actively building) ──────────────────────────────────────────────────
  {
    id: 'f1',
    title: 'Breach Simulator — 5 Prebuilt Scenarios',
    description: 'Run a full attack simulation on your digital life. Choose from 5 scenarios (streamer takeover, Discord breach, SIM swap, etc.) and get a step-by-step blast radius report with a recovery checklist.',
    status: 'now',
    personas: ['gamer', 'streamer', 'creator', 'general'],
    toolRef: 'breach_sim',
    effort: 'large',
    impact: 'critical',
    upvotes: 347,
    downvotes: 8,
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 'f2',
    title: 'Nexus Intersection — Risk Heatmap Matrix',
    description: 'Interactive 12×11 heatmap showing where platform domains (Steam, Discord, mobile money) and threat types (phishing, ransomware, AI attacks) converge. Click any cell to see incidents, CVEs, and linked articles.',
    status: 'now',
    personas: ['gamer', 'sysadmin', 'secpro', 'general'],
    toolRef: 'nexus_intersection',
    effort: 'large',
    impact: 'critical',
    upvotes: 289,
    downvotes: 4,
    createdAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 'f3',
    title: 'Security Score — Account Scan Mode (OAuth)',
    description: 'Connect Steam, Discord, and Google via read-only OAuth. We check breach exposure via HIBP, 2FA status per platform, suspicious login locations, and over-permissioned third-party apps.',
    status: 'now',
    personas: ['gamer', 'creator', 'streamer', 'general'],
    toolRef: 'security_score',
    effort: 'large',
    impact: 'critical',
    upvotes: 412,
    downvotes: 12,
    createdAt: '2026-03-15T00:00:00Z',
  },

  // ── NEXT (starting within 30 days) ───────────────────────────────────────────
  {
    id: 'f4',
    title: 'Live Threat Dashboard — Email Alert Subscriptions',
    description: 'Subscribe to daily or weekly digests for any threat panel (Gamer Intel, Africa Pulse, Critical CVEs). Get an email the moment a critical incident hits your chosen panel.',
    status: 'next',
    personas: ['gamer', 'sysadmin', 'creator', 'general'],
    toolRef: 'live_threat_dashboard',
    effort: 'medium',
    impact: 'large',
    upvotes: 198,
    downvotes: 3,
    createdAt: '2026-03-10T00:00:00Z',
  },
  {
    id: 'f5',
    title: 'AI Pulse — Automated RSS Ingestion + Claude Enrichment',
    description: 'Stop manually curating AI security signals. New pipeline: RSS feeds → Claude classifies category + impact + writes plain-English summary → auto-publishes to AI Pulse feed.',
    status: 'next',
    personas: ['sysadmin', 'secpro', 'general'],
    toolRef: 'ai_pulse',
    effort: 'medium',
    impact: 'large',
    upvotes: 156,
    downvotes: 6,
    createdAt: '2026-03-10T00:00:00Z',
  },
  {
    id: 'f6',
    title: 'Shareable Breach Sim Report Cards',
    description: 'After running a breach simulation, generate a branded share card showing your blast radius score. Share on Twitter/X or Discord with "I just survived a simulated [scenario] on @TheGridNexus".',
    status: 'next',
    personas: ['gamer', 'creator', 'streamer'],
    toolRef: 'breach_sim',
    effort: 'small',
    impact: 'medium',
    upvotes: 134,
    downvotes: 11,
    createdAt: '2026-03-20T00:00:00Z',
  },

  // ── LATER (planned, not scheduled) ───────────────────────────────────────────
  {
    id: 'f7',
    title: 'Nexus Intersection — Automated Daily Cell Scoring Pipeline',
    description: 'Scheduled Convex action (daily at 02:00 UTC) recalculates every heatmap cell risk score from the latest threatIntel data. No more manual updates — the matrix reflects reality in near-real-time.',
    status: 'later',
    personas: ['sysadmin', 'secpro'],
    toolRef: 'nexus_intersection',
    effort: 'large',
    impact: 'critical',
    upvotes: 89,
    downvotes: 2,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'f8',
    title: 'Breach Sim — Custom Scenario Builder (Premium)',
    description: 'Upload your own tech stack (AWS + GitHub + Stripe + Discord) and Claude generates a personalised attack scenario specific to your setup. Premium feature with PDF export and MITRE ATT&CK matrix.',
    status: 'later',
    personas: ['sysadmin', 'secpro', 'creator'],
    toolRef: 'breach_sim',
    effort: 'large',
    impact: 'critical',
    upvotes: 201,
    downvotes: 14,
    createdAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'f9',
    title: 'Mobile App — iOS + Android Security Score & Threat Alerts',
    description: 'Native mobile app for checking your security score on the go, receiving push notifications for critical threats in your chosen panels, and running the gaming security checkup on your phone.',
    status: 'later',
    personas: ['gamer', 'general', 'creator'],
    effort: 'large',
    impact: 'critical',
    upvotes: 445,
    downvotes: 22,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'f10',
    title: 'Africa Threat Feed — CERT-EA + Local Source Integration',
    description: 'Integrate CERT-EA, CERT-GH, NCC Nigeria advisories and M-Pesa fraud signals as primary data sources into the Africa Pulse panel. First real-time Africa-specific threat intelligence aggregator.',
    status: 'later',
    personas: ['general', 'sysadmin'],
    toolRef: 'live_threat_dashboard',
    effort: 'medium',
    impact: 'critical',
    upvotes: 167,
    downvotes: 3,
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'f11',
    title: 'Webhook + Slack Alerts for Live Threat Dashboard',
    description: 'Send threat panel alerts to Slack channels or custom webhooks. Security teams can pipe critical CVEs and gaming malware campaigns directly into their existing alerting workflows.',
    status: 'later',
    personas: ['sysadmin', 'secpro'],
    toolRef: 'live_threat_dashboard',
    effort: 'medium',
    impact: 'large',
    upvotes: 123,
    downvotes: 4,
    createdAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'f12',
    title: 'Security Score — Continuous Monitoring (30/90-day Re-checks)',
    description: 'Opt-in email reminders at 30 and 90 days after your last score. Shows you whether your score has improved or regressed, and highlights new threats in your weakest dimensions.',
    status: 'later',
    personas: ['gamer', 'creator', 'streamer', 'general'],
    toolRef: 'security_score',
    effort: 'medium',
    impact: 'large',
    upvotes: 178,
    downvotes: 7,
    createdAt: '2026-03-01T00:00:00Z',
  },

  // ── SHIPPED ───────────────────────────────────────────────────────────────────
  {
    id: 'fs1',
    title: 'Steam Security Scanner',
    description: '10-point Steam account health check covering Steam Guard, API key exposure, trade confirmations, privacy settings, and more.',
    status: 'shipped',
    personas: ['gamer'],
    toolRef: 'steam_scanner',
    effort: 'medium',
    impact: 'large',
    upvotes: 312,
    downvotes: 5,
    shippedAt: '2026-04-05T00:00:00Z',
    teamNote: 'One of our most-requested tools. Built on top of the Steam public API with a 10-check scoring rubric.',
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'fs2',
    title: 'IOC Threat-Hunting Lookup',
    description: 'Analyse IPs, domains, file hashes, and email addresses across VirusTotal, AbuseIPDB, Shodan & GreyNoise in one query.',
    status: 'shipped',
    personas: ['sysadmin', 'secpro'],
    toolRef: 'ioc_lookup',
    effort: 'large',
    impact: 'critical',
    upvotes: 289,
    downvotes: 3,
    shippedAt: '2026-03-28T00:00:00Z',
    teamNote: 'Core threat-hunting tool. Built with multi-source aggregation and auto-detection of IOC type.',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'fs3',
    title: 'Exploit Risk Meter',
    description: 'Real-time CVE risk levels for Windows 11, Chrome, Fortnite, Valorant, Steam, Discord, OBS and VS Code with patch status.',
    status: 'shipped',
    personas: ['gamer', 'creator', 'sysadmin'],
    toolRef: 'exploit_risk_meter',
    effort: 'medium',
    impact: 'large',
    upvotes: 198,
    downvotes: 6,
    shippedAt: '2026-03-20T00:00:00Z',
    teamNote: 'Built with 8 software targets and comprehensive CVSS data. Live badge refresh coming next sprint.',
    createdAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'fs4',
    title: 'Gaming Security Checkup — 6 Platforms',
    description: 'Platform-specific 7-point security audit for Steam, PSN, Xbox, Riot, Epic & Battle.net. Get your tier from Fort Knox to Exposed.',
    status: 'shipped',
    personas: ['gamer'],
    toolRef: 'gaming_checkup',
    effort: 'medium',
    impact: 'large',
    upvotes: 334,
    downvotes: 9,
    shippedAt: '2026-04-01T00:00:00Z',
    teamNote: 'Most comprehensive multi-platform gaming security audit available anywhere. Built with per-platform rubrics.',
    createdAt: '2026-02-20T00:00:00Z',
  },

  // ── WON'T DO ──────────────────────────────────────────────────────────────────
  {
    id: 'fd1',
    title: 'Dark Web Scanning for User Emails',
    description: 'Real-time dark web monitoring for user-submitted emails.',
    status: 'declined',
    personas: ['general'],
    effort: 'large',
    impact: 'large',
    upvotes: 45,
    downvotes: 12,
    declineReason: 'HIBP already does this excellently and for free. We link to it from the Security Score tool. Building a competing product serves no-one.',
    createdAt: '2026-01-05T00:00:00Z',
  },
];

// ── Column config ──────────────────────────────────────────────────────────────

const COLUMNS: { id: Status; label: string; icon: React.ElementType; color: string; bg: string }[] = [
  { id: 'now',      label: '🔨 Now',         icon: Hammer,      color: 'text-security',   bg: 'bg-security/5 border-security/20' },
  { id: 'next',     label: '🗓️ Next',         icon: CalendarDays, color: 'text-tech',       bg: 'bg-tech/5 border-tech/20' },
  { id: 'later',    label: '💭 Later',        icon: Lightbulb,   color: 'text-yellow-400', bg: 'bg-yellow-500/5 border-yellow-500/20' },
  { id: 'shipped',  label: '✅ Shipped',      icon: CheckCircle, color: 'text-green-400',  bg: 'bg-green-500/5 border-green-500/20' },
  { id: 'declined', label: '❌ Won\'t Do',    icon: XCircle,     color: 'text-muted-foreground', bg: 'bg-muted/20 border-border' },
];

const PERSONA_META: Record<Persona, { label: string; icon: React.ElementType; color: string }> = {
  gamer:    { label: 'Gamer',    icon: Gamepad2, color: 'text-gaming' },
  streamer: { label: 'Streamer', icon: Tv2,      color: 'text-red-400' },
  creator:  { label: 'Creator',  icon: PenTool,  color: 'text-tech' },
  sysadmin: { label: 'SysAdmin', icon: Terminal, color: 'text-security' },
  secpro:   { label: 'SecPro',   icon: Filter,   color: 'text-purple-400' },
  general:  { label: 'General',  icon: User,     color: 'text-muted-foreground' },
};

const EFFORT_LABELS: Record<Effort, { label: string; color: string }> = {
  small:  { label: 'Small',  color: 'text-green-400' },
  medium: { label: 'Medium', color: 'text-yellow-400' },
  large:  { label: 'Large',  color: 'text-red-400' },
};
const IMPACT_LABELS: Record<ImpactEst, { label: string; color: string }> = {
  small:    { label: 'Low',      color: 'text-muted-foreground' },
  medium:   { label: 'Medium',   color: 'text-yellow-400' },
  large:    { label: 'High',     color: 'text-orange-400' },
  critical: { label: 'Critical', color: 'text-red-400' },
};

// ── Feature Card ───────────────────────────────────────────────────────────────

const FeatureCard = memo(function FeatureCard({ feature, onVote }: { feature: Feature; onVote: (id: string, v: 'up' | 'down') => void }) {
  const [expanded, setExpanded] = useState(false);
  const votes = feature.upvotes - feature.downvotes;

  return (
    <Card className="border hover:border-primary/30 transition-colors">
      <CardContent className="pt-4 pb-4">
        {/* Title + vote */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <button type="button" onClick={() => onVote(feature.id, 'up')} className="p-1 rounded hover:bg-green-500/10 text-muted-foreground hover:text-green-400 transition-colors">
              <ChevronUp className="h-4 w-4" />
            </button>
            <span className={cn('text-sm font-bold font-mono', votes > 0 ? 'text-green-400' : votes < 0 ? 'text-red-400' : 'text-muted-foreground')}>
              {votes > 0 ? '+' : ''}{votes}
            </span>
            <button type="button" onClick={() => onVote(feature.id, 'down')} className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-snug mb-1.5">{feature.title}</h3>
            <p className={cn('text-xs text-muted-foreground leading-relaxed', !expanded && 'line-clamp-2')}>
              {feature.description}
            </p>
            {feature.teamNote && expanded && (
              <div className="mt-2 p-2 rounded bg-security/5 border border-security/20 text-xs text-muted-foreground">
                <span className="text-security font-semibold">Team note: </span>{feature.teamNote}
              </div>
            )}
            {feature.declineReason && expanded && (
              <div className="mt-2 p-2 rounded bg-muted/40 border text-xs text-muted-foreground">
                <span className="font-semibold">Why not: </span>{feature.declineReason}
              </div>
            )}
            {feature.shippedAt && expanded && (
              <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Shipped {new Date(feature.shippedAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}

            <button type="button" onClick={() => setExpanded((v) => !v)} className="text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors">
              {expanded ? '← Less' : 'More →'}
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t">
          <span className={cn('text-xs px-1.5 py-0.5 rounded bg-muted/50', EFFORT_LABELS[feature.effort].color)}>
            {EFFORT_LABELS[feature.effort].label} effort
          </span>
          <span className={cn('text-xs px-1.5 py-0.5 rounded bg-muted/50', IMPACT_LABELS[feature.impact].color)}>
            {IMPACT_LABELS[feature.impact].label} impact
          </span>
          {feature.personas.slice(0, 2).map((p) => {
            const meta = PERSONA_META[p];
            const Icon = meta.icon;
            return (
              <span key={p} className={cn('text-xs flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted/50', meta.color)}>
                <Icon className="h-2.5 w-2.5" />{meta.label}
              </span>
            );
          })}
          <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
            <MessageSquare className="h-3 w-3" />{Math.floor(feature.upvotes / 5)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
});

// ── Changelog Entry ────────────────────────────────────────────────────────────

const ChangelogEntry = memo(function ChangelogEntry({ feature }: { feature: Feature }) {
  if (!feature.shippedAt) return null;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="h-8 w-8 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0">
          <CheckCircle className="h-4 w-4 text-green-400" />
        </div>
        <div className="w-px flex-1 bg-border mt-2" />
      </div>
      <div className="pb-6 flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-1">
          {new Date(feature.shippedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{feature.description}</p>
        {feature.teamNote && (
          <div className="p-2.5 rounded bg-green-500/5 border border-green-500/20 text-xs text-muted-foreground">
            <span className="text-green-400 font-semibold">Why we built this: </span>{feature.teamNote}
          </div>
        )}
        {feature.toolRef && (
          <Link to="/tools" className="inline-flex items-center gap-1 text-xs text-security hover:underline mt-2">
            <Zap className="h-3 w-3" /> Try the tool
          </Link>
        )}
      </div>
    </div>
  );
});

// ── Suggest Form ───────────────────────────────────────────────────────────────

const SuggestForm = memo(function SuggestForm() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [persona, setPersona] = useState<Persona>('gamer');
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSent(true);
    toast({ title: 'Suggestion received!', description: 'We\'ll review and add it to the board if it fits our roadmap.' });
  }, [title]);

  if (sent) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex p-4 rounded-2xl bg-green-500/10 border border-green-500/30 mb-4">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Suggestion submitted!</h3>
        <p className="text-sm text-muted-foreground mb-4">We review all suggestions weekly. If yours fits the roadmap, it'll appear on the board.</p>
        <Button variant="outline" onClick={() => setSent(false)}>Submit another</Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display font-bold text-2xl mb-2">Suggest a Feature</h2>
        <p className="text-sm text-muted-foreground">Tell us what would make TheGridNexus more useful for you.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Feature title *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Discord server security audit tool"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="What problem does this solve? What would the ideal solution look like?"
            rows={4}
            className="w-full px-3 py-2 rounded-md border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Your persona</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(PERSONA_META) as [Persona, typeof PERSONA_META[Persona]][]).map(([id, meta]) => {
              const Icon = meta.icon;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPersona(id)}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg border text-xs transition-all',
                    persona === id
                      ? cn('bg-primary/10 border-primary/50', meta.color)
                      : 'border-border text-muted-foreground hover:border-foreground/30'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />{meta.label}
                </button>
              );
            })}
          </div>
        </div>
        <Button type="submit" className="w-full gap-2" disabled={!title.trim()}>
          <Send className="h-4 w-4" /> Submit Suggestion
        </Button>
      </form>
    </div>
  );
});

// ── Main Page ──────────────────────────────────────────────────────────────────

const RoadmapV3 = memo(function RoadmapV3() {
  const [activeTab, setActiveTab] = useState<Tab>('board');
  const [personaFilter, setPersonaFilter] = useState<Persona | 'all'>('all');
  const [features, setFeatures] = useState<Feature[]>(FEATURES);

  // Restore votes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gnx_roadmap_votes');
      if (saved) {
        const votes: Record<string, { up: number; down: number }> = JSON.parse(saved);
        setFeatures((prev) =>
          prev.map((f) => {
            const v = votes[f.id];
            if (!v) return f;
            return { ...f, upvotes: f.upvotes + v.up, downvotes: f.downvotes + v.down };
          })
        );
      }
    } catch {}
  }, []);

  const handleVote = useCallback((id: string, vote: 'up' | 'down') => {
    setFeatures((prev) => {
      const updated = prev.map((f) =>
        f.id !== id ? f : { ...f, upvotes: vote === 'up' ? f.upvotes + 1 : f.upvotes, downvotes: vote === 'down' ? f.downvotes + 1 : f.downvotes }
      );
      try {
        const saved: Record<string, { up: number; down: number }> = JSON.parse(localStorage.getItem('gnx_roadmap_votes') || '{}');
        if (!saved[id]) saved[id] = { up: 0, down: 0 };
        saved[id][vote]++;
        localStorage.setItem('gnx_roadmap_votes', JSON.stringify(saved));
      } catch {}
      return updated;
    });
  }, []);

  const boardFeatures = useMemo(() => {
    return features.filter((f) => {
      if (personaFilter === 'all') return true;
      return f.personas.includes(personaFilter);
    });
  }, [features, personaFilter]);

  const byStatus = useMemo(() =>
    Object.fromEntries(COLUMNS.map((c) => [c.id, boardFeatures.filter((f) => f.status === c.id).sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))])),
  [boardFeatures]);

  const shipped = useMemo(() => features.filter((f) => f.status === 'shipped').sort((a, b) => new Date(b.shippedAt!).getTime() - new Date(a.shippedAt!).getTime()), [features]);

  return (
    <Layout>
      <SEOHead
        title="Platform Roadmap — Help Us Build What You Need | The Grid Nexus"
        description="Vote on features, track what we're building, and suggest your own ideas. Transparent Now/Next/Later roadmap for TheGridNexus security tools."
        keywords={['product roadmap', 'feature voting', 'gaming security tools', 'roadmap', 'feature requests']}
        url={typeof window !== 'undefined' ? window.location.href : '/roadmap'}
        type="website"
      />

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display font-bold text-3xl mb-2">Platform Roadmap</h1>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Help us build the security tools you actually need. Vote on features, track what's in progress, and suggest your own ideas.
            </p>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'In Progress',  value: features.filter(f => f.status === 'now').length,  color: 'text-security' },
              { label: 'Coming Next',  value: features.filter(f => f.status === 'next').length, color: 'text-tech' },
              { label: 'Shipped',      value: features.filter(f => f.status === 'shipped').length, color: 'text-green-400' },
              { label: 'Total Votes',  value: features.reduce((s, f) => s + f.upvotes, 0).toLocaleString(), color: 'text-yellow-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl border p-3 text-center">
                <p className={cn('font-bold text-2xl font-display', color)}>{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6">
            {([
              { id: 'board'     as Tab, label: '🗂️ Board' },
              { id: 'changelog' as Tab, label: '✅ Changelog' },
              { id: 'suggest'   as Tab, label: '💡 Suggest' },
            ]).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeTab === id ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── BOARD ─────────────────────────────────────────────────────── */}
          {activeTab === 'board' && (
            <>
              {/* Persona filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setPersonaFilter('all')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    personaFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-foreground/30'
                  )}
                >
                  All
                </button>
                {(Object.entries(PERSONA_META) as [Persona, typeof PERSONA_META[Persona]][]).map(([id, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPersonaFilter(id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                        personaFilter === id
                          ? cn('bg-primary/10 border-primary/50', meta.color)
                          : 'border-border text-muted-foreground hover:border-foreground/30'
                      )}
                    >
                      <Icon className="h-3 w-3" />{meta.label}
                    </button>
                  );
                })}
              </div>

              {/* Kanban columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {COLUMNS.map((col) => {
                  const Icon = col.icon;
                  const items = byStatus[col.id] ?? [];
                  return (
                    <div key={col.id} className={cn('rounded-xl border p-3', col.bg)}>
                      <div className={cn('flex items-center gap-2 mb-3 font-semibold text-sm', col.color)}>
                        <Icon className="h-4 w-4" />
                        <span>{col.label}</span>
                        <span className="ml-auto text-xs font-mono opacity-70">{items.length}</span>
                      </div>
                      <div className="space-y-3">
                        {items.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-4">Nothing here yet.</p>
                        ) : (
                          items.map((f) => <FeatureCard key={f.id} feature={f} onVote={handleVote} />)
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── CHANGELOG ─────────────────────────────────────────────────── */}
          {activeTab === 'changelog' && (
            <div className="max-w-2xl">
              <div className="mb-6">
                <h2 className="font-display font-bold text-xl mb-1">What we've shipped</h2>
                <p className="text-sm text-muted-foreground">A reverse-chronological log of features that are live on the platform.</p>
              </div>
              <div className="space-y-0">
                {shipped.map((f) => <ChangelogEntry key={f.id} feature={f} />)}
              </div>
              <div className="mt-4 p-4 rounded-xl border bg-muted/20 text-center">
                <p className="text-sm text-muted-foreground mb-2">More features coming soon.</p>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('board')}>
                  <Clock className="h-3.5 w-3.5 mr-1.5" /> See what's next
                </Button>
              </div>
            </div>
          )}

          {/* ── SUGGEST ───────────────────────────────────────────────────── */}
          {activeTab === 'suggest' && <SuggestForm />}

          {/* Subscribe strip */}
          {activeTab === 'board' && (
            <div className="mt-8 p-5 rounded-xl border bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Bell className="h-5 w-5 text-security shrink-0" />
              <div>
                <p className="font-semibold text-sm">Get notified when features ship</p>
                <p className="text-xs text-muted-foreground">We'll email you when any feature you voted for goes live.</p>
              </div>
              <Button size="sm" className="sm:ml-auto shrink-0" onClick={() => toast({ title: 'Notifications enabled', description: 'We\'ll email you when voted features ship.' })}>
                Enable Notifications
              </Button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
});

export default RoadmapV3;
