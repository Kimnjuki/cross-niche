import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, AlertTriangle, ChevronRight } from 'lucide-react';

export function NexusGuardWidget() {
  return (
    <div className="bg-[#16161A] border border-[#27272A] hover:border-[rgba(0,240,255,0.35)] transition-all duration-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#00F0FF]" />
          <span className="font-display font-bold text-sm text-white">NexusGuard</span>
        </div>
        <span className="flex items-center gap-1.5 bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)] px-2 py-0.5 font-mono text-[10px] text-[#00F0FF] uppercase tracking-wider animate-glow-pulse">
          <Activity className="h-3 w-3" /> Live
        </span>
      </div>

      <p className="text-xs text-zinc-500">AI-powered threat detection dashboard. Monitoring active sources in real-time.</p>

      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Active Sources', value: '120+',    color: '#00F0FF' },
          { label: 'Threats Today',  value: '47',      color: '#FFB800' },
          { label: 'Critical',       value: '3',       color: '#EF4444' },
          { label: 'Resolved',       value: '44',      color: '#39FF14' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[rgba(0,0,0,0.3)] px-3 py-2">
            <div className="font-mono font-bold text-base" style={{ color }}>{value}</div>
            <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] px-3 py-2">
        <AlertTriangle className="h-3.5 w-3.5 text-[#EF4444] shrink-0" />
        <span className="font-mono text-[10px] text-[#EF4444]">3 critical threats require attention</span>
      </div>

      <Link
        to="/live-threat-dashboard"
        className="flex items-center justify-center gap-2 w-full border border-[#00F0FF] text-[#00F0FF] hover:bg-[rgba(0,240,255,0.08)] py-2 font-mono text-xs transition-all"
      >
        Open NexusGuard <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
