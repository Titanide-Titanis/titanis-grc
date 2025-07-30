-- Clear existing subscription tiers to start fresh
DELETE FROM subscription_tiers;

-- Insert Demo tier (free)
INSERT INTO subscription_tiers (name, description, price_monthly, price_yearly, features, limits)
VALUES (
  'Demo',
  'Free demonstration mode with limited features',
  0,
  0,
  '{"core_modules": true, "demo_mode": true, "limited_users": 2}',
  '{"admin_users": 2, "read_only_users": 5, "frameworks": 1}'
);

-- Insert Trial tier (14-day free trial)
INSERT INTO subscription_tiers (name, description, price_monthly, price_yearly, features, limits)
VALUES (
  'Trial',
  '14-day free trial with full access to evaluate the platform',
  0,
  0,
  '{"core_modules": true, "trial_mode": true, "full_access": true}',
  '{"admin_users": 5, "read_only_users": "unlimited", "frameworks": 2, "trial_days": 14}'
);

-- Insert Starter tier
INSERT INTO subscription_tiers (name, description, price_monthly, price_yearly, features, limits)
VALUES (
  'Starter',
  'For FQHCs, small clinics, and early adopters seeking essential compliance capabilities',
  59900,
  49900,
  '{"core_grc_modules": true, "compliance_management": true, "policy_management": true, "audit_management": true, "email_support": true, "multi_framework": true}',
  '{"admin_users": 5, "read_only_users": "unlimited", "frameworks": 2, "support": "email"}'
);

-- Insert Advanced tier
INSERT INTO subscription_tiers (name, description, price_monthly, price_yearly, features, limits)
VALUES (
  'Advanced',
  'For growing organizations and mid-market healthcare providers needing AI-driven capabilities',
  145000,
  125000,
  '{"all_starter_features": true, "predictive_analytics": true, "ai_role_management": true, "executive_dashboards": true, "phone_email_support": true, "vendor_management": true}',
  '{"admin_users": 15, "read_only_users": "unlimited", "frameworks": 5, "support": "phone_email"}'
);

-- Insert Enterprise tier
INSERT INTO subscription_tiers (name, description, price_monthly, price_yearly, features, limits)
VALUES (
  'Enterprise',
  'For large healthcare systems, networks, and Fortune 500 companies requiring complete flexibility and premium support',
  350000,
  350000,
  '{"all_advanced_features": true, "unlimited_admin_users": true, "all_frameworks": true, "on_premises": true, "dedicated_account_manager": true, "custom_integrations": true, "vip_onboarding": true}',
  '{"admin_users": "unlimited", "read_only_users": "unlimited", "frameworks": "unlimited", "support": "dedicated"}'
);

-- Create zoho_leads table for CRM integration
CREATE TABLE public.zoho_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  phone TEXT,
  selected_tier TEXT NOT NULL,
  billing_interval TEXT NOT NULL,
  lead_source TEXT DEFAULT 'titanis_pricing_page',
  lead_status TEXT DEFAULT 'new',
  zoho_lead_id TEXT,
  synced_to_zoho BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.zoho_leads ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for zoho_leads
CREATE POLICY "Admins can view all leads" 
ON public.zoho_leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role])
  )
);

CREATE POLICY "System can create leads" 
ON public.zoho_leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update leads" 
ON public.zoho_leads 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = ANY(ARRAY['super_admin'::user_role, 'admin'::user_role])
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_zoho_leads_updated_at
BEFORE UPDATE ON public.zoho_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();