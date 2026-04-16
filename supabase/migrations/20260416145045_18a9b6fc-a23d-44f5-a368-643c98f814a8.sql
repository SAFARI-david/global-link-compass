
-- Commission status enum
CREATE TYPE public.commission_status AS ENUM ('pending', 'approved', 'paid', 'rejected');

-- Commissions table
CREATE TABLE public.commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  total_payment_amount NUMERIC NOT NULL,
  commission_percentage NUMERIC NOT NULL DEFAULT 10,
  commission_amount NUMERIC NOT NULL,
  status commission_status NOT NULL DEFAULT 'pending',
  approved_by UUID,
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(payment_id)
);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage commissions"
  ON public.commissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Agents can view own commissions"
  ON public.commissions FOR SELECT TO authenticated
  USING (agent_id = auth.uid());

-- Commission settings table
CREATE TABLE public.commission_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.commission_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage commission settings"
  ON public.commission_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can read commission settings"
  ON public.commission_settings FOR SELECT TO authenticated
  USING (true);

-- Seed default commission rate
INSERT INTO public.commission_settings (setting_key, setting_value, description)
VALUES ('default_commission_percentage', '10', 'Default commission percentage for agent referrals');

-- Trigger: auto-create commission when agent payment is marked paid
CREATE OR REPLACE FUNCTION public.auto_create_commission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_pct NUMERIC;
BEGIN
  -- Only act when payment status changes to 'paid' and there's an agent
  IF NEW.payment_status = 'paid' 
     AND OLD.payment_status IS DISTINCT FROM 'paid'
     AND NEW.agent_id IS NOT NULL THEN
    
    -- Get default commission percentage
    SELECT COALESCE(setting_value::NUMERIC, 10) INTO default_pct
    FROM public.commission_settings
    WHERE setting_key = 'default_commission_percentage';
    
    IF default_pct IS NULL THEN
      default_pct := 10;
    END IF;
    
    -- Insert commission record (ignore if already exists for this payment)
    INSERT INTO public.commissions (
      agent_id, payment_id, application_id,
      total_payment_amount, commission_percentage, commission_amount
    ) VALUES (
      NEW.agent_id, NEW.id, NEW.application_id,
      NEW.amount, default_pct, ROUND(NEW.amount * default_pct / 100, 2)
    ) ON CONFLICT (payment_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_auto_create_commission
  AFTER UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_create_commission();

-- Updated_at triggers
CREATE TRIGGER update_commissions_updated_at
  BEFORE UPDATE ON public.commissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_commission_settings_updated_at
  BEFORE UPDATE ON public.commission_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
