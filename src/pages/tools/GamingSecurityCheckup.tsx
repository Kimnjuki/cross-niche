import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Gamepad2, Shield, AlertTriangle, CheckCircle, XCircle,
  ChevronRight, RotateCcw, ExternalLink, Lock, Smartphone,
  Eye, Key, Bell, Globe, ArrowLeft, Activity, Zap, Star,
} from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';
import { useAuth } from '@/contexts/AuthContext';

// ── Types ─────────────────────────────────────────────────────────────────────

type Answer = 'yes' | 'no' | 'unknown';
type Phase = 'platform' | 'checklist' | 'results';
type Platform = 'steam' | 'psn' | 'xbox' | 'riot' | 'epic' | 'battlenet';

interface CheckItem {
  id: string;
  category: string;
  question: string;
  detail: string;
  howToCheck: string;
  link?: string;
  weight: number;
  icon: React.ComponentType<{ className?: string }>;
}

// ── Platform definitions ──────────────────────────────────────────────────────

interface PlatformConfig {
  id: Platform;
  name: string;
  color: string;
  bg: string;
  ring: string;
  emoji: string;
  checks: CheckItem[];
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'steam',
    name: 'Steam',
    color: 'text-[#1b2838]',
    bg: 'bg-[#1b2838]/10',
    ring: '#1b2838',
    emoji: '🎮',
    checks: [
      { id: 'sg_mobile', category: 'Authentication', question: 'Steam Guard Mobile Authenticator is enabled', detail: 'Time-based codes protect logins and confirm trades — the single most impactful Steam security measure.', howToCheck: 'Steam App → Menu → Steam Guard → "Steam Guard Mobile Authenticator is enabled"', link: 'https://store.steampowered.com/mobile', weight: 25, icon: Smartphone },
      { id: 'trade_confirm', category: 'Trading', question: 'Trade confirmations require Mobile Authenticator approval', detail: 'Without this, stolen session cookies can silently drain your inventory within minutes.', howToCheck: 'Steam App → Steam Guard → "Confirm trades via Steam mobile app"', weight: 20, icon: Shield },
      { id: 'api_key', category: 'Account', question: 'You have reviewed (or have no) Steam Web API key', detail: 'Rogue API keys are created after account takeovers to intercept trade offers.', howToCheck: 'Visit steamcommunity.com/dev/apikey — revoke any unrecognised key.', link: 'https://steamcommunity.com/dev/apikey', weight: 15, icon: Key },
      { id: 'unique_pw', category: 'Authentication', question: 'Steam password is unique — not reused from any other site', detail: 'Credential stuffing is the #1 route to Steam account takeover.', howToCheck: 'Check via your password manager. If reused, change it now.', link: 'https://haveibeenpwned.com/', weight: 15, icon: Lock },
      { id: 'profile_private', category: 'Privacy', question: 'Game library and playtime set to Private or Friends Only', detail: 'Public playtime reveals your game catalogue, helping craft targeted phishing.', howToCheck: 'Steam → username → Edit Profile → Privacy Settings → "Game details"', weight: 10, icon: Eye },
      { id: 'login_history', category: 'Monitoring', question: 'Recent login history shows no unfamiliar locations', detail: 'Unfamiliar logins signal active compromise. Check before changing passwords.', howToCheck: 'Steam → Settings → Account → "View Recent Login History"', weight: 10, icon: Bell },
      { id: 'real_name', category: 'Privacy', question: 'Real name hidden from public profile', detail: 'A visible real name on Steam enables targeted social engineering.', howToCheck: 'Steam → Edit Profile → General → Real Name (leave blank)', weight: 5, icon: Eye },
    ],
  },
  {
    id: 'psn',
    name: 'PlayStation Network',
    color: 'text-[#003087]',
    bg: 'bg-[#003087]/10',
    ring: '#003087',
    emoji: '🎮',
    checks: [
      { id: 'psn_2sv', category: 'Authentication', question: '2-Step Verification (2SV) is enabled on your PSN account', detail: 'PSN 2SV via authenticator app or SMS is the primary defence against account takeover.', howToCheck: 'PlayStation App → Account → Security → 2-Step Verification', weight: 25, icon: Smartphone },
      { id: 'psn_unique_pw', category: 'Authentication', question: 'PSN password is unique — not reused from any other service', detail: 'Credential stuffing attacks directly target PSN accounts.', howToCheck: 'Use a password manager. Check haveibeenpwned.com for breaches.', link: 'https://haveibeenpwned.com/', weight: 20, icon: Lock },
      { id: 'psn_real_name', category: 'Privacy', question: 'Real name sharing is set to "No One" or trusted friends only', detail: 'Public real names enable stalking and targeted social engineering.', howToCheck: 'Settings → PSN Profile → Real Name → "No One"', weight: 15, icon: Eye },
      { id: 'psn_playtime', category: 'Privacy', question: 'Gaming history and playtime are set to private', detail: 'Public trophies/playtime reveal which games and accounts to target.', howToCheck: 'Settings → PSN Profile → Privacy Settings → "Gaming History" → "No One"', weight: 10, icon: Eye },
      { id: 'psn_login_notif', category: 'Monitoring', question: 'Sign-in notifications are turned on for your account', detail: 'Instant email alerts when someone signs in from a new device.', howToCheck: 'account.sonyentertainmentnetwork.com → Security → Sign-in Notifications', weight: 15, icon: Bell },
      { id: 'psn_sub_share', category: 'Account', question: 'Console sharing is only with devices you personally own', detail: 'Primary Console sharing with strangers can expose your entire game library.', howToCheck: 'Settings → Users and Accounts → Other → Console Sharing and Offline Play', weight: 10, icon: Gamepad2 },
      { id: 'psn_payment', category: 'Account', question: 'Saved payment methods use a PayPal or prepaid card — not a bare credit card', detail: 'Stored credit cards are at risk if your PSN account is compromised.', howToCheck: 'PlayStation Store → Payment Methods. Use PayPal or PSN wallet credit instead.', weight: 5, icon: Key },
    ],
  },
  {
    id: 'xbox',
    name: 'Xbox / Microsoft',
    color: 'text-[#107c10]',
    bg: 'bg-[#107c10]/10',
    ring: '#107c10',
    emoji: '🎮',
    checks: [
      { id: 'xbox_msa_2fa', category: 'Authentication', question: 'Microsoft Account has two-factor authentication enabled', detail: 'Your Xbox account is your Microsoft Account — protecting it protects all Microsoft services.', howToCheck: 'account.microsoft.com → Security → Two-step verification', weight: 25, icon: Smartphone },
      { id: 'xbox_authenticator', category: 'Authentication', question: 'Microsoft Authenticator app used (not just SMS)', detail: 'SMS 2FA is vulnerable to SIM-swap attacks. The app is far more secure.', howToCheck: 'account.microsoft.com → Security → Advanced Security Options → Authenticator App', weight: 20, icon: Shield },
      { id: 'xbox_unique_pw', category: 'Authentication', question: 'Microsoft Account password is unique and strong', detail: 'A compromised Microsoft password exposes Xbox, OneDrive, Office, and Azure.', howToCheck: 'Use a password manager. Change if you reuse it anywhere.', weight: 15, icon: Lock },
      { id: 'xbox_privacy', category: 'Privacy', question: 'Xbox privacy settings restrict profile visibility to friends only', detail: 'Public profiles expose your gamertag, activity, and friends list.', howToCheck: 'Xbox App → Settings → Privacy & Online Safety → Xbox Privacy', weight: 15, icon: Eye },
      { id: 'xbox_child_protect', category: 'Account', question: 'Family accounts have appropriate content filters set', detail: 'Unsecured family/child accounts can be a vector into the main account.', howToCheck: 'account.microsoft.com → Family → Manage family members', weight: 10, icon: Key },
      { id: 'xbox_purchase_pin', category: 'Account', question: 'A purchase passkey/PIN is set to prevent unauthorised purchases', detail: 'Stolen access can result in large unauthorised Microsoft Store purchases.', howToCheck: 'Xbox Settings → Account → Privacy & Online Safety → Purchase Passkey', weight: 10, icon: Lock },
      { id: 'xbox_signin_review', category: 'Monitoring', question: 'Recent sign-in activity shows no unfamiliar devices', detail: 'Regular checks catch compromises before significant damage occurs.', howToCheck: 'account.microsoft.com → Security → Sign-in Activity → Review', weight: 5, icon: Bell },
    ],
  },
  {
    id: 'riot',
    name: 'Riot Games',
    color: 'text-[#d13639]',
    bg: 'bg-[#d13639]/10',
    ring: '#d13639',
    emoji: '⚔️',
    checks: [
      { id: 'riot_2fa', category: 'Authentication', question: 'Two-factor authentication is enabled on your Riot account', detail: 'Protects Valorant, League of Legends, Teamfight Tactics, and all Riot titles.', howToCheck: 'auth.riotgames.com → Settings → Security → Two-Factor Authentication', weight: 25, icon: Smartphone },
      { id: 'riot_unique_pw', category: 'Authentication', question: 'Riot account password is unique — not used on any other site', detail: 'Riot accounts are prime credential-stuffing targets due to in-game item value.', howToCheck: 'Change at auth.riotgames.com/settings if reused.', weight: 20, icon: Lock },
      { id: 'riot_email_secure', category: 'Authentication', question: 'The email linked to Riot also has 2FA enabled', detail: 'If your recovery email is compromised, your Riot account can be taken over even with 2FA.', howToCheck: 'Check your email provider\'s security settings for 2FA.', weight: 20, icon: Key },
      { id: 'riot_sessions', category: 'Monitoring', question: 'Active sessions show only your devices', detail: 'Suspicious sessions indicate a current or recent compromise.', howToCheck: 'auth.riotgames.com → Settings → Security → Active Sessions → Review', weight: 15, icon: Bell },
      { id: 'riot_privacy', category: 'Privacy', question: 'Riot profile visibility is set appropriately (not public)', detail: 'Public profiles expose your playtime and rank history for targeted harassment.', howToCheck: 'Riot Client → Settings → Privacy', weight: 10, icon: Eye },
      { id: 'riot_payment', category: 'Account', question: 'Payment methods use PayPal or prepaid RP cards instead of saved credit cards', detail: 'Limiting stored payment info reduces financial exposure if compromised.', howToCheck: 'store.steampowered.com or Riot Store payment settings.', weight: 5, icon: Key },
      { id: 'riot_breach_check', category: 'Monitoring', question: 'You have checked if your Riot email was in a known breach', detail: 'Breach exposure puts your credentials at immediate credential-stuffing risk.', howToCheck: 'Visit haveibeenpwned.com with your Riot email address.', link: 'https://haveibeenpwned.com/', weight: 5, icon: AlertTriangle },
    ],
  },
  {
    id: 'epic',
    name: 'Epic Games',
    color: 'text-[#313131]',
    bg: 'bg-[#313131]/10',
    ring: '#313131',
    emoji: '🎯',
    checks: [
      { id: 'epic_2fa', category: 'Authentication', question: 'Two-factor authentication is enabled on your Epic account', detail: 'Enabling Epic 2FA also unlocks free Fortnite cosmetics — immediate benefit.', howToCheck: 'epicgames.com/account/password → Two-Factor Authentication → Enable', weight: 25, icon: Smartphone },
      { id: 'epic_authenticator', category: 'Authentication', question: 'Authenticator App 2FA is used (not just Email 2FA)', detail: 'Email-based 2FA is better than nothing but an authenticator app is far stronger.', howToCheck: 'Epic Account Settings → Password & Security → Two-Factor Authentication', weight: 15, icon: Shield },
      { id: 'epic_unique_pw', category: 'Authentication', question: 'Epic account password is unique and not reused', detail: 'Fortnite V-Bucks and rare skins make Epic accounts high-value targets.', howToCheck: 'Change at epicgames.com/account if reused elsewhere.', weight: 20, icon: Lock },
      { id: 'epic_linked', category: 'Account', question: 'Linked platform accounts (PlayStation, Xbox, Switch) are reviewed', detail: 'Linked accounts can be a pivot point for attackers who compromise one platform.', howToCheck: 'epicgames.com/account/connections → Apps and Accounts → Review', weight: 15, icon: Globe },
      { id: 'epic_email_secure', category: 'Authentication', question: 'Your Epic recovery email account also has 2FA enabled', detail: 'Account recovery via email is the #1 bypass for 2FA on Epic.', howToCheck: 'Check your email provider security settings.', weight: 15, icon: Key },
      { id: 'epic_sessions', category: 'Monitoring', question: 'Third-party app permissions show only apps you recognise', detail: 'Rogue third-party integrations can retain access even after password changes.', howToCheck: 'epicgames.com/account/connections → Websites and Apps → Revoke unknowns', weight: 5, icon: Bell },
      { id: 'epic_breach_check', category: 'Monitoring', question: 'Your Epic email was not found in any known data breach', detail: 'Breached credentials are immediately tested against game platforms.', howToCheck: 'haveibeenpwned.com with your Epic account email.', link: 'https://haveibeenpwned.com/', weight: 5, icon: AlertTriangle },
    ],
  },
  {
    id: 'battlenet',
    name: 'Battle.net',
    color: 'text-[#148EFF]',
    bg: 'bg-[#148EFF]/10',
    ring: '#148EFF',
    emoji: '⚡',
    checks: [
      { id: 'bnet_authenticator', category: 'Authentication', question: 'Battle.net Authenticator app is linked and active', detail: 'Activision-Blizzard accounts are prime targets due to valuable WoW and Diablo items.', howToCheck: 'Battle.net App → Account → Battle.net Authenticator → Set Up Authenticator', weight: 25, icon: Smartphone },
      { id: 'bnet_sms_protect', category: 'Authentication', question: 'SMS Protect is enabled as a backup 2FA method', detail: 'Provides recovery access if your authenticator device is lost.', howToCheck: 'Battle.net Account → Security → SMS Protect', weight: 15, icon: Smartphone },
      { id: 'bnet_unique_pw', category: 'Authentication', question: 'Battle.net password is unique — not reused anywhere else', detail: 'Account leaks from Activision and Blizzard game databases have exposed millions of credentials.', howToCheck: 'Change at account.battle.net/security if reused.', weight: 20, icon: Lock },
      { id: 'bnet_email_secure', category: 'Authentication', question: 'Recovery email for Battle.net also has 2FA', detail: 'Email account compromise is the primary bypass for Battle.net 2FA.', howToCheck: 'Check your email provider security settings.', weight: 15, icon: Key },
      { id: 'bnet_login_history', category: 'Monitoring', question: 'Recent login history shows no unfamiliar locations', detail: 'Blizzard shows device and location history — review it monthly.', howToCheck: 'account.battle.net/security → Login History → Review', weight: 10, icon: Bell },
      { id: 'bnet_real_id', category: 'Privacy', question: 'Real ID is only shared with people you know personally', detail: 'Real ID shows your real name and is shared across all Battle.net games.', howToCheck: 'Battle.net App → Social → Real ID Friends → Review', weight: 10, icon: Eye },
      { id: 'bnet_payment', category: 'Account', question: 'Saved payment method uses PayPal or prepaid card', detail: 'Stored cards are at risk if your Battle.net account is compromised.', howToCheck: 'account.battle.net/payment-methods → Review and remove bare credit cards', weight: 5, icon: Key },
    ],
  },
];

