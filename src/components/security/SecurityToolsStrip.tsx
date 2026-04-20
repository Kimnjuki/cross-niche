import { Link } from 'react-router-dom';
import { Shield, Target, Zap, Activity, Gamepad2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const tools = [
  {
    href: '/tools/nexusguard',
    icon: Shield,
    label: 'NexusGuard',
    sub: 'Threat assessment',
    color: 'text-security hover:bg-security/10 border-security/20',
  },
  {
    href: '/tools/steam-scanner',
    icon: Gamepad2,
    label: 'Steam Scanner',
    sub: 'Account security',
    color: 'text-gaming hover:bg-gaming/10 border-gaming/20',
  },
  {
    href: '/breach-sim',
    icon: Target,
    label: 'Breach Sim',
    sub: 'Attack scenarios',
    color: 'text-tech hover:bg-tech/10 border-tech/20',
  },
  {
    href: '/security-score',
    icon: Zap,
    label: 'Security Score',
    sub: 'Personal assessment',
    color: 'text-yellow-500 hover:bg-yellow-500/10 border-yellow-500/20',
  },
  {
    href: '/live-threat-dashboard',
    icon: Activity,
    label: 'Live Threats',
    sub: 'Real-time feed',
    color: 'text-destructive hover:bg-destructive/10 border-destructive/20',
  },
];

interface SecurityToolsStripProps {
  className?: string;
  heading?: string;
}

export function SecurityToolsStrip({ className, heading = 'Interactive Security Tools' }: SecurityToolsStripProps) {
  return (
    <div className={cn('rounded-xl border bg-muted/30 p-4', className)}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold">{heading}</p>
        <Link
          to="/tools"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          All tools <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              to={t.href}
              className={cn(
                'flex flex-col gap-1 rounded-lg border p-3 transition-colors',
                t.color
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-semibold leading-tight">{t.label}</span>
              <span className="text-xs text-muted-foreground leading-tight">{t.sub}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
