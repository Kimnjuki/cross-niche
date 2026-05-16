/**
 * InlineToolCTA — embeds interactive tool CTAs inside articles/pages
 * 
 * Detects article topic and surfaces the most relevant security tool.
 * Designed to be dropped inline within article content or as sidebar widget.
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Gamepad2, Target, Zap, Activity, AlertTriangle, 
  CheckCircle, Lock, Smartphone, Key, Eye, ChevronRight,
  ArrowRight, X, Swords
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Tool registry (centralized for easy maintenance) ───────────────────

export interface ToolDef {
  id: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tagline: string;
  color: string;
  /** Keywords/tags that trigger this tool to show */
  triggers: string[];
  /** Compact widget shows a simpler variant */
  compact?: boolean;
}

const tools: ToolDef[] = [
  {
    id: 'steam-scanner',
    href: '/tools/steam-scanner',
    icon: Gamepad2,
    label: 'Steam Scanner',
    tagline: 'Check your Steam account for vulnerabilities',
    color: 'border-[#FF007A]/30 hover:border-[#FF007A] bg-gradient-to-r from-[#FF007A]/5 to-transparent',
    triggers: ['steam', 'account', 'hack', 'compromised', 'theft', 'valve', 'phishing', 'credentials'],
  },
  {
    id: 'security-checkup',
    href: '/tools/security-checkup',
    icon: Shield,
    label: 'Gaming Security Checkup',
    tagline: '7-point audit across all your gaming platforms',
    color: 'border-[#00F0FF]/30 hover:border-[#00F0FF] bg-gradient-to-r from-[#00F0FF]/5 to-transparent',
    triggers: ['security', 'checkup', 'audit', 'protect', 'safe', 'platform', 'password', '2fa', 'mfa'],
  },
  {
    id: 'breach-sim',
    href: '/breach-sim',
    icon: Target,
    label: 'Breach Simulator',
    tagline: 'See how a real attack on your accounts would unfold',
    color: 'border-[#EF4444]/30 hover:border-[#EF4444] bg-gradient-to-r from-[#EF4444]/5 to-transparent',
    triggers: ['breach', 'attack', 'simulator', 'simulation', 'hack', 'exploit', 'vulnerability', 'zero-day'],
  },
  {
    id: 'threat-scanner',
    href: '/tools/threat-scanner',
    icon: Activity,
    label: 'Threat Scanner',
    tagline: 'Scan for active threats targeting your setup',
    color: 'border-[#B026FF]/30 hover:border-[#B026FF] bg-gradient-to-r from-[#B026FF]/5 to-transparent',
    triggers: ['threat', 'malware', 'ransomware', 'virus', 'trojan', 'spyware', 'scanner'],
  },
  {
    id: 'security-score',
    href: '/security-score',
    icon: Zap,
    label: 'Security Score',
    tagline: 'Get your personal security rating in 2 minutes',
    color: 'border-[#39FF14]/30 hover:border-[#39FF14] bg-gradient-to-r from-[#39FF14]/5 to-transparent',
    triggers: ['score', 'rating', 'assessment', 'evaluate', 'check', 'test'],
  },
  {
    id: 'nexusguard',
    href: '/tools/nexusguard',
    icon: Swords,
    label: 'NexusGuard',
    tagline: 'Real-time threat dashboard for your gaming setup',
    color: 'border-[#00F0FF]/30 hover:border-[#00F0FF] bg-gradient-to-r from-[#00F0FF]/5 to-transparent',
    triggers: ['dashboard', 'monitor', 'live', 'real-time', 'intel', 'intelligence'],
  },
];

// ── Smart matching ─────────────────────────────────────────────────────

