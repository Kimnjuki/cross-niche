import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, Zap, Users, BarChart3, Globe, ExternalLink } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  priority: 'high' | 'medium' | 'low';
  phase: number;
  tier: 1 | 2 | 3;
  estimatedEffort: string;
  businessValue: string;
  liveUrl?: string;
}

const competitiveAdvantages: Feature[] = [
  // TIER 1: Competitive Moats (some implemented - link to live pages)
  {
    id: 'ai-pulse-roadmap',
    title: 'AI-Pulse Roadmap',
    description: 'Live-updating timeline for AI/ML tech trends. Filter by Productivity, Creative, Gaming AI. Hype vs Utility toggle.',
    status: 'completed',
    priority: 'high',
    phase: 1,
    tier: 1,
    estimatedEffort: 'Medium',
    businessValue: 'Unique AI intelligence hub competitors lack',
    liveUrl: '/ai-pulse',
  },
  {
    id: 'breach-simulation',
    title: 'Breach Simulation (nexus-003)',
    description: 'Interactive cybersecurity training: Phishing Email → choices branch to security outcomes. Nexus XP, terminal UI.',
    status: 'completed',
    priority: 'high',
    phase: 1,
    tier: 1,
    estimatedEffort: 'Medium',
    businessValue: 'Gamified security training differentiator',
    liveUrl: '/breach-sim',
  },
  {
    id: 'nexus-intersection',
    title: 'Nexus Intersection (nexus-004)',
    description: 'Cross-section: 1 Tech + 1 Security + 1 Gaming linked by common keyword. Unified intelligence view.',
    status: 'completed',
    priority: 'high',
    phase: 1,
    tier: 1,
    estimatedEffort: 'Medium',
    businessValue: 'Cross-niche connection discovery',
    liveUrl: '/nexus-intersection',
  },
  {
    id: 'intelligence-graph',
    title: 'Cross-Niche Intelligence Graph',
    description: 'Interactive knowledge graph showing relationships between tech, security, and gaming domains with AI-powered connection discovery',
    status: 'planned',
    priority: 'high',
    phase: 1,
    tier: 1,
    estimatedEffort: 'High',
    businessValue: 'Unique value proposition competitors can\'t replicate'
  },
  {
    id: 'predictive-threats',
    title: 'Predictive Threat Intelligence',
    description: 'ML model predicting emerging threats before they\'re widely reported with threat forecast dashboard',
    status: 'planned',
    priority: 'high',
    phase: 1,
    tier: 1,
    estimatedEffort: 'High',
    businessValue: 'Positions platform as forward-thinking, not just aggregating news'
  },
  {
    id: 'gamified-learning',
    title: 'Gamified Learning Paths',
    description: 'Personalized learning paths with achievement system, skill trees, and XP system for role-based progression',
    status: 'planned',
    priority: 'high',
    phase: 1,
    tier: 1,
    estimatedEffort: 'Medium',
    businessValue: 'Increases engagement, retention, and makes platform sticky'
  },
  {
    id: 'collaborative-intelligence',
    title: 'Real-Time Collaborative Intelligence',
    description: 'Community-driven threat analysis with live annotation system and expert verification',
    status: 'planned',
    priority: 'high',
    phase: 3,
    tier: 1,
    estimatedEffort: 'High',
    businessValue: 'Builds community, increases trust, creates network effects'
  },
  {
    id: 'threat-simulation',
    title: 'AI-Powered Threat Simulation',
    description: 'Interactive "What If?" threat simulator with impact calculator and attack path diagrams',
    status: 'planned',
    priority: 'medium',
    phase: 2,
    tier: 1,
    estimatedEffort: 'Medium',
    businessValue: 'Educational value that competitors don\'t offer'
  },

  // TIER 2: Enhanced User Experience
  {
    id: 'personalized-dashboard',
    title: 'Personalized Intelligence Dashboard',
    description: 'Customizable widgets with role-specific layouts and drag-and-drop dashboard builder',
    status: 'planned',
    priority: 'medium',
    phase: 2,
    tier: 2,
    estimatedEffort: 'Medium',
    businessValue: 'Improved user experience and personalization'
  },
  {
    id: 'advanced-discovery',
    title: 'Advanced Content Discovery',
    description: 'AI-powered recommendations with "Similar Articles" and "You Might Have Missed" features',
    status: 'planned',
    priority: 'medium',
    phase: 2,
    tier: 2,
    estimatedEffort: 'Medium',
    businessValue: 'Better content discovery and user engagement'
  },
  {
    id: 'multi-modal-content',
    title: 'Multi-Modal Content Consumption',
    description: 'Audio narration, video summaries, and downloadable formats for articles',
    status: 'planned',
    priority: 'medium',
    phase: 2,
    tier: 2,
    estimatedEffort: 'Medium',
    businessValue: 'Enhanced accessibility and user experience'
  },
  {
    id: 'expert-network',
    title: 'Expert Network & Mentorship',
    description: 'Verified expert profiles with Q&A system and mentorship matching',
    status: 'planned',
    priority: 'medium',
    phase: 3,
    tier: 2,
    estimatedEffort: 'Medium',
    businessValue: 'Builds expert community and trust'
  },
  {
    id: 'intelligence-reports',
    title: 'Intelligence Reports & Analytics',
    description: 'Custom report builder with automated weekly reports and trend analysis',
    status: 'planned',
    priority: 'low',
    phase: 3,
    tier: 2,
    estimatedEffort: 'Medium',
    businessValue: 'Enterprise value and monetization opportunities'
  },

  // TIER 3: Platform Expansion
  {
    id: 'api-integrations',
    title: 'API & Integrations',
    description: 'Public API, Slack/Discord bots, browser extensions, and webhook support',
    status: 'planned',
    priority: 'low',
    phase: 4,
    tier: 3,
    estimatedEffort: 'High',
    businessValue: 'Platform expansion and ecosystem growth'
  },
  {
    id: 'enterprise-features',
    title: 'Enterprise Features',
    description: 'Team workspaces, SSO integration, advanced analytics, and custom branding',
    status: 'planned',
    priority: 'low',
    phase: 4,
    tier: 3,
    estimatedEffort: 'High',
    businessValue: 'Enterprise monetization and market expansion'
  },
  {
    id: 'marketplace-ecosystem',
    title: 'Marketplace & Ecosystem',
    description: 'Threat intelligence marketplace and custom mitigation guide marketplace',
    status: 'planned',
    priority: 'low',
    phase: 4,
    tier: 3,
    estimatedEffort: 'High',
    businessValue: 'New revenue streams and platform growth'
  },
  {
    id: 'research-tools',
    title: 'Research & Development Tools',
    description: 'Research workspace with citation management and collaborative research projects',
    status: 'planned',
    priority: 'low',
    phase: 4,
    tier: 3,
    estimatedEffort: 'Medium',
    businessValue: 'Academic and research market expansion'
  }
];

