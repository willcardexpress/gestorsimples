/*
  # Create codes table

  1. New Tables
    - `codes`
      - `id` (uuid, primary key)
      - `plan_id` (uuid, foreign key to plans)
      - `code` (text, unique) - IPTV code
      - `is_used` (boolean, default false) - usage status
      - `used_by` (uuid, foreign key to users, nullable) - who used the code
      - `used_at` (timestamptz, nullable) - when code was used
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `codes` table
    - Add policy for users to read codes they purchased
    - Add policy for admins to manage all codes
*/

CREATE TABLE IF NOT EXISTS codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid REFERENCES plans(id) ON DELETE CASCADE NOT NULL,
  code text UNIQUE NOT NULL,
  is_used boolean DEFAULT false,
  used_by uuid REFERENCES users(id) ON DELETE SET NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE codes ENABLE ROW LEVEL SECURITY;

-- Users can only see codes they have purchased
CREATE POLICY "Users can read own codes"
  ON codes
  FOR SELECT
  TO authenticated
  USING (used_by::text = auth.uid()::text);

-- Admins can manage all codes
CREATE POLICY "Admins can manage codes"
  ON codes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND type = 'admin'
    )
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_codes_plan_id ON codes(plan_id);
CREATE INDEX IF NOT EXISTS idx_codes_used_by ON codes(used_by);
CREATE INDEX IF NOT EXISTS idx_codes_is_used ON codes(is_used);