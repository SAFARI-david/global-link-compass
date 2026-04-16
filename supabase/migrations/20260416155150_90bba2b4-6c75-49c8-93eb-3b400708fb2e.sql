
-- Status history table
CREATE TABLE public.application_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL,
  old_status text,
  new_status text NOT NULL,
  changed_by uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_status_history_app ON public.application_status_history(application_id);
CREATE INDEX idx_status_history_created ON public.application_status_history(created_at DESC);

ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;

-- Users can view history for their own applications
CREATE POLICY "Users can view own app history"
  ON public.application_status_history FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.applications
    WHERE applications.id = application_status_history.application_id
      AND applications.user_id = auth.uid()
  ));

-- Admins can view all
CREATE POLICY "Admins can view all history"
  ON public.application_status_history FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Agents can view assigned
CREATE POLICY "Agents can view assigned history"
  ON public.application_status_history FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.applications
    WHERE applications.id = application_status_history.application_id
      AND applications.assigned_agent_id = auth.uid()
  ));

-- System insert (service role bypasses RLS, trigger uses SECURITY DEFINER)
CREATE POLICY "System can insert history"
  ON public.application_status_history FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger function to auto-log status changes
CREATE OR REPLACE FUNCTION public.log_application_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.application_status_history (application_id, old_status, new_status)
    VALUES (NEW.id, OLD.status::text, NEW.status::text);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_log_status_change
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_application_status_change();

-- Also log the initial submission
CREATE OR REPLACE FUNCTION public.log_application_initial_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.application_status_history (application_id, old_status, new_status)
  VALUES (NEW.id, NULL, NEW.status::text);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_log_initial_status
  AFTER INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.log_application_initial_status();
