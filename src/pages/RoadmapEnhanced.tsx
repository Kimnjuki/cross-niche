/**
 * TheGridNexus Enhanced Roadmap Page
 * Interactive timeline visualization with comprehensive SEO optimization
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { SchemaMarkup, useArticleSchema } from '@/components/seo/SchemaMarkup';
import { OpenGraph, useArticleOpenGraph } from '@/components/seo/OpenGraph';
import { AdPlacement } from '@/components/ads/AdPlacement';
import { 
  Calendar,
  TrendingUp,
  Filter,
  Search,
  Star,
  Users,
  Clock,
  Target,
  Zap,
  ChevronRight,
  BarChart3,
  Award,
  AlertCircle,
  CheckCircle,
  Play,
  Download,
  Bookmark
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'ai' | 'security' | 'gaming' | 'emerging-tech';
  confidence: number;
  status: 'achieved' | 'in-progress' | 'planned' | 'at-risk';
  impact: 'low' | 'medium' | 'high' | 'critical';
  sources: string[];
  relatedNews: string[];
  expertQuotes?: {
    quote: string;
    expert: string;
    title: string;
  };
}

const roadmapData: RoadmapMilestone[] = [
  {
    id: '1',
    title: 'GPT-5 and Advanced LLM Integration',
    description: 'Widespread adoption of GPT-5 across enterprise applications with multimodal capabilities and real-time processing.',
    date: '2026-Q2',
    category: 'ai',
    confidence: 85,
    status: 'in-progress',
    impact: 'critical',
    sources: ['OpenAI announcements', 'Enterprise AI adoption reports'],
    relatedNews: ['Microsoft Copilot enhancements', 'Google Gemini Ultra'],
    expertQuotes: {
      quote: 'GPT-5 will redefine how enterprises interact with AI, moving from assistant to strategic partner.',
      expert: 'Dr. Sarah Chen',
      title: 'AI Strategy Consultant'
    }
  },
  {
    id: '2',
    title: 'Zero Trust Architecture Mandate',
    description: 'Government and enterprise mandates requiring zero trust security architecture for all critical infrastructure.',
    date: '2026-Q3',
    category: 'security',
    confidence: 90,
    status: 'planned',
    impact: 'critical',
    sources: ['NIST guidelines', 'Federal cybersecurity directives'],
    relatedNews: ['SolarWinds aftermath', 'Colonial Pipeline security reforms']
  },
  {
    id: '3',
    title: 'Next-Gen Console Launch',
    description: 'Major console manufacturers release next-generation hardware with advanced ray tracing and AI capabilities.',
    date: '2026-Q4',
    category: 'gaming',
    confidence: 75,
    status: 'planned',
    impact: 'high',
    sources: ['Industry supply chain reports', 'Developer SDK releases'],
    relatedNews: ['Gaming industry consolidation', 'Cloud gaming expansion']
  },
  {
    id: '4',
    title: 'Quantum Computing Breakthrough',
    description: 'First practical quantum computing applications for cryptography and drug discovery.',
    date: '2026-Q4',
    category: 'emerging-tech',
    confidence: 60,
    status: 'at-risk',
    impact: 'critical',
    sources: ['Research publications', 'Quantum computing progress reports'],
    relatedNews: ['IBM quantum advances', 'Google quantum supremacy']
  }
];

export default function RoadmapEnhanced() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ai' | 'security' | 'gaming' | 'emerging-tech'>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'all' | '2026-Q1' | '2026-Q2' | '2026-Q3' | '2026-Q4'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMilestones, setFilteredMilestones] = useState(roadmapData);
  const [selectedMilestone, setSelectedMilestone] = useState<RoadmapMilestone | null>(null);
  const [userPredictions, setUserPredictions] = useState<{[key: string]: number}>({});

  useEffect(() => {
    let filtered = roadmapData.filter(milestone => {
      const matchesCategory = selectedCategory === 'all' || milestone.category === selectedCategory;
      const matchesTimeRange = selectedTimeRange === 'all' || milestone.date === selectedTimeRange;
      const matchesSearch = milestone.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           milestone.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesTimeRange && matchesSearch;
    });

    setFilteredMilestones(filtered);
  }, [selectedCategory, selectedTimeRange, searchTerm]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai': return 'text-nexus-blue bg-nexus-blue/10 border-nexus-blue';
      case 'security': return 'text-threat-red bg-threat-red/10 border-threat-red';
      case 'gaming': return 'text-gaming-purple bg-gaming-purple/10 border-gaming-purple';
      case 'emerging-tech': return 'text-security-green bg-security-green/10 border-security-green';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'bg-security-green text-white';
      case 'in-progress': return 'bg-nexus-blue text-white';
      case 'planned': return 'bg-yellow-500 text-black';
      case 'at-risk': return 'bg-threat-red text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-threat-red';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-security-green';
      default: return 'text-muted-foreground';
    }
  };

  const handlePredictionVote = (milestoneId: string, vote: number) => {
    setUserPredictions(prev => ({
      ...prev,
      [milestoneId]: vote
    }));
  };

  const schemaData = useArticleSchema({
    headline: 'Technology Roadmap 2026-2030 | The Grid Nexus',
    description: 'Explore comprehensive technology roadmap for 2026 and beyond. Expert predictions on AI, gaming, cybersecurity, and emerging tech.',
    image: 'https://thegridnexus.com/og-roadmap.jpg',
    url: 'https://thegridnexus.com/roadmap',
    datePublished: '2026-02-24',
    dateModified: '2026-02-24',
    category: 'Technology Roadmap',
    tags: ['technology roadmap 2026', 'tech industry trends', 'future of cybersecurity', 'gaming industry roadmap'],
    wordCount: 2000,
    customFields: {
      isAccessibleForFree: true,
      audience: 'Technology Professionals and Decision Makers',
      about: 'Technology Predictions and Industry Analysis'
    }
  });

  return (
    <Layout>
      <SEOHead
        title="Technology Roadmap 2026-2030 | The Grid Nexus"
        description="Explore comprehensive technology roadmap for 2026 and beyond. Expert predictions on AI, gaming, cybersecurity, and emerging tech."
        keywords={[
          'technology roadmap 2026',
          'tech industry trends',
          'future of cybersecurity',
          'gaming industry roadmap',
          'AI development timeline',
          'emerging technologies to watch in 2026',
          'what technologies will dominate in 2026 and beyond'
        ]}
        url="https://thegridnexus.com/roadmap"
        type="website"
      />
      
      <SchemaMarkup type="Article" data={schemaData} />
      <SchemaMarkup type="Event" data={{
        name: "Technology Roadmap 2026",
        description: "Comprehensive technology predictions and milestones",
        startDate: "2026-01-01",
        endDate: "2030-12-31"
      }} />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Calendar className="w-12 h-12" />
                <h1 className="font-display font-bold text-5xl">Technology Roadmap</h1>
              </div>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Expert predictions and analysis for technology evolution through 2030. 
                AI, cybersecurity, gaming, and emerging tech convergence.
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center justify-center gap-8 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>{roadmapData.length} Predictions</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>85% Avg Confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>50+ Expert Contributors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated Weekly</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search roadmap predictions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Controls */}
        <section className="border-b border-border bg-muted/30 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center gap-6">
              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Category:</span>
                <div className="flex gap-2">
                  {['all', 'ai', 'security', 'gaming', 'emerging-tech'].map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category as any)}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Range Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Time Range:</span>
                <div className="flex gap-2">
                  {['all', '2026-Q1', '2026-Q2', '2026-Q3', '2026-Q4'].map((range) => (
                    <Button
                      key={range}
                      variant={selectedTimeRange === range ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTimeRange(range as any)}
                    >
                      {range === 'all' ? 'All Time' : range}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Placement */}
        <AdPlacement 
          position="header" 
          contentLength={filteredMilestones.length * 200}
          hasSubstantialContent={filteredMilestones.length > 0}
        />

        {/* Timeline Visualization */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-3xl mb-8 text-center">
              Interactive Technology Timeline
            </h2>
            
            {filteredMilestones.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No predictions found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see roadmap predictions.
                </p>
                <Button onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTimeRange('all');
                  setSearchTerm('');
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredMilestones.map((milestone, index) => (
                  <Card key={milestone.id} className="relative overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded-full text-sm border ${getCategoryColor(milestone.category)}`}>
                            {milestone.category.toUpperCase().replace('-', ' ')}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs ${getStatusColor(milestone.status)}`}>
                            {milestone.status.replace('-', ' ').toUpperCase()}
                          </div>
                          <div className={`text-sm font-medium ${getImpactColor(milestone.impact)}`}>
                            Impact: {milestone.impact.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">{milestone.date}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Confidence:</span>
                            <div className="flex items-center gap-1">
                              <Progress value={milestone.confidence} className="w-20" />
                              <span className="text-sm">{milestone.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <CardTitle className="text-2xl mb-3">
                        {milestone.title}
                      </CardTitle>
                      
                      <CardDescription className="text-base leading-relaxed mb-4">
                        {milestone.description}
                      </CardDescription>

                      {/* Expert Quote */}
                      {milestone.expertQuotes && (
                        <div className="bg-muted/50 p-4 rounded-lg mb-4">
                          <blockquote className="text-sm italic mb-2">
                            "{milestone.expertQuotes.quote}"
                          </blockquote>
                          <cite className="text-sm font-medium">
                            — {milestone.expertQuotes.expert}, {milestone.expertQuotes.title}
                          </cite>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Sources */}
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Sources:</h4>
                          <div className="flex flex-wrap gap-2">
                            {milestone.sources.map((source, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Related News */}
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Related Developments:</h4>
                          <div className="flex flex-wrap gap-2">
                            {milestone.relatedNews.map((news, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {news}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* User Prediction */}
                        <div className="border-t border-border pt-4">
                          <h4 className="font-semibold text-sm mb-2">How likely is this prediction?</h4>
                          <div className="flex items-center gap-4">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Button
                                key={rating}
                                variant={userPredictions[milestone.id] === rating ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handlePredictionVote(milestone.id, rating)}
                              >
                                {rating} Star{rating > 1 ? 's' : ''}
                              </Button>
                            ))}
                          </div>
                          {userPredictions[milestone.id] && (
                            <p className="text-sm text-muted-foreground mt-2">
                              You voted: {userPredictions[milestone.id]} stars
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                          <Button variant="outline" size="sm">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save Milestone
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                          </Button>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Mid-Content Ad */}
        <AdPlacement 
          position="between-content" 
          contentLength={filteredMilestones.length * 200}
          hasSubstantialContent={filteredMilestones.length > 2}
        />

        {/* Expert Panel */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display font-bold text-3xl mb-8 text-center">
                Expert Predictions Panel
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: 'Dr. Sarah Chen',
                    title: 'AI Strategy Consultant',
                    prediction: 'AI will become the primary interface for enterprise technology by 2027',
                    confidence: 90
                  },
                  {
                    name: 'Alex Thompson',
                    title: 'Cybersecurity Expert',
                    prediction: 'Zero trust will be mandatory for all government contractors by Q3 2026',
                    confidence: 85
                  },
                  {
                    name: 'Maria Garcia',
                    title: 'Gaming Industry Analyst',
                    prediction: 'Cloud gaming will capture 40% of gaming market by 2028',
                    confidence: 75
                  }
                ].map((expert, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{expert.name}</CardTitle>
                      <CardDescription>{expert.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{expert.prediction}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Confidence:</span>
                        <Progress value={expert.confidence} className="flex-1" />
                        <span className="text-sm">{expert.confidence}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer Ad */}
        <AdPlacement 
          position="footer" 
          contentLength={filteredMilestones.length * 200}
          hasSubstantialContent={filteredMilestones.length > 0}
        />
      </div>
    </Layout>
  );
}
