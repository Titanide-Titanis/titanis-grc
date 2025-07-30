import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface EnhancedNotification {
  id: string;
  title: string;
  message?: string;
  type: string;
  priority: 'normal' | 'high' | 'urgent';
  read_status: boolean;
  read_at?: string;
  created_at: string;
  data: any;
  wizard_session_id?: string;
  user_id: string;
  organization_id?: string;
}

interface CreateNotificationParams {
  title: string;
  message?: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'wizard_completion' | 'security_alert' | 'system';
  priority?: 'normal' | 'high' | 'urgent';
  data?: any;
  wizardSessionId?: string;
  targetUserId?: string;
}

export function useEnhancedNotifications() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Create notification
  const createNotification = useCallback(async (params: CreateNotificationParams): Promise<boolean> => {
    if (!user || !profile?.organization_id) {
      console.error('User not authenticated or no organization');
      return false;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: params.title,
          message: params.message,
          type: params.type,
          priority: params.priority || 'normal',
          data: params.data || {},
          wizard_session_id: params.wizardSessionId || null,
          user_id: params.targetUserId || user.id,
          organization_id: profile.organization_id,
          read_status: false
        });

      if (error) {
        console.error('Failed to create notification:', error);
        return false;
      }

      // Show toast for high priority notifications
      if (params.priority === 'high' || params.priority === 'urgent') {
        toast({
          title: params.title,
          description: params.message,
          variant: params.type === 'error' || params.type === 'security_alert' ? 'destructive' : 'default'
        });
      }

      return true;
    } catch (error) {
      console.error('Notification creation failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, profile, toast]);

  // Create wizard completion notification
  const createWizardCompletionNotification = useCallback(async (
    wizardType: string,
    sessionId: string,
    summary?: string
  ): Promise<boolean> => {
    const wizardDisplayNames: Record<string, string> = {
      'risk': 'Risk Assessment',
      'compliance': 'Compliance Assessment', 
      'audit': 'Audit Setup',
      'incident': 'Incident Report',
      'policy': 'Policy Creation',
      'vendor': 'Vendor Onboarding'
    };

    const displayName = wizardDisplayNames[wizardType] || wizardType;

    return await createNotification({
      title: `${displayName} Completed`,
      message: summary || `Your ${displayName.toLowerCase()} has been successfully completed and saved.`,
      type: 'wizard_completion',
      priority: 'normal',
      data: {
        wizard_type: wizardType,
        completion_summary: summary,
        timestamp: new Date().toISOString()
      },
      wizardSessionId: sessionId
    });
  }, [createNotification]);

  // Create security alert notification
  const createSecurityAlert = useCallback(async (
    alertType: string,
    details: string,
    metadata?: any
  ): Promise<boolean> => {
    const alertTitles: Record<string, string> = {
      'failed_login': 'Multiple Failed Login Attempts',
      'password_breach': 'Password Found in Data Breach',
      'account_locked': 'Account Temporarily Locked',
      'suspicious_activity': 'Suspicious Account Activity',
      'role_changed': 'Account Role Changed',
      'unauthorized_access': 'Unauthorized Access Attempt'
    };

    const title = alertTitles[alertType] || 'Security Alert';

    return await createNotification({
      title,
      message: details,
      type: 'security_alert',
      priority: 'high',
      data: {
        alert_type: alertType,
        metadata,
        timestamp: new Date().toISOString(),
        ip_address: metadata?.ip_address,
        user_agent: metadata?.user_agent
      }
    });
  }, [createNotification]);

  // Send notification to all organization admins
  const notifyAdmins = useCallback(async (
    title: string,
    message: string,
    type: 'info' | 'warning' | 'error' | 'security_alert' = 'info',
    data?: any
  ): Promise<boolean> => {
    if (!profile?.organization_id) {
      return false;
    }

    try {
      // Get all admin users in the organization
      const { data: adminProfiles, error } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('organization_id', profile.organization_id)
        .in('role', ['super_admin', 'admin']);

      if (error || !adminProfiles) {
        console.error('Failed to fetch admin users:', error);
        return false;
      }

      // Create notifications for all admins
      const promises = adminProfiles.map(admin =>
        createNotification({
          title,
          message,
          type,
          priority: type === 'security_alert' || type === 'error' ? 'high' : 'normal',
          data,
          targetUserId: admin.id
        })
      );

      const results = await Promise.all(promises);
      return results.every(success => success);
    } catch (error) {
      console.error('Failed to notify admins:', error);
      return false;
    }
  }, [profile, createNotification]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read_status: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Failed to mark notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Mark as read failed:', error);
      return false;
    }
  }, [user]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          read_status: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', user?.id)
        .eq('read_status', false);

      if (error) {
        console.error('Failed to mark all notifications as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Mark all as read failed:', error);
      return false;
    }
  }, [user]);

  // Get notifications with enhanced filtering
  const getNotifications = useCallback(async (
    filters?: {
      type?: string;
      priority?: string;
      read_status?: boolean;
      limit?: number;
    }
  ): Promise<EnhancedNotification[]> => {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.read_status !== undefined) {
        query = query.eq('read_status', filters.read_status);
      }
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch notifications:', error);
        return [];
      }

      return data as EnhancedNotification[];
    } catch (error) {
      console.error('Get notifications failed:', error);
      return [];
    }
  }, [user]);

  return {
    isLoading,
    createNotification,
    createWizardCompletionNotification,
    createSecurityAlert,
    notifyAdmins,
    markAsRead,
    markAllAsRead,
    getNotifications
  };
}