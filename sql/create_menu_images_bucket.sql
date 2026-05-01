-- Fix "Bucket not found" for dashboard uploads (logo, favicon, menu photos).
-- Run once in Supabase → SQL Editor → Run.
-- Or create the same bucket manually: Storage → New bucket → name: menu-images → Public.

INSERT INTO storage.buckets (id, name, public)
SELECT 'menu-images', 'menu-images', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'menu-images');
