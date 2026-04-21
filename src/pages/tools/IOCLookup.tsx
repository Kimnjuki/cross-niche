import React, { useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Search, Shield, AlertTriangle, CheckCircle, XCircle,
  Globe, Server, Hash, Mail, Link2, ArrowLeft, Copy,
  ExternalLink, Eye, Activity, Zap, RefreshCcw, Info,
  ChevronRight, Database, Cpu, Lock, AlertOctagon,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type IOCType = 'ip' | 'domain' | 'hash' | 'email' | 'url' | 'unknown';
type Severity = 'critical' | 'high' | 'medium' | 'low' | 'clean';

interface Source {
  name: string;
  detections: number;
  total: number;
  verdict: 'malicious' | 'suspicious' | 'clean' | 'unknown';
  lastScan: string;
}

interface IOCResult {
  ioc: string;
  type: IOCType;
  riskScore: number; // 0–100
  severity: Severity;
  country?: string;
  countryCode?: string;
  asn?: string;
  asnOrg?: string;
  abuseReports?: number;
  firstSeen?: string;
  lastSeen?: string;
  threatTags: string[];
  malwareFamilies: string[];
  sources: Source[];
  nexusVerdict: string;
  nexusVerdictDetail: string;
  behaviorSummary?: string;
  resolvedIPs?: string[];
  resolvedDomains?: string[];
}

// ── IOC type detection ────────────────────────────────────────────────────────

function detectIOCType(value: string): IOCType {
  const v = value.trim();
  if (/^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(v)) return 'ip';
  if (/^[a-fA-F0-9]{32}$/.test(v)) return 'hash';
  if (/^[a-fA-F0-9]{40}$/.test(v)) return 'hash';
  if (/^[a-fA-F0-9]{64}$/.test(v)) return 'hash';
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'email';
  if (/^https?:\/\//i.test(v)) return 'url';
  if (/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(v)) return 'domain';
  return 'unknown';
}

function getHashLength(value: string): '128-bit MD5' | '160-bit SHA-1' | '256-bit SHA-256' | 'Unknown hash' {
  const len = value.trim().length;
  if (len === 32) return '128-bit MD5';
  if (len === 40) return '160-bit SHA-1';
  if (len === 64) return '256-bit SHA-256';
  return 'Unknown hash';
}

// ── Mock threat intelligence database ────────────────────────────────────────
// Replace fetch calls with: VirusTotal /api/v3, AbuseIPDB /api/v2/check,
// Shodan /shodan/host/{ip}, GreyNoise /v3/community/{ip}

const MOCK_DB: Record<string, Partial<IOCResult>> = {
  ip: {
    riskScore: 87,
    severity: 'high',
    country: 'Russian Federation',
    countryCode: 'RU',
    asn: 'AS48666',
    asnOrg: 'MAROSNET-AS Marosnet Telecommunication Company LLC',
    abuseReports: 342,
    firstSeen: '2023-08-14',
    lastSeen: '2025-04-19',
    threatTags: ['Botnet C2', 'Scanner', 'Brute-force', 'Credential Stuffing'],
    malwareFamilies: ['Mirai', 'QakBot'],
    sources: [
      { name: 'VirusTotal', detections: 47, total: 91, verdict: 'malicious', lastScan: '2h ago' },
      { name: 'AbuseIPDB', detections: 342, total: 342, verdict: 'malicious', lastScan: '1h ago' },
      { name: 'Shodan', detections: 1, total: 1, verdict: 'suspicious', lastScan: '6h ago' },
      { name: 'GreyNoise', detections: 1, total: 1, verdict: 'malicious', lastScan: '30m ago' },
    ],
    nexusVerdict: 'Block Immediately',
    nexusVerdictDetail: 'This IP has an extensive history of credential stuffing and botnet C2 activity with 342 community abuse reports. Firewall block recommended. Do not interact with any content served from this host.',
    behaviorSummary: 'Active Mirai botnet node scanning TCP/23 and TCP/2323. Hosts QakBot C2 panel on port 8443. Observed in brute-force campaigns targeting Steam and gaming accounts (April 2025).',
  },
  domain: {
    riskScore: 64,
    severity: 'medium',
    country: 'Netherlands',
    countryCode: 'NL',
    abuseReports: 28,
    firstSeen: '2024-11-03',
    lastSeen: '2025-04-18',
    threatTags: ['Phishing', 'Brand Impersonation', 'Typosquat'],
    malwareFamilies: [],
    resolvedIPs: ['185.220.101.47', '45.142.212.100'],
    sources: [
      { name: 'VirusTotal', detections: 12, total: 91, verdict: 'suspicious', lastScan: '4h ago' },
      { name: 'AbuseIPDB', detections: 28, total: 28, verdict: 'suspicious', lastScan: '3h ago' },
      { name: 'Shodan', detections: 0, total: 1, verdict: 'clean', lastScan: '12h ago' },
      { name: 'GreyNoise', detections: 0, total: 1, verdict: 'unknown', lastScan: 'N/A' },
    ],
    nexusVerdict: 'Suspicious — Avoid',
    nexusVerdictDetail: 'Domain registered 5 months ago with privacy-protected WHOIS. Flagged by 12/91 engines as a Steam login phishing page. Resolves to Tor exit nodes. Do not enter credentials.',
    behaviorSummary: 'Impersonates Valve/Steam login. Harvests session cookies and trades using stolen Mobile Authenticator intercept technique. Active phishing kit deployed November 2024.',
  },
  hash: {
    riskScore: 95,
    severity: 'critical',
    abuseReports: 0,
    firstSeen: '2025-02-11',
    lastSeen: '2025-04-15',
    threatTags: ['Ransomware', 'Dropper', 'Persistence', 'Credential Theft'],
    malwareFamilies: ['LockBit 3.0', 'RedLine Stealer'],
    sources: [
      { name: 'VirusTotal', detections: 76, total: 72, verdict: 'malicious', lastScan: '1d ago' },
      { name: 'AbuseIPDB', detections: 0, total: 0, verdict: 'unknown', lastScan: 'N/A' },
      { name: 'Shodan', detections: 0, total: 0, verdict: 'unknown', lastScan: 'N/A' },
      { name: 'GreyNoise', detections: 0, total: 0, verdict: 'unknown', lastScan: 'N/A' },
    ],
    nexusVerdict: 'Confirmed Malware — Quarantine',
    nexusVerdictDetail: 'SHA-256 matches LockBit 3.0 dropper that deploys RedLine Stealer as a secondary payload. Seen in targeted attacks on gaming studios and esports orgs. DO NOT execute. Quarantine and submit to CISA.',
    behaviorSummary: 'Packs a .NET loader that decrypts a LockBit 3.0 payload into memory. Spawns RedLine Stealer to harvest Steam credentials, browser cookies, and crypto wallets before encryption.',
  },
  email: {
    riskScore: 43,
    severity: 'medium',
    abuseReports: 7,
    firstSeen: '2024-06-22',
    lastSeen: '2025-03-30',
    threatTags: ['Spam', 'Social Engineering'],
    malwareFamilies: [],
    sources: [
      { name: 'VirusTotal', detections: 4, total: 91, verdict: 'suspicious', lastScan: '2d ago' },
      { name: 'AbuseIPDB', detections: 7, total: 7, verdict: 'suspicious', lastScan: '5d ago' },
      { name: 'Shodan', detections: 0, total: 0, verdict: 'unknown', lastScan: 'N/A' },
      { name: 'GreyNoise', detections: 0, total: 0, verdict: 'unknown', lastScan: 'N/A' },
    ],
    nexusVerdict: 'Low-Level Risk — Monitor',
    nexusVerdictDetail: 'Email address associated with 7 spam reports. No confirmed phishing or malware distribution. Recommend caution if this address reaches out about trades, gifts, or account verification.',
    behaviorSummary: 'Flagged for social engineering attempts posing as "Steam Support". Typically asks targets to click external links to "verify" accounts. No payload delivery confirmed.',
  },
  url: {
    riskScore: 78,
    severity: 'high',
    country: 'United States',
    countryCode: 'US',
    abuseReports: 93,
    firstSeen: '2025-01-05',
    lastSeen: '2025-04-20',
    threatTags: ['Malware Distribution', 'Drive-by Download', 'Exploit Kit'],
    malwareFamilies: ['SocGholish', 'Cobalt Strike'],
    resolvedIPs: ['104.21.68.122'],
    sources: [
      { name: 'VirusTotal', detections: 34, total: 91, verdict: 'malicious', lastScan: '45m ago' },
      { name: 'AbuseIPDB', detections: 93, total: 93, verdict: 'malicious', lastScan: '2h ago' },
      { name: 'Shodan', detections: 1, total: 1, verdict: 'suspicious', lastScan: '8h ago' },
      { name: 'GreyNoise', detections: 0, total: 1, verdict: 'clean', lastScan: '1h ago' },
    ],
    nexusVerdict: 'Active Threat — Do Not Visit',
    nexusVerdictDetail: 'URL hosts SocGholish fake browser update that drops Cobalt Strike beacon. 93 abuse reports in last 30 days. CDN-fronted for evasion. Block at DNS/proxy level.',
    behaviorSummary: 'Injected into compromised game modding sites. Poses as a mandatory "DirectX update". Downloads and executes a Cobalt Strike stage-1 beacon that connects to attacker C2 infrastructure.',
  },
};

function getMockResult(ioc: string, type: IOCType): IOCResult {
  const base = MOCK_DB[type] ?? MOCK_DB['domain'];
  return {
    ioc,
    type,
    riskScore: base.riskScore ?? 50,
    severity: base.severity ?? 'medium',
    country: base.country,
    countryCode: base.countryCode,
    asn: base.asn,
    asnOrg: base.asnOrg,
    abuseReports: base.abuseReports ?? 0,
    firstSeen: base.firstSeen,
    lastSeen: base.lastSeen,
    threatTags: base.threatTags ?? [],
    malwareFamilies: base.malwareFamilies ?? [],
    sources: base.sources ?? [],
    nexusVerdict: base.nexusVerdict ?? 'No Threat Detected',
    nexusVerdictDetail: base.nexusVerdictDetail ?? 'No threats associated with this indicator.',
    behaviorSummary: base.behaviorSummary,
    resolvedIPs: base.resolvedIPs,
    resolvedDomains: base.resolvedDomains,
  };
}

// ── UI helpers ────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<IOCType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  ip:      { label: 'IP Address',    icon: Server,  color: 'text-tech' },
  domain:  { label: 'Domain',        icon: Globe,   color: 'text-security' },
  hash:    { label: 'File Hash',     icon: Hash,    color: 'text-yellow-500' },
  email:   { label: 'Email Address', icon: Mail,    color: 'text-blue-500' },
  url:     { label: 'URL',           icon: Link2,   color: 'text-orange-500' },
  unknown: { label: 'Unknown',       icon: Search,  color: 'text-muted-foreground' },
};

const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; ring: string; label: string }> = {
  critical: { color: 'text-red-600 dark:text-red-400',    bg: 'bg-red-500/10',    ring: '#ef4444', label: 'Critical Risk' },
  high:     { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10', ring: '#f97316', label: 'High Risk' },
  medium:   { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10', ring: '#eab308', label: 'Medium Risk' },
  low:      { color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-500/10',   ring: '#3b82f6', label: 'Low Risk' },
  clean:    { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10',  ring: '#22c55e', label: 'Clean' },
};

const SOURCE_VERDICT_CONFIG: Record<Source['verdict'], { color: string; icon: React.ComponentType<{ className?: string }> }> = {
  malicious:  { color: 'text-destructive', icon: XCircle },
  suspicious: { color: 'text-yellow-500',  icon: AlertTriangle },
  clean:      { color: 'text-green-500',   icon: CheckCircle },
  unknown:    { color: 'text-muted-foreground', icon: Info },
};

// ── Score Ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score, severity }: { score: number; severity: Severity }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const cfg = SEVERITY_CONFIG[severity];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="10" className="stroke-muted/30" />
        <circle
          cx="64" cy="64" r={r} fill="none" strokeWidth="10"
          stroke={cfg.ring}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.19,1,0.22,1)' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className={cn('text-3xl font-bold font-display', cfg.color)}>{score}</div>
        <div className="text-xs text-muted-foreground">/ 100</div>
      </div>
    </div>
  );
}

// ── EXAMPLE IOCs for the UI ───────────────────────────────────────────────────

const EXAMPLES = [
  { label: 'Malicious IP', value: '185.220.101.47' },
  { label: 'Phishing domain', value: 'steamcommunit-login.ru' },
  { label: 'Malware hash', value: 'a3b4c5d6e7f8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a1b2c3d4e5f6a7b8' },
  { label: 'Spam email', value: 'free-skins@gift-steam.biz' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function IOCLookup() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<IOCResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const detectedType = query.trim() ? detectIOCType(query.trim()) : 'unknown';

  const handleLookup = useCallback(async (value?: string) => {
    const ioc = (value ?? query).trim();
    if (!ioc) { setError('Enter an IP, domain, file hash, or email to analyse.'); return; }
    const type = detectIOCType(ioc);
    if (type === 'unknown') { setError('Unable to detect IOC type. Check your input.'); return; }
    setError('');
    setLoading(true);
    setResult(null);
    // Simulate network latency (swap for real API calls in production)
    await new Promise(r => setTimeout(r, 900));
    setResult(getMockResult(ioc, type));
    setLoading(false);
  }, [query]);

  const handleCopy = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result.ioc).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result]);

  const handleReset = useCallback(() => {
    setQuery('');
    setResult(null);
    setError('');
  }, []);

  const TypeIcon = result ? TYPE_CONFIG[result.type].icon : Search;
  const severityCfg = result ? SEVERITY_CONFIG[result.severity] : null;

  return (
    <Layout>
      <SEO
        title="IOC / Threat-Hunting Lookup | The Grid Nexus"
        description="Instantly analyse IPs, domains, file hashes, and email addresses against VirusTotal, AbuseIPDB, Shodan, and GreyNoise data. Free threat-hunting tool."
        canonical="https://thegridnexus.com/tools/ioc-lookup"
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
          <span className="text-foreground font-medium">IOC Lookup</span>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-security/10 border border-security/20 mb-4">
            <Search className="h-8 w-8 text-security" />
          </div>
          <h1 className="font-display font-bold text-4xl mb-2">IOC Threat-Hunting Lookup</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Analyse IPs, domains, file hashes, and emails across VirusTotal, AbuseIPDB, Shodan & GreyNoise in one shot.
          </p>
        </div>

        {/* Search */}
        <Card className="border-security/20 mb-6">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                {detectedType !== 'unknown' && query.trim() ? (
                  <>
                    {React.createElement(TYPE_CONFIG[detectedType].icon, { className: cn('h-4 w-4', TYPE_CONFIG[detectedType].color) })}
                    <span className={cn('text-xs font-medium', TYPE_CONFIG[detectedType].color)}>
                      {TYPE_CONFIG[detectedType].label}
                    </span>
                  </>
                ) : (
                  <Search className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <Input
                className="pl-28 pr-4 font-mono text-sm"
                placeholder="IP • Domain • MD5/SHA1/SHA256 • Email • URL"
                value={query}
                onChange={e => { setQuery(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleLookup()}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> {error}
              </p>
            )}

            <Button
              className="w-full bg-security hover:bg-security/90 text-black font-semibold"
              onClick={() => handleLookup()}
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <><RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> Querying threat feeds…</>
              ) : (
                <><Search className="mr-2 h-4 w-4" /> Analyse Indicator</>
              )}
            </Button>

            {/* Examples */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground self-center">Try:</span>
              {EXAMPLES.map(ex => (
                <button
                  key={ex.value}
                  onClick={() => { setQuery(ex.value); setError(''); handleLookup(ex.value); }}
                  className="text-xs px-2.5 py-1 rounded-full border border-security/20 text-security hover:bg-security/10 transition-colors font-mono"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-xl bg-muted/40" />
            ))}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-5">
            {/* Header card */}
            <Card className={cn('border-2', result.severity === 'critical' ? 'border-red-500/40' : result.severity === 'high' ? 'border-orange-500/40' : result.severity === 'medium' ? 'border-yellow-500/40' : result.severity === 'low' ? 'border-blue-500/40' : 'border-green-500/40')}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <ScoreRing score={result.riskScore} severity={result.severity} />
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <Badge className={cn(severityCfg?.color, severityCfg?.bg, 'border-current text-sm px-3 py-0.5')}>
                        {severityCfg?.label}
                      </Badge>
                      <Badge variant="outline" className={cn(TYPE_CONFIG[result.type].color, 'text-xs')}>
                        {TYPE_CONFIG[result.type].label}
                        {result.type === 'hash' && ` · ${getHashLength(result.ioc)}`}
                      </Badge>
                    </div>
                    <div className="font-mono text-sm text-muted-foreground break-all flex items-center gap-1.5 justify-center sm:justify-start">
                      <TypeIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{result.ioc.length > 48 ? `${result.ioc.slice(0, 24)}…${result.ioc.slice(-12)}` : result.ioc}</span>
                      <button onClick={handleCopy} title="Copy IOC" className="ml-1 text-muted-foreground hover:text-foreground transition-colors">
                        {copied ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground justify-center sm:justify-start">
                      {result.country && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{result.country}</span>}
                      {result.abuseReports != null && <span className="flex items-center gap-1"><AlertOctagon className="h-3 w-3" />{result.abuseReports} abuse reports</span>}
                      {result.firstSeen && <span className="flex items-center gap-1"><Eye className="h-3 w-3" />First seen {result.firstSeen}</span>}
                      {result.lastSeen && <span className="flex items-center gap-1"><Activity className="h-3 w-3" />Last seen {result.lastSeen}</span>}
                    </div>
                    {result.asn && (
                      <p className="text-xs text-muted-foreground"><span className="font-mono">{result.asn}</span> · {result.asnOrg}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nexus Verdict */}
            <Card className={cn('border', severityCfg?.bg)}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-5 w-5 text-security" />
                  Nexus Verdict
                  <Badge className="ml-auto text-xs bg-security/20 text-security border-security/30">{result.nexusVerdict}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.nexusVerdictDetail}</p>
              </CardContent>
            </Card>

            {/* Threat tags & malware families */}
            {(result.threatTags.length > 0 || result.malwareFamilies.length > 0) && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-destructive" />
                    Threat Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.threatTags.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Threat Categories</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.threatTags.map(tag => (
                          <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.malwareFamilies.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Malware Families</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.malwareFamilies.map(fam => (
                          <span key={fam} className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-mono font-medium">
                            {fam}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Detection sources */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4 text-tech" />
                  Detection Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.sources.map(src => {
                  const vcfg = SOURCE_VERDICT_CONFIG[src.verdict];
                  const VIcon = vcfg.icon;
                  const pct = src.total > 0 ? Math.round((src.detections / src.total) * 100) : 0;
                  return (
                    <div key={src.name} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-28 shrink-0">{src.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all', src.verdict === 'malicious' ? 'bg-destructive' : src.verdict === 'suspicious' ? 'bg-yellow-500' : src.verdict === 'clean' ? 'bg-green-500' : 'bg-muted')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-16 shrink-0 text-right">
                        {src.total > 0 ? `${src.detections}/${src.total}` : 'N/A'}
                      </span>
                      <VIcon className={cn('h-4 w-4 shrink-0', vcfg.color)} />
                      <span className="text-xs text-muted-foreground w-16 shrink-0 text-right hidden sm:block">{src.lastScan}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Behavior summary */}
            {result.behaviorSummary && (
              <Card className="border-security/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-security" />
                    Behavioral Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.behaviorSummary}</p>
                </CardContent>
              </Card>
            )}

            {/* Network details */}
            {(result.resolvedIPs?.length || result.resolvedDomains?.length) ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Network Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.resolvedIPs && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Resolved IPs</p>
                      <div className="flex flex-wrap gap-2">
                        {result.resolvedIPs.map(ip => (
                          <span key={ip} className="font-mono text-xs px-2 py-0.5 rounded bg-muted/40 border">
                            {ip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.resolvedDomains && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Resolved Domains</p>
                      <div className="flex flex-wrap gap-2">
                        {result.resolvedDomains.map(d => (
                          <span key={d} className="font-mono text-xs px-2 py-0.5 rounded bg-muted/40 border">{d}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : null}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                <RefreshCcw className="mr-1.5 h-4 w-4" />
                New Lookup
              </Button>
              <Button
                className="flex-1 bg-security hover:bg-security/90 text-black"
                asChild
              >
                <a
                  href={`https://www.virustotal.com/gui/search/${encodeURIComponent(result.ioc)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  View on VirusTotal <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>

            {/* Related tools */}
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-sm font-semibold mb-3">More Security Tools</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { href: '/tools/exploit-risk-meter', icon: AlertOctagon, label: 'Exploit Risk Meter', sub: 'CVE risk levels', color: 'text-destructive hover:bg-destructive/10 border-destructive/20' },
                  { href: '/live-threat-dashboard',    icon: Activity,     label: 'Live Threats',       sub: 'Real-time feed',  color: 'text-security hover:bg-security/10 border-security/20' },
                  { href: '/tools/breach-explainer',   icon: Shield,       label: 'Breach Explainer',   sub: 'Incident analysis', color: 'text-tech hover:bg-tech/10 border-tech/20' },
                ].map(t => (
                  <Link key={t.href} to={t.href} className={cn('flex flex-col gap-1 rounded-lg border p-3 transition-colors', t.color)}>
                    <t.icon className="h-4 w-4" />
                    <span className="text-xs font-semibold">{t.label}</span>
                    <span className="text-xs text-muted-foreground">{t.sub}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
