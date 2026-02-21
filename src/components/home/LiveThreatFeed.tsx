import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useConvexDisabled } from '@/components/SafeConvexProvider';

interface ThreatAlert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timeAgo: string;
}

// Mock threat data - in production, this would come from Supabase
const mockThreats: ThreatAlert[] = [
  { id: '1', title: 'New Zero-Day Exploit Targeting Gaming Platforms', severity: 'critical', timeAgo: '5m ago' },
  { id: '2', title: 'Enterprise Ransomware Campaign Detected', severity: 'high', timeAgo: '12m ago' },
  { id: '3', title: 'Critical Security Patch Released for Windows', severity: 'high', timeAgo: '1h ago' },
  { id: '4', title: 'New Phishing Campaign Targets Tech Companies', severity: 'medium', timeAgo: '2h ago' },
  { id: '5', title: 'Gaming Hardware Vulnerability Disclosure', severity: 'medium', timeAgo: '3h ago' },
];

const severityConfig = {
  critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Critical' },
  high: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'High' },
  medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Medium' },
  low: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Low' },
};

export function LiveThreatFeed() {
  const isDisabled = useConvexDisabled();
  const rows = useQuery(api.threatIntel.listFeed, isDisabled ? 'skip' : { limit: 5 });

  const threats: ThreatAlert[] = useMemo(() => {
    if (isDisabled) return mockThreats;
    if (!rows) return mockThreats;

    const now = Date.now();
    const toTimeAgo = (publishedAt: number) => {
      const diffMs = Math.max(0, now - publishedAt);
      const mins = Math.floor(diffMs / 60000);
      if (mins < 60) return `${Math.max(1, mins)}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    };

    return rows.map((r) => ({
      id: r._id,
      title: r.title,
      severity: r.severity,
      timeAgo: toTimeAgo(r.publishedAt),
    }));
  }, [isDisabled, rows]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (threats.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % threats.length);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, [threats.length]);

  return (
    <Card className="h-full border-security/20 bg-security/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="relative">
              <Shield className="h-5 w-5 text-security" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </div>
            Live Threat Feed
          </CardTitle>
          <Badge variant="outline" className="text-xs border-red-500/30 text-red-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3 max-h-[400px] overflow-hidden">
          {threats.map((threat, index) => {
            const severity = severityConfig[threat.severity];
            const isVisible = index === currentIndex || index === (currentIndex + 1) % threats.length;
            
            return (
              <div
                key={threat.id}
                className={cn(
                  'p-3 rounded-lg border transition-all duration-500',
                  severity.bg,
                  severity.border,
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <AlertTriangle className={cn('h-4 w-4 flex-shrink-0', severity.color)} />
                    <span className={cn('text-sm font-semibold line-clamp-2', severity.color)}>
                      {threat.title}
                    </span>
                  </div>
                  <Badge className={cn('text-xs flex-shrink-0', severity.color, 'bg-transparent border-current')}>
                    {severity.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono">{threat.timeAgo}</span>
                  <span className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated: Just now</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Monitoring
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

