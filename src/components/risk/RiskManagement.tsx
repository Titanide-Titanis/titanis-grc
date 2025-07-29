import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewRiskDialog } from "@/components/dialogs/NewRiskDialog";
import { RiskWizard } from "@/components/risk/RiskWizard";
import { RiskWizard } from "@/components/risk/RiskWizard";
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
  const [showNewRiskDialog, setShowNewRiskDialog] = useState(false);
  const [showRiskWizard, setShowRiskWizard] = useState(false);
  const [showRiskWizard, setShowRiskWizard] = useState(false);

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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowNewRiskDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
          <Button onClick={() => setShowRiskWizard(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Risk Assessment Wizard
          </Button>
        </div>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment Framework</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Assessment Methodologies</h3>
                    <div className="space-y-2">
                      {["Qualitative Assessment", "Quantitative Analysis", "Scenario-Based Assessment", "Threat Modeling"].map((method) => (
                        <div key={method} className="flex items-center justify-between p-3 border rounded-lg">
                          <span>{method}</span>
                          <Button variant="outline" size="sm">Use Template</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Risk Scoring Matrix</h3>
                    <div className="grid grid-cols-6 gap-1 text-xs">
                      <div></div>
                      <div className="text-center font-medium">1</div>
                      <div className="text-center font-medium">2</div>
                      <div className="text-center font-medium">3</div>
                      <div className="text-center font-medium">4</div>
                      <div className="text-center font-medium">5</div>
                      {[5,4,3,2,1].map(impact => (
                        <>
                          <div key={impact} className="text-center font-medium">{impact}</div>
                          {[1,2,3,4,5].map(likelihood => {
                            const score = impact * likelihood;
                            const color = score >= 15 ? "bg-danger text-danger-foreground" : 
                                         score >= 8 ? "bg-warning text-warning-foreground" : 
                                         "bg-success text-success-foreground";
                            return <div key={likelihood} className={`${color} text-center p-1 rounded text-xs`}>{score}</div>
                          })}
                        </>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Heat Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Current Risk Landscape</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Filter by Category</Button>
                      <Button variant="outline" size="sm">Export</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    <div></div>
                    <div className="text-center text-sm font-medium">Very Low</div>
                    <div className="text-center text-sm font-medium">Low</div>
                    <div className="text-center text-sm font-medium">Medium</div>
                    <div className="text-center text-sm font-medium">High</div>
                    <div className="text-center text-sm font-medium">Very High</div>
                    
                    {["Critical", "High", "Medium", "Low", "Very Low"].map((impact, i) => (
                      <>
                        <div key={impact} className="text-sm font-medium text-right">{impact}</div>
                        {[1,2,3,4,5].map((likelihood, j) => {
                          const riskCount = Math.floor(Math.random() * 5) + 1;
                          const intensity = (5-i) * likelihood;
                          const bgColor = intensity >= 15 ? "bg-danger/80 hover:bg-danger" : 
                                         intensity >= 8 ? "bg-warning/80 hover:bg-warning" : 
                                         "bg-success/80 hover:bg-success";
                          return (
                            <div key={j} className={`${bgColor} p-4 rounded cursor-pointer transition-colors flex items-center justify-center text-white font-medium`}>
                              {riskCount}
                            </div>
                          );
                        })}
                      </>
                    ))}
                  </div>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-success rounded"></div>
                      <span>Low Risk</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-warning rounded"></div>
                      <span>Medium Risk</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-danger rounded"></div>
                      <span>High Risk</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">23</div>
                    <div className="ml-auto">
                      <AlertTriangle className="h-4 w-4 text-danger" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">High Risk Issues</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">7.8</div>
                    <div className="ml-auto">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Average Risk Score</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">15</div>
                    <div className="ml-auto">
                      <Clock className="h-4 w-4 text-warning" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Overdue Mitigations</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold">89%</div>
                    <div className="ml-auto">
                      <User className="h-4 w-4 text-success" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Mitigation Rate</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Risk Trends & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Risk by Category</h3>
                    <div className="space-y-2">
                      {[
                        { category: "Data Security", count: 12, percentage: 35 },
                        { category: "Operational Risk", count: 8, percentage: 24 },
                        { category: "Third-Party Risk", count: 7, percentage: 21 },
                        { category: "Compliance Risk", count: 7, percentage: 20 }
                      ].map(item => (
                        <div key={item.category} className="flex items-center justify-between">
                          <span className="text-sm">{item.category}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{width: `${item.percentage}%`}}></div>
                            </div>
                            <span className="text-sm font-medium w-8">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Monthly Risk Assessment</h3>
                    <div className="text-sm text-muted-foreground">
                      Risk assessment trends and mitigation progress tracking with detailed reporting capabilities.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <NewRiskDialog 
        open={showNewRiskDialog}
        onOpenChange={setShowNewRiskDialog}
        onRiskCreated={() => {
          // Refresh risk data when a new risk is created
          console.log('Risk created successfully');
        }}
      />
    </div>
  );
}