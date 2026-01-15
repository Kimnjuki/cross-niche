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
        // First try with published status
        let { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);
        
        // If no published content, try to get any content (we'll show it anyway)
        if (!contentData || contentData.length === 0) {
          const { data: allContentData } = await supabase
            .from('content')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
          
          if (allContentData && allContentData.length > 0) {
            console.warn(`Found ${allContentData.length} articles but none are published. Status values:`, 
              [...new Set(allContentData.map(c => c.status))]);
            // Use the content anyway - better to show something than nothing
            contentData = allContentData;
          }
        }
        
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
        // Try to get feed ID, but don't fail if feeds table doesn't exist
        let feedId: number | null = null;
        let feedName = '';
        
        try {
          const { data: feedData } = await supabase
            .from('feeds')
            .select('id, name')
            .eq('slug', feedSlug)
            .maybeSingle();
          
          if (feedData) {
            feedId = feedData.id;
            feedName = feedData.name || '';
          }
        } catch (feedError) {
          console.warn('Feeds table not available, using content-only query:', feedError);
        }
        
        // Get content - either by feed relationship or all published content
        let contentData: any[] = [];
        let contentError: any = null;
        
        if (feedId) {
          // Try to get content via feed relationship
          try {
            const { data: contentFeeds } = await supabase
              .from('content_feeds')
              .select('content_id')
              .eq('feed_id', feedId);
            
            if (contentFeeds && contentFeeds.length > 0) {
              const contentIds = contentFeeds.map(cf => cf.content_id);
              const result = await supabase
                .from('content')
                .select('id, title, slug, body, excerpt, summary, status, published_at, created_at, updated_at, featured_image_url, read_time_minutes, is_featured, is_breaking, security_score, content_type, author_id')
                .in('id', contentIds)
                .eq('status', 'published')
                .order('published_at', { ascending: false })
                .limit(limit);
              
              contentData = result.data || [];
              contentError = result.error;
            }
          } catch (relError) {
            console.warn('Could not fetch via feed relationship:', relError);
          }
        }
        
        // If no content found via feed, get all published content and filter by keywords
        if (contentData.length === 0) {
          const result = await supabase
            .from('content')
            .select('id, title, slug, body, excerpt, summary, status, published_at, created_at, updated_at, featured_image_url, read_time_minutes, is_featured, is_breaking, security_score, content_type, author_id')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(limit * 2); // Get more to filter
          
          contentData = result.data || [];
          contentError = result.error;
          
          // Filter by keywords based on feed slug
          const keywords: Record<string, string[]> = {
            'secured': ['security', 'cyber', 'threat', 'malware', 'breach', 'vulnerability'],
            'play': ['game', 'gaming', 'gta', 'nvidia', 'rtx', 'switch', 'console'],
            'innovate': ['tech', 'ces', 'ai', 'hardware', 'software', 'innovation'],
          };
          
          const feedKeywords = keywords[feedSlug] || [];
          if (feedKeywords.length > 0) {
            contentData = contentData.filter((item: any) => {
              const titleLower = (item.title || '').toLowerCase();
              const bodyLower = (item.body || '').toLowerCase();
              return feedKeywords.some(keyword => 
                titleLower.includes(keyword) || bodyLower.includes(keyword)
              );
            }).slice(0, limit);
          } else {
            contentData = contentData.slice(0, limit);
          }
        }
        
        if (contentError || !contentData || contentData.length === 0) {
          console.error('Error fetching content by feed:', contentError);
          return [] as ContentItem[];
        }
        
        // Get relationships (optional, don't fail if tables don't exist)
        const contentIds = contentData.map(c => c.id);
        const nicheMap: Record<string, string[]> = {};
        const tagMap: Record<string, string[]> = {};
        
        try {
          const { data: nicheRelations } = await supabase
            .from('content_niches')
            .select('content_id, niche_id')
            .in('content_id', contentIds);
          
          if (nicheRelations && nicheRelations.length > 0) {
            try {
              const nicheIds = [...new Set(nicheRelations.map(nr => nr.niche_id))];
              const { data: nichesData } = await supabase
                .from('niches')
                .select('id, name')
                .in('id', nicheIds);
              
              const nicheDetailsMap: Record<number, string> = {};
              nichesData?.forEach(n => { nicheDetailsMap[n.id] = n.name; });
              
              nicheRelations.forEach((nr: any) => {
                if (!nicheMap[nr.content_id]) nicheMap[nr.content_id] = [];
                const nicheName = nicheDetailsMap[nr.niche_id];
                if (nicheName) nicheMap[nr.content_id].push(nicheName);
              });
            } catch {}
          }
        } catch {}
        
        try {
          const { data: tagRelations } = await supabase
            .from('content_tags')
            .select('content_id, tag_id')
            .in('content_id', contentIds);
          
          if (tagRelations && tagRelations.length > 0) {
            try {
              const tagIds = [...new Set(tagRelations.map(tr => tr.tag_id))];
              const { data: tagsData } = await supabase
                .from('tags')
                .select('id, name')
                .in('id', tagIds);
              
              const tagDetailsMap: Record<string, string> = {};
              tagsData?.forEach(t => { tagDetailsMap[t.id] = t.name; });
              
              tagRelations.forEach((tr: any) => {
                if (!tagMap[tr.content_id]) tagMap[tr.content_id] = [];
                const tagName = tagDetailsMap[tr.tag_id];
                if (tagName) tagMap[tr.content_id].push(tagName);
              });
            } catch {}
          }
        } catch {}
        
        // Transform to ContentItem format
        data = contentData.map((item: any) => ({
          ...item,
          feed_slug: feedSlug,
          feed_name: feedName,
          feed_id: feedId,
          niches: nicheMap[item.id] || [],
          tags: tagMap[item.id] || [],
          author_name: 'Anonymous',
          view_count: 0,
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
          .select('id, title, slug, body, excerpt, summary, status, published_at, created_at, updated_at, featured_image_url, read_time_minutes, is_featured, is_breaking, security_score, content_type, author_id')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();
        
        if (contentError || !contentData) {
          console.error('Error fetching content by slug:', contentError);
          return null;
        }
        
        // Get relationships (optional, don't fail if tables don't exist)
        let feedSlug = '';
        let feedName = '';
        const niches: string[] = [];
        const tags: string[] = [];
        
        try {
          const { data: feedRelation } = await supabase
            .from('content_feeds')
            .select('feed_id')
            .eq('content_id', contentData.id)
            .limit(1)
            .maybeSingle();
          
          if (feedRelation?.feed_id) {
            try {
              const { data: feedData } = await supabase
                .from('feeds')
                .select('slug, name')
                .eq('id', feedRelation.feed_id)
                .maybeSingle();
              
              if (feedData) {
                feedSlug = feedData.slug || '';
                feedName = feedData.name || '';
              }
            } catch {}
          }
        } catch {}
        
        try {
          const { data: nicheRelations } = await supabase
            .from('content_niches')
            .select('niche_id')
            .eq('content_id', contentData.id);
          
          if (nicheRelations && nicheRelations.length > 0) {
            try {
              const nicheIds = nicheRelations.map(nr => nr.niche_id);
              const { data: nichesData } = await supabase
                .from('niches')
                .select('name')
                .in('id', nicheIds);
              
              nichesData?.forEach(n => {
                if (n.name) niches.push(n.name);
              });
            } catch {}
          }
        } catch {}
        
        try {
          const { data: tagRelations } = await supabase
            .from('content_tags')
            .select('tag_id')
            .eq('content_id', contentData.id);
          
          if (tagRelations && tagRelations.length > 0) {
            try {
              const tagIds = tagRelations.map(tr => tr.tag_id);
              const { data: tagsData } = await supabase
                .from('tags')
                .select('name')
                .in('id', tagIds);
              
              tagsData?.forEach(t => {
                if (t.name) tags.push(t.name);
              });
            } catch {}
          }
        } catch {}
        
        data = {
          ...contentData,
          feed_slug: feedSlug,
          feed_name: feedName,
          niches: niches,
          tags: tags,
          author_name: 'Anonymous',
          view_count: 0,
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
        // Order by published_at since view_count doesn't exist
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('id, title, slug, body, excerpt, summary, status, published_at, created_at, updated_at, featured_image_url, read_time_minutes, is_featured, is_breaking, security_score, content_type, author_id')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);
        
        if (contentError || !contentData) {
          console.error('Error fetching trending content:', contentError);
          return [] as ContentItem[];
        }
        
        // Transform to ContentItem format (no relationships needed for trending)
        data = contentData.map((item: any) => ({
          ...item,
          feed_slug: '',
          feed_name: '',
          niches: [],
          tags: [],
          author_name: 'Anonymous',
          view_count: 0,
        })) as ContentItem[];
      }
      
      return (data as ContentItem[]) || [];
    },
  });
}
