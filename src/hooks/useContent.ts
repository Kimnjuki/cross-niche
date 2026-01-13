import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// ContentItem type - compatible with both view and direct queries
export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  body: string | null;
  excerpt: string | null;
  summary: string | null;
  status: string;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  featured_image_url: string | null;
  read_time_minutes: number | null;
  is_featured: boolean | null;
  is_breaking: boolean | null;
  security_score: number | null;
  content_type: string | null;
  author_id: string | null;
  author_name?: string;
  feed_slug?: string;
  feed_name?: string;
  feed_id?: number | null;
  niches?: string[];
  tags?: string[];
  view_count?: number | null;
}

export type Niche = Tables<'niches'>;
export type Feed = Tables<'feeds'>;

// Fetch all published content
export function usePublishedContent(limit = 20) {
  return useQuery({
    queryKey: ['content', 'published', limit],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return [] as ContentItem[];
      }
      
      // Try feed_content_view first (if it exists)
      let { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      // If view doesn't exist or fails, use direct query
      if (error || !data || data.length === 0) {
        console.warn('feed_content_view not available, using direct query:', error?.message);
        
        // Simple query - just get content first
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);
        
        if (contentError) {
          console.error('Error fetching published content:', contentError);
          return [] as ContentItem[];
        }
        
        if (!contentData || contentData.length === 0) {
          return [] as ContentItem[];
        }
        
        // Get feeds and niches separately
        const contentIds = contentData.map(c => c.id);
        
        // Get feed relationships
        const { data: feedRelations } = await supabase
          .from('content_feeds')
          .select('content_id, feed_id, feeds(slug, name)')
          .in('content_id', contentIds);
        
        // Get niche relationships
        const { data: nicheRelations } = await supabase
          .from('content_niches')
          .select('content_id, niche_id, niches(name)')
          .in('content_id', contentIds);
        
        // Get tags
        const { data: tagRelations } = await supabase
          .from('content_tags')
          .select('content_id, tag_id, tags(name)')
          .in('content_id', contentIds);
        
        // Build feed map
        const feedMap: Record<string, any> = {};
        feedRelations?.forEach((fr: any) => {
          if (!feedMap[fr.content_id]) {
            feedMap[fr.content_id] = { feeds: [] };
          }
          if (fr.feeds) {
            feedMap[fr.content_id].feeds.push(fr.feeds);
          }
        });
        
        // Build niche map
        const nicheMap: Record<string, string[]> = {};
        nicheRelations?.forEach((nr: any) => {
          if (!nicheMap[nr.content_id]) {
            nicheMap[nr.content_id] = [];
          }
          if (nr.niches?.name) {
            nicheMap[nr.content_id].push(nr.niches.name);
          }
        });
        
        // Build tag map
        const tagMap: Record<string, string[]> = {};
        tagRelations?.forEach((tr: any) => {
          if (!tagMap[tr.content_id]) {
            tagMap[tr.content_id] = [];
          }
          if (tr.tags?.name) {
            tagMap[tr.content_id].push(tr.tags.name);
          }
        });
        
        // Transform to ContentItem format
        data = contentData.map((item: any) => {
          const feeds = feedMap[item.id]?.feeds || [];
          const primaryFeed = feeds[0] || {};
          
          return {
            ...item,
            feed_slug: primaryFeed.slug || '',
            feed_name: primaryFeed.name || '',
            feed_id: feedMap[item.id]?.feeds?.[0]?.id || null,
            niches: nicheMap[item.id] || [],
            tags: tagMap[item.id] || [],
            author_name: 'Anonymous', // Default if no author
          } as ContentItem;
        });
      }
      
      return (data as ContentItem[]) || [];
    },
  });
}

// Fetch content by feed slug (e.g., 'secured', 'innovate', 'play')
export function useContentByFeed(feedSlug: string, limit = 20) {
  return useQuery({
    queryKey: ['content', 'feed', feedSlug, limit],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return [] as ContentItem[];
      }
      
      // Try view first
      let { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .eq('feed_slug', feedSlug)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      // If view fails, use direct query
      if (error || !data || data.length === 0) {
        // Get feed ID first
        const { data: feedData } = await supabase
          .from('feeds')
          .select('id')
          .eq('slug', feedSlug)
          .maybeSingle();
        
        if (!feedData) {
          return [] as ContentItem[];
        }
        
        // Get content linked to this feed
        const { data: contentFeeds } = await supabase
          .from('content_feeds')
          .select('content_id')
          .eq('feed_id', feedData.id);
        
        if (!contentFeeds || contentFeeds.length === 0) {
          return [] as ContentItem[];
        }
        
        const contentIds = contentFeeds.map(cf => cf.content_id);
        
        // Get the actual content
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*')
          .in('id', contentIds)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);
        
        if (contentError || !contentData) {
          console.error('Error fetching content by feed:', contentError);
          return [] as ContentItem[];
        }
        
        // Get niches and tags
        const { data: nicheRelations } = await supabase
          .from('content_niches')
          .select('content_id, niches(name)')
          .in('content_id', contentIds);
        
        const { data: tagRelations } = await supabase
          .from('content_tags')
          .select('content_id, tags(name)')
          .in('content_id', contentIds);
        
        const nicheMap: Record<string, string[]> = {};
        nicheRelations?.forEach((nr: any) => {
          if (!nicheMap[nr.content_id]) nicheMap[nr.content_id] = [];
          if (nr.niches?.name) nicheMap[nr.content_id].push(nr.niches.name);
        });
        
        const tagMap: Record<string, string[]> = {};
        tagRelations?.forEach((tr: any) => {
          if (!tagMap[tr.content_id]) tagMap[tr.content_id] = [];
          if (tr.tags?.name) tagMap[tr.content_id].push(tr.tags.name);
        });
        
        // Transform to ContentItem format
        data = contentData.map((item: any) => ({
          ...item,
          feed_slug: feedSlug,
          feed_name: feedData.name || '',
          feed_id: feedData.id,
          niches: nicheMap[item.id] || [],
          tags: tagMap[item.id] || [],
          author_name: 'Anonymous',
        })) as ContentItem[];
      }
      
      return (data as ContentItem[]) || [];
    },
  });
}

