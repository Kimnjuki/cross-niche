import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { TablesInsert } from '@/integrations/supabase/types';

export interface DiagnosticResult {
  success: boolean;
  issues: string[];
  fixes: string[];
  stats: {
    totalContent: number;
    publishedContent: number;
    contentWithFeeds: number;
    contentWithNiches: number;
    contentWithTags: number;
  };
}

/**
 * Comprehensive diagnostic and fix utility for content in Supabase
 * This will check and fix common issues preventing articles from displaying
 */
export async function diagnoseAndFixContent(): Promise<DiagnosticResult> {
  const result: DiagnosticResult = {
    success: false,
    issues: [],
    fixes: [],
    stats: {
      totalContent: 0,
      publishedContent: 0,
      contentWithFeeds: 0,
      contentWithNiches: 0,
      contentWithTags: 0,
    },
  };

  if (!isSupabaseConfigured()) {
    result.issues.push('Supabase is not configured');
    return result;
  }

  try {
    // Step 1: Get all content
    const { data: allContent, error: contentError } = await supabase
      .from('content')
      .select('*');

    if (contentError) {
      result.issues.push(`Error fetching content: ${contentError.message}`);
      return result;
    }

    result.stats.totalContent = allContent?.length || 0;

    if (!allContent || allContent.length === 0) {
      result.issues.push('No content found in database');
      return result;
    }

    // Step 2: Check and fix status
    const unpublishedContent = allContent.filter(c => c.status !== 'published');
    if (unpublishedContent.length > 0) {
      result.issues.push(`${unpublishedContent.length} articles are not published`);
      
      // Fix: Set status to published for articles that should be published
      for (const content of unpublishedContent) {
        if (content.published_at && !content.archived_at) {
          const { error } = await supabase
            .from('content')
            .update({ status: 'published' })
            .eq('id', content.id);
          
          if (!error) {
            result.fixes.push(`Set status to 'published' for: ${content.title}`);
          }
        }
      }
    }

    result.stats.publishedContent = allContent.filter(c => c.status === 'published').length;

    // Step 3: Check feed relationships
    const { data: allFeeds } = await supabase.from('feeds').select('*');
    const feedMap: Record<string, number> = {};
    if (allFeeds) {
      allFeeds.forEach(feed => {
        feedMap[feed.slug] = feed.id;
      });
    }

    // Get all content-feed relationships
    const { data: contentFeeds } = await supabase
      .from('content_feeds')
      .select('content_id');

    const contentWithFeedsSet = new Set(
      contentFeeds?.map(cf => cf.content_id) || []
    );

    result.stats.contentWithFeeds = contentWithFeedsSet.size;

    // Fix: Link content to feeds based on content_type or title
    for (const content of allContent) {
      if (!contentWithFeedsSet.has(content.id) && content.status === 'published') {
        // Determine feed based on content
        let feedSlug = 'innovate'; // default to tech
        
        // Try to infer from title or content
        const titleLower = (content.title || '').toLowerCase();
        const bodyLower = (content.body || '').toLowerCase();
        
        if (titleLower.includes('security') || titleLower.includes('cyber') || 
            bodyLower.includes('security') || bodyLower.includes('cyber') ||
            titleLower.includes('threat') || titleLower.includes('malware')) {
          feedSlug = 'secured';
        } else if (titleLower.includes('game') || titleLower.includes('gaming') ||
                   bodyLower.includes('game') || bodyLower.includes('gaming') ||
                   titleLower.includes('gta') || titleLower.includes('nvidia')) {
          feedSlug = 'play';
        }

        const feedId = feedMap[feedSlug];
        if (feedId) {
          const { error } = await supabase
            .from('content_feeds')
            .insert({
              content_id: content.id,
              feed_id: feedId,
              display_order: 0,
            });

          if (!error) {
            result.fixes.push(`Linked "${content.title}" to feed: ${feedSlug}`);
            contentWithFeedsSet.add(content.id);
          }
        }
      }
    }

    result.stats.contentWithFeeds = contentWithFeedsSet.size;

    // Step 4: Check niche relationships
    const { data: allNiches } = await supabase.from('niches').select('*');
    const nicheMap: Record<string, number> = {};
    if (allNiches) {
      allNiches.forEach(niche => {
        nicheMap[niche.name] = niche.id;
      });
    }

    // Get all content-niche relationships
    const { data: contentNiches } = await supabase
      .from('content_niches')
      .select('content_id');

    const contentWithNichesSet = new Set(
      contentNiches?.map(cn => cn.content_id) || []
    );

    result.stats.contentWithNiches = contentWithNichesSet.size;

    // Fix: Link content to niches
    for (const content of allContent) {
      if (!contentWithNichesSet.has(content.id) && content.status === 'published') {
        // Determine niche based on content
        let nicheName = 'tech'; // default
        
        const titleLower = (content.title || '').toLowerCase();
        const bodyLower = (content.body || '').toLowerCase();
        
        if (titleLower.includes('security') || titleLower.includes('cyber') || 
            bodyLower.includes('security') || bodyLower.includes('cyber') ||
            titleLower.includes('threat') || titleLower.includes('malware')) {
          nicheName = 'security';
        } else if (titleLower.includes('game') || titleLower.includes('gaming') ||
                   bodyLower.includes('game') || bodyLower.includes('gaming') ||
                   titleLower.includes('gta') || titleLower.includes('nvidia') ||
                   titleLower.includes('rtx')) {
          nicheName = 'gaming';
        }

        const nicheId = nicheMap[nicheName];
        if (nicheId) {
          const { error } = await supabase
            .from('content_niches')
            .insert({
              content_id: content.id,
              niche_id: nicheId,
            });

          if (!error) {
            result.fixes.push(`Linked "${content.title}" to niche: ${nicheName}`);
            contentWithNichesSet.add(content.id);
          }
        }
      }
    }

    result.stats.contentWithNiches = contentWithNichesSet.size;

    // Step 5: Ensure required fields are set
    for (const content of allContent) {
      const updates: Partial<TablesInsert<'content'>> = {};
      let needsUpdate = false;

      if (!content.slug && content.title) {
        updates.slug = content.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        needsUpdate = true;
      }

      if (!content.published_at && content.status === 'published') {
        updates.published_at = content.created_at || new Date().toISOString();
        needsUpdate = true;
      }

      if (!content.read_time_minutes && content.body) {
        const wordCount = content.body.split(/\s+/).filter(w => w.length > 0).length;
        updates.read_time_minutes = Math.max(1, Math.ceil(wordCount / 200));
        needsUpdate = true;
      }

      if (needsUpdate) {
        const { error } = await supabase
          .from('content')
          .update(updates)
          .eq('id', content.id);

        if (!error) {
          result.fixes.push(`Updated missing fields for: ${content.title}`);
        }
      }
    }

    // Step 6: Check tags
    const { data: contentTags } = await supabase
      .from('content_tags')
      .select('content_id');

    const contentWithTagsSet = new Set(
      contentTags?.map(ct => ct.content_id) || []
    );

    result.stats.contentWithTags = contentWithTagsSet.size;

    // Final check: Verify content can be queried from feed_content_view
    const { data: viewContent, error: viewError } = await supabase
      .from('feed_content_view')
      .select('*')
      .eq('status', 'published')
      .limit(5);

    if (viewError) {
      result.issues.push(`Error querying feed_content_view: ${viewError.message}`);
    } else {
      if (!viewContent || viewContent.length === 0) {
        result.issues.push('feed_content_view returns no published content (check feed and niche relationships)');
      } else {
        result.fixes.push(`Verified: ${viewContent.length} articles are visible in feed_content_view`);
      }
    }

    result.success = result.issues.length === 0 || result.fixes.length > 0;
    return result;
  } catch (error) {
    result.issues.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
}

/**
 * Force update all content to ensure it's properly configured
 */
export async function forceUpdateAllContent(): Promise<{ success: boolean; updated: number; errors: string[] }> {
  const result = {
    success: false,
    updated: 0,
    errors: [] as string[],
  };

  if (!isSupabaseConfigured()) {
    result.errors.push('Supabase is not configured');
    return result;
  }

  try {
    // Get all content
    const { data: allContent, error } = await supabase
      .from('content')
      .select('*');

    if (error || !allContent) {
      result.errors.push(`Error fetching content: ${error?.message || 'Unknown'}`);
      return result;
    }

    // Get feeds and niches
    const { data: feeds } = await supabase.from('feeds').select('*');
    const { data: niches } = await supabase.from('niches').select('*');

    const feedMap: Record<string, number> = {};
    const nicheMap: Record<string, number> = {};

    feeds?.forEach(f => { feedMap[f.slug] = f.id; });
    niches?.forEach(n => { nicheMap[n.name] = n.id; });

    for (const content of allContent) {
      // Update status if needed
      if (content.published_at && content.status !== 'published' && !content.archived_at) {
        await supabase
          .from('content')
          .update({ status: 'published' })
          .eq('id', content.id);
      }

      // Determine feed and niche
      const titleLower = (content.title || '').toLowerCase();
      const bodyLower = (content.body || '').toLowerCase();
      
      let feedSlug = 'innovate';
      let nicheName = 'tech';
      
      if (titleLower.includes('security') || titleLower.includes('cyber') || 
          bodyLower.includes('security') || bodyLower.includes('cyber') ||
          titleLower.includes('threat') || titleLower.includes('malware')) {
        feedSlug = 'secured';
        nicheName = 'security';
      } else if (titleLower.includes('game') || titleLower.includes('gaming') ||
                 bodyLower.includes('game') || bodyLower.includes('gaming') ||
                 titleLower.includes('gta') || titleLower.includes('nvidia') ||
                 titleLower.includes('rtx')) {
        feedSlug = 'play';
        nicheName = 'gaming';
      }

      // Link to feed
      if (feedMap[feedSlug]) {
        const { data: existing } = await supabase
          .from('content_feeds')
          .select('id')
          .eq('content_id', content.id)
          .eq('feed_id', feedMap[feedSlug])
          .maybeSingle();

        if (!existing) {
          await supabase
            .from('content_feeds')
            .insert({
              content_id: content.id,
              feed_id: feedMap[feedSlug],
              display_order: 0,
            });
        }
      }

      // Link to niche
      if (nicheMap[nicheName]) {
        const { data: existing } = await supabase
          .from('content_niches')
          .select('id')
          .eq('content_id', content.id)
          .eq('niche_id', nicheMap[nicheName])
          .maybeSingle();

        if (!existing) {
          await supabase
            .from('content_niches')
            .insert({
              content_id: content.id,
              niche_id: nicheMap[nicheName],
            });
        }
      }

      result.updated++;
    }

    result.success = true;
    return result;
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    return result;
  }
}




