-- TITANIS™ GRC Platform - Comprehensive Database Schema
-- Phase 1: Foundation & Core Tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'compliance_officer', 'risk_manager', 'auditor', 'user', 'viewer');
CREATE TYPE risk_status AS ENUM ('open', 'in_progress', 'mitigated', 'accepted', 'closed');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE compliance_status AS ENUM ('compliant', 'non_compliant', 'partially_compliant', 'pending_review');
CREATE TYPE incident_status AS ENUM ('open', 'investigating', 'resolved', 'closed');
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE policy_status AS ENUM ('draft', 'under_review', 'approved', 'published', 'archived');
CREATE TYPE audit_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE document_status AS ENUM ('draft', 'under_review', 'approved', 'published', 'archived');

-- Organizations table for multi-tenant support
CREATE TABLE public.organizations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    domain TEXT,
    settings JSONB DEFAULT '{}',
    subscription_plan TEXT DEFAULT 'basic',
    subscription_status TEXT DEFAULT 'active',
    data_residency TEXT DEFAULT 'US',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'user',
    title TEXT,
    department TEXT,
    phone TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Risk categories table
CREATE TABLE public.risk_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6B7280',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Risks table
CREATE TABLE public.risks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.risk_categories(id),
    likelihood INTEGER CHECK (likelihood >= 1 AND likelihood <= 5) DEFAULT 3,
    impact INTEGER CHECK (impact >= 1 AND impact <= 5) DEFAULT 3,
    risk_score DECIMAL GENERATED ALWAYS AS (likelihood * impact) STORED,
    risk_level risk_level,
    status risk_status DEFAULT 'open',
    owner_id UUID REFERENCES public.profiles(id),
    mitigation_plan TEXT,
    residual_likelihood INTEGER CHECK (residual_likelihood >= 1 AND residual_likelihood <= 5),
    residual_impact INTEGER CHECK (residual_impact >= 1 AND residual_impact <= 5),
    residual_score DECIMAL GENERATED ALWAYS AS (COALESCE(residual_likelihood, likelihood) * COALESCE(residual_impact, impact)) STORED,
    next_review_date DATE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance frameworks table
CREATE TABLE public.compliance_frameworks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    version TEXT,
    jurisdiction TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance requirements table
CREATE TABLE public.compliance_requirements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    framework_id UUID REFERENCES public.compliance_frameworks(id) ON DELETE CASCADE,
    reference_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    control_objective TEXT,
    status compliance_status DEFAULT 'pending_review',
    owner_id UUID REFERENCES public.profiles(id),
    evidence_required TEXT[],
    next_review_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Policies table
CREATE TABLE public.policies (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    version TEXT DEFAULT '1.0',
    status policy_status DEFAULT 'draft',
    policy_type TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    approved_by UUID REFERENCES public.profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    effective_date DATE,
    review_date DATE,
    next_review_date DATE,
    tags TEXT[],
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Incidents table
CREATE TABLE public.incidents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    incident_type TEXT,
    severity incident_severity DEFAULT 'medium',
    status incident_status DEFAULT 'open',
    reporter_id UUID REFERENCES public.profiles(id),
    assignee_id UUID REFERENCES public.profiles(id),
    affected_systems TEXT[],
    impact_description TEXT,
    root_cause TEXT,
    corrective_actions TEXT,
    lessons_learned TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audits table
CREATE TABLE public.audits (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    audit_type TEXT,
    status audit_status DEFAULT 'planned',
    framework_id UUID REFERENCES public.compliance_frameworks(id),
    lead_auditor_id UUID REFERENCES public.profiles(id),
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    scope TEXT,
    objectives TEXT[],
    findings_summary TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendors table
CREATE TABLE public.vendors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    website TEXT,
    address TEXT,
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level risk_level,
    status TEXT DEFAULT 'active',
    contract_start_date DATE,
    contract_end_date DATE,
    services_provided TEXT[],
    data_access_level TEXT,
    last_assessment_date DATE,
    next_assessment_date DATE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Documents table
CREATE TABLE public.documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_name TEXT,
    file_path TEXT,
    file_size INTEGER,
    mime_type TEXT,
    version TEXT DEFAULT '1.0',
    status document_status DEFAULT 'draft',
    document_type TEXT,
    tags TEXT[],
    is_confidential BOOLEAN DEFAULT false,
    retention_date DATE,
    owner_id UUID REFERENCES public.profiles(id),
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activity logs for audit trail
CREATE TABLE public.activity_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for multi-tenant security
CREATE POLICY "Users can view their organization" ON public.organizations
FOR SELECT USING (
    id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can view profiles in their organization" ON public.profiles
FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (id = auth.uid());

-- Generic organization-based policies for all main tables
CREATE POLICY "Organization members can view risk categories" ON public.risk_categories
FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Organization members can view risks" ON public.risks
FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Organization members can view compliance frameworks" ON public.compliance_frameworks
FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Organization members can view compliance requirements" ON public.compliance_requirements
FOR SELECT USING (
    framework_id IN (
        SELECT id FROM public.compliance_frameworks 
        WHERE organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    )
);

CREATE POLICY "Organization members can view policies" ON public.policies
FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Organization members can view incidents" ON public.incidents
FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Organization members can view audits" ON public.audits
FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Organization members can view vendors" ON public.vendors
FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Organization members can view documents" ON public.documents
FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Organization members can view activity logs" ON public.activity_logs
FOR SELECT USING (
    organization_id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

-- Insert/Update/Delete policies (role-based)
CREATE POLICY "Admins can manage organization data" ON public.risk_categories
FOR ALL USING (
    organization_id IN (
        SELECT organization_id FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('super_admin', 'admin', 'compliance_officer', 'risk_manager')
    )
);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risk_categories_updated_at BEFORE UPDATE ON public.risk_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON public.risks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_frameworks_updated_at BEFORE UPDATE ON public.compliance_frameworks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_compliance_requirements_updated_at BEFORE UPDATE ON public.compliance_requirements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON public.policies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON public.audits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default compliance frameworks
INSERT INTO public.compliance_frameworks (name, description, version, jurisdiction) VALUES
('GDPR', 'General Data Protection Regulation', '2018', 'EU'),
('HIPAA', 'Health Insurance Portability and Accountability Act', '1996', 'US'),
('ISO 27001', 'Information Security Management Systems', '2022', 'International'),
('NIST CSF', 'NIST Cybersecurity Framework', '2.0', 'US'),
('SOC 2', 'Service Organization Control 2', '2017', 'US'),
('UK DPA 2018', 'Data Protection Act 2018', '2018', 'UK'),
('EU AI Act', 'European Union Artificial Intelligence Act', '2024', 'EU');

-- Insert default risk categories
INSERT INTO public.risk_categories (name, description, color) VALUES
('Cybersecurity', 'Information security and cyber threats', '#EF4444'),
('Operational', 'Business operations and processes', '#F59E0B'),
('Financial', 'Financial and credit risks', '#10B981'),
('Regulatory', 'Compliance and regulatory risks', '#3B82F6'),
('Strategic', 'Strategic and market risks', '#8B5CF6'),
('Reputational', 'Brand and reputation risks', '#F97316');