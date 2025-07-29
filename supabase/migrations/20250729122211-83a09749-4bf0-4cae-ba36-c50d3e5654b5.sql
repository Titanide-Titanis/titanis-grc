-- Phase 1: Fix RLS Infinite Recursion and Security Settings

-- 1. Create security definer functions to break RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_current_user_organization()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.user_has_admin_role()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role])
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- 2. Drop existing problematic RLS policies on profiles table
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON public.profiles;

-- 3. Create new RLS policies using security definer functions
CREATE POLICY "Users can view profiles in their organization" 
ON public.profiles 
FOR SELECT 
USING (
  organization_id = public.get_current_user_organization() 
  OR public.user_has_admin_role()
);

-- 4. Seed auth_settings table with proper defaults for each organization
INSERT INTO public.auth_settings (
  organization_id,
  max_login_attempts,
  lockout_duration_minutes,
  enable_captcha_after_attempts,
  password_min_length,
  require_uppercase,
  require_lowercase,
  require_numbers,
  require_symbols,
  enable_leaked_password_check,
  otp_expiry_seconds
)
SELECT 
  id as organization_id,
  3 as max_login_attempts,
  15 as lockout_duration_minutes,
  2 as enable_captcha_after_attempts,
  12 as password_min_length,
  true as require_uppercase,
  true as require_lowercase,
  true as require_numbers,
  true as require_symbols,
  true as enable_leaked_password_check,
  300 as otp_expiry_seconds  -- 5 minutes (300 seconds)
FROM public.organizations
WHERE NOT EXISTS (
  SELECT 1 FROM public.auth_settings 
  WHERE auth_settings.organization_id = organizations.id
);

-- 5. Update RLS policies for better organization access control
CREATE OR REPLACE FUNCTION public.check_organization_access(target_org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT target_org_id = public.get_current_user_organization() 
  OR public.user_has_admin_role();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;