import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FileText, Calendar } from "lucide-react";

interface NewPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPolicyCreated?: () => void;
}

export function NewPolicyDialog({ open, onOpenChange, onPolicyCreated }: NewPolicyDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    policy_type: "",
    effective_date: "",
    review_date: "",
    tags: ""
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

      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { error } = await supabase
        .from('policies')
        .insert({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          policy_type: formData.policy_type,
          effective_date: formData.effective_date || null,
          review_date: formData.review_date || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          organization_id: profile.organization_id,
          created_by: profile.id,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Policy Created Successfully",
        description: `${formData.title} has been added to the policy library.`,
      });

      setFormData({
        title: "",
        description: "",
        content: "",
        policy_type: "",
        effective_date: "",
        review_date: "",
        tags: ""
      });
      
      onPolicyCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating policy:', error);
      toast({
        title: "Error Creating Policy",
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
            <FileText className="h-5 w-5 text-primary" />
            <span>New Policy</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Policy Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Data Protection and Privacy Policy"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policy_type">Policy Type</Label>
                <Select 
                  value={formData.policy_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, policy_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Data Protection">Data Protection</SelectItem>
                    <SelectItem value="Risk Management">Risk Management</SelectItem>
                    <SelectItem value="Business Continuity">Business Continuity</SelectItem>
                    <SelectItem value="HR">Human Resources</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., GDPR, Security, Mandatory"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Policy Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the policy's purpose and scope..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content">Policy Content</Label>
              <Textarea
                id="content"
                placeholder="Enter the full policy content, procedures, and requirements..."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="effective_date">Effective Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="effective_date"
                    type="date"
                    value={formData.effective_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, effective_date: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="review_date">Next Review Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="review_date"
                    type="date"
                    value={formData.review_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, review_date: e.target.value }))}
                    className="pl-10"
                  />
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
              Create Policy
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}