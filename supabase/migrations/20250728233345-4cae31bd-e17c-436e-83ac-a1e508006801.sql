-- Create compliance_assessments table for tracking assessments
CREATE TABLE public.compliance_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  framework_id TEXT NOT NULL,
  framework_name TEXT,
  assessment_type TEXT,
  scope TEXT,
  objectives TEXT[],
  planned_start_date DATE,
  planned_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  lead_assessor_email TEXT,
  stakeholders TEXT[],
  priority_level TEXT DEFAULT 'medium',
  budget_range TEXT,
  selected_controls TEXT[],
  deliverables TEXT[],
  status TEXT DEFAULT 'planned',
  findings TEXT,
  recommendations TEXT[],
  completion_percentage INTEGER DEFAULT 0,
  organization_id UUID,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compliance_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Organization members can view compliance assessments" 
ON public.compliance_assessments 
FOR SELECT 
USING (organization_id IN ( 
  SELECT profiles.organization_id
  FROM profiles
  WHERE (profiles.id = auth.uid())
));

CREATE POLICY "Organization members can create compliance assessments" 
ON public.compliance_assessments 
FOR INSERT 
WITH CHECK (organization_id IN ( 
  SELECT profiles.organization_id
  FROM profiles
  WHERE (profiles.id = auth.uid())
));

CREATE POLICY "Organization members can update compliance assessments" 
ON public.compliance_assessments 
FOR UPDATE 
USING (organization_id IN ( 
  SELECT profiles.organization_id
  FROM profiles
  WHERE (profiles.id = auth.uid())
));

-- Create trigger for updated_at
CREATE TRIGGER update_compliance_assessments_updated_at
BEFORE UPDATE ON public.compliance_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create subscription_tiers table for tiered access
CREATE TABLE public.subscription_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly INTEGER NOT NULL, -- price in cents
  price_yearly INTEGER, -- price in cents
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on subscription_tiers
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view subscription tiers
CREATE POLICY "Everyone can view subscription tiers" 
ON public.subscription_tiers 
FOR SELECT 
USING (is_active = true);

-- Insert default subscription tiers
INSERT INTO public.subscription_tiers (name, description, price_monthly, price_yearly, features, limits) VALUES
('Free', 'Basic compliance assessment tools', 0, 0, 
  '{"basic_assessment": true, "risk_calculator": true, "policy_templates": 3, "basic_reports": true}',
  '{"assessments_per_month": 1, "frameworks": 1, "users": 1, "storage_gb": 1}'
),
('Starter', 'Small business compliance management', 250000, 2700000,
  '{"full_assessment": true, "risk_management": true, "policy_library": true, "standard_reports": true, "email_support": true}',
  '{"assessments_per_month": 5, "frameworks": 1, "users": 5, "storage_gb": 10}'
),
('Professional', 'Mid-market enterprise features', 750000, 8100000,
  '{"multiple_frameworks": true, "advanced_analytics": true, "custom_reports": true, "workflow_automation": true, "priority_support": true}',
  '{"assessments_per_month": 20, "frameworks": 3, "users": 25, "storage_gb": 100}'
),
('Enterprise', 'Large enterprise with full features', 1500000, 16200000,
  '{"unlimited_frameworks": true, "ai_analytics": true, "custom_integrations": true, "white_label": true, "dedicated_csm": true}',
  '{"assessments_per_month": -1, "frameworks": -1, "users": 100, "storage_gb": 1000}'
),
('Enterprise Plus', 'Custom enterprise solutions', 0, 0,
  '{"everything": true, "custom_deployment": true, "unlimited_everything": true, "24_7_support": true}',
  '{"assessments_per_month": -1, "frameworks": -1, "users": -1, "storage_gb": -1}'
);

-- Create user_subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  tier_id UUID NOT NULL REFERENCES public.subscription_tiers(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  usage_stats JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_subscriptions
CREATE POLICY "Users can view their organization subscription" 
ON public.user_subscriptions 
FOR SELECT 
USING (organization_id IN ( 
  SELECT profiles.organization_id
  FROM profiles
  WHERE (profiles.id = auth.uid())
));

CREATE POLICY "Admins can manage organization subscription" 
ON public.user_subscriptions 
FOR ALL 
USING (organization_id IN ( 
  SELECT profiles.organization_id
  FROM profiles
  WHERE (profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['super_admin'::user_role, 'admin'::user_role]))
));

-- Create trigger for user_subscriptions updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();