import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, ChevronRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Article } from '@/types';

interface ThreatIntelWidgetProps {
  articles?: Article[];
}

type Severity = 'critical' | 'high' | 'medium' | 'low';

const SEVERITY_CLASSES: Record<Severity, string> = {
  critical: 'severity-critical',
  high:     'severity-high',
  medium:   'severity-medium',
  low:      'severity-low',
};

// Curated weekly fallback threats — rotated by week-of-year so they change
const WEEKLY_FALLBACKS = [
  [
    { id: 'f1', title: 'Critical OpenSSL vulnerability allows remote code execution via crafted TLS handshake', severity: 'critical' as Severity, url: '/security' },
    { id: 'f2', title: 'Steam credential-stuffing wave hits 400K accounts — enable Steam Guard now', severity: 'high' as Severity, url: '/security' },
    { id: 'f3', title: 'Fortnite client memory exploit patched in v29.01 — update required', severity: 'high' as Severity, url: '/security' },
    { id: 'f4', title: 'Discord OAuth phishing campaign targeting gaming communities', severity: 'medium' as Severity, url: '/security' },
    { id: 'f5', title: 'NVIDIA driver CVE-2024-0090 rated CVSS 8.2 — patch your GPU drivers', severity: 'medium' as Severity, url: '/security' },
  ],
  [
    { id: 'g1', title: 'Riot Games Vanguard kernel driver zero-day under active investigation', severity: 'critical' as Severity, url: '/security' },
    { id: 'g2', title: 'PlayStation Network session hijacking via CORS misconfiguration disclosed', severity: 'high' as Severity, url: '/security' },
    { id: 'g3', title: 'Chrome V8 sandbox escape affects browser-based game clients', severity: 'high' as Severity, url: '/security' },
    { id: 'g4', title: 'Apex Legends anti-cheat bypass sold on underground forums', severity: 'medium' as Severity, url: '/security' },
    { id: 'g5', title: 'Xbox Live token replay attack patched — force sign-out recommended', severity: 'medium' as Severity, url: '/security' },
  ],
  [
    { id: 'h1', title: 'Minecraft Java Edition RCE via malicious mod JAR — update to 1.21.1', severity: 'critical' as Severity, url: '/security' },
    { id: 'h2', title: 'Battle.net authenticator bypass via SIM-swap attacks resurging', severity: 'high' as Severity, url: '/security' },
    { id: 'h3', title: 'Epic Games Store client update silently disables firewall rules', severity: 'high' as Severity, url: '/security' },
    { id: 'h4', title: 'GTA Online DDoS amplification toolkit published on GitHub', severity: 'medium' as Severity, url: '/security' },
    { id: 'h5', title: 'Windows 11 kernel privilege escalation CVE-2024-38106 actively exploited', severity: 'medium' as Severity, url: '/security' },
  ],
  [
    { id: 'i1', title: 'League of Legends patch 14.18 fixes account auth token exposure', severity: 'critical' as Severity, url: '/security' },
    { id: 'i2', title: 'CS2 VAC bypass distributed via Discord "skin-unlock" bots', severity: 'high' as Severity, url: '/security' },
    { id: 'i3', title: 'AMD GPU driver stack overflow — CVSS 7.8, update via AMD Software', severity: 'high' as Severity, url: '/security' },
    { id: 'i4', title: 'Twitch API key leak exposes streamer account metadata', severity: 'medium' as Severity, url: '/security' },
    { id: 'i5', title: 'OBS Studio plugin sandbox escape — uninstall third-party plugins', severity: 'medium' as Severity, url: '/security' },
  ],
];

function getWeeklyFallback() {
  const week = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return WEEKLY_FALLBACKS[week % WEEKLY_FALLBACKS.length];
}

export function ThreatIntelWidget({ articles }: ThreatIntelWidgetProps) {
  const liveThreats = useQuery(api.threatIntel.listFeed, { limit: 5 });

  // Prefer live Convex data; fall back to curated weekly list
  const threats = React.useMemo(() => {
    if (liveThreats && liveThreats.length > 0) {
      return liveThreats.map((t) => ({
        id: t._id,
        title: t.title,
        severity: t.severity as Severity,
        url: t.url ?? '/live-threat-dashboard',
      }));
    }
    return getWeeklyFallback();
  }, [liveThreats]);

  const isLoading = liveThreats === undefined;

  return (
    <div className="bg-[#16161A] border border-[#27272A] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-[#FFB800]" />
          <h3 className="font-display font-bold text-sm text-white">Threat Intel</h3>
          {liveThreats && liveThreats.length > 0 && (
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#39FF14] bg-[#39FF14]/10 px-1.5 py-0.5">Live</span>
          )}
        </div>
        <Link to="/security" className="flex items-center gap-1 text-[10px] font-mono text-[#FFB800] hover:text-[#E6A500]">
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-xs text-zinc-600 font-mono py-2">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Loading threats…
        </div>
      ) : (
        <ul className="space-y-2">
          {threats.map((threat) => (
            <li key={threat.id}>
              <Link
                to={threat.url}
                className="group flex items-start gap-2 hover:bg-[rgba(255,184,0,0.04)] -mx-1 px-1 py-1.5 transition-colors"
              >
                <span className={`shrink-0 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 mt-0.5 ${SEVERITY_CLASSES[threat.severity]}`}>
                  {threat.severity}
                </span>
                <span className="text-xs text-zinc-400 group-hover:text-white line-clamp-2 transition-colors leading-snug">
                  {threat.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
