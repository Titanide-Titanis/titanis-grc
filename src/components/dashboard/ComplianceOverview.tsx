import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";

const complianceFrameworks = [
  { 
    name: "GDPR", 
    progress: 95, 
    status: "compliant", 
    controls: 42, 
    issues: 2,
    jurisdiction: "EU"
  },
  { 
    name: "HIPAA", 
    progress: 88, 
    status: "partial", 
    controls: 38, 
    issues: 5,
    jurisdiction: "US"
  },
  { 
    name: "ISO 27001", 
    progress: 92, 
    status: "compliant", 
    controls: 114, 
    issues: 3,
    jurisdiction: "Global"
  },
  { 
    name: "SOX", 
    progress: 78, 
    status: "partial", 
    controls: 28, 
    issues: 8,
    jurisdiction: "US"
  },
  { 
    name: "UK DPA", 
    progress: 90, 
    status: "compliant", 
    controls: 35, 
    issues: 4,
    jurisdiction: "UK"
  },
  { 
    name: "NIST CSF", 
    progress: 85, 
    status: "partial", 
    controls: 108, 
    issues: 12,
    jurisdiction: "US"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'compliant': return <CheckCircle className="h-4 w-4 text-success" />;
    case 'partial': return <AlertTriangle className="h-4 w-4 text-warning" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'compliant': return 'bg-success-light text-success';
    case 'partial': return 'bg-warning-light text-warning';
    default: return 'bg-muted text-muted-foreground';
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

export function ComplianceOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Compliance Frameworks
          <Badge variant="outline">{complianceFrameworks.length} Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {complianceFrameworks.map((framework) => (
            <div key={framework.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm">{getJurisdictionFlag(framework.jurisdiction)}</span>
                  <div>
                    <div className="font-medium">{framework.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {framework.controls} controls • {framework.issues} issues
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getStatusColor(framework.status)}>
                    {getStatusIcon(framework.status)}
                    <span className="ml-1 capitalize">{framework.status}</span>
                  </Badge>
                  <span className="text-sm font-medium">{framework.progress}%</span>
                </div>
              </div>
              <Progress value={framework.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}