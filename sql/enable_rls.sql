-- Enable RLS on all public-facing tables and set policies for read-only access

-- ============================================================================
-- PAGES TABLE - Public read-only
-- ============================================================================
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public pages are viewable by everyone"
  ON pages FOR SELECT
  USING (is_published = true);

-- ============================================================================
-- SITE_SETTINGS TABLE - Public read-only
-- ============================================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

-- ============================================================================
-- NAV_ITEMS TABLE - Public read-only
-- ============================================================================
ALTER TABLE nav_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public nav items are viewable by everyone"
  ON nav_items FOR SELECT
  USING (visible = true);

-- ============================================================================
-- SOCIAL_LINKS TABLE - Public read-only
-- ============================================================================
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public social links are viewable by everyone"
  ON social_links FOR SELECT
  USING (true);

-- ============================================================================
-- CONTACT_MESSAGES TABLE - Public insert-only
-- ============================================================================
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

