import { useState } from "react";
import { CheckCircle, FileText, Shield, Settings, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ComplianceWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssessmentCreated?: () => void;
}

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  category: string;
  controlCount: number;
  jurisdiction: string[];
}

const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  {
    id: 'iso-27001',
    name: 'ISO 27001',
    description: 'International standard for information security management systems',
    category: 'Information Security',
    controlCount: 114,
    jurisdiction: ['Global']
  },
  {
    id: 'soc2',
    name: 'SOC 2',
    description: 'Service Organization Control 2 for service providers',
    category: 'Compliance',
    controlCount: 64,
    jurisdiction: ['US']
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    description: 'General Data Protection Regulation for data privacy',
    category: 'Privacy',
    controlCount: 47,
    jurisdiction: ['EU']
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    description: 'Health Insurance Portability and Accountability Act',
    category: 'Healthcare',
    controlCount: 78,
    jurisdiction: ['US']
  },
  {
    id: 'pci-dss',
    name: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard',
    category: 'Payment',
    controlCount: 315,
    jurisdiction: ['Global']
  }
];

const STEPS = [
  { id: 1, title: "Framework Selection", icon: <Globe className="h-5 w-5" />, description: "Choose compliance frameworks" },
  { id: 2, title: "Assessment Scope", icon: <Settings className="h-5 w-5" />, description: "Define assessment parameters" },
  { id: 3, title: "Control Mapping", icon: <Shield className="h-5 w-5" />, description: "Map relevant controls" },
  { id: 4, title: "Review & Launch", icon: <CheckCircle className="h-5 w-5" />, description: "Finalize assessment" }
];

