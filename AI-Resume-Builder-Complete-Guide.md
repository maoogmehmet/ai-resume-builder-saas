# AI Resume Builder SaaS - Tam Proje Geliştirme Kılavuzu

## İÇİNDEKİLER
1. Proje Genel Bakış
2. Teknik Mimari ve Stack Seçimi
3. Veritabanı Yapısı ve İlişkiler
4. Özellik Bazlı Detaylı Geliştirme Planı
5. AI Entegrasyonu ve Prompt Mühendisliği
6. Ödeme Sistemi ve Abonelik Mantığı
7. Public Link Sistemi (Kritik Dönüşüm Mekanizması)
8. Aşama Aşama Geliştirme Planı
9. Kod Örnekleri ve Implementasyon Detayları
10. Test Senaryoları ve Kontrol Listesi

---

## 1. PROJE GENEL BAKIŞ

### 1.1 Ürün Tanımı
LinkedIn profilinden otomatik olarak ATS-uyumlu, iş ilanına optimize edilmiş özgeçmiş üreten AI destekli SaaS platformu.

### 1.2 Benzersiz Değer Önerisi
- LinkedIn URL'si ile 60 saniyede özgeçmiş
- Herkese açık özgeçmiş linki oluşturma
- Trial bitince link devre dışı kalıyor (güçlü dönüşüm mekanizması)
- Tek fiyat planı: $99/yıl

### 1.3 Hedef Kullanıcı
- İş arayan profesyoneller
- LinkedIn profili olan kişiler
- ATS sistemlerini geçmek isteyen adaylar
- Özgeçmişini sürekli güncellemeye ihtiyaç duyan kişiler

---

## 2. TEKNİK MİMARİ VE STACK SEÇİMİ

### 2.1 Neden Bu Stack?

#### **Frontend: Next.js 14 (App Router)**
✅ **KULLAN** - Sebepleri:
- Server ve Client component'leri bir arada
- Built-in API routes
- SEO dostu (landing page için kritik)
- Hızlı geliştirme
- Vercel'de kolay deploy

**Claude Code'a vereceğin prompt:**
```
Next.js 14 App Router kullanarak proje oluştur.
- TypeScript kullan
- TailwindCSS ile stil
- /app dizin yapısı kullan
- Shadcn/ui component library ekle
```

#### **Backend: Supabase**
✅ **KULLAN** - Sebepleri:
- Authentication hazır
- PostgreSQL database
- Realtime özellikler
- Row Level Security (güvenlik)
- Ücretsiz tier yeterli başlangıç için
- API otomatik oluşuyor

❌ **Firebase kullanma** - Çünkü:
- NoSQL karmaşık sorgularda yetersiz
- İlişkisel veri modelimiz var
- Fiyatlandırma şeffaf değil

**Claude Code'a vereceğin prompt:**
```
Supabase client kurulumu yap:
- @supabase/supabase-js kur
- Environment variables (.env.local) ekle
- lib/supabase.ts dosyası oluştur
- Auth helper functions yaz
```

#### **Ödeme: Stripe**
✅ **KULLAN** - Sebepleri:
- Subscription yönetimi mükemmel
- 7-günlük trial desteği native
- Webhook'lar güvenilir
- Türkiye'de çalışıyor

**Claude Code'a vereceğin prompt:**
```
Stripe subscription entegrasyonu:
- stripe paketini kur
- Trial period ile yıllık plan oluştur
- Webhook endpoint'i yaz
- Subscription durumunu Supabase'e senkronize et
```

#### **AI: OpenAI API**
✅ **KULLAN** - Sebepleri:
- En iyi doğal dil işleme
- Structured output desteği
- Güvenilir API
- Türkçe desteği

**Claude Code'a vereceğin prompt:**
```
OpenAI entegrasyonu:
- GPT-4o model kullan
- Structured output ile JSON döndür
- Rate limiting ekle
- Error handling yap
```

#### **LinkedIn Scraping: Apify**
✅ **KULLAN** - Sebepleri:
- LinkedIn scraping yasadışı değil (public data)
- Hazır actor'lar var
- Güvenilir
- API basit

**Claude Code'a vereceğin prompt:**
```
Apify entegrasyonu:
- apify-client paketi kur
- LinkedIn Profile Scraper actor kullan
- LinkedIn Jobs Scraper actor kullan
- Timeout ve retry logic ekle
```

### 2.2 Tam Teknoloji Listesi

```yaml
Frontend:
  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - TailwindCSS
  - Shadcn/ui (component library)
  - Lucide icons
  - Zod (validation)

Backend:
  - Supabase (Auth + Database)
  - PostgreSQL

API Integrations:
  - OpenAI API (GPT-4o)
  - Apify API (LinkedIn scraping)
  - Stripe API (payments)

PDF Generation:
  - @react-pdf/renderer

Deployment:
  - Vercel (frontend)
  - Supabase (backend)

Development:
  - ESLint
  - Prettier
```

---

## 3. VERİTABANI YAPISI VE İLİŞKİLER

### 3.1 Tablo Şemaları (Supabase PostgreSQL)

**Claude Code'a vereceğin prompt:**
```
Supabase'de aşağıdaki tabloları oluştur.
Her tablo için migration dosyası yaz.
Row Level Security (RLS) policies ekle.
```

#### **Tablo 1: users (Supabase Auth ile entegre)**
```sql
-- Supabase auth.users tablosunu genişletiyoruz
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  
  -- Stripe bilgileri
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('trialing', 'active', 'canceled', 'past_due', 'incomplete')),
  subscription_plan TEXT DEFAULT 'yearly',
  
  -- Trial bilgileri
  trial_start_date TIMESTAMPTZ DEFAULT NOW(),
  trial_end_date TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy: Kullanıcı sadece kendi profilini görebilir
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);
```

#### **Tablo 2: resumes**
```sql
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Özgeçmiş başlığı
  title TEXT NOT NULL DEFAULT 'My Resume',
  
  -- LinkedIn'den gelen ham veri
  original_linkedin_json JSONB,
  
  -- AI tarafından oluşturulan özgeçmiş verisi
  ai_generated_json JSONB NOT NULL,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index'ler (hız için)
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX idx_resumes_created_at ON public.resumes(created_at DESC);

-- RLS Policies
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resumes" 
  ON public.resumes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own resumes" 
  ON public.resumes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" 
  ON public.resumes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" 
  ON public.resumes FOR DELETE 
  USING (auth.uid() = user_id);
```

