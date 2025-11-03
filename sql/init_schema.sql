-- Init DB schema for pages, site config, and contact messages
-- Designed for PostgreSQL (works on Supabase/Postgres).
-- This intentionally excludes menu-related tables (will be added later).

-- Enable uuid generation (pgcrypto provides gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper trigger: set updated_at on UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Pages table: flexible JSON content for homepage, etc.
CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  -- content holds structured blocks (hero, sections, galleries, etc.)
  content jsonb DEFAULT '{}'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  is_published boolean DEFAULT true,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages (slug);
CREATE TRIGGER trg_pages_set_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Navigation items (header/footer nav)
CREATE TABLE IF NOT EXISTS nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  position integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER trg_nav_items_set_updated_at
  BEFORE UPDATE ON nav_items
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Social links for footer/header
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE TRIGGER trg_social_links_set_updated_at
  BEFORE UPDATE ON social_links
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Team members removed. Store staff/team content inside `pages.content` or `site_settings` if needed.

-- Generic site settings (key -> jsonb). Use for address, opening_hours, contact info, etc.
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Contact messages (contact page: email form only — we'll store messages here)
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  ip inet,
  user_agent text,
  handled boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages (email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at);

-- Sample seed data (safe defaults; edit or remove as needed)
-- Nav (no gallery link included)
INSERT INTO nav_items (label, href, position)
VALUES
  ('Home', '/', 0),
  ('Menu', '/menu', 10),
  ('Contact', '/contact', 30)
ON CONFLICT DO NOTHING;

-- Social links example
INSERT INTO social_links (platform, url, icon, position)
VALUES
  ('instagram', 'https://instagram.com/your-account', 'instagram', 0),
  ('facebook', 'https://facebook.com/your-account', 'facebook', 1)
ON CONFLICT DO NOTHING;

-- Site settings example (address, phone, opening hours)
INSERT INTO site_settings (key, value)
VALUES
  ('contact_info', jsonb_build_object('address', '123 Main St, City', 'phone', '+1-555-555-5555', 'email', 'hello@example.com')),
  ('opening_hours', jsonb_build_object('mon_fri', '10:00-22:00', 'sat', '09:00-23:00', 'sun', '09:00-21:00'))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- Pages sample: homepage
INSERT INTO pages (slug, title, content, is_published)
VALUES
  ('home', 'Home', jsonb_build_object('hero', jsonb_build_object('title', 'Welcome', 'subtitle', 'Our restaurant')), true)
ON CONFLICT (slug) DO NOTHING;

-- Notes / recommendations:
-- 1) Images: store media in Supabase Storage (or another CDN) and save URLs in the JSON content or team_members.photo_url.
-- 2) For full CMS-like editing, keep `pages.content` as an array of blocks (e.g. [{type: 'hero', data: {...}}, ...]).
-- 3) Protect contact messages endpoint server-side and use rate-limiting and spam protection (reCAPTCHA or hCaptcha) in production.
