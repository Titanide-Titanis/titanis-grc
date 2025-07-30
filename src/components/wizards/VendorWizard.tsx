import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building, FileText, Shield, Users, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useWizardSession } from "@/hooks/useWizardSession";

interface VendorWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorCreated?: () => void;
}

const STEPS = [
  { id: 1, title: "Basic Information", icon: Building, description: "Vendor details and contact" },
  { id: 2, title: "Services & Contract", icon: FileText, description: "Services and contract terms" },
  { id: 3, title: "Risk Assessment", icon: Shield, description: "Evaluate vendor risks" },
  { id: 4, title: "Compliance Check", icon: Users, description: "Verify compliance requirements" },
  { id: 5, title: "Review & Onboard", icon: CheckCircle, description: "Complete vendor onboarding" }
];

const VENDOR_CATEGORIES = [
  "Technology", "Professional Services", "Manufacturing", "Logistics", 
  "Financial Services", "Healthcare", "Legal", "Marketing", "Other"
];

const SERVICE_TYPES = [
  "Cloud Services", "Software Licensing", "Consulting", "Support Services",
  "Data Processing", "Infrastructure", "Security Services", "Training"
];

const RISK_FACTORS = [
  "Data Access", "Critical System Access", "Financial Data", "Customer Data",
  "Intellectual Property", "Regulatory Compliance", "Geographic Location", "Third-party Dependencies"
];

const COMPLIANCE_FRAMEWORKS = [
  "SOC 2", "ISO 27001", "GDPR", "HIPAA", "PCI DSS", "NIST", "SOX"
];

