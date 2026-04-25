import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Bug, Radio, ClipboardCheck,
  ChevronRight, Activity, Zap,
} from 'lucide-react';

interface ToolCard {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  statLabel: string;
  statValue: string;
  cta: string;
  href: string;
  accent: 'cyan' | 'red' | 'amber' | 'green';
}

const TOOL_CARDS: ToolCard[] = [
  {
    id: 'nexusguard',
    title: 'NexusGuard',
    icon: ShieldCheck,
    description: 'AI-powered threat detection dashboard',
    statLabel: 'Scanning',
    statValue: '120+ sources',
    cta: 'Open NexusGuard',
    href: '/live-threat-dashboard',
    accent: 'cyan',
  },
  {
    id: 'breach_sim',
    title: 'Breach Simulator',
    icon: Bug,
    description: 'Run scenario-based breach response training',
    statLabel: 'Last sim',
    statValue: '2h ago',
    cta: 'Launch Simulation',
    href: '/breach-sim',
    accent: 'red',
  },
  {
    id: 'threat_intel',
    title: 'Threat Intel',
    icon: Radio,
    description: 'Real-time CVEs, advisories, and threat feeds',
    statLabel: 'Critical alerts',
    statValue: '12 today',
    cta: 'View Intel',
    href: '/security',
    accent: 'amber',
  },
  {
    id: 'security_audit',
    title: 'Security Audit',
    icon: ClipboardCheck,
    description: 'Assess your security posture with guided checklists',
    statLabel: 'Checks',
    statValue: '5 items',
    cta: 'Start Audit',
    href: '/tools',
    accent: 'green',
  },
];

const ACCENT = {
  cyan:  { border: 'hover:border-[#00F0FF]', text: 'text-[#00F0FF]', bg: 'bg-[rgba(0,240,255,0.1)]',  icon: 'text-[#00F0FF]' },
  red:   { border: 'hover:border-[#EF4444]', text: 'text-[#EF4444]', bg: 'bg-[rgba(239,68,68,0.1)]',  icon: 'text-[#EF4444]' },
  amber: { border: 'hover:border-[#FFB800]', text: 'text-[#FFB800]', bg: 'bg-[rgba(255,184,0,0.1)]',  icon: 'text-[#FFB800]' },
  green: { border: 'hover:border-[#39FF14]', text: 'text-[#39FF14]', bg: 'bg-[rgba(57,255,20,0.1)]',  icon: 'text-[#39FF14]' },
};

const SUGGESTIONS = [
  { cmd: 'scan',   href: '/live-threat-dashboard' },
  { cmd: 'status', href: '/security' },
  { cmd: 'news',   href: '/tech' },
  { cmd: 'help',   href: '/tools' },
];

export function CommandDashboard() {
  return (
    <section className="bg-[#0A0A0B] border-b border-[#27272A] py-10">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">

        {/* Row 1: compact status badges */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Security Status', value: 'Active',   dot: 'bg-[#39FF14]' },
            { label: 'Threat Level',    value: 'Elevated', dot: 'bg-[#FFB800]' },
            { label: 'System Health',   value: '99.9%',    dot: 'bg-[#00F0FF]' },
          ].map(({ label, value, dot }) => (
            <div key={label} className="flex items-center gap-3 bg-[#16161A] border border-[#27272A] px-4 py-3">
              <span className={`w-2 h-2 rounded-full ${dot} animate-pulse shrink-0`} />
              <div>
                <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">{label}</div>
                <div className="font-mono text-xs font-bold text-white">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: primary tool cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOL_CARDS.map((card) => {
            const Icon = card.icon;
            const a = ACCENT[card.accent];
            return (
              <Link
                key={card.id}
                to={card.href}
                className={`group bg-[#16161A] border border-[#27272A] ${a.border} p-5 flex flex-col gap-3 transition-all duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2 ${a.bg}`}>
                    <Icon className={`h-5 w-5 ${a.icon}`} />
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                    <Activity className="h-3 w-3" /> Live
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-sm group-hover:text-zinc-100">
                    {card.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{card.description}</p>
                </div>
                <div className="mt-auto border-t border-[#27272A] pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">{card.statLabel}</span>
                    <span className={`text-[10px] font-mono font-bold ${a.text}`}>{card.statValue}</span>
                  </div>
                  <span className={`text-[10px] font-mono ${a.text} flex items-center gap-1 group-hover:gap-2 transition-all`}>
                    {card.cta} <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Row 3: terminal quick suggestions */}
        <div className="bg-[#050505] border border-[#27272A] px-5 py-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[#39FF14] text-xs mr-2">nexus@grid:~$</span>
          {SUGGESTIONS.map(({ cmd, href }) => (
            <Link
              key={cmd}
              to={href}
              className="font-mono text-xs text-zinc-400 hover:text-[#00F0FF] border border-[#27272A] hover:border-[#00F0FF] px-3 py-1 transition-all"
            >
              {cmd}
            </Link>
          ))}
          <span className="font-mono text-[10px] text-zinc-700 ml-auto hidden sm:block">
            click a command to run
          </span>
        </div>

      </div>
    </section>
  );
}
