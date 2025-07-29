
-- Drop the existing RLS policy that's causing the issue
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON public.profiles;

-- Create a new RLS policy that allows users to view their own profile AND profiles in their organization
CREATE POLICY "Users can view own profile and organization profiles" 
ON public.profiles 
FOR SELECT 
USING (
  id = auth.uid() OR 
  (organization_id = get_current_user_organization() AND organization_id IS NOT NULL) OR 
  user_has_admin_role()
);
