-- Create wizard_sessions table with comprehensive audit fields
CREATE TABLE public.wizard_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  organization_id UUID NOT NULL,
  wizard_type TEXT NOT NULL CHECK (wizard_type IN ('audit', 'compliance', 'incident', 'policy', 'risk', 'vendor')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  session_data JSONB DEFAULT '{}',
  result_data JSONB DEFAULT '{}',
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wizard_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for wizard sessions
CREATE POLICY "Users can view their organization wizard sessions" 
ON public.wizard_sessions 
FOR SELECT 
USING (organization_id IN (
  SELECT profiles.organization_id 
  FROM profiles 
  WHERE profiles.id = auth.uid()
));

CREATE POLICY "Users can create wizard sessions for their organization" 
ON public.wizard_sessions 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
  )
);

CREATE POLICY "Users can update their own wizard sessions" 
ON public.wizard_sessions 
FOR UPDATE 
USING (
  auth.uid() = user_id AND 
  organization_id IN (
    SELECT profiles.organization_id 
    FROM profiles 
    WHERE profiles.id = auth.uid()
  )
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_wizard_sessions_updated_at
BEFORE UPDATE ON public.wizard_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_wizard_sessions_user_id ON public.wizard_sessions(user_id);
CREATE INDEX idx_wizard_sessions_organization_id ON public.wizard_sessions(organization_id);
CREATE INDEX idx_wizard_sessions_type_status ON public.wizard_sessions(wizard_type, status);
CREATE INDEX idx_wizard_sessions_created_at ON public.wizard_sessions(created_at);

-- Enhance notifications table with wizard completion type
-- Add wizard session reference to notifications data field for better linking