import React, { useState, useCallback, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw,
  ExternalLink,
  Lock,
  Smartphone,
  Eye,
  Key,
  Bell,
  Users,
  Globe,
  Gamepad2,
  ArrowLeft,
  Activity,
  Zap,
} from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { useAuth } from '@/contexts/AuthContext';

// ── Types ────────────────────────────────────────────────────────────────────

type Answer = 'yes' | 'no' | 'unknown';
type Phase = 'input' | 'checklist' | 'results';

interface CheckItem {
  id: string;
  category: 'authentication' | 'privacy' | 'trading' | 'account' | 'activity';
  question: string;
  detail: string;
  howToCheck: string;
  link?: string;
  weight: number; // points if yes
  icon: React.ComponentType<{ className?: string }>;
}

// ── Checklist definition ─────────────────────────────────────────────────────

const CHECK_ITEMS: CheckItem[] = [
  {
    id: 'steam_guard_mobile',
    category: 'authentication',
    question: 'Steam Guard Mobile Authenticator is enabled',
    detail: 'Protects your account with time-based codes and secures trades with confirmation.',
    howToCheck: 'Steam App → Menu → Steam Guard → "Steam Guard Mobile Authenticator is enabled"',
    link: 'https://store.steampowered.com/mobile',
    weight: 25,
    icon: Smartphone,
  },
  {
    id: 'email_guard',
    category: 'authentication',
    question: 'Email-based Steam Guard is active (at minimum)',
    detail: 'Even without the mobile app, email login codes block most account takeovers.',
    howToCheck: 'Steam → Settings → Account → "Steam Guard: Enabled with email"',
    weight: 10,
    icon: Lock,
  },
  {
    id: 'profile_private',
    category: 'privacy',
    question: 'Game library and playtime is set to Private or Friends Only',
    detail: 'Public playtime can reveal what games you own, helping attackers craft targeted phishing.',
    howToCheck: 'Steam → username → Edit Profile → Privacy Settings → "Game details"',
    weight: 8,
    icon: Eye,
  },
  {
    id: 'real_name_hidden',
    category: 'privacy',
    question: 'Real name is hidden from public profile',
    detail: 'Your real name on a public Steam profile enables social engineering attacks.',
    howToCheck: 'Steam → username → Edit Profile → General → Real Name field (leave blank)',
    weight: 7,
    icon: Users,
  },
  {
    id: 'location_hidden',
    category: 'privacy',
    question: 'Location is hidden from public profile',
    detail: 'Visible location is used in targeted phishing and can expose you to regional scams.',
    howToCheck: 'Steam → username → Edit Profile → General → Location (leave blank)',
    weight: 5,
    icon: Globe,
  },
  {
    id: 'trade_confirmations',
    category: 'trading',
    question: 'Trade confirmations require Mobile Authenticator approval',
    detail: 'Without this, stolen session cookies can drain your inventory silently.',
    howToCheck: 'Steam App → Menu → Steam Guard → "Confirm trades via Steam mobile app"',
    weight: 15,
    icon: Shield,
  },
  {
    id: 'api_key_clean',
    category: 'account',
    question: 'You have reviewed (or have no) Steam Web API key',
    detail: 'Compromised accounts often have rogue API keys created to intercept trade offers.',
    howToCheck: 'https://steamcommunity.com/dev/apikey — if you see an unknown key, revoke it immediately',
    link: 'https://steamcommunity.com/dev/apikey',
    weight: 12,
    icon: Key,
  },
  {
    id: 'login_history',
    category: 'activity',
    question: 'Recent login history shows no unfamiliar locations',
    detail: 'Unfamiliar logins signal active compromise. Check before changing passwords.',
    howToCheck: 'Steam → Settings → Account → "View Recent Login History"',
    weight: 8,
    icon: Bell,
  },
  {
    id: 'linked_phone',
    category: 'account',
    question: 'Phone number is linked to your account',
    detail: 'Enables account recovery even if email is compromised.',
    howToCheck: 'Steam → Settings → Account → "Add Phone Number"',
    weight: 5,
    icon: Smartphone,
  },
  {
    id: 'no_shared_password',
    category: 'authentication',
    question: 'Your Steam password is unique (not reused on other sites)',
    detail: 'Credential stuffing attacks use leaked passwords from other breaches to access Steam.',
    howToCheck: 'Use a password manager — if you used the same password elsewhere, change it now.',
    link: 'https://haveibeenpwned.com/',
    weight: 15,
    icon: Lock,
  },
];

