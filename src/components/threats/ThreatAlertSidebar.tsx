import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Cpu, HardDrive, Network, Shield, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NexusScoreBadge } from '@/components/nexus/NexusScoreBadge';
import { cn } from '@/lib/utils';

export interface ThreatAlert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  affectedHardware: ('cpu' | 'gpu' | 'network' | 'storage')[];
  description: string;
  publishedAt: string;
  nexusScore?: number;
  cvssScore?: number;
  guideUrl?: string;
  isActive: boolean;
}

interface ThreatAlertSidebarProps {
  alerts?: ThreatAlert[];
  maxAlerts?: number;
  className?: string;
}

const mockThreats: ThreatAlert[] = [
  {
    id: '1',
    title: 'GPU Side-Channel Attack: VRAM Data Leak',
    severity: 'critical',
    affectedHardware: ['gpu'],
    description: 'Web browsers can steal data from your VRAM through GPU side-channel attacks',
    publishedAt: new Date().toISOString(),
    nexusScore: 5,
    cvssScore: 9.1,
    guideUrl: '/guides/gpu-vram-protection',
    isActive: true,
  },
  {
    id: '2',
    title: 'Router Firmware Zero-Day Vulnerability',
    severity: 'high',
    affectedHardware: ['network'],
    description: 'Critical flaw in popular router firmware affecting home networks',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    nexusScore: 4,
    cvssScore: 8.5,
    guideUrl: '/guides/router-security-update',
    isActive: true,
  },
  {
    id: '3',
    title: 'Gaming Platform Data Breach',
    severity: 'high',
    affectedHardware: ['network'],
    description: 'Major gaming platform confirms data breach affecting user credentials',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    nexusScore: 4,
    cvssScore: 7.8,
    guideUrl: '/guides/account-security-hardening',
    isActive: true,
  },
];

const severityConfig = {
  critical: {
    badge: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    icon: AlertTriangle,
  },
  high: {
    badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    icon: AlertTriangle,
  },
  medium: {
    badge: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    icon: Shield,
  },
  low: {
    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    icon: Shield,
  },
  info: {
    badge: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    icon: Shield,
  },
};

const hardwareIcons = {
  cpu: Cpu,
  gpu: HardDrive,
  network: Network,
  storage: HardDrive,
};

export function ThreatAlertSidebar({ alerts = mockThreats, maxAlerts = 5, className }: ThreatAlertSidebarProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const activeAlerts = alerts.filter(a => a.isActive).slice(0, maxAlerts);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  if (activeAlerts.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Active Threats
          </CardTitle>
          <CardDescription>No active threats at this time</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Active Threats
            </CardTitle>
            <CardDescription>Real-time security alerts</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8"
          >
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeAlerts.map((alert) => {
          const severity = severityConfig[alert.severity];
          const SeverityIcon = severity.icon;

          return (
            <div
              key={alert.id}
              className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={cn('text-xs', severity.badge)}>
                      <SeverityIcon className="h-3 w-3 mr-1" />
                      {alert.severity.toUpperCase()}
                    </Badge>
                    {alert.nexusScore && (
                      <NexusScoreBadge nexusScore={alert.nexusScore} variant="compact" />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {alert.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {alert.affectedHardware.map((hw) => {
                    const Icon = hardwareIcons[hw];
                    return (
                      <div
                        key={hw}
                        className="p-1.5 rounded bg-muted"
                        title={hw.toUpperCase()}
                      >
                        <Icon className="h-3 w-3" />
                      </div>
                    );
                  })}
                </div>

                {alert.guideUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to={alert.guideUrl}>
                      Nexus Guide
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        <Button variant="outline" className="w-full" asChild>
          <Link to="/security">View All Threats</Link>
        </Button>
      </CardContent>
    </Card>
  );
}



