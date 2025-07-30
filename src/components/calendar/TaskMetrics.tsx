import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, Calendar, TrendingUp, TrendingDown } from "lucide-react";

interface TaskMetricsProps {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
  detailed?: boolean;
}

export function TaskMetrics({ 
  totalTasks, 
  completedTasks, 
  overdueTasks, 
  upcomingTasks,
  detailed = false 
}: TaskMetricsProps) {
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const overdueRate = totalTasks > 0 ? (overdueTasks / totalTasks) * 100 : 0;
  const pendingTasks = totalTasks - completedTasks - overdueTasks;

  const metrics = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
      percentage: completionRate,
    },
    {
      title: "Upcoming",
      value: upcomingTasks,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Overdue",
      value: overdueTasks,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      percentage: overdueRate,
    },
  ];

  if (!detailed) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    {metric.percentage !== undefined && (
                      <p className="text-xs text-muted-foreground">
                        {metric.percentage.toFixed(1)}% of total
                      </p>
                    )}
                  </div>
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Task Analytics
        </CardTitle>
        <CardDescription>
          Detailed metrics and performance indicators for compliance tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Completion Rate</span>
            <Badge variant="secondary">
              {completionRate.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={completionRate} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedTasks} completed</span>
            <span>{totalTasks} total tasks</span>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div 
                key={metric.title}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{metric.title}</p>
                  <p className="text-lg font-bold">{metric.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Performance Indicators */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Performance Indicators</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm">On-time Completion</span>
              </div>
              <Badge variant="outline">
                {totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0}%
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-destructive" />
                <span className="text-sm">Overdue Rate</span>
              </div>
              <Badge variant="outline">
                {overdueRate.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Task Distribution</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                Completed
              </span>
              <span>{completedTasks}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                Pending
              </span>
              <span>{pendingTasks}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                Overdue
              </span>
              <span>{overdueTasks}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}