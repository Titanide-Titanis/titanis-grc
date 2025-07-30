import { useState, useEffect } from "react";
import { FileText, CheckCircle, User, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useWizardSession } from "@/hooks/useWizardSession";
import { toast } from "sonner";

interface PolicyWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPolicyCreated?: () => void;
}

const POLICY_TEMPLATES = [
  {
    id: 'information-security',
    name: 'Information Security Policy',
    description: 'Comprehensive policy covering data protection, access controls, and security procedures',
    category: 'Security',
    sections: ['Purpose', 'Scope', 'Roles & Responsibilities', 'Security Controls', 'Incident Response']
  },
  {
    id: 'data-privacy',
    name: 'Data Privacy Policy',
    description: 'GDPR/CCPA compliant privacy policy for data collection and processing',
    category: 'Privacy',
    sections: ['Data Collection', 'Processing Purposes', 'Consent', 'Rights & Remedies', 'Retention']
  },
  {
    id: 'acceptable-use',
    name: 'Acceptable Use Policy',
    description: 'Guidelines for appropriate use of company technology and resources',
    category: 'HR',
    sections: ['Permitted Uses', 'Prohibited Activities', 'Monitoring', 'Violations', 'Enforcement']
  },
  {
    id: 'incident-response',
    name: 'Incident Response Policy',
    description: 'Procedures for detecting, responding to, and recovering from security incidents',
    category: 'Security',
    sections: ['Incident Classification', 'Response Team', 'Procedures', 'Communication', 'Recovery']
  },
  {
    id: 'vendor-management',
    name: 'Vendor Management Policy',
    description: 'Framework for evaluating, onboarding, and managing third-party vendors',
    category: 'Risk',
    sections: ['Vendor Selection', 'Due Diligence', 'Contracts', 'Monitoring', 'Termination']
  }
];

const STEPS = [
  { id: 1, title: "Policy Template", icon: <FileText className="h-5 w-5" />, description: "Choose a policy template" },
  { id: 2, title: "Content Creation", icon: <CheckCircle className="h-5 w-5" />, description: "Define policy content" },
  { id: 3, title: "Review Workflow", icon: <User className="h-5 w-5" />, description: "Set up approval process" },
  { id: 4, title: "Implementation", icon: <Calendar className="h-5 w-5" />, description: "Schedule and publish" }
];

