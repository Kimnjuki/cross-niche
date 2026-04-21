import React, { useState, useCallback, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Shield, ArrowLeft, CheckCircle, XCircle, ChevronRight,
  RotateCcw, Copy, Share2, AlertTriangle, Zap, Lock,
  Server, Eye, Activity, HardDrive, Radio, Users,
  AlertOctagon, Info,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type Answer = 'yes' | 'partial' | 'no';
type Phase = 'intro' | 'quiz' | 'results';

interface Question {
  id: string;
  category: Category;
  text: string;
  detail: string;
  yesPoints: number;
  partialPoints: number;
  fix: string;
  fixDetail: string;
}

type Category =
  | 'identity'
  | 'device'
  | 'network'
  | 'patching'
  | 'backups'
  | 'incident_response'
  | 'monitoring';

// ── Quiz questions ────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // Identity
  { id: 'id_mfa_all', category: 'identity', text: 'MFA is enforced on all user accounts — including admin and service accounts', detail: 'Single-factor accounts are the #1 path into organisations. No exceptions.', yesPoints: 14, partialPoints: 7, fix: 'Enforce MFA everywhere', fixDetail: 'Enable MFA on all accounts including service accounts, cloud consoles, and VPNs. Use FIDO2/authenticator apps — not SMS.' },
  { id: 'id_pam', category: 'identity', text: 'Privileged Access Management (PAM) is in place with just-in-time access', detail: 'Permanent privileged access is a massive blast radius. JIT reduces it to minutes.', yesPoints: 12, partialPoints: 6, fix: 'Deploy PAM with JIT', fixDetail: 'Implement a PAM solution (CyberArk, BeyondTrust, or Vault) that issues temporary privileged credentials for specific tasks.' },
  { id: 'id_sso', category: 'identity', text: 'All applications use centralised SSO (not separate login pages)', detail: 'Fragmented logins create unmanaged credential exposure. SSO centralises risk and visibility.', yesPoints: 8, partialPoints: 4, fix: 'Centralise via SSO', fixDetail: 'Deploy an identity provider (Okta, Azure AD, Entra ID) and route all application authentication through it.' },

  // Device
  { id: 'dev_mdm', category: 'device', text: 'All devices accessing corporate resources are enrolled in MDM/UEM', detail: 'Unmanaged devices are blind spots. Every device is a potential entry point.', yesPoints: 12, partialPoints: 6, fix: 'Enrol all devices in MDM', fixDetail: 'Deploy Intune, Jamf, or a similar MDM solution. Enforce enrollment as a condition of corporate network/resource access.' },
  { id: 'dev_health', category: 'device', text: 'Device health checks are required before granting resource access', detail: 'Zero trust means "never trust, always verify" — including device state at connection time.', yesPoints: 10, partialPoints: 5, fix: 'Implement device compliance policies', fixDetail: 'Configure Conditional Access (Azure AD) or similar to block access from devices without current patches, disk encryption, or AV.' },

  // Network
  { id: 'net_microseg', category: 'network', text: 'Network segmentation prevents lateral movement between departments/systems', detail: 'Flat networks let attackers move freely after initial compromise. Segmentation contains the blast.', yesPoints: 14, partialPoints: 7, fix: 'Implement network segmentation', fixDetail: 'Use VLANs, SDN, or firewall policies to isolate departments, servers, and IoT devices. Block east-west traffic by default.' },
  { id: 'net_vpn', category: 'network', text: 'Remote access uses a zero-trust network access (ZTNA) solution, not a traditional VPN', detail: 'Traditional VPNs grant broad network access. ZTNA provides application-level access only.', yesPoints: 8, partialPoints: 4, fix: 'Replace VPN with ZTNA', fixDetail: 'Evaluate Zscaler Private Access, Cloudflare Access, or Azure AD App Proxy for application-level remote access without network tunnels.' },

  // Patching
  { id: 'patch_critical', category: 'patching', text: 'Critical patches are applied within 72 hours of release across all systems', detail: 'Most breaches exploit known CVEs. Patch speed is your most effective vulnerability management metric.', yesPoints: 14, partialPoints: 7, fix: 'Target 72-hour critical patch SLA', fixDetail: 'Set a formal SLA: critical/CISA KEV = 24-72h, high = 7 days, medium = 30 days. Use automated patching tools where possible.' },
  { id: 'patch_inventory', category: 'patching', text: 'A complete, up-to-date asset inventory exists for all systems and software', detail: 'You can\'t patch what you don\'t know about. Asset visibility is the foundation of patch management.', yesPoints: 8, partialPoints: 4, fix: 'Build a complete asset inventory', fixDetail: 'Deploy a CMDB or asset management tool (Tenable, Qualys, or Axonius) to maintain continuous visibility of all assets and their patch state.' },

  // Backups
  { id: 'backup_321', category: 'backups', text: 'You follow a 3-2-1 backup strategy: 3 copies, 2 media types, 1 offsite', detail: 'Ransomware encrypts local and network-attached storage. Offsite immutable backups are the only reliable recovery path.', yesPoints: 14, partialPoints: 7, fix: 'Implement 3-2-1 backup strategy', fixDetail: 'Maintain 3 copies of critical data on 2 different media (e.g., local disk + cloud), with 1 copy offsite and air-gapped or immutable.' },
  { id: 'backup_test', category: 'backups', text: 'Backup restoration is tested at least quarterly', detail: 'Untested backups fail when you need them most. Recovery time is what matters, not just backup existence.', yesPoints: 8, partialPoints: 4, fix: 'Schedule quarterly restore tests', fixDetail: 'Run a full restore drill every quarter. Document Recovery Time Objective (RTO) and Recovery Point Objective (RPO). Fix gaps.' },

  // Incident Response
  { id: 'ir_plan', category: 'incident_response', text: 'A documented incident response plan exists and has been exercised in the last 12 months', detail: 'An untested IR plan is not a plan. Tabletop exercises reveal gaps before attackers do.', yesPoints: 12, partialPoints: 6, fix: 'Create and test your IR plan', fixDetail: 'Document your IR playbooks (ransomware, data breach, account takeover). Run a tabletop exercise annually. Assign roles explicitly.' },
  { id: 'ir_isolation', category: 'incident_response', text: 'You can isolate a compromised system from the network within 15 minutes', detail: 'Dwell time is the attacker\'s advantage. Fast isolation limits damage. If this takes hours, lateral movement is guaranteed.', yesPoints: 10, partialPoints: 5, fix: 'Test isolation procedures', fixDetail: 'Document and practise the isolation procedure for each system type (endpoint, server, cloud VM). Target <15 min from detection to isolation.' },

  // Monitoring
  { id: 'mon_siem', category: 'monitoring', text: 'All critical systems send logs to a centralised SIEM with alerting', detail: 'Without log centralisation, attacks are invisible. Detection depends on having the data.', yesPoints: 12, partialPoints: 6, fix: 'Deploy a SIEM', fixDetail: 'Centralise logs from endpoints, servers, cloud, and network devices into a SIEM (Sentinel, Splunk, or Elastic). Configure alert rules for critical events.' },
  { id: 'mon_mtta', category: 'monitoring', text: 'Your mean time to detect (MTTD) is under 24 hours for critical alerts', detail: 'Industry average MTTD is 197 days. Under 24 hours is the baseline for effective detection.', yesPoints: 10, partialPoints: 5, fix: 'Improve detection latency', fixDetail: 'Tune SIEM rules to reduce noise and increase signal. Consider MDR/MSSP if you don\'t have in-house capacity for 24/7 monitoring.' },
];

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORIES: Record<Category, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  identity:          { label: 'Identity & Access',     icon: Users,      color: 'text-security' },
  device:            { label: 'Device Management',     icon: HardDrive,  color: 'text-tech' },
  network:           { label: 'Network Segmentation',  icon: Server,     color: 'text-blue-500' },
  patching:          { label: 'Patch Management',      icon: Shield,     color: 'text-yellow-500' },
  backups:           { label: 'Backup & Recovery',     icon: Lock,       color: 'text-green-500' },
  incident_response: { label: 'Incident Response',     icon: Activity,   color: 'text-gaming' },
  monitoring:        { label: 'Monitoring & Detection', icon: Eye,        color: 'text-orange-500' },
};

