import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { useAuth } from '@/contexts/AuthContext';
import { memo, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Gamepad2, Tv2, Terminal, Globe, AlertOctagon, Search, Filter,
  Clock, ExternalLink, ChevronRight, Activity, Shield, Zap, X,
  TrendingUp, Bell,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ── Types ──────────────────────────────────────────────────────────────────────

type Severity = 'critical' | 'high' | 'medium' | 'low';
type PanelId = 'gamer' | 'creator' | 'sysadmin' | 'africa' | 'cves';
type TimeRange = '24h' | '7d' | '30d';

interface Incident {
  id: string;
  title: string;
  summary: string;
  severity: Severity;
  platforms: string[];
  publishedAt: string;
  sourceUrl?: string;
  cveIds?: string[];
  breachSimId?: string;
  africaRelevant?: boolean;
  patchUrl?: string;
  personas: PanelId[];
}

// ── Static threat data ─────────────────────────────────────────────────────────

const INCIDENTS: Incident[] = [
  // ── Gamer Intel ──────────────────────────────────────────────────────────────
  {
    id: 'g1',
    title: 'Steam Phishing Campaign: Fake CS2 Trade Offers Stealing Session Tokens',
    summary: 'Mass phishing campaign targeting Steam users via Discord DMs. Fake Counter-Strike 2 trade offer URLs redirect to a credential-harvesting site that steals steamLoginSecure cookies. Over 3,400 accounts compromised in 72 hours.',
    severity: 'critical',
    platforms: ['Steam', 'Discord', 'CS2'],
    publishedAt: '2026-04-20T09:15:00Z',
    breachSimId: 'streamer_account_takeover',
    personas: ['gamer'],
  },
  {
    id: 'g2',
    title: 'Valorant Cheat Tool Distributing AsyncRAT Malware',
    summary: 'A widely-shared "Valorant aimbot" distributed on YouTube and Telegram contains AsyncRAT payload. The trojan exfiltrates saved browser credentials, Discord tokens, and cryptocurrency wallet seeds.',
    severity: 'critical',
    platforms: ['Valorant', 'Discord'],
    publishedAt: '2026-04-19T14:30:00Z',
    cveIds: [],
    breachSimId: 'gaming_clan_discord_breach',
    personas: ['gamer'],
  },
  {
    id: 'g3',
    title: 'PlayStation Network Password Reset Flaw Allows Account Enumeration',
    summary: 'A logic flaw in PSN\'s password reset flow allows attackers to enumerate valid email addresses. While not a full account takeover vector, the data is being sold on dark web forums to facilitate targeted credential stuffing.',
    severity: 'high',
    platforms: ['PlayStation Network'],
    publishedAt: '2026-04-18T11:00:00Z',
    cveIds: ['CVE-2026-0041'],
    personas: ['gamer'],
  },
  {
    id: 'g4',
    title: 'Minecraft Bedrock Exploit Allows Crash-on-Join via Crafted Packet',
    summary: 'A denial-of-service vulnerability in Minecraft Bedrock Edition allows a crafted join packet to crash the target client. Exploit scripts are circulating in griefer communities. No patch yet from Microsoft.',
    severity: 'high',
    platforms: ['Minecraft'],
    publishedAt: '2026-04-17T16:45:00Z',
    cveIds: ['CVE-2026-0031'],
    personas: ['gamer'],
  },
  {
    id: 'g5',
    title: 'Fortnite V-Buck Scam Sites Surging: 200+ Domains Registered in April',
    summary: 'Threat actors registered over 200 look-alike "free V-Bucks" domains this month targeting young players. Sites mimic Epic Games login to harvest credentials. Parents should check linked email accounts.',
    severity: 'medium',
    platforms: ['Fortnite', 'Epic Games'],
    publishedAt: '2026-04-16T08:00:00Z',
    personas: ['gamer'],
  },

  // ── Creator Intel ─────────────────────────────────────────────────────────────
  {
    id: 'c1',
    title: 'YouTube OAuthToken Harvesting via Fake Brand Deal Emails',
    summary: 'Coordinated phishing campaign targeting creators with 10k–500k subscribers. Fake "brand partnership" emails contain OAuth consent links granting persistent channel access. Channels are then used for crypto-scam livestreams.',
    severity: 'critical',
    platforms: ['YouTube', 'Google'],
    publishedAt: '2026-04-20T07:30:00Z',
    breachSimId: 'streamer_account_takeover',
    personas: ['creator', 'streamer'],
  },
  {
    id: 'c2',
    title: 'Twitch API Key Exposure via OBS Scene Collection Sharing',
    summary: 'Multiple streamers inadvertently exposed their Twitch stream keys by sharing OBS scene collections. Scene files can embed API tokens as custom RTMP URLs. Attackers are broadcasting illegal content on victim channels.',
    severity: 'high',
    platforms: ['Twitch', 'OBS'],
    publishedAt: '2026-04-19T10:15:00Z',
    personas: ['streamer', 'creator'],
  },
  {
    id: 'c3',
    title: 'TikTok Creator Account Impersonation Wave Targets Verified Accounts',
    summary: 'Verified TikTok creators are being impersonated by lookalike accounts using stolen profile photos. Scammers promote investment scams and fake merchandise stores, costing victims and their audiences money.',
    severity: 'high',
    platforms: ['TikTok'],
    publishedAt: '2026-04-17T13:20:00Z',
    personas: ['creator'],
  },
  {
    id: 'c4',
    title: 'Stripe Payout Redirect Fraud Targeting Indie Creators on Patreon/Gumroad',
    summary: 'Attackers accessing creator accounts (via credential stuffing) are modifying bank account details in Stripe dashboards. Payouts redirect to attacker-controlled accounts for 30-60 days before detection.',
    severity: 'high',
    platforms: ['Patreon', 'Gumroad', 'Stripe'],
    publishedAt: '2026-04-15T09:00:00Z',
    breachSimId: 'streamer_account_takeover',
    personas: ['creator', 'streamer'],
  },
  {
    id: 'c5',
    title: 'Discord Webhook Abuse: Bots Harvesting Creator Server Member Lists',
    summary: 'Malicious bots are being invited to creator Discord servers under the guise of "moderation bots." Once admin-approved, they exfiltrate full member lists, DM history exports, and role assignments.',
    severity: 'medium',
    platforms: ['Discord'],
    publishedAt: '2026-04-14T15:45:00Z',
    breachSimId: 'gaming_clan_discord_breach',
    personas: ['creator', 'streamer', 'gamer'],
  },

  // ── SysAdmin / DevOps ──────────────────────────────────────────────────────────
  {
    id: 's1',
    title: 'Critical: GitHub Actions Supply Chain Attack via Poisoned Cache Action',
    summary: 'A popular GitHub Actions cache action (500k+ workflows) was compromised to inject a credential-stealing payload. CI/CD secrets, AWS keys, and NPM tokens were exfiltrated. Replace all secrets used in affected pipelines immediately.',
    severity: 'critical',
    platforms: ['GitHub', 'AWS', 'Azure', 'GCP'],
    publishedAt: '2026-04-20T06:00:00Z',
    cveIds: ['CVE-2026-0052'],
    breachSimId: 'small_saas_compromise',
    personas: ['sysadmin'],
    patchUrl: 'https://github.blog/security',
  },
  {
    id: 's2',
    title: 'Linux kernel 6.8 Privilege Escalation: Local Root via io_uring (CVE-2026-0031)',
    summary: 'A use-after-free vulnerability in the Linux kernel\'s io_uring subsystem allows local privilege escalation to root. PoC exploit code is publicly available. Patch to kernel 6.8.4 or disable io_uring via sysctl.',
    severity: 'critical',
    platforms: ['Linux', 'Ubuntu', 'Debian', 'RHEL'],
    publishedAt: '2026-04-19T08:00:00Z',
    cveIds: ['CVE-2026-0031'],
    personas: ['sysadmin'],
    patchUrl: 'https://kernel.org/pub/linux/kernel/v6.x/',
  },
  {
    id: 's3',
    title: 'Nginx 1.24 TLS 1.3 Session Resumption Memory Leak',
    summary: 'A memory leak in Nginx 1.24.x under TLS 1.3 session resumption allows an attacker to gradually exhaust server memory, causing denial of service. Affects high-traffic servers with TLS session caching enabled.',
    severity: 'high',
    platforms: ['Nginx'],
    publishedAt: '2026-04-18T14:00:00Z',
    cveIds: ['CVE-2026-0028'],
    personas: ['sysadmin'],
    patchUrl: 'https://nginx.org/en/CHANGES',
  },
  {
    id: 's4',
    title: 'AWS IAM Role Chaining Allows Privilege Escalation Bypassing SCPs',
    summary: 'A logic error in AWS IAM role chaining allows certain role assumptions to bypass Service Control Policies. Researchers demonstrated cross-account privilege escalation in default configurations. AWS has issued guidance but no structural fix.',
    severity: 'high',
    platforms: ['AWS'],
    publishedAt: '2026-04-17T11:30:00Z',
    personas: ['sysadmin'],
  },
  {
    id: 's5',
    title: 'Ransomware Group "BlackEagle" Targeting SMBs via Exposed RDP in East Africa',
    summary: 'A ransomware group is actively scanning for exposed RDP on port 3389 in Kenya, Uganda, and Tanzania. Initial access via brute-forced credentials. Ransom demands range from $5k–$50k. Firewall RDP immediately if publicly accessible.',
    severity: 'critical',
    platforms: ['Windows Server', 'RDP'],
    publishedAt: '2026-04-20T05:00:00Z',
    africaRelevant: true,
    breachSimId: 'ransomware_home_lab',
    personas: ['sysadmin', 'africa'],
  },

  // ── Africa Pulse ────────────────────────────────────────────────────────────────
  {
    id: 'a1',
    title: 'M-Pesa "Reversal Scam" Wave Targeting Kenyan Traders via SMS Spoofing',
    summary: 'Fraud ring sending spoofed Safaricom SMS messages to small business owners claiming a payment reversal is required. Victims approve a reverse transaction, transferring funds to attackers. Over KES 12M lost in March 2026.',
    severity: 'critical',
    platforms: ['M-Pesa', 'Safaricom'],
    publishedAt: '2026-04-20T07:00:00Z',
    africaRelevant: true,
    personas: ['africa'],
  },
  {
    id: 'a2',
    title: 'MTN Mobile Money SIM Swap Fraud Surge in Ghana and Nigeria',
    summary: 'CERT-GH reports a 340% increase in SIM swap attacks targeting MTN Ghana MoMo users. Attackers bribe telecom agents for SIM transfers, gaining OTP access to mobile banking. Airtel Nigeria is also affected.',
    severity: 'critical',
    platforms: ['MTN MoMo', 'Airtel Money'],
    publishedAt: '2026-04-19T09:00:00Z',
    africaRelevant: true,
    breachSimId: 'mobile_gamer_sim_swap',
    personas: ['africa'],
  },
  {
    id: 'a3',
    title: 'Fake Government Portal Phishing Targeting eCitizen Users in Kenya',
    summary: 'A convincing fake eCitizen Kenya portal (ecitizen-gov.co) is harvesting login credentials and national ID numbers. Site has valid SSL certificate via Let\'s Encrypt. Users report identity fraud using stolen data.',
    severity: 'high',
    platforms: ['eCitizen Kenya'],
    publishedAt: '2026-04-18T10:00:00Z',
    africaRelevant: true,
    personas: ['africa'],
  },
  {
    id: 'a4',
    title: 'South African Banking Sector Hit by QR Code Phishing ("Quishing") Campaign',
    summary: 'FNB and Standard Bank customers are receiving physical mail with QR codes linking to phishing pages. The "quishing" technique bypasses email security filters. SABRIC issued a sector-wide alert.',
    severity: 'high',
    platforms: ['FNB', 'Standard Bank'],
    publishedAt: '2026-04-17T12:30:00Z',
    africaRelevant: true,
    personas: ['africa'],
  },
  {
    id: 'a5',
    title: 'Nigerian BEC Group "SilverTerp" Expands Operations to Target African Startups',
    summary: 'A well-documented Nigerian BEC group has shifted focus to African Series A startups, impersonating CFOs in wire transfer requests. Average loss per incident is $85,000. Finance teams should implement call-back verification.',
    severity: 'high',
    platforms: ['Email'],
    publishedAt: '2026-04-15T08:30:00Z',
    africaRelevant: true,
    personas: ['africa', 'sysadmin'],
  },

  // ── Critical CVEs ─────────────────────────────────────────────────────────────
  {
    id: 'v1',
    title: 'CVE-2026-0052 — GitHub Actions Cache Poisoning (CVSS 9.8)',
    summary: 'Critical supply chain vulnerability in actions/cache@v3. Allows injection of malicious cache entries that execute arbitrary code in downstream CI/CD pipelines. Actively exploited in the wild.',
    severity: 'critical',
    platforms: ['GitHub Actions'],
    publishedAt: '2026-04-20T06:00:00Z',
    cveIds: ['CVE-2026-0052'],
    personas: ['cves', 'sysadmin'],
    patchUrl: 'https://github.com/actions/cache/releases',
  },
  {
    id: 'v2',
    title: 'CVE-2026-0031 — Linux kernel io_uring Privilege Escalation (CVSS 9.3)',
    summary: 'Use-after-free in io_uring allows unprivileged local user to achieve root. PoC available publicly. Affects Linux 5.10–6.8.3. Patch: upgrade to 6.8.4+ or set kernel.io_uring_disabled=2.',
    severity: 'critical',
    platforms: ['Linux'],
    publishedAt: '2026-04-19T08:00:00Z',
    cveIds: ['CVE-2026-0031'],
    personas: ['cves', 'sysadmin'],
    patchUrl: 'https://kernel.org',
  },
  {
    id: 'v3',
    title: 'CVE-2026-0041 — PlayStation Network Account Enumeration (CVSS 7.5)',
    summary: 'Logic flaw in PSN password reset API enables mass email enumeration. No authentication bypass but enables targeted credential stuffing. Sony confirmed and is patching.',
    severity: 'high',
    platforms: ['PlayStation Network'],
    publishedAt: '2026-04-18T11:00:00Z',
    cveIds: ['CVE-2026-0041'],
    personas: ['cves', 'gamer'],
  },
  {
    id: 'v4',
    title: 'CVE-2026-0028 — Nginx 1.24 Memory Exhaustion Under TLS 1.3 (CVSS 7.5)',
    summary: 'Memory leak in TLS 1.3 session ticket processing causes gradual heap exhaustion. High-traffic servers can be DoS\'d within hours. Upgrade to Nginx 1.24.2 or 1.25.5 (mainline).',
    severity: 'high',
    platforms: ['Nginx'],
    publishedAt: '2026-04-18T14:00:00Z',
    cveIds: ['CVE-2026-0028'],
    personas: ['cves', 'sysadmin'],
    patchUrl: 'https://nginx.org',
  },
];

// ── Panel config ───────────────────────────────────────────────────────────────

const PANELS: { id: PanelId; label: string; icon: React.ElementType; color: string; description: string }[] = [
  { id: 'gamer',   label: '🎮 Gamer Intel',       icon: Gamepad2,     color: 'text-gaming',   description: 'Account takeovers, cheat-tool malware, in-game scams' },
  { id: 'creator', label: '🎥 Creator Intel',      icon: Tv2,          color: 'text-red-400',  description: 'YouTube/Twitch phishing, OAuth theft, revenue fraud' },
  { id: 'sysadmin',label: '🖥️ SysAdmin / DevOps', icon: Terminal,     color: 'text-security', description: 'CVEs in infra, supply chain attacks, ransomware' },
  { id: 'africa',  label: '🌍 Africa Pulse',       icon: Globe,        color: 'text-green-400',description: 'M-Pesa fraud, MTN scams, African org breaches' },
  { id: 'cves',    label: '🔴 Critical CVEs',      icon: AlertOctagon, color: 'text-red-400',  description: 'CVSS 9.0+ vulnerabilities with exploitation evidence' },
];

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; bg: string; dot: string }> = {
  critical: { label: 'Critical', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30',    dot: 'bg-red-400' },
  high:     { label: 'High',     color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', dot: 'bg-orange-400' },
  medium:   { label: 'Medium',   color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', dot: 'bg-yellow-400' },
  low:      { label: 'Low',      color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30',   dot: 'bg-green-400' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Incident Card ──────────────────────────────────────────────────────────────

const IncidentCard = memo(function IncidentCard({
  incident, onSelect, isSelected,
}: { incident: Incident; onSelect: (id: string) => void; isSelected: boolean }) {
  const sev = SEVERITY_CONFIG[incident.severity];
  return (
    <button
      type="button"
      onClick={() => onSelect(incident.id)}
      className={cn(
        'w-full text-left p-4 rounded-xl border transition-all',
        isSelected ? 'border-primary/60 bg-primary/5' : 'border-border hover:border-border/80 hover:bg-muted/30'
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 rounded-full shrink-0 mt-0.5', sev.dot)} />
          <Badge className={cn('text-xs', sev.bg, sev.color, 'border')}>{sev.label}</Badge>
          {incident.africaRelevant && <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">🌍 Africa</Badge>}
        </div>
        <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
          <Clock className="h-3 w-3" />{timeAgo(incident.publishedAt)}
        </span>
      </div>
      <p className="font-semibold text-sm leading-snug mb-1.5">{incident.title}</p>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{incident.summary}</p>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {incident.platforms.slice(0, 3).map((p) => (
          <span key={p} className="text-xs bg-muted/60 text-muted-foreground px-1.5 py-0.5 rounded">{p}</span>
        ))}
        {incident.cveIds?.slice(0, 1).map((c) => (
          <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
        ))}
      </div>
    </button>
  );
});

// ── Incident Detail ────────────────────────────────────────────────────────────

const IncidentDetail = memo(function IncidentDetail({ incident, onClose }: { incident: Incident; onClose: () => void }) {
  const sev = SEVERITY_CONFIG[incident.severity];
  return (
    <Card className={cn('border-l-4', incident.severity === 'critical' ? 'border-l-red-500' : incident.severity === 'high' ? 'border-l-orange-500' : 'border-l-yellow-500')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className={cn('text-xs self-start', sev.bg, sev.color, 'border')}>{sev.label}</Badge>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <CardTitle className="text-base leading-snug mt-2">{incident.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* AI Summary */}
        <div className="p-3 rounded-lg bg-muted/40">
          <p className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
            <Zap className="h-3 w-3" /> AI SUMMARY
          </p>
          <p className="text-sm leading-relaxed">{incident.summary}</p>
        </div>

        {/* Affected platforms */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">AFFECTED PLATFORMS</p>
          <div className="flex flex-wrap gap-1.5">
            {incident.platforms.map((p) => (
              <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
            ))}
          </div>
        </div>

        {/* CVE IDs */}
        {incident.cveIds && incident.cveIds.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">CVE IDs</p>
            <div className="flex flex-wrap gap-1.5">
              {incident.cveIds.map((c) => (
                <Badge key={c} variant="destructive" className="text-xs">{c}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* What to do */}
        <div className="p-3 rounded-lg bg-security/5 border border-security/20">
          <p className="text-xs font-semibold text-security mb-2 flex items-center gap-1">
            <Shield className="h-3 w-3" /> WHAT TO DO RIGHT NOW
          </p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {incident.severity === 'critical' && <li>• Treat as active incident — act within 24 hours</li>}
            {incident.cveIds && incident.cveIds.length > 0 && <li>• Apply vendor patches for {incident.cveIds.join(', ')}</li>}
            {incident.platforms.includes('Steam') && <li>• Check Steam Guard status and review active sessions</li>}
            {incident.platforms.includes('Discord') && <li>• Revoke all Discord active sessions and change password</li>}
            {incident.africaRelevant && <li>• Contact your mobile money provider and enable additional verification</li>}
            {incident.patchUrl && (
              <li>• <a href={incident.patchUrl} target="_blank" rel="noopener noreferrer" className="text-security hover:underline">Download official patch →</a></li>
            )}
            <li>• Monitor related accounts for unusual activity for 72 hours</li>
          </ul>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          {incident.breachSimId && (
            <Button asChild size="sm" className="w-full gap-2 bg-destructive/90 hover:bg-destructive">
              <Link to="/breach-sim">
                <Activity className="h-3.5 w-3.5" /> Simulate this attack on your setup
              </Link>
            </Button>
          )}
          {incident.sourceUrl && (
            <Button asChild size="sm" variant="outline" className="w-full gap-2">
              <a href={incident.sourceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" /> Original source
              </a>
            </Button>
          )}
          <Button asChild size="sm" variant="outline" className="w-full gap-2">
            <Link to="/security-score">
              <Shield className="h-3.5 w-3.5" /> Check your security score for this risk
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

// ── Main Dashboard ─────────────────────────────────────────────────────────────

const LiveThreatDashboard = memo(function LiveThreatDashboard() {
  const isDisabled = useConvexDisabled();
  const { user } = useAuth();
  const userId = user?.id || `session-${localStorage.getItem('sessionId') || 'anonymous'}`;

  const [activePanel, setActivePanel] = useState<PanelId>('gamer');
  const [severityFilter, setSeverityFilter] = useState<Severity[]>([]);
  const [timeRange] = useState<TimeRange>('7d');
  const [africaOnly, setAfricaOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);

  // Convex subscriptions (existing)
  const [cveInput, setCveInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const subs = useQuery(api.threatAlerts.listSubscriptions, isDisabled ? 'skip' : { userId });
  const subscribe = useMutation(api.threatAlerts.subscribe);
  const unsubscribe = useMutation(api.threatAlerts.unsubscribe);

  const cveSubs = useMemo(() => (subs ?? []).filter((s: any) => s.type === 'cve').map((s: any) => s.value), [subs]);
  const tagSubs  = useMemo(() => (subs ?? []).filter((s: any) => s.type === 'tag').map((s: any) => s.value), [subs]);

  const handleSubscribeCve = async () => {
    if (isDisabled) return;
    const v = cveInput.trim(); if (!v) return;
    await subscribe({ userId, type: 'cve', value: v });
    setCveInput('');
    toast({ title: 'Subscribed', description: `Alerts enabled for ${v}` });
  };
  const handleSubscribeTag = async () => {
    if (isDisabled) return;
    const v = tagInput.trim(); if (!v) return;
    await subscribe({ userId, type: 'tag', value: v });
    setTagInput('');
    toast({ title: 'Subscribed', description: `Tag alerts enabled: ${v}` });
  };

  // Filter incidents for active panel
  const panelIncidents = useMemo(() => {
    return INCIDENTS.filter((inc) => {
      if (!inc.personas.includes(activePanel)) return false;
      if (severityFilter.length > 0 && !severityFilter.includes(inc.severity)) return false;
      if (africaOnly && !inc.africaRelevant) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!inc.title.toLowerCase().includes(q) && !inc.summary.toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      const order: Severity[] = ['critical', 'high', 'medium', 'low'];
      return order.indexOf(a.severity) - order.indexOf(b.severity);
    });
  }, [activePanel, severityFilter, africaOnly, search]);

  const panelCounts = useMemo(() =>
    Object.fromEntries(PANELS.map((p) => [p.id, INCIDENTS.filter((i) => i.personas.includes(p.id)).length])),
  []);

  const selectedIncident = useMemo(() => INCIDENTS.find((i) => i.id === selectedId) ?? null, [selectedId]);

  const criticalCount = useMemo(() => panelIncidents.filter((i) => i.severity === 'critical').length, [panelIncidents]);

  const toggleSeverity = (s: Severity) =>
    setSeverityFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  return (
    <Layout>
      <SEOHead
        title="Live Threat Dashboard | The Grid Nexus"
        description="Real threats. Real context. For gamers, streamers, creators & sysadmins. Persona-filtered threat intel with Africa pulse, critical CVEs & breach sim CTAs."
        keywords={['live threats', 'threat intelligence', 'gaming security', 'Africa cybersecurity', 'CVE dashboard']}
        url={typeof window !== 'undefined' ? window.location.href : '/live-threat-dashboard'}
        type="website"
      />
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <h1 className="font-display font-bold text-3xl mb-1">Live Threat Dashboard</h1>
              <p className="text-muted-foreground text-sm">Real threats. Real context. For the people they actually target.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 shrink-0"
              onClick={() => setShowAlerts((v) => !v)}
            >
              <Bell className="h-4 w-4" />
              Alerts
              {(cveSubs.length + tagSubs.length) > 0 && (
                <Badge variant="destructive" className="ml-1 h-4 text-xs px-1">
                  {cveSubs.length + tagSubs.length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Critical badge */}
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 mb-5 text-sm">
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
              <span className="font-semibold text-red-400">{criticalCount} critical</span>
              <span className="text-muted-foreground">incident{criticalCount > 1 ? 's' : ''} in this panel require immediate attention</span>
            </div>
          )}

          {/* Panel tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 mb-5 scrollbar-hide">
            {PANELS.map((panel) => {
              const Icon = panel.icon;
              const count = panelCounts[panel.id] ?? 0;
              return (
                <button
                  key={panel.id}
                  type="button"
                  onClick={() => { setActivePanel(panel.id); setSelectedId(null); }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all shrink-0',
                    activePanel === panel.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {panel.label}
                  <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-mono',
                    activePanel === panel.id ? 'bg-white/20' : 'bg-muted-foreground/20'
                  )}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Panel description */}
          <p className="text-xs text-muted-foreground mb-5">
            {PANELS.find((p) => p.id === activePanel)?.description}
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search incidents…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              {(['critical', 'high', 'medium', 'low'] as Severity[]).map((s) => {
                const cfg = SEVERITY_CONFIG[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSeverity(s)}
                    className={cn(
                      'px-2.5 py-1 rounded text-xs font-medium border transition-all',
                      severityFilter.includes(s)
                        ? cn(cfg.bg, cfg.color, 'border-current')
                        : 'border-border text-muted-foreground hover:border-border/80'
                    )}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setAfricaOnly((v) => !v)}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium border transition-all',
                africaOnly
                  ? 'bg-green-500/10 text-green-400 border-green-500/30'
                  : 'border-border text-muted-foreground hover:border-border/80'
              )}
            >
              🌍 Africa only
            </button>
            {(severityFilter.length > 0 || africaOnly || search) && (
              <button
                type="button"
                onClick={() => { setSeverityFilter([]); setAfricaOnly(false); setSearch(''); }}
                className="px-2.5 py-1 rounded text-xs text-muted-foreground border border-border hover:text-foreground transition-all flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>

          {/* Main layout */}
          <div className={cn('grid gap-5', selectedIncident ? 'grid-cols-1 lg:grid-cols-5' : 'grid-cols-1')}>
            {/* Incident list */}
            <div className={cn('space-y-3', selectedIncident ? 'lg:col-span-3' : '')}>
              {panelIncidents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No incidents match your filters.</p>
                </div>
              ) : (
                panelIncidents.map((inc) => (
                  <IncidentCard
                    key={inc.id}
                    incident={inc}
                    onSelect={setSelectedId}
                    isSelected={selectedId === inc.id}
                  />
                ))
              )}
            </div>

            {/* Detail panel */}
            {selectedIncident && (
              <div className="lg:col-span-2">
                <div className="sticky top-4">
                  <IncidentDetail incident={selectedIncident} onClose={() => setSelectedId(null)} />
                </div>
              </div>
            )}
          </div>

          {/* Alert subscriptions (collapsible) */}
          {showAlerts && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="h-4 w-4" /> Threat Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isDisabled ? (
                  <p className="text-sm text-muted-foreground">Alerts are unavailable — Convex is disabled.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Follow CVE</p>
                      <div className="flex gap-2">
                        <Input value={cveInput} onChange={(e) => setCveInput(e.target.value)} placeholder="CVE-2024-XXXX" />
                        <Button onClick={handleSubscribeCve}>Follow</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cveSubs.map((cve: string) => (
                          <Badge key={cve} variant="secondary" className="gap-2">
                            {cve}
                            <button type="button" className="text-xs underline" onClick={() => unsubscribe({ userId, type: 'cve', value: cve })}>✕</button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Follow Tag</p>
                      <div className="flex gap-2">
                        <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="ransomware" />
                        <Button onClick={handleSubscribeTag}>Follow</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tagSubs.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="gap-2">
                            {tag}
                            <button type="button" className="text-xs underline" onClick={() => unsubscribe({ userId, type: 'tag', value: tag })}>✕</button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Cross-tool strip */}
          <div className="mt-10 p-5 rounded-xl border bg-muted/20">
            <p className="text-sm font-semibold mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-security" /> Take action on what you've seen</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { to: '/breach-sim',      icon: Activity, label: 'Simulate an Attack', sub: 'See how it would play out for your setup', color: 'text-destructive' },
                { to: '/security-score',  icon: Shield,   label: 'Check Your Score',   sub: 'Get a letter grade across 5 dimensions',   color: 'text-security' },
                { to: '/tools/nexusguard', icon: Zap,     label: 'NexusGuard AI Brief', sub: 'AI threat report for your stack',         color: 'text-tech' },
              ].map(({ to, icon: Icon, label, sub, color }) => (
                <Link key={to} to={to} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors group">
                  <Icon className={cn('h-5 w-5 shrink-0 mt-0.5', color)} />
                  <div>
                    <p className="text-sm font-medium group-hover:text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:text-foreground shrink-0 mt-0.5" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
});

export default LiveThreatDashboard;