export function PolicyWizard({ open, onOpenChange, onPolicyCreated }: PolicyWizardProps) {
  const { user, profile } = useAuth();
  const { createSession, updateSessionProgress, completeSession, cancelSession, isLoading: sessionLoading } = useWizardSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Form data
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [policyData, setPolicyData] = useState({
    title: '',
    description: '',
    content: '',
    policyType: '',
    version: '1.0',
    effectiveDate: '',
    reviewDate: '',
    nextReviewDate: '',
    ownerId: '',
    approvers: [] as string[],
    tags: [] as string[],
    status: 'draft' as const
  });

  const progress = (currentStep / STEPS.length) * 100;
  const selectedTemplateData = POLICY_TEMPLATES.find(t => t.id === selectedTemplate);

  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      
      // Update session progress
      if (sessionId) {
        await updateSessionProgress(sessionId, {
          currentStep: currentStep + 1,
          stepData: { [`step_${currentStep}`]: { selectedTemplate, policyData } },
          formData: { selectedTemplate, policyData }
        });
      }
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('policies')
        .insert({
          title: policyData.title,
          description: policyData.description,
          content: policyData.content,
          policy_type: policyData.policyType,
          version: policyData.version,
          effective_date: policyData.effectiveDate,
          review_date: policyData.reviewDate,
          next_review_date: policyData.nextReviewDate,
          owner_id: policyData.ownerId || user?.id,
          tags: policyData.tags,
          status: policyData.status,
          created_by: user?.id,
          organization_id: profile?.organization_id
        });

      if (error) throw error;

      // Complete wizard session
      if (sessionId) {
        await completeSession(sessionId, {
          formInputs: { selectedTemplate, policyData },
          completionMetrics: {
            totalSteps: STEPS.length,
            completedSteps: STEPS.length,
            startTimestamp: new Date().toISOString(),
            endTimestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          },
          generatedArtifacts: {
            summaries: [`Created policy: ${policyData.title}`]
          },
          outcomeStatus: 'success',
          context: {
            browserInfo: navigator.userAgent,
            deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            userRole: profile?.role || 'user'
          }
        }, `Policy "${policyData.title}" created successfully with status ${policyData.status}.`);
      }

      toast.success("Policy created successfully!");
      onPolicyCreated?.();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating policy:', error);
      toast.error("Failed to create policy");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSessionId(null);
    setSelectedTemplate('');
    setPolicyData({
      title: '',
      description: '',
      content: '',
      policyType: '',
      version: '1.0',
      effectiveDate: '',
      reviewDate: '',
      nextReviewDate: '',
      ownerId: '',
      approvers: [],
      tags: [],
      status: 'draft'
    });
  };

  // Create session when wizard opens
  useEffect(() => {
    if (open && !sessionId) {
      const initSession = async () => {
        const newSessionId = await createSession('policy', {
          currentStep: 1,
          formData: { selectedTemplate, policyData }
        });
        setSessionId(newSessionId);
      };
      initSession();
    }
  }, [open, sessionId, createSession, selectedTemplate, policyData]);

  // Handle wizard close/cancel
  const handleCancel = async () => {
    if (sessionId) {
      await cancelSession(sessionId, 'User cancelled the policy wizard');
    }
    onOpenChange(false);
    resetForm();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedTemplate !== '';
      case 2:
        return policyData.title && policyData.content && policyData.effectiveDate;
      case 3:
        return policyData.ownerId && policyData.nextReviewDate;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const generatePolicyContent = (template: typeof POLICY_TEMPLATES[0]) => {
    const baseContent = `# ${policyData.title || template.name}

## 1. Purpose
This policy establishes guidelines and requirements for ${template.description.toLowerCase()}.

## 2. Scope
This policy applies to all employees, contractors, and third parties who have access to [Company Name] systems and data.

${template.sections.map((section, index) => `
## ${index + 3}. ${section}
[Define requirements and procedures for ${section.toLowerCase()}]
`).join('')}

## Review and Updates
This policy will be reviewed annually or as needed to ensure continued effectiveness and compliance.

## Approval
This policy has been approved by [Approver Name] on [Date].
`;
    return baseContent;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Policy Template</h3>
              <p className="text-muted-foreground mb-4">
                Choose a template to get started with your policy creation.
              </p>
            </div>
            
            <div className="grid gap-4">
              {POLICY_TEMPLATES.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setPolicyData(prev => ({
                      ...prev,
                      title: template.name,
                      policyType: template.category,
                      description: template.description
                    }));
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Includes sections:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.sections.map(section => (
                          <Badge key={section} variant="outline" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Policy Content</h3>
              <p className="text-muted-foreground mb-4">
                Customize the policy content and set basic parameters.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Policy Title</Label>
                <Input
                  id="title"
                  value={policyData.title}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter policy title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={policyData.description}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the policy purpose..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={policyData.version}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="1.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effective-date">Effective Date</Label>
                  <Input
                    id="effective-date"
                    type="date"
                    value={policyData.effectiveDate}
                    onChange={(e) => setPolicyData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={policyData.tags.join(', ')}
                  onChange={(e) => setPolicyData(prev => ({ 
                    ...prev, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) 
                  }))}
                  placeholder="security, compliance, privacy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Policy Content</Label>
                <div className="mb-2">
                  {selectedTemplateData && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const content = generatePolicyContent(selectedTemplateData);
                        setPolicyData(prev => ({ ...prev, content }));
                      }}
                    >
                      Generate Template Content
                    </Button>
                  )}
                </div>
                <Textarea
                  id="content"
                  value={policyData.content}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter the full policy content..."
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Review & Approval Workflow</h3>
              <p className="text-muted-foreground mb-4">
                Set up the review process and assign ownership.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="owner">Policy Owner Email</Label>
                <Input
                  id="owner"
                  type="email"
                  value={policyData.ownerId}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, ownerId: e.target.value }))}
                  placeholder="owner@company.com"
                />
                <p className="text-xs text-muted-foreground">
                  The person responsible for maintaining this policy
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvers">Approvers (comma-separated emails)</Label>
                <Textarea
                  id="approvers"
                  value={policyData.approvers.join(', ')}
                  onChange={(e) => setPolicyData(prev => ({ 
                    ...prev, 
                    approvers: e.target.value.split(',').map(email => email.trim()).filter(Boolean) 
                  }))}
                  placeholder="approver1@company.com, approver2@company.com"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="next-review">Next Review Date</Label>
                <Input
                  id="next-review"
                  type="date"
                  value={policyData.nextReviewDate}
                  onChange={(e) => setPolicyData(prev => ({ ...prev, nextReviewDate: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  When this policy should be reviewed next (typically annual)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select value={policyData.status} onValueChange={(value: any) => 
                  setPolicyData(prev => ({ ...prev, status: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_review">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Card className="p-4 bg-muted/30">
                <h4 className="font-medium mb-2">Approval Workflow</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Policy will be created in {policyData.status} status
                  </div>
                  {policyData.approvers.length > 0 && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Approval notifications will be sent to {policyData.approvers.length} approver(s)
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Review reminder will be scheduled for {policyData.nextReviewDate}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Review & Create Policy</h3>
              <p className="text-muted-foreground mb-4">
                Review your policy configuration before creating it.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Policy Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span>{policyData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary">{policyData.policyType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span>{policyData.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Effective Date:</span>
                    <span>{policyData.effectiveDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Review:</span>
                    <span>{policyData.nextReviewDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline">{policyData.status}</Badge>
                  </div>
                </div>
              </Card>

              {selectedTemplateData && (
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Template Sections Included</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplateData.sections.map(section => (
                      <Badge key={section} variant="outline" className="text-xs">
                        {section}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              <Card className="p-4">
                <h4 className="font-medium mb-3">Next Steps</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Policy will be created and assigned to owner
                  </li>
                  {policyData.approvers.length > 0 && (
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      Approval notifications will be sent to designated approvers
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Review reminder will be scheduled
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Policy Creation Wizard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {STEPS.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Steps navigation */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${
                  step.id === currentStep ? 'text-primary' : 
                  step.id < currentStep ? 'text-success' : 'text-muted-foreground'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id === currentStep ? 'bg-primary text-primary-foreground' :
                    step.id < currentStep ? 'bg-success text-success-foreground' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : step.icon}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-medium">{step.title}</p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
              >
                {loading ? 'Creating...' : 
                 currentStep === STEPS.length ? 'Create Policy' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}