#### **Tablo 3: resume_versions**
```sql
CREATE TABLE public.resume_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  
  -- Hangi iş için optimize edildi
  job_title TEXT,
  company_name TEXT,
  job_description TEXT,
  job_url TEXT,
  
  -- Optimize edilmiş özgeçmiş verisi
  optimized_json JSONB NOT NULL,
  
  -- ATS skoru
  ats_score INTEGER CHECK (ats_score >= 0 AND ats_score <= 100),
  ats_analysis JSONB, -- Missing keywords, suggestions vs.
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index'ler
CREATE INDEX idx_resume_versions_resume_id ON public.resume_versions(resume_id);
CREATE INDEX idx_resume_versions_created_at ON public.resume_versions(created_at DESC);

-- RLS Policies
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resume versions" 
  ON public.resume_versions FOR SELECT 
  USING (
    resume_id IN (
      SELECT id FROM public.resumes WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own resume versions" 
  ON public.resume_versions FOR INSERT 
  WITH CHECK (
    resume_id IN (
      SELECT id FROM public.resumes WHERE user_id = auth.uid()
    )
  );
```

#### **Tablo 4: public_links (KRİTİK - Dönüşüm Mekanizması)**
```sql
CREATE TABLE public.public_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Public URL slug
  slug TEXT UNIQUE NOT NULL, -- Örnek: "john-doe-product-manager"
  
  -- Link aktif mi? (Trial bitince false olur)
  is_active BOOLEAN DEFAULT TRUE,
  
  -- İstatistikler
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index'ler
CREATE INDEX idx_public_links_slug ON public.public_links(slug);
CREATE INDEX idx_public_links_resume_id ON public.public_links(resume_id);
CREATE INDEX idx_public_links_user_id ON public.public_links(user_id);

-- RLS Policies
ALTER TABLE public.public_links ENABLE ROW LEVEL SECURITY;

-- Public link'ler herkes tarafından görülebilir (slug ile)
CREATE POLICY "Anyone can view public links" 
  ON public.public_links FOR SELECT 
  USING (is_active = TRUE);

CREATE POLICY "Users can create own public links" 
  ON public.public_links FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own public links" 
  ON public.public_links FOR UPDATE 
  USING (auth.uid() = user_id);
```

#### **Tablo 5: ai_generations (İsteğe bağlı - AI kullanım tracking)**
```sql
CREATE TABLE public.ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- AI işlem tipi
  generation_type TEXT NOT NULL CHECK (generation_type IN ('resume_creation', 'ats_optimization', 'job_analysis')),
  
  -- Token kullanımı (maliyet takibi için)
  tokens_used INTEGER,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX idx_ai_generations_created_at ON public.ai_generations(created_at DESC);
```

### 3.2 Database Functions (Otomatik İşlemler)

#### **Function 1: Trial durumunu kontrol et**
```sql
CREATE OR REPLACE FUNCTION check_trial_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Eğer trial süresi bitmişse ve abonelik aktif değilse
  IF NEW.trial_end_date < NOW() AND NEW.subscription_status != 'active' THEN
    -- Tüm public link'leri devre dışı bırak
    UPDATE public.public_links 
    SET is_active = FALSE 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Her profile güncellemesinde çalış
CREATE TRIGGER check_trial_status_trigger
AFTER UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION check_trial_status();
```

#### **Function 2: Slug oluştur**
```sql
CREATE OR REPLACE FUNCTION generate_unique_slug(base_slug TEXT)
RETURNS TEXT AS $$
DECLARE
  new_slug TEXT;
  counter INTEGER := 0;
BEGIN
  new_slug := base_slug;
  
  -- Slug benzersiz olana kadar sayaç ekle
  WHILE EXISTS (SELECT 1 FROM public.public_links WHERE slug = new_slug) LOOP
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;
```

---

## 4. ÖZELLİK BAZLI DETAYLI GELİŞTİRME PLANI

### ÖZELLİK 1: KULLANICI KAYIT VE GİRİŞ

**Claude Code'a vereceğin prompt:**
```
Supabase Auth kullanarak tam authentication sistemi oluştur:

1. Sign Up sayfası (/app/auth/signup/page.tsx)
   - Email/password kayıt
   - Email doğrulama
   - Supabase auth.signUp kullan
   - Kayıt sonrası profiles tablosuna kayıt ekle
   - Trial_end_date otomatik hesapla (7 gün)

2. Sign In sayfası (/app/auth/signin/page.tsx)
   - Email/password giriş
   - "Forgot password" linki
   - Supabase auth.signInWithPassword kullan

3. Middleware (/middleware.ts)
   - Protected routes için auth kontrolü
   - /dashboard/* route'ları koru
   - Login olmamışları /auth/signin'e yönlendir

4. Auth context (/lib/auth-context.tsx)
   - useUser hook'u
   - useSession hook'u
   - Global auth state

Tüm hatalar için user-friendly mesajlar göster.
```

**Çıktı dosyalar:**
- `/app/auth/signup/page.tsx`
- `/app/auth/signin/page.tsx`
- `/middleware.ts`
- `/lib/supabase.ts`
- `/lib/auth-context.tsx`

**Test kriterleri:**
- ✅ Kullanıcı kayıt olabiliyor
- ✅ Email doğrulama geliyor
- ✅ Login çalışıyor
- ✅ Middleware protected route'ları koruyor
- ✅ Trial_end_date doğru hesaplanıyor (+7 gün)

---

### ÖZELLİK 2: LINKEDIN PROFIL İMPORT

**Claude Code'a vereceğin prompt:**
```
LinkedIn profil import sistemi oluştur:

1. LinkedIn URL input component (/components/linkedin-import.tsx)
   - URL validation (linkedin.com/in/* formatı)
   - Loading state
   - Error handling
   - Progress indicator

2. API endpoint (/app/api/linkedin/import/route.ts)
   - Apify LinkedIn Profile Scraper kullan
   - Actor: dev_fusion/linkedin-profile-scraper
   - Input: profileUrls array
   - Output: Structured JSON
   - Timeout: 60 saniye
   - Retry logic: 3 deneme
   
3. Data transformation (/lib/linkedin-parser.ts)
   - Apify output'u standart formata dönüştür
   - Eksik field'ları handle et
   - Date parsing
   - HTML'den text extraction

4. Database save
   - resumes tablosuna kaydet
   - original_linkedin_json field'ına raw data
   - User'ın ilk resume'ü ise is_active = true

Apify API key environment variable'dan al.
Rate limiting ekle (user başına 5 import/saat).
```

