
-- Use DROP IF EXISTS + CREATE for remaining triggers
DO $$
BEGIN
  -- Reference number trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_generate_reference_number') THEN
    CREATE TRIGGER trg_generate_reference_number
      BEFORE INSERT ON public.applications
      FOR EACH ROW EXECUTE FUNCTION public.generate_reference_number();
  END IF;

  -- Payment reference trigger
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_generate_payment_reference') THEN
    CREATE TRIGGER trg_generate_payment_reference
      BEFORE INSERT ON public.payments
      FOR EACH ROW EXECUTE FUNCTION public.generate_payment_reference();
  END IF;

  -- updated_at triggers for tables that don't have them yet
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_payments_updated_at') THEN
    CREATE TRIGGER update_payments_updated_at
      BEFORE UPDATE ON public.payments
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_pricing_updated_at') THEN
    CREATE TRIGGER update_pricing_updated_at
      BEFORE UPDATE ON public.pricing
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_programs_updated_at') THEN
    CREATE TRIGGER update_programs_updated_at
      BEFORE UPDATE ON public.programs
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_payment_addons_updated_at') THEN
    CREATE TRIGGER update_payment_addons_updated_at
      BEFORE UPDATE ON public.payment_addons
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Remove unsafe anon INSERT policy on webhook_events
DROP POLICY IF EXISTS "Webhook inserts from known providers" ON public.webhook_events;
