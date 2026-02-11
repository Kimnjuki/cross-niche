import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { TrendingTopicsWidget } from '@/components/home/TrendingTopicsWidget';
import { SEOHead } from '@/components/seo/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, TrendingUp, Search, Filter, X, Clock, Eye, ArrowRight, Sparkles, BarChart3, Users, Zap, Globe, Target, Calendar, Download, Share2, BookmarkPlus, RefreshCw, ChevronRight, Star, Flame, Rocket } from 'lucide-react';
import { usePublishedContent, useTrendingContent } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { formatRelativeTime } from '@/lib/timeUtils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Article } from '@/types';

// High-volume keywords organized by category
const keywordCategories = {
  'Artificial Intelligence & Machine Learning': [
    { keyword: 'artificial intelligence', volume: '350K', href: '/tech?q=artificial+intelligence' },
    { keyword: 'machine learning', volume: '350K', href: '/tech?q=machine+learning' },
    { keyword: 'AI technology', volume: 'High', href: '/tech?q=ai' },
    { keyword: 'deep learning', volume: 'High', href: '/tech?q=deep+learning' },
    { keyword: 'neural networks', volume: 'High', href: '/tech?q=neural+networks' },
    { keyword: 'natural language processing', volume: 'High', href: '/tech?q=nlp' },
  ],
  'Cybersecurity & Privacy': [
    { keyword: 'cybersecurity', volume: '150K', href: '/security?q=cybersecurity' },
    { keyword: 'cyber security', volume: '110K', href: '/security?q=cyber+security' },
    { keyword: 'data privacy', volume: '110K', href: '/security?q=data+privacy' },
    { keyword: 'network security', volume: '9.9K', href: '/security?q=network+security' },
    { keyword: 'cyber security news', volume: 'High', href: '/security?filter=latest' },
    { keyword: 'cybersecurity threats latest', volume: 'High', href: '/security?filter=threats' },
    { keyword: 'ransomware protection', volume: 'High', href: '/security?q=ransomware' },
    { keyword: 'zero trust security', volume: 'High', href: '/security?q=zero+trust' },
  ],
  'Cloud & Infrastructure': [
    { keyword: 'cloud computing', volume: '250K', href: '/tech?q=cloud+computing' },
    { keyword: 'big data', volume: '180K', href: '/tech?q=big+data' },
    { keyword: 'internet of things', volume: '200K', href: '/tech?q=iot' },
    { keyword: 'edge computing', volume: 'High', href: '/tech?q=edge+computing' },
    { keyword: 'serverless architecture', volume: 'High', href: '/tech?q=serverless' },
  ],
  'Emerging Technologies': [
    { keyword: 'blockchain', volume: '140K', href: '/tech?q=blockchain' },
    { keyword: 'quantum computing', volume: '70K', href: '/tech?q=quantum+computing' },
    { keyword: 'robotics', volume: '150K', href: '/tech?q=robotics' },
    { keyword: 'virtual reality', volume: '120K', href: '/gaming?q=virtual+reality' },
    { keyword: 'augmented reality', volume: 'High', href: '/gaming?q=ar' },
    { keyword: 'metaverse', volume: 'High', href: '/gaming?q=metaverse' },
  ],
  'Gaming & Entertainment': [
    { keyword: 'gaming', volume: '200K', href: '/gaming' },
    { keyword: 'gaming news', volume: 'High', href: '/gaming?filter=latest' },
    { keyword: 'gaming hardware', volume: 'High', href: '/gaming?q=hardware' },
    { keyword: 'esports', volume: 'High', href: '/gaming?q=esports' },
    { keyword: 'game development', volume: 'High', href: '/gaming?q=game+development' },
  ],
  'Tech News & Trends': [
    { keyword: 'latest tech news', volume: '14.8K', href: '/tech?filter=latest' },
    { keyword: 'technology trends', volume: '14.8K', href: '/tech?filter=trends' },
    { keyword: 'tech innovations 2026', volume: 'High', href: '/tech?filter=innovations' },
    { keyword: 'startup news', volume: 'High', href: '/tech?q=startup' },
  ],
};

