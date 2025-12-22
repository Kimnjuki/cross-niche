import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type ContentItem = Tables<'feed_content_view'>;

/**
 * Fetch trending content using the calculate_trending_score function
 * This uses gravity-based decay: (views / (hours_since_published + 2)^1.5)
 */
export function useTrendingContent(limit = 6) {
  return useQuery({
    queryKey: ['content', 'trending', limit],
    queryFn: async () => {
      // First, update trending scores
      await supabase.rpc('update_trending_scores');

      // Then fetch content ordered by trending_score
      const { data, error } = await supabase
        .from('feed_content_view')
        .select('*')
        .eq('status', 'published')
        .order('trending_score', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) {
        // Fallback to view_count if trending_score not available
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('feed_content_view')
          .select('*')
          .eq('status', 'published')
          .order('view_count', { ascending: false })
          .limit(limit);

        if (fallbackError) throw fallbackError;
        return fallbackData as ContentItem[];
      }

      return data as ContentItem[];
    },
  });
}