// ── Tier helpers ──────────────────────────────────────────────────────────────

function getTier(pct: number): { label: string; emoji: string; desc: string; color: string; bg: string } {
  if (pct >= 85) return { label: 'Zero-Trust Architect', emoji: '🏰', desc: 'Excellent zero-trust posture. Your organisation limits blast radius, detects fast, and recovers effectively.', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500' };
  if (pct >= 65) return { label: 'Advanced Defender',   emoji: '🛡️', desc: 'Strong foundations. Address the remaining gaps to reach architect-level resilience.', color: 'text-tech', bg: 'bg-tech' };
  if (pct >= 40) return { label: 'Developing',          emoji: '⚠️', desc: 'Basic controls are present but critical zero-trust pillars are missing. Prioritise immediately.', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500' };
  return { label: 'Exposed',               emoji: '🔓', desc: 'Significant exposure across multiple zero-trust domains. A breach is a matter of when, not if, without urgent action.', color: 'text-destructive', bg: 'bg-destructive' };
}

// ── Score Ring ────────────────────────────────────────────────────────────────

function ScoreRing({ pct, color }: { pct: number; color: string }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const strokeColor = pct >= 85 ? '#22c55e' : pct >= 65 ? '#00F0FF' : pct >= 40 ? '#eab308' : '#ef4444';
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" strokeWidth="12" className="stroke-muted/30" />
        <circle cx="70" cy="70" r={r} fill="none" strokeWidth="12" stroke={strokeColor}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.19,1,0.22,1)' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className={cn('text-3xl font-bold font-display', color)}>{pct}%</div>
        <div className="text-xs text-muted-foreground leading-tight">zero-trust</div>
        <div className="text-xs text-muted-foreground">readiness</div>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ZeroTrustQuiz() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareToken] = useState(() => Math.random().toString(36).slice(2, 10).toUpperCase());

  const maxScore = useMemo(() => QUESTIONS.reduce((s, q) => s + q.yesPoints, 0), []);
  const score = useMemo(() => QUESTIONS.reduce((s, q) => {
    if (answers[q.id] === 'yes') return s + q.yesPoints;
    if (answers[q.id] === 'partial') return s + q.partialPoints;
    return s;
  }, 0), [answers]);
  const pct = Math.round((score / maxScore) * 100);
  const tier = getTier(pct);

  const answered = Object.keys(answers).length;
  const totalQuestions = QUESTIONS.length;
  const currentQ = QUESTIONS[currentIndex];
  const failedQuestions = QUESTIONS.filter(q => answers[q.id] === 'no' || answers[q.id] === 'partial');

  // Per-category scores
  const categoryScores = useMemo(() => {
    return Object.keys(CATEGORIES).map(cat => {
      const catQs = QUESTIONS.filter(q => q.category === cat as Category);
      const catMax = catQs.reduce((s, q) => s + q.yesPoints, 0);
      const catScore = catQs.reduce((s, q) => {
        if (answers[q.id] === 'yes') return s + q.yesPoints;
        if (answers[q.id] === 'partial') return s + q.partialPoints;
        return s;
      }, 0);
      return { category: cat as Category, score: catScore, max: catMax, pct: catMax > 0 ? Math.round((catScore / catMax) * 100) : 0 };
    });
  }, [answers]);

  const handleAnswer = useCallback((id: string, answer: Answer) => {
    setAnswers(prev => ({ ...prev, [id]: answer }));
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, totalQuestions]);

  const handleFinish = useCallback(() => setPhase('results'), []);
  const handleReset = useCallback(() => {
    setAnswers({});
    setCurrentIndex(0);
    setPhase('intro');
  }, []);

  const handleCopyBadge = useCallback(() => {
    navigator.clipboard.writeText(`Zero-Trust Readiness: ${pct}% (${tier.label}) — verified by The Grid Nexus. Token: ${shareToken}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [pct, tier.label, shareToken]);

  return (
    <Layout>
      <SEO
        title="Zero-Trust Readiness Quiz | The Grid Nexus"
        description="Assess your organisation's zero-trust security posture across 7 domains. Get a scored report with tier label, category breakdown, and prioritised fix list."
        canonical="https://thegridnexus.com/tools/zero-trust-quiz"
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
          <span className="text-foreground font-medium">Zero-Trust Quiz</span>
        </div>

        {/* Header */}
        {phase === 'intro' && (
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-security/10 border border-security/20 mb-4">
              <Shield className="h-8 w-8 text-security" />
            </div>
            <h1 className="font-display font-bold text-4xl mb-2">Zero-Trust Readiness Quiz</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              15 questions across 7 domains. Get a scored report with your tier, per-category breakdown, and a prioritised remediation plan.
            </p>
          </div>
        )}

        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <div className="space-y-6">
            <Card className="border-security/20">
              <CardHeader>
                <CardTitle>What this quiz covers</CardTitle>
                <CardDescription>Answer honestly about your current state — not your aspirational state.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(CATEGORIES).map(([key, cfg]) => {
                    const CIcon = cfg.icon;
                    const count = QUESTIONS.filter(q => q.category === key as Category).length;
                    return (
                      <div key={key} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
                        <CIcon className={cn('h-5 w-5 shrink-0', cfg.color)} />
                        <div>
                          <p className="text-sm font-semibold">{cfg.label}</p>
                          <p className="text-xs text-muted-foreground">{count} question{count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 rounded-lg bg-muted/30 border p-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1 flex items-center gap-1.5">
                    <Info className="h-4 w-4" /> How to use this tool
                  </p>
                  <p>Best for IT managers, security leads, and DevOps teams assessing their zero-trust posture. Results are for self-assessment only — no data is stored.</p>
                </div>
                <Button
                  className="w-full mt-5 bg-security hover:bg-security/90 text-black font-semibold"
                  onClick={() => setPhase('quiz')}
                >
                  Start Assessment <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Tier preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Zero-Trust Architect', pct: '85–100%', emoji: '🏰', color: 'text-green-600 dark:text-green-400' },
                { label: 'Advanced Defender',   pct: '65–84%',  emoji: '🛡️', color: 'text-tech' },
                { label: 'Developing',          pct: '40–64%',  emoji: '⚠️', color: 'text-yellow-600 dark:text-yellow-400' },
                { label: 'Exposed',             pct: '0–39%',   emoji: '🔓', color: 'text-destructive' },
              ].map(t => (
                <div key={t.label} className="rounded-lg border p-3 text-center bg-muted/20">
                  <div className="text-xl mb-1">{t.emoji}</div>
                  <div className={cn('text-xs font-bold', t.color)}>{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.pct}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── QUIZ ── */}
        {phase === 'quiz' && currentQ && (
          <div className="space-y-6">
            {/* Category + progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  {React.createElement(CATEGORIES[currentQ.category].icon, { className: cn('h-4 w-4', CATEGORIES[currentQ.category].color) })}
                  <span className={cn('font-medium text-xs', CATEGORIES[currentQ.category].color)}>
                    {CATEGORIES[currentQ.category].label}
                  </span>
                </div>
                <span>{answered + 1} / {totalQuestions}</span>
              </div>
              <Progress value={(answered / totalQuestions) * 100} className="h-2" />
            </div>

            {/* Question card */}
            <Card className="border-security/20">
              <CardHeader>
                <div className="flex items-start gap-3">
                  {React.createElement(CATEGORIES[currentQ.category].icon, {
                    className: cn('h-5 w-5 shrink-0 mt-0.5', CATEGORIES[currentQ.category].color)
                  })}
                  <div>
                    <CardTitle className="text-xl leading-snug">{currentQ.text}</CardTitle>
                    <CardDescription className="mt-1">{currentQ.detail}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button variant="outline" className="border-green-500/40 text-green-600 hover:bg-green-500/10 hover:border-green-500"
                    onClick={() => handleAnswer(currentQ.id, 'yes')}>
                    <CheckCircle className="mr-1.5 h-4 w-4" /> Yes, fully
                  </Button>
                  <Button variant="outline" className="border-yellow-500/40 text-yellow-600 hover:bg-yellow-500/10 hover:border-yellow-500"
                    onClick={() => handleAnswer(currentQ.id, 'partial')}>
                    <AlertTriangle className="mr-1.5 h-4 w-4" /> Partially
                  </Button>
                  <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
                    onClick={() => handleAnswer(currentQ.id, 'no')}>
                    <XCircle className="mr-1.5 h-4 w-4" /> No
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Answered pills */}
            {answered > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {QUESTIONS.slice(0, answered).map(q => (
                  <span key={q.id} className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border',
                    answers[q.id] === 'yes'    ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400' :
                    answers[q.id] === 'partial' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400' :
                    'bg-destructive/10 border-destructive/30 text-destructive')}>
                    {answers[q.id] === 'yes' ? <CheckCircle className="h-2.5 w-2.5" /> : answers[q.id] === 'partial' ? <AlertTriangle className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                    {CATEGORIES[q.category].label.split(' ')[0]}
                  </span>
                ))}
              </div>
            )}

            {answered >= totalQuestions && (
              <Button className="w-full bg-security hover:bg-security/90 text-black font-semibold" onClick={handleFinish}>
                View Zero-Trust Report <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* ── RESULTS ── */}
        {phase === 'results' && (
          <div className="space-y-6">
            {/* Score hero */}
            <Card className="border-security/20">
              <CardContent className="pt-8 pb-6 text-center space-y-4">
                <ScoreRing pct={pct} color={tier.color} />
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl">{tier.emoji}</span>
                    <span className={cn('text-2xl font-bold font-display', tier.color)}>{tier.label}</span>
                  </div>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">{tier.desc}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Score: {score}/{maxScore} pts · {failedQuestions.length} gaps found
                </p>
                {/* Share badge */}
                <div className="flex justify-center">
                  <button
                    onClick={handleCopyBadge}
                    className="flex items-center gap-2 text-xs px-4 py-2 rounded-full border hover:bg-muted/50 transition-colors"
                  >
                    {copied ? <><CheckCircle className="h-3.5 w-3.5 text-green-500" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy Nexus Security Badge (Token: {shareToken})</>}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Category breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Radio className="h-4 w-4 text-security" /> Domain Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryScores.map(({ category, score: cs, max, pct: cpct }) => {
                  const cfg = CATEGORIES[category];
                  const CIcon = cfg.icon;
                  const barColor = cpct >= 80 ? 'bg-green-500' : cpct >= 60 ? 'bg-tech' : cpct >= 40 ? 'bg-yellow-500' : 'bg-destructive';
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <CIcon className={cn('h-3.5 w-3.5', cfg.color)} />
                          <span className="text-sm font-medium">{cfg.label}</span>
                        </div>
                        <span className="text-sm font-semibold">{cpct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${cpct}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{cs}/{max} pts</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Priority fixes */}
            {failedQuestions.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertOctagon className="h-4 w-4 text-destructive" />
                    Priority Fixes ({failedQuestions.length})
                  </CardTitle>
                  <CardDescription>Ordered by impact (highest points first)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[...failedQuestions]
                    .sort((a, b) => b.yesPoints - a.yesPoints)
                    .map(q => {
                      const isPartial = answers[q.id] === 'partial';
                      const cfg = CATEGORIES[q.category];
                      const CIcon = cfg.icon;
                      return (
                        <div key={q.id} className={cn('rounded-lg border p-3', isPartial ? 'border-yellow-500/20 bg-yellow-500/5' : 'border-destructive/20 bg-destructive/5')}>
                          <div className="flex items-start gap-2 mb-1.5">
                            <CIcon className={cn('h-4 w-4 mt-0.5 shrink-0', cfg.color)} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-sm">{q.fix}</p>
                                <Badge variant={isPartial ? 'outline' : 'destructive'} className="text-xs">
                                  {isPartial ? 'Partial' : 'Missing'} · +{q.yesPoints}pts
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 mb-1">{q.text}</p>
                              <p className="text-xs text-muted-foreground">{q.fixDetail}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            )}

            {/* What you're doing right */}
            {answered > failedQuestions.length && (
              <Card className="border-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" /> What You're Doing Right
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {QUESTIONS.filter(q => answers[q.id] === 'yes').map(q => {
                      const cfg = CATEGORIES[q.category];
                      const CIcon = cfg.icon;
                      return (
                        <span key={q.id} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">
                          <CIcon className="h-3 w-3" />
                          {q.fix}
                        </span>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Related tools */}
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-sm font-semibold mb-3">More Security Tools</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { href: '/tools/breach-explainer',  icon: AlertTriangle, label: 'Breach Explainer', sub: 'Incident analysis',  color: 'text-destructive hover:bg-destructive/10 border-destructive/20' },
                  { href: '/tools/ioc-lookup',        icon: Shield,        label: 'IOC Lookup',       sub: 'Threat analysis',   color: 'text-security hover:bg-security/10 border-security/20' },
                  { href: '/tools/ai-tool-finder',    icon: Zap,           label: 'AI Tool Finder',   sub: 'Security tools dir', color: 'text-tech hover:bg-tech/10 border-tech/20' },
                ].map(t => (
                  <Link key={t.href} to={t.href} className={cn('flex flex-col gap-1 rounded-lg border p-3 transition-colors', t.color)}>
                    <t.icon className="h-4 w-4" />
                    <span className="text-xs font-semibold">{t.label}</span>
                    <span className="text-xs text-muted-foreground">{t.sub}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={handleReset}>
                <RotateCcw className="mr-1.5 h-4 w-4" /> Retake Quiz
              </Button>
              <Button className="flex-1 bg-security hover:bg-security/90 text-black font-semibold" asChild>
                <Link to="/tools/nexusguard" className="flex items-center gap-1.5">
                  AI Threat Assessment <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
