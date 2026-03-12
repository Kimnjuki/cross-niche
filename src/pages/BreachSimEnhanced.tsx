/**
 * TheGridNexus Enhanced Breach & Attack Simulation Page
 * Interactive demos, expert reviews, and comprehensive BAS platform analysis
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { SchemaMarkup, useArticleSchema } from '@/components/seo/SchemaMarkup';
import { OpenGraph, useArticleOpenGraph } from '@/components/seo/OpenGraph';
import { AdPlacement } from '@/components/ads/AdPlacement';
import { 
  Shield, 
  Activity, 
  Play, 
  Download, 
  Star, 
  Users, 
  Clock,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Code,
  Monitor,
  Lock,
  Unlock,
  Eye,
  TrendingUp,
  Award,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BASPlatform {
  id: string;
  name: string;
  description: string;
  category: 'enterprise' | 'mid-market' | 'startup';
  pricing: {
    model: string;
    startingPrice: string;
    enterprise: boolean;
  };
  features: string[];
  pros: string[];
  cons: string[];
  rating: number;
  reviewCount: number;
  integrations: string[];
  deploymentOptions: string[];
  bestFor: string[];
  logo: string;
  website: string;
  demoAvailable: boolean;
}

interface AttackScenario {
  id: string;
  name: string;
  description: string;
  category: 'phishing' | 'malware' | 'lateral-movement' | 'data-exfiltration' | 'privilege-escalation';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites: string[];
  steps: string[];
  tools: string[];
  mitreTactics: string[];
}

const basPlatforms: BASPlatform[] = [
  {
    id: '1',
    name: 'AttackIQ',
    description: 'Enterprise-grade BAS platform with comprehensive attack simulation and automated red team capabilities.',
    category: 'enterprise',
    pricing: {
      model: 'Quote-based',
      startingPrice: '$25,000/year',
      enterprise: true
    },
    features: [
      '1000+ attack scenarios',
      'MITRE ATT&CK mapping',
      'Automated reporting',
      'SIEM integration',
      'Custom scenario builder'
    ],
    pros: [
      'Extensive scenario library',
      'Enterprise support',
      'Advanced analytics',
      'Regular updates'
    ],
    cons: [
      'High cost',
      'Complex setup',
      'Requires dedicated staff'
    ],
    rating: 4.7,
    reviewCount: 124,
    integrations: ['Splunk', 'IBM QRadar', 'Microsoft Sentinel', 'Palo Alto Networks'],
    deploymentOptions: ['Cloud', 'On-premise', 'Hybrid'],
    bestFor: ['Large enterprises', 'Government agencies', 'Financial institutions'],
    logo: 'https://images.unsplash.com/photo-1611224923853-80f0d7f8415e?w=100&h=100&fit=crop',
    website: 'https://attackiq.com',
    demoAvailable: true
  },
  {
    id: '2',
    name: 'SafeBreach',
    description: 'User-friendly BAS platform focused on continuous security validation and automated testing.',
    category: 'mid-market',
    pricing: {
      model: 'Tiered',
      startingPrice: '$15,000/year',
      enterprise: false
    },
    features: [
      '500+ attack scenarios',
      'Real-time monitoring',
      'Risk assessment',
      'Compliance reporting',
      'Mobile app support'
    ],
    pros: [
      'Easy to use',
      'Good value',
      'Strong customer support',
      'Regular updates'
    ],
    cons: [
      'Limited customization',
      'Fewer integrations',
      'Scalability limits'
    ],
    rating: 4.5,
    reviewCount: 89,
    integrations: ['Splunk', 'Azure Sentinel', 'AWS Security Hub'],
    deploymentOptions: ['Cloud', 'SaaS'],
    bestFor: ['Mid-sized companies', 'MSSPs', 'Security teams'],
    logo: 'https://images.unsplash.com/photo-1557829219-1b6a2e4c0a3c?w=100&h=100&fit=crop',
    website: 'https://safebreach.com',
    demoAvailable: true
  },
  {
    id: '3',
    name: 'Cymulate',
    description: 'Innovative BAS platform with purple team simulation and advanced threat emulation.',
    category: 'mid-market',
    pricing: {
      model: 'Per-user',
      startingPrice: '$200/user/month',
      enterprise: false
    },
    features: [
      'Advanced threat emulation',
      'Purple team exercises',
      'Custom attack chains',
      'API access',
      'DevOps integration'
    ],
    pros: [
      'Flexible pricing',
      'Advanced features',
      'Good documentation',
      'Active community'
    ],
    cons: [
      'Newer platform',
      'Limited enterprise features',
      'Learning curve'
    ],
    rating: 4.3,
    reviewCount: 56,
    integrations: ['CrowdStrike', 'Okta', 'Cisco', 'Microsoft 365'],
    deploymentOptions: ['Cloud', 'Hybrid'],
    bestFor: ['Tech companies', 'Startups', 'DevSecOps teams'],
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    website: 'https://cymulate.io',
    demoAvailable: true
  }
];

const attackScenarios: AttackScenario[] = [
  {
    id: '1',
    name: 'Spear Phishing Attack Simulation',
    description: 'Simulate targeted phishing attacks to test employee awareness and email security controls.',
    category: 'phishing',
    difficulty: 'basic',
    estimatedTime: '30 minutes',
    prerequisites: ['Basic email knowledge', 'Understanding of social engineering'],
    steps: [
      'Create phishing email templates',
      'Set up landing pages',
      'Configure email delivery',
      'Monitor click rates',
      'Analyze results'
    ],
    tools: ['Social Engineer Toolkit', 'GoPhish', 'King Phisher'],
    mitreTactics: ['TA0001', 'TA0002', 'TA0003']
  },
  {
    id: '2',
    name: 'Ransomware Attack Chain',
    description: 'Complete ransomware attack simulation from initial access to encryption and ransom demand.',
    category: 'malware',
    difficulty: 'advanced',
    estimatedTime: '2 hours',
    prerequisites: ['Malware analysis', 'Network security knowledge', 'Incident response experience'],
    steps: [
      'Initial access simulation',
      'Privilege escalation',
      'Lateral movement',
      'Data exfiltration',
      'Ransomware deployment',
      'Impact assessment'
    ],
    tools: ['Cobalt Strike', 'Mimikatz', 'PowerShell Empire', 'Custom ransomware builder'],
    mitreTactics: ['TA0001', 'TA0006', 'TA0008', 'TA0029']
  }
];

export default function BreachSimEnhanced() {
  const [selectedPlatform, setSelectedPlatform] = useState<BASPlatform | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<AttackScenario | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'platforms' | 'scenarios' | 'comparison'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'enterprise' | 'mid-market' | 'startup'>('all');

  const filteredPlatforms = basPlatforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         platform.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || platform.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const schemaData = useArticleSchema({
    headline: 'Breach & Attack Simulation (BAS) Guide 2026 | The Grid Nexus',
    description: 'Comprehensive guide to Breach and Attack Simulation (BAS). Compare top platforms, learn implementation strategies, and discover how BAS strengthens your security posture.',
    image: 'https://thegridnexus.com/og-breach-sim.jpg',
    url: 'https://thegridnexus.com/breach-sim',
    datePublished: '2026-02-24',
    dateModified: '2026-02-24',
    category: 'Cybersecurity Tools',
    tags: ['breach and attack simulation', 'BAS platform', 'security testing automation', 'penetration testing tools'],
    wordCount: 2500,
    customFields: {
      isAccessibleForFree: true,
      audience: 'Security Professionals and IT Managers',
      about: 'Cybersecurity Testing and Validation'
    }
  });

  return (
    <Layout>
      <SEOHead
        title="Breach & Attack Simulation (BAS) Guide 2026 | The Grid Nexus"
        description="Comprehensive guide to Breach and Attack Simulation (BAS). Compare top platforms, learn implementation strategies, and discover how BAS strengthens your security posture."
        keywords={[
          'breach and attack simulation',
          'BAS platform',
          'security testing automation',
          'penetration testing tools',
          'cybersecurity simulation',
          'what is breach and attack simulation and how does it work',
          'best breach and attack simulation tools 2026',
          'breach and attack simulation vs penetration testing comparison'
        ]}
        url="https://thegridnexus.com/breach-sim"
        type="website"
      />
      
      <SchemaMarkup type="Article" data={schemaData} />
      <SchemaMarkup type="TechArticle" data={{
        headline: "Breach and Attack Simulation Technology Guide",
        description: "Complete BAS platform analysis and implementation guide",
        author: {
          name: "The Grid Nexus Security Team",
          type: "Organization"
        }
      }} />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-red-900 via-gray-900 to-black text-white">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Shield className="w-12 h-12" />
                <h1 className="font-display font-bold text-5xl">Breach & Attack Simulation</h1>
              </div>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Master BAS platforms and automated security testing. Compare tools, 
                run simulations, and strengthen your security posture with expert guidance.
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center justify-center gap-8 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>{basPlatforms.length} Platforms Reviewed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>4.5 Avg Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>{attackScenarios.length} Attack Scenarios</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>10K+ Security Teams</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search BAS platforms, attack scenarios, or features..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="border-b border-border bg-muted/30 sticky top-0 z-40">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="platforms">Platforms</TabsTrigger>
                <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Ad Placement */}
        <AdPlacement 
          position="header" 
          contentLength={3000}
          hasSubstantialContent={true}
        />

        {/* Tab Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <TabsContent value="overview" className="space-y-8">
              {/* What is BAS Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    What is Breach & Attack Simulation?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg leading-relaxed">
                    Breach and Attack Simulation (BAS) is an automated security testing approach that 
                    continuously validates your security controls by simulating real-world attack scenarios. 
                    Unlike traditional penetration testing, BAS runs 24/7, providing continuous 
                    assurance that your defenses are working as expected.
                  </p>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Industry Growth</AlertTitle>
                    <AlertDescription>
                      The BAS market is growing at 35% annually, with enterprise adoption increasing 
                      from 15% in 2023 to projected 45% by 2026.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold mb-3">Key Benefits</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                          <span>Continuous security validation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                          <span>MITRE ATT&CK framework alignment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                          <span>Automated reporting and metrics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-security-green mt-0.5 flex-shrink-0" />
                          <span>Compliance validation</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Common Use Cases</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-nexus-blue mt-0.5 flex-shrink-0" />
                          <span>Security control validation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-nexus-blue mt-0.5 flex-shrink-0" />
                          <span>Incident response testing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-nexus-blue mt-0.5 flex-shrink-0" />
                          <span>Compliance reporting</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-nexus-blue mt-0.5 flex-shrink-0" />
                          <span>Security awareness training</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Demo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Play className="w-6 h-6" />
                    Try BAS Simulation
                  </CardTitle>
                  <CardDescription>
                    Experience a simplified breach and attack simulation in your browser
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/90 rounded-lg p-6 text-green-400 font-mono">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span>$</span>
                        <span className="text-white">simulate-breach --target corporate.local --scenario phishing</span>
                      </div>
                      <div className="text-sm opacity-70">Initializing simulation engine...</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>Scanning target: corporate.local</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Testing email security controls...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span>Sending phishing simulation...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Unlock className="w-4 h-4" />
                        <span>Simulating credential theft...</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-green-400/30">
                      <div className="text-yellow-400">
                        <span className="mb-2">SIMULATION RESULTS:</span>
                        <div>✓ Email controls bypassed</div>
                        <div>✓ User credentials compromised</div>
                        <div>⚠️ 2FA blocked lateral movement</div>
                        <div>📊 Risk Score: HIGH</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <Button className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      Run Full Simulation
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platforms" className="space-y-6">
              {/* Filter Controls */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Category:</span>
                <div className="flex gap-2">
                  {['all', 'enterprise', 'mid-market', 'startup'].map((category) => (
                    <Button
                      key={category}
                      variant={filterCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterCategory(category as any)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Platform Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlatforms.map((platform) => (
                  <Card key={platform.id} className="hover:shadow-lg transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <img 
                          src={platform.logo} 
                          alt={platform.name}
                          className="w-12 h-12 rounded-lg"
                        />
                        <Badge className={platform.category === 'enterprise' ? 'bg-nexus-blue' : 'bg-security-green'}>
                          {platform.category.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-2">{platform.name}</CardTitle>
                      <CardDescription>{platform.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{platform.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({platform.reviewCount} reviews)
                        </span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">{platform.pricing.startingPrice}</span>
                        <Badge variant="outline">{platform.pricing.model}</Badge>
                      </div>

                      {/* Key Features */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Key Features:</h4>
                        <ul className="space-y-1 text-sm">
                          {platform.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-3 h-3 text-security-green mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                          {platform.features.length > 3 && (
                            <li className="text-nexus-blue text-sm">
                              +{platform.features.length - 3} more features
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-border">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedPlatform(platform)}
                        >
                          View Details
                        </Button>
                        {platform.demoAvailable && (
                          <Button variant="outline" size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Demo
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scenarios" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {attackScenarios.map((scenario) => (
                  <Card key={scenario.id} className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={
                          scenario.difficulty === 'basic' ? 'bg-security-green' :
                          scenario.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-threat-red'
                        }>
                          {scenario.difficulty.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {scenario.estimatedTime}
                        </span>
                      </div>
                      <CardTitle className="text-xl mb-2">{scenario.name}</CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* MITRE Tactics */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">MITRE ATT&CK Tactics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {scenario.mitreTactics.map((tactic) => (
                            <Badge key={tactic} variant="outline" className="text-xs">
                              {tactic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Tools */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Simulation Tools:</h4>
                        <div className="flex flex-wrap gap-2">
                          {scenario.tools.slice(0, 3).map((tool) => (
                            <Badge key={tool} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                          {scenario.tools.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{scenario.tools.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-4 border-t border-border">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedScenario(scenario)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Run Scenario
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Guide
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" />
                    Platform Comparison Matrix
                  </CardTitle>
                  <CardDescription>
                    Compare BAS platforms across key features and capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border p-3 text-left">Feature</th>
                          {basPlatforms.map((platform) => (
                            <th key={platform.id} className="border border-border p-3 text-left">
                              <div className="flex items-center gap-2">
                                <img 
                                  src={platform.logo} 
                                  alt={platform.name}
                                  className="w-6 h-6 rounded"
                                />
                                <span className="text-sm">{platform.name}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          'Attack Scenarios',
                          'MITRE ATT&CK Mapping',
                          'SIEM Integration',
                          'Custom Scenarios',
                          'API Access',
                          'Enterprise Support'
                        ].map((feature, index) => (
                          <tr key={index} className="hover:bg-muted/50">
                            <td className="border border-border p-3 font-medium">{feature}</td>
                            {basPlatforms.map((platform) => (
                              <td key={platform.id} className="border border-border p-3 text-center">
                                {platform.features.includes(feature) ? (
                                  <CheckCircle className="w-5 h-5 text-security-green mx-auto" />
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>

        {/* Mid-Content Ad */}
        <AdPlacement 
          position="between-content" 
          contentLength={3000}
          hasSubstantialContent={true}
        />

        {/* ROI Calculator */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-bold text-3xl mb-8 text-center">
                BAS ROI Calculator
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>Calculate Your BAS Investment Return</CardTitle>
                  <CardDescription>
                    Estimate the cost savings and risk reduction from implementing BAS
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Organization Size</label>
                        <select className="w-full p-2 border border-border rounded-md">
                          <option value="">Select size</option>
                          <option value="small">Small (1-100 employees)</option>
                          <option value="medium">Medium (101-1000)</option>
                          <option value="large">Large (1000+)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Current Security Budget</label>
                        <Input type="number" placeholder="Annual security budget in USD" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Industry</label>
                        <select className="w-full p-2 border border-border rounded-md">
                          <option value="">Select industry</option>
                          <option value="finance">Finance</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="technology">Technology</option>
                          <option value="government">Government</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">Projected ROI</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>BAS Implementation Cost:</span>
                            <span className="font-medium">$45,000/year</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expected Breach Cost Reduction:</span>
                            <span className="font-medium text-security-green">$250,000/year</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Insurance Premium Reduction:</span>
                            <span className="font-medium text-security-green">$15,000/year</span>
                          </div>
                          <div className="pt-2 border-t border-border">
                            <div className="flex justify-between font-semibold text-lg">
                              <span>Net Annual Savings:</span>
                              <span className="text-security-green">$220,000</span>
                            </div>
                            <div className="text-center mt-2">
                              <span className="text-2xl font-bold text-security-green">489% ROI</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
          </div>
        </section>

        {/* Footer Ad */}
        <AdPlacement 
          position="footer" 
          contentLength={3000}
          hasSubstantialContent={true}
        />
      </div>
    </Layout>
  );
}
