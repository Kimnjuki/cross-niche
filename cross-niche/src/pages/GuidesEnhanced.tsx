/**
 * TheGridNexus Comprehensive Enhanced Guides Page
 * JSON specification implementation with full SEO optimization and interactive features
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { SchemaMarkup, useArticleSchema } from '@/components/seo/SchemaMarkup';
import { OpenGraph, useArticleOpenGraph } from '@/components/seo/OpenGraph';
import { AdPlacement } from '@/components/ads/AdPlacement';
import { 
  BookOpen, 
  Clock, 
  Filter, 
  Search, 
  Star, 
  TrendingUp,
  Play,
  Download,
  Bookmark,
  ChevronRight,
  Code,
  Shield,
  Gamepad2,
  Zap,
  Users,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Award,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface Guide {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: 'tech' | 'security' | 'gaming';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  wordCount: number;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  tags: string[];
  featured: boolean;
  lastUpdated: string;
  prerequisites: string[];
  learningObjectives: string[];
  hasVideo: boolean;
  hasCodePlayground: boolean;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  estimatedTime?: string;
  tools?: string[];
}

const comprehensiveGuides: Guide[] = [
  {
    id: '1',
    title: 'Complete Guide to Zero Trust Security Architecture',
    slug: '/guides/zero-trust-security-architecture',
    description: 'Master zero trust security principles with our comprehensive 2026 guide. Learn implementation strategies, best practices, and real-world deployment scenarios for enterprise environments.',
    category: 'security',
    difficulty: 'advanced',
    readTime: 25,
    wordCount: 3200,
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c5ca?w=100&h=100&fit=crop&crop=face',
      bio: 'Senior Security Architect with 15+ years experience'
    },
    tags: ['zero-trust', 'security-architecture', 'enterprise-security', 'iam'],
    featured: true,
    lastUpdated: '2026-02-15',
    prerequisites: ['Basic networking knowledge', 'Understanding of security principles'],
    learningObjectives: [
      'Design zero trust architecture',
      'Implement identity verification',
      'Configure network segmentation',
      'Monitor and maintain zero trust'
    ],
    hasVideo: true,
    hasCodePlayground: false,
    downloadCount: 1247,
    rating: 4.8,
    reviewCount: 89,
    estimatedTime: '3-4 hours',
    tools: ['Microsoft Azure AD', 'Okta', 'Zscaler', 'Palo Alto Networks']
  },
  {
    id: '2',
    title: 'Building a Gaming PC: Step-by-Step Guide 2026',
    slug: '/guides/building-gaming-pc-2026',
    description: 'Complete guide to building a high-performance gaming PC from scratch. Component selection, assembly, optimization, and troubleshooting for optimal gaming experience.',
    category: 'gaming',
    difficulty: 'intermediate',
    readTime: 18,
    wordCount: 2400,
    author: {
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      bio: 'PC Building Expert and Hardware Enthusiast'
    },
    tags: ['pc-building', 'gaming-hardware', 'component-selection', 'optimization'],
    featured: true,
    lastUpdated: '2026-02-12',
    prerequisites: ['Basic hardware knowledge', 'Understanding of PC components'],
    learningObjectives: [
      'Select compatible components',
      'Assemble PC step-by-step',
      'Install OS and drivers',
      'Optimize for gaming performance'
    ],
    hasVideo: true,
    hasCodePlayground: false,
    downloadCount: 2156,
    rating: 4.9,
    reviewCount: 156,
    estimatedTime: '2-3 hours',
    tools: ['PCPartPicker', 'CPU-Z', 'GPU-Z', '3DMark']
  },
  {
    id: '3',
    title: 'Machine Learning Implementation for Beginners',
    slug: '/guides/machine-learning-beginners-2026',
    description: 'Start your ML journey with this beginner-friendly guide. Learn core concepts, implement first models, and understand real-world applications with hands-on examples.',
    category: 'tech',
    difficulty: 'beginner',
    readTime: 22,
    wordCount: 2800,
    author: {
      name: 'Dr. Emily Watson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      bio: 'ML Research Scientist and Educator'
    },
    tags: ['machine-learning', 'ai', 'python', 'data-science'],
    featured: true,
    lastUpdated: '2026-02-18',
    prerequisites: ['Basic Python knowledge', 'Understanding of statistics'],
    learningObjectives: [
      'Understand ML fundamentals',
      'Implement basic algorithms',
      'Work with popular frameworks',
      'Evaluate model performance'
    ],
    hasVideo: true,
    hasCodePlayground: true,
    downloadCount: 3421,
    rating: 4.7,
    reviewCount: 234,
    estimatedTime: '4-5 hours',
    tools: ['Python', 'TensorFlow', 'Scikit-learn', 'Jupyter Notebook']
  },
  {
    id: '4',
    title: 'Network Security: Protecting Against Ransomware 2026',
    slug: '/guides/ransomware-protection-2026',
    description: 'Comprehensive guide to ransomware protection. Learn attack vectors, prevention strategies, and incident response procedures for modern ransomware threats.',
    category: 'security',
    difficulty: 'intermediate',
    readTime: 20,
    wordCount: 2600,
    author: {
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Cybersecurity Consultant and Incident Responder'
    },
    tags: ['ransomware', 'malware-protection', 'incident-response', 'backup-strategies'],
    featured: false,
    lastUpdated: '2026-02-10',
    prerequisites: ['Basic security knowledge', 'Understanding of malware'],
    learningObjectives: [
      'Identify ransomware variants',
      'Implement protection measures',
      'Create backup strategies',
      'Respond to incidents effectively'
    ],
    hasVideo: true,
    hasCodePlayground: false,
    downloadCount: 1876,
    rating: 4.6,
    reviewCount: 127,
    estimatedTime: '2-3 hours',
    tools: ['Veeam', 'Acronis', 'CrowdStrike', 'Carbon Black']
  },
  {
    id: '5',
    title: 'Game Performance Optimization for Low-End PCs',
    slug: '/guides/low-end-pc-optimization-2026',
    description: 'Maximize gaming performance on budget hardware. Advanced optimization techniques, settings tweaks, and hardware upgrades for smooth gaming.',
    category: 'gaming',
    difficulty: 'intermediate',
    readTime: 15,
    wordCount: 1900,
    author: {
      name: 'Jake Park',
      avatar: 'https://images.unsplash.com/photo-1507591064342-4c6ce005b128?w=100&h=100&fit=crop&crop=face',
      bio: 'Gaming Performance Specialist'
    },
    tags: ['performance-optimization', 'low-end-gaming', 'settings', 'hardware-upgrades'],
    featured: false,
    lastUpdated: '2026-02-08',
    prerequisites: ['Basic PC knowledge', 'Gaming experience'],
    learningObjectives: [
      'Optimize in-game settings',
      'Tweak system configuration',
      'Choose cost-effective upgrades',
      'Monitor performance metrics'
    ],
    hasVideo: true,
    hasCodePlayground: false,
    downloadCount: 2987,
    rating: 4.8,
    reviewCount: 198,
    estimatedTime: '1-2 hours',
    tools: ['MSI Afterburner', 'NVIDIA Profile Inspector', 'Process Lasso', 'Game Booster']
  },
  {
    id: '6',
    title: 'AI Integration in Business: Complete Implementation Guide',
    slug: '/guides/ai-business-integration-2026',
    description: 'Strategic guide to implementing AI in business operations. From planning to deployment and scaling for maximum ROI and competitive advantage.',
    category: 'tech',
    difficulty: 'advanced',
    readTime: 30,
    wordCount: 3800,
    author: {
      name: 'Lisa Chang',
      avatar: 'https://images.unsplash.com/photo-1580489945144-8923d9b3b2a5?w=100&h=100&fit=crop&crop=face',
      bio: 'AI Strategy Consultant and Enterprise Architect'
    },
    tags: ['ai-integration', 'business-ai', 'digital-transformation', 'roi'],
    featured: true,
    lastUpdated: '2026-02-20',
    prerequisites: ['Business management experience', 'Basic AI knowledge'],
    learningObjectives: [
      'Develop AI strategy',
      'Select appropriate solutions',
      'Manage implementation projects',
      'Measure AI ROI and impact'
    ],
    hasVideo: true,
    hasCodePlayground: false,
    downloadCount: 1567,
    rating: 4.9,
    reviewCount: 112,
    estimatedTime: '5-6 hours',
    tools: ['OpenAI API', 'Microsoft Azure AI', 'Google Cloud AI', 'AWS SageMaker']
  }
];

export default function GuidesEnhanced() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tech' | 'security' | 'gaming'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'recent' | 'popular'>('featured');
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>(comprehensiveGuides);
  const [readingProgress, setReadingProgress] = useState(0);
  const [savedGuides, setSavedGuides] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    // Filter guides based on search and filters
    let filtered = comprehensiveGuides.filter(guide => {
      const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || guide.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort guides
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'popular':
          return b.downloadCount - a.downloadCount;
        default:
          return 0;
      }
    });

    setFilteredGuides(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  useEffect(() => {
    // Reading progress simulation
    const interval = setInterval(() => {
      setReadingProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tech': return <Code className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'gaming': return <Gamepad2 className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tech': return 'text-nexus-blue bg-nexus-blue/10 border-nexus-blue';
      case 'security': return 'text-threat-red bg-threat-red/10 border-threat-red';
      case 'gaming': return 'text-gaming-purple bg-gaming-purple/10 border-gaming-purple';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-security-green text-white';
      case 'intermediate': return 'bg-yellow-500 text-black';
      case 'advanced': return 'bg-threat-red text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const toggleSaveGuide = (guideId: string) => {
    setSavedGuides(prev => 
      prev.includes(guideId) 
        ? prev.filter(id => id !== guideId)
        : [...prev, guideId]
    );
  };

  const schemaData = useArticleSchema({
    headline: 'Comprehensive Tech Guides 2026 - The Grid Nexus',
    description: 'Master technology, cybersecurity, and gaming with our expert guides. Step-by-step tutorials, interactive features, and proven strategies.',
    image: 'https://thegridnexus.com/og-guides.jpg',
    url: 'https://thegridnexus.com/guides',
    datePublished: '2026-02-24',
    dateModified: '2026-02-24',
    category: 'Technology Guides',
    tags: ['tech guides 2026', 'gaming tutorials', 'cybersecurity how-to', 'AI implementation guides', 'tech learning resources'],
    wordCount: filteredGuides.reduce((acc, guide) => acc + guide.wordCount, 0),
    customFields: {
      isAccessibleForFree: true,
      audience: 'Technology Professionals and Enthusiasts',
      about: 'Technology Education and Training'
    }
  });

  const openGraphData = useArticleOpenGraph({
    title: 'Comprehensive Tech Guides 2026 - The Grid Nexus',
    description: 'Master technology, cybersecurity, and gaming with our expert guides. Step-by-step tutorials, interactive features, and proven strategies.',
    image: 'https://thegridnexus.com/og-guides.jpg',
    url: 'https://thegridnexus.com/guides',
    type: 'website',
    article: {
      publishedTime: '2026-02-24T00:00:00Z',
      modifiedTime: '2026-02-24T00:00:00Z',
      author: 'The Grid Nexus Editorial Team',
      section: 'Guides',
      tags: ['tech guides 2026', 'gaming tutorials', 'cybersecurity how-to', 'AI implementation guides']
    }
  });

  return (
    <Layout>
      <SEOHead
        title="Comprehensive Tech Guides 2026 - The Grid Nexus"
        description="Master technology, cybersecurity, and gaming with our expert guides. Step-by-step tutorials, interactive features, and proven strategies. Updated February 2026."
        keywords={[
          'tech guides 2026',
          'gaming tutorials',
          'cybersecurity how-to',
          'AI implementation guides',
          'tech learning resources',
          'how to secure your network from ransomware attacks 2026',
          'step by step guide to building gaming pc',
          'best practices for AI integration in business',
          'complete guide to understanding zero trust security',
          'beginner friendly machine learning tutorial',
          'how to optimize game performance on low end pc',
          'comprehensive guide to cloud security architecture',
          'what is breach and attack simulation explained',
          'how to protect against phishing attacks for beginners'
        ]}
        url="https://thegridnexus.com/guides"
        type="website"
      />
      
      <SchemaMarkup type="Article" data={schemaData} />
      <OpenGraph {...openGraphData} />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-border z-50">
        <div 
          className="h-full bg-nexus-blue transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-nexus-blue via-security-green to-gaming-purple text-white">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <BookOpen className="w-12 h-12" />
                <h1 className="font-display font-bold text-5xl">Comprehensive Guides</h1>
              </div>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Master technology, cybersecurity, and gaming with our expert-crafted guides. 
                Interactive features, step-by-step tutorials, and proven strategies for 2026.
              </p>
              
              {/* Quick Stats */}
              <div className="flex items-center justify-center gap-8 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{filteredGuides.length} Expert Guides</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>4.8 Avg Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>15K+ Downloads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  <span>Video Tutorials</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Expert Authored</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search guides... (e.g., 'zero trust', 'PC building', 'machine learning')"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
              </div>

              {/* Quick Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <Badge className="bg-white/20 text-white hover:bg-white/30 cursor-pointer transition-colors">
                  <Zap className="w-3 h-3 mr-1" />
                  Trending: Zero Trust
                </Badge>
                <Badge className="bg-white/20 text-white hover:bg-white/30 cursor-pointer transition-colors">
                  <Zap className="w-3 h-3 mr-1" />
                  Popular: PC Building
                </Badge>
                <Badge className="bg-white/20 text-white hover:bg-white/30 cursor-pointer transition-colors">
                  <Zap className="w-3 h-3 mr-1" />
                  New: AI Integration
                </Badge>
                <Badge className="bg-white/20 text-white hover:bg-white/30 cursor-pointer transition-colors">
                  <Target className="w-3 h-3 mr-1" />
                  Featured: Ransomware Protection
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Filter Controls */}
        <section className="border-b border-border bg-muted/30 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filter & Sort</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {showAdvancedFilters ? 'Simple' : 'Advanced'}
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-6">
              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Category:</span>
                <div className="flex gap-2">
                  {['all', 'tech', 'security', 'gaming'].map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category as any)}
                      className="flex items-center gap-2"
                    >
                      {getCategoryIcon(category)}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Difficulty:</span>
                <div className="flex gap-2">
                  {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty as any)}
                    >
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Sort by:</span>
                <div className="flex gap-2">
                  {[
                    { value: 'featured', label: 'Featured' },
                    { value: 'rating', label: 'Rating' },
                    { value: 'recent', label: 'Recent' },
                    { value: 'popular', label: 'Popular' }
                  ].map((sort) => (
                    <Button
                      key={sort.value}
                      variant={sortBy === sort.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy(sort.value as any)}
                    >
                      {sort.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Reading Time</label>
                    <select className="w-full p-2 border border-border rounded-md">
                      <option value="">Any</option>
                      <option value="0-15">Under 15 min</option>
                      <option value="15-30">15-30 min</option>
                      <option value="30+">Over 30 min</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Features</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">Video Tutorials</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">Code Playground</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">PDF Download</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Author Level</label>
                    <select className="w-full p-2 border border-border rounded-md">
                      <option value="">Any</option>
                      <option value="expert">Expert Only</option>
                      <option value="professional">Professional</option>
                      <option value="community">Community</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Ad Placement */}
        <AdPlacement 
          position="header" 
          contentLength={filteredGuides.reduce((acc, guide) => acc + guide.wordCount, 0)}
          hasSubstantialContent={filteredGuides.length > 0}
        />

        {/* Guides Grid */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {filteredGuides.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No guides found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredGuides.map((guide) => (
                  <Card key={guide.id} className="group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    {guide.featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-nexus-blue to-security-green text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getCategoryColor(guide.category)}`}>
                          {getCategoryIcon(guide.category)}
                          {guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSaveGuide(guide.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Bookmark className={`w-4 h-4 ${savedGuides.includes(guide.id) ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      
                      <CardTitle className="text-xl mb-2 group-hover:text-nexus-blue transition-colors pr-20">
                        <Link to={guide.slug} className="hover:underline">
                          {guide.title}
                        </Link>
                      </CardTitle>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{guide.readTime} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{guide.rating} ({guide.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span>{guide.downloadCount.toLocaleString()}</span>
                        </div>
                        {guide.estimatedTime && (
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{guide.estimatedTime}</span>
                          </div>
                        )}
                      </div>

                      <CardDescription className="text-base leading-relaxed">
                        {guide.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {guide.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {guide.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{guide.tags.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Features */}
                        <div className="flex items-center gap-4 text-sm">
                          {guide.hasVideo && (
                            <div className="flex items-center gap-1 text-nexus-blue">
                              <Play className="w-4 h-4" />
                              <span>Video</span>
                            </div>
                          )}
                          {guide.hasCodePlayground && (
                            <div className="flex items-center gap-1 text-nexus-blue">
                              <Code className="w-4 h-4" />
                              <span>Interactive</span>
                            </div>
                          )}
                          <div className={`px-2 py-1 rounded text-xs ${getDifficultyColor(guide.difficulty)}`}>
                            {guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1)}
                          </div>
                        </div>

                        {/* Learning Objectives */}
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            You'll learn:
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {guide.learningObjectives.slice(0, 2).map((objective, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-3 h-3 text-security-green mt-0.5 flex-shrink-0" />
                                <span>{objective}</span>
                              </li>
                            ))}
                            {guide.learningObjectives.length > 2 && (
                              <li className="text-nexus-blue">
                                +{guide.learningObjectives.length - 2} more objectives
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Tools */}
                        {guide.tools && guide.tools.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              Tools Covered:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {guide.tools.slice(0, 3).map((tool) => (
                                <Badge key={tool} variant="outline" className="text-xs">
                                  {tool}
                                </Badge>
                              ))}
                              {guide.tools.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{guide.tools.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-3 border-t border-border">
                          <img 
                            src={guide.author.avatar} 
                            alt={guide.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{guide.author.name}</p>
                            <p className="text-xs text-muted-foreground">{guide.author.bio}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-nexus-blue transition-colors" />
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
          contentLength={filteredGuides.reduce((acc, guide) => acc + guide.wordCount, 0)}
          hasSubstantialContent={filteredGuides.length > 3}
        />

        {/* Call to Action Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display font-bold text-3xl mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                We're constantly adding new guides. Get notified when we publish content that matches your interests.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="text-lg px-8">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Suggest a Guide Topic
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Users className="w-5 h-5 mr-2" />
                  Join Our Community
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Ad */}
        <AdPlacement 
          position="footer" 
          contentLength={filteredGuides.reduce((acc, guide) => acc + guide.wordCount, 0)}
          hasSubstantialContent={filteredGuides.length > 0}
        />
      </div>
    </Layout>
  );
}
