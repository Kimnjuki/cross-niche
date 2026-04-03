/**
 * Nexus Pulse - Real-time AI Tech News Feed
 * 
 * A live feed of AI, cybersecurity, and gaming news with AI-powered
 * analysis, sentiment tracking, and relevance scoring.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  RefreshCw,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Share2,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Sparkles,
  Zap,
  Globe,
  Shield,
  Cpu,
  Gamepad2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet';

interface PulseStory {
  _id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: number;
  category: 'ai' | 'cybersecurity' | 'gaming' | 'general_tech';
  sentiment: 'positive' | 'neutral' | 'negative';
  relevanceScore: number;
  aiSummary?: string;
  keyPoints?: string[];
  relatedArticles?: string[];
  isBreaking?: boolean;
  engagementScore?: number;
}

const categories = [
  { id: 'all', label: 'All', icon: Globe },
  { id: 'ai', label: 'AI/ML', icon: Cpu },
  { id: 'cybersecurity', label: 'Security', icon: Shield },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
];

const timeFilters = [
  { id: '1h', label: 'Last Hour' },
  { id: '6h', label: 'Last 6 Hours' },
  { id: '24h', label: 'Last 24 Hours' },
  { id: '7d', label: 'Last 7 Days' },
];

export default function NexusPulsePage() {
  const [stories, setStories] = useState<PulseStory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTimeFilter, setActiveTimeFilter] = useState('24h');
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [bookmarkedStories, setBookmarkedStories] = useState<Set<string>>(new Set());

  // Generate mock stories
  const generateMockStories = (): PulseStory[] => {
    const mockStories: PulseStory[] = [
      {
        _id: '1',
        title: 'OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities',
        url: '#',
        source: 'TechCrunch',
        publishedAt: Date.now() - 3600000,
        category: 'ai',
        sentiment: 'positive',
        relevanceScore: 95,
        aiSummary: 'OpenAI has unveiled GPT-5, featuring significantly improved reasoning capabilities and reduced hallucinations. The model shows 40% improvement on benchmark tests.',
        keyPoints: [
          '40% improvement on reasoning benchmarks',
          'Reduced hallucination rate by 60%',
          'New multimodal capabilities',
          'Available in beta next month',
        ],
        isBreaking: true,
        engagementScore: 98,
      },
      {
        _id: '2',
        title: 'Critical Zero-Day Vulnerability Found in Popular Cloud Platform',
        url: '#',
        source: 'The Hacker News',
        publishedAt: Date.now() - 7200000,
        category: 'cybersecurity',
        sentiment: 'negative',
        relevanceScore: 92,
        aiSummary: 'A critical zero-day vulnerability (CVE-2026-XXXX) has been discovered affecting millions of cloud deployments. Immediate patching is recommended.',
        keyPoints: [
          'CVSS score: 9.8 (Critical)',
          'Affects AWS, Azure, and GCP deployments',
          'Patch available now',
          'No known active exploitation yet',
        ],
        isBreaking: true,
        engagementScore: 95,
      },
      {
        _id: '3',
        title: 'NVIDIA Unveils Next-Gen Gaming GPU with AI-Powered Ray Tracing',
        url: '#',
        source: 'IGN',
        publishedAt: Date.now() - 10800000,
        category: 'gaming',
        sentiment: 'positive',
        relevanceScore: 88,
        aiSummary: 'NVIDIA has announced its RTX 5090 with dedicated AI cores for real-time ray tracing enhancement, promising 3x performance improvement.',
        keyPoints: [
          '3x performance improvement over RTX 4090',
          'AI-powered DLSS 4.0',
          '24GB GDDR7 memory',
          'Available Q3 2026',
        ],
        engagementScore: 92,
      },
      {
        _id: '4',
        title: 'Google DeepMind Achieves Breakthrough in Protein Folding',
        url: '#',
        source: 'Nature',
        publishedAt: Date.now() - 14400000,
        category: 'ai',
        sentiment: 'positive',
        relevanceScore: 85,
        aiSummary: 'DeepMind\'s AlphaFold 3 can now predict protein-drug interactions with 95% accuracy, potentially revolutionizing drug discovery.',
        keyPoints: [
          '95% accuracy in protein-drug prediction',
          'Could accelerate drug discovery by 10x',
          'Open-sourced for academic research',
        ],
        engagementScore: 88,
      },
      {
        _id: '5',
        title: 'Major Data Breach Exposes 50 Million User Records',
        url: '#',
        source: 'BleepingComputer',
        publishedAt: Date.now() - 18000000,
        category: 'cybersecurity',
        sentiment: 'negative',
        relevanceScore: 82,
        aiSummary: 'A sophisticated attack on a major tech company has compromised personal data of 50 million users, including emails and hashed passwords.',
        keyPoints: [
          '50 million users affected',
          'Email and password data exposed',
          'Attack originated from state-sponsored group',
          'Users advised to change passwords immediately',
        ],
        engagementScore: 85,
      },
      {
        _id: '6',
        title: 'Epic Games Announces Unreal Engine 6 with AI-Assisted Development',
        url: '#',
        source: 'GameDeveloper',
        publishedAt: Date.now() - 21600000,
        category: 'gaming',
        sentiment: 'positive',
        relevanceScore: 78,
        aiSummary: 'Unreal Engine 6 introduces AI-assisted level design and character animation tools, dramatically reducing development time.',
        keyPoints: [
          'AI-assisted level design',
          'Automated character animation',
          '50% faster development cycles',
          'Beta access starting 2027',
        ],
        engagementScore: 82,
      },
    ];

    return mockStories;
  };

  const fetchStories = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStories(generateMockStories());
    setLastUpdated(Date.now());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchStories();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchStories, 300000);
    return () => clearInterval(interval);
  }, []);

  const toggleBookmark = (storyId: string) => {
    setBookmarkedStories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'negative':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'cybersecurity':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'gaming':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredStories = stories.filter((story) => {
    if (activeCategory !== 'all' && story.category !== activeCategory) return false;
    return true;
  });

  const breakingStories = filteredStories.filter((s) => s.isBreaking);
  const regularStories = filteredStories.filter((s) => !s.isBreaking);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <Helmet>
        <title>Nexus Pulse - Real-time AI & Tech News | The Grid Nexus</title>
        <meta
          name="description"
          content="Stay updated with real-time AI, cybersecurity, and gaming news. AI-powered analysis, sentiment tracking, and relevance scoring for tech professionals."
        />
        <meta
          name="keywords"
          content="tech news, AI news, cybersecurity news, gaming news, real-time news feed, AI analysis"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Nexus Pulse',
            description: 'Real-time AI-powered tech news feed',
            publishPrinciple: 'Live news aggregation with AI analysis',
          })}
        </script>
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Nexus Pulse</h1>
                <p className="text-sm text-muted-foreground">Real-time Tech Intelligence</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              AI-curated news from 500+ sources. Breaking alerts, sentiment analysis, and
              personalized relevance scoring.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStories}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              Refresh
            </Button>
            <div className="text-sm text-muted-foreground">
              Updated {formatTimeAgo(lastUpdated)}
            </div>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-sm font-medium text-red-600">LIVE</span>
          <span className="text-sm text-muted-foreground ml-2">
            {stories.length} stories tracked
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList>
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {cat.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={activeTimeFilter}
              onChange={(e) => setActiveTimeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-md border bg-background text-sm"
            >
              {timeFilters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Breaking News */}
        {breakingStories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Breaking News
            </h2>
            <div className="grid gap-4">
              {breakingStories.map((story) => (
                <Card key={story._id} className="border-red-200 bg-red-50/30 dark:bg-red-950/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="destructive" className="text-xs">
                            BREAKING
                          </Badge>
                          <Badge className={getCategoryColor(story.category)} variant="secondary">
                            {story.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {story.source} • {formatTimeAgo(story.publishedAt)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{story.title}</h3>
                        {story.aiSummary && (
                          <div className="flex items-start gap-2 mb-3">
                            <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{story.aiSummary}</p>
                          </div>
                        )}
                        {story.keyPoints && (
                          <ul className="space-y-1 mb-3">
                            {story.keyPoints.map((point, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="flex items-center gap-3">
                          <Button size="sm" variant="outline" asChild>
                            <a href={story.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Read More
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleBookmark(story._id)}
                          >
                            <Bookmark
                              className={cn(
                                'h-4 w-4 mr-2',
                                bookmarkedStories.has(story._id) && 'fill-current text-yellow-500'
                              )}
                            />
                            Save
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-purple-500" />
                          <span className="font-bold text-purple-600">{story.relevanceScore}</span>
                        </div>
                        <Badge className={getSentimentColor(story.sentiment)}>
                          {story.sentiment}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Stories */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Latest Stories</h2>
          <div className="grid gap-4">
            {regularStories.map((story) => (
              <Card key={story._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={getCategoryColor(story.category)} variant="secondary">
                          {story.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {story.source} • {formatTimeAgo(story.publishedAt)}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {story.engagementScore}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2">{story.title}</h3>
                      {story.aiSummary && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {story.aiSummary}
                        </p>
                      )}
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="outline" asChild>
                          <a href={story.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Read
                          </a>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleBookmark(story._id)}
                        >
                          <Bookmark
                            className={cn(
                              'h-4 w-4',
                              bookmarkedStories.has(story._id) && 'fill-current text-yellow-500'
                            )}
                          />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getSentimentColor(story.sentiment)}>
                        {story.sentiment}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Relevance: {story.relevanceScore}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && stories.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading stories...</span>
          </div>
        )}
      </div>
    </div>
  );
}