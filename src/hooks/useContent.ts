import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useEffect } from 'react';
import { normalizeArticle } from '@/lib/articleValidation';

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

// Fetch all published content with real-time updates
export function usePublishedContent(limit = 20) {
  const queryClient = useQueryClient();
  
  // Set up real-time subscription for automatic updates
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    
    // Subscribe to content table changes
    const channel = supabase
      .channel('content-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'content',
          filter: 'status=eq.published', // Only listen to published articles
        },
        (payload) => {
          if (import.meta.env.DEV) {
            console.log('📡 Real-time update received:', payload.eventType, payload.new || payload.old);
          }
          // Invalidate and refetch all content queries
          queryClient.invalidateQueries({ queryKey: ['content'] });
          queryClient.refetchQueries({ queryKey: ['content'] });
        }
      )
      .subscribe((status) => {
        if (import.meta.env.DEV) {
          console.log('🔔 Realtime subscription status:', status);
        }
      });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  return useQuery({
    queryKey: ['content', 'published', limit],
    staleTime: 0, // Always consider stale to ensure fresh data
    refetchOnMount: true, // Always refetch on mount to get latest articles
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchInterval: 30000, // Auto-refetch every 30 seconds
    queryFn: async () => {
      if (!isSupabaseConfigured()) {
        return [] as ContentItem[];
      }
      
      // Try feed_content_view first (if it exists)
      // Silently catch 404 errors as the view may not exist
      // Order by newest first - articles with published_at = NOW() appear at top
      let { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(limit);
      
      // If view doesn't exist or fails, use direct query
      if (error || !data || data.length === 0) {
        // Only log in development, suppress in production
        if (import.meta.env.DEV && error?.code !== 'PGRST116') {
          console.warn('feed_content_view not available, using direct query:', error?.message);
        }
        
        // Simple query - get published content, ordered by newest first
        // Use select('*') to avoid column-specific errors
        // NULLS LAST ensures articles with published_at = NOW() appear first
        let { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false, nullsFirst: false })
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
          // Log detailed error information
          if (import.meta.env.DEV) {
            console.error('❌ Error fetching published content:', JSON.stringify({
              message: contentError.message,
              code: contentError.code,
              details: contentError.details,
              hint: contentError.hint,
            }, null, 2));
          }
          // Don't return empty - try to get any content as fallback (without status filter)
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('content')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
          
          if (fallbackError) {
            if (import.meta.env.DEV) {
              console.error('❌ Fallback query also failed:', JSON.stringify({
                message: fallbackError.message,
                code: fallbackError.code,
                details: fallbackError.details,
              }, null, 2));
            }
            return [] as ContentItem[];
          }
          
          if (fallbackData && fallbackData.length > 0) {
            if (import.meta.env.DEV) {
              console.warn(`⚠️ Using fallback: Found ${fallbackData.length} articles (may not be published)`);
            }
            contentData = fallbackData;
          } else {
            return [] as ContentItem[];
          }
        }
        
        if (!contentData || contentData.length === 0) {
          if (import.meta.env.DEV) {
            console.warn('⚠️ No published content found in database');
            // Try to get ANY content to see what's there
            const { data: anyContent } = await supabase
              .from('content')
              .select('id, title, status, published_at')
              .limit(5);
            if (anyContent && anyContent.length > 0) {
              console.warn('Found content but not published:', anyContent);
            }
          }
          return [] as ContentItem[];
        }

        // Debug logging in development
        if (import.meta.env.DEV) {
          console.log(`✅ Found ${contentData.length} published articles`);
          console.log('Sample article:', {
            id: contentData[0]?.id,
            title: contentData[0]?.title,
            status: contentData[0]?.status,
            published_at: contentData[0]?.published_at,
            hasBody: !!contentData[0]?.body,
            hasExcerpt: !!contentData[0]?.excerpt,
            author_id: contentData[0]?.author_id,
          });
        }
        
        // Get feeds and niches separately
        const contentIds = contentData.map(c => c.id);
        
        // Get feed relationships (with error handling)
        let feedRelations: any[] = [];
        try {
          const { data } = await supabase
            .from('content_feeds')
            .select('content_id, feed_id, feeds(slug, name)')
            .in('content_id', contentIds);
          feedRelations = data || [];
        } catch (e) {
          if (import.meta.env.DEV) {
            console.warn('Could not fetch feed relationships:', e);
          }
        }
        
        // Get niche relationships (with error handling)
        let nicheRelations: any[] = [];
        try {
          const { data } = await supabase
            .from('content_niches')
            .select('content_id, niche_id, niches(name)')
            .in('content_id', contentIds);
          nicheRelations = data || [];
        } catch (e) {
          if (import.meta.env.DEV) {
            console.warn('Could not fetch niche relationships:', e);
          }
        }
        
        // Get tags (with error handling)
        let tagRelations: any[] = [];
        try {
          const { data } = await supabase
            .from('content_tags')
            .select('content_id, tag_id, tags(name)')
            .in('content_id', contentIds);
          tagRelations = data || [];
        } catch (e) {
          if (import.meta.env.DEV) {
            console.warn('Could not fetch tag relationships:', e);
          }
        }
        
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
          
          // If no feed relationship, try to infer from content
          let feedSlug = primaryFeed.slug || '';
          if (!feedSlug) {
            const titleLower = (item.title || '').toLowerCase();
            const bodyLower = (item.body || item.excerpt || item.summary || '').toLowerCase();
            const tagsLower = (Array.isArray(item.tags) ? item.tags.join(' ') : (item.tags || '')).toLowerCase();
            const combined = `${titleLower} ${bodyLower} ${tagsLower}`;
            
            // More comprehensive inference logic
            if (combined.includes('security') || combined.includes('cyber') || combined.includes('threat') || 
                combined.includes('breach') || combined.includes('ransomware') || combined.includes('hack') ||
                combined.includes('vulnerability') || combined.includes('cisa') || combined.includes('malware')) {
              feedSlug = 'secured';
            } else if (combined.includes('game') || combined.includes('gaming') || combined.includes('esports') ||
                       combined.includes('nintendo') || combined.includes('playstation') || combined.includes('xbox')) {
              feedSlug = 'play';
            } else {
              // Default to tech/innovate for AI, hardware, software, etc.
              feedSlug = 'innovate';
            }
          }
          
          // Get niches from database relationships (PRIORITY - use actual DB data)
          // This is the source of truth - database niches override all inference
          let niches = nicheMap[item.id] || [];
          
          // Only infer if no database niches exist
          // This prevents incorrect gaming assignments for tech/hardware articles
          if (niches.length === 0) {
            // Improved inference logic - check content first, then feed
            const titleLower = (item.title || '').toLowerCase();
            const bodyLower = (item.body || item.excerpt || item.summary || '').toLowerCase();
            const tagsLower = (tags.join(' ') || '').toLowerCase();
            const combined = `${titleLower} ${bodyLower} ${tagsLower}`;
            
            // Hardware/AI/Quantum computing should NOT be gaming
            // These should be Hardware or Tech, never Gaming
            if (combined.includes('quantum') || combined.includes('silicon') || 
                combined.includes('sovereign ai') || combined.includes('data center') ||
                combined.includes('hardware') || combined.includes('infrastructure') ||
                combined.includes('nvidia') || combined.includes('amd') ||
                combined.includes('chip') || combined.includes('semiconductor') ||
                combined.includes('ai hardware') || combined.includes('superchip')) {
              niches = ['Hardware', 'Tech'];
            } else if (combined.includes('security') || combined.includes('cyber') || 
                       combined.includes('threat') || combined.includes('breach') ||
                       combined.includes('ransomware') || combined.includes('vulnerability') ||
                       combined.includes('cisa') || combined.includes('malware')) {
              niches = ['Security'];
            } else if ((combined.includes('game') || combined.includes('gaming') || 
                       combined.includes('esports') || combined.includes('nintendo') ||
                       combined.includes('playstation') || combined.includes('xbox')) && 
                       !combined.includes('hardware') && !combined.includes('quantum') &&
                       !combined.includes('ai') && !combined.includes('data center') &&
                       !combined.includes('chip') && !combined.includes('semiconductor')) {
              // Only assign to gaming if it's actually about games, not hardware/tech
              niches = ['Gaming'];
            } else if (feedSlug === 'secured') {
              niches = ['Security'];
            } else if (feedSlug === 'play') {
              // Only use play feed for gaming if content confirms it
              if (combined.includes('game') || combined.includes('gaming')) {
                niches = ['Gaming'];
              } else {
                niches = ['Tech']; // Default to Tech if play feed but not gaming content
              }
            } else {
              niches = ['Tech']; // Default to Tech
            }
          }
          
          // Log in dev mode if we're using inference instead of DB niches
          if (import.meta.env.DEV && nicheMap[item.id]?.length === 0 && niches.length > 0) {
            console.log(`⚠️ Using inferred niches for "${item.title}":`, niches, '(DB niches not found)');
          }
          
          // Handle tags - can be string, array, or null
          let tags: string[] = tagMap[item.id] || [];
          if (tags.length === 0 && item.tags) {
            if (Array.isArray(item.tags)) {
              tags = item.tags;
            } else if (typeof item.tags === 'string') {
              // Parse comma-separated tags
              tags = item.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0);
            }
          }

          // Handle author - check both author_name and author fields
          const authorName = item.author_name || (item as any).author || 'Anonymous';

          // Normalize article data to ensure consistency
          const normalizedItem = normalizeArticle(item);
          
          const contentItem: ContentItem = {
            id: normalizedItem.id || '',
            title: normalizedItem.title || 'Untitled',
            slug: normalizedItem.slug || '',
            body: normalizedItem.body || normalizedItem.excerpt || normalizedItem.summary || '',
            excerpt: normalizedItem.excerpt || normalizedItem.summary || (normalizedItem.title ? `${normalizedItem.title.substring(0, 150)}...` : ''),
            summary: normalizedItem.summary || normalizedItem.excerpt || '',
            status: normalizedItem.status || 'draft',
            published_at: normalizedItem.published_at || normalizedItem.created_at || new Date().toISOString(),
            created_at: normalizedItem.created_at || new Date().toISOString(),
            updated_at: normalizedItem.updated_at || null,
            featured_image_url: normalizedItem.featured_image_url || null,
            read_time_minutes: normalizedItem.read_time_minutes || 5,
            is_featured: normalizedItem.is_featured || false,
            is_breaking: normalizedItem.is_breaking || false,
            security_score: normalizedItem.security_score || null,
            content_type: normalizedItem.content_type || 'article',
            author_id: normalizedItem.author_id || null,
            feed_slug: feedSlug,
            feed_name: primaryFeed.name || (feedSlug === 'secured' ? 'Secured' : feedSlug === 'play' ? 'Play' : 'Innovate'),
            feed_id: feedMap[normalizedItem.id]?.feeds?.[0]?.id || null,
            niches: niches,
            tags: tags,
            author_name: authorName,
            view_count: normalizedItem.view_count || 0,
          };
          
          return contentItem;
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
      
      // Try view first (silently catch 404 errors)
      // Order by newest first to ensure new articles appear at top
      let { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .eq('feed_slug', feedSlug)
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(limit);
      
      // If view fails, use direct query
      if (error || !data || data.length === 0) {
        // Try to get feed ID, but don't fail if feeds table doesn't exist
        let feedId: number | null = null;
        let feedName = '';
        
        try {
          const { data: feedData, error: feedError } = await supabase
            .from('feeds')
            .select('id, name')
            .eq('slug', feedSlug)
            .maybeSingle();
          
          // Silently handle 404 for feeds table
          if (feedData && !feedError) {
            feedId = feedData.id;
            feedName = feedData.name || '';
          }
        } catch (feedError: any) {
          // Only log in development, suppress 404 errors
          if (import.meta.env.DEV && feedError?.code !== 'PGRST116') {
            console.warn('Feeds table not available, using content-only query:', feedError);
          }
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
                .select('*')
                .in('id', contentIds)
                .eq('status', 'published')
                .order('published_at', { ascending: false })
                .limit(limit);
              
              contentData = result.data || [];
              contentError = result.error;
            }
          } catch (relError) {
            if (import.meta.env.DEV) {
              console.warn('Could not fetch via feed relationship:', relError);
            }
          }
        }
        
        // If no content found via feed, get all published content and filter by keywords
        if (contentData.length === 0) {
          const result = await supabase
            .from('content')
            .select('*')
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
          // Only log in development, suppress expected errors in production
          if (import.meta.env.DEV && contentError) {
            console.error('Error fetching content by feed:', contentError);
          }
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
      
      // Try view first (silently catch 404 errors)
      let { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .contains('niches', [nicheName])
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);
      
      // If view fails, fallback to direct query
      if (error || !data || data.length === 0) {
        const { data: contentData, error: contentError } = await supabase
          .from('content')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit * 2);
        
        if (contentError) {
          if (import.meta.env.DEV && contentError.code !== 'PGRST116') {
            console.error('Error fetching content by niche:', contentError);
          }
          return [] as ContentItem[];
        }
        
        // Filter by niche keywords
        const nicheKeywords: Record<string, string[]> = {
          'tech': ['tech', 'technology', 'ai', 'hardware', 'software', 'innovation'],
          'security': ['security', 'cyber', 'threat', 'malware', 'breach', 'vulnerability'],
          'gaming': ['game', 'gaming', 'gta', 'nvidia', 'rtx', 'switch', 'console'],
        };
        
        const keywords = nicheKeywords[nicheName.toLowerCase()] || [];
        if (keywords.length > 0 && contentData) {
          data = contentData.filter((item: any) => {
            const titleLower = (item.title || '').toLowerCase();
            const bodyLower = (item.body || '').toLowerCase();
            return keywords.some(keyword => 
              titleLower.includes(keyword) || bodyLower.includes(keyword)
            );
          }).slice(0, limit) as ContentItem[];
        } else {
          data = (contentData || []).slice(0, limit) as ContentItem[];
        }
      }
      
      if (error && import.meta.env.DEV && error.code !== 'PGRST116') {
        console.error('Error fetching content by niche:', error);
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
      
      // Try view first (silently catch 404 errors)
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
          // Only log in development, suppress expected errors in production
          if (import.meta.env.DEV && contentError) {
            console.error('Error fetching content by slug:', contentError);
          }
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
      
      // Try view first (silently catch 404 errors)
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
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(limit);
        
        if (contentError || !contentData) {
          // Only log in development, suppress expected errors in production
          if (import.meta.env.DEV && contentError) {
            console.error('Error fetching trending content:', contentError);
          }
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
