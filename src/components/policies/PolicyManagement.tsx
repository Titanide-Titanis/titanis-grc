import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter,
  FileText,
  Clock,
  User,
  Calendar,
  Edit,
  Eye,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const policies = [
  {
    id: "POL-001",
    title: "Data Protection and Privacy Policy",
    version: "3.2",
    status: "active",
    owner: "Legal Team",
    approver: "Chief Privacy Officer",
    effectiveDate: "2024-01-01",
    reviewDate: "2024-07-01",
    nextReview: "2024-12-31",
    category: "Data Protection",
    frameworks: ["GDPR", "CCPA", "UK DPA"],
    attestations: 142,
    description: "Comprehensive policy covering data collection, processing, and protection requirements"
  },
  {
    id: "POL-002",
    title: "Information Security Policy",
    version: "2.1", 
    status: "active",
    owner: "Security Team",
    approver: "CISO",
    effectiveDate: "2024-01-15",
    reviewDate: "2024-01-15",
    nextReview: "2025-01-15",
    category: "Security",
    frameworks: ["ISO 27001", "NIST CSF"],
    attestations: 98,
    description: "Establishes security controls and procedures for information assets"
  },
  {
    id: "POL-003",
    title: "Third-Party Risk Management",
    version: "1.0",
    status: "draft",
    owner: "Risk Team",
    approver: "CRO",
    effectiveDate: "2024-03-01",
    reviewDate: null,
    nextReview: "2024-09-01",
    category: "Risk Management",
    frameworks: ["SOC 2", "ISO 27001"],
    attestations: 0,
    description: "Framework for assessing and managing third-party vendor risks"
  },
  {
    id: "POL-004",
    title: "Business Continuity Plan",
    version: "4.0",
    status: "review",
    owner: "Operations",
    approver: "COO", 
    effectiveDate: "2023-06-01",
    reviewDate: "2024-01-20",
    nextReview: "2024-06-01",
    category: "Business Continuity",
    frameworks: ["ISO 22301"],
    attestations: 67,
    description: "Procedures for maintaining business operations during disruptions"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-success-light text-success';
    case 'draft': return 'bg-warning-light text-warning';
    case 'review': return 'bg-primary-light text-primary';
    case 'expired': return 'bg-danger-light text-danger';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <CheckCircle className="h-4 w-4" />;
    case 'review': return <AlertTriangle className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

export function PolicyManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || policy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(policies.map(p => p.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy Management</h1>
          <p className="text-muted-foreground">
            Manage organizational policies and procedures
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Policy
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "All" : category}
            </Button>
          ))}
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="policies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="policies">Policy Library</TabsTrigger>
          <TabsTrigger value="workflow">Approval Workflow</TabsTrigger>
          <TabsTrigger value="attestations">Attestations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          {filteredPolicies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{policy.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {policy.id} • Version {policy.version} • {policy.category}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(policy.status)}>
                    {getStatusIcon(policy.status)}
                    <span className="ml-1 capitalize">{policy.status}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{policy.description}</p>
                
                {/* Frameworks */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {policy.frameworks.map((framework) => (
                    <Badge key={framework} variant="outline">
                      {framework}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Owner</p>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <p className="text-sm">{policy.owner}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Effective Date</p>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <p className="text-sm">{policy.effectiveDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Next Review</p>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <p className="text-sm">{policy.nextReview}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Attestations</p>
                    <p className="text-sm font-bold">{policy.attestations}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <span>Approved by: {policy.approver}</span>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Policy Approval Workflow</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Policy approval workflow management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attestations">
          <Card>
            <CardHeader>
              <CardTitle>Policy Attestations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Policy attestation tracking and reporting coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Policy Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Policy lifecycle analytics and insights coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}