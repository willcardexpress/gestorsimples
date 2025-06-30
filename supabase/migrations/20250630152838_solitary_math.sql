/*
  # Fix RLS infinite recursion on users table

  1. Problem
    - The "Admins can read all users" policy creates infinite recursion
    - It queries the users table within a policy that's already running on the users table
  
  2. Solution
    - Drop the problematic admin policy
    - Keep the simple "Users can manage own data" policy
    - Admin functionality will be handled at the application level
  
  3. Security
    - Users can only read/modify their own data
    - Admin checks will be done in application logic after authentication
*/

-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- Keep the simple, non-recursive policy for users to manage their own data
-- This policy is already in place: "Users can manage own data"
-- It uses: ((uid())::text = (id)::text) which doesn't cause recursion

-- Ensure the users table has RLS enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verify the remaining policy exists (create if not)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can manage own data'
    ) THEN
        CREATE POLICY "Users can manage own data"
            ON users
            FOR ALL
            TO authenticated
            USING ((uid())::text = (id)::text);
    END IF;
END $$;