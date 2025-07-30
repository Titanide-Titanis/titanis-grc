import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, FileText, Users, Settings, Target, Shield, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AuditWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuditCreated?: () => void;
}

const STEPS = [
  { id: 1, title: "Audit Details", icon: FileText, description: "Define audit scope and objectives" },
  { id: 2, title: "Framework Selection", icon: Shield, description: "Choose compliance frameworks" },
  { id: 3, title: "Control Selection", icon: Target, description: "Select controls to assess" },
  { id: 4, title: "Timeline & Resources", icon: Clock, description: "Set schedule and assign team" },
  { id: 5, title: "Review & Create", icon: CheckCircle, description: "Confirm audit configuration" }
];

const FRAMEWORKS = ["SOX", "ISO 27001", "NIST", "GDPR", "HIPAA", "PCI DSS"];
const AUDIT_TYPES = ["Internal", "External", "Compliance", "Operational", "IT"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export function AuditWizard({ open, onOpenChange, onAuditCreated }: AuditWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    priority: "",
    frameworks: [] as string[],
    controls: [] as string[],
    startDate: "",
    endDate: "",
    auditor: "",
    team: [] as string[],
    objectives: "",
    scope: ""
  });

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would submit to Supabase
      toast.success("Audit created successfully!");
      onAuditCreated?.();
      onOpenChange(false);
      setCurrentStep(1);
      setFormData({
        title: "",
        description: "",
        type: "",
        priority: "",
        frameworks: [],
        controls: [],
        startDate: "",
        endDate: "",
        auditor: "",
        team: [],
        objectives: "",
        scope: ""
      });
    } catch (error) {
      toast.error("Failed to create audit");
    }
  };

  const toggleFramework = (framework: string) => {
    setFormData(prev => ({
      ...prev,
      frameworks: prev.frameworks.includes(framework)
        ? prev.frameworks.filter(f => f !== framework)
        : [...prev.frameworks, framework]
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.type && formData.priority;
      case 2:
        return formData.frameworks.length > 0;
      case 3:
        return formData.controls.length > 0;
      case 4:
        return formData.startDate && formData.endDate && formData.auditor;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Audit Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Q4 2024 SOX Compliance Audit"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the audit purpose and scope..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Audit Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {AUDIT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Compliance Frameworks</Label>
              <p className="text-sm text-muted-foreground">Choose the frameworks this audit will assess</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {FRAMEWORKS.map(framework => (
                <div
                  key={framework}
                  onClick={() => toggleFramework(framework)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.frameworks.includes(framework)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{framework}</span>
                    {formData.frameworks.includes(framework) && (
                      <Badge variant="secondary">Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Control Categories</Label>
              <p className="text-sm text-muted-foreground">Select control categories to include in this audit</p>
            </div>
            <div className="space-y-2">
              {["Access Controls", "Data Protection", "Change Management", "Risk Assessment", "Incident Response", "Business Continuity"].map(control => (
                <div
                  key={control}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      controls: prev.controls.includes(control)
                        ? prev.controls.filter(c => c !== control)
                        : [...prev.controls, control]
                    }));
                  }}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.controls.includes(control)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{control}</span>
                    {formData.controls.includes(control) && (
                      <Badge variant="secondary">Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="auditor">Lead Auditor</Label>
              <Input
                id="auditor"
                value={formData.auditor}
                onChange={(e) => setFormData(prev => ({ ...prev, auditor: e.target.value }))}
                placeholder="Assign lead auditor"
              />
            </div>
            <div>
              <Label htmlFor="objectives">Audit Objectives</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                placeholder="Define specific objectives for this audit..."
                rows={3}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Review Audit Configuration</h3>
              <p className="text-muted-foreground">Please review the audit details before creating</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <p className="text-sm">{formData.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm">{formData.type}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Frameworks ({formData.frameworks.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.frameworks.map(framework => (
                    <Badge key={framework} variant="secondary">{framework}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Controls ({formData.controls.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.controls.map(control => (
                    <Badge key={control} variant="outline">{control}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm">{formData.startDate} to {formData.endDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Lead Auditor</Label>
                  <p className="text-sm">{formData.auditor}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create New Audit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of {STEPS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center space-y-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted ? 'bg-primary border-primary text-primary-foreground' :
                    isActive ? 'border-primary text-primary' : 'border-muted text-muted-foreground'
                  }`}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs text-center max-w-[80px] ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              
              {currentStep === STEPS.length ? (
                <Button onClick={handleSubmit} disabled={!isStepValid()}>
                  Create Audit
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}