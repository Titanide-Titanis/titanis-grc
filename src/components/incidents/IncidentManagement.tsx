import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewIncidentDialog } from "@/components/dialogs/NewIncidentDialog";
import { IncidentWizard } from "@/components/wizards/IncidentWizard";
import { 
  Plus, 
  Search, 
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  FileText,
  Bell
} from "lucide-react";

const incidents = [
  {
    id: "INC-001",
    title: "Unauthorized Access Attempt to Customer Database",
    type: "Security Breach",
    severity: "Critical",
    status: "investigating",
    reporter: "Security Team",
    assignee: "John Smith",
    created: "2024-01-25 09:15",
    updated: "2024-01-25 14:30",
    dueDate: "2024-01-27",
    description: "Multiple failed login attempts detected from suspicious IP addresses targeting customer database",
    affectedSystems: ["Customer DB", "Authentication Service"],
    impactLevel: "High"
  },
  {
    id: "INC-002",
    title: "GDPR Data Subject Request - Data Deletion",
    type: "Privacy Incident",
    severity: "Medium",
    status: "in-progress",
    reporter: "Privacy Team",
    assignee: "Sarah Johnson",
    created: "2024-01-24 11:20",
    updated: "2024-01-25 16:45",
    dueDate: "2024-02-24",
    description: "Customer requested complete data deletion under GDPR Article 17 (Right to Erasure)",
    affectedSystems: ["CRM", "Marketing DB", "Analytics"],
    impactLevel: "Medium"
  },
  {
    id: "INC-003",
    title: "Third-Party Vendor Security Incident",
    type: "Third-Party Risk",
    severity: "High",
    status: "contained",
    reporter: "Vendor Management",
    assignee: "Mike Chen",
    created: "2024-01-23 14:45",
    updated: "2024-01-25 10:15",
    dueDate: "2024-01-30",
    description: "Vendor ABC reported security breach affecting shared services",
    affectedSystems: ["Payment Processing", "Customer Portal"],
    impactLevel: "High"
  },
  {
    id: "INC-004",
    title: "Compliance Documentation Missing",
    type: "Compliance Issue",
    severity: "Low",
    status: "resolved",
    reporter: "Audit Team",
    assignee: "Lisa Davis",
    created: "2024-01-20 16:30",
    updated: "2024-01-22 12:00",
    dueDate: "2024-01-25",
    description: "Missing documentation for quarterly compliance review",
    affectedSystems: ["Document Management"],
    impactLevel: "Low"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'investigating': return 'bg-danger-light text-danger';
    case 'in-progress': return 'bg-warning-light text-warning';
    case 'contained': return 'bg-primary-light text-primary';
    case 'resolved': return 'bg-success-light text-success';
    case 'closed': return 'bg-muted text-muted-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'investigating': return <AlertTriangle className="h-4 w-4" />;
    case 'in-progress': return <Clock className="h-4 w-4" />;
    case 'contained': return <CheckCircle className="h-4 w-4" />;
    case 'resolved': return <CheckCircle className="h-4 w-4" />;
    case 'closed': return <XCircle className="h-4 w-4" />;
    default: return <AlertTriangle className="h-4 w-4" />;
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'bg-danger text-danger-foreground';
    case 'High': return 'bg-warning text-warning-foreground';
    case 'Medium': return 'bg-primary text-primary-foreground';
    case 'Low': return 'bg-success text-success-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function IncidentManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showIncidentWizard, setShowIncidentWizard] = useState(false);

  const filteredIncidents = incidents.filter(incident =>
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incident Management</h1>
          <p className="text-muted-foreground">
            Track and manage security, privacy, and compliance incidents
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
          <Button onClick={() => setShowIncidentWizard(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Report Incident
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
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
      <Tabs defaultValue="incidents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="incidents">Active Incidents</TabsTrigger>
          <TabsTrigger value="workflow">Response Workflow</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents" className="space-y-4">
          {filteredIncidents.map((incident) => (
            <Card key={incident.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <AlertTriangle className="h-6 w-6 text-danger" />
                    <div>
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {incident.id} • {incident.type} • Created: {incident.created}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {getStatusIcon(incident.status)}
                      <span className="ml-1 capitalize">{incident.status.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{incident.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Reporter</p>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <p className="text-sm">{incident.reporter}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Assignee</p>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <p className="text-sm">{incident.assignee}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Due Date</p>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <p className="text-sm">{incident.dueDate}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Impact Level</p>
                    <p className="text-sm">{incident.impactLevel}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Affected Systems</p>
                  <div className="flex flex-wrap gap-1">
                    {incident.affectedSystems.map((system) => (
                      <Badge key={system} variant="outline" className="text-xs">
                        {system}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Last updated: {incident.updated}
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Update</Button>
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
                <CardTitle>Incident Response Workflow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Response Templates</h3>
                      <div className="space-y-3">
                        {[
                          { name: "Security Breach Response", severity: "Critical", sla: "1 hour", steps: 8 },
                          { name: "Privacy Incident Response", severity: "High", sla: "4 hours", steps: 6 },
                          { name: "Compliance Issue Response", severity: "Medium", sla: "24 hours", steps: 5 },
                          { name: "Third-Party Risk Response", severity: "High", sla: "2 hours", steps: 7 }
                        ].map((template, i) => (
                          <div key={i} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{template.name}</p>
                                <p className="text-sm text-muted-foreground">{template.steps} steps • SLA: {template.sla}</p>
                              </div>
                              <Badge className={getSeverityColor(template.severity)}>
                                {template.severity}
                              </Badge>
                            </div>
                            <Button variant="outline" size="sm" className="mt-2">Use Template</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Escalation Matrix</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Critical Incidents</span>
                            <Badge className="bg-danger text-danger-foreground">0-1 hour</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">CISO → CEO → Board</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">High Priority</span>
                            <Badge className="bg-warning text-warning-foreground">2-4 hours</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Security Team → CISO</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Medium Priority</span>
                            <Badge className="bg-primary text-primary-foreground">1-2 days</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Team Lead → Department Head</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Communication Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium">Internal Notifications</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Security Team</li>
                          <li>• Legal Department</li>
                          <li>• Executive Team</li>
                          <li>• IT Operations</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium">External Contacts</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Regulatory Bodies</li>
                          <li>• Law Enforcement</li>
                          <li>• External Counsel</li>
                          <li>• Forensics Team</li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium">Customer Communication</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Affected Customers</li>
                          <li>• Public Relations</li>
                          <li>• Customer Support</li>
                          <li>• Media Relations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">Total Incidents (YTD)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Active Incidents</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">2.4h</div>
                  <p className="text-xs text-muted-foreground">Avg Response Time</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">94%</div>
                  <p className="text-xs text-muted-foreground">SLA Compliance</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Incident Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Incidents by Type</h3>
                      <div className="space-y-2">
                        {[
                          { type: "Security Breach", count: 8, percentage: 35 },
                          { type: "Privacy Incident", count: 6, percentage: 26 },
                          { type: "Third-Party Risk", count: 5, percentage: 22 },
                          { type: "Compliance Issue", count: 4, percentage: 17 }
                        ].map(item => (
                          <div key={item.type} className="flex items-center justify-between">
                            <span className="text-sm">{item.type}</span>
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
                      <h3 className="font-semibold mb-3">Resolution Times</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Critical</span>
                            <span className="text-sm">Avg: 4.2 hours</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Target: 4 hours</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">High</span>
                            <span className="text-sm">Avg: 1.8 days</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Target: 2 days</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Medium</span>
                            <span className="text-sm">Avg: 4.5 days</span>
                          </div>
                          <div className="text-sm text-muted-foreground">Target: 5 days</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Incident Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { title: "Monthly Incident Summary - January 2024", date: "2024-02-01", type: "Summary", status: "Final" },
                      { title: "Security Breach Investigation Report - INC-001", date: "2024-01-26", type: "Investigation", status: "Draft" },
                      { title: "Quarterly Incident Trends Analysis", date: "2024-01-15", type: "Analysis", status: "Final" },
                      { title: "Regulatory Notification - GDPR Breach", date: "2024-01-25", type: "Regulatory", status: "Submitted" }
                    ].map((report, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{report.title}</p>
                            <p className="text-sm text-muted-foreground">{report.type} • {report.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={report.status === 'Final' ? 'default' : 'secondary'}>
                            {report.status}
                          </Badge>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <IncidentWizard 
        open={showIncidentWizard} 
        onOpenChange={setShowIncidentWizard}
        onIncidentCreated={() => {
          // Refresh incident list or update state
          setShowIncidentWizard(false);
        }}
      />
    </div>
  );
}