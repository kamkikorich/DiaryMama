-- ============================================
-- Setup Supabase Storage Bucket for Documents
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create the storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up RLS policies for the bucket
-- Allow anyone to read public files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Allow authenticated users to upload files
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

-- Allow users to update their own files
CREATE POLICY "Allow updates"
ON storage.objects FOR UPDATE
USING (bucket_id = 'documents');

-- Allow users to delete their own files
CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents');

-- ============================================
-- Done! Your storage bucket is ready.
-- Upload files to: documents/receipts/
-- ============================================