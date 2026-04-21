
-- Create services table
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country text NOT NULL,
  visa_type text NOT NULL,
  description text,
  requirements text[] DEFAULT '{}',
  form_fields jsonb NOT NULL DEFAULT '{}',
  standard_price numeric DEFAULT 0,
  partner_price numeric,
  dependent_price numeric,
  processing_time text,
  phases jsonb DEFAULT '[]',
  image_url text,
  internal_notes text,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  is_hot_deal boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Anyone can view active services
CREATE POLICY "Anyone can view active services"
ON public.services
FOR SELECT
TO public
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage services"
ON public.services
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Agents can view active services
CREATE POLICY "Agents can view active services"
ON public.services
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'agent'::app_role) AND is_active = true);

-- Updated_at trigger
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
