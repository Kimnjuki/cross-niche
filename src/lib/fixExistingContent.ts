import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

/**
 * Fix all existing content in the database to ensure it displays correctly
 * This addresses the specific issues with the INSERT statements provided
 */
export async function fixExistingContent() {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  const results = {
    updated: 0,
    linkedToFeeds: 0,
    linkedToNiches: 0,
    errors: [] as string[],
  };

  try {
    // Step 1: Get all content
    const { data: allContent, error: contentError } = await supabase
      .from('content')
      .select('*');

    if (contentError || !allContent) {
      return { success: false, error: contentError?.message || 'Failed to fetch content' };
    }

    // Step 2: Get feeds and niches
    const { data: feeds } = await supabase.from('feeds').select('*');
    const { data: niches } = await supabase.from('niches').select('*');

    const feedMap: Record<string, number> = {};
    const nicheMap: Record<string, number> = {};

    feeds?.forEach(f => { feedMap[f.slug] = f.id; });
    niches?.forEach(n => { nicheMap[n.name] = n.id; });

    // Step 3: Fix each content item
    for (const content of allContent) {
      const updates: any = {};
      let needsUpdate = false;

      // Fix: excerpt field (use summary if excerpt is missing)
      if (!content.excerpt && content.summary) {
        updates.excerpt = content.summary;
        needsUpdate = true;
      } else if (!content.excerpt && !content.summary && content.body) {
        // Generate excerpt from body (first 200 chars)
        updates.excerpt = content.body.substring(0, 200).replace(/\n/g, ' ').trim() + '...';
        needsUpdate = true;
      }

      // Fix: read_time_minutes (use estimated_reading_time_minutes if available)
      if (!content.read_time_minutes) {
        if ((content as any).estimated_reading_time_minutes) {
          updates.read_time_minutes = (content as any).estimated_reading_time_minutes;
        } else if ((content as any).word_count) {
          // Calculate from word count (200 words per minute)
          updates.read_time_minutes = Math.max(1, Math.ceil((content as any).word_count / 200));
        } else if (content.body) {
          // Calculate from body
          const wordCount = content.body.split(/\s+/).filter(w => w.length > 0).length;
          updates.read_time_minutes = Math.max(1, Math.ceil(wordCount / 200));
        } else {
          updates.read_time_minutes = 5; // Default
        }
        needsUpdate = true;
      }

      // Fix: featured_image_url (add placeholder if missing)
      if (!content.featured_image_url) {
        // Determine image based on content
        const titleLower = (content.title || '').toLowerCase();
        if (titleLower.includes('ces') || titleLower.includes('tech')) {
          updates.featured_image_url = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200';
        } else if (titleLower.includes('nvidia') || titleLower.includes('rtx') || titleLower.includes('gaming')) {
          updates.featured_image_url = 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200';
        } else if (titleLower.includes('security') || titleLower.includes('cyber') || titleLower.includes('threat')) {
          updates.featured_image_url = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200';
        } else {
          updates.featured_image_url = 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200';
        }
        needsUpdate = true;
      }

      // Fix: content_type
      if (!content.content_type) {
        updates.content_type = 'article';
        needsUpdate = true;
      }

      // Fix: is_featured (set to true for articles with 800+ words)
      if (content.is_featured === null || content.is_featured === undefined) {
        const wordCount = (content as any).word_count || 
                         (content.body ? content.body.split(/\s+/).filter((w: string) => w.length > 0).length : 0);
        updates.is_featured = wordCount >= 800;
        needsUpdate = true;
      }

      // Fix: seo_meta_title and seo_meta_description
      if (!content.seo_meta_title && content.title) {
        updates.seo_meta_title = content.title;
        needsUpdate = true;
      }

      if (!content.seo_meta_description && content.excerpt) {
        updates.seo_meta_description = content.excerpt;
        needsUpdate = true;
      } else if (!content.seo_meta_description && content.summary) {
        updates.seo_meta_description = content.summary;
        needsUpdate = true;
      }

      // Apply updates
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('content')
          .update(updates)
          .eq('id', content.id);

        if (updateError) {
          results.errors.push(`Failed to update ${content.title}: ${updateError.message}`);
        } else {
          results.updated++;
        }
      }

      // Step 4: Link to feeds
      const titleLower = (content.title || '').toLowerCase();
      const bodyLower = (content.body || '').toLowerCase();
      
      let feedSlug = 'innovate'; // default to tech
      if (titleLower.includes('security') || titleLower.includes('cyber') || 
          titleLower.includes('threat') || titleLower.includes('malware') ||
          titleLower.includes('ai cyber') || titleLower.includes('autonomous ai')) {
        feedSlug = 'secured';
      } else if (titleLower.includes('game') || titleLower.includes('gaming') ||
                 titleLower.includes('gta') || titleLower.includes('nvidia') ||
                 titleLower.includes('rtx') || titleLower.includes('switch')) {
        feedSlug = 'play';
      }

      const feedId = feedMap[feedSlug];
      if (feedId) {
        // Check if already linked
        const { data: existingFeed } = await supabase
          .from('content_feeds')
          .select('id')
          .eq('content_id', content.id)
          .eq('feed_id', feedId)
          .maybeSingle();

        if (!existingFeed) {
          const { error: feedError } = await supabase
            .from('content_feeds')
            .insert({
              content_id: content.id,
              feed_id: feedId,
              display_order: 0,
            });

          if (feedError) {
            results.errors.push(`Failed to link ${content.title} to feed: ${feedError.message}`);
          } else {
            results.linkedToFeeds++;
          }
        }
      }

      // Step 5: Link to niches
      let nicheName = 'tech';
      if (titleLower.includes('security') || titleLower.includes('cyber') || 
          titleLower.includes('threat') || titleLower.includes('malware') ||
          titleLower.includes('ai cyber') || titleLower.includes('autonomous ai')) {
        nicheName = 'security';
      } else if (titleLower.includes('game') || titleLower.includes('gaming') ||
                 titleLower.includes('gta') || titleLower.includes('nvidia') ||
                 titleLower.includes('rtx') || titleLower.includes('switch')) {
        nicheName = 'gaming';
      }

      const nicheId = nicheMap[nicheName];
      if (nicheId) {
        // Check if already linked
        const { data: existingNiche } = await supabase
          .from('content_niches')
          .select('id')
          .eq('content_id', content.id)
          .eq('niche_id', nicheId)
          .maybeSingle();

        if (!existingNiche) {
          const { error: nicheError } = await supabase
            .from('content_niches')
            .insert({
              content_id: content.id,
              niche_id: nicheId,
            });

          if (nicheError) {
            results.errors.push(`Failed to link ${content.title} to niche: ${nicheError.message}`);
          } else {
            results.linkedToNiches++;
          }
        }
      }
    }

    // Step 6: Verify content is now visible
    const { data: visibleContent, error: viewError } = await supabase
      .from('feed_content_view')
      .select('id, title')
      .eq('status', 'published')
      .limit(10);

    return {
      success: true,
      ...results,
      visibleCount: visibleContent?.length || 0,
      viewError: viewError?.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      ...results,
    };
  }
}