export default function Topics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'trending' | 'recent' | 'popular'>('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const [savedTopics, setSavedTopics] = useState<string[]>([]);
  
  const { data: allContent, isLoading: loadingContent } = usePublishedContent(100);
  const { data: trendingContent, isLoading: loadingTrending } = useTrendingContent(10);
  
  const allArticles = allContent ? mapContentToArticles(allContent) : [];
  const trendingArticles = trendingContent ? mapContentToArticles(trendingContent) : [];

  // Filter articles by keyword if query exists
  const filteredArticles = useMemo(() => {
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    return allArticles.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.excerpt?.toLowerCase().includes(lowerQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      article.niche?.toLowerCase().includes(lowerQuery)
    );
  }, [query, allArticles]);

  // Filter and sort articles
  const processedArticles = useMemo(() => {
    let articles = query ? filteredArticles : allArticles;
    
    // Sort articles
    switch (sortBy) {
      case 'trending':
        articles.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'recent':
        articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'popular':
        articles.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'relevance':
      default:
        if (query) {
          articles.sort((a, b) => {
            const aScore = getRelevanceScore(a, query);
            const bScore = getRelevanceScore(b, query);
            return bScore - aScore;
          });
        }
        break;
    }
    
    return articles;
  }, [query, filteredArticles, allArticles, sortBy]);

  // Calculate relevance score for search
  const getRelevanceScore = (article: Article, query: string): number => {
    const lowerQuery = query.toLowerCase();
    let score = 0;
    
    if (article.title.toLowerCase().includes(lowerQuery)) score += 10;
    if (article.excerpt?.toLowerCase().includes(lowerQuery)) score += 5;
    if (article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) score += 3;
    if (article.niche?.toLowerCase().includes(lowerQuery)) score += 2;
    
    return score;
  };

  // Toggle saved topic
  const toggleSavedTopic = (keyword: string) => {
    setSavedTopics(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  // Get topic statistics
  const getTopicStats = (keyword: string) => {
    const relatedArticles = allArticles.filter(article => 
      article.title.toLowerCase().includes(keyword.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(keyword.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    const totalViews = relatedArticles.reduce((sum, article) => sum + (article.viewCount || 0), 0);
    const recentCount = relatedArticles.filter(article => 
      new Date(article.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    return {
      articleCount: relatedArticles.length,
      totalViews,
      recentCount,
      isTrending: recentCount >= 3
    };
  };

  // Filter categories if selected
  const displayedCategories = useMemo(() => {
    if (!selectedCategory) return Object.entries(keywordCategories);
    return Object.entries(keywordCategories).filter(([cat]) => 
      cat.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/topics?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    navigate('/topics');
  };

  // Get all unique keywords for search suggestions
  const allKeywords = useMemo(() => {
    const keywords: string[] = [];
    Object.values(keywordCategories).forEach(category => {
      category.forEach(item => keywords.push(item.keyword));
    });
    return keywords;
  }, []);

  return (
    <Layout>
      <SEOHead
        title="Technology Topics & Keywords - The Grid Nexus"
        description="Explore trending technology topics: AI, machine learning, cybersecurity, cloud computing, gaming, and blockchain. Latest news and insights. Search by keyword to find relevant articles."
        keywords={[
          'artificial intelligence',
          'machine learning',
          'cybersecurity',
          'cloud computing',
          'gaming',
          'blockchain',
          'robotics',
          'technology trends',
          'tech news',
          'data privacy',
          'quantum computing',
          'virtual reality',
          'internet of things',
          'big data',
          'network security',
          ...allKeywords.slice(0, 20),
        ]}
        url={window.location.href}
        type="website"
        faqs={[
          {
            question: 'How do I search for topics?',
            answer: 'Use the search bar to find articles by keyword, or browse categories below. Click on any keyword badge to see related articles.',
          },
          {
            question: 'What topics are covered?',
            answer: 'We cover AI & ML, cybersecurity, cloud computing, gaming, blockchain, robotics, and emerging technologies. Topics are organized by category for easy browsing.',
          },
          {
            question: 'How often are topics updated?',
            answer: 'Topics are updated daily as new articles are published. Trending topics are recalculated based on recent engagement and search volume.',
          },
        ]}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Hash className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-4xl mb-2">
                Technology Topics & Keywords
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Explore high-volume search keywords and trending topics in technology, cybersecurity, and gaming. 
                Find the latest news, insights, and expert analysis on the topics that matter most.
              </p>
            </div>
          </div>

          {/* Enhanced Search Bar with Suggestions */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search topics, keywords, or browse categories..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-20 h-12 text-lg"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                {searchInput && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button type="submit" size="sm" className="h-8 px-3">
                  Search
                </Button>
              </div>
            </div>
            
            {/* Search Suggestions */}
            {searchInput && (
              <div className="absolute z-10 w-full max-w-2xl mx-auto mt-1 bg-background border border-border rounded-lg shadow-lg">
                <div className="p-2">
                  <p className="text-xs text-muted-foreground mb-2 px-2">Popular suggestions:</p>
                  <div className="flex flex-wrap gap-1">
                    {allKeywords
                      .filter(k => k.toLowerCase().includes(searchInput.toLowerCase()))
                      .slice(0, 5)
                      .map((keyword, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/topics?q=${encodeURIComponent(keyword)}`)}
                          className="h-6 px-2 text-xs"
                        >
                          {keyword}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Hash className="h-5 w-5 text-primary mr-2" />
                  <div className="text-2xl font-bold text-primary">{allKeywords.length}+</div>
                </div>
                <div className="text-sm text-muted-foreground">Keywords</div>
                <div className="text-xs text-muted-foreground mt-1">Across all categories</div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-primary mr-2" />
                  <div className="text-2xl font-bold text-primary">{Object.keys(keywordCategories).length}</div>
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
                <div className="text-xs text-muted-foreground mt-1">Organized topics</div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Globe className="h-5 w-5 text-primary mr-2" />
                  <div className="text-2xl font-bold text-primary">{allArticles.length}</div>
                </div>
                <div className="text-sm text-muted-foreground">Articles</div>
                <div className="text-xs text-muted-foreground mt-1">Comprehensive coverage</div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Flame className="h-5 w-5 text-primary mr-2" />
                  <div className="text-2xl font-bold text-primary">{trendingArticles.length}</div>
                </div>
                <div className="text-sm text-muted-foreground">Trending</div>
                <div className="text-xs text-muted-foreground mt-1">Hot topics right now</div>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[140px]">
                <BarChart3 className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button
                variant={viewMode === 'compact' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('compact')}
              >
                Compact
              </Button>
            </div>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {query ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-primary" />
                <h2 className="font-display font-bold text-2xl">
                  Results for "{query}"
                </h2>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={clearSearch}>
                <X className="h-4 w-4 mr-2" />
                Clear search
              </Button>
            </div>

            {loadingContent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="h-48 bg-muted animate-pulse rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {filteredArticles.map((article, index) => (
                    <ArticleCard 
                      key={(article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? `article-${index}`} 
                      article={article} 
                    />
                  ))}
                </div>
                <Card className="border-dashed">
                  <CardContent className="py-6 text-center">
                    <p className="text-muted-foreground mb-2">
                      Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} for "{query}"
                    </p>
                    <Button variant="outline" onClick={clearSearch}>
                      Browse all topics
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-4">
                    No articles found for "{query}". Try a different keyword or browse categories below.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {allKeywords.slice(0, 10).map((keyword, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/topics?q=${encodeURIComponent(keyword)}`)}
                      >
                        {keyword}
                      </Button>
                    ))}
                  </div>
                  <Button onClick={clearSearch}>
                    Browse all topics
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Tabs defaultValue="categories" className="space-y-8">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-8">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Button>
                {Object.keys(keywordCategories).map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.split(' ')[0]}
                  </Button>
                ))}
              </div>

              {/* Categories */}
              {displayedCategories.map(([category, keywords]) => (
                <Card key={category} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">{category}</CardTitle>
                      </div>
                      <Badge variant="secondary">{keywords.length} keywords</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {keywords.map((item, index) => {
                        const stats = getTopicStats(item.keyword);
                        const isSaved = savedTopics.includes(item.keyword);
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group"
                          >
                            <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center gap-2">
                                  <Hash className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                  <Link
                                    to={`/topics?q=${encodeURIComponent(item.keyword)}`}
                                    className="font-medium hover:text-primary transition-colors"
                                  >
                                    {item.keyword}
                                  </Link>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {stats.isTrending && (
                                    <Badge variant="default" className="text-xs gap-1">
                                      <Flame className="h-3 w-3" />
                                      Trending
                                    </Badge>
                                  )}
                                  <Badge variant="secondary" className="text-xs">
                                    {stats.articleCount} articles
                                  </Badge>
                                  {item.volume && (
                                    <Badge variant="outline" className="text-xs">
                                      {item.volume}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="text-xs text-muted-foreground">
                                  {stats.totalViews.toLocaleString()} views
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleSavedTopic(item.keyword)}
                                  className="h-8 w-8 p-0"
                                >
                                  <BookmarkPlus className={cn(
                                    "h-4 w-4",
                                    isSaved ? "text-primary fill-primary" : "text-muted-foreground"
                                  )} />
                                </Button>
                                <Link
                                  to={`/topics?q=${encodeURIComponent(item.keyword)}`}
                                  className="h-8 w-8 p-0 rounded-full border border-border hover:border-primary hover:bg-primary/10 transition-colors flex items-center justify-center"
                                >
                                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                </Link>
                              </div>
                            </div>
                            
                            {/* Progress bar for topic popularity */}
                            <div className="px-3">
                              <Progress 
                                value={Math.min((stats.totalViews / 10000) * 100, 100)} 
                                className="h-1" 
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="trending" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <CardTitle>Trending Topics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingTrending ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                      ))}
                    </div>
                  ) : trendingArticles.length > 0 ? (
                    <div className="space-y-4">
                      {trendingArticles.map((article, index) => (
                        <Link
                          key={(article as Article & { _id?: string })?._id ?? article?.id ?? article?.slug ?? `trending-${index}`}
                          to={`/article/${article.slug ?? article.id ?? ''}`}
                          className="flex items-start gap-4 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatRelativeTime(article.publishedAt)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {article.niche}
                              </Badge>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-6">
                      No trending articles at the moment. Check back soon!
                    </p>
                  )}
                </CardContent>
              </Card>

              <TrendingTopicsWidget />
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performing Topics */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Rocket className="h-5 w-5 text-primary" />
                      <CardTitle>Top Performing Topics</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {allKeywords
                        .map(keyword => ({ keyword, ...getTopicStats(keyword) }))
                        .sort((a, b) => b.totalViews - a.totalViews)
                        .slice(0, 10)
                        .map((topic, index) => (
                          <div key={topic.keyword} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                {index + 1}
                              </div>
                              <Link
                                to={`/topics?q=${encodeURIComponent(topic.keyword)}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {topic.keyword}
                              </Link>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {topic.articleCount} articles
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {topic.totalViews.toLocaleString()} views
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <CardTitle>Recent Activity</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {allKeywords
                        .map(keyword => ({ keyword, ...getTopicStats(keyword) }))
                        .filter(topic => topic.recentCount > 0)
                        .sort((a, b) => b.recentCount - a.recentCount)
                        .slice(0, 10)
                        .map((topic, index) => (
                          <div key={topic.keyword} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-xs font-semibold text-green-600">
                                {index + 1}
                              </div>
                              <Link
                                to={`/topics?q=${encodeURIComponent(topic.keyword)}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {topic.keyword}
                              </Link>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs gap-1">
                                <Sparkles className="h-3 w-3" />
                                {topic.recentCount} new
                              </Badge>
                              {topic.isTrending && (
                                <Badge variant="default" className="text-xs gap-1">
                                  <Flame className="h-3 w-3" />
                                  Hot
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Saved Topics */}
              {savedTopics.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookmarkPlus className="h-5 w-5 text-primary" />
                        <CardTitle>Saved Topics</CardTitle>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setSavedTopics([])}>
                        Clear all
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {savedTopics.map((topic, index) => (
                        <div key={index} className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-primary/5">
                          <Hash className="h-3.5 w-3.5 text-primary" />
                          <span className="text-sm font-medium text-primary">
                            {topic}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSavedTopic(topic)}
                            className="h-5 w-5 p-0 rounded-full hover:bg-primary/20"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
