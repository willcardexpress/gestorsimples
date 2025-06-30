/*
  # Create purchases table

  1. New Tables
    - `purchases`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to users)
      - `plan_id` (uuid, foreign key to plans)
      - `code_id` (uuid, foreign key to codes)
      - `amount` (decimal) - purchase amount
      - `points_earned` (integer) - points earned from purchase
      - `status` (text) - purchase status
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `purchases` table
    - Add policy for users to read their own purchases
    - Add policy for admins to read all purchases
*/

CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES plans(id) ON DELETE CASCADE NOT NULL,
  code_id uuid REFERENCES codes(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10,2) NOT NULL,
  points_earned integer NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('completed', 'pending', 'failed')) DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Users can read their own purchases
CREATE POLICY "Users can read own purchases"
  ON purchases
  FOR SELECT
  TO authenticated
  USING (client_id::text = auth.uid()::text);

-- Admins can read all purchases
CREATE POLICY "Admins can read all purchases"
  ON purchases
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND type = 'admin'
    )
  );

-- Admins can create purchases (for manual processing)
CREATE POLICY "Admins can create purchases"
  ON purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text 
      AND type = 'admin'
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_purchases_client_id ON purchases(client_id);
CREATE INDEX IF NOT EXISTS idx_purchases_plan_id ON purchases(plan_id);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at DESC);