import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Shield,
  Building2,
  TrendingUp,
  Clock,
  ExternalLink,
  Download,
  Activity,
  Globe,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThreatReport } from '@/types';

interface EnterpriseThreatReportProps {
  threat: ThreatReport;
  className?: string;
}

/**
 * Dark Reading-style enterprise threat report component
 * Features: Industry focus, enterprise impact, detailed mitigation, IOCs
 */
export function EnterpriseThreatReport({ threat, className }: EnterpriseThreatReportProps) {
  const severityConfig = {
    critical: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Critical' },
    high: { color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'High' },
    medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Medium' },
    low: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Low' },
    info: { color: 'text-gray-500', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'Info' }
  };

  const severity = severityConfig[threat.severity];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1000000);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Alert */}
      <Alert className={cn('border-2', severity.border, severity.bg)}>
        <AlertTriangle className={cn('h-5 w-5', severity.color)} />
        <AlertTitle className={cn('text-lg font-bold', severity.color)}>
          {severity.label} Threat: {threat.title}
        </AlertTitle>
        <AlertDescription className="mt-2">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Activity className="h-4 w-4" />
              {threat.threatType.replace('-', ' ').toUpperCase()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              First Seen: {new Date(threat.firstSeen).toLocaleDateString()}
            </span>
            <Badge variant={threat.status === 'active' ? 'destructive' : 'secondary'}>
              {threat.status.toUpperCase()}
            </Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed mb-4">{threat.description}</p>
          
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Confidence Level</div>
              <div className="text-2xl font-bold mb-2">{threat.confidence}%</div>
              <Progress value={threat.confidence} className="h-2" />
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Financial Impact</div>
              <div className="text-2xl font-bold">{formatCurrency(threat.impact.financial)}</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Affected Industries</div>
              <div className="text-2xl font-bold">{threat.affectedIndustries.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affected Industries & Systems */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Affected Industries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {threat.affectedIndustries.map((industry, idx) => (
                <Badge key={idx} variant="outline" className="text-sm">
                  {industry}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Affected Systems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {threat.affectedSystems.map((system, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {system}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Financial Impact
            </div>
            <p className="text-muted-foreground">{formatCurrency(threat.impact.financial)} estimated losses</p>
          </div>
          <div>
            <div className="font-semibold mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Operational Impact
            </div>
            <p className="text-muted-foreground">{threat.impact.operational}</p>
          </div>
          <div>
            <div className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Reputation Impact
            </div>
            <p className="text-muted-foreground">{threat.impact.reputation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: threat.technicalDetails }} />
          </div>
        </CardContent>
      </Card>

      {/* Indicators of Compromise (IOCs) */}
      {threat.indicators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Indicators of Compromise (IOCs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {threat.indicators.map((indicator, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{indicator.type.toUpperCase()}</Badge>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                      {indicator.value}
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground">{indicator.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mitigation Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recommended Mitigation Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {threat.mitigation.map((step, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </span>
                <span className="flex-1">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Attribution */}
      {threat.attribution && (
        <Card>
          <CardHeader>
            <CardTitle>Attribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Suspected attacker group: <span className="font-semibold">{threat.attribution}</span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Sources & References</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {threat.sources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                <span>{source.name}</span>
                <span className="text-muted-foreground">• {new Date(source.date).toLocaleDateString()}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download Full Report (PDF)
        </Button>
        <Button variant="outline">
          <ExternalLink className="h-4 w-4 mr-2" />
          Share Report
        </Button>
      </div>
    </div>
  );
}