export function ComplianceWizard({ open, onOpenChange, onAssessmentCreated }: ComplianceWizardProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [assessmentData, setAssessmentData] = useState({
    title: '',
    description: '',
    scope: '',
    priority: 'medium',
    plannedStartDate: '',
    plannedEndDate: '',
    leadAssessor: '',
    objectives: [] as string[],
    stakeholders: [] as string[],
    budgetRange: '',
    deliverables: [] as string[]
  });

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
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
      const selectedFrameworkData = COMPLIANCE_FRAMEWORKS.filter(f => 
        selectedFrameworks.includes(f.id)
      );

      const { error } = await supabase
        .from('compliance_assessments')
        .insert({
          title: assessmentData.title,
          description: assessmentData.description,
          framework_id: selectedFrameworks[0], // Primary framework
          scope: assessmentData.scope,
          priority_level: assessmentData.priority,
          planned_start_date: assessmentData.plannedStartDate,
          planned_end_date: assessmentData.plannedEndDate,
          lead_assessor_email: assessmentData.leadAssessor,
          objectives: assessmentData.objectives,
          stakeholders: assessmentData.stakeholders,
          budget_range: assessmentData.budgetRange,
          deliverables: assessmentData.deliverables,
          selected_controls: selectedFrameworkData.map(f => f.name),
          status: 'planned',
          created_by: user?.id,
          organization_id: user?.user_metadata?.organization_id
        });

      if (error) throw error;

      onAssessmentCreated?.();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error creating compliance assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedFrameworks([]);
    setAssessmentData({
      title: '',
      description: '',
      scope: '',
      priority: 'medium',
      plannedStartDate: '',
      plannedEndDate: '',
      leadAssessor: '',
      objectives: [],
      stakeholders: [],
      budgetRange: '',
      deliverables: []
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return selectedFrameworks.length > 0;
      case 2:
        return assessmentData.title && assessmentData.scope && assessmentData.plannedStartDate;
      case 3:
        return assessmentData.objectives.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Compliance Frameworks</h3>
              <p className="text-muted-foreground mb-4">
                Choose the frameworks you need to assess compliance against.
              </p>
            </div>
            
            <div className="grid gap-4">
              {COMPLIANCE_FRAMEWORKS.map((framework) => (
                <Card 
                  key={framework.id}
                  className={`cursor-pointer transition-all ${
                    selectedFrameworks.includes(framework.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setSelectedFrameworks(prev => 
                      prev.includes(framework.id)
                        ? prev.filter(id => id !== framework.id)
                        : [...prev, framework.id]
                    );
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{framework.name}</CardTitle>
                        <CardDescription>{framework.description}</CardDescription>
                      </div>
                      <Checkbox 
                        checked={selectedFrameworks.includes(framework.id)}
                        onChange={() => {}}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {framework.controlCount} controls
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {framework.category}
                      </Badge>
                      <div className="flex gap-1">
                        {framework.jurisdiction.map(j => (
                          <Badge key={j} variant="outline" className="text-xs">
                            {j}
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
              <h3 className="text-lg font-semibold mb-2">Assessment Scope & Details</h3>
              <p className="text-muted-foreground mb-4">
                Define the scope and timeline for your compliance assessment.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Assessment Title</Label>
                <Input
                  id="title"
                  value={assessmentData.title}
                  onChange={(e) => setAssessmentData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Q1 2024 ISO 27001 Compliance Assessment"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={assessmentData.description}
                  onChange={(e) => setAssessmentData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose and goals of this assessment..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scope">Assessment Scope</Label>
                <Textarea
                  id="scope"
                  value={assessmentData.scope}
                  onChange={(e) => setAssessmentData(prev => ({ ...prev, scope: e.target.value }))}
                  placeholder="Define what systems, processes, and departments will be included..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Planned Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={assessmentData.plannedStartDate}
                    onChange={(e) => setAssessmentData(prev => ({ ...prev, plannedStartDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Planned End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={assessmentData.plannedEndDate}
                    onChange={(e) => setAssessmentData(prev => ({ ...prev, plannedEndDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={assessmentData.priority} onValueChange={(value) => 
                    setAssessmentData(prev => ({ ...prev, priority: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select value={assessmentData.budgetRange} onValueChange={(value) => 
                    setAssessmentData(prev => ({ ...prev, budgetRange: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-10k">Under $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="over-100k">Over $100,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-assessor">Lead Assessor Email</Label>
                <Input
                  id="lead-assessor"
                  type="email"
                  value={assessmentData.leadAssessor}
                  onChange={(e) => setAssessmentData(prev => ({ ...prev, leadAssessor: e.target.value }))}
                  placeholder="assessor@company.com"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        const selectedFrameworkData = COMPLIANCE_FRAMEWORKS.filter(f => 
          selectedFrameworks.includes(f.id)
        );
        
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Control Mapping & Planning</h3>
              <p className="text-muted-foreground mb-4">
                Review the selected frameworks and define assessment objectives.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Selected Frameworks</h4>
                <div className="grid gap-3">
                  {selectedFrameworkData.map((framework) => (
                    <Card key={framework.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{framework.name}</h5>
                          <p className="text-sm text-muted-foreground">{framework.description}</p>
                        </div>
                        <Badge variant="secondary">
                          {framework.controlCount} controls
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Assessment Objectives</Label>
                <Textarea
                  value={assessmentData.objectives.join('\n')}
                  onChange={(e) => setAssessmentData(prev => ({ 
                    ...prev, 
                    objectives: e.target.value.split('\n').filter(Boolean) 
                  }))}
                  placeholder="Enter each objective on a new line..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Key Stakeholders</Label>
                <Textarea
                  value={assessmentData.stakeholders.join('\n')}
                  onChange={(e) => setAssessmentData(prev => ({ 
                    ...prev, 
                    stakeholders: e.target.value.split('\n').filter(Boolean) 
                  }))}
                  placeholder="Enter stakeholder names/roles on separate lines..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Expected Deliverables</Label>
                <Textarea
                  value={assessmentData.deliverables.join('\n')}
                  onChange={(e) => setAssessmentData(prev => ({ 
                    ...prev, 
                    deliverables: e.target.value.split('\n').filter(Boolean) 
                  }))}
                  placeholder="Enter expected deliverables on separate lines..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Review & Launch Assessment</h3>
              <p className="text-muted-foreground mb-4">
                Review your assessment configuration before launching.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Assessment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span>{assessmentData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timeline:</span>
                    <span>{assessmentData.plannedStartDate} to {assessmentData.plannedEndDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge variant="secondary">{assessmentData.priority}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lead Assessor:</span>
                    <span>{assessmentData.leadAssessor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frameworks:</span>
                    <span>{selectedFrameworks.length} selected</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">Next Steps</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Assessment will be created and stakeholders notified
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Control mappings will be generated automatically
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Evidence collection workflows will be initialized
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
            Compliance Assessment Wizard
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
                 currentStep === STEPS.length ? 'Create Assessment' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}