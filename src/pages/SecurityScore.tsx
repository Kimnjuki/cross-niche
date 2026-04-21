import { useState, useEffect, useRef, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Shield, CheckCircle, AlertTriangle, RotateCcw, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

type Answer = 'yes' | 'partial' | 'no' | null;

interface Question {
  id: number;
  text: string;
  category: string;
  yesPoints: number;
  partialPoints: number;
  recommendation: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: 'Do you have two-factor authentication (2FA) enabled on all your gaming accounts?',
    category: 'Account Security',
    yesPoints: 12,
    partialPoints: 6,
    recommendation: 'Enable 2FA on every gaming platform — Steam, Xbox, PlayStation, Epic, etc. Use an authenticator app over SMS.',
  },
  {
    id: 2,
    text: 'Do you use a unique password for each gaming platform (no reuse)?',
    category: 'Account Security',
    yesPoints: 12,
    partialPoints: 5,
    recommendation: 'Reused passwords are the #1 cause of account takeovers. Use a password manager to generate and store unique passwords.',
  },
  {
    id: 3,
    text: 'Do you use a password manager to store your gaming credentials?',
    category: 'Account Security',
    yesPoints: 10,
    partialPoints: 4,
    recommendation: 'A password manager (Bitwarden, 1Password) is the easiest way to maintain strong, unique passwords across all platforms.',
  },
  {
    id: 4,
    text: 'Have you checked if your gaming email has appeared in a known data breach (e.g., HaveIBeenPwned)?',
    category: 'Breach Awareness',
    yesPoints: 8,
    partialPoints: 4,
    recommendation: 'Check haveibeenpwned.com for your email. If compromised, change passwords and enable 2FA on affected accounts immediately.',
  },
  {
    id: 5,
    text: 'Do you keep your gaming client (Steam, Battle.net, etc.) and games updated promptly?',
    category: 'Patch Hygiene',
    yesPoints: 10,
    partialPoints: 5,
    recommendation: 'Enable auto-updates for gaming clients. Patches often fix exploits actively used by cheaters and hackers.',
  },
  {
    id: 6,
    text: 'Do you use a VPN when gaming on public or shared Wi-Fi networks?',
    category: 'Network Security',
    yesPoints: 8,
    partialPoints: 4,
    recommendation: 'Public Wi-Fi exposes you to MITM attacks and DDoS. Use a VPN (Mullvad, ProtonVPN) on any network you don\'t control.',
  },
  {
    id: 7,
    text: 'Do you use a separate email address for gaming accounts (not your primary email)?',
    category: 'Privacy',
    yesPoints: 8,
    partialPoints: 3,
    recommendation: 'A dedicated gaming email limits blast radius if your account is targeted. It also reduces spam and phishing in your main inbox.',
  },
  {
    id: 8,
    text: 'Do you have account recovery codes or backup methods saved securely?',
    category: 'Account Security',
    yesPoints: 10,
    partialPoints: 4,
    recommendation: 'Print or securely store recovery codes for your 2FA apps. Losing phone access without backups can permanently lock you out.',
  },
  {
    id: 9,
    text: 'Do you review app permissions before installing mobile games?',
    category: 'Privacy',
    yesPoints: 8,
    partialPoints: 3,
    recommendation: 'Many mobile games over-request permissions (contacts, location, camera). Deny anything unrelated to gameplay.',
  },
  {
    id: 10,
    text: 'Do you regularly review privacy settings on your gaming platforms (friend visibility, data sharing)?',
    category: 'Privacy',
    yesPoints: 8,
    partialPoints: 3,
    recommendation: 'Review platform privacy settings every 3–6 months — platforms often reset or add new data-sharing defaults after updates.',
  },
];

const MAX_SCORE = questions.reduce((sum, q) => sum + q.yesPoints, 0);

