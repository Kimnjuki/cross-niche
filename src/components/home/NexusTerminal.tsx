import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';

interface Command {
  cmd: string;
  description: string;
  route: string;
}

const COMMANDS: Command[] = [
  { cmd: 'scan',   description: 'Scan live threat feed',        route: '/live-threat-dashboard' },
  { cmd: 'status', description: 'System & security status',     route: '/security' },
  { cmd: 'news',   description: 'Latest tech & gaming news',    route: '/tech' },
  { cmd: 'sim',    description: 'Launch breach simulation',     route: '/breach-sim' },
  { cmd: 'help',   description: 'Security tools & resources',   route: '/tools' },
];

export function NexusTerminal() {
  const navigate = useNavigate();
  const [active, setActive] = useState<string | null>(null);

  function handleCommand(cmd: Command) {
    setActive(cmd.cmd);
    setTimeout(() => {
      navigate(cmd.route);
      setActive(null);
    }, 300);
  }

  return (
    <div className="bg-[#050505] border border-[#27272A] p-5 font-mono animate-scanline">
      <div className="flex items-center gap-2 mb-4 border-b border-[#1A1A1A] pb-3">
        <Terminal className="h-4 w-4 text-[#39FF14]" />
        <span className="text-[#39FF14] text-xs">NEXUS TERMINAL v2.0</span>
        <span className="ml-auto flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14]" />
        </span>
      </div>

      <div className="space-y-1.5 mb-4">
        <p className="text-zinc-700 text-xs">{'>'} Connected to GridNexus Security Grid</p>
        <p className="text-zinc-700 text-xs">{'>'} Type a command or click below</p>
        <div className="flex items-center gap-0 text-xs">
          <span className="text-[#39FF14]">nexus@grid:~$</span>
          <span className="text-white ml-2 animate-blink">▊</span>
        </div>
      </div>

      <div className="space-y-1">
        {COMMANDS.map((cmd) => (
          <button
            key={cmd.cmd}
            onClick={() => handleCommand(cmd)}
            className={`w-full text-left flex items-center gap-3 px-2 py-1.5 text-xs transition-all duration-150 ${
              active === cmd.cmd
                ? 'bg-[#39FF14] text-black'
                : 'hover:bg-[rgba(57,255,20,0.08)] text-zinc-400 hover:text-[#39FF14]'
            }`}
          >
            <span className="text-zinc-700 w-4">{'>'}</span>
            <span className="text-[#00F0FF] w-10">{cmd.cmd}</span>
            <span className="text-zinc-600">—</span>
            <span>{cmd.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
