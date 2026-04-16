-- Create document status enum
CREATE TYPE public.document_status AS ENUM ('pending', 'approved', 'rejected');

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL,
  user_id UUID NOT NULL,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT,
  status document_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
ON public.documents FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can upload documents
CREATE POLICY "Users can insert own documents"
ON public.documents FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can delete their own pending documents
CREATE POLICY "Users can delete own pending documents"
ON public.documents FOR DELETE
TO authenticated
USING (user_id = auth.uid() AND status = 'pending');

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON public.documents FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Admins can update documents (review)
CREATE POLICY "Admins can update documents"
ON public.documents FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Agents can view documents for assigned applications
CREATE POLICY "Agents can view assigned documents"
ON public.documents FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.applications
    WHERE applications.id = documents.application_id
    AND applications.assigned_agent_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('applicant-documents', 'applicant-documents', false);

-- Storage policies: users can upload to their own folder
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'applicant-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own documents
CREATE POLICY "Users can view own storage documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'applicant-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins can view all documents in storage
CREATE POLICY "Admins can view all storage documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'applicant-documents' AND has_role(auth.uid(), 'admin'));

-- Users can delete their own files
CREATE POLICY "Users can delete own storage documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'applicant-documents' AND auth.uid()::text = (storage.foldername(name))[1]);