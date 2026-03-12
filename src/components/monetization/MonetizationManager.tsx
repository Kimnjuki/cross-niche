/**
 * TheGridNexus Monetization Manager
 * Comprehensive monetization strategy with multiple revenue streams
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Star, 
  ShoppingCart,
  CreditCard,
  Gift,
  Crown,
  Zap,
  Target,
  BarChart3,
  Award,
  CheckCircle
} from 'lucide-react';

interface MonetizationStream {
  id: string;
  name: string;
  description: string;
  type: 'display' | 'affiliate' | 'sponsored' | 'premium' | 'lead-gen';
  status: 'active' | 'pending' | 'testing';
  revenue: {
    current: number;
    projected: number;
    growth: number;
  };
  metrics: {
    ctr?: number;
    cpm?: number;
    conversion?: number;
    arpu?: number;
  };
  config: {
    adUnits?: AdUnit[];
    affiliatePrograms?: AffiliateProgram[];
    sponsoredContent?: SponsoredContent[];
    premiumTiers?: PremiumTier[];
  };
}

interface AdUnit {
  id: string;
  name: string;
  format: string;
  size: string;
  position: string;
  status: 'active' | 'inactive';
  revenue: number;
  impressions: number;
  ctr: number;
}

interface AffiliateProgram {
  id: string;
  name: string;
  category: string;
  commission: number;
  conversion: number;
  revenue: number;
  status: 'active' | 'inactive';
}

interface SponsoredContent {
  id: string;
  title: string;
  sponsor: string;
  type: 'article' | 'review' | 'guide';
  price: number;
  status: 'active' | 'completed';
  published: string;
}

interface PremiumTier {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  features: string[];
  subscribers: number;
  revenue: number;
  status: 'active' | 'inactive';
}

const monetizationData: MonetizationStream[] = [
  {
    id: '1',
    name: 'Display Advertising',
    description: 'Google AdSense and premium ad network placements',
    type: 'display',
    status: 'active',
    revenue: {
      current: 12500,
      projected: 25000,
      growth: 15.2
    },
    metrics: {
      ctr: 2.3,
      cpm: 4.50,
      conversion: 1.2
    },
    config: {
      adUnits: [
        {
          id: 'header-banner',
          name: 'Header Banner',
          format: '728x90',
          size: '728x90',
          position: 'header',
          status: 'active',
          revenue: 3200,
          impressions: 711111,
          ctr: 2.3
        },
        {
          id: 'sidebar-mpu',
          name: 'Sidebar MPU',
          format: '300x250',
          size: '300x250',
          position: 'sidebar',
          status: 'active',
          revenue: 2800,
          impressions: 622222,
          ctr: 2.1
        },
        {
          id: 'in-content',
          name: 'In-Content',
          format: '300x600',
          size: '300x600',
          position: 'between-content',
          status: 'active',
          revenue: 4500,
          impressions: 900000,
          ctr: 2.8
        },
        {
          id: 'footer-banner',
          name: 'Footer Banner',
          format: '728x90',
          size: '728x90',
          position: 'footer',
          status: 'active',
          revenue: 2000,
          impressions: 533333,
          ctr: 1.9
        }
      ]
    }
  },
  {
    id: '2',
    name: 'Affiliate Marketing',
    description: 'Tech product and service affiliate partnerships',
    type: 'affiliate',
    status: 'active',
    revenue: {
      current: 8750,
      projected: 17500,
      growth: 22.5
    },
    metrics: {
      conversion: 3.2,
      arpu: 45.20
    },
    config: {
      affiliatePrograms: [
        {
          id: '1',
          name: 'Amazon Associates',
          category: 'General Tech',
          commission: 4.5,
          conversion: 2.8,
          revenue: 3200,
          status: 'active'
        },
        {
          id: '2',
          name: 'BAS Platform Affiliates',
          category: 'Security Tools',
          commission: 25.0,
          conversion: 4.2,
          revenue: 2800,
          status: 'active'
        },
        {
          id: '3',
          name: 'Gaming Gear Partners',
          category: 'Gaming Hardware',
          commission: 8.5,
          conversion: 3.8,
          revenue: 2750,
          status: 'active'
        }
      ]
    }
  },
  {
    id: '3',
    name: 'Sponsored Content',
    description: 'Brand-sponsored articles and reviews',
    type: 'sponsored',
    status: 'active',
    revenue: {
      current: 6500,
      projected: 12000,
      growth: 18.4
    },
    metrics: {
      conversion: 85.0
    },
    config: {
      sponsoredContent: [
        {
          id: '1',
          title: 'Enterprise Security Solutions 2026',
          sponsor: 'CyberDefense Corp',
          type: 'article',
          price: 3500,
          status: 'completed',
          published: '2026-02-15'
        },
        {
          id: '2',
          title: 'Gaming Laptop Buyer\'s Guide',
          sponsor: 'TechGear Pro',
          type: 'guide',
          price: 2000,
          status: 'active',
          published: '2026-02-20'
        },
        {
          id: '3',
          title: 'AI Platform Comparison',
          sponsor: 'CloudAI Inc',
          type: 'review',
          price: 1000,
          status: 'active',
          published: '2026-02-18'
        }
      ]
    }
  },
  {
    id: '4',
    name: 'Premium Memberships',
    description: 'Ad-free browsing and exclusive content',
    type: 'premium',
    status: 'testing',
    revenue: {
      current: 2200,
      projected: 8500,
      growth: 45.8
    },
    metrics: {
      arpu: 12.50,
      conversion: 2.1
    },
    config: {
      premiumTiers: [
        {
          id: '1',
          name: 'Basic',
          price: 5,
          billing: 'monthly',
          features: [
            'Ad-free browsing',
            'Exclusive articles',
            'Newsletter access'
          ],
          subscribers: 45,
          revenue: 225,
          status: 'active'
        },
        {
          id: '2',
          name: 'Pro',
          price: 12,
          billing: 'monthly',
          features: [
            'All Basic features',
            'Video tutorials',
            'Downloadable guides',
            'Community access'
          ],
          subscribers: 28,
          revenue: 336,
          status: 'active'
        },
        {
          id: '3',
          name: 'Enterprise',
          price: 50,
          billing: 'monthly',
          features: [
            'All Pro features',
            'API access',
            'Custom content',
            'Priority support'
          ],
          subscribers: 12,
          revenue: 600,
          status: 'active'
        }
      ]
    }
  },
  {
    id: '5',
    name: 'Lead Generation',
    description: 'BAS vendor demos and consultation requests',
    type: 'lead-gen',
    status: 'pending',
    revenue: {
      current: 1800,
      projected: 5000,
      growth: 35.2
    },
    metrics: {
      conversion: 12.5,
      arpu: 85.00
    },
    config: {
      // Lead generation config would be implemented
    }
  }
];

export function MonetizationManager() {
  const [selectedStream, setSelectedStream] = useState<string>('1');
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const total = monetizationData.reduce((sum, stream) => sum + stream.revenue.current, 0);
    setTotalRevenue(total);
  }, []);

  const getStreamIcon = (type: string) => {
    switch (type) {
      case 'display': return <DollarSign className="w-5 h-5" />;
      case 'affiliate': return <ShoppingCart className="w-5 h-5" />;
      case 'sponsored': return <Star className="w-5 h-5" />;
      case 'premium': return <Crown className="w-5 h-5" />;
      case 'lead-gen': return <Target className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getStreamColor = (type: string) => {
    switch (type) {
      case 'display': return 'text-nexus-blue bg-nexus-blue/10 border-nexus-blue';
      case 'affiliate': return 'text-security-green bg-security-green/10 border-security-green';
      case 'sponsored': return 'text-gaming-purple bg-gaming-purple/10 border-gaming-purple';
      case 'premium': return 'text-yellow-600 bg-yellow-100 border-yellow-600';
      case 'lead-gen': return 'text-orange-600 bg-orange-100 border-orange-600';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-security-green text-white';
      case 'testing': return 'bg-yellow-500 text-black';
      case 'pending': return 'bg-orange-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const selectedStreamData = monetizationData.find(stream => stream.id === selectedStream);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotalProjected = () => {
    return monetizationData.reduce((sum, stream) => sum + stream.revenue.projected, 0);
  };

  const calculateGrowthRate = () => {
    const current = totalRevenue;
    const projected = calculateTotalProjected();
    return ((projected - current) / current) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +{calculateGrowthRate().toFixed(1)}% from projected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Streams</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monetizationData.filter(s => s.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {monetizationData.length} total streams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. CPM</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4.50</div>
            <p className="text-xs text-security-green">+12.5% vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8%</div>
            <p className="text-xs text-security-green">+0.3% vs last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Streams */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Revenue Streams</CardTitle>
          <CardDescription>
            Comprehensive monetization strategy with multiple revenue channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Stream Selection */}
            <div className="flex gap-2 mb-4">
              {monetizationData.map((stream) => (
                <Button
                  key={stream.id}
                  variant={selectedStream === stream.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStream(stream.id)}
                  className="flex items-center gap-2"
                >
                  {getStreamIcon(stream.type)}
                  {stream.name}
                </Button>
              ))}
            </div>

            {/* Selected Stream Details */}
            {selectedStreamData && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {getStreamIcon(selectedStreamData.type)}
                      {selectedStreamData.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedStreamData.description}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedStreamData.status)}`}>
                    {selectedStreamData.status.toUpperCase()}
                  </div>
                </div>

                {/* Revenue Metrics */}
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Current Revenue</h4>
                    <div className="text-2xl font-bold text-nexus-blue">
                      {formatCurrency(selectedStreamData.revenue.current)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Projected Revenue</h4>
                    <div className="text-2xl font-bold text-security-green">
                      {formatCurrency(selectedStreamData.revenue.projected)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Growth Rate</h4>
                    <div className="text-2xl font-bold text-gaming-purple">
                      +{selectedStreamData.revenue.growth}%
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="text-sm font-medium mb-4">Performance Metrics</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(selectedStreamData.metrics).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-lg font-bold">
                          {typeof value === 'number' ? 
                            (key === 'ctr' || key === 'conversion' ? `${value}%` : 
                             key === 'cpm' ? `$${value}` : 
                             key === 'arpu' ? formatCurrency(value) : value) : 
                            value
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Configuration */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="config">Configuration</TabsTrigger>
                    <TabsTrigger value="optimization">Optimization</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Stream Overview</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        This revenue stream is currently {selectedStreamData.status} and performing 
                        {selectedStreamData.revenue.growth > 0 ? 'above' : 'below'} projections.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-security-green" />
                          <span className="text-sm">Revenue tracking active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-security-green" />
                          <span className="text-sm">Performance monitoring enabled</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-security-green" />
                          <span className="text-sm">Automated reporting</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="config" className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-4">Configuration Details</h4>
                      
                      {/* Display Ad Units */}
                      {selectedStreamData.config.adUnits && (
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium">Active Ad Units</h5>
                          {selectedStreamData.config.adUnits.map((unit) => (
                            <div key={unit.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                              <div>
                                <div className="font-medium">{unit.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {unit.format} • {unit.position}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{formatCurrency(unit.revenue)}</div>
                                <div className="text-sm text-muted-foreground">
                                  {unit.impressions.toLocaleString()} impressions
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Affiliate Programs */}
                      {selectedStreamData.config.affiliatePrograms && (
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium">Affiliate Programs</h5>
                          {selectedStreamData.config.affiliatePrograms.map((program) => (
                            <div key={program.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                              <div>
                                <div className="font-medium">{program.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {program.category} • {program.commission}% commission
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{formatCurrency(program.revenue)}</div>
                                <div className="text-sm text-muted-foreground">
                                  {program.conversion}% conversion
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Sponsored Content */}
                      {selectedStreamData.config.sponsoredContent && (
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium">Sponsored Content</h5>
                          {selectedStreamData.config.sponsoredContent.map((content) => (
                            <div key={content.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                              <div>
                                <div className="font-medium">{content.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {content.sponsor} • {content.type}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{formatCurrency(content.price)}</div>
                                <div className="text-sm text-muted-foreground">
                                  {content.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Premium Tiers */}
                      {selectedStreamData.config.premiumTiers && (
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium">Premium Tiers</h5>
                          {selectedStreamData.config.premiumTiers.map((tier) => (
                            <div key={tier.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                              <div>
                                <div className="font-medium">{tier.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {tier.subscribers} subscribers • {tier.billing}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{formatCurrency(tier.price)}/{tier.billing === 'monthly' ? 'mo' : 'yr'}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatCurrency(tier.revenue)} revenue
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="optimization" className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-4">Optimization Opportunities</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Award className="w-5 h-5 text-nexus-blue" />
                          <div>
                            <div className="font-medium">Premium Ad Network</div>
                            <div className="text-sm text-muted-foreground">
                              Ready for Mediavine/AdThrive at 50K monthly pageviews
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Gift className="w-5 h-5 text-security-green" />
                          <div>
                            <div className="font-medium">Affiliate Expansion</div>
                            <div className="text-sm text-muted-foreground">
                              Add 5+ high-converting tech affiliate programs
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Crown className="w-5 h-5 text-gaming-purple" />
                          <div>
                            <div className="font-medium">Premium Features</div>
                            <div className="text-sm text-muted-foreground">
                              Launch exclusive content and community features
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MonetizationManager;
