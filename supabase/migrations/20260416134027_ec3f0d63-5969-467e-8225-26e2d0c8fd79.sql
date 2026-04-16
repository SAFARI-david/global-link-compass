
DROP POLICY "Service can insert webhook events" ON public.webhook_events;

-- More restrictive: only allow webhook inserts with valid provider
CREATE POLICY "Webhook inserts from known providers" ON public.webhook_events
  FOR INSERT TO anon
  WITH CHECK (provider IN ('whop'));

-- Also allow admins to insert
CREATE POLICY "Admins can insert webhook events" ON public.webhook_events
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
