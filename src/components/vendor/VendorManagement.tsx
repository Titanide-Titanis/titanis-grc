import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  FileText,
  Users,
  TrendingUp,
  Calendar
} from "lucide-react";

// Mock vendor data - will be replaced with database integration
const vendors = [
  {
    id: "1",
    name: "CloudSecure Corp",
    description: "Cloud infrastructure and security services",
    contact_email: "contact@cloudsecure.com",
    contact_phone: "+1 (555) 123-4567",
    website: "https://cloudsecure.com",
    risk_score: 85,
    risk_level: "low" as const,
    status: "active",
    contract_start_date: "2024-01-15",
    contract_end_date: "2025-01-14",
    services_provided: ["Cloud Hosting", "Security Monitoring", "Backup Services"],
    data_access_level: "High",
    last_assessment_date: "2024-12-01",
    next_assessment_date: "2025-03-01",
    onboarding_status: "Complete",
    compliance_frameworks: ["SOC 2", "ISO 27001"],
    documents_count: 12,
    findings_count: 2
  },
  {
    id: "2",
    name: "DataFlow Analytics",
    description: "Business intelligence and data analytics platform",
    contact_email: "partnerships@dataflow.com",
    contact_phone: "+1 (555) 987-6543",
    website: "https://dataflow.com",
    risk_score: 72,
    risk_level: "medium" as const,
    status: "active",
    contract_start_date: "2024-03-01",
    contract_end_date: "2025-02-28",
    services_provided: ["Data Analytics", "Reporting", "Business Intelligence"],
    data_access_level: "Medium",
    last_assessment_date: "2024-10-15",
    next_assessment_date: "2025-01-15",
    onboarding_status: "In Progress",
    compliance_frameworks: ["GDPR", "HIPAA"],
    documents_count: 8,
    findings_count: 5
  },
  {
    id: "3",
    name: "SecureComms Inc",
    description: "Enterprise communication and collaboration tools",
    contact_email: "enterprise@securecomms.com",
    contact_phone: "+1 (555) 456-7890",
    website: "https://securecomms.com",
    risk_score: 58,
    risk_level: "high" as const,
    status: "review_required",
    contract_start_date: "2023-06-01",
    contract_end_date: "2024-05-31",
    services_provided: ["Video Conferencing", "Messaging", "File Sharing"],
    data_access_level: "High",
    last_assessment_date: "2024-05-01",
    next_assessment_date: "2024-11-01",
    onboarding_status: "Pending Review",
    compliance_frameworks: ["SOC 2"],
    documents_count: 15,
    findings_count: 8
  }
];

const getRiskColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-danger";
};

const getRiskBadgeColor = (level: string) => {
  switch (level) {
    case 'low': return "bg-success text-success-foreground";
    case 'medium': return "bg-warning text-warning-foreground";
    case 'high': return "bg-danger text-danger-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return "bg-success text-success-foreground";
    case 'inactive': return "bg-muted text-muted-foreground";
    case 'review_required': return "bg-warning text-warning-foreground";
    case 'suspended': return "bg-danger text-danger-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

export function VendorManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Risk Management</h1>
          <p className="text-muted-foreground">
            Manage third-party relationships, assess vendor risks, and ensure compliance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vendor Overview</TabsTrigger>
          <TabsTrigger value="assessments">Risk Assessments</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{vendors.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-danger" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-danger">
                  {vendors.filter(v => v.risk_level === 'high').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Contracts</CardTitle>
                <Calendar className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">1</div>
                <p className="text-xs text-muted-foreground">
                  Next 90 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">72</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last quarter
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Vendors List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>{vendor.name}</span>
                        <Badge className={getStatusColor(vendor.status)}>
                          {vendor.status.replace('_', ' ')}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {vendor.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Assess Risk
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Risk Assessment */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Risk Assessment</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Risk Score</span>
                          <span className={`font-medium ${getRiskColor(vendor.risk_score)}`}>
                            {vendor.risk_score}/100
                          </span>
                        </div>
                        <Progress value={vendor.risk_score} className="h-2" />
                        <Badge className={getRiskBadgeColor(vendor.risk_level)}>
                          {vendor.risk_level.toUpperCase()} RISK
                        </Badge>
                      </div>
                    </div>

                    {/* Contract Information */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Contract Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Start Date:</span>
                          <span>{new Date(vendor.contract_start_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">End Date:</span>
                          <span>{new Date(vendor.contract_end_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Data Access:</span>
                          <span>{vendor.data_access_level}</span>
                        </div>
                      </div>
                    </div>

                    {/* Services & Compliance */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Services & Compliance</h4>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {vendor.services_provided.slice(0, 2).map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {vendor.services_provided.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{vendor.services_provided.length - 2} more
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {vendor.compliance_frameworks.map((framework) => (
                            <Badge key={framework} variant="secondary" className="text-xs">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{vendor.documents_count} documents</span>
                          <span>{vendor.findings_count} findings</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-6">
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Risk Assessment Module</h3>
            <p className="text-muted-foreground">
              Comprehensive vendor risk assessment workflows and scoring matrices coming soon.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Vendor Onboarding</h3>
            <p className="text-muted-foreground">
              Automated vendor onboarding workflows and due diligence processes coming soon.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">Vendor Analytics</h3>
            <p className="text-muted-foreground">
              Advanced analytics and reporting for vendor risk management coming soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}