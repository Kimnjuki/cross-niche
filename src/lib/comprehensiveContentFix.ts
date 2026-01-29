import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

interface DiagnosticResult {
  totalContent: number;
  publishedContent: number;
  unpublishedContent: number;
  contentWithoutFeeds: number;
  contentWithoutNiches: number;
  contentWithoutTags: number;
  contentWithMissingFields: number;
  issues: string[];
  fixed: number;
}

/**
 * Comprehensive content diagnostic and fix tool
 * Checks all content and fixes common issues
 */
export async function comprehensiveContentFix(): Promise<DiagnosticResult> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const result: DiagnosticResult = {
    totalContent: 0,
    publishedContent: 0,
    unpublishedContent: 0,
    contentWithoutFeeds: 0,
    contentWithoutNiches: 0,
    contentWithoutTags: 0,
    contentWithMissingFields: 0,
    issues: [],
    fixed: 0,
  };

  try {
    // Step 1: Get ALL content (regardless of status)
    const { data: allContent, error: fetchError } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw new Error(`Failed to fetch content: ${fetchError.message}`);
    }

    if (!allContent || allContent.length === 0) {
      result.issues.push('No content found in database');
      return result;
    }

    result.totalContent = allContent.length;

    // Step 2: Analyze each content item
    for (const content of allContent) {
      let needsFix = false;
      const contentIssues: string[] = [];

      // Check status
      if (content.status !== 'published') {
        result.unpublishedContent++;
        contentIssues.push(`Status is "${content.status}" instead of "published"`);
        needsFix = true;
      } else {
        result.publishedContent++;
      }

      // Check required fields
      if (!content.title || content.title.trim() === '') {
        contentIssues.push('Missing title');
        needsFix = true;
        result.contentWithMissingFields++;
      }

      if (!content.slug || content.slug.trim() === '') {
        contentIssues.push('Missing slug');
        needsFix = true;
        result.contentWithMissingFields++;
      }

      // Check feed relationships
      const { data: feedRelations } = await supabase
        .from('content_feeds')
        .select('feed_id')
        .eq('content_id', content.id)
        .limit(1);

      if (!feedRelations || feedRelations.length === 0) {
        result.contentWithoutFeeds++;
        contentIssues.push('Not linked to any feed');
        needsFix = true;
      }

      // Check niche relationships
      const { data: nicheRelations } = await supabase
        .from('content_niches')
        .select('niche_id')
        .eq('content_id', content.id)
        .limit(1);

      if (!nicheRelations || nicheRelations.length === 0) {
        result.contentWithoutNiches++;
        contentIssues.push('Not linked to any niche');
        needsFix = true;
      }

      // Check tag relationships (optional but good to have)
      const { data: tagRelations } = await supabase
        .from('content_tags')
        .select('tag_id')
        .eq('content_id', content.id)
        .limit(1);

      if (!tagRelations || tagRelations.length === 0) {
        result.contentWithoutTags++;
        // Tags are optional, so we don't mark this as needing fix
      }

      // Step 3: Fix issues
      if (needsFix) {
        try {
          await fixContentItem(content, contentIssues);
          result.fixed++;
        } catch (error: any) {
          result.issues.push(`Failed to fix content ${content.id}: ${error.message}`);
        }
      }

      if (contentIssues.length > 0) {
        result.issues.push(`Content "${content.title || content.id}": ${contentIssues.join(', ')}`);
      }
    }

    return result;
  } catch (error: any) {
    result.issues.push(`Error: ${error.message}`);
    return result;
  }
}

/**
 * Fix a single content item
 */
