-- Fix security warnings: Set search_path for all functions

-- Update existing functions with proper search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.get_current_user_organization()
RETURNS UUID AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.user_has_admin_role()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role])
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.check_organization_access(target_org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT target_org_id = public.get_current_user_organization() 
  OR public.user_has_admin_role();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = 'public';

-- Update the existing update_updated_at_column function with search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Update the existing handle_new_user function with search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';