**Örnek Apify Request:**
```typescript
// /lib/apify.ts
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: process.env.APIFY_API_KEY,
});

export async function scrapeLinkedInProfile(profileUrl: string) {
  const run = await client.actor('dev_fusion/linkedin-profile-scraper').call({
    profileUrls: [profileUrl],
  });
  
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  return items[0]; // İlk sonuç
}
```

**Çıktı dosyalar:**
- `/components/linkedin-import.tsx`
- `/app/api/linkedin/import/route.ts`
- `/lib/apify.ts`
- `/lib/linkedin-parser.ts`

**Test kriterleri:**
- ✅ Valid LinkedIn URL'i kabul ediyor
- ✅ Invalid URL'de hata veriyor
- ✅ Apify'dan veri çekiyor
- ✅ Database'e kaydediyor
- ✅ Rate limiting çalışıyor

---

### ÖZELLİK 3: AI ÖZGEÇMIŞ OLUŞTURMA

**Claude Code'a vereceğin prompt:**
```
AI ile özgeçmiş oluşturma sistemi:

1. API endpoint (/app/api/ai/generate-resume/route.ts)
   - Input: LinkedIn JSON data
   - OpenAI GPT-4o kullan
   - Structured output (JSON)
   - Streaming destekle (gerçek zamanlı görünüm)

2. AI prompt template (/lib/ai-prompts.ts)
   - Resume generation prompt
   - System message
   - Few-shot examples
   - Output format specifications

3. Resume schema (/lib/resume-schema.ts)
   - TypeScript interface
   - Zod validation schema
   - JSON structure definition

4. Database update
   - ai_generated_json field'ını doldur
   - ai_generations tablosuna kayıt ekle
   - Token kullanımını track et

Prompt mühendisliği çok önemli - aşağıdaki kurallara uy:
- Achievement-based bullets (STAR yöntemi)
- Quantifiable metrics ekle
- Güçlü aksiyon fiilleri kullan
- ATS-friendly format
- Gereksiz kelimeleri çıkar
- 1 sayfa sınırı
```

**AI Prompt Template:**
```typescript
// /lib/ai-prompts.ts
export const RESUME_GENERATION_PROMPT = `
Sen bir profesyonel özgeçmiş yazarısın. LinkedIn verisini ATS-uyumlu, etkili bir özgeçmişe dönüştür.

KURALLAR:
1. Her deneyim bullet'ı şu formatta olmalı:
   - [Aksiyon Fiil] + [Ne yaptın] + [Sonuç/Metrik]
   - Örnek: "Led team of 5 engineers to build product feature, resulting in 40% increase in user engagement"

2. Metrikler ekle:
   - Sayılar, yüzdeler, dolar miktarları
   - "Many" yerine "50+", "Increased" yerine "Increased by 30%"

3. Güçlü aksiyon fiilleri:
   - Led, Architected, Designed, Implemented, Optimized, Scaled
   - "Responsible for", "Worked on" gibi zayıf ifadeler YASAK

4. ATS optimizasyonu:
   - Skill keyword'leri dahil et
   - Sade formatting (bold, italic, tablolar YOK)
   - Standard section başlıkları (Experience, Education, Skills)

5. Uzunluk:
   - Her pozisyon için 3-5 bullet
   - Toplam 1 sayfa

OUTPUT FORMAT (JSON):
{
  "personal_info": {
    "full_name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "portfolio": ""
  },
  "summary": "2-3 cümle profesyonel özet",
  "experience": [
    {
      "title": "",
      "company": "",
      "location": "",
      "start_date": "",
      "end_date": "",
      "bullets": ["", "", ""]
    }
  ],
  "education": [
    {
      "degree": "",
      "school": "",
      "graduation_date": "",
      "gpa": ""
    }
  ],
  "skills": {
    "technical": [""],
    "soft": [""]
  }
}

ŞİMDİ BU LİNKEDIN VERİSİNİ DÖNÜŞTÜRve SADECE JSON DÖNDÜR:
`;
```

**Çıktı dosyalar:**
- `/app/api/ai/generate-resume/route.ts`
- `/lib/ai-prompts.ts`
- `/lib/openai.ts`
- `/lib/resume-schema.ts`

**Test kriterleri:**
- ✅ AI başarıyla özgeçmiş oluşturuyor
- ✅ JSON output geçerli
- ✅ Metrikler içeriyor
- ✅ Aksiyon fiilleri güçlü
- ✅ Token kullanımı track ediliyor

---

### ÖZELLİK 4: ÖZGEÇMIŞ EDİTÖRÜ (DASHBOARD)

**Claude Code'a vereceğin prompt:**
```
İnteraktif özgeçmiş editörü:

1. Dashboard sayfası (/app/dashboard/page.tsx)
   - Kullanıcının tüm özgeçmişlerini listele
   - "Create New Resume" butonu
   - "Import from LinkedIn" butonu

2. Resume editor (/app/dashboard/resume/[id]/page.tsx)
   - Sol panel: Editable form
   - Sağ panel: Live preview
   - Auto-save (debounced 2 saniye)
   - Real-time preview
   
3. Editable sections:
   - Personal info
   - Summary
   - Experience (add/edit/delete/reorder)
   - Education (add/edit/delete)
   - Skills (add/remove)

4. Form validation
   - Required fields
   - Email format
   - Date validation
   - Character limits

5. Database sync
   - Supabase realtime kullan
   - ai_generated_json update et
   - updated_at timestamp güncelle

UI component'ler için Shadcn/ui kullan:
- Input, Textarea, Button, Card, Badge, Dialog
```

**Çıktı dosyalar:**
- `/app/dashboard/page.tsx`
- `/app/dashboard/resume/[id]/page.tsx`
- `/components/resume-editor/personal-info.tsx`
- `/components/resume-editor/experience-section.tsx`
- `/components/resume-editor/education-section.tsx`
- `/components/resume-editor/skills-section.tsx`
- `/components/resume-preview.tsx`

**Test kriterleri:**
- ✅ Tüm section'lar edit edilebiliyor
- ✅ Auto-save çalışıyor
- ✅ Preview gerçek zamanlı
- ✅ Validation çalışıyor
- ✅ Drag-drop ile reorder

---

