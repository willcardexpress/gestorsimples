/*
  # Create users table for additional user data

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - links to auth.users
      - `name` (text) - user display name
      - `email` (text, unique) - user email
      - `type` (text) - user type (admin or client)
      - `points` (integer, default 0) - loyalty points
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read/update their own data
    - Add policy for admins to read all users
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('admin', 'client')) DEFAULT 'client',
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own data
CREATE POLICY "Users can manage own data"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Admins can read all users
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND type = 'admin'
    )
  );

-- Insert default admin user
INSERT INTO users (id, name, email, type, points, created_at)
VALUES (
  gen_random_uuid(),
  'Administrador',
  'admin@iptv.com',
  'admin',
  0,
  now()
) ON CONFLICT (email) DO NOTHING;