import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText,
  Calendar,
  Users,
  Plus,
  Download
} from "lucide-react";

const frameworks = [
  {
    id: "gdpr",
    name: "GDPR",
    jurisdiction: "EU",
    progress: 95,
    status: "compliant",
    controls: 42,
    completedControls: 40,
    lastAssessment: "2024-01-15",
    nextReview: "2024-04-15",
    requirements: [
      { id: "art-6", title: "Lawful Basis", status: "compliant", dueDate: "Ongoing" },
      { id: "art-17", title: "Right to Erasure", status: "compliant", dueDate: "Ongoing" },
      { id: "art-32", title: "Security Measures", status: "partial", dueDate: "2024-02-28" },
      { id: "art-33", title: "Breach Notification", status: "compliant", dueDate: "Ongoing" }
    ]
  },
  {
    id: "hipaa",
    name: "HIPAA",
    jurisdiction: "US",
    progress: 88,
    status: "partial",
    controls: 38,
    completedControls: 33,
    lastAssessment: "2024-01-10",
    nextReview: "2024-03-10",
    requirements: [
      { id: "164.308", title: "Administrative Safeguards", status: "compliant", dueDate: "Ongoing" },
      { id: "164.310", title: "Physical Safeguards", status: "compliant", dueDate: "Ongoing" },
      { id: "164.312", title: "Technical Safeguards", status: "partial", dueDate: "2024-02-15" },
      { id: "164.314", title: "Organizational Requirements", status: "pending", dueDate: "2024-03-01" }
    ]
  },
  {
    id: "iso27001",
    name: "ISO 27001",
    jurisdiction: "Global",
    progress: 92,
    status: "compliant",
    controls: 114,
    completedControls: 105,
    lastAssessment: "2024-01-20",
    nextReview: "2024-07-20",
    requirements: [
      { id: "A.5", title: "Information Security Policies", status: "compliant", dueDate: "Annual" },
      { id: "A.8", title: "Asset Management", status: "compliant", dueDate: "Ongoing" },
      { id: "A.12", title: "Operations Security", status: "partial", dueDate: "2024-02-20" },
      { id: "A.18", title: "Compliance", status: "compliant", dueDate: "Ongoing" }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'compliant': return 'bg-success-light text-success';
    case 'partial': return 'bg-warning-light text-warning';
    case 'pending': return 'bg-danger-light text-danger';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'compliant': return <CheckCircle className="h-4 w-4" />;
    case 'partial': return <AlertTriangle className="h-4 w-4" />;
    case 'pending': return <Clock className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

const getJurisdictionFlag = (jurisdiction: string) => {
  switch (jurisdiction) {
    case 'US': return '🇺🇸';
    case 'EU': return '🇪🇺';
    case 'UK': return '🇬🇧';
    default: return '🌍';
  }
};

export function ComplianceTracking() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Tracking</h1>
          <p className="text-muted-foreground">
            Monitor compliance across multiple regulatory frameworks
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      {/* Framework Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {frameworks.map((framework) => (
          <Card key={framework.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getJurisdictionFlag(framework.jurisdiction)}</span>
                  <CardTitle className="text-lg">{framework.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(framework.status)}>
                  {getStatusIcon(framework.status)}
                  <span className="ml-1 capitalize">{framework.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Compliance Progress</span>
                  <span className="font-medium">{framework.progress}%</span>
                </div>
                <Progress value={framework.progress} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Controls</p>
                  <p className="font-medium">
                    {framework.completedControls}/{framework.controls}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Next Review</p>
                  <p className="font-medium">{framework.nextReview}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View */}
      <Tabs defaultValue="requirements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-6">
          {frameworks.map((framework) => (
            <Card key={framework.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>{getJurisdictionFlag(framework.jurisdiction)}</span>
                  <span>{framework.name} Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {framework.requirements.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className={getStatusColor(req.status)}>
                          {getStatusIcon(req.status)}
                        </Badge>
                        <div>
                          <p className="font-medium">{req.title}</p>
                          <p className="text-sm text-muted-foreground">{req.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Due: {req.dueDate}</p>
                        <p className="text-xs text-muted-foreground capitalize">{req.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="evidence">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Evidence Repository
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Evidence collection and management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Assessment Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Assessment scheduling and tracking coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Compliance Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Executive reporting and analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}