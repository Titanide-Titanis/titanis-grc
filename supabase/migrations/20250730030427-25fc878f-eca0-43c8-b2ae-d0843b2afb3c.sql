-- Fix function security by setting search_path to public
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix function security by setting search_path to public
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_identifier_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix function security by setting search_path to public
CREATE OR REPLACE FUNCTION public.record_rate_limit_attempt(
  p_identifier TEXT,
  p_identifier_type TEXT,
  p_success BOOLEAN DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix function security by setting search_path to public
CREATE OR REPLACE FUNCTION public.validate_password_strength(
  p_password TEXT,
  p_min_length INTEGER DEFAULT 12,
  p_require_uppercase BOOLEAN DEFAULT true,
  p_require_lowercase BOOLEAN DEFAULT true,
  p_require_numbers BOOLEAN DEFAULT true,
  p_require_symbols BOOLEAN DEFAULT true
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_issues TEXT[] := '{}';
  v_score INTEGER := 0;
BEGIN
  -- Check minimum length
  IF length(p_password) < p_min_length THEN
    v_issues := array_append(v_issues, 'Password must be at least ' || p_min_length || ' characters long');
  ELSE
    v_score := v_score + 20;
  END IF;
  
  -- Check for uppercase letters
  IF p_require_uppercase AND p_password !~ '[A-Z]' THEN
    v_issues := array_append(v_issues, 'Password must contain at least one uppercase letter');
  ELSIF p_password ~ '[A-Z]' THEN
    v_score := v_score + 20;
  END IF;
  
  -- Check for lowercase letters
  IF p_require_lowercase AND p_password !~ '[a-z]' THEN
    v_issues := array_append(v_issues, 'Password must contain at least one lowercase letter');
  ELSIF p_password ~ '[a-z]' THEN
    v_score := v_score + 20;
  END IF;
  
  -- Check for numbers
  IF p_require_numbers AND p_password !~ '[0-9]' THEN
    v_issues := array_append(v_issues, 'Password must contain at least one number');
  ELSIF p_password ~ '[0-9]' THEN
    v_score := v_score + 20;
  END IF;
  
  -- Check for symbols
  IF p_require_symbols AND p_password !~ '[^A-Za-z0-9]' THEN
    v_issues := array_append(v_issues, 'Password must contain at least one special character');
  ELSIF p_password ~ '[^A-Za-z0-9]' THEN
    v_score := v_score + 20;
  END IF;
  
  -- Check for common weak patterns
  IF p_password ~* '(password|123456|qwerty|admin|letmein|welcome|login)' THEN
    v_issues := array_append(v_issues, 'Password contains common weak patterns');
    v_score := v_score - 30;
  END IF;
  
  -- Ensure score is not negative
  IF v_score < 0 THEN
    v_score := 0;
  END IF;
  
  RETURN jsonb_build_object(
    'valid', array_length(v_issues, 1) IS NULL,
    'score', v_score,
    'issues', v_issues,
    'strength', CASE 
      WHEN v_score >= 80 THEN 'strong'
      WHEN v_score >= 60 THEN 'medium'
      WHEN v_score >= 40 THEN 'weak'
      ELSE 'very_weak'
    END
  );
END;
$$;

-- Fix function security by setting search_path to public
CREATE OR REPLACE FUNCTION public.check_rbac_permission(
  p_user_id UUID,
  p_organization_id UUID,
  p_required_role user_role,
  p_resource_type TEXT DEFAULT NULL,
  p_action TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_role user_role;
  v_user_org_id UUID;
  v_is_admin BOOLEAN := false;
  v_has_permission BOOLEAN := false;
BEGIN
  -- Get user's role and organization
  SELECT role, organization_id 
  INTO v_user_role, v_user_org_id
  FROM public.profiles 
  WHERE id = p_user_id;
  
  -- Check if user exists
  IF v_user_role IS NULL THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'user_not_found',
      'user_role', NULL,
      'required_role', p_required_role
    );
  END IF;
  
  -- Check organization match (unless super_admin)
  IF v_user_role != 'super_admin' AND v_user_org_id != p_organization_id THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'organization_mismatch',
      'user_role', v_user_role,
      'required_role', p_required_role
    );
  END IF;
  
  -- Check if user is admin
  v_is_admin := v_user_role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role]);
  
  -- Role hierarchy check
  CASE v_user_role
    WHEN 'super_admin' THEN
      v_has_permission := true;
    WHEN 'admin' THEN
      v_has_permission := p_required_role != 'super_admin';
    WHEN 'compliance_officer' THEN
      v_has_permission := p_required_role = ANY(ARRAY['compliance_officer'::user_role, 'auditor'::user_role, 'user'::user_role]);
    WHEN 'risk_manager' THEN
      v_has_permission := p_required_role = ANY(ARRAY['risk_manager'::user_role, 'user'::user_role]);
    WHEN 'auditor' THEN
      v_has_permission := p_required_role = ANY(ARRAY['auditor'::user_role, 'user'::user_role]);
    WHEN 'user' THEN
      v_has_permission := p_required_role = 'user';
    WHEN 'viewer' THEN
      v_has_permission := false; -- Viewers have no modification permissions
    ELSE
      v_has_permission := false;
  END CASE;
  
  RETURN jsonb_build_object(
    'allowed', v_has_permission,
    'reason', CASE WHEN v_has_permission THEN 'authorized' ELSE 'insufficient_role' END,
    'user_role', v_user_role,
    'required_role', p_required_role,
    'is_admin', v_is_admin,
    'resource_type', p_resource_type,
    'action', p_action
  );
END;
$$;