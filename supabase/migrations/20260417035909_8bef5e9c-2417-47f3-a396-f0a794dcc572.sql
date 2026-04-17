-- Seed three demo accounts with confirmed emails and assigned roles
DO $$
DECLARE
  demo_password TEXT := crypt('Demo1234!', gen_salt('bf'));
  admin_id UUID;
  agent_id UUID;
  applicant_id UUID;
BEGIN
  -- ADMIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@demo.com';
  IF admin_id IS NULL THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated',
      'admin@demo.com', demo_password, now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Demo Admin"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), admin_id,
      jsonb_build_object('sub', admin_id::text, 'email', 'admin@demo.com', 'email_verified', true),
      'email', admin_id::text, now(), now(), now());
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'admin') ON CONFLICT DO NOTHING;
  INSERT INTO public.profiles (user_id, full_name) VALUES (admin_id, 'Demo Admin') ON CONFLICT DO NOTHING;

  -- AGENT
  SELECT id INTO agent_id FROM auth.users WHERE email = 'agent@demo.com';
  IF agent_id IS NULL THEN
    agent_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', agent_id, 'authenticated', 'authenticated',
      'agent@demo.com', demo_password, now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Demo Agent"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), agent_id,
      jsonb_build_object('sub', agent_id::text, 'email', 'agent@demo.com', 'email_verified', true),
      'email', agent_id::text, now(), now(), now());
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (agent_id, 'agent') ON CONFLICT DO NOTHING;
  INSERT INTO public.profiles (user_id, full_name) VALUES (agent_id, 'Demo Agent') ON CONFLICT DO NOTHING;

  -- APPLICANT
  SELECT id INTO applicant_id FROM auth.users WHERE email = 'applicant@demo.com';
  IF applicant_id IS NULL THEN
    applicant_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', applicant_id, 'authenticated', 'authenticated',
      'applicant@demo.com', demo_password, now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Demo Applicant"}'::jsonb,
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), applicant_id,
      jsonb_build_object('sub', applicant_id::text, 'email', 'applicant@demo.com', 'email_verified', true),
      'email', applicant_id::text, now(), now(), now());
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (applicant_id, 'applicant') ON CONFLICT DO NOTHING;
  INSERT INTO public.profiles (user_id, full_name) VALUES (applicant_id, 'Demo Applicant') ON CONFLICT DO NOTHING;
END $$;