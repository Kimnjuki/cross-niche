import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Download,
  Share2,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Lock,
  Smartphone,
  Eye,
  Key,
  Bell,
  Users,
  Globe,
  Gamepad2,
  Activity,
  Zap,
  BrainCircuit,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ToolPageSEO } from '@/components/tools/ToolPageSEO';

// ASVS V1.1-A03: Authentication Controls
// ASVS V1.1-A04: Session Management
// Design per T04: Ship honest anonymous security checkups

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

// ── Checklist definition ────────────────────────────────────────────────────

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

function getBand(pct: number): {
  key: 'excellent' | 'good' | 'fair' | 'needs_work';
  label: string;
  color: string;
  bg: string;
  desc: string;
} {
  if (pct >= 85) return {
    key: 'excellent',
    label: 'Excellent',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-500',
    desc: 'Your Steam account has strong protections in place. Review any remaining gaps to reach 100%.',
  };
  if (pct >= 65) return {
    key: 'good',
    label: 'Good',
    color: 'text-gaming',
    bg: 'bg-gaming',
    desc: 'Good protection baseline. A few more steps would strengthen your account further.',
  };
  if (pct >= 40) return {
    key: 'fair',
    label: 'Fair',
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-500',
    desc: 'Some protections active, but several important gaps remain. Consider addressing them.',
  };
  return {
    key: 'needs_work',
    label: 'Needs Work',
    color: 'text-destructive',
    bg: 'bg-destructive',
    desc: 'Minimal protections detected. Priority: enable Steam Guard, unique password, and review login history.',
  };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function SteamScanner() {
  const { isAuthenticated, anonymousId } = useAuth();

  // Session storage for anonymous assessment - no user identifiers sent to server
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
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [answered, setAnswered] = useState(0);
  const [totalChecks, setTotalChecks] = useState(CHECK_ITEMS.length);

  const score = CHECK_ITEMS.reduce((sum, item) => {
    return answers[item.id] === 'yes' ? sum + item.weight : sum;
  }, 0);

  const pct = Math.round((score / MAX_SCORE) * 100);
  const band = getBand(pct);

  const failedItems = CHECK_ITEMS.filter(item => answers[item.id] !== 'yes');
  const criticalFails = failedItems.filter(item => item.weight >= 12);
  const passedItems = CHECK_ITEMS.filter(item => answers[item.id] === 'yes');

  // Track answered count
  useEffect(() => {
    setAnswered(Object.keys(answers).length);
  }, [answers]);

  const handleAnswer = useCallback((id: string, answer: Answer) => {
    setAnswers(prev => ({ ...prev, [id]: answer }));
  }, []);

  const handleStart = useCallback(() => {
    setPhase('checklist');
  }, []);

  const handleFinish = useCallback(() => {
    setPhase('results');
  }, []);

  // Current index tracker
  const currentIndexRef = useRef(0);
  useEffect(() => {
    // Find the first unanswered item
    let idx = 0;
    for (let i = 0; i < CHECK_ITEMS.length; i++) {
      if (answers[CHECK_ITEMS[i].id] !== undefined) {
        idx = i;
        break;
      }
    }
    currentIndexRef.current = idx;
  }, [answers]);

  const currentIndex = currentIndexRef.current;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Layout>
      <ToolPageSEO
        title="Steam Security Self-Assessment | The Grid Nexus"
        description="Anonymous self-assessment of your Steam account security posture. Check login locations, API key leaks, unauthorized trade offers, and friend request anomalies. Results are self-reported and not a Steam API scan."
        slug="/tools/steam-scanner"
        appCategory="SecurityApplication"
      />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/tools" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Security Tools
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Steam Self-Assessment</span>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gaming/10 border border-gaming/20 mb-4">
            <Gamepad2 className="h-8 w-8 text-gaming" />
          </div>
          <h1 className="font-display font-bold text-4xl mb-2">Steam Security Self-Assessment</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            10 checks, 2 minutes. Self-reported results — we don't query Steam or store your username. Providing it is optional.
          </p>
        </div>

        {/* ── PHASE: INPUT ── */}
        {phase === 'input' && (
          <Card className="border-gaming/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gaming" />
                Start your Steam security self-assessment
              </CardTitle>
              <CardDescription>
                10 checks, 2 minutes. Self-reported results — we don't query Steam or store any identifiers.
                Your answers stay in your browser session only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
              >
                Start Self-Assessment
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── PHASE: CHECKLIST ── */}
        {phase === 'checklist' && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Check {answered} of {totalChecks}</span>
                <span className={cn('font-semibold', CATEGORY_COLORS['authentication'])}>
                  Authentication
                </span>
              </div>
              <Progress value={(answered / totalChecks) * 100} className="h-2" />
            </div>

            {/* Current check card */}
            {CHECK_ITEMS[currentIndex] && (
              <Card className="border-gaming/20">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gaming/10 shrink-0 mt-0.5">
                      <CheckCircle className="h-5 w-5 text-gaming" />
                    </div>
                    <div>
                      <CardTitle className="text-xl leading-snug">
                        {CHECK_ITEMS[currentIndex].question}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {CHECK_ITEMS[currentIndex].detail}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium text-foreground mb-1">How to check:</p>
                  <p className="text-muted-foreground">
                    {CHECK_ITEMS[currentIndex].howToCheck}
                  </p>
                  {CHECK_ITEMS[currentIndex].link && (
                    <a
                      href={CHECK_ITEMS[currentIndex].link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-gaming hover:underline"
                    >
                      Open in Steam <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      className="border-green-500/40 text-green-600 hover:bg-green-500/10 hover:border-green-500"
                      onClick={() => handleAnswer(CHECK_ITEMS[currentIndex].id, 'yes')}
                    >
                      <CheckCircle className="mr-1.5 h-4 w-4" />
                      Yes
                    </Button>
                    <Button
                      variant="outline"
                      className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
                      onClick={() => handleAnswer(CHECK_ITEMS[currentIndex].id, 'no')}
                    >
                      <XCircle className="mr-1.5 h-4 w-4" />
                      No
                    </Button>
                    <Button
                      variant="outline"
                      className="text-muted-foreground"
                      onClick={() => handleAnswer(CHECK_ITEMS[currentIndex].id, 'unknown')}
                    >
                      Not sure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
                View My Self-Assessment Score
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
                    {band.label} protection readiness — self-reported
                  </Badge>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    This is a self-assessment based on your answers. We do not query Steam or
                    access your account settings. Results are stored locally in your browser.
                  </p>
                </div>
                <Progress value={pct} className={cn('h-3 mx-auto max-w-xs', '[&>div]:' + band.bg)} />
                <p className="text-sm text-muted-foreground">
                  Score: {score} / {MAX_SCORE} pts • {failedItems.length} gaps found
                </p>
              </CardContent>
            </Card>

            {/* Action plan */}
            <Card className="border-gaming/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Priority Action Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {criticalFails.length > 0 && (
                  <div>
                    <p className="font-medium text-destructive mb-2">Critical gaps identified:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {criticalFails.map(item => (
                        <li key={item.id}>
                          {item.question}: {item.howToCheck}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {passedItems.length > 0 && (
                  <div>
                    <p className="font-medium text-security mb-2">You have secured:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {passedItems.map(item => (
                        <li key={item.id}>
                          {item.question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {failedItems.length > 0 && failedItems.some(item => item.weight < 12) && (
                  <div>
                    <p className="font-medium text-warning mb-2">Areas to improve:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {failedItems.filter(item => item.weight < 12).map(item => (
                        <li key={item.id}>
                          {item.question}: {item.howToCheck}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <p className="font-medium text-primary mb-2">Recommended next steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>
                      Secure your email account with a strong, unique password and enable MFA
                    </li>
                    <li>
                      Review and revoke any unfamiliar API keys at Steam Community
                    </li>
                    <li>
                      Review recent login history and remove unfamiliar sessions
                    </li>
                    <li>
                      Consider enabling Steam Guard Mobile Authenticator for trade confirmation
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Export results */}
            <Card className="border-gaming/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-gaming" /> Export
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Your results are stored locally in your browser session. You can:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Take a screenshot of this results screen</li>
                  <li>Use the reset button to clear results and start a new assessment</li>
                  <li>Delete browser storage to remove saved results</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Important:</strong> No answers or identifiers are sent to any server
                  in anonymous mode. This is a self-assessment only — not a scan, not a guarantee,
                  and not a substitute for official Steam support.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
