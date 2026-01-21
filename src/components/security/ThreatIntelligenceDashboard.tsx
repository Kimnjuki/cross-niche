import { useState } from 'react';
import { Shield, AlertTriangle, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Threat {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  timestamp: string;
  source?: string;
  affected?: string[];
}

// Mock threat data - in production, this would come from an API
const mockThreats: Threat[] = [
  {
    id: '1',
    title: 'Zero-Day Vulnerability in Cloud Infrastructure',
    severity: 'critical',
    category: 'Cloud Security',
    description: 'New zero-day exploit discovered affecting major cloud providers. Immediate patching recommended.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: 'CVE Database',
    affected: ['AWS', 'Azure', 'GCP'],
  },
  {
    id: '2',
    title: 'Ransomware Campaign Targeting Healthcare',
    severity: 'high',
    category: 'Ransomware',
    description: 'Sophisticated ransomware group targeting healthcare institutions with new encryption methods.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    source: 'Dark Reading',
  },
  {
    id: '3',
    title: 'API Security Breach in Financial Services',
    severity: 'high',
    category: 'Data Breach',
    description: 'Multiple financial institutions report API vulnerabilities exposing customer data.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: 'The Hacker News',
  },
  {
    id: '4',
    title: 'Phishing Campaign Using AI-Generated Content',
    severity: 'medium',
    category: 'Social Engineering',
    description: 'New AI-powered phishing emails bypass traditional security filters with high success rates.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

const severityConfig = {
  critical: { color: 'bg-destructive', text: 'text-destructive', label: 'Critical' },
  high: { color: 'bg-orange-500', text: 'text-orange-500', label: 'High' },
  medium: { color: 'bg-yellow-500', text: 'text-yellow-500', label: 'Medium' },
  low: { color: 'bg-blue-500', text: 'text-blue-500', label: 'Low' },
};

export function ThreatIntelligenceDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', ...Array.from(new Set(mockThreats.map(t => t.category)))];

  const filteredThreats = selectedCategory === 'all'
    ? mockThreats
    : mockThreats.filter(t => t.category === selectedCategory);

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  return (
    <Card className="border-security/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-security/10">
              <Shield className="h-5 w-5 text-security" />
            </div>
            <div>
              <CardTitle className="text-xl">Threat Intelligence</CardTitle>
              <p className="text-sm text-muted-foreground">Real-time cybersecurity threats and vulnerabilities</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.slice(1).map(cat => (
              <TabsTrigger key={cat} value={cat}>
                {cat.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredThreats.map((threat) => {
              const severity = severityConfig[threat.severity];
              return (
                <div
                  key={threat.id}
                  className={cn(
                    'p-4 rounded-lg border transition-all hover:shadow-md',
                    'border-border bg-card'
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn(severity.color, 'text-white')}>
                          {severity.label}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {threat.category}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{threat.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {threat.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(threat.timestamp)}
                      </div>
                      {threat.source && (
                        <span className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          {threat.source}
                        </span>
                      )}
                    </div>
                    {threat.affected && threat.affected.length > 0 && (
                      <div className="flex gap-1">
                        {threat.affected.slice(0, 2).map((aff, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {aff}
                          </Badge>
                        ))}
                        {threat.affected.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{threat.affected.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" className="w-full" asChild>
              <a href="/security" target="_self">
                View All Cybersecurity News
              </a>
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

