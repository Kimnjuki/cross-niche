import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useContentByFeed, usePublishedContent } from '@/hooks/useContent';
import { mapContentToArticle } from '@/lib/contentMapper';
import { insertArticles } from '@/lib/insertArticles';
import { diagnoseAndFixContent, forceUpdateAllContent } from '@/lib/diagnoseAndFixContent';
import { LazyImage } from '@/components/ui/lazy-image';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';
import { toast } from 'sonner';

const nicheStyles = {
  tech: { 
    badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    bg: 'bg-blue-500/5',
    label: 'Innovate'
  },
  security: { 
    badge: 'bg-red-500/10 text-red-500 border-red-500/20',
    bg: 'bg-red-500/5',
    label: 'Secured'
  },
  gaming: { 
    badge: 'bg-green-500/10 text-green-500 border-green-500/20',
    bg: 'bg-green-500/5',
    label: 'Play'
  },
};

export default function BlogSeries() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNiche, setSelectedNiche] = useState<'all' | 'tech' | 'security' | 'gaming'>('all');
  const [isInserting, setIsInserting] = useState(false);
  const [insertStatus, setInsertStatus] = useState<{ success: boolean; message?: string } | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  // Fetch all published content
  const { data: allContent, isLoading: isLoadingAll } = usePublishedContent(50);
  const { data: techContent, isLoading: isLoadingTech } = useContentByFeed('innovate', 50);
  const { data: securityContent, isLoading: isLoadingSecurity } = useContentByFeed('secured', 50);
  const { data: gamingContent, isLoading: isLoadingGaming } = useContentByFeed('play', 50);

  // Map content to articles
  const allArticles: Article[] = allContent ? allContent.map(mapContentToArticle) : [];
  const techArticles: Article[] = techContent ? techContent.map(mapContentToArticle) : [];
  const securityArticles: Article[] = securityContent ? securityContent.map(mapContentToArticle) : [];
  const gamingArticles: Article[] = gamingContent ? gamingContent.map(mapContentToArticle) : [];

  // Get articles based on selected niche
  const getFilteredArticles = (): Article[] => {
    switch (selectedNiche) {
      case 'tech':
        return techArticles;
      case 'security':
        return securityArticles;
      case 'gaming':
        return gamingArticles;
      default:
        return allArticles;
    }
  };

  const filteredArticles = getFilteredArticles();
  const currentArticle = filteredArticles[currentIndex];

  // Reset index when niche changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedNiche]);

  // Ensure index is valid
  useEffect(() => {
    if (filteredArticles.length > 0 && currentIndex >= filteredArticles.length) {
      setCurrentIndex(0);
    }
  }, [filteredArticles.length, currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredArticles.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredArticles.length - 1 ? prev + 1 : 0));
  };

  const handleInsertArticles = async () => {
    setIsInserting(true);
    setInsertStatus(null);
    
    try {
      const result = await insertArticles();
      if (result.success) {
        setInsertStatus({ success: true, message: 'Articles inserted successfully!' });
        toast.success('Articles inserted successfully!', {
          description: `${result.results?.filter(r => r.status === 'success').length || 0} articles added to database.`
        });
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setInsertStatus({ success: false, message: result.error || 'Failed to insert articles' });
        toast.error('Failed to insert articles', {
          description: result.error || 'Unknown error occurred'
        });
      }
    } catch (error) {
      setInsertStatus({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
      toast.error('Error inserting articles', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsInserting(false);
    }
  };

  const handleDiagnose = async () => {
    setIsDiagnosing(true);
    setDiagnosticResult(null);
    
    try {
      const result = await diagnoseAndFixContent();
      setDiagnosticResult(result);
      
      if (result.success) {
        toast.success('Diagnostic completed', {
          description: `Found ${result.issues.length} issues, applied ${result.fixes.length} fixes.`
        });
      } else {
        toast.warning('Diagnostic found issues', {
          description: `${result.issues.length} issues found. Check details below.`
        });
      }
      
      // Refresh content after diagnostic
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error('Diagnostic failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleForceFix = async () => {
    setIsFixing(true);
    
    try {
      const result = await forceUpdateAllContent();
      
      if (result.success) {
        toast.success('Content updated successfully', {
          description: `Updated ${result.updated} articles.`
        });
      } else {
        toast.error('Update failed', {
          description: result.errors.join(', ')
        });
      }
      
      // Refresh content after fix
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error('Fix failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsFixing(false);
    }
  };

  const isLoading = isLoadingAll || (selectedNiche === 'tech' && isLoadingTech) || 
                     (selectedNiche === 'security' && isLoadingSecurity) || 
                     (selectedNiche === 'gaming' && isLoadingGaming);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
            2026 Tech & Gaming Series
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Comprehensive blog posts covering the latest in technology, gaming, and cybersecurity
          </p>

          {/* Database Management Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Insert Articles Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Insert Articles
                </CardTitle>
                <CardDescription>
                  Insert the 5 comprehensive blog posts into the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleInsertArticles} 
                  disabled={isInserting}
                  className="gap-2 w-full"
                >
                  {isInserting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Inserting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Insert Articles
                    </>
                  )}
                </Button>
                {insertStatus && (
                  <div className={cn(
                    "mt-4 p-3 rounded-lg flex items-center gap-2 text-sm",
                    insertStatus.success 
                      ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                  )}>
                    {insertStatus.success ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span>{insertStatus.message}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Diagnostic & Fix Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Diagnostics
                </CardTitle>
                <CardDescription>
                  Check and fix content visibility issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleDiagnose} 
                  disabled={isDiagnosing || isFixing}
                  variant="outline"
                  className="gap-2 w-full"
                >
                  {isDiagnosing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Diagnosing...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      Diagnose Content
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleForceFix} 
                  disabled={isDiagnosing || isFixing}
                  variant="outline"
                  className="gap-2 w-full"
                >
                  {isFixing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Fixing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Force Fix All Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Diagnostic Results */}
          {diagnosticResult && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Diagnostic Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{diagnosticResult.stats.totalContent}</div>
                    <div className="text-xs text-muted-foreground">Total Content</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{diagnosticResult.stats.publishedContent}</div>
                    <div className="text-xs text-muted-foreground">Published</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{diagnosticResult.stats.contentWithFeeds}</div>
                    <div className="text-xs text-muted-foreground">With Feeds</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{diagnosticResult.stats.contentWithNiches}</div>
                    <div className="text-xs text-muted-foreground">With Niches</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{diagnosticResult.stats.contentWithTags}</div>
                    <div className="text-xs text-muted-foreground">With Tags</div>
                  </div>
                </div>

                {/* Issues */}
                {diagnosticResult.issues.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-500">Issues Found:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {diagnosticResult.issues.map((issue: string, idx: number) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fixes Applied */}
                {diagnosticResult.fixes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-green-500">Fixes Applied:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {diagnosticResult.fixes.map((fix: string, idx: number) => (
                        <li key={idx}>{fix}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Niche Filter Tabs */}
          <Tabs value={selectedNiche} onValueChange={(v) => setSelectedNiche(v as typeof selectedNiche)}>
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="gaming">Gaming</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Article Display */}
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg">
                No articles found. Click "Insert Articles to Database" above to add articles.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Article Counter */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Article {currentIndex + 1} of {filteredArticles.length}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={filteredArticles.length === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  disabled={filteredArticles.length === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Current Article Card */}
            {currentArticle && (
              <Card className="overflow-hidden">
                <div className="relative aspect-video w-full overflow-hidden">
                  <LazyImage
                    src={currentArticle.imageUrl}
                    alt={currentArticle.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge className={nicheStyles[currentArticle.niche].badge}>
                      {nicheStyles[currentArticle.niche].label}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">
                    {currentArticle.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {currentArticle.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(currentArticle.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentArticle.readTime} min read
                    </div>
                    <span className="font-medium text-foreground">{currentArticle.author}</span>
                  </div>

                  {/* Tags */}
                  {currentArticle.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {currentArticle.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Article Preview */}
                  <div 
                    className="prose prose-slate max-w-none dark:prose-invert mb-6"
                    dangerouslySetInnerHTML={{ 
                      __html: currentArticle.content.substring(0, 500) + '...' 
                    }}
                  />

                  {/* Read More Button */}
                  <Button asChild className="w-full md:w-auto">
                    <Link to={`/article/${currentArticle.id}`}>
                      Read Full Article →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Article Thumbnails Grid */}
            {filteredArticles.length > 1 && (
              <div className="mt-8">
                <h2 className="font-display font-bold text-2xl mb-4">All Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.map((article, index) => (
                    <Card
                      key={article.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-lg",
                        index === currentIndex && "ring-2 ring-primary",
                        nicheStyles[article.niche].bg
                      )}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <LazyImage
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className={nicheStyles[article.niche].badge}>
                            {nicheStyles[article.niche].label}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">
                          {article.title}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

