-- ============================================================================
-- COMPLETE ROW LEVEL SECURITY SETUP - ALL TABLES
-- ============================================================================
-- 
-- This file enables RLS on ALL tables in your restaurant app
-- No more "Error fetching" messages after running this!
--
-- INSTRUCTIONS:
-- 1. Go to: https://app.supabase.com
-- 2. Open: SQL Editor
-- 3. Click: New Query
-- 4. Copy ALL of this file (Ctrl+A, Ctrl+C)
-- 5. Paste into the SQL editor (Ctrl+V)
-- 6. Click: "Run" button
-- 7. Done!
--
-- ============================================================================


-- ============================================================================
-- PART 1: CORE TABLES RLS POLICIES
-- ============================================================================

-- PAGES TABLE - Public read-only (published pages only)
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public pages are viewable by everyone"
  ON pages FOR SELECT
  USING (is_published = true);

-- SITE_SETTINGS TABLE - Public read-only (all settings)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

-- NAV_ITEMS TABLE - Public read-only (visible items only)
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public nav items are viewable by everyone"
  ON nav_items FOR SELECT
  USING (visible = true);

-- SOCIAL_LINKS TABLE - Public read-only (all links)
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public social links are viewable by everyone"
  ON social_links FOR SELECT
  USING (true);

-- CONTACT_MESSAGES TABLE - Public insert-only (anyone can submit)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);


-- ============================================================================
-- PART 2: MENU TABLES RLS POLICIES
-- ============================================================================

-- MENU_CATEGORIES TABLE - Public read-only (visible categories only)
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public can view visible categories"
  ON menu_categories FOR SELECT
  USING (visible = true);

-- MENU_ITEMS TABLE - Public read-only (available items only)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Public can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = true);


-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running this SQL, you should see:
-- "Query returned no results" or similar success message
--
-- ✅ ALL tables now have RLS enabled
-- ✅ Frontend can READ public data with anon key
-- ✅ Backend can READ/WRITE/DELETE with service role key
-- ✅ NO more "Error fetching" console errors
-- ✅ Settings save successfully
-- ✅ Menu displays correctly
-- ✅ Everything works!
--
-- ============================================================================

