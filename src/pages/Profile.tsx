import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEOHead } from '@/components/seo/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/adminUtils';
import { 
  User, 
  Settings, 
  Database, 
  Upload, 
  RefreshCw, 
  CheckSquare, 
  XSquare,
  Loader2,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { insertArticles } from '@/lib/insertArticles';
import { diagnoseAndFixContent, forceUpdateAllContent } from '@/lib/diagnoseAndFixContent';
import { fixExistingContent } from '@/lib/fixExistingContent';
import { comprehensiveContentFix, quickFixAllContent } from '@/lib/comprehensiveContentFix';
import { usePublishedContent } from '@/hooks/useContent';
import { mapContentToArticles } from '@/lib/contentMapper';
import { ContentEditor } from '@/components/admin/ContentEditor';
import { autoFixAndPublishAll } from '@/lib/autoFixAndPublish';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Admin states
  const [isInserting, setIsInserting] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isFixingExisting, setIsFixingExisting] = useState(false);
  const [isComprehensiveFixing, setIsComprehensiveFixing] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [insertStatus, setInsertStatus] = useState<{ success: boolean; message?: string } | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [fixResult, setFixResult] = useState<any>(null);
  const [comprehensiveResult, setComprehensiveResult] = useState<any>(null);
  const [autoFixResult, setAutoFixResult] = useState<any>(null);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);

  const { data: allContent, isLoading } = usePublishedContent(50);
  const allArticles = allContent ? mapContentToArticles(allContent) : [];

  const userIsAdmin = isAdmin(user?.email);

  // Redirect if not logged in
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Admin handlers
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

  const handleAutoFixAndPublish = async () => {
    setIsAutoFixing(true);
    setAutoFixResult(null);
    
    try {
      const result = await autoFixAndPublishAll();
      setAutoFixResult(result);
      
      if (result.success) {
        toast.success('Auto-fix completed', {
          description: `Published ${result.published} articles, fixed ${result.fixed} articles, linked ${result.linked} relationships.`
        });
      } else {
        toast.error('Auto-fix had errors', {
          description: `${result.errors.length} errors occurred.`
        });
      }
      
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error('Auto-fix failed');
    } finally {
      setIsAutoFixing(false);
    }
  };

  const handleNewContent = () => {
    setEditingContent(null);
    setShowContentEditor(true);
  };

  const handleEditContent = async (article: any) => {
    // Content editing uses Convex; open editor with article data from props
    setEditingContent(article);
    setShowContentEditor(true);
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    // Delete logic would go here
    toast.info('Delete functionality coming soon');
  };

  return (
    <Layout>
      <SEOHead
        title="User Profile | The Grid Nexus"
        description="Manage your account settings and preferences"
        url={window.location.href}
        noindex={true}
      />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-4">
            Profile
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your account and {userIsAdmin && 'admin settings'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {userIsAdmin && <TabsTrigger value="admin">Admin Panel</TabsTrigger>}
            <TabsTrigger value="content">Content Management</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-lg font-semibold">{user?.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg font-semibold">{user?.email}</p>
                </div>
                {userIsAdmin && (
                  <div>
                    <Badge variant="default" className="bg-primary">
                      Administrator
                    </Badge>
                  </div>
                )}
                <Button variant="outline" onClick={logout} className="w-full">
                  Logout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Panel Tab */}
          {userIsAdmin && (
            <TabsContent value="admin" className="space-y-6">
              {/* System Checklist */}
              <Card>
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
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="font-medium">Content in database ({allArticles.length} articles)</span>
                      <Badge 
                        variant={allArticles.length > 0 ? "default" : "destructive"}
                        className={cn(
                          allArticles.length > 0 ? "bg-green-500/10 text-green-500 border-green-500/20" : 
                          "bg-red-500/10 text-red-500 border-red-500/20"
                        )}
                      >
                        {allArticles.length > 0 ? (
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
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
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
                      onClick={handleAutoFixAndPublish} 
                      disabled={isAutoFixing || isComprehensiveFixing || isFixing || isDiagnosing || isFixingExisting}
                      className="gap-2 w-full bg-primary"
                    >
                      {isAutoFixing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Auto-Fixing & Publishing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Auto-Fix & Publish All (Recommended)
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleComprehensiveFix} 
                      disabled={isAutoFixing || isComprehensiveFixing || isFixing || isDiagnosing || isFixingExisting}
                      variant="default"
                      className="gap-2 w-full"
                    >
                      {isComprehensiveFixing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Comprehensive Fix...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Comprehensive Fix
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
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              {(fixResult || comprehensiveResult || autoFixResult) && (
                <Card>
                  <CardHeader>
                    <CardTitle className={cn(
                      (fixResult?.success || comprehensiveResult?.fixed > 0) ? "text-green-500" : "text-red-500"
                    )}>
                      Fix Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {autoFixResult && (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold">{autoFixResult.published || 0}</div>
                            <div className="text-xs text-muted-foreground">Published</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold">{autoFixResult.fixed || 0}</div>
                            <div className="text-xs text-muted-foreground">Fixed</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold">{autoFixResult.linked || 0}</div>
                            <div className="text-xs text-muted-foreground">Linked</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold">{autoFixResult.errors.length || 0}</div>
                            <div className="text-xs text-muted-foreground">Errors</div>
                          </div>
                        </div>
                        {autoFixResult.errors.length > 0 && (
                          <div className="mt-4 p-4 rounded-lg bg-muted/50">
                            <div className="text-sm font-semibold mb-2">Errors:</div>
                            <ul className="text-xs text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
                              {autoFixResult.errors.slice(0, 10).map((error: string, i: number) => (
                                <li key={i}>• {error}</li>
                              ))}
                              {autoFixResult.errors.length > 10 && (
                                <li>... and {autoFixResult.errors.length - 10} more</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
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
            </TabsContent>
          )}

          {/* Content Management Tab */}
          {userIsAdmin && (
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Content Management</CardTitle>
                      <CardDescription>
                        Create, edit, and manage articles
                      </CardDescription>
                    </div>
                    <Button onClick={handleNewContent} className="gap-2">
                      <Plus className="h-4 w-4" />
                      New Article
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading...</div>
                  ) : allArticles.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No articles found</p>
                      <Button onClick={handleNewContent} variant="outline">
                        Create First Article
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {allArticles.map((article) => (
                        <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-semibold">{article.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {article.niche} • {article.readTime} min read
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditContent(article)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteContent(article.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Content Editor Modal */}
              {showContentEditor && (
                <ContentEditor
                  content={editingContent}
                  onClose={() => {
                    setShowContentEditor(false);
                    setEditingContent(null);
                  }}
                  onSave={() => {
                    setShowContentEditor(false);
                    setEditingContent(null);
                    window.location.reload();
                  }}
                />
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
}

