/**
 * SecurityDashboard — interactive security profile dashboard for the homepage
 * 
 * Shows: user's last scan score (or prompt to scan), threat pulse, 
 * personalized recommendations. Works without auth (localStorage fallback).
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, AlertTriangle, CheckCircle, ChevronRight, 
  Activity, Target, Zap, Lock, Gamepad2, ArrowRight,
  Smartphone, Eye, Key
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────

interface ScanRecord {
  score: number;
  date: string;
  platform: string;
  weakAreas: number;
}

// ── Demo data (replace with Convex query when auth is available) ────────

const DEMO_THREATS = [
  { level: 'high', label: 'Steam API Key Leak' as const, icon: 'key', platform: 'Steam', time: '2h ago' },
  { level: 'medium', label: 'Weak Battle.net Password' as const, icon: 'lock', platform: 'Battle.net', time: '5h ago' },
  { level: 'low', label: 'Xbox Login from Unknown Location' as const, icon: 'eye', platform: 'Xbox', time: '1d ago' },
];

const THREAT_ICONS = {
  key: Key,
  lock: Lock,
  eye: Eye,
};

// ── User Security Profile hook ──────────────────────────────────────────

function useUserSecurityProfile(): {
  hasScanned: boolean;
  lastScan: ScanRecord | null;
  threatCount: number;
  criticalThreats: number;
} {
  const [lastScan, setLastScan] = useState<ScanRecord | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gnx_last_security_scan');
      if (stored) setLastScan(JSON.parse(stored));
    } catch {}
  }, []);

  const hasScanned = lastScan !== null;
  const criticalThreats = DEMO_THREATS.filter(t => t.level === 'high').length;

  return {
    hasScanned,
    lastScan,
    threatCount: DEMO_THREATS.length,
    criticalThreats,
  };
}

// ── Security Dashboard Component ───────────────────────────────────────

export function SecurityDashboard() {
  const { hasScanned, lastScan, threatCount, criticalThreats } = useUserSecurityProfile();
  const [activeTab, setActiveTab] = useState<'overview' | 'threats' | 'tools'>('overview');

  const scorePercent = lastScan?.score ?? 0;
  const scoreLabel = scorePercent >= 90 ? 'Fort Knox' 
    : scorePercent >= 70 ? 'Secured'
    : scorePercent >= 50 ? 'Hardened'
    : 'Exposed';
  const scoreColor = scorePercent >= 90 ? 'text-[#39FF14]' 
    : scorePercent >= 70 ? 'text-[#00F0FF]'
    : scorePercent >= 50 ? 'text-[#FFB800]'
    : 'text-[#EF4444]';

  return (
    <div className="bg-[#16161A] border border-[#27272A] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#27272A]">
        <span className="font-mono text-[10px] tracking-widest text-[#00F0FF] uppercase flex items-center gap-1.5">
          <Shield className="h-3 w-3" />
          Your Security Dashboard
        </span>
        <Link to="/tools/security-checkup" className="font-mono text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">
          Full dashboard →
        </Link>
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-[#27272A]">
        {(['overview', 'threats', 'tools'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-2.5 text-[10px] font-mono uppercase tracking-wider transition-all',
              activeTab === tab 
                ? 'text-white border-b-2 border-[#00F0FF] bg-[rgba(0,240,255,0.03)]'
                : 'text-zinc-600 hover:text-zinc-400 border-b-2 border-transparent'
            )}
          >
            {tab === 'overview' ? 'Overview' : tab === 'threats' ? 'Threats' : 'Tools'}
          </button>
        ))}
      </div>

      <div className="p-5">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {hasScanned ? (
              <>
                {/* Score display */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="#27272A" strokeWidth="2.5" />
                      <circle cx="18" cy="18" r="15.5" fill="none" 
                        stroke={scorePercent >= 90 ? '#39FF14' : scorePercent >= 70 ? '#00F0FF' : scorePercent >= 50 ? '#FFB800' : '#EF4444'} 
                        strokeWidth="2.5" strokeDasharray={`${scorePercent}, 100`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-white">
                      {scorePercent}
                    </span>
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold text-white">{scoreLabel}</div>
                    <div className="font-mono text-[10px] text-zinc-500">
                      Last scan: {lastScan?.date ?? '—'} · {lastScan?.platform ?? '—'}
                    </div>
                    {lastScan && lastScan.weakAreas > 0 && (
                      <div className="font-mono text-[10px] text-[#FFB800] mt-0.5">
                        {lastScan.weakAreas} issue{lastScan.weakAreas !== 1 ? 's' : ''} found
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick fix CTA */}
                {scorePercent < 90 && (
                  <Link
                    to="/tools/security-checkup"
                    className="flex items-center justify-center gap-2 bg-[#FF007A] hover:bg-[#E0006C] text-white text-xs font-semibold px-4 py-2.5 transition-all w-full"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Re-scan & Fix Issues
                  </Link>
                )}
              </>
            ) : (
              <>
                {/* Empty state — prompt to scan */}
                <div className="text-center py-2">
                  <div className="w-12 h-12 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/20 flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-[#00F0FF]" />
                  </div>
                  <p className="text-sm font-semibold text-white mb-1">You haven't run a security scan yet</p>
                  <p className="text-xs text-zinc-500 mb-4">Check all your gaming accounts for vulnerabilities in 2 minutes.</p>
                  <Link
                    to="/tools/security-checkup"
                    className="inline-flex items-center gap-2 bg-[#00F0FF] hover:bg-[#00D4E6] text-black font-semibold text-xs px-5 py-2.5 transition-all"
                  >
                    <Target className="h-3.5 w-3.5" />
                    Run Free Security Checkup
                  </Link>
                </div>

                {/* Social proof */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#27272A]">
                  <div className="text-center">
                    <div className="font-mono font-bold text-sm text-white">12.8K</div>
                    <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">Scans</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-bold text-sm text-[#EF4444]">31%</div>
                    <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-bold text-sm text-[#00F0FF]">64%</div>
                    <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">Avg Score</div>
                  </div>
                </div>
              </>
            )}

            {/* Threat pulse */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 mb-2">
                <Activity className="h-3 w-3 text-[#EF4444]" />
                <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-wider">Live Threats</span>
                {threatCount > 0 && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                    {threatCount} active
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {DEMO_THREATS.map((threat, i) => {
                  const Icon = THREAT_ICONS[threat.icon];
                  return (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded bg-[#0A0A0B] border border-[#27272A]">
                      {Icon && <Icon className={cn('h-3 w-3', threat.level === 'high' ? 'text-[#EF4444]' : threat.level === 'medium' ? 'text-[#FFB800]' : 'text-zinc-500')} />}
                      <span className="text-[10px] text-zinc-400 flex-1">{threat.label}</span>
                      <span className="text-[9px] text-zinc-600">{threat.platform}</span>
                      <span className="text-[9px] text-zinc-600">{threat.time}</span>
                    </div>
                  );
                })}
              </div>
              <Link to="/community-threats" className="block text-center text-[9px] font-mono text-zinc-600 hover:text-zinc-400 mt-1">
                View all threats →
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'threats' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">Gaming-specific threat intelligence detected in the last 24 hours:</p>
            {[
              { severity: 'Critical', title: 'Fake Steam login page detected on Google Ads', source: 'Threat Feed' },
              { severity: 'High', title: 'Discord malware campaign spreading via mod channels', source: 'Community Watch' },
              { severity: 'Medium', title: 'New LastPass phishing variant targets gamers', source: 'RSS Feed' },
              { severity: 'Low', title: 'Xbox account login attempts from Brazil', source: 'Your Alerts' },
            ].map((threat, i) => (
              <div key={i} className="flex items-start gap-2 p-2.5 rounded border border-[#27272A] bg-[#0A0A0B]">
                <AlertTriangle className={cn(
                  'h-3.5 w-3.5 mt-0.5 shrink-0',
                  threat.severity === 'Critical' ? 'text-[#EF4444]' : 
                  threat.severity === 'High' ? 'text-[#FFB800]' : 'text-zinc-500'
                )} />
                <div className="min-w-0">
                  <div className="text-[10px] text-zinc-400">{threat.title}</div>
                  <div className="text-[9px] text-zinc-600 mt-0.5">{threat.source} · {threat.severity}</div>
                </div>
              </div>
            ))}
            <Link to="/live-threat-dashboard" className="block text-center text-[9px] font-mono text-zinc-600 hover:text-zinc-400 pt-1">
              Full threat feed →
            </Link>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500">Recommended security actions based on your profile:</p>
            {[
              { icon: Gamepad2, label: 'Scan Steam Account', href: '/tools/steam-scanner', color: 'text-[#FF007A]' },
              { icon: Shield, label: 'Full Security Checkup', href: '/tools/security-checkup', color: 'text-[#00F0FF]' },
              { icon: Target, label: 'Run Breach Simulation', href: '/breach-sim', color: 'text-[#EF4444]' },
              { icon: Zap, label: 'Get Your Security Score', href: '/security-score', color: 'text-[#39FF14]' },
            ].map((tool, i) => {
              const Icon = tool.icon;
              return (
                <Link key={i} to={tool.href} className="flex items-center gap-3 p-2.5 rounded border border-[#27272A] hover:border-[#3F3F46] bg-[#0A0A0B] transition-all group">
                  <Icon className={cn('h-4 w-4', tool.color)} />
                  <span className="text-[11px] text-zinc-400 group-hover:text-white flex-1 transition-colors">{tool.label}</span>
                  <ChevronRight className="h-3 w-3 text-zinc-600" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SecurityDashboard;
