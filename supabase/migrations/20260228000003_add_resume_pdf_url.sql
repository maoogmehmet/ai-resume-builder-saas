-- Add pdf_url to resumes table
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Create the Storage bucket for resumes if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to downloaded resumes
CREATE POLICY "Public Read Access for Resumes" ON storage.objects 
FOR SELECT USING (bucket_id = 'resumes');

-- Allow authenticated users to upload to the bucket (if not using Service Role)
-- Our API route uses Service Role, but it's good practice to have policies.
CREATE POLICY "Authenticated Uploads" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.role() = 'authenticated'
);
