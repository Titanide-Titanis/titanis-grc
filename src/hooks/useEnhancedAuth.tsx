import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

type UserRole = Database['public']['Enums']['user_role'];

interface RateLimitStatus {
  allowed: boolean;
  current_count: number;
  max_attempts: number;
  blocked_until?: string;
  window_minutes: number;
}

interface PasswordValidation {
  valid: boolean;
  score: number;
  issues: string[];
  strength: 'very_weak' | 'weak' | 'medium' | 'strong';
}

interface RBACPermission {
  allowed: boolean;
  reason: string;
  user_role: string;
  required_role: string;
  is_admin: boolean;
  resource_type?: string;
  action?: string;
}

export function useEnhancedAuth() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Rate limiting functions
  const checkRateLimit = useCallback(async (
    identifier: string,
    identifierType: 'email' | 'ip' = 'email',
    maxAttempts: number = 5,
    windowMinutes: number = 15
  ): Promise<RateLimitStatus | null> => {
    try {
      const { data, error } = await supabase.rpc('check_rate_limit', {
        p_identifier: identifier,
        p_identifier_type: identifierType,
        p_max_attempts: maxAttempts,
        p_window_minutes: windowMinutes
      });

      if (error) {
        console.error('Rate limit check error:', error);
        return null;
      }

      return data as unknown as RateLimitStatus;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return null;
    }
  }, []);

  const recordRateLimitAttempt = useCallback(async (
    identifier: string,
    identifierType: 'email' | 'ip' = 'email',
    success: boolean = false
  ): Promise<void> => {
    try {
      const { error } = await supabase.rpc('record_rate_limit_attempt', {
        p_identifier: identifier,
        p_identifier_type: identifierType,
        p_success: success
      });

      if (error) {
        console.error('Rate limit recording error:', error);
      }
    } catch (error) {
      console.error('Rate limit recording failed:', error);
    }
  }, []);

  // Password validation functions
  const validatePasswordStrength = useCallback(async (
    password: string,
    minLength: number = 12,
    requireUppercase: boolean = true,
    requireLowercase: boolean = true,
    requireNumbers: boolean = true,
    requireSymbols: boolean = true
  ): Promise<PasswordValidation | null> => {
    try {
      const { data, error } = await supabase.rpc('validate_password_strength', {
        p_password: password,
        p_min_length: minLength,
        p_require_uppercase: requireUppercase,
        p_require_lowercase: requireLowercase,
        p_require_numbers: requireNumbers,
        p_require_symbols: requireSymbols
      });

      if (error) {
        console.error('Password validation error:', error);
        return null;
      }

      return data as unknown as PasswordValidation;
    } catch (error) {
      console.error('Password validation failed:', error);
      return null;
    }
  }, []);

  const checkLeakedPassword = useCallback(async (password: string): Promise<boolean> => {
    try {
      // Hash the password using SHA-1 for HaveIBeenPwned API
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);
      
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await response.text();
      
      // Check if our hash suffix is in the response
      return text.includes(suffix);
    } catch (error) {
      console.error('Leaked password check failed:', error);
      // If the check fails, we assume the password is safe to avoid blocking users
      return false;
    }
  }, []);

  // RBAC functions
  const checkRBACPermission = useCallback(async (
    requiredRole: UserRole,
    resourceType?: string,
    action?: string
  ): Promise<RBACPermission | null> => {
    if (!user || !profile?.organization_id) {
      return {
        allowed: false,
        reason: 'user_not_authenticated',
        user_role: 'user' as UserRole,
        required_role: requiredRole,
        is_admin: false,
        resource_type: resourceType,
        action: action
      };
    }

    try {
      const { data, error } = await supabase.rpc('check_rbac_permission', {
        p_user_id: user.id,
        p_organization_id: profile.organization_id,
        p_required_role: requiredRole,
        p_resource_type: resourceType,
        p_action: action
      });

      if (error) {
        console.error('RBAC check error:', error);
        return null;
      }

      return data as unknown as RBACPermission;
    } catch (error) {
      console.error('RBAC check failed:', error);
      return null;
    }
  }, [user, profile]);

  // Auth event logging
  const logAuthEvent = useCallback(async (
    eventType: string,
    success: boolean = true,
    metadata?: any,
    failureReason?: string
  ): Promise<void> => {
    try {
      const userAgent = navigator.userAgent;
      const additionalContext = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer,
        ...metadata
      };

      // Log to auth_audit_logs
      const { error: auditError } = await supabase
        .from('auth_audit_logs')
        .insert({
          event_type: eventType,
          user_id: user?.id || null,
          success,
          metadata: additionalContext,
          user_agent: userAgent,
          organization_id: profile?.organization_id || null,
          risk_score: success ? 0 : 25,
          additional_context: {
            failure_reason: failureReason,
            ...additionalContext
          }
        });

      if (auditError) {
        console.error('Auth audit logging error:', auditError);
      }

      // Log to enhanced_auth_attempts if it's an auth attempt
      if (['login', 'password_reset', 'otp', 'registration'].includes(eventType)) {
        const { error: attemptError } = await supabase
          .from('enhanced_auth_attempts')
          .insert({
            email: user?.email || metadata?.email || 'unknown',
            ip_address: '127.0.0.1', // Would need to get real IP from server
            user_agent: userAgent,
            attempt_type: eventType,
            success,
            failure_reason: failureReason,
            organization_id: profile?.organization_id || null,
            risk_score: success ? 0 : 25,
            additional_data: additionalContext
          });

        if (attemptError) {
          console.error('Enhanced auth attempt logging error:', attemptError);
        }
      }
    } catch (error) {
      console.error('Auth event logging failed:', error);
    }
  }, [user, profile]);

  // Enhanced sign in with security checks
  const enhancedSignIn = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; rateLimited?: boolean }> => {
    setIsLoading(true);
    
    try {
      // Check rate limiting first
      const rateLimitStatus = await checkRateLimit(email, 'email');
      if (rateLimitStatus && !rateLimitStatus.allowed) {
        await logAuthEvent('login', false, { email }, 'rate_limited');
        setIsLoading(false);
        return {
          success: false,
          error: 'Too many failed attempts. Please try again later.',
          rateLimited: true
        };
      }

      // Attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      const success = !error && !!data.user;

      // Record the attempt for rate limiting
      await recordRateLimitAttempt(email, 'email', success);

      // Log the event
      await logAuthEvent('login', success, { email }, error?.message);

      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        return { success: true };
      } else {
        return {
          success: false,
          error: error?.message || 'Sign in failed'
        };
      }
    } catch (error: any) {
      await recordRateLimitAttempt(email, 'email', false);
      await logAuthEvent('login', false, { email }, error?.message);
      return {
        success: false,
        error: error?.message || 'An unexpected error occurred'
      };
    } finally {
      setIsLoading(false);
    }
  }, [checkRateLimit, recordRateLimitAttempt, logAuthEvent, toast]);

  // Enhanced sign up with password validation
  const enhancedSignUp = useCallback(async (
    email: string,
    password: string,
    metadata?: any
  ): Promise<{ success: boolean; error?: string; passwordIssues?: string[] }> => {
    setIsLoading(true);

    try {
      // Validate password strength
      const passwordValidation = await validatePasswordStrength(password);
      if (passwordValidation && !passwordValidation.valid) {
        await logAuthEvent('registration', false, { email }, 'weak_password');
        setIsLoading(false);
        return {
          success: false,
          error: 'Password does not meet security requirements',
          passwordIssues: passwordValidation.issues
        };
      }

      // Check for leaked password
      const isLeaked = await checkLeakedPassword(password);
      if (isLeaked) {
        await logAuthEvent('registration', false, { email }, 'leaked_password');
        setIsLoading(false);
        return {
          success: false,
          error: 'This password has been found in data breaches. Please choose a different password.',
          passwordIssues: ['Password found in known data breaches']
        };
      }

      // Attempt sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      const success = !error && !!data.user;
      await logAuthEvent('registration', success, { email }, error?.message);

      if (success) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        return { success: true };
      } else {
        return {
          success: false,
          error: error?.message || 'Sign up failed'
        };
      }
    } catch (error: any) {
      await logAuthEvent('registration', false, { email }, error?.message);
      return {
        success: false,
        error: error?.message || 'An unexpected error occurred'
      };
    } finally {
      setIsLoading(false);
    }
  }, [validatePasswordStrength, checkLeakedPassword, logAuthEvent, toast]);

  // Session management
  const revalidateSession = useCallback(async (): Promise<boolean> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session || !user) {
        return false;
      }

      // Check if user's role has changed
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role, organization_id')
        .eq('id', user.id)
        .single();

      if (currentProfile && profile) {
        if (currentProfile.role !== profile.role) {
          // Role has changed, force a session refresh
          await supabase.auth.refreshSession();
          toast({
            title: "Role Updated",
            description: "Your permissions have been updated. Please refresh the page.",
            variant: "destructive"
          });
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Session revalidation failed:', error);
      return false;
    }
  }, [user, profile, toast]);

  return {
    // State
    isLoading,
    
    // Rate limiting
    checkRateLimit,
    recordRateLimitAttempt,
    
    // Password validation
    validatePasswordStrength,
    checkLeakedPassword,
    
    // RBAC
    checkRBACPermission,
    
    // Enhanced auth methods
    enhancedSignIn,
    enhancedSignUp,
    
    // Session management
    revalidateSession,
    
    // Logging
    logAuthEvent
  };
}