import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Building2,
  DollarSign,
  Calendar,
  Users,
  ExternalLink,
  Search,
  Filter,
  ArrowUpRight,
  MapPin
} from 'lucide-react';
import { LazyImage } from '@/components/ui/lazy-image';
import { getPlaceholderImage } from '@/lib/placeholderImages';
import type { StartupProfile } from '@/types';

/**
 * TechCrunch-style startup funding news page
 * Features: Funding rounds, valuations, investor info, startup profiles
 */

// Mock data - in production, this would come from Supabase
const mockStartups: StartupProfile[] = [
  {
    id: '1',
    name: 'QuantumSecure AI',
    tagline: 'AI-Powered Enterprise Security',
    description: 'Revolutionary AI platform for real-time threat detection and automated response.',
    founded: '2022',
    headquarters: 'San Francisco, CA',
    industry: ['Cybersecurity', 'AI', 'Enterprise Software'],
    stage: 'series-b',
    funding: {
      totalRaised: 45,
      currency: 'USD',
      lastRound: {
        amount: 25,
        date: '2024-01-15',
        round: 'Series B',
        investors: ['Sequoia Capital', 'Andreessen Horowitz', 'Accel Partners']
      },
      valuation: 180
    },
    team: [
      { name: 'Sarah Chen', role: 'CEO', experience: 'Ex-Google Security Lead' },
      { name: 'Michael Torres', role: 'CTO', experience: 'Former AWS Security Architect' }
    ],
    metrics: {
      employees: 85,
      customers: 1200,
      growth: 340
    },
    website: 'https://quantumsecure.ai',
    socialLinks: {
      twitter: '@quantumsecure',
      linkedin: 'company/quantumsecure-ai'
    },
    logo: getPlaceholderImage('security'),
    images: [],
    tags: ['AI', 'Security', 'Enterprise'],
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'GameFlow Analytics',
    tagline: 'Real-time Gaming Performance Intelligence',
    description: 'Advanced analytics platform for game developers and esports teams.',
    founded: '2021',
    headquarters: 'Austin, TX',
    industry: ['Gaming', 'Analytics', 'SaaS'],
    stage: 'series-a',
    funding: {
      totalRaised: 12,
      currency: 'USD',
      lastRound: {
        amount: 8,
        date: '2023-11-20',
        round: 'Series A',
        investors: ['Lightspeed Ventures', 'Gaming Ventures Fund']
      },
      valuation: 45
    },
    team: [
      { name: 'Alex Rivera', role: 'Founder & CEO', experience: 'Ex-Riot Games' }
    ],
    metrics: {
      employees: 32,
      customers: 450,
      growth: 210
    },
    website: 'https://gameflow.io',
    socialLinks: {
      twitter: '@gameflow'
    },
    logo: getPlaceholderImage('gaming'),
    images: [],
    tags: ['Gaming', 'Analytics', 'Esports'],
    lastUpdated: '2023-11-20'
  }
];

const stageColors = {
  'pre-seed': 'bg-gray-500/10 text-gray-500',
  'seed': 'bg-blue-500/10 text-blue-500',
  'series-a': 'bg-green-500/10 text-green-500',
  'series-b': 'bg-purple-500/10 text-purple-500',
  'series-c': 'bg-orange-500/10 text-orange-500',
  'growth': 'bg-red-500/10 text-red-500',
  'ipo': 'bg-yellow-500/10 text-yellow-500',
  'acquired': 'bg-indigo-500/10 text-indigo-500'
};

export default function Startups() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const filteredStartups = mockStartups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.industry.some(ind => ind.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = selectedStage === 'all' || startup.stage === selectedStage;
    const matchesIndustry = selectedIndustry === 'all' || 
      startup.industry.some(ind => ind.toLowerCase() === selectedIndustry.toLowerCase());
    return matchesSearch && matchesStage && matchesIndustry;
  });

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1000000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl">Startup Funding</h1>
              <p className="text-muted-foreground">TechCrunch-style startup intelligence</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Track funding rounds, valuations, and the latest startup news in tech, security, and gaming.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search startups, industries, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tabs value={selectedStage} onValueChange={setSelectedStage} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All Stages</TabsTrigger>
                  <TabsTrigger value="seed">Seed</TabsTrigger>
                  <TabsTrigger value="series-a">Series A</TabsTrigger>
                  <TabsTrigger value="series-b">Series B</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Startup Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map((startup) => (
            <Card key={startup.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <LazyImage
                    src={startup.logo}
                    alt={startup.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{startup.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-3">{startup.tagline}</p>
                  </div>
                  <Badge className={stageColors[startup.stage]}>
                    {startup.stage.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {startup.industry.slice(0, 2).map((ind, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {ind}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {startup.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Funding Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Raised</span>
                    <span className="font-bold text-lg">{formatCurrency(startup.funding.totalRaised)}</span>
                  </div>
                  {startup.funding.valuation && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Valuation</span>
                      <span className="font-semibold">{formatCurrency(startup.funding.valuation)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Round</span>
                    <span className="font-medium">
                      {startup.funding.lastRound.round} • {formatCurrency(startup.funding.lastRound.amount)}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-bold">{startup.metrics.employees}</div>
                    <div className="text-xs text-muted-foreground">Employees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{startup.metrics.customers}</div>
                    <div className="text-xs text-muted-foreground">Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{startup.metrics.growth}%</div>
                    <div className="text-xs text-muted-foreground">Growth</div>
                  </div>
                </div>

                {/* Investors */}
                <div className="pt-4 border-t">
                  <div className="text-xs text-muted-foreground mb-2">Investors</div>
                  <div className="flex flex-wrap gap-1">
                    {startup.funding.lastRound.investors.slice(0, 2).map((investor, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {investor}
                      </Badge>
                    ))}
                    {startup.funding.lastRound.investors.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{startup.funding.lastRound.investors.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" asChild>
                    <a href={startup.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                  <Button variant="outline">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStartups.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No startups found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

