
-- Create application status type
CREATE TYPE public.application_status AS ENUM (
  'submitted', 'under_review', 'in_progress', 'pending_documents', 'approved', 'rejected'
);

-- Applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reference_number TEXT NOT NULL UNIQUE,
  application_type TEXT NOT NULL CHECK (application_type IN ('Work Visa', 'Study Visa', 'Visit Visa')),
  status application_status NOT NULL DEFAULT 'submitted',
  destination_country TEXT,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  admin_notes TEXT,
  assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_applications_user ON public.applications (user_id);
CREATE INDEX idx_applications_status ON public.applications (status);
CREATE INDEX idx_applications_type ON public.applications (application_type);
CREATE INDEX idx_applications_ref ON public.applications (reference_number);

-- Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view own applications"
ON public.applications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create applications (with their user_id)
CREATE POLICY "Users can create applications"
ON public.applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Anonymous users can create applications (user_id will be null)
CREATE POLICY "Anonymous can create applications"
ON public.applications FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
ON public.applications FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update applications
CREATE POLICY "Admins can update applications"
ON public.applications FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Agents can view assigned applications
CREATE POLICY "Agents can view assigned applications"
ON public.applications FOR SELECT
TO authenticated
USING (assigned_agent_id = auth.uid());

-- Auto-update timestamp
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate reference numbers
CREATE OR REPLACE FUNCTION public.generate_reference_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  prefix TEXT;
  seq_num INT;
BEGIN
  IF NEW.application_type = 'Work Visa' THEN
    prefix := 'WV';
  ELSIF NEW.application_type = 'Study Visa' THEN
    prefix := 'SV';
  ELSE
    prefix := 'VV';
  END IF;
  
  SELECT COALESCE(MAX(
    CAST(NULLIF(regexp_replace(reference_number, '^[A-Z]+-[0-9]+-', ''), '') AS INT)
  ), 0) + 1
  INTO seq_num
  FROM public.applications
  WHERE application_type = NEW.application_type;
  
  NEW.reference_number := prefix || '-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_reference_number
BEFORE INSERT ON public.applications
FOR EACH ROW
WHEN (NEW.reference_number IS NULL OR NEW.reference_number = '')
EXECUTE FUNCTION public.generate_reference_number();
