-- Fix: Use SECURITY INVOKER so RLS applies based on the querying user
ALTER VIEW public.agent_applications SET (security_invoker = on);