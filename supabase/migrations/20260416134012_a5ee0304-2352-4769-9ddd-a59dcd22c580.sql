
-- Payment status enum
CREATE TYPE public.payment_status AS ENUM (
  'unpaid', 'pending', 'paid', 'failed', 'refunded', 'pending_verification'
);

-- Payer type enum
CREATE TYPE public.payer_type AS ENUM ('applicant', 'agent');

-- Payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  applicant_id UUID,
  agent_id UUID,
  payer_type public.payer_type NOT NULL DEFAULT 'applicant',
  country TEXT,
  visa_type TEXT,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  service_type TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  provider TEXT NOT NULL DEFAULT 'whop',
  whop_product_id TEXT,
  whop_plan_id TEXT,
  whop_checkout_reference TEXT,
  whop_payment_id TEXT,
  internal_reference TEXT NOT NULL UNIQUE,
  payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  paid_at TIMESTAMPTZ,
  verification_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT TO authenticated
  USING (applicant_id = auth.uid());

CREATE POLICY "Agents can view assigned payments" ON public.payments
  FOR SELECT TO authenticated
  USING (agent_id = auth.uid());

CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update payments" ON public.payments
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can create payments" ON public.payments
  FOR INSERT TO authenticated
  WITH CHECK (applicant_id = auth.uid() OR agent_id = auth.uid());

CREATE POLICY "Admins can insert payments" ON public.payments
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generate payment reference
CREATE OR REPLACE FUNCTION public.generate_payment_reference()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  seq_num INT;
BEGIN
  SELECT COALESCE(MAX(
    CAST(NULLIF(regexp_replace(internal_reference, '^PAY-[0-9]+-', ''), '') AS INT)
  ), 0) + 1 INTO seq_num FROM public.payments;
  NEW.internal_reference := 'PAY-' || to_char(now(), 'YYYY') || '-' || lpad(seq_num::text, 6, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER generate_payment_ref
  BEFORE INSERT ON public.payments
  FOR EACH ROW
  WHEN (NEW.internal_reference IS NULL OR NEW.internal_reference = '')
  EXECUTE FUNCTION public.generate_payment_reference();

-- Pricing table
CREATE TABLE public.pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT,
  visa_type TEXT,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  base_amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  pricing_type TEXT NOT NULL DEFAULT 'one_time',
  whop_product_id TEXT,
  whop_plan_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active pricing" ON public.pricing
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage pricing" ON public.pricing
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_pricing_updated_at
  BEFORE UPDATE ON public.pricing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Payment add-ons
CREATE TABLE public.payment_addons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active addons" ON public.payment_addons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage addons" ON public.payment_addons
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_addons_updated_at
  BEFORE UPDATE ON public.payment_addons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Webhook events log
CREATE TABLE public.webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'whop',
  event_type TEXT NOT NULL,
  external_event_id TEXT,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  signature_valid BOOLEAN NOT NULL DEFAULT false,
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view webhook events" ON public.webhook_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service can insert webhook events" ON public.webhook_events
  FOR INSERT TO anon
  WITH CHECK (true);

-- Add payment_status to applications
ALTER TABLE public.applications
  ADD COLUMN payment_status public.payment_status NOT NULL DEFAULT 'unpaid';

-- Unique index on external event id for idempotency
CREATE UNIQUE INDEX idx_webhook_external_event ON public.webhook_events(provider, external_event_id)
  WHERE external_event_id IS NOT NULL;
