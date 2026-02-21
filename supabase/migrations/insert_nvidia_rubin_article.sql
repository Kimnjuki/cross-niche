-- Migration: Insert NVIDIA Rubin AI Architecture Article
-- Date: 2026-01-26
-- 
-- NOTE: The article body is truncated in the original SQL. 
-- You'll need to replace '[Full article text as provided above] ...' 
-- with the complete article content.
--
-- STEP 0: Find an existing user_id (run this first to see available users):
-- SELECT id, email FROM public.users LIMIT 5;
-- If you have users, copy one ID and replace the subquery in step 2 below

-- 1. Get or Create Author User (REQUIRED - author_id cannot be NULL)
-- Option A: Use an existing user (RECOMMENDED - uncomment and run this first to find one):
-- SELECT id, email FROM public.users LIMIT 1;
-- Then replace 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' in step 2 with that user's ID

-- Option B: Create a new user (only if you don't have any users)
-- Note: Adjust columns based on your users table structure
-- First check your users table structure:
-- SELECT column_name, is_nullable, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'users' AND table_schema = 'public' AND is_nullable = 'NO';
/*
INSERT INTO public.users (id, email)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
  'tech_updates@nvidia-fans.com'
)
ON CONFLICT (id) DO NOTHING;
*/

-- Option B: If you have an 'authors' table, uncomment and use this:
/*
INSERT INTO public.authors (id, display_name, email, bio, slug, is_active)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
  'Tech Sentinel', 
  'tech_updates@nvidia-fans.com', 
  'Expert in semiconductor roadmaps and AI infrastructure.',
  'tech-sentinel',
  true
)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  bio = EXCLUDED.bio,
  slug = EXCLUDED.slug,
  is_active = EXCLUDED.is_active;
*/

-- Option C: If you want to use an existing author, first find an author_id:
-- SELECT id, display_name FROM public.authors LIMIT 1;
-- Then replace 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' in the content insert below with that ID

-- 2. Insert the Main Content
-- IMPORTANT: 
-- 1. Replace the body text with the full article content (line 75)
-- 2. Replace the author_id below with an existing user_id from your database
--    Run this first to find one: SELECT id FROM public.users LIMIT 1;
INSERT INTO public.content (
  id, 
  title, 
  slug, 
  summary, 
  body, 
  author_id, 
  status, 
  security_score, 
  published_at
) VALUES (
  'b1111111-1111-1111-1111-111111111111',
  'NVIDIA Rubin AI Architecture: The 100-Petaflop Superchip',
  'nvidia-rubin-ai-architecture-specs-release-date',
  'A deep dive into NVIDIA''s 2026 Rubin architecture, featuring the Vera CPU, HBM4 memory, and the shift toward Agentic AI reasoning.',
  'At CES 2026, NVIDIA CEO Jensen Huang announced the end of the Blackwell era and introduced the Rubin architecture... [Full article text as provided above] ...',
  (SELECT id FROM public.users LIMIT 1), -- Gets the first available user_id, or replace with specific UUID
  'published',
  5,
  '2026-01-26 19:00:00+00'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  summary = EXCLUDED.summary,
  body = EXCLUDED.body,
  author_id = EXCLUDED.author_id,
  status = EXCLUDED.status,
  security_score = EXCLUDED.security_score,
  published_at = EXCLUDED.published_at;

-- 3. Insert the Performance Comparison Table (OPTIONAL - uncomment if table exists)
/*
INSERT INTO public.content_tables (content_id, table_title, table_data, order_index)
VALUES (
  'b1111111-1111-1111-1111-111111111111',
  'Blackwell vs. Rubin Performance Comparison',
  '{
    "headers": ["Feature", "Blackwell (2025)", "Rubin (2026)"],
    "rows": [
      ["Inference Performance", "10 PFLOPS", "50 PFLOPS (5x Increase)"],
      ["Training Efficiency", "1x Baseline", "4x Fewer GPUs for MoE"],
      ["Memory Type", "HBM3e", "HBM4"],
      ["Interconnect Bandwidth", "1.8 TB/s", "3.6 TB/s (NVLink 6)"],
      ["Total Rack Bandwidth", "130 TB/s", "260 TB/s"]
    ]
  }'::jsonb,
  1
)
ON CONFLICT (content_id, order_index) DO UPDATE SET
  table_title = EXCLUDED.table_title,
  table_data = EXCLUDED.table_data;
*/

-- 4. Insert Media (Image Placeholder) (OPTIONAL - uncomment if table exists)
/*
INSERT INTO public.media (content_id, url, alt_text, caption, media_type, position_in_article)
VALUES (
  'b1111111-1111-1111-1111-111111111111',
  'https://images.tech-news-example.com/nvidia-vera-rubin-nvl72.jpg',
  'Diagram of NVIDIA Vera Rubin NVL72 Rack Architecture',
  'The Vera Rubin NVL72 rack unifies 72 GPUs and 36 CPUs into a single computing domain.',
  'image',
  1
)
ON CONFLICT DO NOTHING;
*/

-- 5. Insert Tags
-- First, ensure tags exist (insert if they don't exist)
-- Note: slug is required, so we're including it
INSERT INTO public.tags (name, slug) VALUES 
('NVIDIA', 'nvidia'), 
('AI Hardware', 'ai-hardware'), 
('Quantum Computing', 'quantum-computing')
ON CONFLICT (slug) DO NOTHING;

-- Map tags to content (using IDs associated with the tag slugs above)
INSERT INTO public.content_tags (content_id, tag_id)
SELECT 'b1111111-1111-1111-1111-111111111111', id FROM public.tags 
WHERE slug IN ('nvidia', 'ai-hardware')
ON CONFLICT DO NOTHING;