async function fixContentItem(content: any, issues: string[]): Promise<void> {
  const updates: any = {};

  // Fix status
  if (content.status !== 'published') {
    updates.status = 'published';
  }

  // Generate slug if missing
  if (!content.slug || content.slug.trim() === '') {
    updates.slug = generateSlug(content.title || `article-${content.id}`);
  }

  // Set published_at if missing
  if (!content.published_at) {
    updates.published_at = content.created_at || new Date().toISOString();
  }

  // Set default values for missing fields
  if (!content.content_type) {
    updates.content_type = 'article';
  }

  if (content.is_featured === null || content.is_featured === undefined) {
    updates.is_featured = false;
  }

  if (!content.featured_image_url) {
    updates.featured_image_url = '/placeholder.svg';
  }

  // Calculate read time if missing
  if (!content.read_time_minutes || content.read_time_minutes === 0) {
    const wordCount = estimateWordCount(content.body || content.excerpt || content.summary || '');
    updates.read_time_minutes = Math.max(1, Math.ceil(wordCount / 200));
  }

  // Update content if needed
  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from('content')
      .update(updates)
      .eq('id', content.id);

    if (updateError) {
      throw new Error(`Update failed: ${updateError.message}`);
    }
  }

  // Fix feed relationships
  const { data: existingFeeds } = await supabase
    .from('content_feeds')
    .select('feed_id')
    .eq('content_id', content.id);

  if (!existingFeeds || existingFeeds.length === 0) {
    // Determine feed based on content analysis
    const feedSlug = determineFeedFromContent(content);
    
    if (feedSlug) {
      // Get or create feed
      let { data: feed } = await supabase
        .from('feeds')
        .select('id')
        .eq('slug', feedSlug)
        .maybeSingle();

      if (!feed) {
        // Create feed if it doesn't exist
        const feedNames: Record<string, string> = {
          'innovate': 'Innovate',
          'secured': 'Secured',
          'play': 'Play',
        };

        const { data: newFeed, error: feedError } = await supabase
          .from('feeds')
          .insert({
            slug: feedSlug,
            name: feedNames[feedSlug] || feedSlug,
            is_active: true,
            display_order: 1,
          })
          .select('id')
          .single();

        if (feedError) {
          console.warn(`Could not create feed ${feedSlug}:`, feedError);
        } else {
          feed = newFeed;
        }
      }

      if (feed) {
        // Link content to feed
        await supabase
          .from('content_feeds')
          .insert({
            content_id: content.id,
            feed_id: feed.id,
          });
      }
    }
  }

  // Fix niche relationships
  const { data: existingNiches } = await supabase
    .from('content_niches')
    .select('niche_id')
    .eq('content_id', content.id);

  if (!existingNiches || existingNiches.length === 0) {
    // Determine niche based on content
    const nicheName = determineNicheFromContent(content);
    
    if (nicheName) {
      // Get or create niche
      let { data: niche } = await supabase
        .from('niches')
        .select('id')
        .eq('name', nicheName)
        .maybeSingle();

      if (!niche) {
        // Create niche if it doesn't exist
        const { data: newNiche, error: nicheError } = await supabase
          .from('niches')
          .insert({
            name: nicheName,
            slug: nicheName.toLowerCase(),
            description: `${nicheName} content`,
            is_active: true,
          })
          .select('id')
          .single();

        if (nicheError) {
          console.warn(`Could not create niche ${nicheName}:`, nicheError);
        } else {
          niche = newNiche;
        }
      }

      if (niche) {
        // Link content to niche
        await supabase
          .from('content_niches')
          .insert({
            content_id: content.id,
            niche_id: niche.id,
          });
      }
    }
  }
}

/**
 * Generate a URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Estimate word count from text
 */
function estimateWordCount(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Determine feed slug from content analysis
 */
function determineFeedFromContent(content: any): string | null {
  const title = (content.title || '').toLowerCase();
  const body = (content.body || content.excerpt || content.summary || '').toLowerCase();
  const combined = `${title} ${body}`;

  // Security keywords
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
    return 'secured';
  }

  // Gaming keywords
  if (
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
    return 'play';
  }

  // Tech keywords (default)
  if (
    combined.includes('tech') ||
    combined.includes('ces') ||
    combined.includes('ai') ||
    combined.includes('hardware') ||
    combined.includes('software') ||
    combined.includes('innovation') ||
    combined.includes('device')
  ) {
    return 'innovate';
  }

  // Default to tech
  return 'innovate';
}

