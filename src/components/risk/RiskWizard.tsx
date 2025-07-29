import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Shield, Target, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RiskWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRiskCreated?: () => void;
}

const STEPS = [
  { id: 1, title: "Risk Identification", icon: AlertTriangle, description: "Identify and describe the risk" },
  { id: 2, title: "Risk Assessment", icon: Target, description: "Assess likelihood and impact" },
  { id: 3, title: "Risk Analysis", icon: Shield, description: "Analyze inherent vs residual risk" },
  { id: 4, title: "Mitigation Planning", icon: FileText, description: "Plan risk mitigation strategies" },
  { id: 5, title: "Review & Submit", icon: CheckCircle, description: "Review and finalize assessment" }
];

const RISK_CATEGORIES = [
  { value: "operational", label: "Operational Risk" },
  { value: "financial", label: "Financial Risk" },
  { value: "strategic", label: "Strategic Risk" },
  { value: "compliance", label: "Compliance Risk" },
  { value: "technology", label: "Technology Risk" },
  { value: "reputational", label: "Reputational Risk" },
  { value: "security", label: "Security Risk" },
  { value: "environmental", label: "Environmental Risk" }
];

const LIKELIHOOD_LEVELS = [
  { value: 1, label: "Very Low", description: "Extremely unlikely to occur (0-5%)" },
  { value: 2, label: "Low", description: "Unlikely to occur (6-25%)" },
  { value: 3, label: "Medium", description: "Moderately likely to occur (26-50%)" },
  { value: 4, label: "High", description: "Likely to occur (51-75%)" },
  { value: 5, label: "Very High", description: "Almost certain to occur (76-100%)" }
];

const IMPACT_LEVELS = [
  { value: 1, label: "Very Low", description: "Minimal impact on operations" },
  { value: 2, label: "Low", description: "Minor impact, easily manageable" },
  { value: 3, label: "Medium", description: "Moderate impact, requires attention" },
  { value: 4, label: "High", description: "Significant impact, serious concern" },
  { value: 5, label: "Very High", description: "Severe impact, major disruption" }
];

