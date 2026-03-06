-- Add linkedin_url column to resumes table to track import source
ALTER TABLE public.resumes ADD COLUMN linkedin_url TEXT;

-- Index for performance when checking unique counts per user
CREATE INDEX idx_resumes_linkedin_url ON public.resumes(linkedin_url);
