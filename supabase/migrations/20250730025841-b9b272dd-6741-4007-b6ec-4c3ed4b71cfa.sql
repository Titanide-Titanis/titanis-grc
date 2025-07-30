-- Phase 1: Enhance notifications table for wizard session tracking
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS wizard_session_id UUID REFERENCES public.wizard_sessions(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_notifications_wizard_session_id ON public.notifications(wizard_session_id);

-- Phase 1: Add additional fields to auth_audit_logs for enhanced security tracking
ALTER TABLE public.auth_audit_logs 
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS organization_id UUID,
ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS additional_context JSONB DEFAULT '{}'::jsonb;

-- Phase 1: Create failed login tracking table with enhanced fields
CREATE TABLE IF NOT EXISTS public.enhanced_auth_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  attempt_type TEXT NOT NULL, -- 'login', 'password_reset', 'otp', 'registration'
  success BOOLEAN NOT NULL DEFAULT false,
  failure_reason TEXT,
  organization_id UUID,
  risk_score INTEGER DEFAULT 0,
  additional_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on enhanced_auth_attempts
ALTER TABLE public.enhanced_auth_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy for enhanced_auth_attempts
DROP POLICY IF EXISTS "Admins can view auth attempts" ON public.enhanced_auth_attempts;
CREATE POLICY "Admins can view auth attempts" 
ON public.enhanced_auth_attempts 
FOR SELECT 
USING (
  organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role])
  )
);

-- Phase 1: Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limit_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- email or IP
  identifier_type TEXT NOT NULL, -- 'email' or 'ip'
  attempt_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rate_limit_attempts
ALTER TABLE public.rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- Create policy for rate_limit_attempts
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limit_attempts;
CREATE POLICY "System can manage rate limits" 
ON public.rate_limit_attempts 
FOR ALL 
USING (true);

-- Add index for rate limiting lookups
CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier ON public.rate_limit_attempts(identifier, identifier_type);
CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON public.rate_limit_attempts(window_start);

-- Phase 1: Create password reset tokens table for proper invalidation
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on password_reset_tokens
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy for password_reset_tokens
DROP POLICY IF EXISTS "Users can access their own reset tokens" ON public.password_reset_tokens;
CREATE POLICY "Users can access their own reset tokens" 
ON public.password_reset_tokens 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

-- Add index for token lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_hash ON public.password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user ON public.password_reset_tokens(user_id);

-- Phase 1: Create OTP tokens table for proper invalidation
CREATE TABLE IF NOT EXISTS public.otp_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  purpose TEXT NOT NULL -- 'login', 'verification', 'password_reset'
);

-- Enable RLS on otp_tokens
ALTER TABLE public.otp_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy for otp_tokens
DROP POLICY IF EXISTS "Users can access their own otp tokens" ON public.otp_tokens;
CREATE POLICY "Users can access their own otp tokens" 
ON public.otp_tokens 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

-- Add index for OTP lookups
CREATE INDEX IF NOT EXISTS idx_otp_tokens_hash ON public.otp_tokens(code_hash);
CREATE INDEX IF NOT EXISTS idx_otp_tokens_user ON public.otp_tokens(user_id);

-- Phase 3: Create session tracking for role revalidation (fixed column name)
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  role_at_login user_role NOT NULL,
  user_role user_role NOT NULL, -- renamed from current_role to avoid reserved keyword
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  invalidated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for user_sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.user_sessions;
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;
CREATE POLICY "Admins can view all sessions" 
ON public.user_sessions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role])
  )
);

-- Add indexes for session management
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_activity ON public.user_sessions(last_activity);