export const RiskWizard: React.FC<RiskWizardProps> = ({ open, onOpenChange, onRiskCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    likelihood: 3,
    impact: 3,
    inherentLikelihood: 3,
    inherentImpact: 3,
    mitigationPlan: "",
    controlMeasures: "",
    ownerEmail: "",
    reviewDate: "",
    actionItems: ""
  });

  const calculateRiskScore = (likelihood: number, impact: number) => likelihood * impact;
  const calculateRiskLevel = (score: number): "low" | "medium" | "high" | "critical" => {
    if (score <= 4) return "low";
    if (score <= 9) return "medium";
    if (score <= 16) return "high";
    return "critical";
  };

  const getCurrentRiskScore = () => calculateRiskScore(formData.likelihood, formData.impact);
  const getInherentRiskScore = () => calculateRiskScore(formData.inherentLikelihood, formData.inherentImpact);

  const currentRiskScore = getCurrentRiskScore();
  const inherentRiskScore = getInherentRiskScore();
  const currentRiskLevel = calculateRiskLevel(currentRiskScore);
  const inherentRiskLevel = calculateRiskLevel(inherentRiskScore);

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({ title: "Error", description: "You must be logged in to create a risk assessment.", variant: "destructive" });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.user.id)
        .single();

      if (!profile?.organization_id) {
        toast({ title: "Error", description: "Organization not found. Please contact support.", variant: "destructive" });
        return;
      }

      const riskData = {
        title: formData.title,
        description: formData.description,
        likelihood: formData.likelihood,
        impact: formData.impact,
        risk_score: currentRiskScore,
        risk_level: currentRiskLevel as "low" | "medium" | "high" | "critical",
        mitigation_plan: formData.mitigationPlan,
        organization_id: profile.organization_id,
        created_by: user.user.id,
        status: "open" as "open" | "in_progress" | "closed" | "mitigated" | "accepted",
        next_review_date: formData.reviewDate ? new Date(formData.reviewDate).toISOString().split('T')[0] : null
      };

      const { error } = await supabase.from("risks").insert([riskData]);

      if (error) throw error;

      toast({
        title: "Risk Assessment Created",
        description: `Risk "${formData.title}" has been successfully created with a ${currentRiskLevel.charAt(0).toUpperCase() + currentRiskLevel.slice(1)} risk level.`,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        likelihood: 3,
        impact: 3,
        inherentLikelihood: 3,
        inherentImpact: 3,
        mitigationPlan: "",
        controlMeasures: "",
        ownerEmail: "",
        reviewDate: "",
        actionItems: ""
      });
      setCurrentStep(1);
      onOpenChange(false);
      onRiskCreated?.();
    } catch (error) {
      console.error("Error creating risk:", error);
      toast({
        title: "Error",
        description: "Failed to create risk assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() !== "" && formData.description.trim() !== "" && formData.category !== "";
      case 2:
        return true; // Risk assessment always has default values
      case 3:
        return true; // Risk analysis always has default values
      case 4:
        return formData.mitigationPlan.trim() !== "";
      case 5:
        return true; // Review step
      default:
        return false;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Risk Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Data breach due to weak authentication"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Risk Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a detailed description of the risk, including potential causes and scenarios..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="category">Risk Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a risk category" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Risk Assessment Matrix</h3>
              <p className="text-sm text-muted-foreground">Assess the likelihood and impact of the risk occurring</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Likelihood</CardTitle>
                  <CardDescription>How likely is this risk to occur?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={formData.likelihood.toString()} onValueChange={(value) => setFormData({ ...formData, likelihood: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LIKELIHOOD_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{level.label}</span>
                            <span className="text-xs text-muted-foreground">{level.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Impact</CardTitle>
                  <CardDescription>What would be the impact if this risk occurred?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={formData.impact.toString()} onValueChange={(value) => setFormData({ ...formData, impact: parseInt(value) })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {IMPACT_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value.toString()}>
                          <div className="flex flex-col">
                            <span className="font-medium">{level.label}</span>
                            <span className="text-xs text-muted-foreground">{level.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base">Current Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Score: {currentRiskScore} ({formData.likelihood} × {formData.impact})</p>
                  </div>
                  <Badge className={getRiskColor(currentRiskLevel)}>{currentRiskLevel.charAt(0).toUpperCase() + currentRiskLevel.slice(1)} Risk</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Risk Analysis</h3>
              <p className="text-sm text-muted-foreground">Compare inherent risk vs. current (residual) risk after controls</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inherent Risk</CardTitle>
                  <CardDescription>Risk level without any controls or mitigation measures</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Inherent Likelihood</Label>
                    <Select value={formData.inherentLikelihood.toString()} onValueChange={(value) => setFormData({ ...formData, inherentLikelihood: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LIKELIHOOD_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value.toString()}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Inherent Impact</Label>
                    <Select value={formData.inherentImpact.toString()} onValueChange={(value) => setFormData({ ...formData, inherentImpact: parseInt(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IMPACT_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value.toString()}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium">Inherent Risk Score: {inherentRiskScore}</p>
                    <Badge className={getRiskColor(inherentRiskLevel)}>{inherentRiskLevel.charAt(0).toUpperCase() + inherentRiskLevel.slice(1)} Risk</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Current (Residual) Risk</CardTitle>
                  <CardDescription>Risk level after existing controls and mitigation measures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">Current Risk Score: {currentRiskScore}</p>
                      <Badge className={getRiskColor(currentRiskLevel)}>{currentRiskLevel.charAt(0).toUpperCase() + currentRiskLevel.slice(1)} Risk</Badge>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium">Risk Reduction</p>
                      <p className="text-lg font-bold text-green-600">
                        {((inherentRiskScore - currentRiskScore) / inherentRiskScore * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        From {inherentRiskScore} to {currentRiskScore}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Mitigation Planning</h3>
              <p className="text-sm text-muted-foreground">Define strategies and actions to further reduce risk</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="mitigationPlan">Mitigation Strategy *</Label>
                <Textarea
                  id="mitigationPlan"
                  value={formData.mitigationPlan}
                  onChange={(e) => setFormData({ ...formData, mitigationPlan: e.target.value })}
                  placeholder="Describe the overall strategy to mitigate this risk..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="controlMeasures">Control Measures</Label>
                <Textarea
                  id="controlMeasures"
                  value={formData.controlMeasures}
                  onChange={(e) => setFormData({ ...formData, controlMeasures: e.target.value })}
                  placeholder="List specific control measures and safeguards..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="actionItems">Action Items</Label>
                <Textarea
                  id="actionItems"
                  value={formData.actionItems}
                  onChange={(e) => setFormData({ ...formData, actionItems: e.target.value })}
                  placeholder="List specific action items with owners and deadlines..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerEmail">Risk Owner Email</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                    placeholder="risk.owner@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="reviewDate">Next Review Date</Label>
                  <Input
                    id="reviewDate"
                    type="date"
                    value={formData.reviewDate}
                    onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Review & Submit</h3>
              <p className="text-sm text-muted-foreground">Review all information before submitting the risk assessment</p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Risk Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium">Title:</span> {formData.title}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {RISK_CATEGORIES.find(c => c.value === formData.category)?.label}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span> {formData.description}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Likelihood:</span> {LIKELIHOOD_LEVELS.find(l => l.value === formData.likelihood)?.label} ({formData.likelihood})
                    </div>
                    <div>
                      <span className="font-medium">Impact:</span> {IMPACT_LEVELS.find(i => i.value === formData.impact)?.label} ({formData.impact})
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Risk Level:</span>
                    <Badge className={getRiskColor(currentRiskLevel)}>{currentRiskLevel.charAt(0).toUpperCase() + currentRiskLevel.slice(1)} Risk (Score: {currentRiskScore})</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Mitigation Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{formData.mitigationPlan}</p>
                </CardContent>
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
            <Shield className="h-5 w-5" />
            Risk Assessment Wizard
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

          {/* Step Navigation */}
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap
                    ${isActive ? "bg-primary text-primary-foreground" : 
                      isCompleted ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}
                  `}>
                    <StepIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{step.title}</span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="w-8 flex justify-center">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              
              {currentStep === STEPS.length ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isLoading || !isStepValid()}
                  className="flex items-center gap-2"
                >
                  {isLoading ? "Creating..." : "Create Risk Assessment"}
                  <CheckCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleNext} 
                  disabled={!isStepValid()}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};