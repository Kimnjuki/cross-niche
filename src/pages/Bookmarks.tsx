import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { ViewToggle } from '@/components/ui/view-toggle';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import type { Article } from '@/types';

export default function Bookmarks() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');
  const { user, isLoading: authLoading } = useAuth();

  // Bookmarks are not persisted (sign-in disabled)
  const bookmarkedArticles: Article[] = [];

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="h-10 w-64 mb-4 bg-muted animate-pulse rounded" />
          <div className="h-6 w-48 mb-8 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 w-full bg-muted animate-pulse rounded" />
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
