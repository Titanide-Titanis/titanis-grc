// TITANIS™ Authentication Security Hook
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthSecuritySettings {
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  enableCaptchaAfterAttempts: number;
  passwordMinLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  enableLeakedPasswordCheck: boolean;
  otpExpirySeconds: number;
}

interface FailedAttempt {
  email: string;
  attempts: number;
  lastAttempt: Date;
  isLocked: boolean;
}

export function useAuthSecurity() {
  const [settings, setSettings] = useState<AuthSecuritySettings | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<Map<string, FailedAttempt>>(new Map());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAuthSettings();
  }, []);

  const loadAuthSettings = async () => {
    try {
      // Get current user's organization
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', user.user.id)
        .single();

      if (!profile?.organization_id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('auth_settings')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading auth settings:', error);
        return;
      }

      if (data) {
        setSettings({
          maxLoginAttempts: data.max_login_attempts,
          lockoutDurationMinutes: data.lockout_duration_minutes,
          enableCaptchaAfterAttempts: data.enable_captcha_after_attempts,
          passwordMinLength: data.password_min_length,
          requireUppercase: data.require_uppercase,
          requireLowercase: data.require_lowercase,
          requireNumbers: data.require_numbers,
          requireSymbols: data.require_symbols,
          enableLeakedPasswordCheck: data.enable_leaked_password_check,
          otpExpirySeconds: data.otp_expiry_seconds,
        });
      } else {
        // Set default settings if none found
        setSettings({
          maxLoginAttempts: 3,
          lockoutDurationMinutes: 15,
          enableCaptchaAfterAttempts: 2,
          passwordMinLength: 12,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSymbols: true,
          enableLeakedPasswordCheck: true,
          otpExpirySeconds: 300,
        });
      }
    } catch (error) {
      console.error('Error loading auth settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if password meets strength requirements
  const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
    if (!settings) return { isValid: true, errors: [] };

    const errors: string[] = [];

    if (password.length < settings.passwordMinLength) {
      errors.push(`Password must be at least ${settings.passwordMinLength} characters long`);
    }

    if (settings.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (settings.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (settings.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (settings.requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
      errors.push('Password must contain at least one symbol');
    }

    return { isValid: errors.length === 0, errors };
  };

  // Check for leaked passwords using HaveIBeenPwned API
  const checkLeakedPassword = async (password: string): Promise<boolean> => {
    if (!settings?.enableLeakedPasswordCheck) return false;

    try {
      // Hash the password using SHA-1 (as required by HaveIBeenPwned API)
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      // Use k-anonymity model - send only first 5 characters of hash
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);

      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await response.text();

      // Check if our password hash suffix appears in the response
      const lines = text.split('\n');
      for (const line of lines) {
        const [hashSuffix, count] = line.split(':');
        if (hashSuffix === suffix) {
          return true; // Password found in breach database
        }
      }

      return false; // Password not found in breach database
    } catch (error) {
      console.error('Error checking leaked password:', error);
      // If the service is unavailable, allow the password to prevent blocking users
      return false;
    }
  };

  // Track failed login attempts
  const recordFailedAttempt = async (email: string, ipAddress?: string, userAgent?: string) => {
    try {
      // Record in database
      const { error } = await supabase
        .from('failed_login_attempts')
        .insert({
          email,
          ip_address: ipAddress,
          user_agent: userAgent,
        });

      if (error) {
        console.error('Error recording failed attempt:', error);
      }

      // Update local state
      const current = failedAttempts.get(email) || {
        email,
        attempts: 0,
        lastAttempt: new Date(),
        isLocked: false,
      };

      current.attempts += 1;
      current.lastAttempt = new Date();

      if (settings && current.attempts >= settings.maxLoginAttempts) {
        current.isLocked = true;
        toast({
          title: "Account Temporarily Locked",
          description: `Too many failed attempts. Please try again in ${settings.lockoutDurationMinutes} minutes.`,
          variant: "destructive",
        });
      }

      setFailedAttempts(new Map(failedAttempts.set(email, current)));
    } catch (error) {
      console.error('Error recording failed attempt:', error);
    }
  };

  // Check if account is locked
  const isAccountLocked = (email: string): boolean => {
    const attempt = failedAttempts.get(email);
    if (!attempt || !attempt.isLocked || !settings) return false;

    const lockoutEnd = new Date(attempt.lastAttempt.getTime() + settings.lockoutDurationMinutes * 60000);
    if (new Date() > lockoutEnd) {
      // Lockout period has ended
      attempt.isLocked = false;
      attempt.attempts = 0;
      setFailedAttempts(new Map(failedAttempts.set(email, attempt)));
      return false;
    }

    return true;
  };

  // Check if CAPTCHA should be shown
  const shouldShowCaptcha = (email: string): boolean => {
    const attempt = failedAttempts.get(email);
    return settings ? (attempt?.attempts || 0) >= settings.enableCaptchaAfterAttempts : false;
  };

  // Clear failed attempts on successful login
  const clearFailedAttempts = (email: string) => {
    failedAttempts.delete(email);
    setFailedAttempts(new Map(failedAttempts));
  };

  // Log authentication events
  const logAuthEvent = async (eventType: string, userId?: string, metadata?: any) => {
    try {
      const { error } = await supabase
        .from('auth_audit_logs')
        .insert({
          user_id: userId,
          event_type: eventType,
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent,
          metadata: metadata || {},
        });

      if (error) {
        console.error('Error logging auth event:', error);
      }
    } catch (error) {
      console.error('Error logging auth event:', error);
    }
  };

  // Get client IP address (simplified - in production, use a proper service)
  const getClientIP = async (): Promise<string | null> => {
    try {
      // In a real application, you would get this from your server or a service
      // For now, return null as we can't reliably get the real IP from the client
      return null;
    } catch {
      return null;
    }
  };

  return {
    settings,
    loading,
    validatePasswordStrength,
    checkLeakedPassword,
    recordFailedAttempt,
    isAccountLocked,
    shouldShowCaptcha,
    clearFailedAttempts,
    logAuthEvent,
    failedAttempts: Array.from(failedAttempts.values()),
  };
}