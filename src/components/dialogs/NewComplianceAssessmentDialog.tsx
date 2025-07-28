import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Users, FileText, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewComplianceAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssessmentCreated?: () => void;
}

const complianceFrameworks = [
  { id: "gdpr", name: "GDPR", jurisdiction: "EU", icon: "🇪🇺", controls: 42 },
  { id: "hipaa", name: "HIPAA", jurisdiction: "US", icon: "🇺🇸", controls: 38 },
  { id: "iso27001", name: "ISO 27001", jurisdiction: "Global", icon: "🌍", controls: 114 },
  { id: "soc2", name: "SOC 2", jurisdiction: "US", icon: "🇺🇸", controls: 64 },
  { id: "pci-dss", name: "PCI DSS", jurisdiction: "Global", icon: "💳", controls: 78 },
  { id: "nist", name: "NIST Cybersecurity Framework", jurisdiction: "US", icon: "🇺🇸", controls: 98 },
  { id: "iso9001", name: "ISO 9001", jurisdiction: "Global", icon: "🌍", controls: 52 }
];

const assessmentTypes = [
  { id: "full", name: "Full Compliance Assessment", duration: "4-6 weeks", complexity: "Comprehensive" },
  { id: "gap", name: "Gap Analysis", duration: "2-3 weeks", complexity: "Focused" },
  { id: "readiness", name: "Audit Readiness Review", duration: "1-2 weeks", complexity: "Targeted" },
  { id: "surveillance", name: "Surveillance Assessment", duration: "1 week", complexity: "Maintenance" },
  { id: "custom", name: "Custom Assessment", duration: "Variable", complexity: "Tailored" }
];

export function NewComplianceAssessmentDialog({ 
  open, 
  onOpenChange, 
  onAssessmentCreated 
}: NewComplianceAssessmentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    framework: "",
    assessmentType: "",
    scope: "",
    objectives: "",
    plannedStartDate: "",
    plannedEndDate: "",
    leadAssessorEmail: "",
    stakeholders: [] as string[],
    priorityLevel: "medium",
    budgetRange: "",
    selectedControls: [] as string[],
    deliverables: [] as string[]
  });

  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!formData.title || !formData.framework || !formData.assessmentType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.user.id)
        .single();

      if (!profile?.organization_id) throw new Error("Organization not found");

      const selectedFramework = complianceFrameworks.find(f => f.id === formData.framework);
      const selectedType = assessmentTypes.find(t => t.id === formData.assessmentType);

      // Insert compliance assessment (using any to bypass type checking until types refresh)
      const { error } = await (supabase as any).from("compliance_assessments").insert({
        title: formData.title,
        description: formData.description,
        framework_id: formData.framework,
        framework_name: selectedFramework?.name,
        assessment_type: selectedType?.name,
        scope: formData.scope,
        objectives: formData.objectives?.split('\n').filter(obj => obj.trim()),
        planned_start_date: formData.plannedStartDate,
        planned_end_date: formData.plannedEndDate,
        lead_assessor_email: formData.leadAssessorEmail,
        stakeholders: formData.stakeholders,
        priority_level: formData.priorityLevel,
        budget_range: formData.budgetRange,
        selected_controls: formData.selectedControls,
        deliverables: formData.deliverables,
        status: "planned",
        organization_id: profile.organization_id,
        created_by: user.user.id
      });

      if (error) throw error;

      toast({
        title: "Assessment Scheduled",
        description: `${formData.title} has been successfully scheduled for ${selectedFramework?.name}.`,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        framework: "",
        assessmentType: "",
        scope: "",
        objectives: "",
        plannedStartDate: "",
        plannedEndDate: "",
        leadAssessorEmail: "",
        stakeholders: [],
        priorityLevel: "medium",
        budgetRange: "",
        selectedControls: [],
        deliverables: []
      });
      setStep(1);
      onOpenChange(false);
      onAssessmentCreated?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule assessment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Assessment Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Q1 2024 GDPR Compliance Assessment"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose and goals of this assessment..."
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Compliance Framework *</Label>
                <Select
                  value={formData.framework}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, framework: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    {complianceFrameworks.map((framework) => (
                      <SelectItem key={framework.id} value={framework.id}>
                        <div className="flex items-center space-x-2">
                          <span>{framework.icon}</span>
                          <span>{framework.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {framework.controls} controls
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assessment Type *</Label>
                <Select
                  value={formData.assessmentType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, assessmentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assessmentTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex flex-col">
                          <span>{type.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {type.duration} • {type.complexity}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select
                value={formData.priorityLevel}
                onValueChange={(value) => setFormData(prev => ({ ...prev, priorityLevel: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="critical">Critical Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scope">Assessment Scope</Label>
              <Textarea
                id="scope"
                value={formData.scope}
                onChange={(e) => setFormData(prev => ({ ...prev, scope: e.target.value }))}
                placeholder="Define what systems, processes, and controls will be included..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Assessment Objectives</Label>
              <Textarea
                id="objectives"
                value={formData.objectives}
                onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                placeholder="List the specific objectives (one per line)..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Planned Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.plannedStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, plannedStartDate: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Planned End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.plannedEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, plannedEndDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadAssessor">Lead Assessor Email</Label>
              <Input
                id="leadAssessor"
                type="email"
                value={formData.leadAssessorEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, leadAssessorEmail: e.target.value }))}
                placeholder="assessor@titanideconsulting.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Budget Range</Label>
              <Select
                value={formData.budgetRange}
                onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-25k">Under $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                  <SelectItem value="over-250k">Over $250,000</SelectItem>
                  <SelectItem value="custom">Custom Quote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        const selectedFramework = complianceFrameworks.find(f => f.id === formData.framework);
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Expected Deliverables</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Select the reports and deliverables you require
              </p>
              <div className="space-y-2">
                {[
                  "Executive Summary Report",
                  "Detailed Gap Analysis",
                  "Control Testing Results",
                  "Risk Assessment Matrix",
                  "Remediation Roadmap",
                  "Evidence Repository",
                  "Compliance Dashboard",
                  "Training Recommendations"
                ].map((deliverable) => (
                  <div key={deliverable} className="flex items-center space-x-2">
                    <Checkbox
                      id={deliverable}
                      checked={formData.deliverables.includes(deliverable)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData(prev => ({
                            ...prev,
                            deliverables: [...prev.deliverables, deliverable]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            deliverables: prev.deliverables.filter(d => d !== deliverable)
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={deliverable} className="text-sm">
                      {deliverable}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {selectedFramework && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Assessment Summary - {selectedFramework.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Controls:</span>
                    <span className="font-medium">{selectedFramework.controls}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Duration:</span>
                    <span className="font-medium">
                      {assessmentTypes.find(t => t.id === formData.assessmentType)?.duration || "TBD"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority Level:</span>
                    <span className="font-medium capitalize">{formData.priorityLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deliverables:</span>
                    <span className="font-medium">{formData.deliverables.length} selected</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Schedule New Compliance Assessment</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNumber === step
                      ? "bg-primary text-primary-foreground"
                      : stepNumber < step
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-8 h-px ${
                    stepNumber < step ? "bg-success" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            Step {step} of 3: {
              step === 1 ? "Basic Information" :
              step === 2 ? "Scope & Timeline" :
              "Deliverables & Review"
            }
          </div>

          {renderStepContent()}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : onOpenChange(false)}
            >
              {step > 1 ? "Previous" : "Cancel"}
            </Button>

            <div className="space-x-2">
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Schedule Assessment
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}