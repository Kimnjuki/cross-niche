/**
 * TheGridNexus Nexus Labs - Interactive Tool Suite Hub
 * NF-004: Unified hub for all interactive tools branded as 'Nexus Labs'
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Activity, 
  BarChart3, 
  Lock, 
  Search, 
  TrendingUp,
  Zap,
  Award,
  Users,
  ArrowRight,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'intelligence' | 'assessment' | 'analytics';
  status: 'available' | 'beta' | 'coming-soon';
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  usageCount?: number;
  xpReward?: number;
  path: string;
  features: string[];
}

const tools: Tool[] = [
  {
    id: 'grid-signal',
    name: 'GridSignal',
    description: 'Real-time threat intelligence feed with CVEs, breaches, and threat actor activity',
    category: 'intelligence',
    status: 'available',
    icon: Activity,
    color: 'text-nexus-blue',
    bgColor: 'bg-nexus-blue/10',
    usageCount: 15234,
    xpReward: 50,
    path: '/tools/gridsignal',
    features: ['Live threat feed', 'CVE tracking', 'Breach alerts', 'Threat actor monitoring']
  },
  {
    id: 'security-score',
    name: 'Security Score',
    description: 'Personal security posture assessment with actionable improvement steps',
    category: 'assessment',
    status: 'beta',
    icon: Shield,
    color: 'text-security-green',
    bgColor: 'bg-security-green/10',
    usageCount: 8921,
    xpReward: 100,
    path: '/tools/security-score',
    features: ['15-question assessment', 'Personalized score', 'Actionable insights', 'Shareable results']
  },
  {
    id: 'domain-scanner',
    name: 'Domain Scanner',
    description: 'Public-facing security report for any domain with SSL grade and known CVEs',
    category: 'security',
    status: 'coming-soon',
    icon: Search,
    color: 'text-gaming-purple',
    bgColor: 'bg-gaming-purple/10',
    usageCount: 0,
    xpReward: 75,
    path: '/tools/domain-scanner',
    features: ['SSL analysis', 'Open ports', 'CVE detection', 'Security headers']
  },
  {
    id: 'breach-timeline',
    name: 'Breach Timeline',
    description: 'Interactive archive of data breaches with MITRE ATT&CK tagging',
    category: 'intelligence',
    status: 'beta',
    icon: Lock,
    color: 'text-threat-red',
    bgColor: 'bg-threat-red/10',
    usageCount: 5678,
    xpReward: 60,
    path: '/tools/breach-timeline',
    features: ['Breach database', 'Timeline view', 'MITRE ATT&CK', 'Impact analysis']
  },
  {
    id: 'roadmap-tracker',
    name: 'Roadmap Tracker',
    description: 'Visual timeline of announced tech products and releases',
    category: 'analytics',
    status: 'available',
    icon: BarChart3,
    color: 'text-nexus-blue',
    bgColor: 'bg-nexus-blue/10',
    usageCount: 12456,
    xpReward: 40,
    path: '/roadmap',
    features: ['Product timelines', 'Release tracking', 'Company filtering', 'Alert system']
  },
  {
    id: 'ai-pulse',
    name: 'AI Pulse',
    description: 'AI model comparison dashboard with benchmark scores and capability tracking',
    category: 'intelligence',
    status: 'available',
    icon: TrendingUp,
    color: 'text-gaming-purple',
    bgColor: 'bg-gaming-purple/10',
    usageCount: 18923,
    xpReward: 45,
    path: '/ai-pulse',
    features: ['Model comparison', 'Benchmark scores', 'Capability flags', 'Impact scoring']
  }
];

const userStats = {
  level: 'Specialist',
  xp: 2850,
  nextLevelXp: 5000,
  toolsCompleted: 12,
  badges: ['Security Novice', 'Threat Hunter', 'Quick Learner'],
  streak: 7
};

export function NexusLabs() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Tool['category']>('all');
  const [showStats, setShowStats] = useState(false);

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const getStatusBadge = (status: Tool['status']) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-security-green text-white">Available</Badge>;
      case 'beta':
        return <Badge className="bg-yellow-500 text-black">Beta</Badge>;
      case 'coming-soon':
        return <Badge variant="outline">Coming Soon</Badge>;
    }
  };

  const categories = [
    { id: 'all', name: 'All Tools', icon: Zap },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'intelligence', name: 'Intelligence', icon: Activity },
    { id: 'assessment', name: 'Assessment', icon: BarChart3 },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-r from-nexus-blue/10 via-security-green/10 to-gaming-purple/10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-nexus-blue via-security-green to-gaming-purple rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold font-display">Nexus Labs</h1>
            </div>
            <p className="text-xl text-muted-foreground mb-6">
              Interactive tools that turn passive readers into active security professionals
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{tools.reduce((acc, tool) => acc + (tool.usageCount || 0), 0).toLocaleString()} users</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>{tools.length} tools available</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                <span>Free with account</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-nexus-blue border-nexus-blue">
                  Level {userStats.level}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {userStats.xp} / {userStats.nextLevelXp} XP
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  🔥 {userStats.streak} day streak
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  🛠️ {userStats.toolsCompleted} tools completed
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </Button>
          </div>
          {showStats && (
            <div className="mt-4">
              <Progress value={(userStats.xp / userStats.nextLevelXp) * 100} className="mb-2" />
              <div className="flex gap-2">
                {userStats.badges.map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id as any)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isAvailable = tool.status === 'available';
            
            return (
              <Card 
                key={tool.id}
                className={`transition-all hover:shadow-lg ${
                  isAvailable ? 'cursor-pointer hover:border-nexus-blue' : 'opacity-75'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg ${tool.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    {getStatusBadge(tool.status)}
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Features */}
                    <div className="space-y-2">
                      {tool.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-nexus-blue" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      {tool.usageCount && tool.usageCount > 0 && (
                        <span>{tool.usageCount.toLocaleString()} users</span>
                      )}
                      {tool.xpReward && (
                        <span className="text-nexus-blue">+{tool.xpReward} XP</span>
                      )}
                    </div>

                    {/* CTA */}
                    <Button 
                      className="w-full"
                      disabled={!isAvailable}
                      asChild={isAvailable}
                    >
                      {isAvailable ? (
                        <Link to={tool.path}>
                          Try Tool
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      ) : (
                        <>
                          {tool.status === 'beta' ? 'Join Beta' : 'Coming Soon'}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tools found</h3>
            <p className="text-muted-foreground">
              Try selecting a different category to see available tools.
            </p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-border bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Level Up?</h3>
            <p className="text-muted-foreground mb-4">
              Complete tools, earn XP, and unlock exclusive features. Join thousands of security professionals 
              already using Nexus Labs to enhance their skills.
            </p>
            <Button size="lg">
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
