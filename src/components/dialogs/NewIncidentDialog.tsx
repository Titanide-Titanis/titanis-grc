import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle, Calendar } from "lucide-react";

interface NewIncidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIncidentCreated?: () => void;
}

export function NewIncidentDialog({ open, onOpenChange, onIncidentCreated }: NewIncidentDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    incident_type: "",
    severity: "medium",
    affected_systems: "",
    impact_description: "",
    occurred_at: "",
    due_date: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!profile?.organization_id) {
        throw new Error('Organization not found');
      }

      const systemsArray = formData.affected_systems
        .split(',')
        .map(system => system.trim())
        .filter(system => system.length > 0);

      const { error } = await supabase
        .from('incidents')
        .insert({
          title: formData.title,
          description: formData.description,
          incident_type: formData.incident_type,
          severity: formData.severity as "low" | "medium" | "high" | "critical",
          affected_systems: systemsArray.length > 0 ? systemsArray : null,
          impact_description: formData.impact_description,
          occurred_at: formData.occurred_at ? new Date(formData.occurred_at).toISOString() : null,
          due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
          organization_id: profile.organization_id,
          reporter_id: profile.id,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: "Incident Reported Successfully",
        description: `${formData.title} has been logged and assigned for investigation.`,
      });

      setFormData({
        title: "",
        description: "",
        incident_type: "",
        severity: "medium",
        affected_systems: "",
        impact_description: "",
        occurred_at: "",
        due_date: ""
      });
      
      onIncidentCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating incident:', error);
      toast({
        title: "Error Reporting Incident",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-danger" />
            <span>Report New Incident</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Incident Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Unauthorized Access to Customer Database"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incident_type">Incident Type</Label>
                <Select 
                  value={formData.incident_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, incident_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Security Breach">Security Breach</SelectItem>
                    <SelectItem value="Data Loss">Data Loss</SelectItem>
                    <SelectItem value="System Outage">System Outage</SelectItem>
                    <SelectItem value="Privacy Violation">Privacy Violation</SelectItem>
                    <SelectItem value="Compliance Violation">Compliance Violation</SelectItem>
                    <SelectItem value="Operational Failure">Operational Failure</SelectItem>
                    <SelectItem value="Third-Party Issue">Third-Party Issue</SelectItem>
                    <SelectItem value="Physical Security">Physical Security</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="severity">Severity Level</Label>
                <Select 
                  value={formData.severity} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
                >
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
            </div>

            <div>
              <Label htmlFor="description">Incident Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of what happened, when it was discovered, and current status..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="affected_systems">Affected Systems (comma-separated)</Label>
              <Input
                id="affected_systems"
                placeholder="e.g., Customer Database, Web Portal, Email System"
                value={formData.affected_systems}
                onChange={(e) => setFormData(prev => ({ ...prev, affected_systems: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="impact_description">Impact Description</Label>
              <Textarea
                id="impact_description"
                placeholder="Describe the business impact, affected users, financial implications, etc..."
                value={formData.impact_description}
                onChange={(e) => setFormData(prev => ({ ...prev, impact_description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occurred_at">When Did This Occur?</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="occurred_at"
                    type="datetime-local"
                    value={formData.occurred_at}
                    onChange={(e) => setFormData(prev => ({ ...prev, occurred_at: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="due_date">Response Due Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="due_date"
                    type="datetime-local"
                    value={formData.due_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="bg-warning-light border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-warning-foreground">Important:</p>
                  <p className="text-warning-foreground/80">
                    For critical security incidents, immediately contact the security team and follow emergency procedures.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title.trim() || !formData.description.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Report Incident
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}