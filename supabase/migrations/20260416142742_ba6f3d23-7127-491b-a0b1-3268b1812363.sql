
-- Function to sync payment status changes to applications
CREATE OR REPLACE FUNCTION public.sync_payment_to_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only act if payment_status changed and there's a linked application
  IF NEW.application_id IS NOT NULL AND 
     (OLD.payment_status IS DISTINCT FROM NEW.payment_status) THEN
    
    IF NEW.payment_status = 'paid' THEN
      UPDATE public.applications
      SET payment_status = 'paid',
          status = CASE 
            WHEN status = 'submitted' THEN 'under_review'::application_status
            ELSE status
          END
      WHERE id = NEW.application_id;
    ELSIF NEW.payment_status = 'failed' THEN
      UPDATE public.applications
      SET payment_status = 'failed'
      WHERE id = NEW.application_id;
    ELSIF NEW.payment_status = 'refunded' THEN
      UPDATE public.applications
      SET payment_status = 'refunded'
      WHERE id = NEW.application_id;
    ELSIF NEW.payment_status = 'pending' THEN
      UPDATE public.applications
      SET payment_status = 'pending'
      WHERE id = NEW.application_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER trg_sync_payment_to_application
  AFTER UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_payment_to_application();

-- Also trigger on INSERT for new payments with non-default status
CREATE TRIGGER trg_sync_payment_to_application_insert
  AFTER INSERT ON public.payments
  FOR EACH ROW
  WHEN (NEW.payment_status != 'unpaid')
  EXECUTE FUNCTION public.sync_payment_to_application();
