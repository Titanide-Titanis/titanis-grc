-- TITANIS™ Authentication Security Enhancements
-- 1. Create audit logging table for authentication events
CREATE TABLE IF NOT EXISTS public.auth_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('login', 'logout', 'otp_request', 'otp_verify', 'password_reset', 'failed_login', 'account_locked')),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.auth_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own logs
CREATE POLICY "Users can view their own auth logs"
ON public.auth_audit_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for admins to view all logs
CREATE POLICY "Admins can view all auth logs"
ON public.auth_audit_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role])
  )
);

-- 2. Create authentication settings table for OTP configuration
CREATE TABLE IF NOT EXISTS public.auth_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  otp_expiry_seconds INTEGER NOT NULL DEFAULT 300, -- 5 minutes (reduced from default)
  max_login_attempts INTEGER NOT NULL DEFAULT 3,
  lockout_duration_minutes INTEGER NOT NULL DEFAULT 15,
  enable_captcha_after_attempts INTEGER NOT NULL DEFAULT 2,
  password_min_length INTEGER NOT NULL DEFAULT 12,
  require_uppercase BOOLEAN NOT NULL DEFAULT true,
  require_lowercase BOOLEAN NOT NULL DEFAULT true,
  require_numbers BOOLEAN NOT NULL DEFAULT true,
  require_symbols BOOLEAN NOT NULL DEFAULT true,
  enable_leaked_password_check BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.auth_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for organization members to view settings
CREATE POLICY "Organization members can view auth settings"
ON public.auth_settings
FOR SELECT
USING (
  organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
  )
);

-- Create policy for admins to manage settings
CREATE POLICY "Admins can manage auth settings"
ON public.auth_settings
FOR ALL
USING (
  organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role])
  )
);

-- 3. Create failed login attempts tracking
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  organization_id UUID
);

-- Enable RLS
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view failed attempts
CREATE POLICY "Admins can view failed login attempts"
ON public.failed_login_attempts
FOR SELECT
USING (
  organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role])
  )
);

-- 4. Add update trigger for auth_settings
CREATE TRIGGER update_auth_settings_updated_at
  BEFORE UPDATE ON public.auth_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_user_id ON public.auth_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_event_type ON public.auth_audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_audit_logs_created_at ON public.auth_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_email ON public.failed_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_ip ON public.failed_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_attempted_at ON public.failed_login_attempts(attempted_at);

-- 6. Insert default auth settings for existing organizations
INSERT INTO public.auth_settings (organization_id, otp_expiry_seconds, enable_leaked_password_check)
SELECT DISTINCT id, 300, true
FROM public.organizations
WHERE id NOT IN (SELECT organization_id FROM public.auth_settings);