const Roadmap = () => {
  const getStatusIcon = (status: Feature['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Feature['priority']) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getTierIcon = (tier: Feature['tier']) => {
    switch (tier) {
      case 1:
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Users className="h-5 w-5 text-blue-500" />;
      case 3:
        return <Globe className="h-5 w-5 text-green-500" />;
    }
  };

  const getPhaseProgress = (phase: number) => {
    const phaseFeatures = competitiveAdvantages.filter(f => f.phase === phase);
    const completed = phaseFeatures.filter(f => f.status === 'completed').length;
    return Math.round((completed / phaseFeatures.length) * 100);
  };

  const phases = [
    { id: 1, name: 'Foundation Differentiators', description: 'Core competitive advantages' },
    { id: 2, name: 'User Experience', description: 'Enhanced user experience features' },
    { id: 3, name: 'Community & Collaboration', description: 'Community-driven features' },
    { id: 4, name: 'Platform Expansion', description: 'Enterprise and ecosystem growth' }
  ];

  return (
    <Layout>
      <SEOHead
        title="Product Roadmap | The Grid Nexus"
        description="Explore our competitive advantages roadmap. See upcoming features for tech, security, and gaming intelligence platform."
        keywords={['roadmap', 'features', 'product development', 'upcoming features', 'platform roadmap']}
        url={window.location.href}
        type="website"
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Competitive Advantages Roadmap</h1>
            <p className="text-xl text-muted-foreground">
              Building The Grid Nexus - A category-defining intelligence platform
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/about" className="text-primary hover:underline">About Us</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/contact" className="text-primary hover:underline">Contact</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/blog-series" className="text-primary hover:underline">Latest Articles</Link>
            </div>
          </div>

          {/* Phase Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {phases.map((phase) => (
              <Card key={phase.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Phase {phase.id}</CardTitle>
                  <CardDescription>{phase.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{getPhaseProgress(phase.id)}%</span>
                    </div>
                    <Progress value={getPhaseProgress(phase.id)} className="h-2" />
                    <p className="text-xs text-muted-foreground">{phase.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features by Tier */}
          <div className="space-y-12">
            {/* Tier 1 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Zap className="h-8 w-8 text-yellow-500" />
                <div>
                  <h2 className="text-3xl font-bold">Tier 1: Competitive Moats</h2>
                  <p className="text-muted-foreground">Must-have differentiators that competitors can't easily replicate</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {competitiveAdvantages.filter(f => f.tier === 1).map((feature) => (
                  <Card key={feature.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(feature.status)}
                          <div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={getPriorityColor(feature.priority)}>
                                Phase {feature.phase}
                              </Badge>
                              <Badge variant="outline">{feature.estimatedEffort} Effort</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{feature.description}</CardDescription>
                      <div className="text-sm mb-3">
                        <strong>Business Value:</strong> {feature.businessValue}
                      </div>
                      {feature.liveUrl && (
                        <Link
                          to={feature.liveUrl}
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                        >
                          Try it live <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tier 2 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <h2 className="text-3xl font-bold">Tier 2: Enhanced User Experience</h2>
                  <p className="text-muted-foreground">High-impact features that improve user engagement and satisfaction</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {competitiveAdvantages.filter(f => f.tier === 2).map((feature) => (
                  <Card key={feature.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(feature.status)}
                          <div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={getPriorityColor(feature.priority)}>
                                Phase {feature.phase}
                              </Badge>
                              <Badge variant="outline">{feature.estimatedEffort} Effort</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{feature.description}</CardDescription>
                      <div className="text-sm mb-3">
                        <strong>Business Value:</strong> {feature.businessValue}
                      </div>
                      {feature.liveUrl && (
                        <Link
                          to={feature.liveUrl}
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                        >
                          Try it live <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tier 3 */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Globe className="h-8 w-8 text-green-500" />
                <div>
                  <h2 className="text-3xl font-bold">Tier 3: Platform Expansion</h2>
                  <p className="text-muted-foreground">Future growth features for enterprise and ecosystem expansion</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {competitiveAdvantages.filter(f => f.tier === 3).map((feature) => (
                  <Card key={feature.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(feature.status)}
                          <div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={getPriorityColor(feature.priority)}>
                                Phase {feature.phase}
                              </Badge>
                              <Badge variant="outline">{feature.estimatedEffort} Effort</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{feature.description}</CardDescription>
                      <div className="text-sm mb-3">
                        <strong>Business Value:</strong> {feature.businessValue}
                      </div>
                      {feature.liveUrl && (
                        <Link
                          to={feature.liveUrl}
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                        >
                          Try it live <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {competitiveAdvantages.filter(f => f.status === 'completed').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Completed Features</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {competitiveAdvantages.filter(f => f.status === 'in-progress').length}
                  </div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-500">
                    {competitiveAdvantages.filter(f => f.status === 'planned').length}
                  </div>
                  <p className="text-sm text-muted-foreground">Planned Features</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {Math.round((competitiveAdvantages.filter(f => f.status === 'completed').length / competitiveAdvantages.length) * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Roadmap;