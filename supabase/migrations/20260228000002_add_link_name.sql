-- Add link_name column to public_links to support multiple shared links per resume
ALTER TABLE public.public_links ADD COLUMN IF NOT EXISTS link_name TEXT;