/**
 * Determine niche name from content analysis
 */
function determineNicheFromContent(content: any): string | null {
  const feedSlug = determineFeedFromContent(content);
  
  const nicheMap: Record<string, string> = {
    'secured': 'Security',
    'play': 'Gaming',
    'innovate': 'Tech',
  };

  return nicheMap[feedSlug || 'innovate'] || 'Tech';
}

/**
 * Quick fix: Publish all content and link to feeds/niches
 */
export async function quickFixAllContent(): Promise<{ fixed: number; errors: string[] }> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const errors: string[] = [];
  let fixed = 0;

  try {
    // Get all content
    const { data: allContent } = await supabase
      .from('content')
      .select('*');

    if (!allContent) {
      return { fixed: 0, errors: ['No content found'] };
    }

    for (const content of allContent) {
      try {
        // Update status to published
        await supabase
          .from('content')
          .update({ status: 'published' })
          .eq('id', content.id);

        // Ensure slug exists
        if (!content.slug) {
          const slug = generateSlug(content.title || `article-${content.id}`);
          await supabase
            .from('content')
            .update({ slug })
            .eq('id', content.id);
        }

        // Ensure published_at exists
        if (!content.published_at) {
          await supabase
            .from('content')
            .update({ published_at: content.created_at || new Date().toISOString() })
            .eq('id', content.id);
        }

        // Link to feed
        const { data: existingFeeds } = await supabase
          .from('content_feeds')
          .select('feed_id')
          .eq('content_id', content.id)
          .limit(1);

        if (!existingFeeds || existingFeeds.length === 0) {
          const feedSlug = determineFeedFromContent(content);
          if (feedSlug) {
            let { data: feed } = await supabase
              .from('feeds')
              .select('id')
              .eq('slug', feedSlug)
              .maybeSingle();

            if (!feed) {
              const feedNames: Record<string, string> = {
                'innovate': 'Innovate',
                'secured': 'Secured',
                'play': 'Play',
              };

              const { data: newFeed } = await supabase
                .from('feeds')
                .insert({
                  slug: feedSlug,
                  name: feedNames[feedSlug] || feedSlug,
                  is_active: true,
                  display_order: 1,
                })
                .select('id')
                .single();

              feed = newFeed;
            }

            if (feed) {
              await supabase
                .from('content_feeds')
                .insert({
                  content_id: content.id,
                  feed_id: feed.id,
                });
            }
          }
        }

        // Link to niche
        const { data: existingNiches } = await supabase
          .from('content_niches')
          .select('niche_id')
          .eq('content_id', content.id)
          .limit(1);

        if (!existingNiches || existingNiches.length === 0) {
          const nicheName = determineNicheFromContent(content);
          if (nicheName) {
            let { data: niche } = await supabase
              .from('niches')
              .select('id')
              .eq('name', nicheName)
              .maybeSingle();

            if (!niche) {
              const { data: newNiche } = await supabase
                .from('niches')
                .insert({
                  name: nicheName,
                  slug: nicheName.toLowerCase(),
                  description: `${nicheName} content`,
                  is_active: true,
                })
                .select('id')
                .single();

              niche = newNiche;
            }

            if (niche) {
              await supabase
                .from('content_niches')
                .insert({
                  content_id: content.id,
                  niche_id: niche.id,
                });
            }
          }
        }

        fixed++;
      } catch (error: any) {
        errors.push(`Failed to fix content ${content.id}: ${error.message}`);
      }
    }

    return { fixed, errors };
  } catch (error: any) {
    errors.push(`Error: ${error.message}`);
    return { fixed, errors };
  }
}










