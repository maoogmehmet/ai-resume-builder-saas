-- Create cover_letters table
CREATE TABLE public.cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cover_letters_user_id ON public.cover_letters(user_id);
CREATE INDEX idx_cover_letters_resume_id ON public.cover_letters(resume_id);

-- RLS
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own cover letters" 
ON public.cover_letters FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cover letters" 
ON public.cover_letters FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cover letters" 
ON public.cover_letters FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cover letters" 
ON public.cover_letters FOR DELETE USING (auth.uid() = user_id);
