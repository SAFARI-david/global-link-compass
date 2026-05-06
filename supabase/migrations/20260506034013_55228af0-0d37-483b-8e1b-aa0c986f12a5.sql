-- Fix: Restrict commission_settings SELECT to admins and agents only
DROP POLICY IF EXISTS "Authenticated can read commission settings" ON public.commission_settings;

CREATE POLICY "Admins and agents can read commission settings"
ON public.commission_settings
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR public.has_role(auth.uid(), 'agent'::app_role)
);

-- Fix: Add missing UPDATE policy on applicant-documents storage bucket
CREATE POLICY "Users can update their own documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'applicant-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can update any document"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'applicant-documents'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);