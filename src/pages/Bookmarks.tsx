import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { mockArticles } from '@/data/mockData';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { ViewToggle } from '@/components/ui/view-toggle';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { mapContentToArticles } from '@/lib/contentMapper';
import { Skeleton } from '@/components/ui/skeleton';

export default function Bookmarks() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const { user, isLoading: authLoading } = useAuth();

  // Fetch bookmarked content from Supabase
  const { data: bookmarkedContent, isLoading: bookmarksLoading } = useQuery({
    queryKey: ['bookmarks', user?.id],
    queryFn: async () => {
      if (!user || !isSupabaseConfigured()) return [];
      
      const { data: bookmarks, error } = await supabase
        .from('user_bookmarks')
        .select('content_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      if (!bookmarks || bookmarks.length === 0) return [];
      
      const contentIds = bookmarks.map(b => b.content_id);
      const { data: content, error: contentError } = await supabase
        .from('feed_content_view')
        .select('*')
        .in('id', contentIds)
        .eq('status', 'published');
      
      if (contentError) throw contentError;
      return content || [];
    },
    enabled: !!user && isSupabaseConfigured(),
  });

  if (authLoading || bookmarksLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-display font-bold text-3xl mb-4">Sign in to view bookmarks</h1>
          <p className="text-muted-foreground mb-8">
            Save articles to read later by signing in to your account.
          </p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Use Supabase content if available, otherwise fallback to mock data
  const bookmarkedArticles = bookmarkedContent && bookmarkedContent.length > 0
    ? mapContentToArticles(bookmarkedContent)
    : mockArticles.filter(a => user.bookmarks.includes(a.id));

  return (
    <Layout>
      <SEOHead
        title="Your Bookmarks | The Grid Nexus"
        description="View your saved articles and bookmarks"
        url={window.location.href}
        noindex={true}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="font-display font-bold text-4xl mb-2">Your Bookmarks</h1>
          <p className="text-muted-foreground">
            {bookmarkedArticles.length} saved article{bookmarkedArticles.length !== 1 ? 's' : ''}
          </p>
        </div>

        {bookmarkedArticles.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-display font-semibold text-xl mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground mb-6">
              Start saving articles by clicking the bookmark icon on any article.
            </p>
            <Button asChild>
              <Link to="/">Explore Articles</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-6">
              <ViewToggle value={viewMode} onChange={setViewMode} ariaLabel="Bookmarks layout" />
            </div>
            <ArticleGrid articles={bookmarkedArticles} columns={3} viewMode={viewMode} />
          </>
        )}
      </div>
    </Layout>
  );
}
