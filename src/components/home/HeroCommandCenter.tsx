/**
 * HeroCommandCenter — repositioned to "Gaming Security Intelligence Hub"
 * 
 * Surgery: replaced "tech, security & gaming" broad positioning with
 * a focused gaming-security-first message. Added community pulse stats
 * and direct tool CTAs.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Activity, Users, Globe, Gamepad2, AlertTriangle, ChevronRight } from 'lucide-react';
import { HeroToolWidget } from '@/components/security/InlineToolCTA';

interface StatusBadgeProps {
  label: string;
  value: string;
  color: 'cyan' | 'green' | 'amber' | 'red';
}

function StatusBadge({ label, value, color }: StatusBadgeProps) {
  const colorMap = {
    cyan:  { dot: 'bg-[#00F0FF]', text: 'text-[#00F0FF]', bg: 'bg-[rgba(0,240,255,0.08)]', border: 'border-[rgba(0,240,255,0.2)]' },
    green: { dot: 'bg-[#39FF14]', text: 'text-[#39FF14]', bg: 'bg-[rgba(57,255,20,0.08)]',  border: 'border-[rgba(57,255,20,0.2)]'  },
    amber: { dot: 'bg-[#FFB800]', text: 'text-[#FFB800]', bg: 'bg-[rgba(255,184,0,0.08)]', border: 'border-[rgba(255,184,0,0.2)]'  },
    red:   { dot: 'bg-[#EF4444]', text: 'text-[#EF4444]', bg: 'bg-[rgba(239,68,68,0.08)]', border: 'border-[rgba(239,68,68,0.2)]'  },
  };
  const c = colorMap[color];
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-none border ${c.bg} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">{label}</span>
      <span className={`font-mono text-[10px] font-bold uppercase ${c.text}`}>{value}</span>
    </div>
  );
}

export function HeroCommandCenter() {
  return (
    <section className="bg-[#0A0A0B] border-b border-[#27272A]">
      <div className="container mx-auto px-4 max-w-7xl py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT: gaming-security-first positioning */}
          <div className="space-y-6">
            <span className="font-mono text-xs tracking-widest text-[#FF007A] uppercase flex items-center gap-2">
              <Gamepad2 className="h-3.5 w-3.5" />
              Gaming Security Intelligence
            </span>

            <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.1] tracking-tight text-white">
              Stop hackers from stealing{' '}
              <span className="gradient-nexus-intelligence">
                your gaming accounts
              </span>
              .
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
              Interactive security tools, real-time threat intel, and expert guides 
              built for gamers — not enterprise IT. Scan your accounts in 2 minutes.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/tools/security-checkup"
                className="inline-flex items-center gap-2 bg-[#FF007A] hover:bg-[#E0006C] text-white font-semibold px-6 py-3 transition-all shadow-lg shadow-[#FF007A]/20"
              >
                <Shield className="h-4 w-4" />
                Free Security Checkup
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 border border-[#3F3F46] hover:border-[#00F0FF] text-zinc-300 hover:text-[#00F0FF] px-6 py-3 transition-all"
              >
                <Zap className="h-4 w-4" />
                All Security Tools
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: Gamepad2, label: 'Built for Steam, PSN, Xbox, Epic' },
                { icon: Activity,  label: 'Real-time threat monitoring' },
                { icon: Users,     label: '12,800+ gamers scanned' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-zinc-500 text-sm">
                  <Icon className="h-4 w-4 text-[#FF007A]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Community Pulse + Quick Tools */}
          <div className="space-y-4">
            <HeroToolWidget />

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/tools/steam-scanner"
                className="flex items-center gap-2 bg-[#16161A] border border-[#27272A] hover:border-[#FF007A]/40 p-3 transition-all"
              >
                <Gamepad2 className="h-4 w-4 text-[#FF007A]" />
                <span className="text-xs font-mono text-zinc-300">Steam Scanner</span>
              </Link>
              <Link
                to="/breach-sim"
                className="flex items-center gap-2 bg-[#16161A] border border-[#27272A] hover:border-[#EF4444]/40 p-3 transition-all"
              >
                <AlertTriangle className="h-4 w-4 text-[#EF4444]" />
                <span className="text-xs font-mono text-zinc-300">Breach Simulator</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