function matchTools(tags: string[], articleTitle?: string): ToolDef[] {
  const lowerTags = tags.map(t => t.toLowerCase());
  const titleWords = (articleTitle ?? '').toLowerCase().split(/\s+/);

  const scored = tools.map(tool => {
    let score = 0;
    for (const trigger of tool.triggers) {
      if (lowerTags.some(t => t.includes(trigger))) score += 3;
      if (titleWords.some(w => w.includes(trigger))) score += 2;
    }
    return { tool, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.tool);
}

// ── Display stats hook (mock simulation — replace with real data later) ──

interface SecurityStats {
  totalScans: number;
  avgScore: number;
  criticalPercent: number;
  topWeakness: string;
}

function useSecurityStats(): SecurityStats {
  return {
    totalScans: 12847,
    avgScore: 64,
    criticalPercent: 31,
    topWeakness: '2FA Not Enabled',
  };
}

// ── Inline Tool CTA (default — appears within article content) ─────────

interface InlineToolCTAProps {
  tags?: string[];
  articleTitle?: string;
  position?: 'content-end' | 'sidebar';
  /** Override which tools to show (auto-detected from tags otherwise) */
  toolsOverride?: ToolDef[];
  /** Show the social-proof stat bar underneath */
  showStats?: boolean;
  /** Dismissable by user */
  dismissable?: boolean;
  /** CTA variant */
  variant?: 'banner' | 'pill' | 'widget' | 'card';
}

export function InlineToolCTA({
  tags = [],
  articleTitle,
  position = 'content-end',
  toolsOverride,
  showStats = true,
  dismissable = false,
  variant = 'banner',
}: InlineToolCTAProps) {
  const [dismissed, setDismissed] = useState(false);
  const stats = useSecurityStats();
  const matched = toolsOverride ?? matchTools(tags, articleTitle);

  // Only show if we have relevant tools
  if (dismissed || matched.length === 0) return null;

  const dismissKey = `gnx_dismiss_toolcta_${matched[0]?.id ?? 'default'}`;

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try { localStorage.setItem(dismissKey, '1'); } catch {}
  }, [dismissKey]);

  const firstTool = matched[0];

  // Pill variant (minimal)
  if (variant === 'pill') {
    return (
      <div className="my-8 flex flex-wrap items-center gap-2">
        {matched.map(tool => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              to={tool.href}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all',
                tool.color,
                'text-zinc-300 hover:text-white'
              )}
            >
              <Icon className="h-3 w-3" />
              {tool.label}
              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>
    );
  }

  // Widget variant (compact card grid)
  if (variant === 'widget') {
    return (
      <div className="my-8 rounded-xl border border-[#27272A] bg-[#16161A] overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00F0FF]">
              <Shield className="h-3 w-3 inline mr-1" />
              Security Tools for This Topic
            </h3>
            {dismissable && (
              <button onClick={handleDismiss} className="text-zinc-600 hover:text-zinc-400">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {matched.slice(0, 2).map(tool => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.href}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-all',
                    tool.color
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white">{tool.label}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{tool.tagline}</div>
                  </div>
                  <ChevronRight className="h-3 w-3 text-zinc-600 ml-auto shrink-0" />
                </Link>
              );
            })}
          </div>
          {matched.length > 2 && (
            <Link
              to="/tools"
              className="block text-center text-[10px] font-mono text-zinc-600 hover:text-zinc-400 mt-2 pt-2 border-t border-[#27272A]"
            >
              +{matched.length - 2} more tools for this topic
            </Link>
          )}
        </div>
        {showStats && <SecurityStatsBar stats={stats} />}
      </div>
    );
  }

  // Banner variant (full-width CTA — default, shown at content end)
  if (!firstTool) return null;

  const Icon = firstTool.icon;

  return (
    <div className="my-10 rounded-xl border border-[#27272A] bg-gradient-to-br from-[#16161A] to-black overflow-hidden">
      {dismissable && (
        <div className="flex justify-end pt-2 pr-2">
          <button onClick={handleDismiss} className="text-zinc-600 hover:text-zinc-400 text-xs">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center">
            <Icon className="h-5 w-5 text-[#00F0FF]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-white mb-1">
              Check Your Security — Related to This Article
            </h3>
            <p className="text-xs text-zinc-400 mb-3">
              {firstTool.tagline}
            </p>
            <div className="flex flex-wrap gap-2">
              {matched.map(tool => {
                const TIcon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    to={tool.href}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all',
                      tool.color,
                      tool.id === firstTool.id ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    <TIcon className="h-3 w-3" />
                    {tool.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {showStats && <SecurityStatsBar stats={stats} />}
      {matched.length > 1 && (
        <Link
          to="/tools"
          className="block text-center text-[10px] font-mono text-zinc-600 hover:text-zinc-400 py-1.5 border-t border-[#27272A]"
        >
          All security tools <ArrowRight className="h-3 w-3 inline" />
        </Link>
      )}
    </div>
  );
}

// ── Security Stats bar (social proof — "31% of gamers scanned had critical vulnerabilities") ──

function SecurityStatsBar({ stats }: { stats: SecurityStats }) {
  return (
    <div className="bg-[#0A0A0B] border-t border-[#27272A] px-5 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
          <Shield className="h-3 w-3 inline mr-1 text-[#00F0FF]" />
          Community Stats
        </span>
        <span className="text-[10px] font-mono text-zinc-400">
          <span className="text-[#39FF14]">{stats.totalScans.toLocaleString()}</span> scans
        </span>
        <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">·</span>
        <span className="text-[10px] font-mono text-zinc-400">
          Avg score: <span className={cn(
            stats.avgScore >= 80 ? 'text-[#39FF14]' : stats.avgScore >= 60 ? 'text-[#FFB800]' : 'text-[#EF4444]'
          )}>{stats.avgScore}%</span>
        </span>
        <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">·</span>
        <span className="text-[10px] font-mono text-[#EF4444]">
          ⚠ {stats.criticalPercent}% critical vulnerabilities detected
        </span>
        <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">·</span>
        <span className="text-[10px] font-mono text-[#FFB800]">
          Top weakness: {stats.topWeakness}
        </span>
      </div>
    </div>
  );
}

// ── Hero widget (for homepage hero section) ────────────────────────────

interface HeroToolWidgetProps {
  compact?: boolean;
}

export function HeroToolWidget({ compact }: HeroToolWidgetProps) {
  const stats = useSecurityStats();

  return (
    <div className="bg-[#16161A] border border-[#27272A] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest text-[#00F0FF] uppercase flex items-center gap-1.5">
          <Activity className="h-3 w-3" />
          Community Pulse
        </span>
        <Link
          to="/security-score"
          className="font-mono text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          Check yours →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0A0A0B] rounded-lg p-3 border border-[#27272A]">
          <div className="font-mono text-2xl font-bold text-white">
            {stats.totalScans.toLocaleString()}
          </div>
          <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">Scans run</div>
        </div>
        <div className="bg-[#0A0A0B] rounded-lg p-3 border border-[#27272A]">
          <div className="font-mono text-2xl font-bold" style={{ color: stats.avgScore >= 80 ? '#39FF14' : stats.avgScore >= 60 ? '#FFB800' : '#EF4444' }}>
            {stats.avgScore}%
          </div>
          <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">Avg security score</div>
        </div>
      </div>

      <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-[#EF4444] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-[#EF4444]">
              {stats.criticalPercent}% of gamers scanned had critical vulnerabilities
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Top issue: <span className="text-[#FFB800]">{stats.topWeakness}</span>
            </p>
          </div>
        </div>
      </div>

      <Link
        to="/tools/security-checkup"
        className="flex items-center justify-center gap-2 bg-[#00F0FF] hover:bg-[#00D4E6] text-black font-semibold text-sm px-4 py-2.5 transition-all w-full"
      >
        <Shield className="h-4 w-4" />
        Run Your Free Security Checkup
      </Link>
    </div>
  );
}

// ── Exit intent hook ──────────────────────────────────────────────────

export function useExitIntentToolCTA(toolHref = '/tools/security-checkup') {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setShow(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  return { show, dismiss: () => setShow(false), toolHref };
}

// ── Exit Intent Modal ─────────────────────────────────────────────────

interface ExitIntentModalProps {
  visible: boolean;
  onDismiss: () => void;
  toolHref?: string;
}

export function ExitIntentModal({ visible, onDismiss, toolHref = '/tools/security-checkup' }: ExitIntentModalProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#16161A] border border-[#27272A] max-w-md w-full p-6 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-400"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-[#00F0FF]" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          Before you go — check your gaming security
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          31% of gamers who scan discover critical vulnerabilities. 
          Don't be one login away from losing your account.
        </p>

        <div className="flex gap-2">
          <Link
            to={toolHref}
            onClick={onDismiss}
            className="flex-1 flex items-center justify-center gap-2 bg-[#00F0FF] hover:bg-[#00D4E6] text-black font-semibold px-4 py-2.5 text-sm transition-all"
          >
            <Shield className="h-4 w-4" />
            Run Free Checkup
          </Link>
          <button
            onClick={onDismiss}
            className="px-4 py-2.5 border border-[#3F3F46] text-zinc-400 hover:text-white text-sm transition-all"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default InlineToolCTA;
