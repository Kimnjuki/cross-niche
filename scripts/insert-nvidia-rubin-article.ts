/**
 * Script to insert NVIDIA Rubin AI Architecture article into the database
 * 
 * Usage:
 * 1. Set your Supabase credentials in .env file:
 *    VITE_SUPABASE_URL=your_supabase_url
 *    VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
 * 
 * 2. Run: npx tsx scripts/insert-nvidia-rubin-article.ts
 * 
 * NOTE: You need to provide the full article body text in the ARTICLE_BODY constant below.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
dotenv.config({ path: join(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// TODO: Replace this with the full article body text
const ARTICLE_BODY = `At CES 2026, NVIDIA CEO Jensen Huang announced the end of the Blackwell era and introduced the Rubin architecture... [FULL ARTICLE TEXT NEEDED] ...`;

const ARTICLE_DATA = {
  id: 'b1111111-1111-1111-1111-111111111111',
  title: 'NVIDIA Rubin AI Architecture: The 100-Petaflop Superchip',
  slug: 'nvidia-rubin-ai-architecture-specs-release-date',
  summary: 'A deep dive into NVIDIA\'s 2026 Rubin architecture, featuring the Vera CPU, HBM4 memory, and the shift toward Agentic AI reasoning.',
  body: ARTICLE_BODY,
  author_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  status: 'published',
  security_score: 5,
  published_at: '2026-01-26T19:00:00Z',
  seo_meta_title: 'NVIDIA Rubin AI Platform: Specs, Release Date, and Benchmarks',
  seo_meta_description: 'A deep dive into NVIDIA\'s 2026 Rubin architecture, featuring the Vera CPU, HBM4 memory, and the shift toward Agentic AI reasoning.',
  read_time_minutes: 7,
};

const AUTHOR_DATA = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  display_name: 'Tech Sentinel',
  email: 'tech_updates@nvidia-fans.com',
  bio: 'Expert in semiconductor roadmaps and AI infrastructure.',
  slug: 'tech-sentinel',
  is_active: true,
};

const TABLE_DATA = {
  content_id: 'b1111111-1111-1111-1111-111111111111',
  table_title: 'Blackwell vs. Rubin Performance Comparison',
  table_data: {
    headers: ['Feature', 'Blackwell (2025)', 'Rubin (2026)'],
    rows: [
      ['Inference Performance', '10 PFLOPS', '50 PFLOPS (5x Increase)'],
      ['Training Efficiency', '1x Baseline', '4x Fewer GPUs for MoE'],
      ['Memory Type', 'HBM3e', 'HBM4'],
      ['Interconnect Bandwidth', '1.8 TB/s', '3.6 TB/s (NVLink 6)'],
      ['Total Rack Bandwidth', '130 TB/s', '260 TB/s'],
    ],
  },
  order_index: 1,
};

const MEDIA_DATA = {
  content_id: 'b1111111-1111-1111-1111-111111111111',
  url: 'https://images.tech-news-example.com/nvidia-vera-rubin-nvl72.jpg',
  alt_text: 'Diagram of NVIDIA Vera Rubin NVL72 Rack Architecture',
  caption: 'The Vera Rubin NVL72 rack unifies 72 GPUs and 36 CPUs into a single computing domain.',
  media_type: 'image',
  position_in_article: 1,
};

const TAGS = [
  { name: 'NVIDIA', slug: 'nvidia' },
  { name: 'AI Hardware', slug: 'ai-hardware' },
  { name: 'Quantum Computing', slug: 'quantum-computing' },
];

async function insertArticle() {
  console.log('🚀 Starting article insertion...\n');

  try {
    // Step 1: Insert or update author
    console.log('1️⃣ Inserting/updating author...');
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .upsert(AUTHOR_DATA, { onConflict: 'id' })
      .select()
      .single();

    if (authorError) {
      console.error('❌ Error inserting author:', authorError);
      throw authorError;
    }
    console.log('✅ Author inserted/updated:', author?.display_name);

    // Step 2: Insert tags
    console.log('\n2️⃣ Inserting tags...');
    for (const tag of TAGS) {
      const { error: tagError } = await supabase
        .from('tags')
        .upsert({ name: tag.name, slug: tag.slug }, { onConflict: 'slug' });

      if (tagError) {
        console.warn(`⚠️ Warning inserting tag ${tag.name}:`, tagError.message);
      } else {
        console.log(`✅ Tag inserted: ${tag.name}`);
      }
    }

    // Step 3: Insert content
    console.log('\n3️⃣ Inserting content...');
    const { data: content, error: contentError } = await supabase
      .from('content')
      .upsert(ARTICLE_DATA, { onConflict: 'id' })
      .select()
      .single();

    if (contentError) {
      console.error('❌ Error inserting content:', contentError);
      throw contentError;
    }
    console.log('✅ Content inserted:', content?.title);

    // Step 4: Insert content table
    console.log('\n4️⃣ Inserting content table...');
    const { error: tableError } = await supabase
      .from('content_tables')
      .upsert(TABLE_DATA, { onConflict: 'content_id,order_index' });

    if (tableError) {
      console.warn('⚠️ Warning inserting table:', tableError.message);
    } else {
      console.log('✅ Content table inserted');
    }

    // Step 5: Insert media
    console.log('\n5️⃣ Inserting media...');
    const { error: mediaError } = await supabase
      .from('media')
      .upsert(MEDIA_DATA, { onConflict: 'content_id,position_in_article' });

    if (mediaError) {
      console.warn('⚠️ Warning inserting media:', mediaError.message);
    } else {
      console.log('✅ Media inserted');
    }

    // Step 6: Link tags to content
    console.log('\n6️⃣ Linking tags to content...');
    const { data: tagsData } = await supabase
      .from('tags')
      .select('id, slug')
      .in('slug', ['nvidia', 'ai-hardware']);

    if (tagsData && tagsData.length > 0) {
      for (const tag of tagsData) {
        const { error: linkError } = await supabase
          .from('content_tags')
          .upsert({
            content_id: ARTICLE_DATA.id,
            tag_id: tag.id,
          }, { onConflict: 'content_id,tag_id' });

        if (linkError) {
          console.warn(`⚠️ Warning linking tag ${tag.slug}:`, linkError.message);
        } else {
          console.log(`✅ Tag linked: ${tag.slug}`);
        }
      }
    }

    console.log('\n✅ Article insertion completed successfully!');
    console.log(`\n📄 Article URL: /article/${ARTICLE_DATA.slug}`);
    console.log(`📊 Article ID: ${ARTICLE_DATA.id}`);

  } catch (error) {
    console.error('\n❌ Error inserting article:', error);
    process.exit(1);
  }
}

// Run the script
insertArticle();

