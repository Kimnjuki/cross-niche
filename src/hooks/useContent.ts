import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type ContentItem = Tables<'feed_content_view'>;
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
      
      // Try feed_content_view first
      let { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      // If view fails or returns no data, try direct query with joins
      if (error || !data || data.length === 0) {
        console.warn('feed_content_view failed or empty, trying direct query:', error?.message);
        
        const { data: directData, error: directError } = await supabase
          .from('content')
          .select(`
            *,
            content_feeds!inner(
              feed_id,
              feeds!inner(slug, name)
            ),
            content_niches!inner(
              niche_id,
              niches!inner(name)
            )
          `)
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);
        
        if (directError) {
          console.error('Error fetching published content (direct query):', directError);
          return [] as ContentItem[];
        }
        
        // Transform direct query result to match ContentItem format
        if (directData) {
          data = directData.map((item: any) => ({
            ...item,
            feed_slug: item.content_feeds?.[0]?.feeds?.slug || '',
            feed_name: item.content_feeds?.[0]?.feeds?.name || '',
            niches: item.content_niches?.map((cn: any) => cn.niches?.name).filter(Boolean) || [],
            author_name: 'Anonymous', // Will need to join authors table if needed
          })) as ContentItem[];
        }
      }
      
      return data as ContentItem[] || [];
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
      
      const { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .eq('feed_slug', feedSlug)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching content by feed:', error);
        return [] as ContentItem[];
      }
      return data as ContentItem[];
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
      
      const { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching content by slug:', error);
        return null;
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
      
      const { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching trending content:', error);
        return [] as ContentItem[];
      }
      return data as ContentItem[];
    },
  });
}
