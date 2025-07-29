import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, FileText, Users, Target, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface IncidentWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIncidentCreated?: () => void;
}

const STEPS = [
  { id: 1, title: "Incident Details", icon: AlertTriangle, description: "Report incident basics" },
  { id: 2, title: "Impact Assessment", icon: Target, description: "Assess severity and impact" },
  { id: 3, title: "Response Team", icon: Users, description: "Assign response team" },
  { id: 4, title: "Action Plan", icon: FileText, description: "Define response actions" },
  { id: 5, title: "Review & Submit", icon: CheckCircle, description: "Confirm incident report" }
];

const INCIDENT_TYPES = [
  "Data Breach", "System Outage", "Security Incident", "Compliance Violation", 
  "Operational Failure", "Natural Disaster", "Fraud", "Other"
];

const SEVERITY_LEVELS = ["Low", "Medium", "High", "Critical"];
const IMPACT_AREAS = ["Data", "Systems", "Operations", "Reputation", "Financial", "Legal"];
const RESPONSE_ACTIONS = [
  "Immediate containment", "Investigation", "Notification to authorities", 
  "Customer communication", "System restoration", "Evidence preservation",
  "Legal review", "Media response"
];

export function IncidentWizard({ open, onOpenChange, onIncidentCreated }: IncidentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    severity: "",
    detectedAt: "",
    reportedBy: "",
    location: "",
    impactAreas: [] as string[],
    estimatedImpact: "",
    responseTeam: [] as string[],
    immediateActions: [] as string[],
    timeline: "",
    containmentPlan: "",
    communicationPlan: ""
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
      toast.success("Incident report created successfully!");
      onIncidentCreated?.();
      onOpenChange(false);
      setCurrentStep(1);
      setFormData({
        title: "",
        description: "",
        type: "",
        severity: "",
        detectedAt: "",
        reportedBy: "",
        location: "",
        impactAreas: [],
        estimatedImpact: "",
        responseTeam: [],
        immediateActions: [],
        timeline: "",
        containmentPlan: "",
        communicationPlan: ""
      });
    } catch (error) {
      toast.error("Failed to create incident report");
    }
  };

  const toggleItem = (item: string, field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? (prev[field] as string[]).includes(item)
          ? (prev[field] as string[]).filter(i => i !== item)
          : [...(prev[field] as string[]), item]
        : [item]
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.type && formData.severity && formData.detectedAt;
      case 2:
        return formData.impactAreas.length > 0;
      case 3:
        return formData.responseTeam.length > 0;
      case 4:
        return formData.immediateActions.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "text-red-600 bg-red-50 border-red-200";
      case "High": return "text-orange-600 bg-orange-50 border-orange-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Incident Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the incident"
              />
            </div>
            <div>
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about what happened..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Incident Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCIDENT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="severity">Severity Level</Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITY_LEVELS.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="detectedAt">Detection Time</Label>
                <Input
                  id="detectedAt"
                  type="datetime-local"
                  value={formData.detectedAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, detectedAt: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="reportedBy">Reported By</Label>
                <Input
                  id="reportedBy"
                  value={formData.reportedBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, reportedBy: e.target.value }))}
                  placeholder="Who reported this incident?"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Impact Areas</Label>
              <p className="text-sm text-muted-foreground">Select all areas affected by this incident</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {IMPACT_AREAS.map(area => (
                <div
                  key={area}
                  onClick={() => toggleItem(area, 'impactAreas')}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.impactAreas.includes(area)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{area}</span>
                    {formData.impactAreas.includes(area) && (
                      <Badge variant="secondary">Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="estimatedImpact">Estimated Impact</Label>
              <Textarea
                id="estimatedImpact"
                value={formData.estimatedImpact}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedImpact: e.target.value }))}
                placeholder="Describe the estimated business impact..."
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Response Team Members</Label>
              <p className="text-sm text-muted-foreground">Assign team members to handle this incident</p>
            </div>
            {["Incident Commander", "Technical Lead", "Communications Lead", "Legal Counsel", "HR Representative", "Security Analyst"].map(role => (
              <div
                key={role}
                onClick={() => toggleItem(role, 'responseTeam')}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  formData.responseTeam.includes(role)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{role}</span>
                  {formData.responseTeam.includes(role) && (
                    <Badge variant="secondary">Assigned</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Immediate Actions Required</Label>
              <p className="text-sm text-muted-foreground">Select all actions that need immediate attention</p>
            </div>
            <div className="space-y-2">
              {RESPONSE_ACTIONS.map(action => (
                <div
                  key={action}
                  onClick={() => toggleItem(action, 'immediateActions')}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.immediateActions.includes(action)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{action}</span>
                    {formData.immediateActions.includes(action) && (
                      <Badge variant="secondary">Required</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="containmentPlan">Containment Plan</Label>
              <Textarea
                id="containmentPlan"
                value={formData.containmentPlan}
                onChange={(e) => setFormData(prev => ({ ...prev, containmentPlan: e.target.value }))}
                placeholder="Describe the containment strategy..."
                rows={3}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Review Incident Report</h3>
              <p className="text-muted-foreground">Please review before submitting</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Incident Details</Label>
                <div className="mt-1 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{formData.title}</span>
                    <Badge className={getSeverityColor(formData.severity)}>
                      {formData.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{formData.type}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Impact Areas ({formData.impactAreas.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.impactAreas.map(area => (
                    <Badge key={area} variant="secondary">{area}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Response Team ({formData.responseTeam.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.responseTeam.map(member => (
                    <Badge key={member} variant="outline">{member}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Immediate Actions ({formData.immediateActions.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.immediateActions.map(action => (
                    <Badge key={action} variant="secondary">{action}</Badge>
                  ))}
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
            <AlertTriangle className="w-5 h-5" />
            Create Incident Report
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
                  Submit Report
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