-- Supabase Storage Policies for menu-images bucket
-- Run this in Supabase SQL Editor to fix RLS policy errors

-- IMPORTANT: Run each section separately, not all at once!
-- If you get "must be owner" errors, skip DROP commands and only run CREATE commands

-- =============================================================================
-- OPTION 1: Simple approach (try this first)
-- =============================================================================

-- 1. Public READ access - anyone can view images
CREATE POLICY "Public read access for menu images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- 2. INSERT policy - authenticated users can upload
CREATE POLICY "Authenticated users can upload menu images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'menu-images' 
  AND auth.role() = 'authenticated'
);

-- 3. UPDATE policy - authenticated users can update
CREATE POLICY "Authenticated users can update menu images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'menu-images'
  AND auth.role() = 'authenticated'
);

-- 4. DELETE policy - authenticated users can delete
CREATE POLICY "Authenticated users can delete menu images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'menu-images'
  AND auth.role() = 'authenticated'
);

-- =============================================================================
-- OPTION 2: If you get policy already exists errors, delete them via Dashboard
-- =============================================================================
-- Go to: Storage > Policies > Delete the old policies manually
-- Then run OPTION 1 again

-- =============================================================================
-- OPTION 3: Very permissive (if OPTION 1 doesn't work)
-- =============================================================================
-- This allows anyone (even non-authenticated users) to upload/delete
-- Only use this for development/testing!

-- First, delete existing policies via Dashboard or with these commands:
-- DROP POLICY IF EXISTS "Authenticated users can upload menu images" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can update menu images" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can delete menu images" ON storage.objects;

-- Then create permissive policies:
CREATE POLICY "Public upload for menu images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Public update for menu images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-images')
WITH CHECK (bucket_id = 'menu-images');

CREATE POLICY "Public delete for menu images"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-images');

-- =============================================================================
-- Verify policies are created
-- =============================================================================
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%menu images%'
ORDER BY policyname;
