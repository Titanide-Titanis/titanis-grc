-- Phase 1: Enhance notifications table for wizard session tracking
ALTER TABLE public.notifications 
ADD COLUMN wizard_session_id UUID REFERENCES public.wizard_sessions(id) ON DELETE SET NULL;

-- Add index for performance
CREATE INDEX idx_notifications_wizard_session_id ON public.notifications(wizard_session_id);

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
CREATE POLICY "System can manage rate limits" 
ON public.rate_limit_attempts 
FOR ALL 
USING (true);

-- Add index for rate limiting lookups
CREATE INDEX idx_rate_limit_identifier ON public.rate_limit_attempts(identifier, identifier_type);
CREATE INDEX idx_rate_limit_window ON public.rate_limit_attempts(window_start);

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
CREATE POLICY "Users can access their own reset tokens" 
ON public.password_reset_tokens 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

-- Add index for token lookups
CREATE INDEX idx_password_reset_tokens_hash ON public.password_reset_tokens(token_hash);
CREATE INDEX idx_password_reset_tokens_user ON public.password_reset_tokens(user_id);

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
CREATE POLICY "Users can access their own otp tokens" 
ON public.otp_tokens 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

-- Add index for OTP lookups
CREATE INDEX idx_otp_tokens_hash ON public.otp_tokens(code_hash);
CREATE INDEX idx_otp_tokens_user ON public.otp_tokens(user_id);

-- Phase 3: Create session tracking for role revalidation
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  role_at_login user_role NOT NULL,
  current_role user_role NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  invalidated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for user_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.user_sessions 
FOR SELECT 
USING (auth.uid()::text = user_id::text);

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
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_user ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_activity ON public.user_sessions(last_activity);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark expired sessions as invalidated
  UPDATE public.user_sessions 
  SET invalidated_at = now() 
  WHERE expires_at < now() 
  AND invalidated_at IS NULL;
  
  -- Clean up old rate limit entries (older than 24 hours)
  DELETE FROM public.rate_limit_attempts 
  WHERE created_at < now() - INTERVAL '24 hours';
  
  -- Clean up used/expired password reset tokens (older than 7 days)
  DELETE FROM public.password_reset_tokens 
  WHERE (used_at IS NOT NULL OR expires_at < now()) 
  AND created_at < now() - INTERVAL '7 days';
  
  -- Clean up used/expired OTP tokens (older than 1 day)
  DELETE FROM public.otp_tokens 
  WHERE (used_at IS NOT NULL OR expires_at < now()) 
  AND created_at < now() - INTERVAL '1 day';
END;
$$;

-- Create function to check rate limiting
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_identifier_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_count INTEGER;
  v_blocked_until TIMESTAMP WITH TIME ZONE;
  v_window_start TIMESTAMP WITH TIME ZONE;
BEGIN
  v_window_start := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Get current attempt count in window
  SELECT COALESCE(SUM(attempt_count), 0)
  INTO v_current_count
  FROM public.rate_limit_attempts
  WHERE identifier = p_identifier
    AND identifier_type = p_identifier_type
    AND window_start > v_window_start;
  
  -- Check if currently blocked
  SELECT blocked_until
  INTO v_blocked_until
  FROM public.rate_limit_attempts
  WHERE identifier = p_identifier
    AND identifier_type = p_identifier_type
    AND blocked_until > now()
  ORDER BY blocked_until DESC
  LIMIT 1;
  
  -- Return status
  RETURN jsonb_build_object(
    'allowed', v_current_count < p_max_attempts AND v_blocked_until IS NULL,
    'current_count', v_current_count,
    'max_attempts', p_max_attempts,
    'blocked_until', v_blocked_until,
    'window_minutes', p_window_minutes
  );
END;
$$;

-- Create function to record rate limit attempt
CREATE OR REPLACE FUNCTION public.record_rate_limit_attempt(
  p_identifier TEXT,
  p_identifier_type TEXT,
  p_success BOOLEAN DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_attempt_count INTEGER;
  v_block_duration INTEGER;
BEGIN
  -- Insert or update rate limit attempt
  INSERT INTO public.rate_limit_attempts (identifier, identifier_type, attempt_count)
  VALUES (p_identifier, p_identifier_type, 1)
  ON CONFLICT (identifier, identifier_type) 
  DO UPDATE SET 
    attempt_count = rate_limit_attempts.attempt_count + 1,
    updated_at = now();
  
  -- If failed attempt, check if we need to block
  IF NOT p_success THEN
    SELECT attempt_count INTO v_attempt_count
    FROM public.rate_limit_attempts
    WHERE identifier = p_identifier AND identifier_type = p_identifier_type;
    
    -- Progressive blocking: 5 attempts = 15 min, 10 = 1 hour, 15+ = 24 hours
    IF v_attempt_count >= 15 THEN
      v_block_duration := 24 * 60; -- 24 hours
    ELSIF v_attempt_count >= 10 THEN
      v_block_duration := 60; -- 1 hour
    ELSIF v_attempt_count >= 5 THEN
      v_block_duration := 15; -- 15 minutes
    END IF;
    
    -- Apply block if needed
    IF v_block_duration IS NOT NULL THEN
      UPDATE public.rate_limit_attempts
      SET blocked_until = now() + (v_block_duration || ' minutes')::INTERVAL
      WHERE identifier = p_identifier AND identifier_type = p_identifier_type;
    END IF;
  ELSE
    -- Success - reset the counter
    DELETE FROM public.rate_limit_attempts
    WHERE identifier = p_identifier AND identifier_type = p_identifier_type;
  END IF;
END;
$$;