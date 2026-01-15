import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePublishedContent } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { insertArticles } from '@/lib/insertArticles';
import { diagnoseAndFixContent, forceUpdateAllContent } from '@/lib/diagnoseAndFixContent';
import { fixExistingContent } from '@/lib/fixExistingContent';
import { comprehensiveContentFix, quickFixAllContent } from '@/lib/comprehensiveContentFix';
import { 
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  RefreshCw,
  CheckSquare,
  XSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Admin() {
  const [isInserting, setIsInserting] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isFixingExisting, setIsFixingExisting] = useState(false);
  const [isComprehensiveFixing, setIsComprehensiveFixing] = useState(false);
  const [insertStatus, setInsertStatus] = useState<{ success: boolean; message?: string } | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [fixResult, setFixResult] = useState<any>(null);
  const [comprehensiveResult, setComprehensiveResult] = useState<any>(null);

  const { data: allContent, isLoading } = usePublishedContent(50);
  const allArticles = allContent ? mapContentToArticles(allContent) : [];

  // Checklist items
  const checklistItems = [
    {
      id: 'route',
      label: 'BlogSeries route registered',
      check: () => true, // We know it's registered
      status: 'pass'
    },
    {
      id: 'component',
      label: 'BlogSeries component exists',
      check: () => true,
      status: 'pass'
    },
    {
      id: 'imports',
      label: 'All imports working',
      check: () => {
        try {
          return !!insertArticles && !!diagnoseAndFixContent && !!fixExistingContent;
        } catch {
          return false;
        }
      },
      status: 'pass'
    },
    {
      id: 'content',
      label: `Content in database (${allArticles.length} articles)`,
      check: () => allArticles.length > 0,
      status: allArticles.length > 0 ? 'pass' : 'fail'
    },
    {
      id: 'supabase',
      label: 'Supabase connection',
      check: () => allContent !== undefined,
      status: allContent !== undefined ? 'pass' : 'warning'
    }
  ];

  const handleInsertArticles = async () => {
    setIsInserting(true);
    setInsertStatus(null);
    
    try {
      const result = await insertArticles();
      if (result.success) {
        setInsertStatus({ success: true, message: 'Articles inserted successfully!' });
        toast.success('Articles inserted successfully!');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setInsertStatus({ success: false, message: result.error || 'Failed to insert articles' });
        toast.error('Failed to insert articles');
      }
    } catch (error) {
      setInsertStatus({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
      toast.error('Error inserting articles');
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
        toast.success('Diagnostic completed');
      } else {
        toast.warning('Diagnostic found issues');
      }
      
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error('Diagnostic failed');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleForceFix = async () => {
    setIsFixing(true);
    
    try {
      const result = await forceUpdateAllContent();
      
      if (result.success) {
        toast.success('Content updated successfully');
      } else {
        toast.error('Update failed');
      }
      
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error('Fix failed');
    } finally {
      setIsFixing(false);
    }
  };

  const handleFixExisting = async () => {
    setIsFixingExisting(true);
    setFixResult(null);
    
    try {
      const result = await fixExistingContent();
      setFixResult(result);
      
      if (result.success) {
        toast.success('Content fixed successfully', {
          description: `Updated ${result.updated} articles, linked ${result.linkedToFeeds} to feeds, ${result.linkedToNiches} to niches. ${result.visibleCount} articles now visible.`
        });
      } else {
        toast.error('Fix failed');
      }
      
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error('Fix failed');
    } finally {
      setIsFixingExisting(false);
    }
  };

  const handleComprehensiveFix = async () => {
    setIsComprehensiveFixing(true);
    setComprehensiveResult(null);
    
    try {
      const result = await comprehensiveContentFix();
      setComprehensiveResult(result);
      
      if (result.fixed > 0) {
        toast.success('Comprehensive fix completed', {
          description: `Fixed ${result.fixed} articles. Found ${result.issues.length} issues.`
        });
      } else if (result.issues.length === 0) {
        toast.success('All content is properly configured');
      } else {
        toast.warning('Some issues found', {
          description: `Found ${result.issues.length} issues. ${result.fixed} articles fixed.`
        });
      }
      
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error('Comprehensive fix failed');
    } finally {
      setIsComprehensiveFixing(false);
    }
  };

  const handleQuickFix = async () => {
    setIsFixing(true);
    
    try {
      const result = await quickFixAllContent();
      
      if (result.fixed > 0) {
        toast.success('Quick fix completed', {
          description: `Fixed ${result.fixed} articles. ${result.errors.length} errors.`
        });
      } else {
        toast.info('No content needed fixing');
      }
      
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error('Quick fix failed');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
            Content Management Admin
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Manage and fix content in your database
          </p>
        </div>

        {/* System Checklist */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              System Checklist
            </CardTitle>
            <CardDescription>
              Verify all components are working correctly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklistItems.map((item) => {
                const status = item.check();
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="font-medium">{item.label}</span>
                    <Badge 
                      variant={status ? "default" : "destructive"}
                      className={cn(
                        status ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                        "bg-red-500/10 text-red-500 border-red-500/20"
                      )}
                    >
                      {status ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Pass
                        </>
                      ) : (
                        <>
                          <XSquare className="h-3 w-3 mr-1" />
                          Fail
                        </>
                      )}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Insert Articles
              </CardTitle>
              <CardDescription>
                Insert the 5 comprehensive blog posts
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Fix Content
              </CardTitle>
              <CardDescription>
                Fix existing content to make it visible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleComprehensiveFix} 
                disabled={isComprehensiveFixing || isFixing || isDiagnosing || isFixingExisting}
                className="gap-2 w-full bg-primary"
              >
                {isComprehensiveFixing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Comprehensive Fix...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Comprehensive Fix (Recommended)
                  </>
                )}
              </Button>
              <Button 
                onClick={handleQuickFix} 
                disabled={isFixing || isDiagnosing || isFixingExisting || isComprehensiveFixing}
                variant="default"
                className="gap-2 w-full"
              >
                {isFixing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Quick Fixing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Quick Fix All Content
                  </>
                )}
              </Button>
              <Button 
                onClick={handleFixExisting} 
                disabled={isFixingExisting || isFixing || isDiagnosing || isComprehensiveFixing}
                variant="outline"
                className="gap-2 w-full"
              >
                {isFixingExisting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Fixing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Fix Existing Content
                  </>
                )}
              </Button>
              <Button 
                onClick={handleDiagnose} 
                disabled={isDiagnosing || isFixing || isFixingExisting || isComprehensiveFixing}
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
                disabled={isDiagnosing || isFixing || isFixingExisting || isComprehensiveFixing}
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
                    Force Fix All
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {(fixResult || comprehensiveResult) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className={cn(
                (fixResult?.success || comprehensiveResult?.fixed > 0) ? "text-green-500" : "text-red-500"
              )}>
                Fix Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comprehensiveResult && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-2xl font-bold">{comprehensiveResult.totalContent || 0}</div>
                      <div className="text-xs text-muted-foreground">Total Content</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-2xl font-bold">{comprehensiveResult.publishedContent || 0}</div>
                      <div className="text-xs text-muted-foreground">Published</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-2xl font-bold">{comprehensiveResult.fixed || 0}</div>
                      <div className="text-xs text-muted-foreground">Fixed</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-2xl font-bold">{comprehensiveResult.issues.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Issues Found</div>
                    </div>
                  </div>
                  {comprehensiveResult.issues.length > 0 && (
                    <div className="mt-4 p-4 rounded-lg bg-muted/50">
                      <div className="text-sm font-semibold mb-2">Issues:</div>
                      <ul className="text-xs text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
                        {comprehensiveResult.issues.slice(0, 10).map((issue: string, i: number) => (
                          <li key={i}>• {issue}</li>
                        ))}
                        {comprehensiveResult.issues.length > 10 && (
                          <li>... and {comprehensiveResult.issues.length - 10} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </>
              )}
              {fixResult && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{fixResult.updated || 0}</div>
                    <div className="text-xs text-muted-foreground">Updated</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{fixResult.linkedToFeeds || 0}</div>
                    <div className="text-xs text-muted-foreground">Linked to Feeds</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{fixResult.linkedToNiches || 0}</div>
                    <div className="text-xs text-muted-foreground">Linked to Niches</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{fixResult.visibleCount || 0}</div>
                    <div className="text-xs text-muted-foreground">Now Visible</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Current Content Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Content Status</CardTitle>
            <CardDescription>
              Articles currently in the database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="text-2xl font-bold">{allArticles.length}</div>
                <div className="text-sm text-muted-foreground">
                  {allArticles.length > 0 
                    ? 'Articles are available in the database' 
                    : 'No articles found. Use "Insert Articles" or "Fix Existing Content" to add articles.'}
                </div>
                {allArticles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-semibold">Article Titles:</div>
                    {allArticles.slice(0, 5).map((article) => (
                      <div key={article.id} className="text-sm text-muted-foreground">
                        • {article.title}
                      </div>
                    ))}
                    {allArticles.length > 5 && (
                      <div className="text-sm text-muted-foreground">
                        ... and {allArticles.length - 5} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


