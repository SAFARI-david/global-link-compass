UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE email IN ('admin@demo.com','agent@demo.com','applicant@demo.com');

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'admin@demo.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'agent'::app_role FROM auth.users WHERE email = 'agent@demo.com'
ON CONFLICT DO NOTHING;