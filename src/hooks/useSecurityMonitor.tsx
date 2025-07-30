import { useCallback } from 'react';
import { useEnhancedAuth } from './useEnhancedAuth';
import { useEnhancedNotifications } from './useEnhancedNotifications';
import { useAuth } from './useAuth';

interface SecurityEvent {
  type: 'failed_login' | 'password_breach' | 'account_locked' | 'suspicious_activity' | 'role_changed' | 'unauthorized_access';
  details: string;
  metadata?: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function useSecurityMonitor() {
  const { logAuthEvent } = useEnhancedAuth();
  const { createSecurityAlert, notifyAdmins } = useEnhancedNotifications();
  const { user, profile } = useAuth();

  // Monitor and log security events
  const reportSecurityEvent = useCallback(async (event: SecurityEvent): Promise<void> => {
    try {
      // Log the security event
      await logAuthEvent(
        `security_${event.type}`,
        false,
        {
          security_event: true,
          event_type: event.type,
          severity: event.severity,
          details: event.details,
          ...event.metadata
        },
        event.details
      );

      // Create notification for the user
      await createSecurityAlert(event.type, event.details, event.metadata);

      // Notify admins for high/critical severity events
      if (event.severity === 'high' || event.severity === 'critical') {
        await notifyAdmins(
          `Security Alert: ${event.type.replace('_', ' ').toUpperCase()}`,
          `User: ${user?.email || 'Unknown'}\nDetails: ${event.details}`,
          'security_alert',
          {
            affected_user: user?.email,
            event_type: event.type,
            severity: event.severity,
            ...event.metadata
          }
        );
      }
    } catch (error) {
      console.error('Failed to report security event:', error);
    }
  }, [logAuthEvent, createSecurityAlert, notifyAdmins, user]);

  // Monitor failed login attempts
  const monitorFailedLogin = useCallback(async (
    email: string,
    attemptCount: number,
    blockedUntil?: string
  ): Promise<void> => {
    let severity: SecurityEvent['severity'] = 'low';
    let details = `Failed login attempt for ${email}`;

    if (attemptCount >= 10) {
      severity = 'high';
      details = `High number of failed login attempts (${attemptCount}) for ${email}`;
    } else if (attemptCount >= 5) {
      severity = 'medium';
      details = `Multiple failed login attempts (${attemptCount}) for ${email}`;
    }

    if (blockedUntil) {
      severity = 'high';
      details += `. Account temporarily blocked until ${new Date(blockedUntil).toLocaleString()}`;
    }

    await reportSecurityEvent({
      type: 'failed_login',
      details,
      severity,
      metadata: {
        email,
        attempt_count: attemptCount,
        blocked_until: blockedUntil,
        timestamp: new Date().toISOString()
      }
    });
  }, [reportSecurityEvent]);

  // Monitor password breach detection
  const monitorPasswordBreach = useCallback(async (email: string): Promise<void> => {
    await reportSecurityEvent({
      type: 'password_breach',
      details: `Password for ${email} was found in known data breaches`,
      severity: 'critical',
      metadata: {
        email,
        timestamp: new Date().toISOString(),
        action_required: 'immediate_password_change'
      }
    });
  }, [reportSecurityEvent]);

  // Monitor role changes
  const monitorRoleChange = useCallback(async (
    targetEmail: string,
    oldRole: string,
    newRole: string,
    changedBy: string
  ): Promise<void> => {
    const severity: SecurityEvent['severity'] = newRole === 'super_admin' || newRole === 'admin' ? 'high' : 'medium';
    
    await reportSecurityEvent({
      type: 'role_changed',
      details: `User role changed from ${oldRole} to ${newRole} for ${targetEmail}`,
      severity,
      metadata: {
        target_email: targetEmail,
        old_role: oldRole,
        new_role: newRole,
        changed_by: changedBy,
        timestamp: new Date().toISOString()
      }
    });
  }, [reportSecurityEvent]);

  // Monitor unauthorized access attempts
  const monitorUnauthorizedAccess = useCallback(async (
    resource: string,
    action: string,
    userRole: string,
    requiredRole: string
  ): Promise<void> => {
    await reportSecurityEvent({
      type: 'unauthorized_access',
      details: `Unauthorized access attempt to ${resource} (${action}). User role: ${userRole}, Required: ${requiredRole}`,
      severity: 'medium',
      metadata: {
        resource,
        action,
        user_role: userRole,
        required_role: requiredRole,
        user_email: user?.email,
        timestamp: new Date().toISOString()
      }
    });
  }, [reportSecurityEvent, user]);

  // Monitor suspicious activity patterns
  const monitorSuspiciousActivity = useCallback(async (
    activityType: string,
    details: string,
    metadata?: any
  ): Promise<void> => {
    await reportSecurityEvent({
      type: 'suspicious_activity',
      details: `Suspicious activity detected: ${activityType}. ${details}`,
      severity: 'medium',
      metadata: {
        activity_type: activityType,
        user_email: user?.email,
        organization_id: profile?.organization_id,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    });
  }, [reportSecurityEvent, user, profile]);

  return {
    reportSecurityEvent,
    monitorFailedLogin,
    monitorPasswordBreach,
    monitorRoleChange,
    monitorUnauthorizedAccess,
    monitorSuspiciousActivity
  };
}