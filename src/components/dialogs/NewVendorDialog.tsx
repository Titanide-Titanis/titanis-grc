import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building2, Calendar } from "lucide-react";

interface NewVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorCreated?: () => void;
}

export function NewVendorDialog({ open, onOpenChange, onVendorCreated }: NewVendorDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    website: "",
    address: "",
    data_access_level: "",
    services_provided: "",
    contract_start_date: "",
    contract_end_date: "",
    risk_score: 50
  });

  const getRiskLevel = (score: number) => {
    if (score >= 80) return "low";
    if (score >= 60) return "medium";
    return "high";
  };

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

      const servicesArray = formData.services_provided
        .split(',')
        .map(service => service.trim())
        .filter(service => service.length > 0);

      const { error } = await supabase
        .from('vendors')
        .insert({
          name: formData.name,
          description: formData.description,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone || null,
          website: formData.website || null,
          address: formData.address || null,
          data_access_level: formData.data_access_level,
          services_provided: servicesArray.length > 0 ? servicesArray : null,
          contract_start_date: formData.contract_start_date || null,
          contract_end_date: formData.contract_end_date || null,
          risk_score: formData.risk_score,
          risk_level: getRiskLevel(formData.risk_score),
          organization_id: profile.organization_id,
          created_by: profile.id,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Vendor Added Successfully",
        description: `${formData.name} has been added to the vendor registry.`,
      });

      setFormData({
        name: "",
        description: "",
        contact_email: "",
        contact_phone: "",
        website: "",
        address: "",
        data_access_level: "",
        services_provided: "",
        contract_start_date: "",
        contract_end_date: "",
        risk_score: 50
      });
      
      onVendorCreated?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating vendor:', error);
      toast({
        title: "Error Adding Vendor",
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
            <Building2 className="h-5 w-5 text-primary" />
            <span>Add New Vendor</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Vendor Name *</Label>
              <Input
                id="name"
                placeholder="e.g., CloudSecure Corp"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the vendor and their services..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  placeholder="contact@vendor.com"
                  value={formData.contact_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  placeholder="+1 (555) 123-4567"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://vendor.com"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="data_access_level">Data Access Level</Label>
                <Select 
                  value={formData.data_access_level} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, data_access_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Vendor's business address..."
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="services_provided">Services Provided (comma-separated)</Label>
              <Input
                id="services_provided"
                placeholder="e.g., Cloud Hosting, Security Monitoring, Backup Services"
                value={formData.services_provided}
                onChange={(e) => setFormData(prev => ({ ...prev, services_provided: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contract_start_date">Contract Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contract_start_date"
                    type="date"
                    value={formData.contract_start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, contract_start_date: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contract_end_date">Contract End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contract_end_date"
                    type="date"
                    value={formData.contract_end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, contract_end_date: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="risk_score">Initial Risk Score (1-100)</Label>
              <div className="space-y-2">
                <Input
                  id="risk_score"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.risk_score}
                  onChange={(e) => setFormData(prev => ({ ...prev, risk_score: parseInt(e.target.value) || 50 }))}
                />
                <div className="flex items-center justify-between text-sm">
                  <span>Risk Level:</span>
                  <span className={`font-medium ${
                    getRiskLevel(formData.risk_score) === 'high' ? 'text-danger' :
                    getRiskLevel(formData.risk_score) === 'medium' ? 'text-warning' : 'text-success'
                  }`}>
                    {getRiskLevel(formData.risk_score).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.name.trim() || !formData.contact_email.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Vendor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}