const MAX_SCORE = CHECK_ITEMS.reduce((sum, c) => sum + c.weight, 0);

const CATEGORY_LABELS: Record<CheckItem['category'], string> = {
  authentication: 'Authentication',
  privacy: 'Privacy',
  trading: 'Trading Safety',
  account: 'Account Hygiene',
  activity: 'Activity Monitoring',
};

const CATEGORY_COLORS: Record<CheckItem['category'], string> = {
  authentication: 'text-security',
  privacy: 'text-tech',
  trading: 'text-gaming',
  account: 'text-yellow-500',
  activity: 'text-blue-500',
};

// ── Score band helpers ───────────────────────────────────────────────────────

function getBand(pct: number): { label: string; color: string; bg: string; desc: string } {
  if (pct >= 85) return { label: 'Excellent', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500', desc: 'Your Steam account is well-secured. Review weak areas to reach 100%.' };
  if (pct >= 65) return { label: 'Good', color: 'text-gaming', bg: 'bg-gaming', desc: 'Solid foundation, but a few gaps could put your account at risk.' };
  if (pct >= 40) return { label: 'Fair', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500', desc: 'Several security gaps. Attackers can exploit these — fix them today.' };
  return { label: 'At Risk', color: 'text-destructive', bg: 'bg-destructive', desc: 'High risk of account takeover. Address critical items immediately.' };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SteamScanner() {
  const isDisabled = useConvexDisabled();
  const { user } = useAuth();
  const saveScore = useMutation(api.gamingTools.saveSecurityScore);
  const sessionIdRef = useRef(
    (() => {
      const stored = sessionStorage.getItem('gnx_steam_scan_session');
      if (stored) return stored;
      const id = crypto.randomUUID();
      sessionStorage.setItem('gnx_steam_scan_session', id);
      return id;
    })()
  );

  const [phase, setPhase] = useState<Phase>('input');
  const [steamHandle, setSteamHandle] = useState('');
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const answered = Object.keys(answers).length;
  const totalChecks = CHECK_ITEMS.length;

  const score = CHECK_ITEMS.reduce((sum, item) => {
    return answers[item.id] === 'yes' ? sum + item.weight : sum;
  }, 0);

  const pct = Math.round((score / MAX_SCORE) * 100);
  const band = getBand(pct);

  const failedItems = CHECK_ITEMS.filter(item => answers[item.id] !== 'yes');
  const criticalFails = failedItems.filter(item => item.weight >= 12);

  const handleAnswer = useCallback((id: string, answer: Answer) => {
    setAnswers(prev => ({ ...prev, [id]: answer }));
    setCurrentIndex(prev => Math.min(prev + 1, totalChecks - 1));
  }, [totalChecks]);

  const handleStart = useCallback(() => {
    if (!steamHandle.trim()) return;
    setPhase('checklist');
    setCurrentIndex(0);
  }, [steamHandle]);

  const handleFinish = useCallback(() => {
    setPhase('results');

    if (isDisabled) return;
    const answersArr = CHECK_ITEMS.map(item => ({
      questionId: CHECK_ITEMS.indexOf(item),
      answer: answers[item.id] === 'yes' ? 'yes' as const : answers[item.id] === 'no' ? 'no' as const : 'no' as const,
    }));

    saveScore({
      sessionId: sessionIdRef.current,
      userId: user?.id,
      answers: answersArr,
      totalScore: score,
      maxScore: MAX_SCORE,
      percentScore: pct,
      band: band.label,
      weakAreaCount: failedItems.length,
    }).catch(() => {});
  }, [isDisabled, answers, score, pct, band.label, failedItems.length, saveScore, user?.id]);

  const handleReset = useCallback(() => {
    sessionIdRef.current = crypto.randomUUID();
    sessionStorage.setItem('gnx_steam_scan_session', sessionIdRef.current);
    setSteamHandle('');
    setAnswers({});
    setCurrentIndex(0);
    setPhase('input');
  }, []);

  const currentItem = CHECK_ITEMS[currentIndex];

  return (
    <Layout>
      <SEO
        title="Steam Security Scanner | The Grid Nexus"
        description="Check your Steam account security in 2 minutes. Assess Steam Guard, privacy settings, trading safety, and API key exposure with our free scanner."
        canonical="https://thegridnexus.com/tools/steam-scanner"
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
          <span className="text-foreground font-medium">Steam Scanner</span>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gaming/10 border border-gaming/20 mb-4">
            <Gamepad2 className="h-8 w-8 text-gaming" />
          </div>
          <h1 className="font-display font-bold text-4xl mb-2">Steam Security Scanner</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            10 checks, 2 minutes. See exactly how exposed your Steam account is and how to fix it — free.
          </p>
        </div>

        {/* ── PHASE: INPUT ── */}
        {phase === 'input' && (
          <Card className="border-gaming/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gaming" />
                Enter your Steam username
              </CardTitle>
              <CardDescription>
                Your username is only used to personalise the results — we don't query Steam or store it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Input
                  placeholder="e.g. GamerTag123"
                  value={steamHandle}
                  onChange={e => setSteamHandle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleStart()}
                  className="text-base"
                />
              </div>

              <div className="rounded-lg border bg-muted/40 p-4 space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">What we check:</p>
                {Object.keys(CATEGORY_LABELS).map(cat => (
                  <div key={cat} className="flex items-center gap-2">
                    <span className={cn('text-xs font-semibold', CATEGORY_COLORS[cat as CheckItem['category']])}>
                      {CATEGORY_LABELS[cat as CheckItem['category']]}
                    </span>
                    <span>
                      {CHECK_ITEMS.filter(c => c.category === cat as CheckItem['category']).length} checks
                    </span>
                  </div>
                ))}
              </div>

              <Button
                className="w-full bg-gaming hover:bg-gaming/90 text-white"
                onClick={handleStart}
                disabled={!steamHandle.trim()}
              >
                Start Security Scan
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── PHASE: CHECKLIST ── */}
        {phase === 'checklist' && currentItem && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Check {Math.min(answered + 1, totalChecks)} of {totalChecks}</span>
                <span className={cn('font-semibold', CATEGORY_COLORS[currentItem.category])}>
                  {CATEGORY_LABELS[currentItem.category]}
                </span>
              </div>
              <Progress value={(answered / totalChecks) * 100} className="h-2" />
            </div>

            {/* Current check card */}
            <Card className="border-gaming/20">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gaming/10 shrink-0 mt-0.5">
                    <currentItem.icon className="h-5 w-5 text-gaming" />
                  </div>
                  <div>
                    <CardTitle className="text-xl leading-snug">{currentItem.question}</CardTitle>
                    <CardDescription className="mt-1">{currentItem.detail}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                  <p className="font-medium text-foreground mb-1">How to check:</p>
                  <p className="text-muted-foreground">{currentItem.howToCheck}</p>
                  {currentItem.link && (
                    <a
                      href={currentItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-gaming hover:underline"
                    >
                      Open in Steam <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="border-green-500/40 text-green-600 hover:bg-green-500/10 hover:border-green-500"
                    onClick={() => handleAnswer(currentItem.id, 'yes')}
                  >
                    <CheckCircle className="mr-1.5 h-4 w-4" />
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
                    onClick={() => handleAnswer(currentItem.id, 'no')}
                  >
                    <XCircle className="mr-1.5 h-4 w-4" />
                    No
                  </Button>
                  <Button
                    variant="outline"
                    className="text-muted-foreground"
                    onClick={() => handleAnswer(currentItem.id, 'unknown')}
                  >
                    Not sure
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Answered so far (mini pills) */}
            {answered > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {CHECK_ITEMS.slice(0, answered).map(item => (
                  <span
                    key={item.id}
                    className={cn(
                      'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border',
                      answers[item.id] === 'yes'
                        ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
                        : 'bg-destructive/10 border-destructive/30 text-destructive'
                    )}
                  >
                    {answers[item.id] === 'yes' ? <CheckCircle className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                    {item.id.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Finish button when all answered */}
            {answered >= totalChecks && (
              <Button
                className="w-full bg-gaming hover:bg-gaming/90 text-white"
                onClick={handleFinish}
              >
                View My Security Score
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* ── PHASE: RESULTS ── */}
        {phase === 'results' && (
          <div className="space-y-6">
            {/* Score card */}
            <Card className="border-gaming/20">
              <CardContent className="pt-8 pb-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-gaming/20 bg-gaming/5">
                  <span className={cn('text-3xl font-bold font-display', band.color)}>{pct}%</span>
                </div>
                <div>
                  <Badge className={cn('text-sm px-4 py-1 mb-2', band.color, 'bg-transparent border-current')}>
                    {band.label} — {steamHandle}
                  </Badge>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">{band.desc}</p>
                </div>
                <Progress value={pct} className={cn('h-3 mx-auto max-w-xs', '[&>div]:' + band.bg)} />
                <p className="text-sm text-muted-foreground">
                  Score: {score} / {MAX_SCORE} pts • {failedItems.length} gaps found
                </p>
              </CardContent>
            </Card>

            {/* Critical items first */}
            {criticalFails.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-display font-bold text-lg flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Fix These First ({criticalFails.length})
                </h2>
                {criticalFails.map(item => (
                  <Card key={item.id} className="border-destructive/20 bg-destructive/5">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-3">
                        <item.icon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.question}</p>
                          <p className="text-xs text-muted-foreground">{item.detail}</p>
                          <p className="text-xs text-muted-foreground font-medium mt-1">
                            Fix: {item.howToCheck}
                          </p>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-gaming hover:underline"
                            >
                              Open <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <Badge variant="destructive" className="shrink-0 text-xs">−{item.weight}pts</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Other gaps */}
            {failedItems.filter(i => i.weight < 12).length > 0 && (
              <div className="space-y-2">
                <h2 className="font-display font-semibold text-base text-muted-foreground">
                  Other Improvements ({failedItems.filter(i => i.weight < 12).length})
                </h2>
                {failedItems.filter(i => i.weight < 12).map(item => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                    <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.question}</p>
                      <p className="text-xs text-muted-foreground">{item.howToCheck}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">+{item.weight}pts</span>
                  </div>
                ))}
              </div>
            )}

            {/* Passed items */}
            {answered > failedItems.length && (
              <div className="space-y-2">
                <h2 className="font-display font-semibold text-base text-green-600 dark:text-green-400 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  Passing ({answered - failedItems.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {CHECK_ITEMS.filter(item => answers[item.id] === 'yes').map(item => (
                    <span key={item.id} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      {item.question.split(' ').slice(0, 4).join(' ')}…
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related tools */}
            <div className="rounded-xl border bg-muted/30 p-4">
              <p className="text-sm font-semibold mb-3">More Security Tools</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { href: '/tools/nexusguard',     icon: Shield,    label: 'NexusGuard',    sub: 'Threat assessment',   color: 'text-security hover:bg-security/10 border-security/20' },
                  { href: '/security-score',        icon: Zap,       label: 'Security Score', sub: 'Personal assessment', color: 'text-yellow-500 hover:bg-yellow-500/10 border-yellow-500/20' },
                  { href: '/live-threat-dashboard', icon: Activity,  label: 'Live Threats',  sub: 'Real-time feed',      color: 'text-destructive hover:bg-destructive/10 border-destructive/20' },
                ].map((t) => (
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
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleReset}
              >
                <RotateCcw className="mr-1.5 h-4 w-4" />
                Scan Another Account
              </Button>
              <Button
                className="flex-1 bg-gaming hover:bg-gaming/90 text-white"
                asChild
              >
                <a href="/security-score">
                  Full Security Assessment
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
