import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';
import { Resend } from 'npm:resend@4.0.0';
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { WizardCompletionEmail } from './_templates/wizard-completion.tsx';
import { CriticalAlertEmail } from './_templates/critical-alert.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendEmailRequest {
  to: string;
  subject: string;
  body?: string;
  template?: 'wizard_completion' | 'critical_alert';
  templateData?: {
    wizardType?: string;
    userName?: string;
    completionSummary?: string;
    resultUrl?: string;
    alertType?: string;
    alertMessage?: string;
    actionRequired?: string;
  };
  userId?: string;
  organizationId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate request
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    // Verify user authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { to, subject, body, template, templateData, userId, organizationId }: SendEmailRequest = await req.json();

    let emailHtml = body;

    // Use React Email templates if specified
    if (template && templateData) {
      try {
        if (template === 'wizard_completion') {
          emailHtml = await renderAsync(
            React.createElement(WizardCompletionEmail, {
              wizardType: templateData.wizardType || 'Unknown',
              userName: templateData.userName || 'User',
              completionSummary: templateData.completionSummary || 'Wizard completed successfully',
              resultUrl: templateData.resultUrl || '#',
            })
          );
        } else if (template === 'critical_alert') {
          emailHtml = await renderAsync(
            React.createElement(CriticalAlertEmail, {
              alertType: templateData.alertType || 'System Alert',
              userName: templateData.userName || 'User',
              alertMessage: templateData.alertMessage || 'A critical alert has been triggered',
              actionRequired: templateData.actionRequired || 'Please review immediately',
            })
          );
        }
      } catch (templateError) {
        console.error('Template rendering error:', templateError);
        // Fallback to plain body if template fails
        emailHtml = body || 'Email content could not be rendered';
      }
    }

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'TITANIS Platform <noreply@titanis.io>',
      to: [to],
      subject,
      html: emailHtml,
    });

    if (emailError) {
      throw emailError;
    }

    // Create notification entry in database if user and organization are provided
    if (userId && organizationId) {
      try {
        await supabase.from('notifications').insert({
          user_id: userId,
          organization_id: organizationId,
          type: template === 'wizard_completion' ? 'wizard_completion' : 'email_sent',
          title: subject,
          message: templateData?.completionSummary || body?.substring(0, 200) || 'Email notification',
          priority: template === 'critical_alert' ? 'urgent' : 'normal',
          data: {
            email_id: emailData?.id,
            template_used: template,
            wizard_type: templateData?.wizardType,
            result_url: templateData?.resultUrl,
          },
        });
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
        // Don't fail the email send if notification creation fails
      }
    }

    console.log('Email sent successfully:', emailData);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailData?.id,
      message: 'Email sent successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send email',
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});