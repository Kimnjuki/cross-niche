import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  AlertTriangle,
  Search,
  FileText,
  Calendar,
  Users,
  DollarSign,
  Shield,
  ExternalLink,
  ArrowRight,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThreatReport } from '@/types';

interface InvestigativeBreachReportProps {
  threat: ThreatReport;
  className?: string;
}

/**
 * Krebs on Security-style investigative breach reporting component
 * Features: Deep investigation, timeline, attribution, detailed analysis
 */
export function InvestigativeBreachReport({ threat, className }: InvestigativeBreachReportProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1000000);
  };

  return (
    <div className={cn('space-y-8', className)}>
      {/* Header */}
      <div className="border-l-4 border-red-500 pl-6">
        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 mb-4">
          INVESTIGATIVE REPORT
        </Badge>
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
          {threat.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {threat.description}
        </p>
      </div>

      {/* Key Facts Alert */}
      <Alert className="bg-red-500/5 border-red-500/20">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <AlertTitle className="text-lg font-bold mb-2">Key Facts</AlertTitle>
        <AlertDescription>
          <div className="grid md:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="font-semibold mb-1">Estimated Financial Impact</div>
              <div className="text-2xl font-bold text-red-500">{formatCurrency(threat.impact.financial)}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Affected Organizations</div>
              <div className="text-2xl font-bold">{threat.affectedIndustries.length} industries</div>
            </div>
            <div>
              <div className="font-semibold mb-1">First Detected</div>
              <div>{new Date(threat.firstSeen).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Current Status</div>
              <Badge variant={threat.status === 'active' ? 'destructive' : 'secondary'}>
                {threat.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Investigation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Investigation Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative pl-8 border-l-2">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-red-500 border-2 border-background" />
              <div className="mb-1">
                <div className="font-semibold">Initial Discovery</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(threat.firstSeen).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <p className="text-muted-foreground mt-2">
                Threat first identified and reported by security researchers.
              </p>
            </div>

            <div className="relative pl-8 border-l-2">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-orange-500 border-2 border-background" />
              <div className="mb-1">
                <div className="font-semibold">Widespread Detection</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(threat.lastSeen).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <p className="text-muted-foreground mt-2">
                Multiple organizations across {threat.affectedIndustries.length} industries confirmed affected.
              </p>
            </div>

            {threat.status !== 'active' && (
              <div className="relative pl-8">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
                <div className="mb-1">
                  <div className="font-semibold">Mitigation Deployed</div>
                  <div className="text-sm text-muted-foreground">
                    {threat.updatedAt ? new Date(threat.updatedAt).toLocaleDateString() : 'Recent'}
                  </div>
                </div>
                <p className="text-muted-foreground mt-2">
                  Security measures implemented and threat contained.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deep Dive Investigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Deep Dive Investigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: threat.technicalDetails }} />
          </div>
        </CardContent>
      </Card>

      {/* Attribution Analysis */}
      {threat.attribution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Attribution Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-semibold mb-2">Suspected Attacker Group</div>
              <div className="text-2xl font-bold mb-4">{threat.attribution}</div>
              <div className="text-sm text-muted-foreground">
                Confidence Level: <span className="font-semibold text-foreground">{threat.confidence}%</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">
              Based on attack patterns, infrastructure, and technical indicators, security researchers
              have attributed this breach to the above group. Attribution confidence is based on
              multiple independent sources and technical analysis.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Impact Breakdown */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" />
              Financial Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500 mb-2">
              {formatCurrency(threat.impact.financial)}
            </div>
            <p className="text-sm text-muted-foreground">
              Estimated total financial losses across all affected organizations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5" />
              Operational Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {threat.affectedIndustries.length}
            </div>
            <p className="text-sm text-muted-foreground">
              Industries affected by this breach
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Reputation Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {threat.impact.reputation}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Indicators of Compromise */}
      {threat.indicators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Indicators of Compromise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {threat.indicators.map((indicator, idx) => (
                <div key={idx} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="font-mono">
                      {indicator.type.toUpperCase()}
                    </Badge>
                    <code className="text-sm font-mono bg-muted px-3 py-1 rounded">
                      {indicator.value}
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{indicator.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mitigation Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recommended Mitigation Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {threat.mitigation.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                  {idx + 1}
                </div>
                <div className="flex-1 pt-1">{step}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sources & References */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sources & References
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {threat.sources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex-1">
                  <div className="font-semibold group-hover:text-primary transition-colors">
                    {source.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(source.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Articles */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold mb-1">Want to stay updated?</div>
              <p className="text-sm text-muted-foreground">
                Subscribe to our threat intelligence newsletter
              </p>
            </div>
            <Button>
              Subscribe
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

