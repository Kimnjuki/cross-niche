import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, BookOpen, Bug, ClipboardCheck, ChevronRight } from 'lucide-react';

type Rank = 'Novice' | 'Guardian' | 'Sentinel' | 'Architect' | 'Legend';

interface RankConfig {
  label: Rank;
  color: string;
  xpRequired: number;
}

const RANKS: RankConfig[] = [
  { label: 'Novice',    color: '#71717A', xpRequired: 0     },
  { label: 'Guardian',  color: '#3B82F6', xpRequired: 500   },
  { label: 'Sentinel',  color: '#8B5CF6', xpRequired: 1500  },
  { label: 'Architect', color: '#F59E0B', xpRequired: 4000  },
  { label: 'Legend',    color: '#EF4444', xpRequired: 10000 },
];

const DEMO_XP = 420;

function getCurrentRank(xp: number): RankConfig {
  return [...RANKS].reverse().find((r) => xp >= r.xpRequired) ?? RANKS[0];
}

function getNextRank(xp: number): RankConfig | null {
  return RANKS.find((r) => xp < r.xpRequired) ?? null;
}

export function SecurityRankWidget() {
  const xp = DEMO_XP;
  const current = getCurrentRank(xp);
  const next = getNextRank(xp);
  const progress = next
    ? Math.round(((xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) * 100)
    : 100;

  return (
    <div className="bg-[#16161A] border border-[#27272A] p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4" style={{ color: current.color }} />
          <h3 className="font-display font-bold text-sm text-white">Security Rank</h3>
        </div>
        <Link to="/breach-sim" className="text-[10px] font-mono text-[#00F0FF] flex items-center gap-1 hover:text-[#00D4E6]">
          Earn XP <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Rank badge */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 flex items-center justify-center border"
          style={{ borderColor: current.color, color: current.color }}
        >
          <span className="font-mono font-bold text-lg">{current.label[0]}</span>
        </div>
        <div>
          <div className="font-display font-bold text-white" style={{ color: current.color }}>
            {current.label}
          </div>
          <div className="font-mono text-[10px] text-zinc-600">{xp} XP earned</div>
        </div>
      </div>

      {/* XP progress bar */}
      {next && (
        <div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-600 mb-1.5">
            <span>{xp} XP</span>
            <span>{next.xpRequired} XP → {next.label}</span>
          </div>
          <div className="h-1.5 bg-[#27272A] w-full">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: current.color }}
            />
          </div>
        </div>
      )}

      {/* How to earn XP */}
      <div className="border-t border-[#27272A] pt-4 space-y-2">
        <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider mb-2">How to earn XP</p>
        {[
          { icon: BookOpen,      label: 'Read threat intel',        xp: '+10 XP' },
          { icon: Bug,           label: 'Run breach simulations',   xp: '+50 XP' },
          { icon: ClipboardCheck, label: 'Complete security audits', xp: '+25 XP' },
        ].map(({ icon: Icon, label, xp: earn }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Icon className="h-3.5 w-3.5 text-zinc-600" />
              {label}
            </div>
            <span className="font-mono text-[10px] text-[#39FF14]">{earn}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
