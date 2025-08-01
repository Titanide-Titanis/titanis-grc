import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle } from "lucide-react";

interface NewRiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRiskCreated?: () => void;
}

// Default category ID to assign when the risk dialog does not prompt for one.
// You can replace this with the UUID of a different category from the
// risk_categories table.
const DEFAULT_CATEGORY_ID = "c8185617-516c-4254-ac88-819bf513ade3";

export function NewRiskDialog({ open, onOpenChange, onRiskCreated }: NewRiskDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    likelihood: 3,
    impact: 3,
    mitigation_plan: "",
    owner_email: "",
  });

  const riskScore = formData.likelihood * formData.impact;

  const getRiskLevel = (score: number) => {
    if (score <= 6) return "low";
    if (score <= 12) return "medium";
    return "high";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Determine the current user and their organization
      const userResponse = await supabase.auth.getUser();
      const userId = userResponse.data.user?.id;
      if (!userId) {
        throw new Error("Unable to retrieve current user");
      }
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", userId)
        .single();
      if (profileError) throw profileError;
      if (!profile?.organization_id) {
        throw new Error("Organization not found");
      }

      // If an owner email is provided, look up that user's id; otherwise fall back to current user
      let ownerId = userId;
      if (formData.owner_email.trim()) {
        const { data: ownerProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", formData.owner_email.trim())
          .single();
        if (ownerProfile?.id) {
          ownerId = ownerProfile.id;
        }
      }

      // Insert the risk with required fields, using defaults for category and created_by
      const { error: insertError } = await supabase
        .from("risks")
        .insert({
          title: formData.title,
          description: formData.description,
          likelihood: formData.likelihood,
          impact: formData.impact,
          risk_score: riskScore,
          risk_level: getRiskLevel(riskScore),
          mitigation_plan: formData.mitigation_plan,
          organization_id: profile.organization_id,
          category_id: DEFAULT_CATEGORY_ID,
          created_by: userId,
          owner_id: ownerId,
          status: "open",
        });
      if (insertError) throw insertError;

      toast({
        title: "Risk Created Successfully",
        description: `${formData.title} has been added to the risk register.`,
      });
      // Reset form
      setFormData({
        title: "",
        description: "",
        likelihood: 3,
        impact: 3,
        mitigation_plan: "",
        owner_email: "",
      });
      onRiskCreated?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating risk:", error);
      toast({
        title: "Error Creating Risk",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span>New Risk Assessment</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Risk Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Data Breach via Third-Party Vendor"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Risk Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the potential risk scenario, impact, and affected systems..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="likelihood">Likelihood (1-5)</Label>
                <Select
                  value={formData.likelihood.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, likelihood: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Low</SelectItem>
                    <SelectItem value="2">2 - Low</SelectItem>
                    <SelectItem value="3">3 - Medium</SelectItem>
                    <SelectItem value="4">4 - High</SelectItem>
                    <SelectItem value="5">5 - Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="impact">Impact (1-5)</Label>
                <Select
                  value={formData.impact.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, impact: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Minimal</SelectItem>
                    <SelectItem value="2">2 - Minor</SelectItem>
                    <SelectItem value="3">3 - Moderate</SelectItem>
                    <SelectItem value="4">4 - Major</SelectItem>
                    <SelectItem value="5">5 - Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Risk Score:</span>
                <span
                  className={`font-bold text-lg ${
                    getRiskLevel(riskScore) === "high"
                      ? "text-danger"
                      : getRiskLevel(riskScore) === "medium"
                      ? "text-warning"
                      : "text-success"
                  }`}
                >
                  {riskScore} ({getRiskLevel(riskScore).toUpperCase()})
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="mitigation">Mitigation Plan</Label>
              <Textarea
                id="mitigation"
                placeholder="Describe the proposed mitigation strategies and controls..."
                value={formData.mitigation_plan}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mitigation_plan: e.target.value }))
                }
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="ownerEmail">Owner Email (optional)</Label>
              <Input
                id="ownerEmail"
                placeholder="Assign owner by email"
                value={formData.owner_email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, owner_email: e.target.value }))
                }
                type="email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Risk
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}