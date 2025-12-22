import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from '@/contexts/AuthContext';
import { fetchRSSFeed, validateFeedURL, type RSSFeed, type RSSItem } from '@/lib/rss/feedService';
import { toast } from '@/hooks/use-toast';

export function useRSSFeeds() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [feeds, setFeeds] = useLocalStorage<RSSFeed[]>(
    `rss-feeds-${user?.id || 'anonymous'}`,
    []
  );

  const feedsQuery = useQuery({
    queryKey: ['rss-feeds', user?.id],
    queryFn: () => feeds,
    enabled: !!user,
  });

  const addFeed = useMutation({
    mutationFn: async (feedUrl: string) => {
      if (!user) throw new Error('Must be logged in to add feeds');
      
      if (!validateFeedURL(feedUrl)) {
        throw new Error('Invalid feed URL');
      }

      // Check if feed already exists
      if (feeds.some(f => f.url === feedUrl)) {
        throw new Error('Feed already exists');
      }

      // Fetch feed to get title
      const items = await fetchRSSFeed(feedUrl);
      if (items.length === 0) {
        throw new Error('No items found in feed');
      }

      const newFeed: RSSFeed = {
        id: crypto.randomUUID(),
        url: feedUrl,
        title: new URL(feedUrl).hostname, // Fallback to hostname
        description: `Feed from ${new URL(feedUrl).hostname}`,
        userId: user.id,
        lastFetched: new Date().toISOString(),
        tags: [],
      };

      const updated = [...feeds, newFeed];
      setFeeds(updated);
      return newFeed;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rss-feeds', user?.id] });
      toast({
        title: 'Success',
        description: 'RSS feed added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const removeFeed = useMutation({
    mutationFn: async (feedId: string) => {
      if (!user) throw new Error('Must be logged in to remove feeds');
      
      const updated = feeds.filter(f => f.id !== feedId);
      setFeeds(updated);
      return feedId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rss-feeds', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['rss-items'] });
      toast({
        title: 'Success',
        description: 'Feed removed successfully',
      });
    },
  });

  const refreshFeed = useMutation({
    mutationFn: async (feedId: string) => {
      const feed = feeds.find(f => f.id === feedId);
      if (!feed) throw new Error('Feed not found');

      const items = await fetchRSSFeed(feed.url);
      const updated = feeds.map(f =>
        f.id === feedId
          ? { ...f, lastFetched: new Date().toISOString() }
          : f
      );
      setFeeds(updated);
      
      // Invalidate items query
      queryClient.invalidateQueries({ queryKey: ['rss-items', feedId] });
      
      return items;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Feed refreshed successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    feeds: feedsQuery.data || [],
    isLoading: feedsQuery.isLoading,
    addFeed: addFeed.mutateAsync,
    removeFeed: removeFeed.mutateAsync,
    refreshFeed: refreshFeed.mutateAsync,
    isAdding: addFeed.isPending,
    isRefreshing: refreshFeed.isPending,
  };
}

export function useRSSFeedItems(feedId?: string) {
  const { feeds } = useRSSFeeds();
  const feed = feedId ? feeds.find(f => f.id === feedId) : null;

  return useQuery({
    queryKey: ['rss-items', feedId],
    queryFn: async () => {
      if (!feed) return [];
      return await fetchRSSFeed(feed.url);
    },
    enabled: !!feed,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAllRSSItems() {
  const { feeds } = useRSSFeeds();

  return useQuery({
    queryKey: ['rss-items', 'all'],
    queryFn: async () => {
      const allItems: RSSItem[] = [];
      
      for (const feed of feeds) {
        try {
          const items = await fetchRSSFeed(feed.url);
          allItems.push(...items);
        } catch (error) {
          console.error(`Error fetching feed ${feed.url}:`, error);
        }
      }

      // Sort by date, newest first
      return allItems.sort((a, b) => {
        const dateA = new Date(a.pubDate).getTime();
        const dateB = new Date(b.pubDate).getTime();
        return dateB - dateA;
      });
    },
    enabled: feeds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}



