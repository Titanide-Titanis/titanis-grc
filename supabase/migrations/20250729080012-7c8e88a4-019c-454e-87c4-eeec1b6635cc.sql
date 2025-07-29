-- Fix the database structure for subscription management
UPDATE public.subscription_tiers 
SET features = '{"basic_assessment": true, "risk_calculator": true, "policy_templates": 3, "basic_reports": true}'
WHERE name = 'Free';

UPDATE public.subscription_tiers 
SET features = '{"everything": true, "custom_deployment": true, "unlimited_everything": true, "support_24_7": true}'
WHERE name = 'Enterprise Plus';