import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { NewAuditDialog } from "@/components/dialogs/NewAuditDialog";
import { AuditWizard } from "@/components/wizards/AuditWizard";
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  FileText,
  Download,
  Settings
} from "lucide-react";

const audits = [
  {
    id: "AUD-001",
    title: "SOC 2 Type II Audit",
    type: "External",
    status: "in-progress",
    auditor: "External Firm ABC",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    progress: 65,
    findings: 3,
    controls: 45,
    completedControls: 29,
    priority: "high",
    frameworks: ["SOC 2"]
  },
  {
    id: "AUD-002",
    title: "GDPR Compliance Audit",
    type: "Internal",
    status: "planning",
    auditor: "Internal Audit Team",
    startDate: "2024-02-01",
    endDate: "2024-04-01",
    progress: 15,
    findings: 0,
    controls: 32,
    completedControls: 5,
    priority: "medium",
    frameworks: ["GDPR"]
  },
  {
    id: "AUD-003",
    title: "ISO 27001 Surveillance Audit",
    type: "External",
    status: "completed",
    auditor: "Certification Body XYZ",
    startDate: "2023-11-01",
    endDate: "2023-12-15",
    progress: 100,
    findings: 2,
    controls: 114,
    completedControls: 114,
    priority: "high",
    frameworks: ["ISO 27001"]
  },
  {
    id: "AUD-004",
    title: "IT General Controls Review",
    type: "Internal",
    status: "scheduled",
    auditor: "IT Audit Team",
    startDate: "2024-03-01",
    endDate: "2024-05-01",
    progress: 0,
    findings: 0,
    controls: 28,
    completedControls: 0,
    priority: "medium",
    frameworks: ["COBIT"]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-success-light text-success';
    case 'in-progress': return 'bg-primary-light text-primary';
    case 'planning': return 'bg-warning-light text-warning';
    case 'scheduled': return 'bg-muted text-muted-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4" />;
    case 'in-progress': return <Clock className="h-4 w-4" />;
    case 'planning': return <Settings className="h-4 w-4" />;
    case 'scheduled': return <Calendar className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-danger-light text-danger';
    case 'medium': return 'bg-warning-light text-warning';
    case 'low': return 'bg-success-light text-success';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function AuditManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAuditWizard, setShowAuditWizard] = useState(false);

  const filteredAudits = audits.filter(audit =>
    audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audit.auditor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Management</h1>
          <p className="text-muted-foreground">
            Plan, execute, and track internal and external audits
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Schedule
          </Button>
          <Button onClick={() => setShowAuditWizard(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Audit
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audits..."
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
      <Tabs defaultValue="audits" className="space-y-6">
        <TabsList>
          <TabsTrigger value="audits">Audit Schedule</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="controls">Control Testing</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="audits" className="space-y-4">
          {filteredAudits.map((audit) => (
            <Card key={audit.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{audit.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {audit.id} • {audit.type} Audit • {audit.frameworks.join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(audit.priority)}>
                      {audit.priority} priority
                    </Badge>
                    <Badge className={getStatusColor(audit.status)}>
                      {getStatusIcon(audit.status)}
                      <span className="ml-1 capitalize">{audit.status.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Auditor</p>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <p className="text-sm">{audit.auditor}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm">{audit.startDate} - {audit.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Controls</p>
                      <p className="text-sm">{audit.completedControls}/{audit.controls}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Findings</p>
                      <div className="flex items-center space-x-1">
                        {audit.findings > 0 && <AlertTriangle className="h-3 w-3 text-warning" />}
                        <p className="text-sm">{audit.findings}</p>
                      </div>
                    </div>
                  </div>
                  
                  {audit.status !== 'scheduled' && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-medium">{audit.progress}%</span>
                      </div>
                      <Progress value={audit.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Last updated: {new Date().toLocaleDateString()}
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="findings">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Audit Findings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-danger">8</div>
                        <p className="text-xs text-muted-foreground">High Priority</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-warning">12</div>
                        <p className="text-xs text-muted-foreground">Medium Priority</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-success">5</div>
                        <p className="text-xs text-muted-foreground">Low Priority</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { id: "F-001", title: "Insufficient Access Review Process", severity: "High", audit: "SOC 2 Type II", status: "Open", dueDate: "2024-02-15" },
                      { id: "F-002", title: "Missing Data Retention Policy", severity: "Medium", audit: "GDPR Compliance", status: "In Progress", dueDate: "2024-02-28" },
                      { id: "F-003", title: "Backup Testing Documentation", severity: "Low", audit: "ISO 27001", status: "Resolved", dueDate: "2024-01-30" }
                    ].map((finding, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <AlertTriangle className={`h-4 w-4 ${
                            finding.severity === 'High' ? 'text-danger' :
                            finding.severity === 'Medium' ? 'text-warning' : 'text-success'
                          }`} />
                          <div>
                            <p className="font-medium">{finding.title}</p>
                            <p className="text-sm text-muted-foreground">{finding.id} • {finding.audit}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Badge variant={finding.severity === 'High' ? 'destructive' : finding.severity === 'Medium' ? 'secondary' : 'outline'}>
                              {finding.severity}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">Due: {finding.dueDate}</p>
                          </div>
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

        <TabsContent value="controls">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Control Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Testing Status</h3>
                      <div className="space-y-3">
                        {[
                          { framework: "SOC 2", tested: 29, total: 45, percentage: 64 },
                          { framework: "GDPR", tested: 5, total: 32, percentage: 16 },
                          { framework: "ISO 27001", tested: 114, total: 114, percentage: 100 }
                        ].map((item, i) => (
                          <div key={i} className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">{item.framework}</span>
                              <span className="text-sm">{item.tested}/{item.total}</span>
                            </div>
                            <Progress value={item.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Control Effectiveness</h3>
                      <div className="space-y-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Effective</span>
                            <Badge className="bg-success-light text-success">148</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Controls operating effectively</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Deficient</span>
                            <Badge className="bg-warning-light text-warning">8</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Controls with identified gaps</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Not Tested</span>
                            <Badge variant="outline">35</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Pending testing</p>
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
                  Audit Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { title: "SOC 2 Type II Report - Q4 2023", date: "2024-01-15", status: "Final", size: "2.4 MB" },
                      { title: "ISO 27001 Surveillance Audit Report", date: "2023-12-20", status: "Final", size: "1.8 MB" },
                      { title: "GDPR Compliance Assessment - Draft", date: "2024-01-25", status: "Draft", size: "986 KB" },
                      { title: "Internal IT Controls Review", date: "2024-01-10", status: "In Review", size: "1.2 MB" }
                    ].map((report, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{report.title}</p>
                            <p className="text-sm text-muted-foreground">{report.date} • {report.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={report.status === 'Final' ? 'default' : 'secondary'}>
                            {report.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
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

      <AuditWizard 
        open={showAuditWizard} 
        onOpenChange={setShowAuditWizard}
        onAuditCreated={() => {
          // Refresh audit list or update state
          setShowAuditWizard(false);
        }}
      />
    </div>
  );
}