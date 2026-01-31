/**
 * Grid Nexus 2026 – GlobalPulseSidebar
 * Sticky left rail: default 64px (icons only), hover 280px with real-time text.
 * Threat Radar, AI Pulse, Gaming Ticker. backdrop-blur-xl, 1px border-r.
 */

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Cpu, Gamepad2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const RAIL_WIDTH_SLIM = 64;
const RAIL_WIDTH_EXPANDED = 280;

interface TickerItem {
  id: string;
  text: string;
  href?: string;
  time?: string;
}

interface GlobalPulseSidebarProps {
  /** Threat Radar items (security) */
  threatItems?: TickerItem[];
  /** AI Pulse items */
  aiPulseItems?: TickerItem[];
  /** Gaming Ticker items */
  gamingItems?: TickerItem[];
  className?: string;
}

const defaultThreats: TickerItem[] = [
  { id: '1', text: 'CVE-2024-3400 patch deployed', href: '/security', time: '2m ago' },
  { id: '2', text: 'Phishing spike in finance sector', href: '/security', time: '12m ago' },
  { id: '3', text: 'Zero-day advisory: update recommended', href: '/security', time: '1h ago' },
];

const defaultAiPulse: TickerItem[] = [
  { id: '1', text: 'Nexus AI: 3 cross-pillar links found', href: '/nexus-intersection', time: 'Live' },
  { id: '2', text: 'Personalized feed updated', time: '5m ago' },
  { id: '3', text: 'Trending: AI regulation', href: '/tech', time: '15m ago' },
];

const defaultGaming: TickerItem[] = [
  { id: '1', text: 'New release: CyberPunk 2.1 patch', href: '/gaming', time: '30m ago' },
  { id: '2', text: 'Esports: Finals this weekend', href: '/gaming', time: '1h ago' },
  { id: '3', text: 'Hardware: GPU restock alert', href: '/reviews', time: '2h ago' },
];

export function GlobalPulseSidebar({
  threatItems = defaultThreats,
  aiPulseItems = defaultAiPulse,
  gamingItems = defaultGaming,
  className,
}: GlobalPulseSidebarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen shrink-0 overflow-hidden',
        'backdrop-blur-xl border-r border-[var(--nexus-border)]',
        'flex flex-col',
        'bg-[var(--nexus-surface)]',
        className
      )}
      initial={false}
      animate={{ width: expanded ? RAIL_WIDTH_EXPANDED : RAIL_WIDTH_SLIM }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      aria-label="Global pulse sidebar"
    >
      {/* Threat Radar */}
      <Section
        expanded={expanded}
        icon={<Shield className="h-5 w-5 shrink-0 text-[var(--nexus-accent-security)]" />}
        label="Threat Radar"
        items={threatItems}
        accentClass="text-[var(--nexus-accent-security)]"
      />
      {/* AI Pulse */}
      <Section
        expanded={expanded}
        icon={<Cpu className="h-5 w-5 shrink-0 text-[var(--nexus-accent-tech)]" />}
        label="AI Pulse"
        items={aiPulseItems}
        accentClass="text-[var(--nexus-accent-tech)]"
      />
      {/* Gaming Ticker */}
      <Section
        expanded={expanded}
        icon={<Gamepad2 className="h-5 w-5 shrink-0 text-[var(--nexus-accent-gaming)]" />}
        label="Gaming Ticker"
        items={gamingItems}
        accentClass="text-[var(--nexus-accent-gaming)]"
      />
    </motion.aside>
  );
}

function Section({
  expanded,
  icon,
  label,
  items,
  accentClass,
}: {
  expanded: boolean;
  icon: ReactNode;
  label: string;
  items: TickerItem[];
  accentClass: string;
}) {
  return (
    <div className="border-b border-[var(--nexus-border)] last:border-b-0">
      <div className="flex items-center gap-3 px-4 py-3 min-h-[56px]">
        <span className="flex items-center justify-center w-8 h-8 shrink-0" aria-hidden>
          {icon}
        </span>
        <AnimatePresence>
          {expanded && (
            <motion.span
              className={cn('font-display font-semibold text-sm whitespace-nowrap', accentClass)}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.ul
            className="px-4 pb-3 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {items.map((item) => (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    to={item.href}
                    className="block text-xs text-muted-foreground hover:text-foreground line-clamp-2 py-0.5 transition-colors"
                  >
                    {item.text}
                    {item.time && <span className="ml-1 opacity-70">· {item.time}</span>}
                  </Link>
                ) : (
                  <span className="block text-xs text-muted-foreground line-clamp-2 py-0.5">
                    {item.text}
                    {item.time && <span className="ml-1 opacity-70">· {item.time}</span>}
                  </span>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
