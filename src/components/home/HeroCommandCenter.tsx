import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Activity, Users, Globe } from 'lucide-react';

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: positioning block */}
          <div className="space-y-6">
            <span className="font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
              Security Command Center
            </span>

            <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.1] tracking-tight text-white">
              Daily intelligence for{' '}
              <span className="gradient-nexus-intelligence">
                tech, security &amp; gaming
              </span>{' '}
              professionals.
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
              Track live threats, simulate breaches, and stay ahead with expert coverage —
              all from one command center.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/security"
                className="inline-flex items-center gap-2 bg-[#00F0FF] hover:bg-[#00D4E6] text-black font-semibold px-6 py-3 transition-all"
              >
                <Zap className="h-4 w-4" />
                View Latest Intel
              </Link>
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 border border-[#3F3F46] hover:border-[#00F0FF] text-zinc-300 hover:text-[#00F0FF] px-6 py-3 transition-all"
              >
                <Shield className="h-4 w-4" />
                Explore Security Tools
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: Activity, label: 'Live threat monitoring' },
                { icon: Users,    label: 'Built for security pros' },
                { icon: Globe,    label: 'Africa-first perspective' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-zinc-500 text-sm">
                  <Icon className="h-4 w-4 text-[#00F0FF]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: status dashboard */}
          <div className="bg-[#16161A] border border-[#27272A] p-6 space-y-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
                System Status
              </span>
              <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase border border-[#27272A] px-2 py-0.5">
                NEXUS COMMAND v2.0
              </span>
            </div>

            <div className="space-y-2">
              <StatusBadge label="Security Status" value="Active"    color="green" />
              <StatusBadge label="Threat Level"    value="Elevated"  color="amber" />
              <StatusBadge label="System Health"   value="Online"    color="cyan"  />
            </div>

            <div className="pt-4 border-t border-[#27272A] space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-500">RSS Sources</span>
                <span className="text-[#00F0FF]">Active</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-500">Threat Feed</span>
                <span className="text-[#39FF14]">Live</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-500">AI Analysis</span>
                <span className="text-[#B026FF]">Running</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-500">Last Sync</span>
                <span className="text-zinc-400">Just now</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#27272A]">
              {[
                { label: 'Articles', value: '2.4K+' },
                { label: 'Alerts',   value: '847'   },
                { label: 'Sources',  value: '120+'  },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="font-mono font-bold text-lg text-white">{value}</div>
                  <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
