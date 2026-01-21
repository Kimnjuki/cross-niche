import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

/**
 * Auto-fix and publish all content in the database
 * This is a comprehensive fix that ensures all articles are visible
 */
export async function autoFixAndPublishAll(): Promise<{
  success: boolean;
  fixed: number;
  published: number;
  linked: number;
  errors: string[];
}> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      fixed: 0,
      published: 0,
      linked: 0,
      errors: ['Supabase is not configured'],
    };
  }

  const result = {
    success: true,
    fixed: 0,
    published: 0,
    linked: 0,
    errors: [] as string[],
  };

  try {
    // Step 1: Get ALL content regardless of status
    const { data: allContent, error: fetchError } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      result.errors.push(`Failed to fetch content: ${fetchError.message}`);
      result.success = false;
      return result;
    }

    if (!allContent || allContent.length === 0) {
      result.errors.push('No content found in database');
      return result;
    }

    // Step 2: Get or create feeds
    const feedMap: Record<string, number> = {};
    const feeds = [
      { slug: 'innovate', name: 'Innovate' },
      { slug: 'secured', name: 'Secured' },
      { slug: 'play', name: 'Play' },
    ];

    for (const feed of feeds) {
      let { data: existingFeed } = await supabase
        .from('feeds')
        .select('id')
        .eq('slug', feed.slug)
        .maybeSingle();

      if (!existingFeed) {
        const { data: newFeed, error } = await supabase
          .from('feeds')
          .insert({
            slug: feed.slug,
            name: feed.name,
            is_active: true,
            display_order: 1,
          })
          .select('id')
          .single();

        if (error) {
          result.errors.push(`Failed to create feed ${feed.slug}: ${error.message}`);
        } else if (newFeed) {
          feedMap[feed.slug] = newFeed.id;
        }
      } else {
        feedMap[feed.slug] = existingFeed.id;
      }
    }

    // Step 3: Get or create niches
    const nicheMap: Record<string, number> = {};
    const niches = [
      { name: 'Tech', slug: 'tech' },
      { name: 'Security', slug: 'security' },
      { name: 'Gaming', slug: 'gaming' },
    ];

    for (const niche of niches) {
      let { data: existingNiche } = await supabase
        .from('niches')
        .select('id')
        .eq('name', niche.name)
        .maybeSingle();

      if (!existingNiche) {
        const { data: newNiche, error } = await supabase
          .from('niches')
          .insert({
            name: niche.name,
            slug: niche.slug,
            description: `${niche.name} content`,
            is_active: true,
          })
          .select('id')
          .single();

        if (error) {
          result.errors.push(`Failed to create niche ${niche.name}: ${error.message}`);
        } else if (newNiche) {
          nicheMap[niche.name] = newNiche.id;
        }
      } else {
        nicheMap[niche.name] = existingNiche.id;
      }
    }

    // Step 4: Fix and publish each content item
    for (const content of allContent) {
      try {
        const updates: any = {};
        let needsUpdate = false;

        // Determine feed and niche from content
        const titleLower = (content.title || '').toLowerCase();
        const bodyLower = (content.body || content.excerpt || content.summary || '').toLowerCase();
        const combined = `${titleLower} ${bodyLower}`;

        let feedSlug = 'innovate';
        let nicheName = 'Tech';

        if (
          combined.includes('security') ||
          combined.includes('cyber') ||
          combined.includes('threat') ||
          combined.includes('malware') ||
          combined.includes('breach') ||
          combined.includes('vulnerability') ||
          combined.includes('hack') ||
          combined.includes('attack')
        ) {
          feedSlug = 'secured';
          nicheName = 'Security';
        } else if (
          combined.includes('game') ||
          combined.includes('gaming') ||
          combined.includes('gta') ||
          combined.includes('nvidia') ||
          combined.includes('rtx') ||
          combined.includes('switch') ||
          combined.includes('console') ||
          combined.includes('playstation') ||
          combined.includes('xbox')
        ) {
          feedSlug = 'play';
          nicheName = 'Gaming';
        }

        // Fix status - always set to published
        if (content.status !== 'published') {
          updates.status = 'published';
          needsUpdate = true;
          result.published++;
        }

        // Fix slug
        if (!content.slug || content.slug.trim() === '') {
          updates.slug = generateSlug(content.title || `article-${content.id}`);
          needsUpdate = true;
          result.fixed++;
        }

        // Fix published_at
        if (!content.published_at) {
          updates.published_at = content.created_at || new Date().toISOString();
          needsUpdate = true;
        }

        // Fix read_time_minutes
        if (!content.read_time_minutes || content.read_time_minutes === 0) {
          const wordCount = estimateWordCount(content.body || content.excerpt || content.summary || '');
          updates.read_time_minutes = Math.max(1, Math.ceil(wordCount / 200));
          needsUpdate = true;
        }

        // Fix featured_image_url
        if (!content.featured_image_url) {
          updates.featured_image_url = '/placeholder.svg';
          needsUpdate = true;
        }

        // Fix content_type
        if (!content.content_type) {
          updates.content_type = 'article';
          needsUpdate = true;
        }

        // Fix excerpt if missing
        if (!content.excerpt && content.body) {
          updates.excerpt = content.body.substring(0, 200).replace(/\n/g, ' ').trim() + '...';
          needsUpdate = true;
        }

        // Apply updates
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('content')
            .update(updates)
            .eq('id', content.id);

          if (updateError) {
            result.errors.push(`Failed to update ${content.id}: ${updateError.message}`);
          } else {
            result.fixed++;
          }
        }

        // Link to feed
        const feedId = feedMap[feedSlug];
        if (feedId) {
          const { data: existingFeedLink } = await supabase
            .from('content_feeds')
            .select('id')
            .eq('content_id', content.id)
            .eq('feed_id', feedId)
            .maybeSingle();

          if (!existingFeedLink) {
            const { error: feedError } = await supabase
              .from('content_feeds')
              .insert({
                content_id: content.id,
                feed_id: feedId,
                display_order: 0,
              });

            if (feedError) {
              result.errors.push(`Failed to link ${content.id} to feed: ${feedError.message}`);
            } else {
              result.linked++;
            }
          }
        }

        // Link to niche
        const nicheId = nicheMap[nicheName];
        if (nicheId) {
          const { data: existingNicheLink } = await supabase
            .from('content_niches')
            .select('id')
            .eq('content_id', content.id)
            .eq('niche_id', nicheId)
            .maybeSingle();

          if (!existingNicheLink) {
            const { error: nicheError } = await supabase
              .from('content_niches')
              .insert({
                content_id: content.id,
                niche_id: nicheId,
              });

            if (nicheError) {
              result.errors.push(`Failed to link ${content.id} to niche: ${nicheError.message}`);
            } else {
              result.linked++;
            }
          }
        }
      } catch (error: any) {
        result.errors.push(`Error processing ${content.id}: ${error.message}`);
      }
    }

    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Unexpected error: ${error.message}`);
    return result;
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateWordCount(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(word => word.length > 0).length;
}