// ── Score tier helpers ────────────────────────────────────────────────────────

function getTier(pct: number): { label: string; desc: string; color: string; bg: string } {
  if (pct >= 90) return { label: 'Fort Knox', desc: 'Near-perfect. Your account is hardened against virtually all common attacks.', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500' };
  if (pct >= 70) return { label: 'Secured', desc: 'Strong defences. A few gaps remain — close them to reach Fort Knox tier.', color: 'text-gaming', bg: 'bg-gaming' };
  if (pct >= 50) return { label: 'Hardened', desc: 'Basic protections in place but significant vulnerabilities exist.', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500' };
  return { label: 'Exposed', desc: 'Multiple critical gaps. Your account is at high risk of takeover.', color: 'text-destructive', bg: 'bg-destructive' };
}

// ── Score Ring ────────────────────────────────────────────────────────────────

function ScoreRing({ pct, color, ringColor }: { pct: number; color: string; ringColor: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="10" className="stroke-muted/30" />
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="10" stroke={ringColor}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.19,1,0.22,1)' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className={cn('text-3xl font-bold font-display', color)}>{pct}%</div>
        <div className="text-xs text-muted-foreground">secure</div>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GamingSecurityCheckup() {
  const isDisabled = useConvexDisabled();
  const { user } = useAuth();
  const saveScore = useMutation(api.gamingTools.saveSecurityScore);
  const sessionIdRef = useRef(() => {
    const stored = sessionStorage.getItem('gnx_gaming_checkup_session');
    if (stored) return stored;
    const id = crypto.randomUUID();
    sessionStorage.setItem('gnx_gaming_checkup_session', id);
    return id;
  });

  const [phase, setPhase] = useState<Phase>('platform');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const platform = selectedPlatform;
  const checks = platform?.checks ?? [];
  const maxScore = useMemo(() => checks.reduce((s, c) => s + c.weight, 0), [checks]);
  const score = useMemo(() => checks.reduce((s, c) => answers[c.id] === 'yes' ? s + c.weight : s, 0), [checks, answers]);
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const tier = getTier(pct);
  const answered = Object.keys(answers).length;
  const totalChecks = checks.length;
  const failedItems = checks.filter(c => answers[c.id] !== 'yes');
  const criticalFails = failedItems.filter(c => c.weight >= 15);
  const currentItem = checks[currentIndex];

  const handleSelectPlatform = useCallback((p: PlatformConfig) => {
    setSelectedPlatform(p);
    setAnswers({});
    setCurrentIndex(0);
    setPhase('checklist');
  }, []);

  const handleAnswer = useCallback((id: string, answer: Answer) => {
    setAnswers(prev => ({ ...prev, [id]: answer }));
    setCurrentIndex(prev => Math.min(prev + 1, totalChecks - 1));
  }, [totalChecks]);

  const handleFinish = useCallback(() => {
    setPhase('results');
    if (isDisabled || !platform) return;
    const answersArr = checks.map((item, i) => ({
      questionId: i,
      answer: answers[item.id] === 'yes' ? 'yes' as const : 'no' as const,
    }));
    const bandMap: Record<string, 'excellent' | 'good' | 'fair' | 'needs_work'> = {
      'Fort Knox': 'excellent', 'Secured': 'good', 'Hardened': 'fair', 'Exposed': 'needs_work',
    };
    saveScore({
      sessionId: sessionIdRef.current(),
      userId: user?.id,
      answers: answersArr,
      totalScore: score,
      maxScore,
      percentScore: pct,
      band: bandMap[tier.label] ?? 'needs_work',
      weakAreaCount: failedItems.length,
    }).catch(() => {});
  }, [isDisabled, platform, checks, answers, score, maxScore, pct, tier.label, failedItems.length, saveScore, user?.id]);

  const handleReset = useCallback(() => {
    sessionIdRef.current = () => {
      const id = crypto.randomUUID();
      sessionStorage.setItem('gnx_gaming_checkup_session', id);
      return id;
    };
    setSelectedPlatform(null);
    setAnswers({});
    setCurrentIndex(0);
    setPhase('platform');
  }, []);

  return (
    <Layout>
      <SEO
        title="Gaming Account Security Checkup | The Grid Nexus"
        description="Multi-platform gaming account security checker. Assess Steam, PSN, Xbox, Riot Games, Epic, and Battle.net security in minutes. Free."
        canonical="https://thegridnexus.com/tools/gaming-security-checkup"
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
          <span className="text-foreground font-medium">Gaming Security Checkup</span>
        </div>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gaming/10 border border-gaming/20 mb-4">
            <Gamepad2 className="h-8 w-8 text-gaming" />
          </div>
          <h1 className="font-display font-bold text-4xl mb-2">Gaming Account Security Checkup</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Platform-specific 7-point security audit for Steam, PSN, Xbox, Riot, Epic & Battle.net. Get your security tier in 3 minutes.
          </p>
        </div>

        {/* ── PHASE: PLATFORM SELECT ── */}
        {phase === 'platform' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose your gaming platform</CardTitle>
                <CardDescription>We'll load a tailored security checklist for that platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PLATFORMS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPlatform(p)}
                      className={cn('flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent hover:border-gaming/40 transition-all', p.bg, 'hover:scale-[1.02]')}
                    >
                      <span className="text-2xl">{p.emoji}</span>
                      <span className="text-sm font-semibold text-center leading-tight">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.checks.length} checks</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tier preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Fort Knox', desc: '90–100%', color: 'text-green-600 dark:text-green-400', icon: '🏰' },
                { label: 'Secured', desc: '70–89%', color: 'text-gaming', icon: '🛡️' },
                { label: 'Hardened', desc: '50–69%', color: 'text-yellow-600 dark:text-yellow-400', icon: '⚠️' },
                { label: 'Exposed', desc: '0–49%', color: 'text-destructive', icon: '🔓' },
              ].map(t => (
                <div key={t.label} className="rounded-lg border p-3 text-center bg-muted/20">
                  <div className="text-xl mb-1">{t.icon}</div>
                  <div className={cn('text-sm font-bold', t.color)}>{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PHASE: CHECKLIST ── */}
        {phase === 'checklist' && platform && currentItem && (
          <div className="space-y-6">
            {/* Platform badge + progress */}
            <div className="flex items-center justify-between">
              <span className={cn('text-sm font-semibold px-3 py-1 rounded-full', platform.bg)}>{platform.emoji} {platform.name}</span>
              <span className="text-sm text-muted-foreground">{Math.min(answered + 1, totalChecks)} / {totalChecks}</span>
            </div>
            <Progress value={(answered / totalChecks) * 100} className="h-2" />

            {/* Current check */}
            <Card className="border-gaming/20">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gaming/10 shrink-0 mt-0.5">
                    <currentItem.icon className="h-5 w-5 text-gaming" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gaming uppercase tracking-wider mb-1">{currentItem.category}</div>
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
                    <a href={currentItem.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-xs text-gaming hover:underline">
                      Check now <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="border-green-500/40 text-green-600 hover:bg-green-500/10 hover:border-green-500"
                    onClick={() => handleAnswer(currentItem.id, 'yes')}>
                    <CheckCircle className="mr-1.5 h-4 w-4" /> Yes
                  </Button>
                  <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive"
                    onClick={() => handleAnswer(currentItem.id, 'no')}>
                    <XCircle className="mr-1.5 h-4 w-4" /> No
                  </Button>
                  <Button variant="outline" className="text-muted-foreground"
                    onClick={() => handleAnswer(currentItem.id, 'unknown')}>
                    Not sure
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Answered pills */}
            {answered > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {checks.slice(0, answered).map(item => (
                  <span key={item.id} className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border',
                    answers[item.id] === 'yes'
                      ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
                      : 'bg-destructive/10 border-destructive/30 text-destructive')}>
                    {answers[item.id] === 'yes' ? <CheckCircle className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                    {item.category}
                  </span>
                ))}
              </div>
            )}

            {answered >= totalChecks && (
              <Button className="w-full bg-gaming hover:bg-gaming/90 text-white" onClick={handleFinish}>
                View My Security Tier <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* ── PHASE: RESULTS ── */}
        {phase === 'results' && platform && (
          <div className="space-y-6">
            {/* Score card */}
            <Card className="border-gaming/20">
              <CardContent className="pt-8 pb-6 text-center space-y-4">
                <ScoreRing pct={pct} color={tier.color} ringColor={platform.ring} />
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className={cn('h-5 w-5', tier.color)} />
                    <span className={cn('text-xl font-bold font-display', tier.color)}>{tier.label}</span>
                    <Star className={cn('h-5 w-5', tier.color)} />
                  </div>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">{tier.desc}</p>
                  <div className={cn('inline-flex items-center gap-1.5 mt-2 text-xs px-2.5 py-1 rounded-full', platform.bg)}>
                    <span>{platform.emoji}</span>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                </div>
                <Progress value={pct} className={cn('h-3 max-w-xs mx-auto', '[&>div]:' + tier.bg)} />
                <p className="text-sm text-muted-foreground">
                  Score: {score}/{maxScore} pts · {failedItems.length} gaps found
                </p>
              </CardContent>
            </Card>

            {/* Critical fixes */}
            {criticalFails.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-display font-bold text-lg flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" /> Fix These First ({criticalFails.length})
                </h2>
                {criticalFails.map(item => (
                  <Card key={item.id} className="border-destructive/20 bg-destructive/5">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-3">
                        <item.icon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="font-medium text-sm">{item.question}</p>
                          <p className="text-xs text-muted-foreground">{item.detail}</p>
                          <p className="text-xs font-medium text-muted-foreground">Fix: {item.howToCheck}</p>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-gaming hover:underline">
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
            {failedItems.filter(i => i.weight < 15).length > 0 && (
              <div className="space-y-2">
                <h2 className="font-display font-semibold text-base text-muted-foreground">
                  Other Improvements ({failedItems.filter(i => i.weight < 15).length})
                </h2>
                {failedItems.filter(i => i.weight < 15).map(item => (
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
                  <CheckCircle className="h-4 w-4" /> Passing ({answered - failedItems.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {checks.filter(c => answers[c.id] === 'yes').map(item => (
                    <span key={item.id} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      {item.category}
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
                  { href: '/tools/steam-scanner',       icon: Gamepad2, label: 'Steam Scanner',      sub: 'Steam-specific checks', color: 'text-gaming hover:bg-gaming/10 border-gaming/20' },
                  { href: '/tools/ioc-lookup',          icon: Shield,   label: 'IOC Lookup',         sub: 'Threat analysis',       color: 'text-security hover:bg-security/10 border-security/20' },
                  { href: '/tools/zero-trust-quiz',     icon: Zap,      label: 'Zero-Trust Quiz',    sub: 'Org readiness',         color: 'text-tech hover:bg-tech/10 border-tech/20' },
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
                <RotateCcw className="mr-1.5 h-4 w-4" /> Check Another Platform
              </Button>
              <Button className="flex-1 bg-gaming hover:bg-gaming/90 text-white" asChild>
                <Link to="/security-score" className="flex items-center gap-1.5">
                  Full Security Assessment <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
