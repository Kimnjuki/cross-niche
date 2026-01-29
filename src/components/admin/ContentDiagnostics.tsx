import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export function ContentDiagnostics() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnostics: any = {
      supabaseConfigured: false,
      connectionTest: false,
      totalArticles: 0,
      publishedArticles: 0,
      articlesWithBody: 0,
      articlesWithExcerpt: 0,
      articlesWithAuthor: 0,
      sampleArticles: [],
      errors: [],
    };

    try {
      // 1. Check Supabase configuration
      diagnostics.supabaseConfigured = isSupabaseConfigured();
      if (!diagnostics.supabaseConfigured) {
        diagnostics.errors.push('Supabase is not configured. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
        setResults(diagnostics);
        setIsRunning(false);
        return;
      }

      // 2. Test connection
      const { data: testData, error: testError } = await supabase
        .from('content')
        .select('id')
        .limit(1);
      
      diagnostics.connectionTest = !testError;
      if (testError) {
        diagnostics.errors.push(`Connection error: ${testError.message}`);
      }

      // 3. Get all articles
      const { data: allArticles, error: articlesError } = await supabase
        .from('content')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(50);

      if (articlesError) {
        diagnostics.errors.push(`Error fetching articles: ${articlesError.message}`);
      } else {
        diagnostics.totalArticles = allArticles?.length || 0;
        diagnostics.publishedArticles = allArticles?.filter(a => a.status === 'published').length || 0;
        diagnostics.articlesWithBody = allArticles?.filter(a => a.body && a.body.length > 0).length || 0;
        diagnostics.articlesWithExcerpt = allArticles?.filter(a => (a.excerpt || a.summary) && (a.excerpt || a.summary).length > 0).length || 0;
        diagnostics.articlesWithAuthor = allArticles?.filter(a => a.author_id).length || 0;
        
        // Get sample articles
        diagnostics.sampleArticles = (allArticles || []).slice(0, 5).map((a: any) => ({
          id: a.id,
          title: a.title,
          status: a.status,
          published_at: a.published_at,
          hasBody: !!a.body,
          hasExcerpt: !!(a.excerpt || a.summary),
          hasAuthor: !!a.author_id,
          bodyLength: a.body?.length || 0,
        }));
      }

      // 4. Test published articles query
      const { data: publishedArticles, error: publishedError } = await supabase
        .from('content')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10);

      if (publishedError) {
        diagnostics.errors.push(`Error fetching published articles: ${publishedError.message}`);
      } else {
        diagnostics.publishedArticlesQuery = publishedArticles?.length || 0;
        diagnostics.publishedSample = (publishedArticles || []).slice(0, 3).map((a: any) => ({
          id: a.id,
          title: a.title,
          published_at: a.published_at,
        }));
      }

    } catch (error: any) {
      diagnostics.errors.push(`Unexpected error: ${error.message}`);
    }

    setResults(diagnostics);
    setIsRunning(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Content Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostics} disabled={isRunning}>
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            'Run Diagnostics'
          )}
        </Button>

        {results && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {results.supabaseConfigured ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-semibold">Supabase Config</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {results.supabaseConfigured ? 'Configured' : 'Not Configured'}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {results.connectionTest ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-semibold">Connection</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {results.connectionTest ? 'Connected' : 'Failed'}
                </p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold mb-1">{results.totalArticles}</div>
                <p className="text-sm text-muted-foreground">Total Articles</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold mb-1">{results.publishedArticles}</div>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-xl font-bold mb-1">{results.articlesWithBody}</div>
                <p className="text-sm text-muted-foreground">With Body</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-xl font-bold mb-1">{results.articlesWithExcerpt}</div>
                <p className="text-sm text-muted-foreground">With Excerpt</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-xl font-bold mb-1">{results.articlesWithAuthor}</div>
                <p className="text-sm text-muted-foreground">With Author</p>
              </div>
            </div>

            {results.sampleArticles && results.sampleArticles.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Sample Articles:</h3>
                <div className="space-y-2">
                  {results.sampleArticles.map((article: any) => (
                    <div key={article.id} className="p-3 border rounded-lg text-sm">
                      <div className="font-medium">{article.title}</div>
                      <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Status: {article.status}</span>
                        <span>Published: {article.published_at ? new Date(article.published_at).toLocaleString() : 'N/A'}</span>
                        <span>Body: {article.hasBody ? `${article.bodyLength} chars` : 'Missing'}</span>
                        <span>Excerpt: {article.hasExcerpt ? 'Yes' : 'No'}</span>
                        <span>Author: {article.hasAuthor ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.publishedSample && results.publishedSample.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Published Articles Sample:</h3>
                <div className="space-y-2">
                  {results.publishedSample.map((article: any) => (
                    <div key={article.id} className="p-3 border rounded-lg text-sm">
                      <div className="font-medium">{article.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Published: {article.published_at ? new Date(article.published_at).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.errors && results.errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-red-700 dark:text-red-400">Errors:</h3>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-600 dark:text-red-300">
                  {results.errors.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}



