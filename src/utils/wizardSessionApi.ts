import { supabase } from '@/integrations/supabase/client';

export type WizardType = 'audit' | 'compliance' | 'incident' | 'policy' | 'risk' | 'vendor';
export type WizardStatus = 'in_progress' | 'completed' | 'cancelled' | 'failed';

export interface WizardSessionData {
  [key: string]: any;
  currentStep?: number;
  stepData?: Record<string, any>;
  formData?: Record<string, any>;
}

export interface WizardResultData {
  [key: string]: any;
  formInputs?: Record<string, any>;
  completionMetrics?: {
    totalSteps: number;
    completedSteps: number;
    startTimestamp: string;
    endTimestamp: string;
    userAgent: string;
    ipAddress?: string;
  };
  generatedArtifacts?: {
    reportUrls?: string[];
    pdfIds?: string[];
    summaries?: string[];
  };
  outcomeStatus: 'success' | 'fail' | 'partial';
  context?: {
    browserInfo: string;
    deviceType: string;
    userRole: string;
  };
}

export const createWizardSession = async (
  userId: string,
  organizationId: string,
  wizardType: WizardType,
  initialData?: WizardSessionData
) => {
  const { data, error } = await supabase
    .from('wizard_sessions')
    .insert({
      user_id: userId,
      organization_id: organizationId,
      wizard_type: wizardType,
      status: 'in_progress',
      session_data: initialData || {},
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateWizardSession = async (
  sessionId: string,
  sessionData: WizardSessionData
) => {
  const { error } = await supabase
    .from('wizard_sessions')
    .update({
      session_data: sessionData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) throw error;
  return true;
};

export const completeWizardSession = async (
  sessionId: string,
  resultData: WizardResultData,
  summary?: string
) => {
  const { data, error } = await supabase
    .from('wizard_sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      result_data: resultData,
      summary: summary || 'Wizard completed successfully',
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const cancelWizardSession = async (
  sessionId: string,
  reason?: string
) => {
  const { error } = await supabase
    .from('wizard_sessions')
    .update({
      status: 'cancelled',
      summary: reason || 'Wizard cancelled by user',
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) throw error;
  return true;
};

export const sendWizardCompletionEmail = async (
  userEmail: string,
  userId: string,
  organizationId: string,
  wizardType: string,
  userName: string,
  summary: string,
  sessionId: string
) => {
  try {
    await supabase.functions.invoke('send-email', {
      body: {
        to: userEmail,
        subject: `${wizardType.charAt(0).toUpperCase() + wizardType.slice(1)} Wizard Completed`,
        template: 'wizard_completion',
        templateData: {
          wizardType: wizardType.charAt(0).toUpperCase() + wizardType.slice(1),
          userName: userName,
          completionSummary: summary,
          resultUrl: `${window.location.origin}/dashboard?session=${sessionId}`,
        },
        userId: userId,
        organizationId: organizationId,
      },
    });
  } catch (error) {
    console.error('Failed to send completion email:', error);
  }
};

export const createCompletionNotification = async (
  userId: string,
  organizationId: string,
  wizardType: string,
  summary: string,
  sessionId: string
) => {
  try {
    const wizardDisplayNames: Record<string, string> = {
      'risk': 'Risk Assessment',
      'compliance': 'Compliance Assessment', 
      'audit': 'Audit Setup',
      'incident': 'Incident Report',
      'policy': 'Policy Creation',
      'vendor': 'Vendor Onboarding'
    };

    const displayName = wizardDisplayNames[wizardType] || wizardType.charAt(0).toUpperCase() + wizardType.slice(1);

    await supabase.from('notifications').insert({
      user_id: userId,
      organization_id: organizationId,
      type: 'wizard_completion',
      title: `${displayName} Completed`,
      message: summary || `Your ${displayName.toLowerCase()} has been successfully completed and saved.`,
      priority: 'normal',
      wizard_session_id: sessionId, // Link to wizard session
      data: {
        wizard_session_id: sessionId,
        wizard_type: wizardType,
        completion_time: new Date().toISOString(),
        completion_summary: summary,
        result_url: `${window.location.origin}/dashboard?session=${sessionId}`,
      },
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};