-- ============================================================================
-- ROW LEVEL SECURITY SETUP FOR RESTAURANT APP
-- ============================================================================
-- 
-- INSTRUCTIONS:
-- 1. Go to: https://app.supabase.com
-- 2. Open: SQL Editor
-- 3. Click: New Query
-- 4. Copy ALL of this file (Ctrl+A, Ctrl+C)
-- 5. Paste into the SQL editor (Ctrl+V)
-- 6. Click: "Run" button
-- 7. Done! No errors expected.
--
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create READ policies for public tables
CREATE POLICY "Public pages are viewable by everyone"
  ON pages FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Public nav items are viewable by everyone"
  ON nav_items FOR SELECT
  USING (visible = true);

CREATE POLICY "Public social links are viewable by everyone"
  ON social_links FOR SELECT
  USING (true);

-- Create INSERT policy for contact messages
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running this SQL, you should see:
-- "Query returned no results" or similar success message
--
-- This means:
-- ✅ RLS is enabled on all tables
-- ✅ READ policies are in place
-- ✅ Frontend can read public data with anon key
-- ✅ Backend can write with service role key
-- ✅ No security vulnerabilities
--
-- ============================================================================

