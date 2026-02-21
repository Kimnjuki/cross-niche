/**
 * TheGridNexus GridSignal - Real-Time Threat Intelligence Feed
 * NF-001: Live auto-updating feed of CVEs, breaches, and threat actor activity
 */

import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Shield, Activity, Clock, ExternalLink, Filter, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ThreatItem {
  id: string;
  type: 'cve' | 'breach' | 'threat_actor';
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  timestamp: string;
  url?: string;
  cvss?: number;
  affectedSystems?: string[];
  actor?: string;
}

const mockThreatData: ThreatItem[] = [
  {
    id: '1',
    type: 'cve',
    title: 'CVE-2024-21413: Microsoft Outlook Remote Code Execution',
    description: 'Critical vulnerability in Microsoft Outlook allows remote code execution via specially crafted email.',
    severity: 'critical',
    source: 'NVD',
    timestamp: new Date().toISOString(),
    url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-21413',
    cvss: 9.8,
    affectedSystems: ['Microsoft Outlook', 'Microsoft 365']
  },
  {
    id: '2',
    type: 'breach',
    title: 'Change Healthcare Data Breach Affects 100M+',
    description: 'Major healthcare breach exposes sensitive patient data including medical records and insurance information.',
    severity: 'critical',
    source: 'HIBP',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    url: 'https://haveibeenpwned.com/ChangeHealthcare',
    affectedSystems: ['Change Healthcare', 'UnitedHealth Group']
  },
  {
    id: '3',
    type: 'threat_actor',
    title: 'APT29 Activity Increases Against European Diplomatic Targets',
    description: 'Russian state-sponsored group intensifies phishing campaigns targeting diplomatic organizations.',
    severity: 'high',
    source: 'CISA KEV',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    actor: 'APT29 (Cozy Bear)',
    affectedSystems: ['Government Systems', 'Diplomatic Networks']
  },
  {
    id: '4',
    type: 'cve',
    title: 'Apache Struts2 RCE Vulnerability (CVE-2024-53677)',
    description: 'Remote code execution vulnerability in Apache Struts2 framework affects thousands of web applications.',
    severity: 'high',
    source: 'NVD',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    url: 'https://nvd.nist.gov/vuln/detail/CVE-2024-53677',
    cvss: 8.5,
    affectedSystems: ['Apache Struts2', 'Java Web Applications']
  }
];

export function GridSignal() {
  const [threats, setThreats] = useState<ThreatItem[]>(mockThreatData);
  const [filteredThreats, setFilteredThreats] = useState<ThreatItem[]>(mockThreatData);
  const [isLive, setIsLive] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'cve' | 'breach' | 'threat_actor'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newThreat: ThreatItem = {
        id: Date.now().toString(),
        type: ['cve', 'breach', 'threat_actor'][Math.floor(Math.random() * 3)] as ThreatItem['type'],
        title: `New ${['CVE', 'Breach', 'Threat'][Math.floor(Math.random() * 3)]} Alert: ${Math.random().toString(36).substring(7)}`,
        description: 'Real-time threat intelligence update from TheGridNexus threat feed.',
        severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as ThreatItem['severity'],
        source: ['NVD', 'CISA KEV', 'AlienVault OTX'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toISOString()
      };

      setThreats(prev => [newThreat, ...prev].slice(0, 50));
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  // Apply filters
  useEffect(() => {
    let filtered = threats;

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(threat => threat.type === selectedFilter);
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(threat => threat.severity === selectedSeverity);
    }

    setFilteredThreats(filtered);
  }, [threats, selectedFilter, selectedSeverity]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-threat-red text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cve': return <AlertTriangle className="w-4 h-4" />;
      case 'breach': return <Shield className="w-4 h-4" />;
      case 'threat_actor': return <Activity className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-nexus-blue/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-nexus-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display">GridSignal</h1>
                <p className="text-sm text-muted-foreground">Real-Time Threat Intelligence Feed</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-security-green animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm">{isLive ? 'LIVE' : 'PAUSED'}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLive(!isLive)}
              >
                {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <Tabs value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Threats</TabsTrigger>
              <TabsTrigger value="cve">CVEs</TabsTrigger>
              <TabsTrigger value="breach">Breaches</TabsTrigger>
              <TabsTrigger value="threat_actor">Threat Actors</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-4 mt-4">
            <span className="text-sm font-medium">Severity:</span>
            <div className="flex gap-2">
              {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
                <Button
                  key={severity}
                  variant={selectedSeverity === severity ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSeverity(severity as any)}
                >
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Threat Feed */}
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-black/90 border-green-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-400 font-mono text-sm">
                $ gridsignal --feed --realtime --severity {selectedSeverity === 'all' ? 'all' : selectedSeverity}
              </CardTitle>
              <Badge variant="outline" className="text-green-400 border-green-500/30">
                {filteredThreats.length} items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px] p-4" ref={scrollAreaRef}>
              <div className="space-y-3 font-mono text-sm">
                {filteredThreats.map((threat, index) => (
                  <div
                    key={threat.id}
                    className="border border-green-500/20 rounded-lg p-4 bg-black/50 hover:bg-black/70 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(threat.type)}
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <span className="text-green-400 text-xs">
                            [{formatTimestamp(threat.timestamp)}]
                          </span>
                        </div>
                        <h3 className="text-green-300 font-semibold mb-1">
                          {threat.title}
                        </h3>
                        <p className="text-green-100/70 text-sm mb-2">
                          {threat.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-green-400/60">
                          <span>Source: {threat.source}</span>
                          {threat.cvss && <span>CVSS: {threat.cvss}</span>}
                          {threat.actor && <span>Actor: {threat.actor}</span>}
                        </div>
                        {threat.affectedSystems && (
                          <div className="mt-2">
                            <span className="text-xs text-green-400/60">Affected: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {threat.affectedSystems.map((system, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-green-500/30">
                                  {system}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {threat.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="text-green-400 hover:text-green-300"
                        >
                          <a href={threat.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            GridSignal pulls from NVD CVE database, CISA KEV Catalog, and AlienVault OTX.
            {' '}
            <Badge variant="outline" className="ml-2">
              10 items free • Unlimited for registered users
            </Badge>
          </p>
        </div>
      </div>
    </div>
  );
}
