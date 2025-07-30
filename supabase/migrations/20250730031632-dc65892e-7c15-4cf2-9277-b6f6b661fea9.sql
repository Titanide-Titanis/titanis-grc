-- Create compliance calendar and task management tables

-- Task categories enum
CREATE TYPE public.task_category AS ENUM (
    'audit_due',
    'policy_review',
    'incident_followup',
    'training_deadline',
    'compliance_deadline',
    'vendor_assessment',
    'risk_review',
    'regulatory_filing',
    'credentialing',
    'general'
);

-- Task status enum
CREATE TYPE public.task_status AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'overdue',
    'cancelled'
);

-- Task priority enum
CREATE TYPE public.task_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);

-- Reminder types enum
CREATE TYPE public.reminder_type AS ENUM (
    'email',
    'sms',
    'in_app',
    'slack',
    'teams'
);

-- Recurrence patterns enum
CREATE TYPE public.recurrence_pattern AS ENUM (
    'none',
    'daily',
    'weekly',
    'monthly',
    'quarterly',
    'annually'
);

-- Compliance tasks table
CREATE TABLE public.compliance_tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category task_category NOT NULL DEFAULT 'general',
    priority task_priority NOT NULL DEFAULT 'medium',
    status task_status NOT NULL DEFAULT 'pending',
    
    -- Date management
    due_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Recurrence
    recurrence_pattern recurrence_pattern NOT NULL DEFAULT 'none',
    recurrence_interval INTEGER DEFAULT 1,
    recurrence_end_date TIMESTAMP WITH TIME ZONE,
    parent_task_id UUID, -- For recurring task instances
    
    -- Assignment
    assigned_to UUID, -- user_id
    created_by UUID,
    
    -- Task details
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Linked entities
    linked_entity_type TEXT, -- 'audit', 'policy', 'incident', 'risk', etc.
    linked_entity_id UUID,
    
    -- Attachments and resources
    attachments JSONB DEFAULT '[]'::JSONB,
    metadata JSONB DEFAULT '{}'::JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Task reminders table
CREATE TABLE public.task_reminders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.compliance_tasks(id) ON DELETE CASCADE,
    reminder_type reminder_type NOT NULL,
    
    -- Timing
    remind_before_minutes INTEGER NOT NULL, -- How many minutes before due date
    sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Recipient info
    recipient_id UUID, -- user_id
    recipient_email TEXT,
    recipient_phone TEXT,
    
    -- Message content
    subject TEXT,
    message TEXT,
    
    -- Status
    is_sent BOOLEAN DEFAULT false,
    is_delivered BOOLEAN DEFAULT false,
    delivery_status TEXT,
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Surge alerts configuration table
CREATE TABLE public.surge_alert_configs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID NOT NULL,
    
    -- Alert configuration
    alert_name TEXT NOT NULL,
    alert_type TEXT NOT NULL, -- 'incident_spike', 'overdue_tasks', 'audit_due', 'policy_expiry'
    threshold_value INTEGER NOT NULL,
    threshold_period_hours INTEGER NOT NULL DEFAULT 24,
    
    -- Recipients
    recipient_roles TEXT[] DEFAULT '{}', -- Array of roles
    recipient_users UUID[] DEFAULT '{}', -- Array of user IDs
    
    -- Notification settings
    notification_types reminder_type[] DEFAULT '{"email","in_app"}',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMP WITH TIME ZONE,
    trigger_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Calendar integrations table
CREATE TABLE public.calendar_integrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    
    -- Integration details
    provider TEXT NOT NULL, -- 'outlook', 'google', 'teams'
    external_calendar_id TEXT,
    access_token TEXT, -- Encrypted
    refresh_token TEXT, -- Encrypted
    token_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Sync settings
    sync_enabled BOOLEAN DEFAULT true,
    sync_direction TEXT DEFAULT 'bidirectional', -- 'import', 'export', 'bidirectional'
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'active', -- 'active', 'error', 'disabled'
    sync_error_message TEXT,
    
    -- Configuration
    sync_categories task_category[] DEFAULT '{}',
    auto_create_reminders BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compliance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surge_alert_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for compliance_tasks
CREATE POLICY "Organization members can view tasks" 
ON public.compliance_tasks 
FOR SELECT 
USING (organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
));

CREATE POLICY "Organization members can create tasks" 
ON public.compliance_tasks 
FOR INSERT 
WITH CHECK (organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
));

CREATE POLICY "Organization members can update tasks" 
ON public.compliance_tasks 
FOR UPDATE 
USING (organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
));

CREATE POLICY "Organization members can delete tasks" 
ON public.compliance_tasks 
FOR DELETE 
USING (organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
));

-- RLS Policies for task_reminders
CREATE POLICY "Users can view task reminders" 
ON public.task_reminders 
FOR SELECT 
USING (task_id IN (
    SELECT compliance_tasks.id 
    FROM compliance_tasks 
    WHERE compliance_tasks.organization_id IN (
        SELECT profiles.organization_id 
        FROM profiles 
        WHERE profiles.id = auth.uid()
    )
));

CREATE POLICY "System can manage task reminders" 
ON public.task_reminders 
FOR ALL 
USING (true);

-- RLS Policies for surge_alert_configs
CREATE POLICY "Organization admins can manage surge alerts" 
ON public.surge_alert_configs 
FOR ALL 
USING (organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role, 'compliance_officer'::user_role])
));

-- RLS Policies for calendar_integrations
CREATE POLICY "Users can manage their own calendar integrations" 
ON public.calendar_integrations 
FOR ALL 
USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_compliance_tasks_organization_id ON public.compliance_tasks(organization_id);
CREATE INDEX idx_compliance_tasks_assigned_to ON public.compliance_tasks(assigned_to);
CREATE INDEX idx_compliance_tasks_due_date ON public.compliance_tasks(due_date);
CREATE INDEX idx_compliance_tasks_status ON public.compliance_tasks(status);
CREATE INDEX idx_compliance_tasks_category ON public.compliance_tasks(category);
CREATE INDEX idx_compliance_tasks_priority ON public.compliance_tasks(priority);
CREATE INDEX idx_compliance_tasks_linked_entity ON public.compliance_tasks(linked_entity_type, linked_entity_id);
CREATE INDEX idx_task_reminders_task_id ON public.task_reminders(task_id);
CREATE INDEX idx_task_reminders_sent ON public.task_reminders(is_sent, remind_before_minutes);
CREATE INDEX idx_surge_alert_configs_org ON public.surge_alert_configs(organization_id);
CREATE INDEX idx_calendar_integrations_user ON public.calendar_integrations(user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_compliance_tasks_updated_at
    BEFORE UPDATE ON public.compliance_tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_surge_alert_configs_updated_at
    BEFORE UPDATE ON public.surge_alert_configs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_integrations_updated_at
    BEFORE UPDATE ON public.calendar_integrations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();