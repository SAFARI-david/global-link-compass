
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  source TEXT NOT NULL,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  converted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead (anonymous visitors from ads)
CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view/manage leads
CREATE POLICY "Admins can manage leads"
  ON public.leads FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
