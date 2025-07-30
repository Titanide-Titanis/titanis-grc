import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  WizardType,
  WizardSessionData,
  WizardResultData,
  createWizardSession,
  updateWizardSession,
  completeWizardSession,
  cancelWizardSession,
  sendWizardCompletionEmail,
  createCompletionNotification,
} from '@/utils/wizardSessionApi';

export const useWizardSession = () => {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile } = useAuth();

  const createSession = useCallback(async (
    wizardType: WizardType,
    initialData?: WizardSessionData
  ): Promise<string | null> => {
    if (!user || !profile?.organization_id) {
      console.error('User not authenticated or missing organization');
      return null;
    }

    setIsLoading(true);
    try {
      const data = await createWizardSession(user.id, profile.organization_id, wizardType, initialData);
      setCurrentSessionId(data.id);
      return data.id;
    } catch (error) {
      console.error('Failed to create wizard session:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, profile]);

  const updateSessionProgress = useCallback(async (
    sessionId: string,
    sessionData: WizardSessionData
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await updateWizardSession(sessionId, sessionData);
      return true;
    } catch (error) {
      console.error('Failed to update wizard session:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeSession = useCallback(async (
    sessionId: string,
    resultData: WizardResultData,
    summary?: string
  ): Promise<boolean> => {
    if (!user || !profile) {
      console.error('User not authenticated');
      return false;
    }

    setIsLoading(true);
    try {
      // Add completion context
      const enhancedResultData: WizardResultData = {
        ...resultData,
        completionMetrics: {
          ...resultData.completionMetrics,
          endTimestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        },
        context: {
          ...resultData.context,
          browserInfo: navigator.userAgent,
          deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
          userRole: profile.role || 'user',
        },
      };

      const data = await completeWizardSession(sessionId, enhancedResultData, summary);

      // Create notification and send email
      if (user?.email && profile?.organization_id) {
        await createCompletionNotification(user.id, profile.organization_id, data.wizard_type, summary || 'Wizard completed successfully', sessionId);
        await sendWizardCompletionEmail(user.email, user.id, profile.organization_id, data.wizard_type, profile.first_name || user.email, summary || 'Wizard completed successfully', sessionId);
      }

      setCurrentSessionId(null);
      return true;
    } catch (error) {
      console.error('Failed to complete wizard session:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, profile]);

  const cancelSession = useCallback(async (
    sessionId: string,
    reason?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      await cancelWizardSession(sessionId, reason);
      setCurrentSessionId(null);
      return true;
    } catch (error) {
      console.error('Failed to cancel wizard session:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    currentSessionId,
    isLoading,
    createSession,
    updateSessionProgress,
    completeSession,
    cancelSession,
  };
};