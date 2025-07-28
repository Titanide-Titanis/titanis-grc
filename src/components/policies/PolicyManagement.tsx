import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewPolicyDialog } from "@/components/dialogs/NewPolicyDialog";
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
  const [showNewPolicyDialog, setShowNewPolicyDialog] = useState(false);

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
        <Button onClick={() => setShowNewPolicyDialog(true)}>
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
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Policy Approval Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Active Approvals</h3>
                      <div className="space-y-3">
                        {[
                          { policy: "Third-Party Risk Management", stage: "Legal Review", approver: "Legal Team", days: 3 },
                          { policy: "Remote Work Policy", stage: "HR Approval", approver: "HR Director", days: 7 },
                          { policy: "Incident Response Plan v2.1", stage: "CISO Review", approver: "CISO", days: 2 }
                        ].map((item, i) => (
                          <div key={i} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{item.policy}</p>
                                <p className="text-sm text-muted-foreground">{item.stage}</p>
                              </div>
                              <Badge variant="outline">{item.days}d pending</Badge>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm">Assigned to: {item.approver}</span>
                              <Button variant="outline" size="sm">Remind</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Workflow Templates</h3>
                      <div className="space-y-3">
                        {[
                          { name: "Standard Policy Review", stages: 4, duration: "14 days" },
                          { name: "Emergency Policy Update", stages: 2, duration: "3 days" },
                          { name: "Regulatory Policy Review", stages: 6, duration: "30 days" },
                          { name: "Technical Policy Review", stages: 5, duration: "21 days" }
                        ].map((template, i) => (
                          <div key={i} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{template.name}</p>
                                <p className="text-sm text-muted-foreground">{template.stages} stages • {template.duration}</p>
                              </div>
                              <Button variant="outline" size="sm">Use</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Approval Timeline</h3>
                    <div className="space-y-3">
                      {[
                        { stage: "Draft Creation", status: "completed", date: "2024-01-20", user: "Policy Team" },
                        { stage: "Initial Review", status: "completed", date: "2024-01-22", user: "Department Head" },
                        { stage: "Legal Review", status: "active", date: "2024-01-25", user: "Legal Team" },
                        { stage: "Final Approval", status: "pending", date: "TBD", user: "Executive Team" },
                        { stage: "Publication", status: "pending", date: "TBD", user: "Policy Team" }
                      ].map((stage, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            stage.status === 'completed' ? 'bg-success' : 
                            stage.status === 'active' ? 'bg-warning' : 'bg-muted'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium">{stage.stage}</p>
                            <p className="text-sm text-muted-foreground">{stage.user} • {stage.date}</p>
                          </div>
                          <Badge variant={stage.status === 'completed' ? 'default' : stage.status === 'active' ? 'secondary' : 'outline'}>
                            {stage.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attestations">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Policy Attestations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">89%</div>
                        <p className="text-xs text-muted-foreground">Attestation Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">342</div>
                        <p className="text-xs text-muted-foreground">Total Attestations</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-xs text-muted-foreground">Overdue</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Attestation Campaigns</h3>
                    <div className="space-y-3">
                      {[
                        { campaign: "Q1 2024 Policy Review", policies: 8, completed: 142, total: 160, due: "2024-03-31", status: "active" },
                        { campaign: "Annual Security Training", policies: 3, completed: 87, total: 95, due: "2024-02-29", status: "active" },
                        { campaign: "GDPR Policy Updates", policies: 5, completed: 113, total: 113, due: "2024-01-31", status: "completed" }
                      ].map((campaign, i) => (
                        <div key={i} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-medium">{campaign.campaign}</p>
                              <p className="text-sm text-muted-foreground">{campaign.policies} policies • Due: {campaign.due}</p>
                            </div>
                            <Badge variant={campaign.status === 'completed' ? 'default' : 'secondary'}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{campaign.completed}/{campaign.total}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{width: `${(campaign.completed / campaign.total) * 100}%`}}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Individual Attestations</h3>
                    <div className="space-y-2">
                      {[
                        { user: "John Smith", department: "IT", completed: 8, pending: 2, overdue: 0 },
                        { user: "Sarah Johnson", department: "HR", completed: 6, pending: 1, overdue: 1 },
                        { user: "Mike Chen", department: "Finance", completed: 7, pending: 0, overdue: 0 },
                        { user: "Lisa Davis", department: "Legal", completed: 9, pending: 3, overdue: 2 }
                      ].map((user, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <User className="h-4 w-4" />
                            <div>
                              <p className="font-medium">{user.user}</p>
                              <p className="text-sm text-muted-foreground">{user.department}</p>
                            </div>
                          </div>
                          <div className="flex space-x-4 text-sm">
                            <div className="text-center">
                              <div className="font-medium text-success">{user.completed}</div>
                              <div className="text-muted-foreground">Done</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-warning">{user.pending}</div>
                              <div className="text-muted-foreground">Pending</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-danger">{user.overdue}</div>
                              <div className="text-muted-foreground">Overdue</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Policy Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">28</div>
                        <p className="text-xs text-muted-foreground">Active Policies</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">Due for Review</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">95%</div>
                        <p className="text-xs text-muted-foreground">Compliance Rate</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">4.2</div>
                        <p className="text-xs text-muted-foreground">Avg Review Time (days)</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Policy Categories</h3>
                      <div className="space-y-3">
                        {[
                          { category: "Data Protection", count: 8, percentage: 29 },
                          { category: "Security", count: 6, percentage: 21 },
                          { category: "HR & Employment", count: 5, percentage: 18 },
                          { category: "Risk Management", count: 4, percentage: 14 },
                          { category: "Business Continuity", count: 3, percentage: 11 },
                          { category: "Other", count: 2, percentage: 7 }
                        ].map(item => (
                          <div key={item.category} className="flex items-center justify-between">
                            <span className="text-sm">{item.category}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{width: `${item.percentage}%`}}></div>
                              </div>
                              <span className="text-sm font-medium w-6">{item.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Review Schedule</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Next 30 Days</span>
                            <Badge variant="destructive">5 policies</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Urgent reviews required</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Next 90 Days</span>
                            <Badge variant="secondary">7 policies</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Scheduled for review</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">This Year</span>
                            <Badge variant="outline">16 policies</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Annual review cycle</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <NewPolicyDialog 
        open={showNewPolicyDialog}
        onOpenChange={setShowNewPolicyDialog}
        onPolicyCreated={() => {
          // Refresh policy data when a new policy is created
          console.log('Policy created successfully');
        }}
      />
    </div>
  );
}