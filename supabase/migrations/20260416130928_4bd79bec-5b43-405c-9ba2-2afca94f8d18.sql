-- 1. Replace the ALL policy on user_roles with explicit WITH CHECK
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. Create a view that excludes admin_notes for agents
CREATE OR REPLACE VIEW public.agent_applications AS
SELECT
  id,
  user_id,
  reference_number,
  application_type,
  status,
  destination_country,
  form_data,
  assigned_agent_id,
  created_at,
  updated_at
FROM public.applications
WHERE assigned_agent_id = auth.uid();