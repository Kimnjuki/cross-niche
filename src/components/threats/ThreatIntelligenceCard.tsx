import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertTriangle,
  Shield,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Users,
  Building,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThreatReport } from '@/types';

interface ThreatIntelligenceCardProps {
  threat: ThreatReport;
  variant?: 'compact' | 'detailed' | 'alert';
  showActions?: boolean;
  className?: string;
}

const severityConfig = {
  critical: {
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-800',
    icon: AlertTriangle,
    label: 'Critical'
  },
  high: {
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
    icon: AlertTriangle,
    label: 'High'
  },
  medium: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: Shield,
    label: 'Medium'
  },
  low: {
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: Shield,
    label: 'Low'
  },
  info: {
    color: 'text-gray-600',
    bg: 'bg-gray-50 dark:bg-gray-950/20',
    border: 'border-gray-200 dark:border-gray-800',
    icon: Activity,
    label: 'Info'
  }
};

const threatTypeConfig = {
  malware: { icon: '🦠', label: 'Malware' },
  ransomware: { icon: '🔒', label: 'Ransomware' },
  phishing: { icon: '🎣', label: 'Phishing' },
  ddos: { icon: '🌊', label: 'DDoS' },
  'data-breach': { icon: '💥', label: 'Data Breach' },
  vulnerability: { icon: '🔓', label: 'Vulnerability' },
  'insider-threat': { icon: '👤', label: 'Insider Threat' }
};

export function ThreatIntelligenceCard({
  threat,
  variant = 'compact',
  showActions = true,
  className
}: ThreatIntelligenceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const severity = severityConfig[threat.severity];
  const threatType = threatTypeConfig[threat.threatType];
  const SeverityIcon = severity.icon;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1000000); // Convert millions to actual amount
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (variant === 'alert') {
    return (
      <Alert className={cn(severity.border, severity.bg)}>
        <SeverityIcon className={cn('h-4 w-4', severity.color)} />
        <AlertDescription className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{threatType.icon}</span>
              <Badge variant="outline" className={severity.color}>
                {severity.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {threatType.label}
              </span>
            </div>
            <h4 className="font-semibold mb-1">{threat.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {threat.description}
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-4">
            View Details
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardHeader className={cn(severity.bg, severity.border)}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', severity.bg)}>
                <span className="text-2xl">{threatType.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={cn(severity.color, 'bg-transparent border-current')}>
                    <SeverityIcon className="h-3 w-3 mr-1" />
                    {severity.label}
                  </Badge>
                  <Badge variant="outline">
                    {threatType.label}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{threat.title}</CardTitle>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <Clock className="h-3 w-3" />
                <span>{getTimeAgo(threat.lastSeen)}</span>
              </div>
              <Badge variant={threat.status === 'active' ? 'destructive' : 'secondary'}>
                {threat.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{threat.description}</p>

          {/* Impact Assessment */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold text-red-600">
                {formatCurrency(threat.impact.financial)}
              </div>
              <div className="text-sm text-muted-foreground">Est. Financial Impact</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{threat.affectedIndustries.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">Industries Affected</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-lg font-bold">{threat.confidence}%</div>
              <div className="text-sm text-muted-foreground">Confidence Level</div>
            </div>
          </div>

          {/* Affected Systems & Industries */}
          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Affected Systems</h4>
              <div className="flex flex-wrap gap-1">
                {threat.affectedSystems.map((system, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {system}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Affected Industries</h4>
              <div className="flex flex-wrap gap-1">
                {threat.affectedIndustries.map((industry, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div>
            <h4 className="font-medium mb-2">Technical Details</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {threat.technicalDetails}
            </p>
            {threat.technicalDetails.length > 150 && (
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </div>

          {/* Mitigation Steps */}
          <div>
            <h4 className="font-medium mb-2">Recommended Mitigation</h4>
            <ul className="text-sm space-y-1">
              {threat.mitigation.slice(0, expanded ? undefined : 3).map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Indicators of Compromise */}
          {threat.indicators.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Indicators of Compromise</h4>
              <div className="space-y-2">
                {threat.indicators.slice(0, expanded ? undefined : 2).map((indicator, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                    <div>
                      <span className="font-medium capitalize">{indicator.type}:</span>
                      <code className="ml-1 text-xs">{indicator.value}</code>
                    </div>
                    <span className="text-muted-foreground">{indicator.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attribution */}
          {threat.attribution && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <Shield className="h-4 w-4 text-yellow-600" />
              <div>
                <div className="text-sm font-medium">Suspected Attribution</div>
                <div className="text-sm text-muted-foreground">{threat.attribution}</div>
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1">
                Read Full Report
              </Button>
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Sources
              </Button>
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Track
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Compact variant (default)
  return (
    <Card className={cn('overflow-hidden hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', severity.bg)}>
              <span className="text-xl">{threatType.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={cn(severity.color, 'bg-transparent border-current text-xs')}>
                  {severity.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {threatType.label}
                </span>
              </div>
              <CardTitle className="text-lg leading-tight line-clamp-2">
                {threat.title}
              </CardTitle>
            </div>
          </div>
          <Badge variant={threat.status === 'active' ? 'destructive' : 'secondary'}>
            {threat.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {threat.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{getTimeAgo(threat.lastSeen)}</span>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{threat.affectedIndustries.length} industries</span>
          </div>
        </div>

        {threat.impact.financial > 0 && (
          <div className="flex items-center gap-1 text-sm mb-3">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span className="text-red-600 font-medium">
              {formatCurrency(threat.impact.financial)} estimated impact
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            View Details
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}