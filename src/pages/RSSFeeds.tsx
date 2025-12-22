import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useRSSFeeds, useRSSFeedItems } from '@/hooks/useRSSFeeds';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, RefreshCw, Trash2, ExternalLink, Rss, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import type { RSSFeed } from '@/lib/rss/feedService';

export default function RSSFeeds() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { feeds, addFeed, removeFeed, refreshFeed, isAdding, isRefreshing } = useRSSFeeds();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedUrl, setFeedUrl] = useState('');

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to manage your RSS feeds.
          </p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      </Layout>
    );
  }

  const handleAddFeed = async () => {
    if (!feedUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a feed URL',
        variant: 'destructive',
      });
      return;
    }

    try {
      await addFeed(feedUrl.trim());
      setIsDialogOpen(false);
      setFeedUrl('');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleRemoveFeed = async (feedId: string) => {
    if (!confirm('Are you sure you want to remove this feed?')) return;
    await removeFeed(feedId);
  };

  const handleRefreshFeed = async (feedId: string) => {
    await refreshFeed(feedId);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Rss className="h-8 w-8" />
              RSS Feeds
            </h1>
            <p className="text-muted-foreground">
              Aggregate content from RSS and Atom feeds
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Feed
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add RSS Feed</DialogTitle>
                <DialogDescription>
                  Enter the URL of an RSS or Atom feed to start aggregating content
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feed-url">Feed URL *</Label>
                  <Input
                    id="feed-url"
                    type="url"
                    value={feedUrl}
                    onChange={(e) => setFeedUrl(e.target.value)}
                    placeholder="https://example.com/feed.xml"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports RSS 2.0 and Atom feeds
                  </p>
                </div>
                <Button onClick={handleAddFeed} disabled={isAdding} className="w-full">
                  {isAdding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Feed
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {feeds.length === 0 ? (
          <div className="text-center py-12">
            <Rss className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              No RSS feeds added yet.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Feed
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feeds.map((feed) => (
              <FeedCard
                key={feed.id}
                feed={feed}
                onRefresh={() => handleRefreshFeed(feed.id)}
                onRemove={() => handleRemoveFeed(feed.id)}
                isRefreshing={isRefreshing}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function FeedCard({ feed, onRefresh, onRemove, isRefreshing }: {
  feed: RSSFeed;
  onRefresh: () => void;
  onRemove: () => void;
  isRefreshing: boolean;
}) {
  const { data: items, isLoading } = useRSSFeedItems(feed.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{feed.title}</CardTitle>
            <CardDescription className="mt-1 break-all">
              {feed.url}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {items?.length || 0} items
              </span>
              {feed.lastFetched && (
                <span className="text-muted-foreground">
                  Updated {format(new Date(feed.lastFetched), 'MMM d')}
                </span>
              )}
            </div>
            {items && items.length > 0 && (
              <div className="space-y-2">
                {items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded border hover:bg-muted/50 transition-colors"
                  >
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 group-hover:underline">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-1" />
                    </a>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{items.length - 3} more items
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

