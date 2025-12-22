import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { mockArticles } from '@/data/mockData';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';

export default function Bookmarks() {
  const { user } = useAuth();

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

  const bookmarkedArticles = mockArticles.filter(a => user.bookmarks.includes(a.id));

  return (
    <Layout>
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
          <ArticleGrid articles={bookmarkedArticles} columns={3} />
        )}
      </div>
    </Layout>
  );
}
