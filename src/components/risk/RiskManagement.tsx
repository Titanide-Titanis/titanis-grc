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
  AlertTriangle,
  Clock,
  User,
  BarChart3
} from "lucide-react";

const risks = [
  {
    id: "RISK-001",
    title: "Data Breach - Customer Database",
    category: "Data Security",
    likelihood: "High",
    impact: "Critical",
    riskScore: 9.2,
    status: "open",
    owner: "Security Team",
    dueDate: "2024-02-15",
    description: "Potential unauthorized access to customer personal data"
  },
  {
    id: "RISK-002", 
    title: "Third-Party Vendor Compliance",
    category: "Third-Party Risk",
    likelihood: "Medium",
    impact: "High",
    riskScore: 7.5,
    status: "in-progress",
    owner: "Procurement",
    dueDate: "2024-02-28",
    description: "Vendor may not meet GDPR compliance requirements"
  },
  {
    id: "RISK-003",
    title: "Business Continuity - System Outage",
    category: "Operational Risk",
    likelihood: "Low",
    impact: "Critical",
    riskScore: 6.2,
    status: "mitigated",
    owner: "IT Operations",
    dueDate: "2024-01-30",
    description: "Critical system failure could disrupt business operations"
  }
];

const getRiskColor = (score: number) => {
  if (score >= 8) return "text-danger";
  if (score >= 6) return "text-warning";
  return "text-success";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'bg-danger-light text-danger';
    case 'in-progress': return 'bg-warning-light text-warning';
    case 'mitigated': return 'bg-success-light text-success';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function RiskManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRisks = risks.filter(risk =>
    risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    risk.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk Management</h1>
          <p className="text-muted-foreground">
            Identify, assess, and mitigate organizational risks
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Risk Assessment
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search risks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="register" className="space-y-6">
        <TabsList>
          <TabsTrigger value="register">Risk Register</TabsTrigger>
          <TabsTrigger value="assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="heatmap">Heat Map</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="space-y-4">
          {filteredRisks.map((risk) => (
            <Card key={risk.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className={`h-5 w-5 ${getRiskColor(risk.riskScore)}`} />
                    <div>
                      <CardTitle className="text-lg">{risk.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{risk.id} • {risk.category}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(risk.status)}>
                    {risk.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{risk.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm font-medium">Risk Score</p>
                    <p className={`text-lg font-bold ${getRiskColor(risk.riskScore)}`}>
                      {risk.riskScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Likelihood</p>
                    <p className="text-sm">{risk.likelihood}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Impact</p>
                    <p className="text-sm">{risk.impact}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Owner</p>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <p className="text-sm">{risk.owner}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Due: {risk.dueDate}</span>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Mitigate</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Risk assessment tools and methodologies coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Risk Heat Map</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Interactive risk heat map visualization coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Risk Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Risk trend analysis and reporting coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}