import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileCheck, Calendar } from "lucide-react";

interface NewAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuditCreated?: () => void;
}

export function NewAuditDialog({ open, onOpenChange, onAuditCreated }: NewAuditDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audit_type: "",
    scope: "",
    objectives: "",
    planned_start_date: "",
    planned_end_date: ""
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

      const objectivesArray = formData.objectives
        .split('\n')
        .map(obj => obj.trim())
        .filter(obj => obj.length > 0);

      const { error } = await supabase
        .from('audits')
        .insert({
          title: formData.title,
          description: formData.description,
          audit_type: formData.audit_type,
          scope: formData.scope,
          objectives: objectivesArray.length > 0 ? objectivesArray : null,
          planned_start_date: formData.planned_start_date || null,
          planned_end_date: formData.planned_end_date || null,
          organization_id: profile.organization_id,
          created_by: profile.id,
          status: 'planned'
        });

      if (error) throw error;

      toast({
        title: "Audit Scheduled Successfully",
        description: `${formData.title} has been added to the audit schedule.`,
      });

      setFormData({
        title: "",
        description: "",
        audit_type: "",
        scope: "",
        objectives: "",
        planned_start_date: "",
        planned_end_date: ""
      });
      
      onAuditCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating audit:', error);
      toast({
        title: "Error Scheduling Audit",
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
            <FileCheck className="h-5 w-5 text-primary" />
            <span>Schedule New Audit</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Audit Title *</Label>
              <Input
                id="title"
                placeholder="e.g., ISO 27001 Internal Audit Q1 2024"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="audit_type">Audit Type</Label>
              <Select 
                value={formData.audit_type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, audit_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internal Audit">Internal Audit</SelectItem>
                  <SelectItem value="External Audit">External Audit</SelectItem>
                  <SelectItem value="Compliance Audit">Compliance Audit</SelectItem>
                  <SelectItem value="Security Audit">Security Audit</SelectItem>
                  <SelectItem value="Financial Audit">Financial Audit</SelectItem>
                  <SelectItem value="Operational Audit">Operational Audit</SelectItem>
                  <SelectItem value="Vendor Audit">Vendor Audit</SelectItem>
                  <SelectItem value="Certification Audit">Certification Audit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Audit Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the audit purpose and context..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="scope">Audit Scope</Label>
              <Textarea
                id="scope"
                placeholder="Define what will be audited - systems, processes, departments, controls, etc..."
                value={formData.scope}
                onChange={(e) => setFormData(prev => ({ ...prev, scope: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="objectives">Audit Objectives (one per line)</Label>
              <Textarea
                id="objectives"
                placeholder={`Verify compliance with ISO 27001 requirements
Assess effectiveness of security controls
Identify areas for improvement
Validate incident response procedures`}
                value={formData.objectives}
                onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="planned_start_date">Planned Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="planned_start_date"
                    type="date"
                    value={formData.planned_start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, planned_start_date: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="planned_end_date">Planned End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="planned_end_date"
                    type="date"
                    value={formData.planned_end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, planned_end_date: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="bg-primary-light border border-primary/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-primary-foreground">Audit Planning:</p>
                  <p className="text-primary-foreground/80">
                    After creating this audit, you can assign auditors, upload documentation, and track progress through the audit lifecycle.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule Audit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}