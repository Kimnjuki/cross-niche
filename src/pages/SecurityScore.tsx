import { memo, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import {
  Shield, CheckCircle, AlertTriangle, RotateCcw, ChevronRight, ArrowLeft,
  Share2, Gamepad2, Tv2, PenTool, Terminal, User, Lock, Eye, Wifi, Layers,
  Zap, Activity, Star,
} from 'lucide-react';
import { SecurityToolsStrip } from '@/components/security/SecurityToolsStrip';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

// ── Types ─────────────────────────────────────────────────────────────────────

type Answer = 'yes' | 'partial' | 'no' | null;
type Persona = 'gamer' | 'streamer' | 'creator' | 'sysadmin' | 'general';
type Grade = 'A' | 'B' | 'C' | 'D' | 'F';
type Dimension = 'account_hardening' | 'breach_exposure' | 'device_network' | 'platform_permissions' | 'behaviour';
type Phase = 'intro' | 'persona' | 'quiz' | 'results';

interface Question {
  id: number;
  text: string;
  dimension: Dimension;
  yesPoints: number;
  partialPoints: number;
  recommendation: string;
  linkedTool?: string;
}

// ── Static data ────────────────────────────────────────────────────────────────

const PERSONAS: { id: Persona; label: string; sub: string; icon: React.ElementType; color: string; bg: string }[] = [
  { id: 'gamer',    label: 'Gamer',      sub: 'PC / console / mobile',   icon: Gamepad2, color: 'text-gaming',   bg: 'bg-gaming/10 border-gaming/30 hover:border-gaming' },
  { id: 'streamer', label: 'Streamer',   sub: 'Twitch / YouTube Live',    icon: Tv2,      color: 'text-red-400',  bg: 'bg-red-500/10 border-red-500/30 hover:border-red-400' },
  { id: 'creator',  label: 'Creator',    sub: 'YouTube / TikTok / Shorts', icon: PenTool,  color: 'text-tech',     bg: 'bg-tech/10 border-tech/30 hover:border-tech' },
  { id: 'sysadmin', label: 'SysAdmin',   sub: 'Dev / DevOps / sysadmin',  icon: Terminal, color: 'text-security', bg: 'bg-security/10 border-security/30 hover:border-security' },
  { id: 'general',  label: 'General',    sub: 'Just a regular user',      icon: User,     color: 'text-muted-foreground', bg: 'bg-muted/40 border-border hover:border-foreground/50' },
];

const DIMENSION_META: Record<Dimension, { label: string; icon: React.ElementType; color: string; weight: number }> = {
  account_hardening:    { label: 'Account Hardening',    icon: Lock,   color: 'text-security', weight: 0.30 },
  breach_exposure:      { label: 'Breach Exposure',      icon: Eye,    color: 'text-red-400',  weight: 0.25 },
  device_network:       { label: 'Device & Network',     icon: Wifi,   color: 'text-tech',     weight: 0.20 },
  platform_permissions: { label: 'Platform Permissions', icon: Layers, color: 'text-gaming',   weight: 0.15 },
  behaviour:            { label: 'Behaviour',            icon: Activity, color: 'text-yellow-400', weight: 0.10 },
};

const QUESTIONS: Question[] = [
  {
    id: 1, dimension: 'account_hardening', yesPoints: 12, partialPoints: 6,
    text: 'Do you have two-factor authentication (2FA) enabled on all your gaming and social accounts?',
    recommendation: 'Enable 2FA on every platform — Steam, Xbox, PlayStation, Discord, YouTube. Use an authenticator app over SMS.',
    linkedTool: '/tools/gaming-security-checkup',
  },
  {
    id: 2, dimension: 'account_hardening', yesPoints: 12, partialPoints: 5,
    text: 'Do you use a unique password for each platform (no password reuse)?',
    recommendation: 'Reused passwords are the #1 cause of account takeovers. Use a password manager (Bitwarden is free) to generate unique passwords per site.',
    linkedTool: '/tools/nexusguard',
  },
  {
    id: 3, dimension: 'account_hardening', yesPoints: 10, partialPoints: 4,
    text: 'Do you use a password manager to store your credentials?',
    recommendation: 'A password manager (Bitwarden, 1Password) is the easiest way to maintain strong, unique passwords without memorising them.',
  },
  {
    id: 4, dimension: 'breach_exposure', yesPoints: 25, partialPoints: 10,
    text: 'Have you checked if your primary email(s) have appeared in a known data breach (e.g., HaveIBeenPwned)?',
    recommendation: 'Go to haveibeenpwned.com right now. If your email is compromised, change the password on every service that uses it and enable 2FA.',
    linkedTool: '/tools/ioc-lookup',
  },
  {
    id: 5, dimension: 'device_network', yesPoints: 10, partialPoints: 5,
    text: 'Do you keep your OS, gaming clients, and apps updated promptly (within 7 days of release)?',
    recommendation: 'Enable auto-updates for your OS and gaming clients. Patches often fix zero-days actively exploited by attackers.',
    linkedTool: '/tools/exploit-risk-meter',
  },
  {
    id: 6, dimension: 'device_network', yesPoints: 10, partialPoints: 4,
    text: 'Do you use a VPN or avoid gaming/streaming on public or untrusted Wi-Fi networks?',
    recommendation: 'Public Wi-Fi exposes you to MITM attacks. Use a reputable VPN (Mullvad, ProtonVPN) or avoid public networks for sensitive accounts.',
  },
  {
    id: 7, dimension: 'behaviour', yesPoints: 12, partialPoints: 5,
    text: 'Do you think before clicking links in DMs, Discord, or emails — especially from strangers or "giveaways"?',
    recommendation: 'Phishing via Discord DM and email is how most gaming accounts get stolen. Never click gift/giveaway links from unknown senders.',
    linkedTool: '/tools/breach-explainer',
  },
  {
    id: 8, dimension: 'account_hardening', yesPoints: 10, partialPoints: 4,
    text: 'Do you have account recovery codes or backup methods (backup email/phone) saved securely?',
    recommendation: 'Print or store recovery codes offline. Losing 2FA access without backups can permanently lock you out of your accounts.',
  },
  {
    id: 9, dimension: 'platform_permissions', yesPoints: 11, partialPoints: 5,
    text: 'Have you audited which third-party apps have access to your accounts (Steam, Discord, Google, Twitch)?',
    recommendation: 'Revoke OAuth tokens for apps you no longer use. Go to each platform\'s Connected Apps / Authorised Apps settings page.',
    linkedTool: '/tools/steam-scanner',
  },
  {
    id: 10, dimension: 'platform_permissions', yesPoints: 11, partialPoints: 4,
    text: 'Do you regularly review privacy settings on your platforms (friend visibility, data sharing, location)?',
    recommendation: 'Platforms often reset or add new data-sharing defaults after updates. Review privacy settings every 3–6 months on all your platforms.',
    linkedTool: '/tools/gaming-security-checkup',
  },
];

// Dimension max scores (sum of yesPoints per dimension)
const DIMENSION_MAX: Record<Dimension, number> = {
  account_hardening:    0,
  breach_exposure:      0,
  device_network:       0,
  platform_permissions: 0,
  behaviour:            0,
};
QUESTIONS.forEach((q) => { DIMENSION_MAX[q.dimension] += q.yesPoints; });
const MAX_SCORE = QUESTIONS.reduce((s, q) => s + q.yesPoints, 0);

function getGrade(pct: number): { grade: Grade; label: string; color: string; bg: string; border: string; ring: string } {
  if (pct >= 90) return { grade: 'A', label: 'Excellent',  color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500',  ring: '#22c55e' };
  if (pct >= 75) return { grade: 'B', label: 'Good',       color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500',   ring: '#3b82f6' };
  if (pct >= 60) return { grade: 'C', label: 'Fair',       color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500', ring: '#eab308' };
  if (pct >= 45) return { grade: 'D', label: 'At Risk',    color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500', ring: '#f97316' };
  return              { grade: 'F', label: 'Exposed',    color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500',    ring: '#ef4444' };
}

// ── Score Ring ─────────────────────────────────────────────────────────────────

const ScoreRing = memo(function ScoreRing({ pct, ring, grade, label }: { pct: number; ring: string; grade: string; label: string }) {
  const r = 64;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" strokeWidth="12" className="stroke-muted/30" />
        <circle cx="80" cy="80" r={r} fill="none" strokeWidth="12" stroke={ring}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.19,1,0.22,1)' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-4xl font-bold font-display" style={{ color: ring }}>{grade}</div>
        <div className="text-sm font-semibold mt-0.5" style={{ color: ring }}>{label}</div>
        <div className="text-xs text-muted-foreground">{pct}%</div>
      </div>
    </div>
  );
});

// ── Dimension Bar ──────────────────────────────────────────────────────────────

const DimensionBar = memo(function DimensionBar({ dim, score }: { dim: Dimension; score: number }) {
  const meta = DIMENSION_META[dim];
  const Icon = meta.icon;
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className={cn('flex items-center gap-1.5 font-medium', meta.color)}>
          <Icon className="h-3.5 w-3.5" />
          <span>{meta.label}</span>
          <span className="text-xs text-muted-foreground font-normal">({Math.round(meta.weight * 100)}%)</span>
        </div>
        <span className="font-mono text-xs font-semibold" style={{ color }}>{score}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-muted/40 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
});

// ── Share Card ─────────────────────────────────────────────────────────────────

function buildShareUrl(grade: Grade, pct: number, persona: Persona): string {
  const token = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `${window.location.origin}/security-score?grade=${grade}&score=${pct}&persona=${persona}&ref=${token}`;
}

// ── Main Component ─────────────────────────────────────────────────────────────

const SecurityScore = memo(function SecurityScore() {
  const isDisabled = useConvexDisabled();
  const { user } = useAuth();
  const saveScore = useMutation(api.gamingTools.saveSecurityScore);

  const sessionIdRef = useRef<string>((() => {
    const key = 'gnx_security_score_session';
    let id = sessionStorage.getItem(key);
    if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(key, id); }
    return id;
  })());

  const [phase, setPhase] = useState<Phase>('intro');
  const [persona, setPersona] = useState<Persona>('gamer');
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [shareUrl, setShareUrl] = useState('');

  const totalQ = QUESTIONS.length;
  const q = QUESTIONS[currentQ];

  const handleAnswer = useCallback((value: Answer) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQ < totalQ - 1) {
      setCurrentQ((i) => i + 1);
    } else {
      setPhase('results');
    }
  }, [currentQ, q, totalQ]);

  const handleReset = useCallback(() => {
    const newId = crypto.randomUUID();
    sessionStorage.setItem('gnx_security_score_session', newId);
    sessionIdRef.current = newId;
    setAnswers({});
    setCurrentQ(0);
    setPhase('intro');
    setShareUrl('');
  }, []);

  // Computed results
  const results = useMemo(() => {
    let rawScore = 0;
    const dimRaw: Record<Dimension, number> = { account_hardening: 0, breach_exposure: 0, device_network: 0, platform_permissions: 0, behaviour: 0 };

    QUESTIONS.forEach((question) => {
      const a = answers[question.id];
      const pts = a === 'yes' ? question.yesPoints : a === 'partial' ? question.partialPoints : 0;
      rawScore += pts;
      dimRaw[question.dimension] += pts;
    });

    const pct = Math.round((rawScore / MAX_SCORE) * 100);
    const gradeInfo = getGrade(pct);

    const dimScores: Record<Dimension, number> = {} as Record<Dimension, number>;
    (Object.keys(dimRaw) as Dimension[]).forEach((d) => {
      dimScores[d] = DIMENSION_MAX[d] > 0 ? Math.round((dimRaw[d] / DIMENSION_MAX[d]) * 100) : 0;
    });

    const weakAreas = QUESTIONS.filter((question) => answers[question.id] === 'no' || answers[question.id] === 'partial')
      .sort((a, b) => b.yesPoints - a.yesPoints);

    return { rawScore, pct, gradeInfo, dimScores, weakAreas };
  }, [answers]);

  // Persist to Convex on completion
  useEffect(() => {
    if (phase !== 'results' || isDisabled) return;
    const { gradeInfo, pct, rawScore } = results;
    const bandMap: Record<Grade, 'excellent' | 'good' | 'fair' | 'needs_work'> = { A: 'excellent', B: 'good', C: 'fair', D: 'needs_work', F: 'needs_work' };
    saveScore({
      sessionId: sessionIdRef.current,
      userId: user?.id,
      answers: QUESTIONS.map((question) => ({
        questionId: question.id,
        answer: (answers[question.id] ?? 'no') as 'yes' | 'partial' | 'no',
      })),
      totalScore: rawScore,
      maxScore: MAX_SCORE,
      percentScore: pct,
      band: bandMap[gradeInfo.grade],
      weakAreaCount: results.weakAreas.length,
    }).catch(() => {});
    setShareUrl(buildShareUrl(gradeInfo.grade, pct, persona));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleShare = useCallback(() => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({ title: 'Score card link copied!', description: 'Share your security grade with your friends.' });
    });
  }, [shareUrl]);

  return (
    <Layout>
      <SEOHead
        title="Security Score — Your Personal Security GPA | The Grid Nexus"
        description="Free 10-question security assessment. Get an A–F letter grade, 5-dimension breakdown, and personalised fix list. Built for gamers, streamers & creators."
        keywords={['gaming security score', 'security assessment', 'gamer security GPA', 'account security grade', 'gaming privacy check']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/tools" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Security Tools
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Security Score</span>
        </div>

        {/* ── INTRO ─────────────────────────────────────────────────────── */}
        {phase === 'intro' && (
          <div className="text-center">
            <div className="inline-flex p-5 rounded-2xl bg-security/10 border border-security/20 mb-6">
              <Shield className="h-14 w-14 text-security" />
            </div>
            <h1 className="font-display font-bold text-4xl mb-3">Security Score</h1>
            <p className="text-base font-medium text-muted-foreground mb-2">
              Your personal security GPA — built for gamers, streamers & small creators.
            </p>
            <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
              10 questions across 5 security dimensions. Get an A–F letter grade, a detailed breakdown, and a prioritised fix list in under 2 minutes.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 text-sm">
              {[
                { icon: Zap,      label: '~2 minutes',       sub: 'No sign-up' },
                { icon: Star,     label: 'A–F Grade',        sub: '5 dimensions' },
                { icon: Shield,   label: 'Fix Checklist',    sub: 'Prioritised actions' },
                { icon: Share2,   label: 'Shareable Card',   sub: 'Show your grade' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="rounded-xl border p-3 text-center">
                  <Icon className="h-5 w-5 mx-auto mb-1 text-security" />
                  <p className="font-semibold text-xs">{label}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            <Button size="lg" onClick={() => setPhase('persona')} className="gap-2 bg-security hover:bg-security/90">
              Start Assessment <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ── PERSONA ───────────────────────────────────────────────────── */}
        {phase === 'persona' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-2xl mb-2">Who are you?</h2>
              <p className="text-sm text-muted-foreground">We'll tailor the scoring rubric to your digital life.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {PERSONAS.map(({ id, label, sub, icon: Icon, color, bg }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPersona(id)}
                  className={cn(
                    'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                    bg,
                    persona === id ? 'ring-2 ring-offset-2 ring-offset-background' : '',
                    persona === id ? color.replace('text-', 'ring-') : ''
                  )}
                >
                  <div className={cn('p-2 rounded-lg bg-background/60', color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className={cn('font-semibold text-sm', color)}>{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                  {persona === id && <CheckCircle className={cn('h-4 w-4 ml-auto shrink-0', color)} />}
                </button>
              ))}
            </div>
            <Button
              size="lg"
              onClick={() => setPhase('quiz')}
              className="w-full gap-2 bg-security hover:bg-security/90"
            >
              Continue as {PERSONAS.find(p => p.id === persona)?.label} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ── QUIZ ──────────────────────────────────────────────────────── */}
        {phase === 'quiz' && (
          <div>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentQ + 1} of {totalQ}</span>
                <Badge variant="outline" className={cn(DIMENSION_META[q.dimension].color)}>
                  {DIMENSION_META[q.dimension].label}
                </Badge>
              </div>
              <Progress value={(currentQ / totalQ) * 100} className="h-2" />
            </div>

            {/* Question */}
            <Card className="mb-6 border-security/20">
              <CardHeader>
                <CardTitle className="text-xl leading-snug">{q.text}</CardTitle>
              </CardHeader>
            </Card>

            {/* Answers */}
            <div className="flex flex-col gap-3">
              {([
                { value: 'yes'     as Answer, label: 'Yes — always',                        cls: 'border-green-500 hover:bg-green-500/10 text-green-400' },
                { value: 'partial' as Answer, label: 'Partially — some accounts/sometimes', cls: 'border-yellow-500 hover:bg-yellow-500/10 text-yellow-400' },
                { value: 'no'      as Answer, label: 'No — not yet',                        cls: 'border-red-500 hover:bg-red-500/10 text-red-400' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAnswer(opt.value)}
                  className={cn(
                    'w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium text-sm',
                    opt.cls
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="mt-6 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto transition-colors"
            >
              <RotateCcw className="h-3 w-3" /> Start over
            </button>
          </div>
        )}

        {/* ── RESULTS ───────────────────────────────────────────────────── */}
        {phase === 'results' && (
          <div>
            {/* Grade hero */}
            <div className="text-center mb-8">
              <ScoreRing pct={results.pct} ring={results.gradeInfo.ring} grade={results.gradeInfo.grade} label={results.gradeInfo.label} />
              <p className="text-sm text-muted-foreground mt-3">
                Raw score: {results.rawScore} / {MAX_SCORE} points ·{' '}
                <span className="capitalize">{PERSONAS.find(p => p.id === persona)?.label}</span> profile
              </p>
            </div>

            {/* Summary counters */}
            <div className="grid grid-cols-3 gap-3 mb-8 text-center text-sm">
              {([
                { val: 'yes', label: 'Secure', color: 'text-green-400' },
                { val: 'partial', label: 'Partial', color: 'text-yellow-400' },
                { val: 'no', label: 'At Risk', color: 'text-red-400' },
              ] as const).map(({ val, label, color }) => (
                <div key={val} className="rounded-xl border p-3">
                  <p className={cn('font-bold text-2xl', color)}>
                    {Object.values(answers).filter((a) => a === val).length}
                  </p>
                  <p className="text-muted-foreground text-xs">{label}</p>
                </div>
              ))}
            </div>

            {/* 5-Dimension breakdown */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-security" /> Security Dimensions
                </CardTitle>
                <CardDescription>How you scored across each area</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(Object.keys(DIMENSION_META) as Dimension[]).map((dim) => (
                  <DimensionBar key={dim} dim={dim} score={results.dimScores[dim]} />
                ))}
              </CardContent>
            </Card>

            {/* Priority fixes */}
            {results.weakAreas.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  Priority Fixes ({results.weakAreas.length})
                </h3>
                <div className="space-y-3">
                  {results.weakAreas.map((wq) => {
                    const dimMeta = DIMENSION_META[wq.dimension];
                    const DimIcon = dimMeta.icon;
                    return (
                      <Card key={wq.id} className="border-yellow-500/20">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-start gap-3">
                            <DimIcon className={cn('h-4 w-4 shrink-0 mt-0.5', dimMeta.color)} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm mb-1">{wq.text}</p>
                              <p className="text-xs text-muted-foreground leading-relaxed">{wq.recommendation}</p>
                              {wq.linkedTool && (
                                <Link
                                  to={wq.linkedTool}
                                  className="inline-flex items-center gap-1 text-xs text-security hover:underline mt-2"
                                >
                                  Check with tool <ChevronRight className="h-3 w-3" />
                                </Link>
                              )}
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {answers[wq.id] === 'partial' ? 'Partial' : 'Missing'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {results.weakAreas.length === 0 && (
              <div className="flex items-center gap-3 p-5 rounded-xl bg-green-500/10 border border-green-500/30 mb-8">
                <CheckCircle className="h-6 w-6 text-green-400 shrink-0" />
                <p className="text-sm font-medium">Outstanding — you answered yes to everything. Your security posture is excellent.</p>
              </div>
            )}

            {/* Share card */}
            <Card className={cn('mb-8 border-2', results.gradeInfo.border)}>
              <CardContent className="pt-5">
                <div className="flex items-center gap-4">
                  <div className={cn('h-16 w-16 rounded-xl flex items-center justify-center shrink-0', results.gradeInfo.bg)}>
                    <span className={cn('font-display font-bold text-4xl', results.gradeInfo.color)}>{results.gradeInfo.grade}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('font-bold text-lg', results.gradeInfo.color)}>Security Grade: {results.gradeInfo.grade} — {results.gradeInfo.label}</p>
                    <p className="text-xs text-muted-foreground">Scored {results.pct}% on The Grid Nexus Security Assessment</p>
                  </div>
                </div>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 gap-2"
                >
                  <Share2 className="h-4 w-4" /> Copy Share Link
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button onClick={handleReset} variant="outline" className="flex-1 gap-2">
                <RotateCcw className="h-4 w-4" /> Retake Assessment
              </Button>
              <Button asChild className="flex-1 bg-security hover:bg-security/90">
                <Link to="/tools">Explore All Tools</Link>
              </Button>
            </div>

            {/* Related tools */}
            <SecurityToolsStrip className="mt-2" heading="Improve your score with these tools" />
          </div>
        )}
      </div>
    </Layout>
  );
});

export default SecurityScore;