function getScoreBand(score: number) {
  const pct = (score / MAX_SCORE) * 100;
  if (pct >= 90) return { label: 'Excellent', color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500' };
  if (pct >= 70) return { label: 'Good', color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500' };
  if (pct >= 50) return { label: 'Fair', color: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-500' };
  return { label: 'Needs Work', color: 'text-destructive', bg: 'bg-destructive', border: 'border-destructive' };
}

export default function SecurityScore() {
  const isDisabled = useConvexDisabled();
  const { user } = useAuth();
  const saveScore = useMutation(api.gamingTools.saveSecurityScore);

  const sessionIdRef = useRef<string>(
    (() => {
      const key = 'gnx_security_score_session';
      let id = sessionStorage.getItem(key);
      if (!id) { id = crypto.randomUUID(); sessionStorage.setItem(key, id); }
      return id;
    })()
  );

  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'results'>('intro');

  const answered = Object.keys(answers).length;
  const totalQ = questions.length;

  function answer(value: Answer) {
    const q = questions[currentQ];
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQ < totalQ - 1) {
      setCurrentQ((i) => i + 1);
    } else {
      setPhase('results');
    }
  }

  function reset() {
    // Generate a fresh session for retakes
    const newId = crypto.randomUUID();
    sessionStorage.setItem('gnx_security_score_session', newId);
    sessionIdRef.current = newId;
    setAnswers({});
    setCurrentQ(0);
    setPhase('intro');
  }

  const { score, scorePct, band, weakAreas } = useMemo(() => {
    const s = questions.reduce((sum, q) => {
      const a = answers[q.id];
      if (a === 'yes') return sum + q.yesPoints;
      if (a === 'partial') return sum + q.partialPoints;
      return sum;
    }, 0);
    return {
      score: s,
      scorePct: Math.round((s / MAX_SCORE) * 100),
      band: getScoreBand(s),
      weakAreas: questions.filter((q) => answers[q.id] === 'no' || answers[q.id] === 'partial'),
    };
  }, [answers]);

  // Persist results to Convex when quiz finishes
  useEffect(() => {
    if (phase !== 'results' || isDisabled) return;
    const bandKey = band.label.toLowerCase().replace(' ', '_') as
      'excellent' | 'good' | 'fair' | 'needs_work';
    saveScore({
      sessionId: sessionIdRef.current,
      userId: user?.id,
      answers: questions.map((q) => ({
        questionId: q.id,
        answer: (answers[q.id] ?? 'no') as 'yes' | 'partial' | 'no',
      })),
      totalScore: score,
      maxScore: MAX_SCORE,
      percentScore: scorePct,
      band: bandKey,
      weakAreaCount: weakAreas.length,
    }).catch(() => { /* non-critical — don't surface save errors to user */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const q = questions[currentQ];

  return (
    <Layout>
      <SEOHead
        title="Gaming Security Score — Check Your Security Posture | The Grid Nexus"
        description="Take a free 10-question self-assessment and get a personalised gaming security score with actionable recommendations."
        keywords={['gaming security score', 'security assessment', 'gamer security check', 'account security', 'gaming privacy']}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
      />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* ── INTRO ── */}
        {phase === 'intro' && (
          <div className="text-center">
            <div className="inline-flex p-4 rounded-2xl bg-security/10 mb-6">
              <Shield className="h-12 w-12 text-security" />
            </div>
            <h1 className="font-display font-bold text-4xl mb-4">Gaming Security Score</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              10 questions. 2 minutes. Get a personalised score and know exactly where your gaming security needs work.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-10 text-sm">
              {[
                { label: '10 Questions', sub: 'covering key risk areas' },
                { label: 'Instant Score', sub: 'out of 100' },
                { label: 'Fix List', sub: 'prioritised recommendations' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border p-4">
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-muted-foreground text-xs mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
            <Button size="lg" onClick={() => setPhase('quiz')} className="gap-2">
              Start Assessment <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ── QUIZ ── */}
        {phase === 'quiz' && (
          <div>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentQ + 1} of {totalQ}</span>
                <Badge variant="outline">{q.category}</Badge>
              </div>
              <Progress value={((currentQ) / totalQ) * 100} className="h-2" />
            </div>

            {/* Question card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl leading-snug">{q.text}</CardTitle>
              </CardHeader>
            </Card>

            {/* Answer buttons */}
            <div className="flex flex-col gap-3">
              {([
                { value: 'yes' as Answer, label: 'Yes — always', color: 'border-green-500 hover:bg-green-500/10' },
                { value: 'partial' as Answer, label: 'Partially — some accounts / sometimes', color: 'border-yellow-500 hover:bg-yellow-500/10' },
                { value: 'no' as Answer, label: 'No — not yet', color: 'border-destructive hover:bg-destructive/10' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => answer(opt.value)}
                  className={cn(
                    'w-full text-left px-5 py-4 rounded-xl border-2 transition-colors font-medium',
                    opt.color
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-6 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mx-auto"
            >
              <RotateCcw className="h-3 w-3" /> Start over
            </button>
          </div>
        )}

        {/* ── RESULTS ── */}
        {phase === 'results' && (
          <div>
            {/* Score hero */}
            <div className="text-center mb-10">
              <div className={cn('inline-flex items-center justify-center w-32 h-32 rounded-full border-4 mb-4', band.border)}>
                <div>
                  <p className={cn('font-display font-bold text-4xl', band.color)}>{scorePct}</p>
                  <p className="text-xs text-muted-foreground">/100</p>
                </div>
              </div>
              <h2 className={cn('font-display font-bold text-2xl mb-1', band.color)}>{band.label}</h2>
              <p className="text-muted-foreground text-sm">
                Raw score: {score} / {MAX_SCORE} points
              </p>
            </div>

            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-3 mb-10 text-center text-sm">
              {(['yes', 'partial', 'no'] as const).map((val) => {
                const count = Object.values(answers).filter((a) => a === val).length;
                const labels = { yes: 'Secure', partial: 'Partial', no: 'At Risk' };
                const colors = { yes: 'text-green-500', partial: 'text-yellow-500', no: 'text-destructive' };
                return (
                  <div key={val} className="rounded-xl border p-3">
                    <p className={cn('font-bold text-2xl', colors[val])}>{count}</p>
                    <p className="text-muted-foreground text-xs">{labels[val]}</p>
                  </div>
                );
              })}
            </div>

            {/* Recommendations */}
            {weakAreas.length > 0 && (
              <div className="mb-10">
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Priority fixes ({weakAreas.length})
                </h3>
                <div className="space-y-3">
                  {weakAreas.map((wq) => (
                    <Card key={wq.id} className="border-yellow-500/30">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm mb-1">{wq.text}</p>
                            <p className="text-xs text-muted-foreground">{wq.recommendation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {weakAreas.length === 0 && (
              <div className="flex items-center gap-3 p-5 rounded-xl bg-green-500/10 border border-green-500/30 mb-10">
                <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                <p className="text-sm font-medium">Outstanding — you answered yes to everything. Your gaming security posture is excellent.</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={reset} variant="outline" className="flex-1 gap-2">
                <RotateCcw className="h-4 w-4" /> Retake Assessment
              </Button>
              <Button asChild className="flex-1">
                <Link to="/tools">Explore More Tools</Link>
              </Button>
            </div>

            {/* Related links */}
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3 text-sm">
              <Link to="/security" className="text-primary hover:underline">Threat Intel</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/gaming" className="text-primary hover:underline">Game Security</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/guides" className="text-primary hover:underline">Security Guides</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/breach-sim" className="text-primary hover:underline">Breach Simulator</Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
