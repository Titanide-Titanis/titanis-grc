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

-- Create team invitations table (using existing user_role enum)
CREATE TABLE public.team_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
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
('Getting Started with TITANIS™', 'Welcome to TITANIS™, your comprehensive GRC platform. This guide will help you get started with the essential features and capabilities.

## Key Features
- Risk Management and Assessment
- Compliance Tracking and Reporting
- Policy Management and Distribution
- Incident Management and Response
- Vendor Risk Management
- Audit Planning and Execution

## Quick Start Guide
1. Complete your organization profile
2. Set up your compliance frameworks
3. Configure notification preferences
4. Invite team members
5. Start your first risk assessment

For additional support, contact support@titanideconsulting.com or visit our support portal at https://support.titanideholdings.com/portal/en/home', 'Learn the basics of using TITANIS™ for your GRC needs', 'Getting Started', ARRAY['tutorial', 'basics'], 'published', true),

('Risk Management Best Practices', 'Comprehensive guide to implementing effective risk management strategies using TITANIS™ risk assessment tools.

## Risk Assessment Framework
TITANIS™ follows industry-standard risk assessment methodologies including:
- NIST Risk Management Framework
- ISO 31000 Risk Management
- COSO Enterprise Risk Management
- FAIR (Factor Analysis of Information Risk)

## Key Components
1. **Risk Identification**: Systematic identification of potential risks
2. **Risk Analysis**: Quantitative and qualitative assessment
3. **Risk Evaluation**: Comparison against risk criteria
4. **Risk Treatment**: Selection and implementation of risk treatment options
5. **Monitoring and Review**: Ongoing assessment of risk management effectiveness

## Best Practices
- Involve stakeholders across the organization
- Use consistent risk criteria and scales
- Document all risk decisions and rationale
- Regular review and update of risk assessments
- Integration with business planning processes

For expert guidance, contact our team at sales@titanideconsulting.com', 'Learn industry best practices for risk management', 'Risk Management', ARRAY['risk', 'best-practices'], 'published', true),

('Compliance Framework Setup', 'Step-by-step guide to setting up compliance frameworks like SOX, GDPR, HIPAA, and ISO 27001 in TITANIS™.

## Supported Frameworks
TITANIS™ provides built-in support for major compliance frameworks:

### Financial Compliance
- SOX (Sarbanes-Oxley Act)
- SOC 1, SOC 2 Type II
- PCI DSS

### Privacy and Data Protection
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- PIPEDA (Personal Information Protection and Electronic Documents Act)

### Healthcare
- HIPAA (Health Insurance Portability and Accountability Act)
- HITECH Act

### Security Standards
- ISO 27001/27002
- NIST Cybersecurity Framework
- CIS Controls

## Setup Process
1. Select your applicable frameworks
2. Configure control mapping
3. Set up evidence collection workflows
4. Define assessment schedules
5. Assign control owners and reviewers

Need help with framework selection? Contact support@titanideconsulting.com', 'Configure compliance frameworks for your organization', 'Compliance', ARRAY['compliance', 'frameworks'], 'published', false),

('Free GRC Templates and Tools', 'Access Titanide''s comprehensive collection of free GRC templates and tools to accelerate your compliance journey.

## Available Free Resources

### Risk Management Templates
- Risk Register Template
- Risk Assessment Questionnaire
- Business Impact Analysis Template
- Risk Treatment Plan Template

### Compliance Templates
- Policy Template Library
- Control Testing Worksheets
- Evidence Collection Checklists
- Compliance Gap Analysis Template

### Incident Response Tools
- Incident Response Plan Template
- Communication Templates
- Post-Incident Review Template
- Lessons Learned Documentation

### Audit and Assessment Tools
- Internal Audit Checklist
- Vendor Assessment Questionnaire
- Security Assessment Template
- Penetration Testing Checklist

## How to Access
Visit our free resources portal at: **https://www.titanideconsulting.com/resources/tools/free**

These templates are designed to integrate seamlessly with TITANIS™ or can be used standalone. All templates are based on industry best practices and regulatory requirements.

## Premium Resources
For advanced templates and consulting services, contact sales@titanideconsulting.com

## Support
Need help customizing these templates for your organization? Our support team is here to help:
- Email: support@titanideconsulting.com
- Support Portal: https://support.titanideholdings.com/portal/en/home', 'Download free GRC templates and tools from Titanide', 'Resources', ARRAY['templates', 'free', 'tools'], 'published', true),

('Support and Training Resources', 'Get comprehensive help with TITANIS™ through our support portal, training resources, and expert consulting services.

## Support Channels

### Email Support
- **General Support**: support@titanideconsulting.com
- **Sales Inquiries**: sales@titanideconsulting.com
- Response Time: Within 4 business hours

### Support Portal
Access our comprehensive support portal at:
**https://support.titanideholdings.com/portal/en/home**

Features include:
- Knowledge base search
- Ticket submission and tracking
- Video tutorials and guides
- Community forums
- Download center for templates and tools

### Live Chat
Available during business hours (9 AM - 6 PM EST) through the TITANIS™ platform

## Training Resources

### Getting Started Training
- Platform orientation (30 minutes)
- Module-specific tutorials
- Best practices workshops
- Integration guides

### Advanced Training
- GRC methodology training
- Compliance deep-dives
- Risk assessment certification
- Custom training programs

### Self-Paced Learning
- Interactive tutorials within TITANIS™
- Video library access
- Documentation and user guides
- Webinar recordings

## Professional Services
Our expert consultants can help with:
- Implementation planning
- Custom framework development
- Process optimization
- Staff training and certification
- Ongoing managed services

Contact sales@titanideconsulting.com for professional services inquiries.

## Community Resources
- User community forums
- Best practice sharing
- Quarterly user conferences
- Industry-specific user groups', 'Access comprehensive support and training resources', 'Support', ARRAY['support', 'training', 'help'], 'published', false);

-- Insert notification preferences for existing users
INSERT INTO public.user_preferences (user_id, notification_preferences, tutorial_preferences)
SELECT id, 
  '{"email": true, "push": true, "in_app": true, "risk_alerts": true, "compliance_deadlines": true, "incident_notifications": true}'::jsonb,
  '{"show_tutorials": true, "auto_start": true, "completed_intro": false}'::jsonb
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;