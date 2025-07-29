-- Create knowledge base articles table
CREATE TABLE public.knowledge_base_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID,
  organization_id UUID,
  status TEXT DEFAULT 'published',
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  organization_id UUID,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  read_status BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create tutorial progress table
CREATE TABLE public.tutorial_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tutorial_id TEXT NOT NULL,
  completed_steps TEXT[] DEFAULT '{}',
  current_step TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tutorial_id)
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "in_app": true}',
  tutorial_preferences JSONB DEFAULT '{"show_tutorials": true, "auto_start": false}',
  theme_preferences JSONB DEFAULT '{"mode": "system", "sidebar_collapsed": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team invitations table
CREATE TABLE public.team_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  email TEXT NOT NULL,
  role USER_DEFINED NOT NULL DEFAULT 'user',
  invited_by UUID,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.knowledge_base_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorial_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for knowledge_base_articles
CREATE POLICY "Organization members can view knowledge articles" 
ON public.knowledge_base_articles 
FOR SELECT 
USING (organization_id IN (
  SELECT profiles.organization_id 
  FROM profiles 
  WHERE profiles.id = auth.uid()
) OR organization_id IS NULL);

CREATE POLICY "Admins can manage knowledge articles" 
ON public.knowledge_base_articles 
FOR ALL 
USING (organization_id IN (
  SELECT profiles.organization_id 
  FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role])
));

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for tutorial_progress
CREATE POLICY "Users can manage their own tutorial progress" 
ON public.tutorial_progress 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for user_preferences
CREATE POLICY "Users can manage their own preferences" 
ON public.user_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for team_invitations
CREATE POLICY "Organization admins can manage invitations" 
ON public.team_invitations 
FOR ALL 
USING (organization_id IN (
  SELECT profiles.organization_id 
  FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role])
));

-- Create update triggers
CREATE TRIGGER update_knowledge_base_articles_updated_at
  BEFORE UPDATE ON public.knowledge_base_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tutorial_progress_updated_at
  BEFORE UPDATE ON public.tutorial_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample knowledge base articles with Titanide resources
INSERT INTO public.knowledge_base_articles (title, content, excerpt, category, tags, status, is_featured) VALUES
('Getting Started with TITANIS™', 'Welcome to TITANIS™, your comprehensive GRC platform. This guide will help you get started with the essential features and capabilities.', 'Learn the basics of using TITANIS™ for your GRC needs', 'Getting Started', ARRAY['tutorial', 'basics'], 'published', true),
('Risk Management Best Practices', 'Comprehensive guide to implementing effective risk management strategies using TITANIS™ risk assessment tools.', 'Learn industry best practices for risk management', 'Risk Management', ARRAY['risk', 'best-practices'], 'published', true),
('Compliance Framework Setup', 'Step-by-step guide to setting up compliance frameworks like SOX, GDPR, HIPAA, and ISO 27001 in TITANIS™.', 'Configure compliance frameworks for your organization', 'Compliance', ARRAY['compliance', 'frameworks'], 'published', false),
('Incident Response Planning', 'Create effective incident response plans and workflows to minimize business impact and ensure rapid recovery.', 'Build robust incident response capabilities', 'Incident Management', ARRAY['incident', 'response', 'planning'], 'published', false),
('Vendor Risk Assessment', 'Comprehensive vendor risk assessment methodologies and tools for third-party risk management.', 'Assess and manage vendor risks effectively', 'Vendor Management', ARRAY['vendor', 'risk', 'assessment'], 'published', false),
('Free GRC Templates', 'Access Titanide''s collection of free GRC templates and tools to accelerate your compliance journey. Visit our free resources at titanideconsulting.com/resources/tools/free', 'Download free templates and tools', 'Resources', ARRAY['templates', 'free', 'tools'], 'published', true),
('Support and Training', 'Get help with TITANIS™ through our comprehensive support portal and training resources. Contact support@titanideconsulting.com for assistance.', 'Access support and training resources', 'Support', ARRAY['support', 'training', 'help'], 'published', false);

-- Insert notification preferences for existing users
INSERT INTO public.user_preferences (user_id, notification_preferences, tutorial_preferences)
SELECT id, 
  '{"email": true, "push": true, "in_app": true, "risk_alerts": true, "compliance_deadlines": true, "incident_notifications": true}'::jsonb,
  '{"show_tutorials": true, "auto_start": true, "completed_intro": false}'::jsonb
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;