// Fetch content by niche name
export function useContentByNiche(nicheName: string, limit = 20) {
  return useQuery({
    queryKey: ['content', 'niche', nicheName, limit],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return [] as ContentItem[];
      }
      
      const { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .contains('niches', [nicheName])
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching content by niche:', error);
        return [] as ContentItem[];
      }
      return data as ContentItem[];
    },
  });
}

// Fetch featured content
export function useFeaturedContent(limit = 5) {
  return useQuery({
    queryKey: ['content', 'featured', limit],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('featured_content_view')
        .select('*')
        .eq('status', 'published')
        .order('featured_priority', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching featured content:', error);
        return [];
      }
      return data;
    },
  });
}

// Fetch single content item by slug
export function useContentBySlug(slug: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['content', 'slug', slug],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return null;
      }
      
      // Try view first
      let { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      
      // If view fails, use direct query
      if (error || !data) {
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();
        
        if (contentError || !contentData) {
          console.error('Error fetching content by slug:', contentError);
          return null;
        }
        
        // Get relationships
        const { data: feedRelation } = await supabase
          .from('content_feeds')
          .select('feeds(slug, name)')
          .eq('content_id', contentData.id)
          .limit(1)
          .maybeSingle();
        
        const { data: nicheRelations } = await supabase
          .from('content_niches')
          .select('niches(name)')
          .eq('content_id', contentData.id);
        
        const { data: tagRelations } = await supabase
          .from('content_tags')
          .select('tags(name)')
          .eq('content_id', contentData.id);
        
        data = {
          ...contentData,
          feed_slug: feedRelation?.feeds?.slug || '',
          feed_name: feedRelation?.feeds?.name || '',
          niches: nicheRelations?.map((nr: any) => nr.niches?.name).filter(Boolean) || [],
          tags: tagRelations?.map((tr: any) => tr.tags?.name).filter(Boolean) || [],
          author_name: 'Anonymous',
        } as ContentItem;
      }
      
      return data as ContentItem | null;
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!slug,
  });
}

// Fetch all niches
export function useNiches() {
  return useQuery({
    queryKey: ['niches'],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return [] as Niche[];
      }
      
      const { data, error } = await supabase
        .from('niches')
        .select('*')
        .order('id');
      
      if (error) {
        console.error('Error fetching niches:', error);
        return [] as Niche[];
      }
      return data as Niche[];
    },
  });
}

// Fetch all active feeds
export function useFeeds() {
  return useQuery({
    queryKey: ['feeds'],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return [] as Feed[];
      }
      
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) {
        console.error('Error fetching feeds:', error);
        return [] as Feed[];
      }
      return data as Feed[];
    },
  });
}

// Fetch trending content (by view count)
export function useTrendingContent(limit = 6) {
  return useQuery({
    queryKey: ['content', 'trending', limit],
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return [] as ContentItem[];
      }
      
      // Try view first
      let { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(limit);
      
      // If view fails, use direct query
      if (error || !data || data.length === 0) {
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*')
          .eq('status', 'published')
          .order('view_count', { ascending: false, nullsFirst: false })
          .limit(limit);
        
        if (contentError || !contentData) {
          console.error('Error fetching trending content:', contentError);
          return [] as ContentItem[];
        }
        
        // Get relationships (simplified - just get first feed for each)
        const contentIds = contentData.map(c => c.id);
        
        const { data: feedRelations } = await supabase
          .from('content_feeds')
          .select('content_id, feeds(slug, name)')
          .in('content_id', contentIds);
        
        const feedMap: Record<string, any> = {};
        feedRelations?.forEach((fr: any) => {
          if (fr.feeds && !feedMap[fr.content_id]) {
            feedMap[fr.content_id] = fr.feeds;
          }
        });
        
        // Transform to ContentItem format
        data = contentData.map((item: any) => {
          const feed = feedMap[item.id] || {};
          return {
            ...item,
            feed_slug: feed.slug || '',
            feed_name: feed.name || '',
            niches: [],
            tags: [],
            author_name: 'Anonymous',
          } as ContentItem;
        });
      }
      
      return (data as ContentItem[]) || [];
    },
  });
}
