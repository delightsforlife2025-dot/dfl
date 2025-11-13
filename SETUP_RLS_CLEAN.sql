-- ============================================================================
-- CLEAN RLS SETUP - REMOVES OLD POLICIES FIRST, THEN CREATES NEW ONES
-- ============================================================================
-- 
-- This file:
-- 1. Drops any existing policies (if they exist)
-- 2. Enables RLS on all tables
-- 3. Creates fresh policies
--
-- Safe to run multiple times - won't cause errors
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
-- STEP 1: DROP OLD POLICIES (if they exist - this is safe)
-- ============================================================================

DROP POLICY IF EXISTS "Public pages are viewable by everyone" ON pages;
DROP POLICY IF EXISTS "Public site settings are viewable by everyone" ON site_settings;
DROP POLICY IF EXISTS "Public nav items are viewable by everyone" ON nav_items;
DROP POLICY IF EXISTS "Public social links are viewable by everyone" ON social_links;
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Public can view visible categories" ON menu_categories;
DROP POLICY IF EXISTS "Public can view available menu items" ON menu_items;


-- ============================================================================
-- STEP 2: ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- STEP 3: CREATE FRESH POLICIES
-- ============================================================================

-- PAGES TABLE
CREATE POLICY "Public pages are viewable by everyone"
  ON pages FOR SELECT
  USING (is_published = true);

-- SITE_SETTINGS TABLE
CREATE POLICY "Public site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

-- NAV_ITEMS TABLE
CREATE POLICY "Public nav items are viewable by everyone"
  ON nav_items FOR SELECT
  USING (visible = true);

-- SOCIAL_LINKS TABLE
CREATE POLICY "Public social links are viewable by everyone"
  ON social_links FOR SELECT
  USING (true);

-- CONTACT_MESSAGES TABLE
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- MENU_CATEGORIES TABLE
CREATE POLICY "Public can view visible categories"
  ON menu_categories FOR SELECT
  USING (visible = true);

-- MENU_ITEMS TABLE
CREATE POLICY "Public can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = true);


-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running this SQL, you should see:
-- "Query returned no results" (success!)
--
-- ✅ Old policies dropped
-- ✅ RLS enabled on all 7 tables
-- ✅ Fresh policies created
-- ✅ Frontend can READ: published pages, visible items, available menu
-- ✅ Backend (service role) can READ/WRITE/DELETE everything
-- ✅ Edit and delete operations will work ✅
-- ✅ Everything is ready!
--
-- ============================================================================

