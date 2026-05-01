-- Comments table for customer testimonials/reviews
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text,
  customer_image_url text,
  comment_text text NOT NULL,
  rating integer DEFAULT 5,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments (created_at);
CREATE INDEX IF NOT EXISTS idx_comments_is_approved ON comments (is_approved);

-- Create trigger for updated_at
CREATE TRIGGER trg_comments_set_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Enable RLS (Row Level Security)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to read approved comments" ON comments;
DROP POLICY IF EXISTS "Allow authenticated users to read all comments" ON comments;
DROP POLICY IF EXISTS "Allow authenticated users to insert comments" ON comments;
DROP POLICY IF EXISTS "Allow authenticated users to update comments" ON comments;
DROP POLICY IF EXISTS "Allow authenticated users to delete comments" ON comments;

-- RLS Policy 1: Allow anyone to read approved comments
CREATE POLICY "Allow public to read approved comments"
  ON comments
  FOR SELECT
  USING (is_approved = true);

-- RLS Policy 2: Allow anyone to insert comments (public can add)
CREATE POLICY "Allow anyone to insert comments"
  ON comments
  FOR INSERT
  WITH CHECK (true);

-- RLS Policy 3: Allow authenticated users to read all comments (for admin)
CREATE POLICY "Allow authenticated users to read all comments"
  ON comments
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policy 4: Allow authenticated users to update comments
CREATE POLICY "Allow authenticated users to update comments"
  ON comments
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy 5: Allow authenticated users to delete comments
CREATE POLICY "Allow authenticated users to delete comments"
  ON comments
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Sample data (optional; idempotent via fixed UUIDs)
INSERT INTO comments (id, customer_name, customer_email, comment_text, rating, is_approved)
VALUES
  ('a0000001-0000-4000-8000-000000000001', 'Ahmet Yılmaz', 'ahmet@example.com', 'Harika bir restoran! Yemekler çok lezzetli ve sunumu mükemmel. Kesinlikle tekrar geleceğim.', 5, true),
  ('a0000001-0000-4000-8000-000000000002', 'Fatma Demir', 'fatma@example.com', 'Şef harika! Her tabak bir sanat eseri. Atmosfer çok sıcak ve samimi. Arkadaşlarıma da tavsiye ettim.', 5, true),
  ('a0000001-0000-4000-8000-000000000003', 'Mehmet Kaya', 'mehmet@example.com', 'Menü çeşitleri fazla değil ama olan yemekler gerçekten özel. Kalite her şeyden önemli.', 4, true)
ON CONFLICT (id) DO NOTHING;

