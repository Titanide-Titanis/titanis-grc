import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Shield,
  FileText,
  Users
} from "lucide-react";

const metrics = [
  {
    title: "Risk Score",
    value: "7.2",
    change: "-0.3",
    trend: "down",
    status: "warning",
    icon: AlertTriangle,
    description: "Average organizational risk score"
  },
  {
    title: "Compliance Rate",
    value: "94%",
    change: "+2%",
    trend: "up",
    status: "success",
    icon: CheckCircle,
    description: "Overall compliance across all frameworks"
  },
  {
    title: "Open Risks",
    value: "23",
    change: "-5",
    trend: "down",
    status: "warning",
    icon: Shield,
    description: "Risks requiring immediate attention"
  },
  {
    title: "Active Policies",
    value: "147",
    change: "+3",
    trend: "up",
    status: "primary",
    icon: FileText,
    description: "Currently active policies"
  },
  {
    title: "Overdue Actions",
    value: "8",
    change: "+2",
    trend: "up",
    status: "danger",
    icon: Clock,
    description: "Tasks past due date"
  },
  {
    title: "Team Members",
    value: "156",
    change: "+12",
    trend: "up",
    status: "primary",
    icon: Users,
    description: "Active team members"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'text-success';
    case 'warning': return 'text-warning';
    case 'danger': return 'text-danger';
    default: return 'text-primary';
  }
};

const getStatusBg = (status: string) => {
  switch (status) {
    case 'success': return 'bg-success-light';
    case 'warning': return 'bg-warning-light';
    case 'danger': return 'bg-danger-light';
    default: return 'bg-primary-light';
  }
};

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <Card key={metric.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${getStatusBg(metric.status)}`}>
                <Icon className={`h-4 w-4 ${getStatusColor(metric.status)}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.description}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendIcon 
                    className={`h-4 w-4 ${
                      metric.trend === 'up' ? 'text-success' : 'text-danger'
                    }`} 
                  />
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-success' : 'text-danger'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}