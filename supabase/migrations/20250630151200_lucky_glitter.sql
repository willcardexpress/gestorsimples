/*
  # Create plans table

  1. New Tables
    - `plans`
      - `id` (uuid, primary key)
      - `name` (text) - plan name
      - `description` (text) - plan description
      - `price` (decimal) - plan price
      - `duration` (text) - plan duration
      - `features` (text[]) - plan features array
      - `points_reward` (integer) - points earned on purchase
      - `is_active` (boolean, default true) - plan availability
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `plans` table
    - Add policy for authenticated users to read active plans
    - Add policy for admins to manage all plans
*/

CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  duration text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  points_reward integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read active plans
CREATE POLICY "Users can read active plans"
  ON plans
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Admins can manage all plans
CREATE POLICY "Admins can manage plans"
  ON plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND type = 'admin'
    )
  );