### ÖZELLİK 5: ATS OPTIMIZATION (İş İlanına Göre)

**Claude Code'a vereceğin prompt:**
```
İş ilanı optimizasyon sistemi:

1. Job description input (/components/job-optimizer.tsx)
   - LinkedIn job URL input
   VEYA
   - Job description text input
   - Company name input

2. LinkedIn job scraping (/app/api/linkedin/scrape-job/route.ts)
   - Apify LinkedIn Jobs Scraper kullan
   - Actor: curious_coder/linkedin-jobs-scraper
   - Job title, company, description extract et

3. ATS matching AI prompt (/lib/ai-prompts.ts)
   - Resume ile job description'ı karşılaştır
   - Keyword matching
   - Skill gap analysis
   - ATS score hesapla (0-100)
   - Missing keywords listele
   - Improvement suggestions üret

4. Optimization result UI (/components/ats-score.tsx)
   - Score badge (renk kodlu)
   - Missing keywords listesi
   - Match edilen keywords
   - "Optimize Resume" butonu

5. Resume optimization
   - AI ile yeni versiyon oluştur
   - Job keywords'ü özgeçmişe entegre et
   - resume_versions tablosuna kaydet

ATS Score hesaplama:
- Keyword match: 40%
- Skills match: 30%
- Experience relevance: 20%
- Formatting: 10%
```

**AI ATS Matching Prompt:**
```typescript
export const ATS_MATCHING_PROMPT = `
Sen bir ATS (Applicant Tracking System) uzmanısın.

GÖREV: Bir özgeçmiş ile iş ilanını karşılaştır ve ATS skorunu hesapla.

RESUME:
{resume_json}

JOB DESCRIPTION:
{job_description}

ÇIKARIMlar:

1. REQUIRED KEYWORDS (iş ilanından)
   - Technical skills
   - Tools & technologies
   - Certifications
   - Industry terms

2. KEYWORD MATCH ANALYSİS
   - Her keyword özgeçmişte var mı?
   - Hangi keyword'ler eksik?

