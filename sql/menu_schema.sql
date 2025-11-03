-- Menu Management Tables for Restaurant
-- Run this in Supabase SQL Editor

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  position integer DEFAULT 0,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_categories_slug ON menu_categories (slug);
CREATE INDEX IF NOT EXISTS idx_menu_categories_visible ON menu_categories (visible);

-- Updated_at trigger
CREATE TRIGGER trg_menu_categories_set_updated_at
  BEFORE UPDATE ON menu_categories
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Menü öğeleri tablosu
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES menu_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  images text[], -- Array of image URLs for product gallery
  youtube_url text,
  ingredients text[], -- Array of ingredients
  allergens text[], -- Array of allergens (gluten, dairy, nuts, etc.)
  tags text[], -- Array of tags (vegetarian, vegan, spicy, etc.)
  is_available boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items (category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_slug ON menu_items (slug);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items (is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items (is_featured);

-- Updated_at trigger
CREATE TRIGGER trg_menu_items_set_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Örnek kategoriler
INSERT INTO menu_categories (name, slug, description, position, visible)
VALUES
  ('Başlangıçlar', 'baslangiclar', 'Lezzetli başlangıç çeşitlerimiz', 0, true),
  ('Salatalar', 'salatalar', 'Taze ve sağlıklı salatalar', 10, true),
  ('Ana Yemekler', 'ana-yemekler', 'Özel ana yemek çeşitlerimiz', 20, true),
  ('Pizzalar', 'pizzalar', 'Fırından taze pizzalar', 30, true),
  ('Makarnalar', 'makarnalar', 'İtalyan makarna çeşitleri', 40, true),
  ('Tatlılar', 'tatlilar', 'Ev yapımı tatlılar', 50, true),
  ('İçecekler', 'icecekler', 'Sıcak ve soğuk içecekler', 60, true)
ON CONFLICT (slug) DO NOTHING;

-- Örnek menü öğeleri
INSERT INTO menu_items (
  category_id,
  title,
  slug,
  description,
  price,
  ingredients,
  allergens,
  tags,
  is_available,
  is_featured,
  position
)
SELECT
  c.id,
  'Izgara Somon',
  'izgara-somon',
  'Taze somon fileto, özel soslarımızla marine edilmiş ve ızgarada pişirilmiştir. Buharda pişmiş sebzeler ve limon sosu ile servis edilir.',
  89.90,
  ARRAY['Somon', 'Limon', 'Zeytinyağı', 'Taze otlar', 'Kuşkonmaz', 'Havuç'],
  ARRAY['Balık'],
  ARRAY['Glutensiz', 'Sağlıklı'],
  true,
  true,
  0
FROM menu_categories c
WHERE c.slug = 'ana-yemekler'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO menu_items (
  category_id,
  title,
  slug,
  description,
  price,
  ingredients,
  allergens,
  tags,
  is_available,
  position
)
SELECT
  c.id,
  'Margarita Pizza',
  'margarita-pizza',
  'Klasik İtalyan pizzası. Taze mozzarella, domates sosu ve fesleğen ile.',
  65.00,
  ARRAY['Pizza hamuru', 'Mozzarella peyniri', 'Domates sosu', 'Taze fesleğen', 'Zeytinyağı'],
  ARRAY['Gluten', 'Süt ürünleri'],
  ARRAY['Vejetaryen', 'Klasik'],
  true,
  10
FROM menu_categories c
WHERE c.slug = 'pizzalar'
ON CONFLICT (slug) DO NOTHING;

-- Row Level Security (RLS) Policies
-- Public can read available menu items and visible categories
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible categories"
  ON menu_categories FOR SELECT
  USING (visible = true);

CREATE POLICY "Public can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = true);

-- Admin can do everything (we'll check this via admin_token cookie on API level)
-- For now, we'll handle admin operations through API routes

-- Notes:
-- 1. images: Store in Supabase Storage and save URLs in image_url
-- 2. youtube_url: Optional YouTube video URL for the dish
-- 3. ingredients: Array of ingredient names
-- 4. allergens: Array of allergen info (gluten, dairy, nuts, etc.)
-- 5. tags: Array of tags (vegetarian, vegan, spicy, gluten-free, etc.)
-- 6. Position: For ordering items within categories
