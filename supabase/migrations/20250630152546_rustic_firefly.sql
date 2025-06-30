-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, type, points, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    CASE 
      WHEN new.email = 'admin@iptv.com' THEN 'admin'
      ELSE 'client'
    END,
    0,
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile when auth user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create admin user in auth.users if it doesn't exist
DO $$
DECLARE
  admin_exists boolean;
BEGIN
  -- Check if admin user exists in auth.users
  SELECT EXISTS(
    SELECT 1 FROM auth.users WHERE email = 'admin@iptv.com'
  ) INTO admin_exists;
  
  -- If admin doesn't exist, create it
  IF NOT admin_exists THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@iptv.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Administrador"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;