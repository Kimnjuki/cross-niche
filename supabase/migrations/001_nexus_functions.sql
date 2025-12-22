-- Nexus Platform Database Extensions
-- Competitive advantage functions and views

-- Function: calculate_trending_score
-- Gravity-based decay: (views / (hours_since_published + 2)^1.5)
-- Purpose: Dynamic home page sorting
CREATE OR REPLACE FUNCTION calculate_trending_score(
  view_count INTEGER,
  published_at TIMESTAMPTZ
)
RETURNS NUMERIC AS $$
BEGIN
  IF published_at IS NULL OR view_count IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Calculate hours since published
  DECLARE
    hours_since_published NUMERIC;
  BEGIN
    hours_since_published := EXTRACT(EPOCH FROM (NOW() - published_at)) / 3600;
    
    -- Apply gravity-based decay formula
    -- (views / (hours_since_published + 2)^1.5)
    RETURN view_count / POWER(GREATEST(hours_since_published + 2, 1), 1.5);
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- View: active_threat_feed
-- Joins security_alerts with relevant content for sidebar widget
CREATE OR REPLACE VIEW active_threat_feed AS
SELECT 
  sa.id,
  sa.title,
  sa.description,
  sa.severity,
  sa.affected_systems,
  sa.published_at,
  sa.created_at,
  sa.is_active,
  sa.security_score,
  sa.content_id,
  c.slug as content_slug,
  c.title as content_title,
  c.featured_image_url,
  -- Calculate Nexus Risk Rating (1-5) from CVSS score
  CASE 
    WHEN sa.security_score >= 9.0 THEN 5
    WHEN sa.security_score >= 7.0 THEN 4
    WHEN sa.security_score >= 4.0 THEN 3
    WHEN sa.security_score >= 0.1 THEN 2
    ELSE 1
  END as nexus_score
FROM security_alerts sa
LEFT JOIN content c ON sa.content_id = c.id
WHERE sa.is_active = true
  AND (sa.expires_at IS NULL OR sa.expires_at > NOW())
ORDER BY sa.published_at DESC NULLS LAST, sa.created_at DESC;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_security_alerts_active 
ON security_alerts(is_active, published_at DESC) 
WHERE is_active = true;

-- Add trending_score column to content (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'content' AND column_name = 'trending_score'
  ) THEN
    ALTER TABLE content ADD COLUMN trending_score NUMERIC;
  END IF;
END $$;

-- Function to update trending scores (can be called periodically)
CREATE OR REPLACE FUNCTION update_trending_scores()
RETURNS void AS $$
BEGIN
  UPDATE content
  SET trending_score = calculate_trending_score(view_count, published_at)
  WHERE status = 'published' AND published_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update trending_score when view_count changes
CREATE OR REPLACE FUNCTION update_content_trending_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.trending_score := calculate_trending_score(NEW.view_count, NEW.published_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_trending_score ON content;
CREATE TRIGGER trigger_update_trending_score
  BEFORE INSERT OR UPDATE OF view_count, published_at ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_content_trending_score();