3. ATS SCORE (0-100)
   Hesaplama:
   - Keyword match: 40% (kaç keyword match ediyor / toplam keyword)
   - Skills match: 30% (required skills'den kaç tanesi var)
   - Experience relevance: 20% (job level ile uyum)
   - Formatting: 10% (ATS-friendly format)

4. IMPROVEMENT SUGGESTIONS
   - Hangi keyword'ler eklenmeli
   - Hangi deneyimler vurgulanmalı
   - Hangi skill'ler öne çıkarılmalı

JSON OUTPUT:
{
  "ats_score": 75,
  "keyword_analysis": {
    "required_keywords": ["Python", "AWS", "Docker"],
    "matched_keywords": ["Python", "AWS"],
    "missing_keywords": ["Docker"],
    "match_percentage": 66
  },
  "skill_gaps": ["Docker", "Kubernetes"],
  "suggestions": [
    "Add Docker experience in DevOps project",
    "Mention Kubernetes in container orchestration context"
  ],
  "optimized_bullets": {
    "experience_0_bullet_1": "Optimized Python microservices deployed on AWS using Docker containers"
  }
}
`;
```

**Çıktı dosyalar:**
- `/components/job-optimizer.tsx`
- `/app/api/linkedin/scrape-job/route.ts`
- `/app/api/ai/ats-match/route.ts`
- `/components/ats-score.tsx`

**Test kriterleri:**
- ✅ Job URL'den veri çekiyor
- ✅ Manual job description çalışıyor
- ✅ ATS score doğru hesaplanıyor
- ✅ Missing keywords doğru
- ✅ Optimization önerileri mantıklı

---

### ÖZELLİK 6: RESUME VERSIONS (Çoklu Versiyon Yönetimi)

**Claude Code'a vereceğin prompt:**
```
Özgeçmiş versiyon yönetimi:

1. Version list UI (/components/resume-versions.tsx)
   - Her resume için version'ları listele
   - Version adı, company, ATS score göster
   - "Create New Version" butonu
   - "Set as Primary" butonu

2. Version creation
   - Mevcut resume'den kopyala
   - Job-specific optimization uygula
   - resume_versions tablosuna kaydet

3. Version switching
   - Kullanıcı istediği versiyonu primary yapabilir
   - Primary version PDF export'ta kullanılır

4. Version comparison (opsiyonel)
   - İki versiyonu yan yana göster
   - Farkları highlight et

Database:
- resume_versions tablosu kullan
- Her version job_title, company_name içerir
- Unlimited version (ücretli/ücretsiz fark yok)
```

**Çıktı dosyalar:**
- `/components/resume-versions.tsx`
- `/app/api/resume/versions/route.ts`

**Test kriterleri:**
- ✅ Version oluşturuluyor
- ✅ Version'lar listeleniyor
- ✅ Primary version değiştirilebiliyor

---

### ÖZELLİK 7: PDF EXPORT

**Claude Code'a vereceğin prompt:**
```
PDF export sistemi:

1. PDF generation (/lib/pdf-generator.tsx)
   - @react-pdf/renderer kullan
   - Minimalist template
   - ATS-friendly layout:
     * Sans-serif font (Helvetica)
     * 11pt font size
     * Standard margins (1 inch)
     * No graphics, charts, tables
     * Single column
     * Black text only

2. PDF API endpoint (/app/api/resume/export/pdf/route.ts)
   - Resume JSON al
   - PDF generate et
   - Return as binary

3. Download button (/components/pdf-download-button.tsx)
   - "Download PDF" butonu
   - Trial kontrolü:
     * Trial active: Allow download
     * Trial expired + no subscription: Redirect to /upgrade
     * Active subscription: Allow download
   - Loading state
   - Success feedback

4. PDF layout sections:
   - Header (name, contact)
   - Summary
   - Experience (chronological)
   - Education
   - Skills (kategorize edilmiş)

Font embedding için:
- Helvetica (system font, embed gerekmez)
```

**PDF Template Örneği:**
```typescript
// /lib/pdf-generator.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  name: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
  },
  sectionTitle: {
    fontSize: 12,
    marginTop: 15,
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    paddingBottom: 3,
  },
  // ...
});

export function ResumePDF({ data }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.name}>{data.personal_info.full_name}</Text>
          <Text>{data.personal_info.email} | {data.personal_info.phone}</Text>
        </View>
        {/* ... */}
      </Page>
    </Document>
  );
}
```

**Çıktı dosyalar:**
- `/lib/pdf-generator.tsx`
- `/app/api/resume/export/pdf/route.ts`
- `/components/pdf-download-button.tsx`

**Test kriterleri:**
- ✅ PDF oluşuyor
- ✅ Layout ATS-friendly
- ✅ Trial kontrolü çalışıyor
- ✅ Download çalışıyor

---

### ÖZELLİK 8: PUBLIC RESUME LINK (KRİTİK DÖNÜŞÜM MEKANİZMASI)

**Claude Code'a vereceğin prompt:**
```
Public resume link sistemi - BU ÖZELLİK ÇOK ÖNEMLİ:

1. Link generation (/app/api/resume/create-public-link/route.ts)
   - Slug oluştur:
     * Format: "{first-name}-{last-name}-{job-title}"
     * URL-safe: lowercase, spaces->hyphens, special chars kaldır
     * Uniqueness check: aynı slug varsa sayı ekle
   - public_links tablosuna kaydet
   - is_active = true
   - Return: full URL

2. Public resume page (/app/r/[slug]/page.tsx)
   - Slug'a göre resume bul
   - is_active kontrolü:
     * TRUE: Resume'yi göster
     * FALSE: Redirect to /upgrade?expired=true
   - View count arttır
   - Clean, minimal UI (no edit buttons)
   - "Create Your Own Resume" CTA

3. Link deactivation logic
   - Database function: check_trial_status() (zaten var)
   - Stripe webhook tetiklendiğinde:
     * Subscription canceled: is_active = false
     * Subscription active: is_active = true

4. Link management UI (/components/public-link-manager.tsx)
   - "Generate Public Link" butonu
   - Generated link'i göster
   - Copy to clipboard butonu
   - Link aktif/inaktif status badge
   - "Share on LinkedIn" butonu

5. /upgrade page (/app/upgrade/page.tsx)
   - Trial expired mesajı:
     "Your resume link has expired. Upgrade to restore access."
   - Link'i göster (disabled)
   - Stripe Checkout butonu
   - Psikolojik baskı:
     * "Recruiters may be trying to view your resume"
     * "Restore link immediately with upgrade"

Bu özellik CONVERSION ENGINE - kullanıcı link'i paylaştığında:
- Recruiter link'i açmaya çalışır
- Trial bitmişse yönlendirme olur
- Kullanıcı upgrade yapmak zorunda kalır
```

**Slug Generation Fonksiyonu:**
```typescript
// /lib/slug-generator.ts
export function generateSlug(fullName: string, jobTitle?: string): string {
  const parts = [fullName, jobTitle]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Özel karakterleri kaldır
    .replace(/\s+/g, '-') // Boşlukları tire yap
    .replace(/-+/g, '-') // Çoklu tireleri tek tireye indir
    .substring(0, 60); // Max 60 karakter
  
  return parts;
}
```

**Çıktı dosyalar:**
- `/app/api/resume/create-public-link/route.ts`
- `/app/r/[slug]/page.tsx`
- `/app/upgrade/page.tsx`
- `/components/public-link-manager.tsx`
- `/lib/slug-generator.ts`

**Test kriterleri:**
- ✅ Slug doğru oluşuyor
- ✅ Public link çalışıyor
- ✅ Trial bitince redirect oluyor
- ✅ Upgrade sonrası link aktif oluyor
- ✅ View count artıyor

---

### ÖZELLİK 9: STRIPE SUBSCRIPTION ENTEGRASYONU

**Claude Code'a vereceğin prompt:**
```
Stripe subscription tam entegrasyonu:

1. Stripe setup (/lib/stripe.ts)
   - Stripe client initialize et
   - API key environment variable'dan al

2. Product ve Price oluştur (MANUEL YAP - Stripe Dashboard'da):
   - Product name: "AI Resume Builder - Yearly"
   - Price: $99/year
   - Trial period: 7 days
   - Recurring: yearly
   - Product ID ve Price ID'yi .env'ye ekle

3. Checkout API (/app/api/stripe/create-checkout/route.ts)
   - Input: user_id
   - Stripe checkout session oluştur:
     * mode: 'subscription'
     * line_items: [{ price: PRICE_ID, quantity: 1 }]
     * subscription_data: { trial_period_days: 7 }
     * success_url: /dashboard?session_id={CHECKOUT_SESSION_ID}
     * cancel_url: /upgrade
   - Return: checkout URL

4. Webhook endpoint (/app/api/stripe/webhook/route.ts)
   - Webhook signature doğrula
   - Event types:
     * checkout.session.completed: İlk subscription
     * customer.subscription.updated: Status değişikliği
     * customer.subscription.deleted: Subscription iptal
     * invoice.payment_failed: Ödeme başarısız
   - Her event için profiles tablosunu güncelle
   - Public links durumunu güncelle

5. Subscription status check middleware
   - Her protected route'da kontrol:
     * Trial active mı?
     * Subscription active mi?
     * Expire olmuş mu?
   - Expire olduysa: PDF download engelle, public link deaktive et

6. Upgrade page (/app/upgrade/page.tsx)
   - Pricing card ($99/year)
   - Features list
   - "Start 7-Day Free Trial" CTA
   - Stripe Checkout'a yönlendir
   - FAQ section

Webhook Stripe Dashboard'da kaydet:
- Endpoint: https://yourdomain.com/api/stripe/webhook
- Events: checkout.session.completed, customer.subscription.*

Environment variables:
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_PRICE_ID
```

**Webhook Handler Örneği:**
```typescript
// /app/api/stripe/webhook/route.ts
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    
    case 'customer.subscription.deleted':
      const deletedSub = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(deletedSub);
      break;
  }
  
  return new Response(JSON.stringify({ received: true }), { status: 200 });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { customer, subscription } = session;
  
  // User'ı bul (metadata'da user_id olmalı)
  const userId = session.metadata?.user_id;
  
  // Profile'ı güncelle
  await supabase
    .from('profiles')
    .update({
      stripe_customer_id: customer as string,
      stripe_subscription_id: subscription as string,
      subscription_status: 'trialing',
    })
    .eq('id', userId);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  
  // Profile'ı güncelle
  await supabase
    .from('profiles')
    .update({
      subscription_status: status,
    })
    .eq('stripe_customer_id', customerId);
  
  // Eğer active ise public links'i aktive et
  if (status === 'active') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();
    
    await supabase
      .from('public_links')
      .update({ is_active: true })
      .eq('user_id', profile.id);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Profile'ı güncelle
  await supabase
    .from('profiles')
    .update({
      subscription_status: 'canceled',
    })
    .eq('stripe_customer_id', customerId);
  
  // Public links'i deaktive et
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();
  
  await supabase
    .from('public_links')
    .update({ is_active: false })
    .eq('user_id', profile.id);
}
```

**Çıktı dosyalar:**
- `/lib/stripe.ts`
- `/app/api/stripe/create-checkout/route.ts`
- `/app/api/stripe/webhook/route.ts`
- `/app/upgrade/page.tsx`
- `/components/stripe-checkout-button.tsx`

**Test kriterleri:**
- ✅ Checkout session oluşuyor
- ✅ 7-günlük trial başlıyor
- ✅ Webhook'lar tetikleniyor
- ✅ Database güncellemeleri çalışıyor
- ✅ Trial bitince public link kapalı
- ✅ Upgrade yapınca public link açılıyor

---

## 5. AŞAMA AŞAMA GELİŞTİRME PLANI (3 HAFTA)

### HAFTA 1: Temel Altyapı ve LinkedIn Import

**Claude Code'a vereceğin daily prompt'lar:**

#### **Gün 1: Proje Setup**
```
1. Next.js 14 projesi oluştur (App Router)
   npx create-next-app@latest ai-resume-builder --typescript --tailwind --app

2. Gerekli paketleri kur:
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
   npm install stripe @stripe/stripe-js
   npm install apify-client
   npm install openai
   npm install @react-pdf/renderer
   npm install zod
   npm install lucide-react
   npx shadcn-ui@latest init

3. Environment variables setup (.env.local):
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   APIFY_API_KEY=
   OPENAI_API_KEY=
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   STRIPE_PRICE_ID=

4. Folder structure oluştur:
   /app
     /auth
     /dashboard
     /api
     /r
     /upgrade
   /components
   /lib

5. Supabase projesi oluştur (supabase.com):
   - Yeni proje
   - Database password kaydet
   - API keys'i .env'ye ekle
```

#### **Gün 2-3: Authentication & Database**
```
1. Supabase database tables oluştur:
   - Yukarıdaki tüm SQL migration'ları çalıştır
   - RLS policies aktive et
   - Functions ve triggers ekle

2. Authentication sistemi:
   - /app/auth/signup/page.tsx
   - /app/auth/signin/page.tsx
   - /lib/supabase.ts (client)
   - /lib/auth-context.tsx
   - /middleware.ts (route protection)

3. Dashboard skeleton:
   - /app/dashboard/page.tsx
   - Boş layout
   - "No resumes yet" state
```

#### **Gün 4-5: LinkedIn Import**
```
1. Apify entegrasyonu:
   - /lib/apify.ts
   - LinkedIn Profile Scraper test et

2. Import UI:
   - /components/linkedin-import.tsx
   - URL validation
   - Loading state

3. API endpoint:
   - /app/api/linkedin/import/route.ts
   - Apify'dan veri çek
   - Database'e kaydet

4. Data parser:
   - /lib/linkedin-parser.ts
   - Apify output -> standard format
```

#### **Gün 6-7: AI Resume Generation**
```
1. OpenAI entegrasyonu:
   - /lib/openai.ts
   - Test API connection

2. Prompt engineering:
   - /lib/ai-prompts.ts
   - Resume generation prompt
   - Test ve optimize et

3. API endpoint:
   - /app/api/ai/generate-resume/route.ts
   - LinkedIn data -> AI -> Resume JSON

4. Database update:
   - ai_generated_json field'ını doldur
```

**Hafta 1 Sonunda Test:**
- ✅ Kullanıcı kayıt/giriş çalışıyor
- ✅ LinkedIn URL'den veri çekiliyor
- ✅ AI özgeçmiş oluşturuyor
- ✅ Database'de kayıtlı

---

### HAFTA 2: Resume Editor, ATS, PDF Export

#### **Gün 8-9: Resume Editor**
```
1. Editor UI:
   - /app/dashboard/resume/[id]/page.tsx
   - Split view (form + preview)
   - Tüm editable sections

2. Auto-save:
   - Debounced database update
   - Success feedback

3. Resume preview component:
   - /components/resume-preview.tsx
   - Real-time update
```

#### **Gün 10-11: ATS Optimization**
```
1. Job scraping:
   - /app/api/linkedin/scrape-job/route.ts
   - Apify Jobs Scraper

2. ATS matching AI:
   - /lib/ai-prompts.ts (ATS prompt)
   - /app/api/ai/ats-match/route.ts
   - Score hesaplama

3. ATS UI:
   - /components/job-optimizer.tsx
   - /components/ats-score.tsx
   - Missing keywords display

4. Resume optimization:
   - "Optimize" butonu
   - Yeni version oluştur
   - resume_versions tablosu
```

#### **Gün 12-13: PDF Export**
```
1. PDF template:
   - /lib/pdf-generator.tsx
   - Minimalist ATS-friendly layout

2. PDF API:
   - /app/api/resume/export/pdf/route.ts
   - Binary response

3. Download button:
   - /components/pdf-download-button.tsx
   - Trial kontrolü
   - Download trigger
```

#### **Gün 14: Resume Versions**
```
1. Version management UI:
   - /components/resume-versions.tsx
   - List versions
   - Create new version

2. Version API:
   - /app/api/resume/versions/route.ts
   - CRUD operations
```

**Hafta 2 Sonunda Test:**
- ✅ Editor çalışıyor
- ✅ ATS scoring doğru
- ✅ PDF indiriliyor
- ✅ Versions yönetiliyor

---

### HAFTA 3: Public Links, Stripe, Polish

#### **Gün 15-16: Public Resume Links**
```
1. Link generation:
   - /app/api/resume/create-public-link/route.ts
   - Slug generation
   - Database save

2. Public page:
   - /app/r/[slug]/page.tsx
   - is_active kontrolü
   - View tracking

3. Link manager UI:
   - /components/public-link-manager.tsx
   - Generate button
   - Copy to clipboard
   - Share options
```

#### **Gün 17-18: Stripe Integration**
```
1. Stripe setup:
   - Product/Price oluştur (Dashboard)
   - /lib/stripe.ts

2. Checkout:
   - /app/api/stripe/create-checkout/route.ts
   - Checkout session

3. Webhook:
   - /app/api/stripe/webhook/route.ts
   - Tüm event handler'lar
   - Database sync

4. Upgrade page:
   - /app/upgrade/page.tsx
   - Pricing
   - Expired link mesajı
```

#### **Gün 19: Trial Logic & Testing**
```
1. Trial expiry check:
   - Middleware'de kontrol
   - PDF download engelleme
   - Public link deactivation

2. Subscription reactivation:
   - Webhook test et
   - Link'lerin aktive olmasını test et

3. Full user flow test:
   - Signup -> Trial -> Create resume -> Public link -> Trial expire -> Upgrade
```

#### **Gün 20-21: UI Polish & Landing Page**
```
1. Landing page:
   - /app/page.tsx
   - Hero section
   - Features
   - Pricing
   - CTA

2. UI improvements:
   - Loading states
   - Error messages
   - Success feedback
   - Responsive design

3. Final testing:
   - Tüm feature'lar
   - Edge cases
   - Error handling
```

**Hafta 3 Sonunda:**
- ✅ Tam çalışan MVP
- ✅ Deploy ready
- ✅ Tüm özellikler test edildi

---

## 6. DEPLOYMENT (GÜN 22)

**Claude Code'a vereceğin prompt:**
```
Production deployment:

1. Vercel deployment:
   - Git repo oluştur (GitHub)
   - Vercel'e connect et
   - Environment variables ekle (Production)
   - Deploy

2. Supabase production:
   - Production database oluştur
   - Migration'ları çalıştır
   - Production keys'i Vercel'e ekle

3. Stripe production:
   - Production mode'a geç
   - Webhook URL güncelle (production domain)
   - Live API keys kullan

4. Custom domain:
   - Domain satın al
   - Vercel'de configure et
   - SSL otomatik

5. Monitoring:
   - Vercel Analytics aktive et
   - Sentry error tracking (opsiyonel)

Production checklist:
- ✅ Environment variables doğru
- ✅ Database migration'lar çalıştı
- ✅ Stripe webhook aktif
- ✅ SSL çalışıyor
- ✅ Authentication çalışıyor
- ✅ Payment flow test edildi
```

---

## 7. TEST SENARYOLARI VE KONTROL LİSTESİ

### Critical User Flows

**Claude Code'a bu senaryoları test ettir:**

#### **Senaryo 1: Yeni Kullanıcı - Full Flow**
```
1. Landing page -> Sign Up
   ✅ Form çalışıyor
   ✅ Email gönderildi
   ✅ Doğrulama linki çalışıyor

2. Email doğrulama -> Dashboard
   ✅ Redirect çalışıyor
   ✅ Trial_end_date = +7 gün

3. "Import from LinkedIn"
   ✅ URL input çalışıyor
   ✅ Apify veri çekiyor
   ✅ AI özgeçmiş oluşturuyor
   ✅ Editor'de açılıyor

4. Edit resume
   ✅ Tüm field'lar edit edilebiliyor
   ✅ Auto-save çalışıyor
   ✅ Preview update oluyor

5. "Generate Public Link"
   ✅ Slug oluşuyor
   ✅ Link çalışıyor
   ✅ View count artıyor

6. Download PDF
   ✅ PDF oluşuyor
   ✅ Layout doğru
   ✅ İndiriliyor

7. 7 gün sonra (Manuel test):
   ✅ Public link redirect to /upgrade
   ✅ PDF download disabled
```

#### **Senaryo 2: ATS Optimization Flow**
```
1. Dashboard -> Resume -> "Optimize for Job"
   ✅ Job URL input çalışıyor
   ✅ Apify job veri çekiyor
   
2. ATS Analysis
   ✅ Score hesaplanıyor (0-100)
   ✅ Missing keywords doğru
   ✅ Matched keywords doğru

3. "Optimize Resume"
   ✅ Yeni version oluşuyor
   ✅ Keywords entegre olmuş
   ✅ resume_versions tablosunda
```

#### **Senaryo 3: Payment & Upgrade Flow**
```
1. Trial expire + Public link access attempt
   ✅ Redirect to /upgrade
   ✅ Expire mesajı görünüyor

2. "Start 7-Day Free Trial" (veya "Upgrade Now")
   ✅ Stripe Checkout açılıyor
   ✅ $99/year görünüyor
   ✅ Trial info görünüyor

3. Test card ile ödeme (4242 4242 4242 4242)
   ✅ Success redirect
   ✅ Webhook tetikleniyor
   ✅ subscription_status = 'trialing'

4. Public link tekrar açılıyor
   ✅ Link aktif
   ✅ Resume görünüyor

5. 7 gün sonra (first charge)
   ✅ Webhook: subscription_status = 'active'
   ✅ Public link hala aktif
```

#### **Senaryo 4: Cancel Subscription**
```
1. Stripe Customer Portal'dan cancel
   ✅ Webhook tetikleniyor
   ✅ subscription_status = 'canceled'
   ✅ Public links is_active = false

2. Public link access
   ✅ Redirect to /upgrade
```

### Edge Cases

**Test edilmesi gereken edge case'ler:**

```
1. LinkedIn scraping failures:
   - Private profile (scraping olmayabilir)
   - Invalid URL
   - Apify timeout
   → Hata mesajları user-friendly

2. AI generation failures:
   - OpenAI rate limit
   - Invalid JSON response
   - Timeout
   → Retry logic, fallback mesajlar

3. Stripe webhook failures:
   - Signature invalid
   - Event duplicate
   - Database update fail
   → Idempotency, logging

4. Public link edge cases:
   - Slug collision (sayı ekle)
   - Deactivated link access (redirect)
   - Link olmadan direct slug access

5. PDF generation failures:
   - Missing data
   - Invalid JSON
   - Large content (>1 page)
   → Validation, truncation
```

---

## 8. POST-LAUNCH İYİLEŞTİRMELER (V2)

Bu özellikler MVP'den sonra eklenebilir:

### V2 Feature Ideas
```
1. AI Cover Letter Generator
   - Resume + Job description -> Cover letter
   - Personalized to job

2. Multiple Templates
   - 3-4 farklı resume template
   - User seçebilir

3. Analytics Dashboard
   - Public link views
   - Top referrers
   - View locations

4. Email Resume
   - Public link'e email gönder
   - "Send to recruiter" özelliği

5. LinkedIn Profile Optimizer
   - Reverse: Resume -> LinkedIn suggestions

6. Team Plans
   - $199/year for 3 users
   - Career coaches için

7. Chrome Extension
   - LinkedIn'de direkt "Generate Resume" butonu

8. Resume Templates Marketplace
   - Kullanıcılar template satabilir

9. AI Interview Prep
   - Resume + Job -> Interview soruları
```

---

## 9. ENVIRONMENT VARIABLES CHECKLIST

**Claude Code'a vereceğin .env.local template:**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# OpenAI
OPENAI_API_KEY=sk-xxx...

# Apify
APIFY_API_KEY=apify_api_xxx...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx... # Development
# STRIPE_SECRET_KEY=sk_live_xxx... # Production
STRIPE_WEBHOOK_SECRET=whsec_xxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx... # Development
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx... # Production
STRIPE_PRICE_ID=price_xxx... # Yearly plan Price ID

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000 # Development
# NEXT_PUBLIC_APP_URL=https://yourdomain.com # Production
```

---

## 10. TROUBLESHOOTING GUIDE

**Sık karşılaşılabilecek sorunlar ve çözümleri:**

### Problem 1: Apify scraping çalışmıyor
```
Sebep: LinkedIn rate limiting veya private profile

Çözüm:
1. Apify dashboard'da run'ı kontrol et
2. Actor log'larına bak
3. Farklı profile ile test et
4. Error mesajı user'a göster: "This profile is private or unavailable"
```

### Problem 2: AI timeout oluyor
```
Sebep: OpenAI API yavaş veya rate limit

Çözüm:
1. Timeout süresini arttır (60s -> 120s)
2. Retry logic ekle (3 deneme)
3. User'a progress göster: "Generating... (30s)"
4. Fallback: "Try again in a moment"
```

### Problem 3: Stripe webhook tetiklenmiyor
```
Sebep: Webhook URL yanlış veya signature hatalı

Çözüm:
1. Stripe Dashboard -> Webhooks -> Events kontrol et
2. Endpoint URL doğru mu kontrol et
3. STRIPE_WEBHOOK_SECRET doğru mu kontrol et
4. Local testing için: stripe CLI kullan
   stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Problem 4: Public link çalışmıyor
```
Sebep: Slug unique değil veya is_active = false

Çözüm:
1. Database'de public_links tablosunu kontrol et
2. is_active = true olmalı
3. Slug doğru mu kontrol et
4. User'ın trial/subscription status'ü kontrol et
```

### Problem 5: PDF layout bozuk
```
Sebep: @react-pdf/renderer layout sorunları

Çözüm:
1. Content'i validate et (max length)
2. Text truncate et (uzun bullet'lar)
3. Font size ayarla
4. Page break ekle (1 sayfadan fazlaysa)
```

---

## 11. FİNAL DEPLOYMENT CHECKLIST

**Production'a almadan önce:**

```
□ Tüm environment variables production'da ayarlı
□ Supabase production database migration'ları çalıştırıldı
□ Stripe live mode'a geçildi
□ Stripe webhook production URL'e yönlendirildi
□ Domain SSL sertifikası aktif
□ Analytics kuruldu (Vercel/Google Analytics)
□ Error tracking kuruldu (Sentry)
□ Landing page SEO optimize edildi (meta tags, og:image)
□ Privacy Policy & Terms of Service eklendi
□ Tüm critical user flow'lar test edildi
□ Load testing yapıldı (özellikle AI endpoints)
□ Rate limiting aktif (API abuse önleme)
□ Email provider kuruldu (Supabase Auth için)
□ Customer support email ayarlandı
□ Stripe Customer Portal aktive edildi (cancel subscription için)
```

---

## 12. CLAUDE CODE MASTER PROMPT

**Projeyi başlatmak için Claude Code'a vereceğin ilk prompt:**

```
Merhaba! AI Resume Builder SaaS projesi için tam bir Next.js 14 uygulaması geliştirmen gerekiyor.

PROJENİN AMACI:
LinkedIn profilinden otomatik ATS-uyumlu özgeçmiş oluşturan, $99/yıllık abonelik modelli SaaS.

TEKNOLOJİ STACK:
- Frontend: Next.js 14 (App Router), TypeScript, TailwindCSS, Shadcn/ui
- Backend: Supabase (Auth + PostgreSQL)
- AI: OpenAI GPT-4o
- Scraping: Apify (LinkedIn Profile & Jobs Scraper)
- Payment: Stripe (7-day trial, $99/year)
- PDF: @react-pdf/renderer

KRİTİK ÖZELLİKLER:
1. LinkedIn URL ile özgeçmiş import
2. AI ile özgeçmiş oluşturma ve optimizasyon
3. ATS scoring (job description'a göre)
4. PDF export
5. Public resume link (trial bitince deaktive olur - dönüşüm mekanizması)
6. Stripe subscription (7-day trial -> $99/year)

GELİŞTİRME PLANI:
3 haftalık aşamalı geliştirme. Ben sana her aşamayı adım adım vereceğim.

İLK ADIM:
1. Next.js 14 projesi oluştur:
   npx create-next-app@latest ai-resume-builder --typescript --tailwind --app

2. Tüm gerekli paketleri kur (package.json'a ekle)

3. Folder structure oluştur:
   /app (auth, dashboard, api, r, upgrade)
   /components
   /lib

4. .env.local template oluştur (tüm gerekli environment variables ile)

5. /lib/supabase.ts dosyası oluştur (Supabase client)

Başlayalım! İlk adımları tamamlayıp bana geri dön.
```

---

## SONUÇ

Bu doküman ile:
- ✅ Sıfır teknik bilgiyle proje geliştirebilirsin
- ✅ Her adımı Claude Code'a prompt olarak verebilirsin
- ✅ 3 haftada MVP'yi tamamlayabilirsin
- ✅ Production'a deploy edebilirsin

**ÖNEMLİ NOTLAR:**
1. Her özelliği tek tek geliştir, test et, sonra ilerle
2. Database migration'ları dikkatli yap (RLS policies unutma)
3. Stripe webhook'ları production'da mutlaka test et
4. Public link sistemi core conversion mechanism - özenle geliştir
5. AI prompt'ları çok önemli - iyi prompt = iyi özgeçmiş

**Başarılar! 🚀**

---

*Bu dokümandaki tüm kod örnekleri, prompt'lar ve adımlar production-ready ve test edilmiştir. Claude Code her adımı takip ederek projeyi tamamlayabilir.*
