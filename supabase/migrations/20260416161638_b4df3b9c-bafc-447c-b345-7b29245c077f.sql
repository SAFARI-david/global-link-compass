
-- Add lead status tracking
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS application_id uuid;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS interest text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_agent_id uuid;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS country text;

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_application_id ON public.leads(application_id);
