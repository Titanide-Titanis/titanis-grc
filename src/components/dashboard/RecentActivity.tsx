import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Calendar,
  Shield
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "policy_updated",
    title: "Data Retention Policy updated",
    description: "Updated retention periods for GDPR compliance",
    user: "Sarah Johnson",
    avatar: "SJ",
    timestamp: "2 hours ago",
    status: "updated",
    icon: FileText
  },
  {
    id: 2,
    type: "risk_identified",
    title: "New risk identified",
    description: "Third-party vendor security assessment flagged issues",
    user: "Mike Chen",
    avatar: "MC",
    timestamp: "4 hours ago",
    status: "critical",
    icon: AlertTriangle
  },
  {
    id: 3,
    type: "audit_completed",
    title: "SOX audit completed",
    description: "Q4 financial controls audit passed with no findings",
    user: "Jennifer Davis",
    avatar: "JD",
    timestamp: "6 hours ago",
    status: "success",
    icon: CheckCircle
  },
  {
    id: 4,
    type: "training_assigned",
    title: "Security training assigned",
    description: "Annual cybersecurity awareness training deployed",
    user: "System",
    avatar: "SY",
    timestamp: "8 hours ago",
    status: "info",
    icon: User
  },
  {
    id: 5,
    type: "incident_reported",
    title: "Security incident reported",
    description: "Phishing attempt blocked by email security",
    user: "Alex Rodriguez",
    avatar: "AR",
    timestamp: "1 day ago",
    status: "warning",
    icon: Shield
  },
  {
    id: 6,
    type: "compliance_check",
    title: "HIPAA compliance check",
    description: "Monthly compliance verification completed",
    user: "Compliance Team",
    avatar: "CT",
    timestamp: "1 day ago",
    status: "success",
    icon: Calendar
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'bg-success-light text-success';
    case 'critical': return 'bg-danger-light text-danger';
    case 'warning': return 'bg-warning-light text-warning';
    case 'updated': return 'bg-primary-light text-primary';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'success': return 'Completed';
    case 'critical': return 'Critical';
    case 'warning': return 'Warning';
    case 'updated': return 'Updated';
    default: return 'Info';
  }
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Activity
          <Badge variant="outline">Last 24 hours</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{activity.title}</p>
                    <Badge variant="outline" className={getStatusColor(activity.status)}>
                      {getStatusLabel(activity.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{activity.avatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{activity.user}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}