import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Users, Globe, Gamepad2 } from 'lucide-react';

export function HeroCommandCenter() {
  return (
    <section className="bg-[#0A0A0B] border-b border-[#27272A]">
      <div className="container mx-auto px-4 max-w-7xl py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: positioning block */}
          <div className="space-y-6">
            <span className="font-mono text-xs tracking-widest text-[#00F0FF] uppercase">
              Gaming Security for Players
            </span>

            <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-[1.1] tracking-tight text-white">
              Play safer.{' '}
              <span className="gradient-nexus-intelligence">
                Protect your accounts
              </span>{' '}
              and digital items.
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed max-w-xl">
              Check your protection, understand the threats that actually target players, and find
              verified recovery steps for Steam, Discord, PlayStation, Xbox, Epic and Riot.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/tools/gaming-security-checkup"
                className="inline-flex items-center gap-2 bg-[#00F0FF] hover:bg-[#00D4E6] text-black font-semibold px-6 py-3 transition-all"
              >
                <Zap className="h-4 w-4" />
                Check my protection
              </Link>
              <Link
                to="/threats"
                className="inline-flex items-center gap-2 border border-[#3F3F46] hover:border-[#00F0FF] text-zinc-300 hover:text-[#00F0FF] px-6 py-3 transition-all"
              >
                <Shield className="h-4 w-4" />
                Gamer Threat Report
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { icon: Gamepad2, label: 'Documented security grades' },
                { icon: Users,    label: 'Built for players' },
                { icon: Globe,    label: 'Africa-first perspective' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-zinc-500 text-sm">
                  <Icon className="h-4 w-4 text-[#00F0FF]" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: real data links — no unverifiable live counters */}
          <div className="bg-[#16161A] border border-[#27272A] p-6 space-y-5">
            <span className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
              What&apos;s here
            </span>

            <div className="space-y-3">
              <Link to="/games" className="block border border-[#27272A] p-4 hover:border-[#00F0FF] transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-200 text-sm font-medium">Security grades</span>
                  <span className="font-mono text-[#39FF14] text-sm">14 games &amp; platforms</span>
                </div>
                <p className="text-zinc-500 text-xs mt-1">Document-based guidance on account controls and breach history.</p>
              </Link>
              <Link to="/threats" className="block border border-[#27272A] p-4 hover:border-[#00F0FF] transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-200 text-sm font-medium">Gamer threat report</span>
                  <span className="font-mono text-[#39FF14] text-sm">1,741 CVEs triaged</span>
                </div>
                <p className="text-zinc-500 text-xs mt-1">Actively-exploited vulnerabilities mapped to what matters for players.</p>
              </Link>
              <Link to="/tools/gaming-security-checkup" className="block border border-[#27272A] p-4 hover:border-[#00F0FF] transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-200 text-sm font-medium">Protection checkup</span>
                  <span className="font-mono text-[#39FF14] text-sm">3 min</span>
                </div>
                <p className="text-zinc-500 text-xs mt-1">Self-reported checklist — three prioritized actions.</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
