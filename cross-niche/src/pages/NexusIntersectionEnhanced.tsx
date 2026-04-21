/**
 * TheGridNexus Enhanced Nexus Intersection Page
 * Cross-industry convergence content with interactive Venn diagram
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { SchemaMarkup, useArticleSchema } from '@/components/seo/SchemaMarkup';
import { OpenGraph, useArticleOpenGraph } from '@/components/seo/OpenGraph';
import { AdPlacement } from '@/components/ads/AdPlacement';
import { 
  Network, 
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
  Play,
  Download,
  Bookmark,
  Code,
  Shield,
  Gamepad2,
  Brain,
  GitBranch,
  ArrowRight,
  Eye,
  MessageSquare,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ConvergenceStory {
  id: string;
  title: string;
  description: string;
  categories: ('tech' | 'security' | 'gaming')[];
  convergenceScore: number;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  imageUrl: string;
  relatedTechnologies: string[];
  impactAreas: string[];
}

interface Expert {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  expertise: ('tech' | 'security' | 'gaming')[];
  company: string;
  linkedin?: string;
  twitter?: string;
  featuredQuote: {
    quote: string;
    context: string;
  };
}

const convergenceStories: ConvergenceStory[] = [
  {
    id: '1',
    title: 'How Gaming Engines Are Revolutionizing Military Training',
    description: 'Unreal Engine and Unity are transforming military simulation and training programs, bringing game development expertise to defense applications.',
    categories: ['gaming', 'tech'],
    convergenceScore: 9,
    author: {
      name: 'Dr. Marcus Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      bio: 'Defense Technology Analyst'
    },
    publishedAt: '2026-02-20',
    readTime: 12,
    tags: ['military-tech', 'game-engines', 'simulation', 'defense'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726a?w=800&h=400&fit=crop',
    relatedTechnologies: ['Unreal Engine', 'Unity', 'VR/AR', 'Military Simulation'],
    impactAreas: ['Defense', 'Gaming', 'Enterprise Training']
  },
  {
    id: '2',
    title: 'AI-Powered Security: Lessons from Gaming Anti-Cheat Systems',
    description: 'Gaming industry\'s sophisticated anti-cheat systems are providing valuable insights for AI-powered cybersecurity solutions.',
    categories: ['gaming', 'security'],
    convergenceScore: 8,
    author: {
      name: 'Sarah Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c5ca?w=100&h=100&fit=crop&crop=face',
      bio: 'Cybersecurity Researcher'
    },
    publishedAt: '2026-02-18',
    readTime: 10,
    tags: ['ai-security', 'gaming-security', 'anti-cheat', 'machine-learning'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1560419015-9cdaa89e0c7c?w=800&h=400&fit=crop',
    relatedTechnologies: ['Machine Learning', 'Pattern Recognition', 'Behavioral Analysis'],
    impactAreas: ['Cybersecurity', 'Gaming', 'AI Development']
  },
  {
    id: '3',
    title: 'Blockchain Gaming: Where Tech Innovation Meets Security',
    description: 'The convergence of blockchain technology, gaming mechanics, and security protocols is creating new paradigms for digital ownership.',
    categories: ['tech', 'gaming', 'security'],
    convergenceScore: 10,
    author: {
      name: 'Alex Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Blockchain and Gaming Expert'
    },
    publishedAt: '2026-02-15',
    readTime: 15,
    tags: ['blockchain', 'gaming', 'security', 'web3', 'nft'],
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop',
    relatedTechnologies: ['Smart Contracts', 'NFTs', 'DeFi', 'Digital Identity'],
    impactAreas: ['Finance', 'Gaming', 'Security', 'Digital Rights']
  },
  {
    id: '4',
    title: 'Quantum Computing: Gaming\'s Role in Algorithm Development',
    description: 'Gaming optimization problems are driving quantum computing research, creating unexpected convergence between entertainment and cutting-edge physics.',
    categories: ['tech', 'gaming'],
    convergenceScore: 7,
    author: {
      name: 'Dr. Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      bio: 'Quantum Computing Researcher'
    },
    publishedAt: '2026-02-12',
    readTime: 18,
    tags: ['quantum-computing', 'gaming', 'algorithms', 'research'],
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
    relatedTechnologies: ['Quantum Algorithms', 'Game Theory', 'Optimization'],
    impactAreas: ['Research', 'Computing', 'Gaming']
  }
];

const experts: Expert[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    title: 'Chief Technology Officer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c5ca?w=100&h=100&fit=crop&crop=face',
    bio: 'Leading expert in AI convergence across gaming and security',
    expertise: ['tech', 'security', 'gaming'],
    company: 'Nexus Labs',
    linkedin: 'https://linkedin.com/in/sarahchen',
    twitter: '@drsarahchen',
    featuredQuote: {
      quote: 'The boundaries between industries are dissolving. Gaming tech is now enterprise security, and AI is everywhere.',
      context: 'On technology convergence trends'
    }
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    title: 'Security Research Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    bio: 'Specialist in gaming security and enterprise protection',
    expertise: ['security', 'gaming'],
    company: 'CyberDefense Corp',
    linkedin: 'https://linkedin.com/in/marcusrodriguez',
    twitter: '@marcussec',
    featuredQuote: {
      quote: 'Gaming companies are solving security problems that enterprises will face in 5 years.',
      context: 'On security innovation from gaming'
    }
  },
  {
    id: '3',
    name: 'Lisa Park',
    title: 'Game Development Director',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    bio: 'Pioneer in applying game development to enterprise solutions',
    expertise: ['tech', 'gaming'],
    company: 'Innovation Studios',
    linkedin: 'https://linkedin.com/in/lisapark',
    twitter: '@lisagamedev',
    featuredQuote: {
      quote: 'Game engines are the new operating systems for enterprise visualization.',
      context: 'On enterprise adoption of gaming tech'
    }
  }
];

export default function NexusIntersectionEnhanced() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tech' | 'security' | 'gaming'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStory, setSelectedStory] = useState<ConvergenceStory | null>(null);
  const [activeTab, setActiveTab] = useState<'stories' | 'venn' | 'experts' | 'trends'>('stories');
  const [vennSelection, setVennSelection] = useState<string[]>([]);
  const [convergenceScore, setConvergenceScore] = useState(0);

  const filteredStories = convergenceStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || story.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tech': return 'text-nexus-blue bg-nexus-blue/10 border-nexus-blue';
      case 'security': return 'text-threat-red bg-threat-red/10 border-threat-red';
      case 'gaming': return 'text-gaming-purple bg-gaming-purple/10 border-gaming-purple';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tech': return <Code className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'gaming': return <Gamepad2 className="w-4 h-4" />;
      default: return <Network className="w-4 h-4" />;
    }
  };

  const handleVennClick = (area: string) => {
    setVennSelection(prev => 
      prev.includes(area) 
        ? prev.filter(item => item !== area)
        : [...prev, area]
    );
  };

  const schemaData = useArticleSchema({
    headline: 'Nexus Intersection - Where Tech, Gaming & Security Converge',
    description: 'Explore the convergence of technology, gaming, and cybersecurity. Discover cross-industry innovations, emerging trends, and the future of interconnected tech ecosystems.',
    image: 'https://thegridnexus.com/og-nexus-intersection.jpg',
    url: 'https://thegridnexus.com/nexus-intersection',
    datePublished: '2026-02-24',
    dateModified: '2026-02-24',
    category: 'Technology Convergence',
    tags: ['tech convergence', 'gaming security', 'AI in gaming', 'cybersecurity for gamers', 'cross-industry tech trends'],
    wordCount: 1500,
    customFields: {
      isAccessibleForFree: true,
      audience: 'Technology Professionals and Innovation Leaders',
      about: 'Technology Industry Convergence and Innovation'
    }
  });

  return (
    <Layout>
      <SEOHead
        title="Nexus Intersection - Where Tech, Gaming & Security Converge"
        description="Explore the convergence of technology, gaming, and cybersecurity. Discover cross-industry innovations, emerging trends, and the future of interconnected tech ecosystems."
        keywords={[
          'tech convergence',
          'gaming security',
          'AI in gaming',
          'cybersecurity for gamers',
          'tech industry crossover',
          'how AI is transforming gaming and cybersecurity',
          'intersection of gaming technology and security',
          'cross-industry tech trends 2026',
          'gaming platforms security vulnerabilities and solutions',
          'how blockchain impacts gaming and tech security'
        ]}
        url="https://thegridnexus.com/nexus-intersection"
        type="website"
      />
      
      <SchemaMarkup type="Article" data={schemaData} />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Network className="w-12 h-12" />
                <h1 className="font-display font-bold text-5xl">Nexus Intersection</h1>
              </div>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Where technology, gaming, and security converge. Discover the innovations 
                happening at the intersection of industries and the future of cross-pollination.
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center justify-center gap-8 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  <span>{convergenceStories.length} Convergence Stories</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{experts.length} Expert Contributors</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>9.2 Avg Convergence Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  <span>3 Industry Overlaps</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search convergence stories..."
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
                <TabsTrigger value="stories">Stories</TabsTrigger>
                <TabsTrigger value="venn">Venn Diagram</TabsTrigger>
                <TabsTrigger value="experts">Experts</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Ad Placement */}
        <AdPlacement 
          position="header" 
          contentLength={filteredStories.length * 300}
          hasSubstantialContent={filteredStories.length > 0}
        />

        {/* Tab Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <TabsContent value="stories" className="space-y-8">
              {/* Category Filter */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Filter by category:</span>
                <div className="flex gap-2">
                  {['all', 'tech', 'security', 'gaming'].map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category as any)}
                    >
                      {getCategoryIcon(category)}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Convergence Stories Grid */}
              <div className="grid gap-8 md:grid-cols-2">
                {filteredStories.map((story) => (
                  <Card key={story.id} className="group hover:shadow-lg transition-all duration-300">
                    {story.featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-nexus-blue to-gaming-purple text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 mb-3">
                        {story.categories.map((category) => (
                          <div key={category} className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getCategoryColor(category)}`}>
                            {getCategoryIcon(category)}
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </div>
                        ))}
                        <div className="ml-auto flex items-center gap-1 text-sm font-medium">
                          <Target className="w-4 h-4" />
                          Score: {story.convergenceScore}/10
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl mb-2 group-hover:text-nexus-blue transition-colors">
                        <Link to={`/convergence/${story.id}`} className="hover:underline">
                          {story.title}
                        </Link>
                      </CardTitle>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{story.readTime} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{story.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>2.3K views</span>
                        </div>
                      </div>

                      <CardDescription className="text-base leading-relaxed mb-4">
                        {story.description}
                      </CardDescription>

                      {/* Featured Image */}
                      <div className="mb-4">
                        <img 
                          src={story.imageUrl} 
                          alt={story.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {story.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {story.tags.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{story.tags.length - 4} more
                            </Badge>
                          )}
                        </div>

                        {/* Related Technologies */}
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Related Technologies:</h4>
                          <div className="flex flex-wrap gap-2">
                            {story.relatedTechnologies.slice(0, 3).map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {story.relatedTechnologies.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{story.relatedTechnologies.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Impact Areas */}
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Impact Areas:</h4>
                          <div className="flex flex-wrap gap-2">
                            {story.impactAreas.map((area) => (
                              <Badge key={area} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedStory(story)}
                          >
                            Read Full Story
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="venn" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Network className="w-6 h-6" />
                    Interactive Venn Diagram
                  </CardTitle>
                  <CardDescription>
                    Click on areas to explore convergence points and related content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full h-96 bg-muted/30 rounded-lg p-8">
                    {/* Simplified Venn Diagram */}
                    <div className="relative w-full h-full">
                      {/* Tech Circle */}
                      <div 
                        className={`absolute top-8 left-8 w-32 h-32 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                          vennSelection.includes('tech') 
                            ? 'bg-nexus-blue/20 border-nexus-blue' 
                            : 'bg-nexus-blue/10 border-nexus-blue/50'
                        }`}
                        onClick={() => handleVennClick('tech')}
                      >
                        <div className="text-center">
                          <Code className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">Tech</span>
                        </div>
                      </div>

                      {/* Security Circle */}
                      <div 
                        className={`absolute top-8 right-8 w-32 h-32 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                          vennSelection.includes('security') 
                            ? 'bg-threat-red/20 border-threat-red' 
                            : 'bg-threat-red/10 border-threat-red/50'
                        }`}
                        onClick={() => handleVennClick('security')}
                      >
                        <div className="text-center">
                          <Shield className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">Security</span>
                        </div>
                      </div>

                      {/* Gaming Circle */}
                      <div 
                        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                          vennSelection.includes('gaming') 
                            ? 'bg-gaming-purple/20 border-gaming-purple' 
                            : 'bg-gaming-purple/10 border-gaming-purple/50'
                        }`}
                        onClick={() => handleVennClick('gaming')}
                      >
                        <div className="text-center">
                          <Gamepad2 className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">Gaming</span>
                        </div>
                      </div>

                      {/* Convergence Points */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <Brain className="w-8 h-8 mx-auto mb-2 text-nexus-blue" />
                        <span className="text-sm font-medium">Convergence</span>
                      </div>
                    </div>
                  </div>

                  {/* Selection Info */}
                  {vennSelection.length > 0 && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Selected Areas:</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {vennSelection.map((area) => (
                          <Badge key={area} className={getCategoryColor(area)}>
                            {getCategoryIcon(area)}
                            {area.charAt(0).toUpperCase() + area.slice(1)}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {vennSelection.length === 1 && 'Exploring single industry innovations...'}
                        {vennSelection.length === 2 && 'Discovering cross-industry convergence...'}
                        {vennSelection.length === 3 && 'Analyzing complete ecosystem integration...'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="experts" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {experts.map((expert) => (
                  <Card key={expert.id} className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={expert.avatar} 
                          alt={expert.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <CardTitle className="text-lg">{expert.name}</CardTitle>
                          <CardDescription>{expert.title}</CardDescription>
                          <p className="text-sm text-muted-foreground">{expert.company}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{expert.bio}</p>
                      
                      {/* Expertise Areas */}
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Expertise:</h4>
                        <div className="flex flex-wrap gap-2">
                          {expert.expertise.map((area) => (
                            <Badge key={area} className={getCategoryColor(area)}>
                              {getCategoryIcon(area)}
                              {area.charAt(0).toUpperCase() + area.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Featured Quote */}
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <blockquote className="text-sm italic mb-2">
                          "{expert.featuredQuote.quote}"
                        </blockquote>
                        <cite className="text-xs text-muted-foreground">
                          — {expert.featuredQuote.context}
                        </cite>
                      </div>

                      {/* Social Links */}
                      <div className="flex items-center gap-4 pt-4 border-t border-border">
                        {expert.linkedin && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={expert.linkedin} target="_blank" rel="noopener noreferrer">
                              LinkedIn
                            </a>
                          </Button>
                        )}
                        {expert.twitter && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`https://twitter.com/${expert.twitter}`} target="_blank" rel="noopener noreferrer">
                              Twitter
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Convergence Trends
                  </CardTitle>
                  <CardDescription>
                    Real-time tracking of cross-industry technology trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        title: 'AI-Driven Security from Gaming',
                        description: 'Gaming anti-cheat systems are pioneering AI-powered security solutions',
                        trend: 'rising',
                        impact: 'high'
                      },
                      {
                        title: 'Game Engines in Enterprise',
                        description: 'Unity and Unreal Engine adoption for corporate training and simulation',
                        trend: 'stable',
                        impact: 'medium'
                      },
                      {
                        title: 'Blockchain Gaming Convergence',
                        description: 'Web3 gaming platforms merging entertainment with security',
                        trend: 'emerging',
                        impact: 'high'
                      }
                    ].map((trend, index) => (
                      <div key={index} className="border-l-4 border-nexus-blue pl-4">
                        <h4 className="font-semibold mb-2">{trend.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{trend.description}</p>
                        <div className="flex items-center gap-4">
                          <Badge className={
                            trend.trend === 'rising' ? 'bg-security-green' :
                            trend.trend === 'stable' ? 'bg-yellow-500' : 'bg-nexus-blue'
                          }>
                            {trend.trend.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            Impact: {trend.impact}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>

        {/* Mid-Content Ad */}
        <AdPlacement 
          position="between-content" 
          contentLength={filteredStories.length * 300}
          hasSubstantialContent={filteredStories.length > 2}
        />

        {/* Call to Action Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display font-bold text-3xl mb-4">
                Join the Convergence Community
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Connect with experts, share your convergence stories, and stay ahead of cross-industry innovations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="text-lg px-8">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Share Your Story
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Users className="w-5 h-5 mr-2" />
                  Join Expert Network
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Ad */}
        <AdPlacement 
          position="footer" 
          contentLength={filteredStories.length * 300}
          hasSubstantialContent={filteredStories.length > 0}
        />
      </div>
    </Layout>
  );
}