export function VendorWizard({ open, onOpenChange, onVendorCreated }: VendorWizardProps) {
  const { user, profile } = useAuth();
  const { createSession, updateSessionProgress, completeSession, cancelSession, isLoading: sessionLoading } = useWizardSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    website: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    description: "",
    services: [] as string[],
    contractValue: "",
    contractStart: "",
    contractEnd: "",
    paymentTerms: "",
    riskFactors: [] as string[],
    riskLevel: "",
    riskMitigation: "",
    dataAccess: "",
    complianceFrameworks: [] as string[],
    certifications: "",
    dueDiligence: "",
    approvalStatus: ""
  });

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      
      // Update session progress
      if (sessionId) {
        await updateSessionProgress(sessionId, {
          currentStep: currentStep + 1,
          stepData: { [`step_${currentStep}`]: formData },
          formData: formData
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Complete wizard session
      if (sessionId) {
        await completeSession(sessionId, {
          formInputs: formData,
          completionMetrics: {
            totalSteps: STEPS.length,
            completedSteps: STEPS.length,
            startTimestamp: new Date().toISOString(),
            endTimestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          },
          generatedArtifacts: {
            summaries: [`Onboarded vendor: ${formData.name}`]
          },
          outcomeStatus: 'success',
          context: {
            browserInfo: navigator.userAgent,
            deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop',
            userRole: profile?.role || 'user'
          }
        }, `Vendor "${formData.name}" onboarding completed successfully with ${formData.riskLevel} risk level.`);
      }
      
      toast.success("Vendor onboarding completed successfully!");
      onVendorCreated?.();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to complete vendor onboarding");
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSessionId(null);
    setFormData({
      name: "",
      category: "",
      website: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      description: "",
      services: [],
      contractValue: "",
      contractStart: "",
      contractEnd: "",
      paymentTerms: "",
      riskFactors: [],
      riskLevel: "",
      riskMitigation: "",
      dataAccess: "",
      complianceFrameworks: [],
      certifications: "",
      dueDiligence: "",
      approvalStatus: ""
    });
  };

  // Create session when wizard opens
  useEffect(() => {
    if (open && !sessionId) {
      const initSession = async () => {
        const newSessionId = await createSession('vendor', {
          currentStep: 1,
          formData: formData
        });
        setSessionId(newSessionId);
      };
      initSession();
    }
  }, [open, sessionId, createSession, formData]);

  // Handle wizard close/cancel
  const handleCancel = async () => {
    if (sessionId) {
      await cancelSession(sessionId, 'User cancelled the vendor wizard');
    }
    onOpenChange(false);
    resetForm();
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
        return formData.name && formData.category && formData.contactEmail;
      case 2:
        return formData.services.length > 0 && formData.contractValue;
      case 3:
        return formData.riskFactors.length > 0 && formData.riskLevel;
      case 4:
        return formData.complianceFrameworks.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
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
              <Label htmlFor="name">Vendor Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter vendor company name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {VENDOR_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://vendor-website.com"
                />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Primary Contact</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Primary contact person"
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="contact@vendor.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Services Provided</Label>
              <p className="text-sm text-muted-foreground">Select all services this vendor will provide</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SERVICE_TYPES.map(service => (
                <div
                  key={service}
                  onClick={() => toggleItem(service, 'services')}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.services.includes(service)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{service}</span>
                    {formData.services.includes(service) && (
                      <Badge variant="secondary">Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contractValue">Annual Contract Value</Label>
                <Input
                  id="contractValue"
                  value={formData.contractValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, contractValue: e.target.value }))}
                  placeholder="$100,000"
                />
              </div>
              <div>
                <Label htmlFor="contractStart">Contract Start</Label>
                <Input
                  id="contractStart"
                  type="date"
                  value={formData.contractStart}
                  onChange={(e) => setFormData(prev => ({ ...prev, contractStart: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="contractEnd">Contract End</Label>
                <Input
                  id="contractEnd"
                  type="date"
                  value={formData.contractEnd}
                  onChange={(e) => setFormData(prev => ({ ...prev, contractEnd: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Service Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of services to be provided..."
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Risk Factors</Label>
              <p className="text-sm text-muted-foreground">Identify potential risk areas for this vendor</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {RISK_FACTORS.map(factor => (
                <div
                  key={factor}
                  onClick={() => toggleItem(factor, 'riskFactors')}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.riskFactors.includes(factor)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{factor}</span>
                    {formData.riskFactors.includes(factor) && (
                      <Badge variant="secondary">Identified</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="riskLevel">Overall Risk Level</Label>
              <Select value={formData.riskLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, riskLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Assess overall risk" />
                </SelectTrigger>
                <SelectContent>
                  {["Low", "Medium", "High", "Critical"].map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="riskMitigation">Risk Mitigation Plan</Label>
              <Textarea
                id="riskMitigation"
                value={formData.riskMitigation}
                onChange={(e) => setFormData(prev => ({ ...prev, riskMitigation: e.target.value }))}
                placeholder="Describe how identified risks will be mitigated..."
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Required Compliance Frameworks</Label>
              <p className="text-sm text-muted-foreground">Select frameworks the vendor must comply with</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {COMPLIANCE_FRAMEWORKS.map(framework => (
                <div
                  key={framework}
                  onClick={() => toggleItem(framework, 'complianceFrameworks')}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    formData.complianceFrameworks.includes(framework)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{framework}</span>
                    {formData.complianceFrameworks.includes(framework) && (
                      <Badge variant="secondary">Required</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="certifications">Current Certifications</Label>
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
                placeholder="List current certifications and compliance status..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="dueDiligence">Due Diligence Notes</Label>
              <Textarea
                id="dueDiligence"
                value={formData.dueDiligence}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDiligence: e.target.value }))}
                placeholder="Additional due diligence findings and notes..."
                rows={3}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Review Vendor Information</h3>
              <p className="text-muted-foreground">Confirm all details before completing onboarding</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Vendor Name</Label>
                  <p className="text-sm">{formData.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm">{formData.category}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Services ({formData.services.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.services.map(service => (
                    <Badge key={service} variant="secondary">{service}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Contract Value</Label>
                  <p className="text-sm">{formData.contractValue}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Risk Level</Label>
                  <Badge className={getRiskColor(formData.riskLevel)}>
                    {formData.riskLevel}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Compliance Requirements ({formData.complianceFrameworks.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.complianceFrameworks.map(framework => (
                    <Badge key={framework} variant="outline">{framework}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Risk Factors ({formData.riskFactors.length})</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.riskFactors.map(factor => (
                    <Badge key={factor} variant="secondary">{factor}</Badge>
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
            <Building className="w-5 h-5" />
            Vendor Onboarding Wizard
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
          <div className="min-h-[350px]">
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
                  Complete Onboarding
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