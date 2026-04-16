
-- Programs table for Country → Visa Type → Program structure
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Classification
  country TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  category TEXT,
  
  -- Basic info
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'paused', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT false,
  
  -- Overview
  short_overview TEXT,
  full_description TEXT,
  why_choose TEXT,
  best_for TEXT,
  
  -- Eligibility
  eligibility_summary TEXT,
  education_requirement TEXT,
  work_experience_requirement TEXT,
  language_requirement TEXT,
  other_conditions TEXT,
  
  -- Documents (JSONB array of {name, description?, required?})
  required_documents JSONB DEFAULT '[]'::jsonb,
  
  -- Process steps (JSONB array of {title, description, order})
  process_steps JSONB DEFAULT '[]'::jsonb,
  
  -- Fees & timelines
  service_fee NUMERIC,
  currency TEXT DEFAULT 'USD',
  processing_time TEXT,
  government_fees_included BOOLEAN DEFAULT false,
  separate_costs TEXT,
  payment_note TEXT,
  
  -- Benefits (JSONB array of strings)
  benefits JSONB DEFAULT '[]'::jsonb,
  
  -- FAQs (JSONB array of {question, answer})
  faqs JSONB DEFAULT '[]'::jsonb,
  
  -- Extra content
  family_dependant_option TEXT,
  whats_included JSONB DEFAULT '[]'::jsonb,
  whats_not_included JSONB DEFAULT '[]'::jsonb,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  -- CTA
  cta_apply_text TEXT DEFAULT 'Apply Now',
  cta_consult_text TEXT DEFAULT 'Book Consultation',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for common queries
CREATE INDEX idx_programs_country ON public.programs (country);
CREATE INDEX idx_programs_visa_type ON public.programs (visa_type);
CREATE INDEX idx_programs_country_visa ON public.programs (country, visa_type);
CREATE INDEX idx_programs_status ON public.programs (status);
CREATE INDEX idx_programs_slug ON public.programs (slug);

-- Enable RLS
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

-- Public read access for active programs
CREATE POLICY "Anyone can view active programs"
ON public.programs
FOR SELECT
USING (status = 'active');

-- Admins can view all programs (including drafts)
CREATE POLICY "Admins can view all programs"
ON public.programs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert programs
CREATE POLICY "Admins can insert programs"
ON public.programs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update programs
CREATE POLICY "Admins can update programs"
ON public.programs
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete programs
CREATE POLICY "Admins can delete programs"
ON public.programs
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update timestamp trigger
CREATE TRIGGER update_programs_updated_at
BEFORE UPDATE ON public.programs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
