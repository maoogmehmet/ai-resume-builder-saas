-- ==========================================
-- SUPABASE ALTYAPI VE EKSİK TABLO KURULUMU (SADELEŞTİRİLMİŞ VERSİYON)
-- ==========================================

-- SADECE KENDİ SAHİP OLDUĞUMUZ 'PUBLIC' TABLOLARINA İŞLEM YAPIYORUZ
-- BÖYLECE "MUST BE OWNER" HATASI KESİNLİKLE ÇIKMAYACAKTIR.

-- Cover Letters (Kapak Mektupları) Tablosu
CREATE TABLE IF NOT EXISTS public.cover_letters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    job_description TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Public Links (Paylaşılan CV Linkleri) Tablosu
CREATE TABLE IF NOT EXISTS public.public_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    views INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days',
    design_template TEXT DEFAULT 'modern',
    color_hex TEXT DEFAULT '#2563eb'
);

-- Tablolar için RLS (Row Level Security) Aktifleştirme
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_links ENABLE ROW LEVEL SECURITY;

-- Cover Letters RLS Politikaları
CREATE POLICY "Kullanıcılar kapak mektuplarını görebilir"
ON public.cover_letters FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kapak mektuplarını ekleyebilir"
ON public.cover_letters FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kapak mektuplarını güncelleyebilir"
ON public.cover_letters FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kapak mektuplarını silebilir"
ON public.cover_letters FOR DELETE USING (auth.uid() = user_id);

-- Public Links RLS
CREATE POLICY "Herkes aktif public linkleri görebilir"
ON public.public_links FOR SELECT USING (is_active = true);

CREATE POLICY "Kullanıcılar kendi public linklerini yönetebilir"
ON public.public_links FOR ALL USING (auth.uid() = user_id);


-- ==========================================
-- 2. 7 GÜNLÜK OTOMATİK LİNK KAPATMA (CRON JOB)
-- ==========================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Varsa eskisini kaldır (Hata vermemesi için try-catch benzeri blok)
DO $$
BEGIN
  PERFORM cron.unschedule('deactivate-expired-links');
EXCEPTION WHEN OTHERS THEN
  -- Hata verirse yoksay
END $$;

SELECT cron.schedule(
  'deactivate-expired-links', 
  '0 0 * * *',
  $$
    UPDATE public.public_links
    SET is_active = false
    WHERE is_active = true AND expires_at < NOW() AND user_id IN (
          SELECT id FROM public.profiles WHERE subscription_status NOT IN ('active', 'trialing')
      );
  $$
);
